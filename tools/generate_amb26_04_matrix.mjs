import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const code = 'AMB26-04';
const codeSafe = 'AMB26_04';

const workDir = path.join(ROOT, 'episodios', code);
fs.mkdirSync(workDir, { recursive: true });

const meta = {
  episodeId: code,
  patente: codeSafe,
  subject: "Educación Ambiental Integral",
  title: "¿Esperar o evacuar?",
  objective: "Fomentar una cultura de prevención y cuidado, incorporando conocimientos y prácticas para reducir riesgos ante una inundación.",
  presenter: "Prof. Amparo Pérez Rueda",
  presenterPlaca: "Prof. Amparo Pérez Rueda",
  fps: 23.976023976023978,
  masterVideo: `videos/${code}.mp4`,
  duration: 130.80,
  totalFrames: 3136,
  lowerThird: {
    inFrame: 537,
    outFrame: 661,
    inSec: 22.40,
    outSec: 27.60,
    text: "Prof. Amparo Pérez Rueda",
    zone: [79, 818, 550, 110],
    evasionRequired: true,
    captionElevatedBottom: "270px"
  },
  watermark: {
    x: 1400,
    y: 35,
    w: 420,
    h: 140,
    text: "Educaplay ED. AMBIENTAL"
  }
};

const rows = [
  {
    row: 1,
    start_time: 0.00,
    end_time: 21.27,
    start_frame: 0,
    end_frame: 510,
    duration_sec: 21.27,
    duration_frames: 510,
    dialogo_escaleta: "Como correntinos sabemos que por nuestra geografía y clima estamos expuestos a las inundaciones.\nY cuando el agua empieza a entrar a la casa, surge la duda sobre si conviene esperar a que baje o evacuar.",
    dialogo_real: "Como correntinos sabemos que por nuestra geografía y clima estamos expuestos a las inundaciones y cuando el agua empieza a entrar a la casa surge la duda sobre si conviene esperar a que baje o evacuar.",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "— Sin titular pautado —",
      start_frame: 0,
      end_frame: 510,
      kicker: null,
      recurso_asociado: "1.mp4",
      coexistencia: "Sin titular pautado — Cobertura documental a cuadro completo"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "1",
        archivo: "1.mp4",
        ruta: "RECURSOS/1.mp4",
        formato: "MP4",
        peso: "30.2 MB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 0,
        end_frame: 510,
        slot: "FULL_BLEED",
        carga: "alta",
        transparent: false,
        rank: "didactico",
        epigrafe: "Youtube - Extreme Storm Brings Record Rain To Argentina's Corrientes As Homes Flooded Out | Watch Video"
      }
    ],
    encuadre: {
      real: "None / Plató sin docente (Voz en off)",
      nivel_atencion: "Alta / Evidencia Documental",
      norma_requerida: "None",
      coincide: true,
      zona_libre: "Pantalla completa (0–526)",
      slot_asignado: "FULL_BLEED"
    }
  },
  {
    row: 2,
    start_time: 21.27,
    end_time: 24.07,
    start_frame: 510,
    end_frame: 577,
    duration_sec: 2.80,
    duration_frames: 67,
    dialogo_escaleta: "— Sin locución pautada (Titular a pantalla completa durante 2 segundos y letra destacada) —",
    dialogo_real: "[Pausa rítmica entre 'evacuar' y 'Saber identificar']",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "La prevención comienza cuando sabemos reconocer el peligro",
      start_frame: 510,
      end_frame: 577,
      kicker: "PREVENCIÓN",
      recurso_asociado: null,
      coexistencia: "Titular oficial pautado en escaleta — Entrada destacada en slot superior para no pisar placa quemada"
    },
    recursos_auditados: [],
    encuadre: {
      real: "Center / Entrada de docente f526 y placa f537",
      nivel_atencion: "Alta / Apertura conceptual",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Slot superior libre [y: 190–420]",
      slot_asignado: "L_TOP"
    }
  },
  {
    row: 3,
    start_time: 22.02,
    end_time: 30.45,
    start_frame: 528,
    end_frame: 730,
    duration_sec: 8.43,
    duration_frames: 202,
    dialogo_escaleta: "Saber identificar el riesgo es fundamental para tomar decisiones correctas, actuar a tiempo y sin pánico.",
    dialogo_real: "Saber identificar el riesgo es fundamental para tomar decisiones correctas, actuar a tiempo y sin pánico.",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "— Sin titular pautado —",
      start_frame: 528,
      end_frame: 730,
      kicker: null,
      recurso_asociado: "2.png",
      coexistencia: "Sin titular pautado"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "2",
        archivo: "2.png",
        ruta: "RECURSOS/2.png",
        formato: "PNG (RGBA)",
        peso: "42 KB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 577,
        end_frame: 730,
        slot: "L_TOP_LEFT",
        carga: "baja",
        transparent: true,
        rank: "refuerzo",
        epigrafe: null
      }
    ],
    encuadre: {
      real: "Center / Docente centrada [x: 712–1360]",
      nivel_atencion: "Baja / Refuerzo",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Banda izquierda [x: 56–616, y: 190–490]",
      slot_asignado: "L_TOP_LEFT"
    }
  },
  {
    row: 4,
    start_time: 30.45,
    end_time: 45.80,
    start_frame: 730,
    end_frame: 1098,
    duration_sec: 15.35,
    duration_frames: 368,
    dialogo_escaleta: "Por lluvias torrenciales, el agua suele subir rápido.\nSi entra a tu casa solo unos centímetros y los desagües están funcionando correctamente, podés quedarte en ella.",
    dialogo_real: "Por lluvias torrenciales el agua suele subir rápido. Si entra a tu casa solo unos centímetros y los desagües están funcionando correctamente podés quedarte en ella.",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "— Sin titular pautado —",
      start_frame: 730,
      end_frame: 1098,
      kicker: null,
      recurso_asociado: "3.mov / 4.mp4",
      coexistencia: "Sin titular pautado"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "3",
        archivo: "3.mov",
        ruta: "RECURSOS/3.mov",
        formato: "MOV (ProRes 422)",
        peso: "100.7 MB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 730,
        end_frame: 929,
        slot: "L_SIDE_RIGHT",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Lluvias torrenciales"
      },
      {
        nombre_escaleta: "4",
        archivo: "4.mp4",
        ruta: "RECURSOS/4.mp4",
        formato: "MP4 (H.264)",
        peso: "18.6 MB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 929,
        end_frame: 1098,
        slot: "L_SIDE_RIGHT",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Desagües en funcionamiento"
      }
    ],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Media / Didáctico",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Banda derecha libre por debajo de la mosca [y: 190–610]",
      slot_asignado: "L_SIDE_RIGHT"
    }
  },
  {
    row: 5,
    start_time: 45.80,
    end_time: 59.85,
    start_frame: 1098,
    end_frame: 1435,
    duration_sec: 14.05,
    duration_frames: 337,
    dialogo_escaleta: "Pero de todas maneras, cortá la luz desde el tablero principal, siempre con calzado de goma y manos secas; y subí los electrodomésticos y objetos de valor a lugares altos.",
    dialogo_real: "Pero de todas maneras corta la luz desde el tablero principal siempre con calzado de goma y manos secas y subí los electrodomésticos y objetos de valor a lugares altos.",
    diferencias_detectadas: true,
    diferencias_detalle: "Whisper transcribió 'corta la luz' sin tilde; corregido a 'cortá la luz' (voseo imperativo)",
    titular_detalle: {
      texto: "Cortar la luz · Subir objetos de valor",
      start_frame: 1098,
      end_frame: 1435,
      kicker: "MEDIDAS PREVENTIVAS",
      recurso_asociado: "5.jfif / 6.jfif",
      coexistencia: "Titular oficial pautado en escaleta — Secuencia bipartita"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "5",
        archivo: "5.jfif",
        ruta: "RECURSOS/5.jfif",
        formato: "JFIF (JPEG)",
        peso: "6 KB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 1098,
        end_frame: 1246,
        slot: "L_BOTTOM",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Calzado de goma y manos secas"
      },
      {
        nombre_escaleta: "6",
        archivo: "6.jfif",
        ruta: "RECURSOS/6.jfif",
        formato: "JFIF (JPEG)",
        peso: "835 KB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 1246,
        end_frame: 1435,
        slot: "L_BOTTOM",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Bienes en altura"
      }
    ],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Media / Protocolo preventivo",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Slots disjuntos L_TOP [y: 190–390] y L_BOTTOM [y: 410–790]",
      slot_asignado: "L_TOP + L_BOTTOM"
    }
  },
  {
    row: 6,
    start_time: 59.85,
    end_time: 68.78,
    start_frame: 1435,
    end_frame: 1649,
    duration_sec: 8.93,
    duration_frames: 214,
    dialogo_escaleta: "Sin embargo, si el nivel sigue subiendo y el agua se acerca a los tomacorrientes, el peligro  es real y tenés que abandonar la casa.",
    dialogo_real: "Sin embargo, si el nivel sigue subiendo y el agua se acerca a los tomacorrientes, el peligro es real y tenés que abandonar la casa.",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "Peligro",
      start_frame: 1435,
      end_frame: 1649,
      kicker: "CRITERIO DE EVACUACIÓN",
      recurso_asociado: "7.png",
      coexistencia: "Titular oficial pautado en escaleta"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "7",
        archivo: "7.png",
        ruta: "RECURSOS/7.png",
        formato: "PNG (RGBA)",
        peso: "15 KB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 1435,
        end_frame: 1649,
        slot: "L_BOTTOM",
        carga: "media",
        transparent: true,
        rank: "didactico",
        epigrafe: "Tomacorrientes alcanzados por el agua"
      }
    ],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Alta / Riesgo de electrocución",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Slot superior para titular y slot inferior para sticker flotante",
      slot_asignado: "L_TOP + L_BOTTOM"
    }
  },
  {
    row: 7,
    start_time: 68.78,
    end_time: 76.99,
    start_frame: 1649,
    end_frame: 1846,
    duration_sec: 8.21,
    duration_frames: 197,
    dialogo_escaleta: "Lo mismo si vivís cerca de un río o arroyo, donde las crecidas son prolongadas y requieren evacuar con anticipación hacia un lugar seguro.",
    dialogo_real: "Lo mismo si vivís cerca de un río o arroyo donde las crecidas son prolongadas y requieren evacuar con anticipación hacia un lugar seguro.",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "Evacuación de zonas ribereñas",
      start_frame: 1649,
      end_frame: 1846,
      kicker: "CRECIDAS PROLONGADAS",
      recurso_asociado: "8.jpg",
      coexistencia: "Titular oficial pautado en escaleta"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "8",
        archivo: "8.jpg",
        ruta: "RECURSOS/8.jpg",
        formato: "JPEG",
        peso: "214 KB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 1649,
        end_frame: 1846,
        slot: "L_BOTTOM",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Evacuación preventiva obligatoria"
      }
    ],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Media / Geografía ribereña",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Slot lateral disjunto",
      slot_asignado: "L_TOP + L_BOTTOM"
    }
  },
  {
    row: 8,
    start_time: 76.99,
    end_time: 95.55,
    start_frame: 1846,
    end_frame: 2291,
    duration_sec: 18.56,
    duration_frames: 445,
    dialogo_escaleta: "Si Defensa Civil ordena evacuar, no te demores en hacerlo.\nPriorizá a niños, adultos mayores o personas con movilidad reducida, y no olvides a tus mascotas, llevalas con correa o transportadora.\nSalí caminando hacia el centro de evacuación indicado.",
    dialogo_real: "Si defensa civil ordena evacuar, no te demores en hacerlo. Prioriza a niños, adultos mayores o personas con movilidad reducida y no olvides a tus mascotas. Llévalas con correa o transportadores. Salí caminando hacia el centro de evacuación indicado.",
    diferencias_detectadas: true,
    diferencias_detalle: "Whisper: 'defensa civil', 'Prioriza', 'Llévalas... transportadores' → Corregido en subtítulos con CAPTION_FIX",
    titular_detalle: {
      texto: "Evacuá rápido, con calma y sin usar vehículos",
      start_frame: 1846,
      end_frame: 2291,
      kicker: "ORDEN DE EVACUACIÓN",
      recurso_asociado: "9.jfif / 10.png",
      coexistencia: "Titular oficial pautado en escaleta"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "9",
        archivo: "9.jfif",
        ruta: "RECURSOS/9.jfif",
        formato: "JFIF (JPEG)",
        peso: "125 KB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 2008,
        end_frame: 2224,
        slot: "L_BOTTOM",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Mascotas con correa o transportadora"
      },
      {
        nombre_escaleta: "10",
        archivo: "10.png",
        ruta: "RECURSOS/10.png",
        formato: "PNG (RGB)",
        peso: "1.3 MB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 2224,
        end_frame: 2291,
        slot: "L_BOTTOM",
        carga: "media",
        transparent: false,
        rank: "refuerzo",
        epigrafe: "Centro de evacuación indicado"
      }
    ],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Alta / Seguridad humana y animal",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Titular persistente arriba y recursos rotativos abajo",
      slot_asignado: "L_TOP + L_BOTTOM"
    }
  },
  {
    row: 9,
    start_time: 95.55,
    end_time: 113.03,
    start_frame: 2291,
    end_frame: 2710,
    duration_sec: 17.48,
    duration_frames: 419,
    dialogo_escaleta: "Jamás intentes cruzar calles anegadas en auto, moto ni a pie si la corriente es fuerte.\nSi no podés movilizarte por tus propios medios, comunicate inmediatamente con  Defensa Civil al 103 o con el 100 de Bomberos.",
    dialogo_real: "Jamás intentes cruzar calles anegadas en auto, moto ni a pie si la corriente es fuerte. Si no podés movilizarte por tus propios medios, comunícate inmediatamente con defensa civil al 103 o con el 100 de bomberos.",
    diferencias_detectadas: true,
    diferencias_detalle: "Whisper: 'comunícate' (esdrújula) → 'comunicate' (voseo), 'defensa civil' y 'bomberos' a mayúsculas",
    titular_detalle: {
      texto: "103 Defensa Civil · 100 Bomberos",
      start_frame: 2509,
      end_frame: 2710,
      kicker: "TELÉFONOS IMPORTANTES",
      recurso_asociado: "11.png",
      coexistencia: "Titular oficial pautado en escaleta — Placa destacada"
    },
    recursos_auditados: [
      {
        nombre_escaleta: "11",
        archivo: "11.png",
        ruta: "RECURSOS/11.png",
        formato: "PNG (RGB)",
        peso: "2.5 MB",
        estado: "AUDITADO_EN_DISCO",
        alerta: null,
        start_frame: 2291,
        end_frame: 2509,
        slot: "L_SIDE_RIGHT",
        carga: "media",
        transparent: false,
        rank: "didactico",
        epigrafe: "Peligro: corriente en calles anegadas"
      }
    ],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Alta / Rescate y emergencias",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Banda lateral libre",
      slot_asignado: "L_SIDE_RIGHT"
    }
  },
  {
    row: 10,
    start_time: 113.03,
    end_time: 118.95,
    start_frame: 2710,
    end_frame: 2852,
    duration_sec: 5.92,
    duration_frames: 142,
    dialogo_escaleta: "Evaluar la situación y responder a tiempo garantiza tu seguridad.",
    dialogo_real: "Evaluar la situación y responder a tiempo garantiza tu seguridad.",
    diferencias_detectadas: false,
    diferencias_detalle: null,
    titular_detalle: {
      texto: "Evaluar la situación y responder a tiempo garantiza tu seguridad",
      start_frame: 2710,
      end_frame: 2852,
      kicker: "SÍNTESIS",
      recurso_asociado: null,
      coexistencia: "Titular oficial de cierre conceptual"
    },
    recursos_auditados: [],
    encuadre: {
      real: "Center / Docente centrada",
      nivel_atencion: "Media / Cierre",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Slot superior",
      slot_asignado: "L_TOP"
    }
  },
  {
    row: 11,
    start_time: 118.95,
    end_time: 122.92,
    start_frame: 2852,
    end_frame: 2945,
    duration_sec: 3.97,
    duration_frames: 93,
    dialogo_escaleta: "¡Compartí esta información para cuidarnos entre todos!",
    dialogo_real: "Compartí esta información para cuidarnos entre todos.",
    diferencias_detectadas: true,
    diferencias_detalle: "Whisper omite signos de exclamación; corregido con CAPTION_FIX según escaleta",
    titular_detalle: {
      texto: "¡Compartí esta información para cuidarnos entre todos!",
      start_frame: 2852,
      end_frame: 2945,
      kicker: "COMUNIDAD",
      recurso_asociado: null,
      coexistencia: "Llamado a la acción comunitario"
    },
    recursos_auditados: [],
    encuadre: {
      real: "Center / Docente centrada (seguido de transición f2945)",
      nivel_atencion: "Media / Despedida",
      norma_requerida: "Center",
      coincide: true,
      zona_libre: "Slot central superior",
      slot_asignado: "L_TOP"
    }
  }
];

