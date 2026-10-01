---
trigger: glob
globs: **/src/episodes/**/*.ts
description: Qué archivos de un episodio se escriben a mano y cuáles los pisan los scripts.
---

En `src/episodes/<CODE>/` hay un solo archivo escrito a mano: **`data.ts`**.

Estos los **generan los scripts** y los reescriben en cada corrida de `npm run prep`:

    track.ts   cues.ts   captions.ts   words.json   track.frames.json

Editarlos no da error: la corrección simplemente desaparece en la próxima corrida y el error vuelve
al video sin que nadie se entere. Si hay que corregir algo de ahí, se declara como **dato del
episodio** en `data.ts`:

- correcciones de transcripción → `CAPTION_FIX` / `CAPTION_FIXES`, que se aplican sobre los
  subtítulos generados;
- frames de marcas → `cues.def.json` más `npm run cues`, nunca un número escrito a ojo.

Antes de escribir un `data.ts` nuevo, mirá las plantillas de
`.agents/skills/educaplay-episodios/reference/`: `blocks-template.ts` para un episodio nuevo,
`data-template.ts` para los ya montados en la forma v1.
