---
name: educaplay-motion-graphics
description: |
  Guía integral y estándar técnico unificado para la creación, animación, diseño visual, tracking, sincronización pre-edición y exportación de Motion Graphics en Remotion para los episodios educativos de EducaPlay Secundaria (Corrientes). Usar al diseñar, maquetar, animar, corregir o renderizar cualquier episodio de cualquier materia (Matemática, Lengua/Leo, Ambiente, Economía, Historia, etc.): coreografía según la posición del docente, ceja cromática cuatricolor obligatoria, tipografía oficial Museo y Museo Sans, stickers flotantes transparentes sin tarjetas de fondo, titulares literales sin kickers inventados, contraste WCAG AAA, exportación obligatoria de canal alfa ProRes 4444 (.mov) con --image-format=png, y tablero interactivo de sincronización con registro de correcciones y guardado en disco.
allowed-tools: Bash(npm run *), Bash(node *), Bash(npx remotion *), Bash(ffmpeg *), Bash(ffprobe *)
---

# EducaPlay Motion Graphics — Estándar Técnico y Sistema Visual Unificado

Esta skill condensa el estándar oficial, reglas de oro, patrones de diseño estético, protocolos de pre-edición y el motor de producción de **Motion Graphics educativos en Remotion** dentro del ecosistema de **EducaPlay Secundaria**.

---

## 1. Principios Fundamentales del Sistema

### 1.1. Categorización de Carga de Atención y Coreografía Dual
La interacción entre el docente y los motion graphics se rige de forma estricta por el nivel de atención que demanda el contenido pedagógico. Antes de animar, cada recurso debe clasificarse en una de estas tres categorías operativas:

1. **Recursos con Baja Carga de Atención (Stickers, Emojis y Titulares Cortos)**:
   - **Contenido**: Emojis animados, stickers ilustrativos (GIFs/PNG transparentes), palabras clave o titulares de 1 o 2 líneas breves.
   - **Comportamiento del Docente**: El docente **permanece en el centro** de la pantalla (`framing: 'center'`).
   - **Ubicación del Gráfico**: El recurso se ancla flotante a la **IZQUIERDA** del docente en pantalla, respetando su silueta sin invadir su gesticulación ni los márgenes de seguridad.

2. **Recursos con Media Carga de Atención (Textos Largos, Videos Cortos, Gráficos y Enumeraciones)**:
   - **Contenido**: Conceptos desarrollados, pastillas descriptivas, enumeraciones verticales/fichas (pasos, ejemplos), comparativas y videos secundarios breves.
   - **Comportamiento del Docente**: El docente **se mueve o es reencuadrado a la IZQUIERDA** (`framing: 'left'`) en la línea de tiempo.
   - **Ubicación del Gráfico**: Se ancla a la **DERECHA** (`anchorX: 'right'`), ubicándose de forma protagónica debajo del logo/marca de agua de la materia, con pastillas de mayor porte e imágenes/videos en tarjetas con `<RainbowEyebrow />`.

3. **Recursos con Alta Carga de Atención (Videos Extensos, Artículos y Gráficos Complejos)**:
   - **Contenido**: Videos demostrativos largos, artículos periodísticos explicados en voz en off, infografías de alta densidad conceptual, mapas o cuadros sinópticos completos.
   - **Comportamiento del Docente**: El docente **desaparece del cuadro** (`framing: 'none'`).
   - **Ubicación del Gráfico**: Ocupa el centro de la pantalla a **cuadro completo / full screen** hasta los márgenes de seguridad (`safeArea`), cubriendo al docente aunque el primer corte del máster no haya cortado la cámara, mientras la narración en off guía la lectura.

> [!CRITICAL]
> **Nunca escribas coordenadas `top`/`left` a mano en los componentes de un episodio.** Toda posición se resuelve matemáticamente a través de `<SlotContainer>` y `resolveSlot()` respetando esta coreografía.

---

### 1.2. Protocolo Obligatorio de Pre-Edición: Tablero Interactivo de Sincronización (Fase 0 y Fase 2)
> [!IMPORTANT]
> **ESTÁNDAR MANDATORIO PARA TODAS LAS MATERIAS Y EPISODIOS**:
> Antes de escribir una sola línea de código en Remotion (`data.ts`), es **estrictamente obligatorio** confeccionar el **Tablero Interactivo de Sincronización Pre-Edición** (`TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].html` y `.md`). Este protocolo aplica sin excepción a todas las materias de EducaPlay Secundaria (Educación Ambiental, Educación Económica y Financiera, Lengua/Leo Comprendo y Aprendo, Historia, Matemática, etc.) como instancia formal de validación técnica y pedagógica.