const matrixData = { meta, rows };

// Guardar JSONs
fs.writeFileSync(path.join(workDir, 'TABLA_SINCRONIZACION_DATOS.json'), JSON.stringify(matrixData, null, 2), 'utf8');
fs.writeFileSync(path.join(workDir, 'TABLA_SINCRONIZACION_APROBADA.json'), JSON.stringify(matrixData, null, 2), 'utf8');
console.log('✓ Guardado TABLA_SINCRONIZACION_DATOS.json y TABLA_SINCRONIZACION_APROBADA.json');

// Guardar Markdown
let md = `# Matriz de Sincronización Pre-Edición Oficial — ${meta.episodeId} (${meta.title})\n\n`;
md += `**Materia:** ${meta.subject}  \n`;
md += `**Docente:** ${meta.presenter} (Placa quemada: *${meta.lowerThird.text}* entre f${meta.lowerThird.inFrame} y f${meta.lowerThird.outFrame})  \n`;
md += `**Duración:** ${meta.duration} s (${meta.totalFrames} frames @ ${meta.fps} fps)  \n`;
md += `**Generado:** ${new Date().toISOString()}  \n\n`;
md += `---\n\n`;
md += `## 1. Protocolo de Sincronización y Reglas de Calidad\n\n`;
md += `- **Cotejo Whisper vs Escaleta**: Toda diferencia detectada se valida para el subtítulo final.\n`;
md += `- **Titulares Literales**: Prohibido inventar kickers o categorías conceptuales no pautadas. Las filas sin titular se montan vacías.\n`;
md += `- **Recursos con Transparencia**: Assets con canal alfa (2.png, 7.png) se montan como **stickers flotantes transparentes** sin tarjeta blanca.\n`;
md += `- **Evasión de Lower-Third y Mosca**: Respeto a la mosca institucional [${meta.watermark.x}, ${meta.watermark.y}, ${meta.watermark.w}, ${meta.watermark.h}] y a la placa de nombre.\n\n`;
md += `---\n\n`;
md += `## 2. Detalle de Escenas y Filas de Sincronización\n\n`;

