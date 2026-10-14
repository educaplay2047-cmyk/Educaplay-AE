/**
 * AMB26-04 — ¿Esperar o evacuar?
 * Educación Ambiental Integral · EducaPlay Secundaria (Corrientes)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. COREOGRAFÍA DEL MÁSTER (medido con track-presenter @ 23.976 fps, 3136 frames)
 *    · 0–526:        none (bumper EducaPlay de inicio + evidencia documental con voz en off)
 *    · 526–2945:     center (docente centrada: x 712–1360, bandas laterales libres ~640px)
 *    · 2945–3069:    transition [move]
 *    · 3069–3136:    none (placa institucional de cierre EducaPlay)
 *
 * 2. RANGO DE LOS RECURSOS
 *    · didactico: 1.mp4 (registro documental de inundación en Corrientes),
 *                7.png (sticker transparente de peligro eléctrico en tomacorrientes),
 *                11.png (evidencia de corrientes y calles anegadas).
 *    · refuerzo:  2.png (sticker transparente riesgo/alerta),
 *                3.mov (lluvia torrencial ProRes),
 *                4.mp4 (desagües pluviales funcionando),
 *                5.jfif (tablero y calzado de goma aislante),
 *                6.jfif (electrodomésticos y bienes en altura),
 *                8.jpg (crecidas prolongadas en zonas ribereñas),
 *                9.jfif (evacuación prioritaria y mascotas con correa),
 *                10.png (desplazamiento a pie hacia centro de evacuación).
 *
 * 3. RECTS QUEMADOS
 *    · Marca de agua EducaPlay: [1400, 35, 420, 140], vigente en todo el video (f0 a f3136).
 *    · Placa de nombre: [79, 818, 550, 110], 'Prof. Amparo Pérez Rueda', f537 a f661.
 *
 * 4. LO QUE LA ESCALETA PIDE Y EL MÁSTER NO TRAE
 *    · Fila 1 pauta voz en off con recurso 1 a pantalla completa con epígrafe documental;
 *      el corte del montajista cubre f0 a f510 con fondo verde institucional hasta que
 *      entra la docente a f526. El recurso 1 se monta a sangre (bleed: true).
 *    · Fila 2 pauta titular "La prevención comienza cuando sabemos reconocer el peligro"
 *      a pantalla completa 2s; se monta en f510-f577 en slot superior para no pisar
 *      la entrada de la placa de nombre a f537.
 *
 * 5. CORRECCIONES DE TRANSCRIPCIÓN (CAPTION_FIX)
 *    · Normalización de "corta la luz" a "cortá la luz" (voseo imperativo).
 *    · Normalización de "defensa civil" a "Defensa Civil" (nombre institucional oficial).
 *    · Normalización de "Prioriza" a "Priorizá" (voseo imperativo docente).
 *    · Normalización de "Llévalas con correa o transportadores." a "Llevalas con correa o transportadora.".
 *    · Normalización de "comunícate" a "comunicate" (voseo).
 *    · Normalización de "con el 100 de bomberos" a "con el 100 de Bomberos".
 *    · Normalización de cierre a "¡Compartí esta información para cuidarnos entre todos!".
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type {EpisodeData, Block, SlotSpec, ReservedRect} from '../types.ts';
import {applyCaptionFixes, type CaptionFix} from '../captionFix.ts';
import {TRACK} from './track.ts';
import {CAPTIONS as RAW_CAPTIONS} from './captions.ts';
import {CUES} from './cues.ts';

export {TRACK};

export const FPS = TRACK.fps;
export const DURATION = TRACK.durationInFrames;

export const EPISODE = {
  id: 'AMB26-04',
  title: '¿Esperar o evacuar?',
  series: 'Educación Ambiental Integral',
  objective:
    'Fomentar una cultura de prevención y cuidado, incorporando conocimientos y prácticas para reducir riesgos ante una inundación.',
  master: 'videos/AMB26-04.mp4',
  voiceGain: 1,
  intervention: 4 as const,
};

export const RESERVED: ReservedRect[] = [
  {key: 'watermark', rect: [1400, 35, 420, 140] as const, from: 0, to: DURATION},
  {key: 'placa-nombre', rect: [79, 818, 550, 110] as const, from: 537, to: 661},
];

const cueFrame = (key: string): number => {
  const c = CUES[key];
  if (!c) throw new Error(`Falta cue ${key} en cues.ts`);
  return c.f;
};

export const M = {
  evacuar: cueFrame('evacuar'),
  saber: cueFrame('saber'),
  fundamental: cueFrame('fundamental'),
  lluvias: cueFrame('lluvias'),
  rapido: cueFrame('rapido'),
  desagues: cueFrame('desagues'),
  funcionando: cueFrame('funcionando'),
  corta_luz: cueFrame('corta_luz'),
  manos_secas: cueFrame('manos_secas'),
  subi_objetos: cueFrame('subi_objetos'),
  altos: cueFrame('altos'),
  subiendo: cueFrame('subiendo'),
  abandonar: cueFrame('abandonar'),
  vivis_rio: cueFrame('vivis_rio'),
  lugar_seguro: cueFrame('lugar_seguro'),
  defensa_ordena: cueFrame('defensa_ordena'),
  prioriza: cueFrame('prioriza'),
  mascotas: cueFrame('mascotas'),
  sali_caminando: cueFrame('sali_caminando'),
  jamas_cruzar: cueFrame('jamas_cruzar'),
  fuerte: cueFrame('fuerte'),
  no_podes: cueFrame('no_podes'),
  defensa_civil: cueFrame('defensa_civil'),
  tel_103: cueFrame('tel_103'),
  tel_100: cueFrame('tel_100'),
  bomberos: cueFrame('bomberos'),
  evaluar: cueFrame('evaluar'),
  seguridad: cueFrame('seguridad'),
  comparti: cueFrame('comparti'),
} as const;

export const MARKS = M;

// Slots disjuntos para titulares y recursos laterales
const L_TOP: Partial<SlotSpec> = {align: 'top', maxHeight: 200, side: 'opposite'};
const L_BOTTOM: Partial<SlotSpec> = {align: 'bottom', maxHeight: 380, side: 'opposite'};
const L_SIDE_LEFT: Partial<SlotSpec> = {align: 'center', maxHeight: 420, side: 'left'};
const L_SIDE_RIGHT: Partial<SlotSpec> = {align: 'center', maxHeight: 420, side: 'right'};

export const BLOCKS: readonly Block[] = [
  // ── Fila 1 de la escaleta: Inundaciones en Corrientes (Voz en off) ───────────
  {
    kind: 'video',
    key: 'video-inundacion-corrientes',
    rank: 'didactico',
    from: 0,
    to: M.evacuar,
    src: 'AMB26-04/1.mp4',
    bleed: true,
    caption:
      "Youtube - Extreme Storm Brings Record Rain To Argentina's Corrientes As Homes Flooded Out | Watch Video",
    carga: 'alta',
  },

  // ── Fila 2 de la escaleta: Titular de impacto inicial ───────────────────────
  {
    kind: 'titular',
    key: 'titular-prevencion-peligro',
    rank: 'didactico',
    from: M.evacuar,
    to: M.fundamental,
    title: 'La prevención comienza cuando sabemos reconocer el peligro',
    slot: {align: 'top', maxHeight: 200, side: 'opposite'},
  },

  // ── Fila 3 de la escaleta: Identificar el riesgo (Sticker transparente) ────
  {
    kind: 'photo',
    key: 'sticker-identificar-riesgo',
    rank: 'refuerzo',
    from: M.fundamental,
    to: M.lluvias,
    src: 'AMB26-04/2.png',
    transparent: true,
    carga: 'baja',
    slot: {align: 'top', maxHeight: 300, side: 'left'},
  },

  // ── Fila 4 de la escaleta: Lluvias torrenciales y desagües ──────────────────
  {
    kind: 'video',
    key: 'video-lluvias-torrenciales',
    rank: 'refuerzo',
    from: M.lluvias,
    to: M.desagues,
    src: 'AMB26-04/3.mov',
    carga: 'media',
    slot: L_SIDE_RIGHT,
  },
  {
    kind: 'video',
    key: 'video-desagues-funcionando',
    rank: 'refuerzo',
    from: M.desagues,
    to: M.corta_luz,
    src: 'AMB26-04/4.mp4',
    carga: 'media',
    slot: L_SIDE_RIGHT,
  },

  // ── Fila 5 de la escaleta: Cortar la luz y Subir objetos de valor ───────────
  {
    kind: 'titular',
    key: 'titular-cortar-luz',
    rank: 'didactico',
    from: M.corta_luz,
    to: M.subi_objetos,
    title: 'Cortar la luz',
    slot: L_TOP,
  },
  {
    kind: 'photo',
    key: 'foto-tablero-calzado',
    rank: 'refuerzo',
    from: M.corta_luz,
    to: M.subi_objetos,
    src: 'AMB26-04/5.jfif',
    carga: 'media',
    slot: L_BOTTOM,
  },
  {
    kind: 'titular',
    key: 'titular-subir-objetos',
    rank: 'didactico',
    from: M.subi_objetos,
    to: M.subiendo,
    title: 'Subir objetos de valor',
    slot: L_TOP,
  },
  {
    kind: 'photo',
    key: 'foto-electrodomesticos-altos',
    rank: 'refuerzo',
    from: M.subi_objetos,
    to: M.subiendo,
    src: 'AMB26-04/6.jfif',
    carga: 'media',
    slot: L_BOTTOM,
  },

  // ── Fila 6 de la escaleta: Peligro real en tomacorrientes (Sticker) ─────────
  {
    kind: 'titular',
    key: 'titular-peligro',
    rank: 'didactico',
    from: M.subiendo,
    to: M.vivis_rio,
    title: 'Peligro',
    slot: L_TOP,
  },
  {
    kind: 'photo',
    key: 'sticker-peligro-tomacorrientes',
    rank: 'didactico',
    from: M.subiendo,
    to: M.vivis_rio,
    src: 'AMB26-04/7.png',
    transparent: true,
    carga: 'media',
    slot: L_BOTTOM,
  },

  // ── Fila 7 de la escaleta: Evacuación de zonas ribereñas ────────────────────
  {
    kind: 'titular',
    key: 'titular-zonas-riberenas',
    rank: 'didactico',
    from: M.vivis_rio,
    to: M.defensa_ordena,
    title: 'Evacuación de zonas ribereñas',
    slot: L_TOP,
  },
  {
    kind: 'photo',
    key: 'foto-crecida-rio',
    rank: 'refuerzo',
    from: M.vivis_rio,
    to: M.defensa_ordena,
    src: 'AMB26-04/8.jpg',
    carga: 'media',
    slot: L_BOTTOM,
  },

  // ── Fila 8 de la escaleta: Evacuá rápido, con calma y sin usar vehículos ────
  {
    kind: 'titular',
    key: 'titular-evacua-rapido',
    rank: 'didactico',
    from: M.defensa_ordena,
    to: M.jamas_cruzar,
    title: 'Evacuá rápido, con calma y sin usar vehículos',
    slot: L_TOP,
  },
  {
    kind: 'photo',
    key: 'foto-mascotas-correa',
    rank: 'refuerzo',
    from: M.prioriza,
    to: 2224,
    src: 'AMB26-04/9.jfif',
    carga: 'media',
    slot: L_BOTTOM,
  },
  {
    kind: 'photo',
    key: 'foto-centro-evacuacion',
    rank: 'refuerzo',
    from: 2224,
    to: M.jamas_cruzar,
    src: 'AMB26-04/10.png',
    carga: 'media',
    slot: L_BOTTOM,
  },

  // ── Fila 9 de la escaleta: Calles anegadas y teléfonos de emergencia ────────
  {
    kind: 'photo',
    key: 'foto-calles-anegadas',
    rank: 'didactico',
    from: M.jamas_cruzar,
    to: M.no_podes,
    src: 'AMB26-04/11.png',
    carga: 'media',
    slot: L_SIDE_RIGHT,
  },
  {
    kind: 'titular',
    key: 'titular-telefonos-emergencia',
    rank: 'didactico',
    from: M.no_podes,
    to: M.evaluar,
    kicker: 'TELÉFONOS IMPORTANTES',
    title: '103 Defensa Civil · 100 Bomberos',
    slot: {align: 'center', maxHeight: 240, side: 'opposite'},
  },


];

export const CAPTION_FIX: readonly CaptionFix[] = [
  {find: 'corta la luz', replace: 'cortá la luz', why: 'voseo imperativo'},
  {find: 'defensa civil', replace: 'Defensa Civil', why: 'nombre oficial'},
  {find: 'Prioriza', replace: 'Priorizá', why: 'voseo docente'},
  {
    find: 'Llévalas con correa o transportadores.',
    replace: 'Llevalas con correa o transportadora.',
    why: 'locución real y guion',
  },
  {find: 'comunícate', replace: 'comunicate', why: 'voseo argentino'},
  {find: 'con el 100 de bomberos', replace: 'con el 100 de Bomberos', why: 'mayúscula institucional'},
  {
    find: 'Compartí esta información para cuidarnos entre todos.',
    replace: '¡Compartí esta información para cuidarnos entre todos!',
    why: 'signos de exclamación según escaleta',
  },
];

export const CAPTIONS = applyCaptionFixes(RAW_CAPTIONS, CAPTION_FIX);

export const CAPTION_AVOID = [
  {from: 510, to: 673, bottom: 270, why: 'placa de nombre Prof. Amparo Pérez Rueda'},
];

export const TITULARES: any[] = [];
export const TITULAR_SLOT = {side: 'opposite', align: 'top', maxWidth: 600, maxHeight: 300} as const;
export const READING_SLOT = {side: 'opposite', align: 'center', maxWidth: 560, maxHeight: 620} as const;
export const READING = {from: 0, to: 0, title: '', paragraphs: [], terms: []};
export const TERMS: any[] = [];
export const CARDS = null;
export const CARDS_SLOT = null;
export const CAPTION_MUTE: any[] = [];
export const STILLS: any[] = [];

const data: EpisodeData = {
  FPS,
  DURATION,
  EPISODE,
  TRACK,
  RESERVED,
  MARKS,
  BLOCKS,
  CAPTION_MUTE,
  CAPTION_AVOID,
  CAPTIONS,
  STILLS,
  TITULARES,
  TITULAR_SLOT,
  READING_SLOT,
  READING,
  TERMS,
};

export default data;