#### 1.2.1. Entregables Obligatorios del Ciclo de Sincronización
Por cada episodio a producir, el equipo debe generar y mantener en la carpeta del capítulo:
1. `TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].html`: Interfaz web interactiva con reproductor sincronizado frame por frame, selector de subtítulos, historial de correcciones realizadas y columna activa de nuevas observaciones.
2. `TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].md`: Respaldo documental markdown formateado para lectura y control en GitHub.
3. `TABLA_SINCRONIZACION_DATOS.json`: Matriz de datos crudos estructurada con marcas temporales, textos y metadatos.
4. `TABLA_SINCRONIZACION_APROBADA.json`: Manifest persistente de aprobación con el historial de correcciones solicitadas, estado técnico aplicado y estado del render alfa.
5. `remotion_generator.mjs`: Generador automatizado de `captions.ts` y sincronización editorial.
6. `local_bridge_server.mjs`: Micro-servidor HTTP local (puerto 3210) que conecta el tablero web con el disco y el CLI de Remotion.

#### 1.2.2. Requisitos y Columnas Mandatorias del Tablero
1. **Cruce Temporal Exacto**:
   - Mapear cada fila contra el audio real del primer corte, documentando el segundo exacto (`start_time - end_time`) y números de frame a 25 fps (`start_frame - end_frame`).
2. **Transcripción Fiel, Diferencias de Diálogo (🔴 Resaltado Rojo) y Selector de Subtítulos de 3 Vías**:
   - Resaltar en rojo vivo (`#DC2626`) las discrepancias entre guion y audio grabado.
   - Selector interactivo: **[ ● ] Guion Escaleta**, **[ ○ ] Real Grabado**, o **[ ○ ] ✍️ Personalizado**.
3. **Columna Específica de Titulares Literales de la Escaleta**:
   - Texto textual del titular, frames de entrada/salida y recurso asociado.
   - **Regla estricta**: Si la fila no tiene titular en la escaleta, debe mostrar `— Sin titular pautado —`.
4. **Columna Histórica: `Correcciones Realizadas (Ronda 1 - Aprobadas)`**:
   - Debe exhibir con badge verde (`✓ Aprobado en R1`) la indicación textual del usuario y el **estado técnico aplicado en Remotion** (ej. entrada exacta en frames, eliminación de tarjeta blanca, retiro de kickers ajenos).
5. **Columna Activa: `Nuevas Observaciones (Ronda 2)`**:
   - `<textarea>` individual por fila para redactar ajustes adicionales de revisión pedagógica.
6. **Mecanismo de Guardado Directo y Protección de Borrador**:
   - **Botón `💾 Guardar Correcciones`**: Envía POST inmediato a `/api/save` en el servidor local actualizando `TABLA_SINCRONIZACION_APROBADA.json`.
   - **Auto-guardado en LocalStorage**: En cada pulsación de tecla (`input`), se guarda el estado en `localStorage` del navegador para evitar pérdida de notas si se cierra la pestaña.
7. **Botón de Recompilación y Lanzamiento**:
   - Botón `🚀 Recompilar y Abrir Remotion`: Guarda el manifest y levanta el entorno de **Remotion Preview en `http://localhost:3000`**.

---

## 2. Reglas de Oro Visuales y Estilísticas EducaPlay

### 2.1. Stickers Flotantes Transparentes vs. Tarjetas Institucionales
> [!CRITICAL]
> **PROHIBIDO PONER RECTÁNGULOS O TARJETAS BLANCAS DETRÁS DE LOS STICKERS Y EMOJIS**:
> - Cuando la escaleta solicite un emoji, GIF animado o personaje ilustrativo (ej. chico saludando, gato leyendo, personaje pensando, detective, pulgar arriba, etc.):
>   - **NUNCA envolverlo en una tarjeta blanca ni marco institucional**.
>   - Se renderiza obligatoriamente mediante el componente `<PlainSticker />` como gráfico flotante transparente puro con drop-shadow difuso sutil:
>     `filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.22))'`.
> - Las tarjetas blancas con ceja cuatricolor (`<MediaCard />`, `<ChecklistCard />`) se reservan exclusivamente para textos pedagógicos, pasos, conceptos con bajada tipográfica o medios que requieran marco.

```tsx
// src/components/PlainSticker.tsx
export const PlainSticker: React.FC<{ src: string; width?: number; height?: number }> = ({
  src,
  width = 380,
  height = 360,
}) => (
  <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      src={staticFile(src)}
      alt="Recurso didáctico"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.22))',
      }}
    />
  </div>
);
```