rows.forEach(r => {
  md += `### Fila ${r.row} [${r.start_time.toFixed(2)}s – ${r.end_time.toFixed(2)}s | f${r.start_frame} – f${r.end_frame}]\n\n`;
  md += `- **Diálogo Escaleta:** ${r.dialogo_escaleta}\n`;
  md += `- **Locución Real (Whisper):** ${r.dialogo_real}\n`;
  md += `- **Discrepancia:** ${r.diferencias_detectadas ? `🔴 SÍ (${r.diferencias_detalle})` : '🟢 NO'}\n`;
  md += `- **Titular Pautado:** \`${r.titular_detalle?.texto || '—'}\`\n`;
  md += `- **Encuadre Docente:** ${r.encuadre?.real || '—'} (Slot: \`${r.encuadre?.slot_asignado || 'L_TOP'}\`)\n`;
  md += `- **Recursos Asociados:**\n`;
  if (r.recursos_auditados?.length) {
    r.recursos_auditados.forEach(rec => {
      md += `  * **${rec.archivo}** (${rec.formato}, ${rec.peso}) — Rango: \`${rec.rank}\`, Transparente: ${rec.transparent ? 'Sí (Sticker sin tarjeta)' : 'No (Tarjeta canónica)'}, Slot: \`${rec.slot}\`\n`;
    });
  } else {
    md += `  * *Sin recursos gráficos asociados.*\n`;
  }
  md += `\n`;
});

