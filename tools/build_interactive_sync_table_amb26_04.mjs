import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const jsonPath = path.join(ROOT, 'episodios', 'AMB26-04', 'TABLA_SINCRONIZACION_DATOS.json');

const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

const rows = data.rows;
const meta = data.meta;

// Generar filas enriquecidas para el HTML interactivo
const rowsHtml = rows.map((r) => {
  const rowId = r.row < 10 ? '0' + r.row : '' + r.row;
  const isDiff = !!r.diferencias_detectadas;
  const diffBadge = isDiff 
    ? `<span style="background:#FEE2E2; color:#DC2626; font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px; text-transform:uppercase; border:1px solid #FCA5A5;">Discrepancia</span>`
    : `<span style="background:#ECFDF5; color:#059669; font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px; text-transform:uppercase; border:1px solid #A7F3D0;">100% Coincidente</span>`;

  // Diálogos formateados con resaltado de diferencias
  let escHtml = r.dialogo_escaleta;
  let realHtml = r.dialogo_real;
  let diffDetailBox = '';
  if (isDiff && r.diferencias_detalle) {
    if (typeof r.diferencias_detalle === 'string') {
      diffDetailBox = `<div style="margin-top:6px; font-size:11px; color:#DC2626; background:#FEF2F2; padding:4px 8px; border-radius:4px; border:1px solid #FECACA;"><strong>Nota de discrepancia:</strong> ${r.diferencias_detalle}</div>`;
    } else if (Array.isArray(r.diferencias_detalle)) {
      r.diferencias_detalle.forEach(d => {
        if (d.escaleta) escHtml = escHtml.replace(d.escaleta, `<span class="diff-red">${d.escaleta}</span>`);
        if (d.real) realHtml = realHtml.replace(d.real, `<span class="diff-red">${d.real}</span>`);
      });
    }
  }

  // Titular
  const hasTitular = r.titular_detalle && r.titular_detalle.texto && !r.titular_detalle.texto.includes('Sin titular');
  const titTexto = hasTitular ? r.titular_detalle.texto : '';
  const titKicker = (hasTitular && r.titular_detalle.kicker) ? r.titular_detalle.kicker : '';

  // Recursos HTML
  const recursosHtml = (r.recursos_auditados || []).map((rec, i) => {
    const isTrans = rec.transparent;
    return `
      <div class="resource-item-card ${isTrans ? 'is-transparent' : 'is-card'}" id="rec_card_${rowId}_${i}">
        <div class="rec-header">
          <span class="rec-type-badge ${isTrans ? 'badge-trans' : 'badge-card'}">
            ${isTrans ? '✨ Sticker Transparente' : '📄 Tarjeta Blanca'}
          </span>
          <span class="rec-format">${rec.formato} · ${rec.peso}</span>
        </div>
        <div class="rec-body">
          <div class="rec-filename-row">
            <label class="field-label">Archivo de recurso:</label>
            <input type="text" class="rec-input-file" id="rec_file_${rowId}_${i}" value="${rec.archivo}" placeholder="Ej: ${rec.archivo}" oninput="markModified('${rowId}')">
          </div>
          <div class="rec-type-select-row">
            <label class="field-label">Estilo de render:</label>
            <select class="rec-select-style" id="rec_style_${rowId}_${i}" onchange="markModified('${rowId}')">
              <option value="card" ${!isTrans && rec.slot !== 'FULL_BLEED' ? 'selected' : ''}>Tarjeta redondeada blanca (Oficial)</option>
              <option value="sticker" ${isTrans ? 'selected' : ''}>Sticker flotante con sombra suave (Sin fondo)</option>
              <option value="bleed" ${rec.slot === 'FULL_BLEED' ? 'selected' : ''}>Pantalla completa (Full Bleed / B-roll)</option>
              <option value="none">Ocultar este recurso</option>
            </select>
          </div>
          ${rec.epigrafe ? `<div class="rec-caption-display"><strong>Epígrafe:</strong> ${rec.epigrafe}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <tr class="matrix-row" id="row_${rowId}" data-start-time="${r.start_time}" data-end-time="${r.end_time}">
      <td class="col-fila">
        <div class="row-num-badge">#${r.row}</div>
        <button class="btn-play-row" onclick="playRow(${r.start_time}, ${r.end_time}, '${rowId}')" title="Reproducir este tramo en el video">
          ▶ Ver
        </button>
      </td>

      <td class="col-timing">
        <div class="tc-badge">${r.start_time.toFixed(1)}s – ${r.end_time.toFixed(1)}s</div>
        <div class="frame-sub">f${r.start_frame} – f${r.end_frame}</div>
        <div class="dur-sub">(${r.duration_frames}f · ${r.duration_sec.toFixed(1)}s)</div>
        <div class="diff-status-box" style="margin-top: 8px;">${diffBadge}</div>
        ${r.start_frame <= 661 && r.end_frame >= 537 ? `
          <div class="placa-warning-badge" title="Coincide con la placa quemada en máster [f537–f661]">
            ⚠️ Placa Docente Elevada
          </div>
        ` : ''}
      </td>

      <td class="col-dialogo">
        <div class="sub-selector-container">
          <!-- Casilla marcable obligatoria: copia fiel de escaleta por defecto -->
          <div class="escaleta-lock-wrap" style="margin-bottom: 8px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 6px 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 11.5px; color: #166534; cursor: pointer;">
              <input type="checkbox" id="chk_fiel_esc_${rowId}" checked onchange="toggleFielEscaletaRow('${rowId}', this.checked); markModified('${rowId}')">
              <span>☑ Copia fiel de escaleta (Predeterminado)</span>
            </label>
            <div style="font-size: 10px; color: #15803D; margin-top: 2px; padding-left: 22px;">
              Subtítulo fiel al guion pautado al pie de la letra, sincronizado al cuadro exacto con la voz.
            </div>
          </div>

          <!-- Opción 1: Escaleta -->
          <div class="sub-option-row active" id="row_opt_esc_${rowId}" onclick="selectSubSource('${rowId}', 'escaleta')">
            <label class="sub-option-label">
              <input type="radio" name="sub_source_${rowId}" value="escaleta" checked>
              <span>📄 Escaleta (Oficial · Copia Fiel)</span>
            </label>
            <div class="sub-text-preview">${escHtml}</div>
          </div>

          <!-- Opción 2: Whisper Real -->
          <div class="sub-option-row" id="row_opt_real_${rowId}" onclick="selectSubSource('${rowId}', 'real')">
            <label class="sub-option-label">
              <input type="radio" name="sub_source_${rowId}" value="real">
              <span>🎙️ Whisper (Audio Real del Máster — Excepción)</span>
            </label>
            <div class="sub-text-preview">${realHtml}</div>
          </div>

          <!-- Opción 3: Personalizado -->
          <div class="sub-option-row" id="row_opt_custom_${rowId}" onclick="selectSubSource('${rowId}', 'custom')">
            <label class="sub-option-label">
              <input type="radio" name="sub_source_${rowId}" value="custom">
              <span>✏️ Personalizado (Escribir cambios de guión libremente)</span>
            </label>
            <div class="custom-input-box" id="box_custom_${rowId}" style="display: none;">
              <textarea class="custom-input-textarea" id="custom_text_${rowId}" placeholder="Escribí aquí el texto exacto que debe subtitularse..." oninput="updateCustomCharCount('${rowId}'); markModified('${rowId}')">${r.dialogo_escaleta.replace(/\n/g, ' ')}</textarea>
              <div class="char-counter" id="char_cnt_${rowId}">0 caracteres · ~1 línea</div>
            </div>
          </div>
          ${diffDetailBox}
        </div>
      </td>

      <td class="col-titular">
        <div class="titular-edit-container">
          <label class="titular-toggle-label">
            <input type="checkbox" id="tit_enable_${rowId}" ${hasTitular ? 'checked' : ''} onchange="toggleTitular('${rowId}'); markModified('${rowId}')">
            <strong>Mostrar Titular</strong>
          </label>
          <div class="titular-inputs" id="tit_inputs_${rowId}" style="${hasTitular ? '' : 'opacity: 0.4; pointer-events: none;'}">
            <div class="input-group">
              <span class="input-sublabel">Kicker / Categoría:</span>
              <input type="text" class="input-tit-kicker" id="tit_kicker_${rowId}" value="${titKicker}" placeholder="Ej: PREVENCIÓN" oninput="markModified('${rowId}')">
            </div>
            <div class="input-group" style="margin-top: 6px;">
              <span class="input-sublabel">Título en Pantalla:</span>
              <textarea class="input-tit-title" id="tit_title_${rowId}" placeholder="Texto del titular..." oninput="markModified('${rowId}')">${titTexto}</textarea>
            </div>
            <div class="titular-slot-pill">
              Slot: <strong>${r.encuadre.slot_asignado || 'L_TOP'}</strong>
            </div>
          </div>
        </div>
      </td>

      <td class="col-recursos">
        <div class="recursos-container">
          ${recursosHtml.length > 0 ? recursosHtml : '<div class="no-resources-note">— Sin recursos pautados —</div>'}
          <div class="notes-field-wrap">
            <label class="notes-label">Observaciones de pre-edición / cambios:</label>
            <textarea class="row-notes-textarea" id="row_notes_${rowId}" placeholder="Notas para el motion designer sobre este tramo..." oninput="markModified('${rowId}')"></textarea>
          </div>
        </div>
      </td>
    </tr>
  `;
}).join('\n');

const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AMB26-04 — Matriz de Sincronización Pre-Edición Oficial (After Effects)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #F4F6F9;
      --card-bg: #FFFFFF;
      --border: #DDE3EA;
      --border-focus: #2563EB;
      --ink: #0F172A;
      --ink-soft: #334155;
      --ink-muted: #64748B;
      --primary: #2563EB;
      --primary-light: #EFF6FF;
      --accent: #10B981;
      --danger: #DC2626;
      --warning: #F59E0B;
      --cian: #5DCBE1;
      --rojo: #EA3355;
      --amarillo: #F5C042;
      --verde: #54B835;
      --menta: #6CEACB;
      --font-heading: 'Outfit', sans-serif;
      --font-body: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--ink);
      font-family: var(--font-body);
      line-height: 1.5;
      padding-bottom: 120px;
    }

    /* Ceja cromática oficial de EducaPlay */
    .top-strip { display: flex; height: 8px; width: 100%; position: sticky; top: 0; z-index: 1000; }
    .strip-cyan { background: var(--cian); flex: 1.4; }
    .strip-red { background: var(--rojo); flex: 4.2; }
    .strip-yellow { background: var(--amarillo); flex: 3.3; }
    .strip-green { background: var(--verde); flex: 1.1; }

    /* Header y Hero */
    .header-hero {
      background: var(--card-bg);
      border-bottom: 1px solid var(--border);
      padding: 24px 36px 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .badge-group { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; align-items: center; }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-code { background: #0F172A; color: #FFF; font-family: var(--font-mono); }
    .badge-subject { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
    .badge-live { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
    .bridge-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #CBD5E1;
      margin-left: auto;
    }
    .bridge-indicator.online { background: #DCFCE7; color: #15803D; border-color: #86EFAC; }
    .dot-live { width: 8px; height: 8px; border-radius: 50%; background: #94A3B8; }
    .bridge-indicator.online .dot-live { background: #22C55E; box-shadow: 0 0 6px #22C55E; }

    .header-title { font-family: var(--font-heading); font-size: 30px; font-weight: 800; color: var(--ink); }
    .header-desc { font-size: 14px; color: var(--ink-muted); margin-top: 4px; }

    /* Video player container */
    .media-player-section {
      max-width: 1780px;
      margin: 18px auto 0;
      padding: 0 36px;
      display: grid;
      grid-template-columns: 460px 1fr;
      gap: 20px;
    }
    .video-box-card {
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }
    .video-box-card video { width: 100%; height: auto; display: block; aspect-ratio: 16/9; background: #000; }
    .video-toolbar {
      background: #0F172A;
      color: #FFF;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-family: var(--font-mono);
    }

    .instructions-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .instructions-card h3 { font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 8px; }
    .instructions-card ul { padding-left: 20px; font-size: 13px; color: var(--ink-soft); line-height: 1.6; }
    .instructions-card li strong { color: #0F172A; }

    /* Stats bar */
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 18px 36px 10px;
      max-width: 1780px;
      margin: 0 auto;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .stat-val { font-size: 22px; font-weight: 800; font-family: var(--font-heading); color: var(--ink); }
    .stat-label { font-size: 11px; color: var(--ink-muted); font-weight: 700; text-transform: uppercase; }

    /* Tabla principal */
    .table-section { max-width: 1780px; margin: 0 auto; padding: 10px 36px; }
    .matrix-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #FFF;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      overflow: hidden;
    }
    .matrix-table th {
      background: #F8FAFC;
      color: var(--ink-soft);
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 16px;
      border-bottom: 2px solid var(--border);
      text-align: left;
    }
    .matrix-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      font-size: 12.5px;
    }
    .matrix-row:hover { background: #F8FAFC; }
    .matrix-row.playing-active {
      background: #EFF6FF !important;
      outline: 2px solid #3B82F6;
      box-shadow: 0 0 16px rgba(59, 130, 246, 0.25);
    }

    /* Columna Fila */
    .col-fila { width: 70px; text-align: center; }
    .row-num-badge {
      font-size: 16px;
      font-weight: 800;
      font-family: var(--font-heading);
      color: #1E293B;
    }
    .btn-play-row {
      margin-top: 6px;
      background: #E0E7FF;
      color: #3730A3;
      border: 1px solid #C7D2FE;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s;
    }
    .btn-play-row:hover { background: #4338CA; color: #FFF; border-color: #4338CA; }

    /* Columna Timing */
    .col-timing { width: 140px; }
    .tc-badge {
      font-family: var(--font-mono);
      font-size: 12px;
      background: #EEF2F6;
      padding: 3px 6px;
      border-radius: 4px;
      color: #1E293B;
      font-weight: 700;
    }
    .frame-sub { font-family: var(--font-mono); font-size: 11px; color: #64748B; margin-top: 2px; }
    .dur-sub { font-size: 10.5px; color: #94A3B8; font-weight: 600; }
    .placa-warning-badge {
      display: inline-block;
      margin-top: 6px;
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.2;
    }

    /* Selector de Subtítulos */
    .col-dialogo { min-width: 400px; }
    .sub-selector-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .sub-option-row {
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 7px 10px;
      background: #FAFAFA;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .sub-option-row.active {
      border-color: #3B82F6;
      background: #EFF6FF;
      box-shadow: 0 0 0 1px #3B82F6;
    }
    .sub-option-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 700;
      color: #1E293B;
      cursor: pointer;
      margin-bottom: 2px;
    }
    .sub-text-preview {
      font-size: 12px;
      line-height: 1.4;
      color: #334155;
      padding-left: 22px;
    }
    .diff-red {
      color: #DC2626;
      font-weight: 800;
      background-color: #FEF2F2;
      padding: 0 3px;
      border-radius: 3px;
      text-decoration: underline wavy #DC2626 1px;
    }

    .custom-input-box { margin-top: 6px; padding-left: 22px; }
    .custom-input-textarea {
      width: 100%;
      min-height: 58px;
      border: 1px solid #94A3B8;
      border-radius: 6px;
      padding: 8px 10px;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.4;
      color: #0F172A;
      background: #FFFFFF;
      resize: vertical;
    }
    .custom-input-textarea:focus {
      outline: none;
      border-color: var(--border-focus);
      box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
    }
    .char-counter { font-size: 10.5px; color: var(--ink-muted); margin-top: 2px; }

    /* Titular editable */
    .col-titular { width: 300px; }
    .titular-edit-container {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .titular-toggle-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      color: #0F172A;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .input-sublabel { display: block; font-size: 10.5px; color: #64748B; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
    .input-tit-kicker {
      width: 100%;
      padding: 5px 8px;
      border: 1px solid #CBD5E1;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #2563EB;
      background: #FFF;
    }
    .input-tit-title {
      width: 100%;
      min-height: 48px;
      padding: 6px 8px;
      border: 1px solid #CBD5E1;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
      background: #FFF;
      resize: vertical;
    }
    .titular-slot-pill {
      margin-top: 6px;
      font-size: 10px;
      color: #64748B;
      font-family: var(--font-mono);
      background: #E2E8F0;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
    }

    /* Recursos & Gráficos */
    .col-recursos { width: 340px; }
    .recursos-container { display: flex; flex-direction: column; gap: 8px; }
    .resource-item-card {
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 8px 10px;
      background: #FFFFFF;
    }
    .resource-item-card.is-transparent { border-color: #A7F3D0; background: #F0FDF4; }
    .rec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .rec-type-badge { font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
    .badge-card { background: #E2E8F0; color: #334155; }
    .badge-trans { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
    .rec-format { font-size: 10px; color: var(--ink-muted); font-family: var(--font-mono); }
    .field-label { display: block; font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px; }
    .rec-input-file {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #CBD5E1;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
      color: #0F172A;
      background: #FFF;
      margin-bottom: 4px;
    }
    .rec-select-style {
      width: 100%;
      padding: 4px 6px;
      border: 1px solid #CBD5E1;
      border-radius: 4px;
      font-size: 11px;
      color: #0F172A;
      background: #FFF;
    }
    .rec-caption-display { font-size: 10.5px; color: #64748B; margin-top: 4px; font-style: italic; }

    .notes-field-wrap { margin-top: 4px; }
    .notes-label { font-size: 10.5px; font-weight: 700; color: #64748B; display: block; margin-bottom: 2px; }
    .row-notes-textarea {
      width: 100%;
      min-height: 40px;
      border: 1px solid #CBD5E1;
      border-radius: 5px;
      padding: 4px 8px;
      font-size: 11px;
      color: #0F172A;
      background: #FFF;
      resize: vertical;
    }

    .no-resources-note { font-size: 11.5px; color: #94A3B8; font-style: italic; }

    /* Barra inferior fija */
    .action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #0F172A;
      color: #FFF;
      padding: 14px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 200;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
    }
    .action-summary { display: flex; align-items: center; gap: 16px; font-size: 13px; }
    .modified-badge {
      background: #F59E0B;
      color: #000;
      padding: 3px 8px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 11px;
    }
    .action-buttons { display: flex; gap: 10px; align-items: center; }
    .btn-action {
      background: #2563EB;
      color: #FFF;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13.5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s;
    }
    .btn-action:hover { background: #1D4ED8; transform: translateY(-1px); }
    .btn-copy-chat {
      background: linear-gradient(135deg, #6366F1, #4F46E5);
      color: #FFF;
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
    }
    .btn-copy-chat:hover {
      background: linear-gradient(135deg, #4F46E5, #4338CA);
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.55);
      transform: translateY(-1px);
    }
    .btn-save { background: #10B981; }
    .btn-save:hover { background: #059669; }
    .btn-secondary {
      background: #334155;
      color: #FFF;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-secondary:hover { background: #475569; }

    /* Toast notification */
    .toast-box {
      position: fixed;
      top: 24px;
      right: 24px;
      background: #0F172A;
      color: #FFF;
      border-left: 4px solid #10B981;
      padding: 14px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      display: none;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <div class="top-strip">
    <div class="strip-cyan"></div>
    <div class="strip-red"></div>
    <div class="strip-yellow"></div>
    <div class="strip-green"></div>
  </div>

  <div class="toast-box" id="toast">✓ Cambios guardados correctamente</div>

  <header class="header-hero">
    <div class="badge-group">
      <span class="badge badge-code">AMB26-04</span>
      <span class="badge badge-subject">Educación Ambiental Integral</span>
      <span class="badge badge-live">Fase 0 · Sincronización Pre-Edición Oficial</span>
      <div class="bridge-indicator" id="bridge-badge">
        <span class="dot-live"></span>
        <span id="bridge-text">Bridge: Verificando...</span>
      </div>
    </div>
    <h1 class="header-title">¿Esperar o evacuar?</h1>
    <p class="header-desc">Docente: <strong>Prof. Amparo Pérez Rueda</strong> · Duración: <strong>130.8 s</strong> (3136 frames @ 23.976 fps) · Placa quemada: <strong>Prof. Amparo Pérez Rueda</strong> [f537–f661]</p>
  </header>

  <!-- Video player & instrucciones -->
  <section class="media-player-section">
    <div class="video-box-card">
      <video id="master-video" src="episodios/AMB26-04/assets/AMB26-04.mp4" controls preload="metadata"></video>
      <div class="video-toolbar">
        <div>TC: <span id="tc-display">00:00.00</span> | Frame: <span id="frame-display">0</span></div>
        <div style="color: #94A3B8;">Máster HD 1920×1080 @ 23.98 fps</div>
      </div>
    </div>
    <div class="instructions-card">
      <h3>Matriz de Validación y Edición Previa</h3>
      <ul>
        <li><strong>Guión / Subtítulos:</strong> Por defecto, los subtítulos son una <strong>copia fiel de la escaleta pautada</strong> sincronizada al cuadro exacto con la voz de la docente. Cada fila tiene la casilla <code>☑ Copia fiel de escaleta</code> activa por defecto. Desmarcala únicamente si deseás adoptar la transcripción literal de Whisper o redactar un texto personalizado.</li>
        <li><strong>Titulares:</strong> Editá el título o kicker directamente; podés activar o desactivar el titular por tramo.</li>
        <li><strong>Recursos:</strong> Cambiá el nombre del archivo para relinkear o cambiá el estilo entre <em>Tarjeta redondeada</em> y <em>Sticker transparente</em>.</li>
        <li><strong>Pre-escucha:</strong> Hacé clic en <strong>▶ Ver</strong> en cualquier fila para saltar inmediatamente a ese momento en el video.</li>
        <li><strong>Guardado:</strong> Presioná <strong>Guardar Cambios en Disco</strong> para persistir tus elecciones en <code>TABLA_SINCRONIZACION_APROBADA.json</code>.</li>
      </ul>
    </div>
  </section>

  <!-- Resumen de auditoría -->
  <div class="stats-bar">
    <div class="stat-card">
      <div class="stat-val">11</div>
      <div class="stat-label">Filas Pautadas</div>
    </div>
    <div class="stat-card">
      <div class="stat-val" style="color: #DC2626;">4</div>
      <div class="stat-label">Discrepancias Subtítulos</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">11</div>
      <div class="stat-label">Recursos Auditados</div>
    </div>
    <div class="stat-card">
      <div class="stat-val" style="color: #10B981;">100%</div>
      <div class="stat-label">Conformidad Estética</div>
    </div>
  </div>

  <!-- Tabla Editable -->
  <section class="table-section">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: #FFF; padding: 12px 20px; border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: #166534; cursor: pointer;">
        <input type="checkbox" id="chk_global_escaleta" checked onchange="toggleAllFielEscaleta(this.checked)">
        <span>☑ Subtítulos: Copia fiel de escaleta en todas las filas (Predeterminado por defecto)</span>
      </label>
      <span style="font-size: 12px; color: var(--ink-muted);">Siguiendo al pie de la letra lo expuesto en la escaleta correspondiente, sincronizado al cuadro con el diálogo.</span>
    </div>
    <table class="matrix-table">
      <thead>
        <tr>
          <th style="width: 70px;">Fila</th>
          <th style="width: 140px;">Timing (s/f)</th>
          <th>Guión / Subtítulo (Copia Fiel Escaleta vs Whisper)</th>
          <th style="width: 300px;">Titulares en Pantalla</th>
          <th style="width: 340px;">Recursos, Estilo y Observaciones</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </section>

  <!-- Barra de acciones fija -->
  <footer class="action-bar">
    <div class="action-summary">
      <div>Episodio: <strong>AMB26-04</strong></div>
      <div id="modified-count-wrap" style="display: none;">
        <span class="modified-badge" id="mod-count">0 cambios</span>
      </div>
      <div style="color: #94A3B8; font-size: 12px;">Los cambios se guardan localmente y en el Bridge Server.</div>
    </div>
    <div class="action-buttons">
      <button class="btn-action btn-copy-chat" id="btn-copy-chat" onclick="copyCorrectionsForChat()" title="Copiar todas las correcciones marcadas al portapapeles para pegarlas directamente en el chat de Antigravity">
        📋 Copiar Correcciones al Chat
      </button>
      <button class="btn-secondary" onclick="exportMarkdownSummary()" title="Descargar reporte Markdown">
        📄 Descargar Markdown
      </button>
      <button class="btn-action btn-save" onclick="saveApprovedMatrix()" title="Guardar cambios en disco local y servidor">
        💾 Guardar Cambios en Disco
      </button>
    </div>
  </footer>

  <script>
    const EPISODE_META = ${JSON.stringify(meta, null, 2)};
    const RAW_ROWS = ${JSON.stringify(rows, null, 2)};

    const APP_STATE = {
      episodeId: 'AMB26-04',
      subject: 'Educación Ambiental Integral',
      modifiedCount: 0,
      rows: {}
    };

    // Inicializar estado de filas: POR DEFECTO COPIA FIEL DE ESCALETA
    RAW_ROWS.forEach(r => {
      const rowId = r.row < 10 ? '0' + r.row : '' + r.row;
      const isDiff = !!r.diferencias_detectadas;
      const hasTit = r.titular_detalle && r.titular_detalle.texto && !r.titular_detalle.texto.includes('Sin titular');

      APP_STATE.rows[rowId] = {
        row: r.row,
        start_frame: r.start_frame,
        end_frame: r.end_frame,
        start_time: r.start_time,
        end_time: r.end_time,
        dialogo_escaleta: r.dialogo_escaleta,
        dialogo_real: r.dialogo_real,
        copia_fiel_escaleta: true,
        subSource: 'escaleta',
        customText: r.dialogo_escaleta.replace(/\\n/g, ' '),
        titularEnabled: hasTit,
        titularKicker: (hasTit && r.titular_detalle.kicker) ? r.titular_detalle.kicker : '',
        titularTitle: hasTit ? r.titular_detalle.texto : '',
        recursos: (r.recursos_auditados || []).map((rec, i) => ({
          originalArchivo: rec.archivo,
          archivo: rec.archivo,
          style: rec.transparent ? 'sticker' : (rec.slot === 'FULL_BLEED' ? 'bleed' : 'card')
        })),
        notes: ''
      };
    });

    // Cargar cambios previos desde localStorage si existen
    try {
      const saved = localStorage.getItem('EDUCAPLAY_SYNC_AMB26_04');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rows) {
          Object.keys(parsed.rows).forEach(rk => {
            if (APP_STATE.rows[rk]) {
              Object.assign(APP_STATE.rows[rk], parsed.rows[rk]);
            }
          });
        }
      }
    } catch(e) {}

    // Sincronizar UI con APP_STATE
    window.addEventListener('DOMContentLoaded', () => {
      Object.keys(APP_STATE.rows).forEach(rk => {
        const state = APP_STATE.rows[rk];
        selectSubSource(rk, state.subSource, false);
        const customTxtEl = document.getElementById('custom_text_' + rk);
        if (customTxtEl && state.customText) {
          customTxtEl.value = state.customText;
          updateCustomCharCount(rk);
        }

        const titChk = document.getElementById('tit_enable_' + rk);
        if (titChk) {
          titChk.checked = state.titularEnabled;
          toggleTitular(rk);
        }
        const titKickerEl = document.getElementById('tit_kicker_' + rk);
        if (titKickerEl && state.titularKicker) titKickerEl.value = state.titularKicker;
        const titTitleEl = document.getElementById('tit_title_' + rk);
        if (titTitleEl && state.titularTitle) titTitleEl.value = state.titularTitle;

        (state.recursos || []).forEach((rec, i) => {
          const fEl = document.getElementById('rec_file_' + rk + '_' + i);
          if (fEl && rec.archivo) fEl.value = rec.archivo;
          const sEl = document.getElementById('rec_style_' + rk + '_' + i);
          if (sEl && rec.style) sEl.value = rec.style;
        });

        const notesEl = document.getElementById('row_notes_' + rk);
        if (notesEl && state.notes) notesEl.value = state.notes;
      });

      checkBridgeServer();
      setInterval(checkBridgeServer, 5000);
    });

    // Video player timing
    const videoEl = document.getElementById('master-video');
    const tcDisplay = document.getElementById('tc-display');
    const frameDisplay = document.getElementById('frame-display');
    let playingInterval = null;

    if (videoEl) {
      videoEl.addEventListener('timeupdate', () => {
        const t = videoEl.currentTime;
        const mins = Math.floor(t / 60);
        const secs = (t % 60).toFixed(2).padStart(5, '0');
        tcDisplay.textContent = \`\${mins.toString().padStart(2, '0')}:\${secs}\`;
        frameDisplay.textContent = Math.round(t * 23.97602);
      });
    }

    function playRow(startTime, endTime, rowId) {
      if (!videoEl) return;
      videoEl.currentTime = startTime;
      videoEl.play();

      document.querySelectorAll('.matrix-row').forEach(r => r.classList.remove('playing-active'));
      const activeRow = document.getElementById('row_' + rowId);
      if (activeRow) activeRow.classList.add('playing-active');

      if (playingInterval) clearInterval(playingInterval);
      playingInterval = setInterval(() => {
        if (videoEl.currentTime >= endTime) {
          videoEl.pause();
          clearInterval(playingInterval);
          if (activeRow) activeRow.classList.remove('playing-active');
        }
      }, 50);
    }

    function toggleFielEscaletaRow(rowId, isChecked) {
      const state = APP_STATE.rows[rowId];
      if (!state) return;
      state.copia_fiel_escaleta = isChecked;
      const chk = document.getElementById('chk_fiel_esc_' + rowId);
      if (chk) chk.checked = isChecked;

      if (isChecked) {
        selectSubSource(rowId, 'escaleta');
      } else {
        const raw = RAW_ROWS.find(x => (x.row < 10 ? '0' + x.row : '' + x.row) === rowId);
        selectSubSource(rowId, (raw && raw.diferencias_detectadas) ? 'real' : 'custom');
      }
    }

    function toggleAllFielEscaleta(isChecked) {
      Object.keys(APP_STATE.rows).forEach(rk => {
        toggleFielEscaletaRow(rk, isChecked);
      });
      showToast(isChecked ? '✓ Todas las filas en copia fiel de escaleta' : '⚠️ Copia fiel desactivada globalmente');
    }

    function selectSubSource(rowId, source, mark = true) {
      APP_STATE.rows[rowId].subSource = source;
      const chk = document.getElementById('chk_fiel_esc_' + rowId);
      if (chk) {
        chk.checked = (source === 'escaleta');
        APP_STATE.rows[rowId].copia_fiel_escaleta = (source === 'escaleta');
      }

      const optEsc = document.getElementById('row_opt_esc_' + rowId);
      const optReal = document.getElementById('row_opt_real_' + rowId);
      const optCustom = document.getElementById('row_opt_custom_' + rowId);
      const boxCustom = document.getElementById('box_custom_' + rowId);

      [optEsc, optReal, optCustom].forEach(el => el && el.classList.remove('active'));

      if (source === 'escaleta') {
        if (optEsc) { optEsc.classList.add('active'); optEsc.querySelector('input').checked = true; }
        if (boxCustom) boxCustom.style.display = 'none';
      } else if (source === 'real') {
        if (optReal) { optReal.classList.add('active'); optReal.querySelector('input').checked = true; }
        if (boxCustom) boxCustom.style.display = 'none';
      } else if (source === 'custom') {
        if (optCustom) { optCustom.classList.add('active'); optCustom.querySelector('input').checked = true; }
        if (boxCustom) {
          boxCustom.style.display = 'block';
          boxCustom.querySelector('textarea').focus();
        }
      }
      if (mark) markModified(rowId);
    }

    function updateCustomCharCount(rowId) {
      const textarea = document.getElementById('custom_text_' + rowId);
      const counter = document.getElementById('char_cnt_' + rowId);
      if (!textarea || !counter) return;
      const len = textarea.value.length;
      const lines = Math.ceil(len / 42) || 1;
      const lineClass = lines > 2 ? 'style="color:#DC2626; font-weight:700;"' : '';
      counter.innerHTML = \`<span \${lineClass}>\${len} caracteres · ~\${lines} línea(s) \${lines > 2 ? '(⚠️ Excede 2 líneas recomendadas)' : ''}</span>\`;
      APP_STATE.rows[rowId].customText = textarea.value;
    }

    function toggleTitular(rowId) {
      const chk = document.getElementById('tit_enable_' + rowId);
      const box = document.getElementById('tit_inputs_' + rowId);
      if (!chk || !box) return;
      const enabled = chk.checked;
      APP_STATE.rows[rowId].titularEnabled = enabled;
      box.style.opacity = enabled ? '1' : '0.4';
      box.style.pointerEvents = enabled ? 'auto' : 'none';
    }

    function markModified(rowId) {
      APP_STATE.modifiedCount++;
      const modWrap = document.getElementById('modified-count-wrap');
      const modBadge = document.getElementById('mod-count');
      if (modWrap && modBadge) {
        modWrap.style.display = 'block';
        modBadge.textContent = \`\${APP_STATE.modifiedCount} cambios marcados\`;
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3500);
    }

    function collectCurrentPayload() {
      // Recoger todos los valores actuales del DOM
      Object.keys(APP_STATE.rows).forEach(rk => {
        const state = APP_STATE.rows[rk];
        const titChk = document.getElementById('tit_enable_' + rk);
        state.titularEnabled = titChk ? titChk.checked : false;

        const titKicker = document.getElementById('tit_kicker_' + rk);
        if (titKicker) state.titularKicker = titKicker.value.trim();

        const titTitle = document.getElementById('tit_title_' + rk);
        if (titTitle) state.titularTitle = titTitle.value.trim();

        const customTxt = document.getElementById('custom_text_' + rk);
        if (customTxt) state.customText = customTxt.value.trim();

        const notesEl = document.getElementById('row_notes_' + rk);
        if (notesEl) state.notes = notesEl.value.trim();

        (state.recursos || []).forEach((rec, i) => {
          const fEl = document.getElementById('rec_file_' + rk + '_' + i);
          if (fEl) rec.archivo = fEl.value.trim();
          const sEl = document.getElementById('rec_style_' + rk + '_' + i);
          if (sEl) rec.style = sEl.value;
        });
      });

      return {
        meta: EPISODE_META,
        approvedAt: new Date().toISOString(),
        rows: Object.values(APP_STATE.rows)
      };
    }

    async function checkBridgeServer() {
      const badge = document.getElementById('bridge-badge');
      const text = document.getElementById('bridge-text');
      try {
        const res = await fetch('http://localhost:3210/api/health', { method: 'GET' });
        if (res.ok) {
          badge.classList.add('online');
          text.textContent = 'Bridge: Conectado (3210)';
        } else {
          badge.classList.remove('online');
          text.textContent = 'Bridge: Desconectado';
        }
      } catch(e) {
        badge.classList.remove('online');
        text.textContent = 'Bridge: Desconectado';
      }
    }

    async function saveApprovedMatrix() {
      const payload = collectCurrentPayload();

      // 1. Guardar en localStorage
      try {
        localStorage.setItem('EDUCAPLAY_SYNC_AMB26_04', JSON.stringify(payload));
      } catch(e) {}

      // 2. Intentar guardar en Bridge local
      let bridgeSaved = false;
      try {
        const res = await fetch('http://localhost:3210/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          bridgeSaved = true;
        }
      } catch(e) {}

      // 3. Descarga directa de respaldo
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TABLA_SINCRONIZACION_APROBADA.json';
      a.click();
      URL.revokeObjectURL(url);

      if (bridgeSaved) {
        showToast('✓ Guardado en disco en TABLA_SINCRONIZACION_APROBADA.json y Bridge 3210');
      } else {
        showToast('✓ Guardado en navegador y descargado TABLA_SINCRONIZACION_APROBADA.json');
      }
    }

    function exportMarkdownSummary() {
      const payload = collectCurrentPayload();
      let md = '# TABLA DE SINCRONIZACIÓN PRE-EDICIÓN APROBADA · AMB26-04\\n\\n';
      md += \`**Episodio:** AMB26-04 "¿Esperar o evacuar?"\\n\`;
      md += \`**Docente:** Prof. Amparo Pérez Rueda\\n\`;
      md += \`**Fecha:** \${new Date().toLocaleString()}\\n\\n\`;
      md += '| Fila | Timing | Diálogo Seleccionado | Titular Aprobado | Recursos | Observaciones |\\n';
      md += '|---|---|---|---|---|---|\\n';

      payload.rows.forEach(r => {
        let subText = r.dialogo_escaleta;
        if (r.subSource === 'real') subText = r.dialogo_real;
        else if (r.subSource === 'custom') subText = r.customText;

        const tit = r.titularEnabled ? (r.titularKicker ? \`[\${r.titularKicker}] \` : '') + r.titularTitle : '—';
        const recs = (r.recursos || []).map(rc => \`\${rc.archivo} (\${rc.style})\`).join(', ') || '—';
        const notes = r.notes || '—';

        md += \`| #\${r.row} | \${r.start_time.toFixed(1)}s-\${r.end_time.toFixed(1)}s | \${subText.replace(/\\n/g, ' ')} | \${tit} | \${recs} | \${notes} |\\n\`;
      });

      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TABLA_SINCRONIZACION_APROBADA_AMB26_04.md';
      a.click();
      URL.revokeObjectURL(url);
      showToast('✓ Resumen Markdown exportado.');
    }

    async function copyCorrectionsForChat() {
      const payload = collectCurrentPayload();
      const btn = document.getElementById('btn-copy-chat');

      let text = '### 📝 Correcciones de Pre-Edición — AMB26-04 ("¿Esperar o evacuar?")\\n\\n';
      text += \`**Docente:** Prof. Amparo Pérez Rueda | **Episodio:** AMB26-04\\n\`;
      text += \`**Fecha:** \${new Date().toLocaleString()}\\n\\n\`;

      payload.rows.forEach(r => {
        const rawRow = RAW_ROWS.find(x => x.row === r.row) || {};
        const hasTitOriginal = rawRow.titular_detalle && rawRow.titular_detalle.texto && !rawRow.titular_detalle.texto.includes('Sin titular');

        let subText = r.dialogo_escaleta;
        let subOrigen = 'Escaleta';
        if (r.subSource === 'real') {
          subText = r.dialogo_real;
          subOrigen = 'Whisper (Audio Real)';
        } else if (r.subSource === 'custom') {
          subText = r.customText;
          subOrigen = 'Personalizado';
        }

        const hasNotes = !!(r.notes && r.notes.trim());

        text += \`#### Fila #\${r.row} [\${r.start_time.toFixed(1)}s – \${r.end_time.toFixed(1)}s | f\${r.start_frame}–f\${r.end_frame}]\\n\`;
        const isFiel = (r.copia_fiel_escaleta !== false) && (r.subSource === 'escaleta');
        text += \`- **Guión / Subtítulo:** \${isFiel ? '[☑ Copia fiel de escaleta] ' : '[⚠️ Excepción - Desmarcada copia fiel] '}\${subText.replace(/\\n/g, ' ')} (\${subOrigen})\` + '\\n';

        if (r.titularEnabled) {
          text += \`- **Titular:** \${r.titularKicker ? \`[\${r.titularKicker}] \` : ''}"\${r.titularTitle}"\\n\`;
        } else {
          text += \`- **Titular:** — Sin titular —\\n\`;
        }

        if (r.recursos && r.recursos.length > 0) {
          const recDesc = r.recursos.map(rc => {
            const stName = rc.style === 'sticker' ? 'Sticker transparente flotante' : (rc.style === 'bleed' ? 'Pantalla completa' : (rc.style === 'none' ? 'Ocultar' : 'Tarjeta blanca'));
            return \`\${rc.archivo} (\${stName})\`;
          }).join(', ');
          text += \`- **Recursos:** \${recDesc}\\n\`;
        } else {
          text += \`- **Recursos:** Sin recursos\\n\`;
        }

        if (hasNotes) {
          text += \`- **Observaciones:** \${r.notes.trim()}\\n\`;
        }
        text += \`\\n\`;
      });

      // Copiar al portapapeles
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch(e) {}
      }

      if (!copied) {
        const tArea = document.createElement('textarea');
        tArea.value = text;
        tArea.style.position = 'fixed';
        tArea.style.left = '-9999px';
        document.body.appendChild(tArea);
        tArea.focus();
        tArea.select();
        try {
          document.execCommand('copy');
          copied = true;
        } catch(e) {}
        document.body.removeChild(tArea);
      }

      if (btn) {
        const oldText = btn.innerHTML;
        btn.innerHTML = '✅ ¡Copiado al portapapeles!';
        btn.style.background = '#10B981';
        setTimeout(() => {
          btn.innerHTML = oldText;
          btn.style.background = '';
        }, 4000);
      }

      showToast('✓ ¡Correcciones copiadas! Ya podés pegarlas en el chat de Antigravity.');
    }
  </script>
</body>
</html>
`;

// Guardar tanto en la carpeta del episodio como en la raíz del repo
const dest1 = path.join(ROOT, 'episodios', 'AMB26-04', 'TABLA_SINCRONIZACION_PRE_EDICION_AMB26_04.html');
const dest2 = path.join(ROOT, 'TABLA_SINCRONIZACION_PRE_EDICION_AMB26_04.html');

fs.writeFileSync(dest1, fullHtml, 'utf8');
fs.writeFileSync(dest2, fullHtml, 'utf8');

console.log('✓ TABLA_SINCRONIZACION_PRE_EDICION_AMB26_04.html generada exitosamente con edición completa de titulares, recursos y guión.');