### 2.2. Titulares Literales y Prohibición de Kickers Fabricados
> [!CRITICAL]
> 1. **CERO KICKERS / TAGS INVENTADOS**: Nunca agregar categorías conceptuales artificiales arriba del titular (ej. *"PRELECTURA"*, *"COMPRENSIÓN DIRECTA"*, *"COMPRENSIÓN DEDUCTIVA"*, *"VOCABULARIO"*) si no fueron redactadas explícitamente en la columna de titulares de la escaleta original.
> 2. **RESPETO A FILAS SIN TITULAR**: Si una fila no tiene titular en la escaleta, **NO se debe forzar un titular**. Se renderiza únicamente el recurso correspondiente.
> 3. **DISTANCIA MÍNIMA DE SEGURIDAD (10 px)**: Cuando coexistan en el mismo slot un titular y un sticker, debe existir un margen de separación vertical no menor a **10 px** para evitar cualquier solapamiento.

### 2.3. Medios a Pantalla Completa en Voz en Off (`<FullScreenMedia />`)
Cuando la escaleta indique "Voz en off" o "Pantalla completa" (artículos de noticias, infografías, documentos):
- Se utiliza el componente `<FullScreenMedia />` para cubrir el cuadro completo respetando márgenes de seguridad.
- Cubre al docente en pantalla si el primer corte no cortó la cámara del presentador.
- Respeta estrictamente los tiempos de salida (ej. corte en segundo 00:39), dejando el resto de la fila limpio si así fue pautado.

```tsx
// src/components/FullScreenMedia.tsx
export const FullScreenMedia: React.FC<{ src: string }> = ({ src }) => (
  <div style={{
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#07202C', zIndex: 10
  }}>
    <img src={staticFile(src)} alt="Pantalla completa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
  </div>
);
```

### 2.4. Ceja Cromática Cuatricolor Obligatoria (`<RainbowEyebrow />`)
Toda tarjeta institucional, titular o checklist DEBE incluir en su borde superior el riel oficial de EducaPlay:
- 4 segmentos de 25% de ancho cada uno:
  1. `Rojo / Coral`: `#D43453` (25%)
  2. `Amarillo Cálido / Oro`: `#F0BA46` (25%)
  3. `Cian / Celeste`: `#60B6D3` (25%)
  4. `Verde Hoja / Materia`: `#5DAA46` (25%)
- Altura fija: de `6px` a `8px`.
- NUNCA usar bordes monocolores verdes o blancos.

### 2.5. Jerarquía Tipográfica de Marca (Museo y Museo Sans)
- **Titulares**: Fuente `Museo 900` o `Museo 700`, color tinta profunda (`#07202C` / `#0C2B24`).
- **Cuerpo y Subtítulos**: `Museo Sans 700` o `600`, tamaño mínimo $\ge 26\text{ px}$.

### 2.6. Subtitulado Accesible (WCAG AAA) y Evasión del Lower-Third
- **Pastilla de Vidrio Esmerilado (Frosted Glass)**: Fondo `rgba(7, 32, 44, 0.55)`, `backdropFilter: blur(12px)`, borde cristalino sutil `1.2px solid rgba(255, 255, 255, 0.18)` y `borderRadius: 18px`.
- **Regla Inflexible de Máximo 2 Líneas**: Ningún subtítulo puede superar 2 líneas en pantalla. Dividir en oraciones naturales balanceadas.
- **Evasión Obligatoria de la Placa del Docente**: Durante los frames en que la placa lower-third está en pantalla (`MARKS.lowerThirdIn` a `MARKS.lowerThirdOut`, ej. F200 a F330), los subtítulos DEBEN elevarse automáticamente a `bottom: 270px` (o `230px`), regresando a `bottom: 48px` al retirarse la placa.
- **Prohibición de Puntos Suspensivos (`...`)**: Redacción limpia con puntuación natural.

---

## 3. Arquitectura del Micro-Servidor Bridge (`local_bridge_server.mjs`)

El micro-servidor local corre en el puerto `3210` y debe implementar estos endpoints obligatorios:
* `GET /api/status`: Devuelve estado de salud, episodio activo y estado de Remotion.
* `POST /api/save`: Guarda de forma instantánea el manifest en `TABLA_SINCRONIZACION_APROBADA.json`.
* `POST /api/generate-and-preview`: Guarda el manifest, ejecuta `remotion_generator.mjs` y lanza Remotion Studio Preview en `http://localhost:3000`.
* `GET /video`: Streaming de video MP4 con soporte de rangos parciales (HTTP 206) para navegación frame-accurate instantánea en el reproductor web.