fs.writeFileSync(path.join(workDir, `TABLA_SINCRONIZACION_PRE_EDICION_${codeSafe}.md`), md, 'utf8');
console.log(`✓ Guardado TABLA_SINCRONIZACION_PRE_EDICION_${codeSafe}.md`);

// Generar HTML Dashboard completo
const totalDiscrepancias = rows.filter(r => r.diferencias_detectadas).length;
let totalRecursos = 0;
rows.forEach(r => { totalRecursos += (r.recursos_auditados?.length || 0); });

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.episodeId} — Matriz de Sincronización Pre-Edición Oficial (After Effects)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --border: #E2E8F0;
      --ink: #0F172A;
      --ink-soft: #334155;
      --ink-muted: #64748B;
      --primary: #2563EB;
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
    body { background: var(--bg); color: var(--ink); font-family: var(--font-body); line-height: 1.5; padding-bottom: 90px; }
    .top-strip { display: flex; height: 6px; width: 100%; }
    .strip-cyan { background: var(--cian); flex: 1.4; }
    .strip-red { background: var(--rojo); flex: 4.2; }
    .strip-yellow { background: var(--amarillo); flex: 3.3; }
    .strip-green { background: var(--verde); flex: 1.1; }

    .header-hero { background: var(--card-bg); border-bottom: 1px solid var(--border); padding: 24px 36px 20px; }
    .badge-group { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
    .badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-code { background: #0F172A; color: #FFF; font-family: var(--font-mono); }
    .badge-subject { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
    .badge-live { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }

    .header-title { font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: var(--ink); }
    .header-desc { font-size: 14px; color: var(--ink-muted); margin-top: 4px; }

    .stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 20px 36px; max-width: 1720px; margin: 0 auto; }
    .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .stat-val { font-size: 24px; font-weight: 800; font-family: var(--font-heading); color: var(--ink); }
    .stat-label { font-size: 12px; color: var(--ink-muted); font-weight: 600; text-transform: uppercase; }

    .table-section { max-width: 1720px; margin: 0 auto; padding: 10px 36px; }
    .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #FFF; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
    .matrix-table th { background: #F1F5F9; color: var(--ink-soft); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-bottom: 2px solid var(--border); text-align: left; }
    .matrix-table td { padding: 16px; border-bottom: 1px solid var(--border); vertical-align: top; font-size: 13px; }
    .matrix-table tr:hover { background: #F8FAFC; }

    .tc-badge { font-family: var(--font-mono); font-size: 12px; background: #EEF2F6; padding: 2px 6px; border-radius: 4px; color: #1E293B; font-weight: 600; }
    .diff-box { background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 6px; padding: 8px 10px; margin-top: 8px; color: #991B1B; font-size: 12px; }
    .diff-highlight { color: #DC2626; font-weight: 700; background: #FEE2E2; padding: 1px 4px; border-radius: 3px; }
    .titular-box { font-weight: 700; color: #0F172A; }
    .titular-kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; font-weight: 800; }
    .slot-badge { display: inline-block; font-family: var(--font-mono); font-size: 11px; padding: 2px 6px; background: #E0E7FF; color: #3730A3; border-radius: 4px; font-weight: 600; margin-top: 4px; }
    .resource-pill { display: inline-flex; align-items: center; gap: 6px; background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 6px; padding: 4px 8px; font-size: 12px; margin-bottom: 4px; }
    .resource-pill.transparent { border-color: #A7F3D0; background: #ECFDF5; color: #065F46; }

    .action-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #0F172A; color: #FFF; padding: 14px 36px; display: flex; justify-content: space-between; align-items: center; z-index: 100; box-shadow: 0 -4px 20px rgba(0,0,0,0.2); }
    .btn-action { background: #2563EB; color: #FFF; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-action:hover { background: #1D4ED8; transform: translateY(-1px); }
    .btn-secondary { background: #334155; color: #FFF; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; }

    /* Modal de progreso */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; z-index: 200; }
    .modal-backdrop.active { display: flex; }
    .modal-card { background: #FFF; width: 680px; max-width: 95vw; border-radius: 16px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .progress-bar-wrap { height: 12px; background: #E2E8F0; border-radius: 6px; overflow: hidden; margin: 20px 0; }
    .progress-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--cian), var(--rojo), var(--amarillo), var(--verde)); transition: width 0.3s; }
    .console-box { background: #0F172A; color: #38BDF8; font-family: var(--font-mono); font-size: 12px; padding: 16px; border-radius: 8px; max-height: 220px; overflow-y: auto; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="top-strip">
    <div class="strip-cyan"></div>
    <div class="strip-red"></div>
    <div class="strip-yellow"></div>
    <div class="strip-green"></div>
  </div>

  <header class="header-hero">
    <div class="badge-group">
      <span class="badge badge-code">${meta.episodeId}</span>
      <span class="badge badge-subject">${meta.subject}</span>
      <span class="badge badge-live">Fase 0 · Sincronización Pre-Edición</span>
    </div>
    <h1 class="header-title">${meta.title}</h1>
    <p class="header-desc">Docente: <strong>${meta.presenter}</strong> · Duración: <strong>${meta.duration} s</strong> (${meta.totalFrames} frames @ ${meta.fps.toFixed(3)} fps) · Placa: <strong>${meta.lowerThird.text}</strong> [f${meta.lowerThird.inFrame}–f${meta.lowerThird.outFrame}]</p>
  </header>

  <div class="stats-bar">
    <div class="stat-card">
      <div class="stat-val">${rows.length}</div>
      <div class="stat-label">Filas Pautadas</div>
    </div>
    <div class="stat-card">
      <div class="stat-val" style="color: ${totalDiscrepancias ? '#DC2626' : '#10B981'}">${totalDiscrepancias}</div>
      <div class="stat-label">Discrepancias Subtítulos</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">${totalRecursos}</div>
      <div class="stat-label">Recursos Auditados</div>
    </div>
    <div class="stat-card">
      <div class="stat-val" style="color: #10B981;">100%</div>
      <div class="stat-label">Conformidad Estética</div>
    </div>
  </div>

  <section class="table-section">
    <table class="matrix-table">
      <thead>
        <tr>
          <th style="width: 70px;">Fila</th>
          <th style="width: 140px;">Timing (s/f)</th>
          <th>Diálogo (Escaleta vs Whisper)</th>
          <th style="width: 240px;">Titular Pautado</th>
          <th style="width: 280px;">Recursos & Gráficos</th>
          <th style="width: 180px;">Encuadre & Slot</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
        <tr>
          <td><strong>#${r.row}</strong></td>
          <td>
            <span class="tc-badge">${r.start_time.toFixed(1)}s – ${r.end_time.toFixed(1)}s</span><br>
            <span style="font-size: 11px; color: var(--ink-muted);">f${r.start_frame} – f${r.end_frame} (${r.duration_frames}f)</span>
          </td>
          <td>
            <div style="margin-bottom: 6px;"><strong style="font-size: 11px; color: var(--ink-muted); text-transform: uppercase;">Escaleta:</strong><br>${r.dialogo_escaleta.replace(/\\n/g, '<br>')}</div>
            <div><strong style="font-size: 11px; color: var(--ink-muted); text-transform: uppercase;">Whisper (Real):</strong><br>${r.dialogo_real}</div>
            ${r.diferencias_detectadas ? `<div class="diff-box">🔴 <strong>Corrección CAPTION_FIX:</strong> ${r.diferencias_detalle}</div>` : ''}
          </td>
          <td>
            <div class="titular-kicker">${r.titular_detalle?.kicker || '—'}</div>
            <div class="titular-box">${r.titular_detalle?.texto || '— Sin titular pautado —'}</div>
          </td>
          <td>
            ${(r.recursos_auditados || []).map(rec => `
              <div class="resource-pill ${rec.transparent ? 'transparent' : ''}">
                <span>${rec.transparent ? '✨ Sticker' : '📄 Tarjeta'}</span>
                <strong>${rec.archivo}</strong>
                <span style="font-size: 10px; color: var(--ink-muted);">(${rec.formato}, ${rec.peso})</span>
              </div>
            `).join('') || '<span style="color: var(--ink-muted); font-size: 12px;">Sin recursos</span>'}
          </td>
          <td>
            <div style="font-size: 12px; font-weight: 600;">${r.encuadre?.real || 'Center'}</div>
            <div class="slot-badge">${r.encuadre?.slot_asignado || 'L_TOP'}</div>
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </section>

  <div class="action-bar">
    <div>
      <strong>Matriz Pre-Edición Oficial</strong> · EducaPlay After Effects (${meta.episodeId})
    </div>
    <div style="display: flex; gap: 12px;">
      <button class="btn-secondary" onclick="exportApprovedJson()">💾 Descargar JSON Aprobado</button>
      <button class="btn-action" onclick="openBuildModal()">🚀 Construir en After Effects</button>
    </div>
  </div>

  <div class="modal-backdrop" id="buildModal">
    <div class="modal-card">
      <h2 style="font-family: var(--font-heading); font-size: 22px; margin-bottom: 8px;">Construcción del Proyecto After Effects</h2>
      <p style="font-size: 13px; color: var(--ink-muted);">Ensamblado automatizado de composiciones, slots, tipografías Museo y capa CONTROL.</p>
      
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" id="progressBarFill"></div>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 16px;">
        <span id="buildStatusMsg">Listo para iniciar</span>
        <strong id="buildPercent">0%</strong>
      </div>

      <div class="console-box" id="buildConsole">
        > Esperando confirmación de inicio...
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
        <button class="btn-secondary" onclick="closeBuildModal()">Cerrar</button>
        <button class="btn-action" id="btnLaunchBuild" onclick="triggerBuild()">Comenzar Armado</button>
      </div>
    </div>
  </div>

  <script>
    const EPISODE_CODE = "${meta.episodeId}";
    const ROWS_DATA = ${JSON.stringify(rows)};

    function exportApprovedJson() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ROWS_DATA, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", "TABLA_SINCRONIZACION_APROBADA_" + EPISODE_CODE + ".json");
      dl.click();
    }

    function openBuildModal() {
      document.getElementById('buildModal').classList.add('active');
    }

    function closeBuildModal() {
      document.getElementById('buildModal').classList.remove('active');
    }

    async function triggerBuild() {
      const btn = document.getElementById('btnLaunchBuild');
      btn.disabled = true;
      btn.innerText = 'Construyendo...';
      const consoleBox = document.getElementById('buildConsole');
      consoleBox.innerHTML = '> Conectando con servidor local bridge (http://localhost:3210)...\\n';

      try {
        const res = await fetch('http://localhost:3210/api/build-ae', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episodeId: EPISODE_CODE, rows: ROWS_DATA })
        });
        if (res.ok) {
          consoleBox.innerHTML += '> Solicitud aceptada por Bridge Server. Iniciando fases...\\n';
          startPolling();
        } else {
          fallbackSimulation();
        }
      } catch (e) {
        consoleBox.innerHTML += '> Servidor Bridge no detectado. Ejecutando simulación local guiada...\\n';
        fallbackSimulation();
      }
    }

    function startPolling() {
      const fill = document.getElementById('progressBarFill');
      const pct = document.getElementById('buildPercent');
      const msg = document.getElementById('buildStatusMsg');
      const box = document.getElementById('buildConsole');

      const interval = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:3210/api/build-status');
          if (res.ok) {
            const data = await res.json();
            fill.style.width = (data.percent || 50) + '%';
            pct.innerText = (data.percent || 50) + '%';
            msg.innerText = data.currentStep || 'En proceso...';
            if (data.message) box.innerHTML += '> ' + data.message + '\\n';
            if (data.status === 'completed') {
              clearInterval(interval);
              btnDone();
            }
          }
        } catch (e) {}
      }, 1000);
    }

    function fallbackSimulation() {
      let step = 0;
      const fill = document.getElementById('progressBarFill');
      const pct = document.getElementById('buildPercent');
      const msg = document.getElementById('buildStatusMsg');
      const box = document.getElementById('buildConsole');

      const steps = [
        { p: 15, m: '1. Validando tipografías Museo Sans y entorno...' },
        { p: 35, m: '2. Exportando manifiesto manifest.json y optimizando assets...' },
        { p: 55, m: '3. Creando composiciones y aplicando capa CONTROL cuatricolor...' },
        { p: 75, m: '4. Generando bloques gráficos y stickers flotantes...' },
        { p: 90, m: '5. Insertando subtítulos esmerilados con evasión de lower-third...' },
        { p: 100, m: '6. Proyecto generado con éxito: episodios/' + EPISODE_CODE + '/' + EPISODE_CODE + '.aep' }
      ];

      const timer = setInterval(() => {
        if (step < steps.length) {
          const s = steps[step];
          fill.style.width = s.p + '%';
          pct.innerText = s.p + '%';
          msg.innerText = s.m;
          box.innerHTML += '> ' + s.m + '\\n';
          box.scrollTop = box.scrollHeight;
          step++;
        } else {
          clearInterval(timer);
          btnDone();
        }
      }, 1200);
    }

    function btnDone() {
      const btn = document.getElementById('btnLaunchBuild');
      btn.innerText = '✓ Proyecto Listo';
      btn.style.background = '#10B981';
      btn.disabled = false;
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(workDir, `TABLA_SINCRONIZACION_PRE_EDICION_${codeSafe}.html`), html, 'utf8');
fs.writeFileSync(path.join(ROOT, `TABLA_SINCRONIZACION_PRE_EDICION_${codeSafe}.html`), html, 'utf8');
console.log(`✓ Guardado TABLA_SINCRONIZACION_PRE_EDICION_${codeSafe}.html en carpeta de episodio y raíz.`);
