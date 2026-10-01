/**
 * PLANTILLA de data.ts — forma v1 (la de "Leo, Comprendo y Aprendo").
 *
 * Exporta símbolos sueltos y bloques con nombre fijo; Root.tsx hace
 * `import * as <CODE>`. Para un episodio NUEVO usar `blocks-template.ts`
 * (forma v2, la de Ambiente): es más general y trae `applyCaptionFixes`.
 * Ésta sirve para trabajar sobre LEO016 o cualquier episodio ya montado así.
 *
 * Copiar a src/episodes/<CODE>/data.ts y completar. Es el ÚNICO archivo que se
 * escribe a mano: track.ts, cues.ts, captions.ts y words.json los generan los
 * scripts y los pisan en cada corrida.
 *
 * Orden de trabajo:
 *   1. el máster en DOS lugares: donde lo miden los scripts y
 *      public/videos/<CODE>.mp4 (lo renderiza Remotion)
 *   2. cues.def.json — las palabras-gatillo que pide la escaleta
 *   3. npm run prep -- <CODE>
 *   4. LEER la tabla de cues, y buscar cada palabra-gatillo en words.json:
 *      una palabra puede no decirse nunca, y un fragmento entero puede no
 *      haberse grabado. Un score de 1.00 no valida el cue.
 *   5. completar este archivo, con una cabecera que documente las decisiones
 *      editoriales del episodio
 *   6. sumar una línea al array de episodios de src/Root.tsx
 */
import type {ReservedRect} from '../../layout/presenter.ts';
import type {PictoName} from '../../components/Pictogram.tsx';
import {TRACK} from './track.ts';
import {CUES} from './cues.ts';
import {CAPTIONS as CAPTIONS_RAW} from './captions.ts';

export {TRACK};

export const FPS = 25;
/**
 * De `ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames`.
 * Tiene que coincidir con TRACK.durationInFrames o las Sequence quedan colgando.
 */
export const DURATION = 0;

export const EPISODE = {
  id: 'LEO0XX',
  title: '',
  series: 'Leo, Comprendo y Aprendo',
  objective: '',
  master: 'videos/LEO0XX.mp4',
} as const;

const cue = (k: string): number => {
  const c = CUES[k];
  if (!c) throw new Error(`Cue sin resolver: ${k} — corré align-cues.mjs`);
  return c.f;
};

/**
 * Rects quemados que el máster trae y ningún gráfico puede pisar.
 * La marca de agua la agrega el tracker; acá van los específicos del corte,
 * que NO se infieren y cambian de episodio a episodio.
 *
 * Para encontrar la ventana de la placa de nombre:
 *   ffmpeg -ss <t> -i <máster> -frames:v 1 -vf crop=... y mirar.
 * El nombre que dice la placa es el que va: NUNCA el de la escaleta.
 */
export const RESERVED: ReservedRect[] = [
  {key: 'lowerThird', rect: [140, 860, 720, 150], from: 180, to: 440},
];

/**
 * Marcas del episodio, todas ancladas a una palabra del audio.
 * Nunca poner un número a ojo: si no hay cue, es que falta declararlo.
 */
export const MARKS = {
  bumper: 0,
  contenido: 0,   // primer frame del segmento del profesor (del track)
  // …
  credits: 0,
  end: DURATION,
} as const;

/**
 * maxHeight NO es cosmético: sin él la caja baja hasta donde el profesor
 * gesticula y la banda libre cae de ~700px a 376px.
 *
 * Y 300 es un borde de franja, no un número redondo: con 301 entra la franja
 * de las manos abiertas y la banda cae de 680px a 424px. Medir con el probe
 * de resolveSlot() antes de subirlo.
 */
export const TITULAR_SLOT = {
  side: 'opposite',
  align: 'top',
  maxWidth: 600,
  maxHeight: 300,
} as const;

/**
 * overPaper: el panel no entra en la banda segura y no puede — el texto ya
 * está en 26px y la escaleta exige mostrarlo completo. El permiso viene con
 * un contrato: lo que cuelgue por debajo de paperBandY va en TINTA OSCURA,
 * nunca en blanco. Sobre el papel del fondo, una tarjeta blanca no existe.
 */
export const READING_SLOT = {
  side: 'opposite',
  align: 'top',
  maxWidth: 1010,
  maxHeight: 780,
  overPaper: true,
} as const;

/** align 'bottom' + maxHeight fijo ya clava el tope: paperBandY − maxHeight. */
export const CARDS_SLOT = {
  side: 'opposite',
  align: 'bottom',
  maxWidth: 600,
  maxHeight: 400,
} as const;

export const MAPPING_SLOT = {
  side: 'opposite',
  align: 'top',
  maxWidth: 600,
  maxHeight: 300,
} as const;