---

## 4. Exportación y Render de Entregables

### 4.1. Video con Canal Alpha (.mov ProRes 4444 para Premiere Pro)
> [!CRITICAL]
> **REGLA MANDATORIA DE EXPORTACIÓN ALPHA EN REMOTION**:
> Para obtener un video QuickTime `.mov` con transparencia real (canal alfa nativo en Apple ProRes 4444):
> 1. Es **ESTRICTAMENTE OBLIGATORIO** incluir el parámetro `--image-format=png`. Sin este parámetro, Remotion fallará con el error `TypeError: Pixel format was set to 'yuva444p10le' but the image format is not PNG`.
> 2. Se debe definir `--pixel-format=yuva444p10le` (Remotion lo codifica nativamente como `yuva444p12le` con canal alfa de 12 bits).
> 3. En la composición de overlays (`Episode<CODE>-Overlay`), el contenedor raíz usa `<AbsoluteFill style={{ backgroundColor: 'transparent' }}>` y omite el `<OffthreadVideo>` del máster.

```bash
# Comando estándar oficial de exportación de pista Alpha:
npx remotion render src/index.ts Episode<CODE>-Overlay out/<CODE>-OVERLAYS-ALPHA.mov --codec=prores --prores-profile=4444 --image-format=png --pixel-format=yuva444p10le --concurrency=8
```

#### Manejo de Bloqueo de Archivo `EBUSY` en Windows
Al finalizar los frames (ej. 3769/3769), si el sistema de archivos de Windows mantiene temporalmente ocupado el archivo temporal `.remotion-in-progress` durante la operación de finalización, simplemente copiar o renombrar el archivo completado en PowerShell:
```powershell
$f = Get-Item out/*.remotion-in-progress; Copy-Item $f.FullName out/<CODE>-OVERLAYS-ALPHA.mov -Force; Remove-Item $f.FullName -Force
```

### 4.2. Video Completo de Referencia (Máster + Overlays)
```bash
npx remotion render src/index.ts Episode<CODE> out/<CODE>-FINAL.mp4 --concurrency=8
```

---

## 5. Reglas Técnicas del Entorno Remotion en Windows

1. **Sin Enlaces Simbólicos en `public/`**:
   - En Windows, nunca crear enlaces simbólicos dentro de `public/` (causa errores `EPERM` en el Webpack bundler de Remotion al compilar en `%TEMP%`). Copiar las carpetas de recursos directamente (`public/RECURSOS/`).
2. **IDs de Composición sin Guiones Bajos**:
   - Los identificadores de composición en Remotion **NO deben contener guiones bajos (`_`)** (ej. `EpisodeLEO26-02` es válido; `EpisodeLEO26_02` falla la validación del CLI).
3. **Mantenimiento de Dependencias y Fuentes**:
   - Todas las fuentes tipográficas deben declararse en `src/styles/fonts.css` cargadas desde `public/fonts/` o `@import` web para garantizar fidelidad en el render final.

---

## 6. Checklist de Control de Calidad Pre-Entrega

1. [ ] **Tablero Pre-Edición Actualizado**: ¿Se reflejaron las correcciones en el HTML y se guardó `TABLA_SINCRONIZACION_APROBADA.json`?
2. [ ] **Stickers Transparentes**: ¿Todos los stickers/emojis/GIFs usan `<PlainSticker />` flotante sin fondos ni tarjetas blancas?
3. [ ] **Titulares Literales**: ¿Se eliminaron todos los kickers o textos que no estaban en la columna de titulares de la escaleta?
4. [ ] **Filas sin Titular**: ¿Las filas sin titular pautado se dejaron completamente limpias de titulares?
5. [ ] **Separación Mínima**: ¿Existe un margen mínimo de 10 px entre titulares y stickers para evitar solapamientos?
6. [ ] **Ceja Cuatricolor**: ¿Toda tarjeta y titular incluye el riel de 4 colores (`#D43453`, `#F0BA46`, `#60B6D3`, `#5DAA46`)?
7. [ ] **Evasión de Placa Docente**: ¿Los subtítulos se elevan automáticamente durante la presencia del lower-third?
8. [ ] **Máximo 2 Líneas**: ¿Ningún bloque de subtítulo excede 2 líneas en pantalla?
9. [ ] **Exportación Alpha Verificada**: ¿Se ejecutó el render con `--image-format=png --pixel-format=yuva444p10le` y se validó en `ffprobe` que el formato sea `yuva444p12le`?