export const CHIPS_SLOT = {
  side: 'opposite',
  align: 'top',
  maxWidth: 600,
  maxHeight: 160,
} as const;

export type Titular = {
  key: string;
  from: number;
  to: number;
  /** Contexto, NO repetir "Paso N" — eso ya lo dice la pastilla. */
  kicker?: string;
  title: string;
  step?: 1 | 2 | 3 | 4 | 5;
  /**
   * Nombre de un pictograma de src/components/Pictogram.tsx.
   * Si la escaleta pide un recurso que no existe ahí, hay que AGREGARLO al
   * union PictoName y dibujar sus paths. No es automático.
   */
  resource?: PictoName;
  /** Ilustración generada (npm run img). Excluyente con `resource`. */
  hero?: string;
  side?: 'opposite' | 'widest' | 'left' | 'right';
};

/** Mínimo 60 frames cada uno; check:layout lo verifica. */
export const TITULARES: Titular[] = [];

/**
 * Panel de lectura. Los términos se marcan por TOKEN, no por índice de
 * palabra: si alguien edita el párrafo, el resaltado sigue cayendo donde debe.
 *
 * Cuerpo 26px es el piso de legibilidad del sistema y el máximo que entra en
 * el slot. Si el texto es más largo, bajar a 25 antes que achicar el panel.
 *
 * `steps`: si un titular cae mientras el panel está arriba, NO puede ser una
 * tarjeta aparte — quedaría tapado. Viaja acá, en la banda de pie del panel.
 */
export const READING = {
  from: 0,
  to: 0,
  kicker: '',
  title: '',
  paragraphs: [] as string[],
  source: '',
  /** Frame de la palabra "pausá" si el docente la dice; si no, omitir. */
  pauseAt: undefined as number | undefined,
  /** 26 px entra en el slot estándar. Bajar a 25 si el texto es más largo. */
  fontSize: 26,
  /** Pictograma del encabezado del panel. */
  icon: undefined as PictoName | undefined,
  steps: [] as readonly {step: number; title: string; from: number; to: number}[],
  /** ≥50 frames encendido cada uno, y ≥75 de texto quieto antes del primero. */
  terms: [] as {token: string; at: number}[],
} as const;

export const TERMS = [] as readonly {word: string; definition: string}[];

/** Fichas: cuándo entran y en qué frame se dan vuelta. Omitir si no hay. */
export const CARDS = {from: 0, to: 0, flipAt: 0} as const;

/** El par «como se dice» ➞ «cómo se llama». Omitir si el episodio no lo pide. */
export const MAPPING = {
  from: 0,
  to: 0,
  kicker: '',
  resource: undefined as PictoName | undefined,
  hero: undefined as string | undefined,
  rows: [] as readonly {plain: string; term: string; at: number}[],
} as const;

/** Pastillas que entran sobre la palabra dicha. */
export const CHIPS = {
  from: 0,
  to: 0,
  chips: [] as readonly {label: string; at: number}[],
} as const;

export type Caption = {from: number; to: number; text: string};

/**
 * Correcciones de transcripción. Whisper normaliza al español peninsular
 * ("quédate", "léelo") y el público es correntino — pero además INVENTA
 * palabras que se queman en el video: "negros" por "métodos", "Aquí" por
 * "¿A qué". Leer los subtítulos generados enteros; esperar uno o dos por
 * episodio.
 *
 * Se corrige ortografía de lo que SE DICE, nunca el contenido: si la escaleta
 * y el audio difieren, manda el audio.
 *
 * OJO: esta forma con .reduce() no avisa si un fix deja de matchear. La v2
 * usa applyCaptionFixes(), que lanza. Conviene portarlo.
 */
const CAPTION_FIXES: readonly (readonly [string, string])[] = [];
export const CAPTIONS: Caption[] = CAPTIONS_RAW.map((c) => ({
  ...c,
  text: CAPTION_FIXES.reduce((t, [find, rep]) => t.split(find).join(rep), c.text),
}));

/**
 * Dónde termina de dibujar el panel DE VERDAD, si cuelga fuera de su slot.
 * Su caja corta en el borde del área segura (1008) pero el pie llega a 1054:
 * sin declararlo, el verificador deja pasar un subtítulo encima de las
 * pastillas. Medirlo sobre la capa alpha: remotion still <CODE>-Overlays
 */
export const READING_FOOT_Y = 1054;

/**
 * Tramos donde la banda de subtítulos se corre para no pisar un gráfico o un
 * rect quemado. Elegir UNA ventana por tramo, no la ventana justa de cada
 * bloque, o el subtítulo salta tres veces seguidas.
 */
export const CAPTION_AVOID = [] as readonly {
  from: number;
  to: number;
  bottom?: number;
  left?: number;
  right?: number;
}[];

/** Bordes de encuadre (del track) + un pico por bloque. */
export const STILLS: number[] = [];
