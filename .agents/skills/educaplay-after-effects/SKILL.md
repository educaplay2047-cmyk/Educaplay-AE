---
name: educaplay-after-effects
description: |
  Capítulos de EducaPlay Secundaria (Corrientes) en Adobe After Effects: medir el máster con el motor (encuadre de la docente, Whisper, palabras-gatillo), escribir el data.ts del episodio, exportar el manifiesto, armar el .aep editable con la estética de la plataforma EducaPlay, verificar con stills y publicar en GitHub. Usar para cualquier código de episodio (AMB26-XX, LEO0XX…), para tocar ae/build-episode.jsx, o para diagnosticar por qué un gráfico pisa a la docente, un subtítulo pasa de dos líneas o el armado en AE deja advertencias.
---

# EducaPlay en After Effects

Los scripts hacen la medición y el armado. Este archivo guarda **los criterios y las trampas**: lo
que no se deduce leyendo el código y lo que más caro salió descubrir. El paso a paso operativo es el
workflow `/episodio-ae`.

## La regla que ordena todo

El montajista mueve la cámara para hacerle lugar al gráfico. El motor no inventa esa coreografía:
**la lee**. `track-presenter.mjs` mide dónde está parada la docente y `resolveSlot`
(`motor/src/layout/presenter.ts`) ubica cada tarjeta en la banda que quedó libre. `export-ae.mjs`
vuelca esas cajas al manifiesto y el `.jsx` sólo pone en escena.

- **Nunca escribas coordenadas a mano**, ni en `data.ts` ni en el `.jsx`. Si parece que hace falta,
  al slot le falta un parámetro.
- **La posición de la docente decide quién es protagonista.** Centrada: ella, con tarjetas de
  560 px. Corrida a un costado: el motion graphics, con tarjetas de hasta 900 px. La regla vive una
  sola vez, en `STAGE_MAX_W` de `motor/src/episodes/blocks.ts`.
- **Las tarjetas se anclan al borde EXTERIOR del cuadro.** La banda cambia con cada gesto; el borde
  no.
- **Dos bloques simultáneos declaran slots disjuntos** (`align: 'top'` con `maxHeight`, contra
  `align: 'bottom'`).

## Protocolo Obligatorio: Matriz de Sincronización Pre-Armado en After Effects

Antes de volcar datos a `data.ts` y construir el proyecto `.aep` en After Effects, es **estrictamente obligatorio** confeccionar y validar la **Matriz de Sincronización Pre-Armado** (`TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].html`, `.md` y sus manifiestos JSON asociados).

### Entregables Obligatorios del Ciclo de Sincronización
Por cada episodio a producir en After Effects, se generan y mantienen en la carpeta del capítulo:
1. `TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].html`: Interfaz interactiva con reproductor sincronizado frame-accurate, cotejo visual de transcripción vs guion, selección de subtítulos, visualización de slots/encuadres y configuración de entradas, salidas y posiciones de recursos y motion graphics.
2. `TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].md`: Documento Markdown formal para auditoría, control de calidad y revisión de coordinación pedagógica.
3. `TABLA_SINCRONIZACION_DATOS.json`: Matriz estructurada de datos crudos (marcas temporales en segundos y frames, textos, slots, recursos auditados).
4. `TABLA_SINCRONIZACION_APROBADA.json`: Registro persistente de aprobación con el estado de correcciones solicitadas y validadas.

### Reglas de Oro de la Matriz de Sincronización
1. **Cotejo Estricto de Transcripción (Whisper vs Escaleta)**:
   - Toda discrepancia entre lo que dice el guion original de la escaleta y la locución real grabada por la docente (transcripción Whisper/ASR) debe resaltarse de forma explícita en rojo vivo (`#DC2626`).
   - Se debe documentar cada error de fonética, modismos regionales (ej. "¡Chaque el agua!" vs "Ya que el agua") o términos técnicos para su resolución en `CAPTION_FIX`.
2. **Titulares Literales y Cero Invención**:
   - **Prohibido inventar kickers o categorías conceptuales** que no figuren en la columna de titulares de la escaleta.
   - **Respeto a filas sin titular**: Si una fila no tiene titular en la escaleta, debe indicarse `— Sin titular pautado —` y en After Effects no se monta ninguna tarjeta de titular.
   - El texto del titular se preserva tal cual está pautado en la escaleta.
3. **Recursos Fieles a la Escaleta**:
   - Se cotejan únicamente los recursos gráficos, fotos, videos y animaciones expresados en la escaleta, vinculándolos con sus archivos físicos en la carpeta `RECURSOS/`.
   - Se configuran sus entradas, salidas y duraciones en segundos y frames exactos.
4. **Configuración de Slots y Encuadres**:
   - Para cada fila y recurso, la matriz define la posición de la docente (`center`, `left`, `none`) y la asignación del slot (`L_TOP`, `L_MID_RIGHT`, `L_WIDE_RIGHT`, etc.), garantizando que ningún gráfico tape a la docente ni invada las zonas seguras o la placa de nombre.

### Asignación de Recursos por Nivel de Carga de la Fila
La ubicación espacial y el tamaño de cada recurso gráfico se asigna estrictamente en función de la **carga pedagógica** otorgada a cada fila en la Matriz de Sincronización:

* **Carga Baja (Refuerzo / baja atención pedagógica)**:
  - **Entrada y posición**: El recurso entra a la **IZQUIERDA del docente** (slot lateral exterior izquierdo, e.g. `L_TOP_LEFT` o margen izquierdo disponible).
  - **Tamaño**: Contenido y compacto (ancho recomendado entre **480 px y 520 px**).
  - **Propósito**: Ilustración de apoyo o refuerzo de un concepto secundario mientras el docente mantiene el foco visual principal.

* **Carga Media (Didáctico / atención media pedagógica)**:
  - **Entrada y posición**: El recurso entra a la **DERECHA del docente** con **MAYOR TAMAÑO**.
  - **Tamaño**: Mayor presencia visual (ancho entre **640 px y 750 px**, alto de hasta 520 px).
  - **Regla estricta de evasión de la mosca (Watermark)**: **PROHIBIDO SOLAPARSE CON LA MOSCA INSTITUCIONAL**. La mosca de EducaPlay está quemada en la esquina superior derecha (`rect: [1400, 35, 420, 140]`). El slot de carga media debe comenzar por debajo de `y: 190` o desplazarse lateralmente a la izquierda para garantizar una distancia de respiro mínima de 40 px respecto a la mosca.

* **Carga Alta (Protagónico / máxima atención pedagógica)**:
  - **Entrada y posición**: El recurso entra **CASI A PANTALLA COMPLETA** dentro de los márgenes de seguridad.
  - **Márgenes de seguridad obligatorios (Title Safe)**: Respeto absoluto a las áreas seguras oficiales: margen superior/inferior de 120 px, margen lateral de 180 a 220 px (dimensiones de visualización de **~1520x840 px** o 1600x900 px centrado).
  - **Tratamiento escénico**: Si el máster continúa de fondo, se aplica un scrim/desenfoque suave para priorizar la legibilidad de la evidencia, infografía o video pedagógico.

### Regla de Oro: Recursos con Transparencia (Stickers Flotantes sin Pastilla)
* **CUANDO EL RECURSO TIENE TRANSPARENCIA NO LLEVA PASTILLA NI TARJETA DE FONDO**:
  - Todo asset gráfico que posea canal alfa nativo (imágenes PNG recortadas, GIF animados transcodificados a ProRes 4444 con canal alfa, o renders 3D/ilustraciones con transparencia) debe colocarse directamente como **sticker flotante transparente** sobre el máster.
  - **Queda terminantemente prohibido** envolver un recurso transparente dentro de una tarjeta blanca (`card()`), caja esmerilada o pastilla de color.
  - Para despegar la silueta del fondo sin ensuciar la toma, se le añade exclusivamente una **sombra de caída sutil** (`dropShadow`: opacidad ~35-40 %, ángulo 135°, distancia 10-14 px, suavidad 20-25 px).
  - **Medios opacos**: Únicamente los videos o fotografías rectangulares convencionales sin canal alfa (formatos JPEG, MP4 cerrado) llevan la tarjeta canónica blanca con radio de curvatura (`RADIUS = 16 px`).

### Jerarquía Tipográfica de Kickers: Tamaño 22 Obligatorio
* **Kickers de pastillas y recursos a tamaño 22**: Los kickers y etiquetas de categoría en tarjetas de recursos y titulares deben componerse obligatoriamente en **tamaño 22 px** (`size: 22`), utilizando la tipografía corporativa `MuseoSans-700` o `MuseoSans-900`, interletreado expandido (`tracking: 120`) y en mayúsculas sostenidas.
* Queda desestimado el uso de tamaños reducidos (16-18 px) que comprometan la legibilidad en pantallas de dispositivos móviles.

### Modal / Pop-up Flotante de Progreso de Construcción en la Matriz HTML
La matriz `TABLA_SINCRONIZACION_PRE_EDICION_[CODIGO].html` debe incorporar obligatoriamente una ventana flotante (pop-up modal) conectada al servidor local bridge (`local_bridge_server.mjs`, puerto 3210):
- **Tiempo transcurrido en vivo**: Cronómetro digital en formato continuo `MM:SS s`.
- **Tiempo restante estimado (ETA)**: Cuenta regresiva adaptativa que parte de `~35 s` y descuenta dinámicamente según el progreso de las fases de AE.
- **Barra de progreso visual**: Barra continua con porcentaje del 0% al 100% decorada con la paleta cuatricolor oficial de EducaPlay (cian `#5DCBE1`, rojo `#EA3355`, amarillo `#F5C042`, verde `#54B835`).
- **Hitos secuenciales del armado**: Seguimiento visual de los 6 pasos críticos: (1) Validación editorial y fuentes Museo, (2) Verificación/transcodificación de assets, (3) Composición principal y capa CONTROL, (4) Construcción de bloques y máscaras, (5) Ensamblado de subtítulos esmerilados y evasión de lower-third, (6) Guardado de `.aep` y exportación de fotogramas de revisión.
- **Consola de ejecución en vivo**: Registro en tiempo real de los logs de ExtendScript y del runner.
- **Modo autónomo (Fallback)**: Si se abre el archivo HTML sin el servidor levantado, la interfaz cuenta con simulación matemática precisa del progreso para revisión sin errores de conexión.

## Contenido del `data.ts`

- **Cada recurso declara su rango:** `'didactico'` (hay que leerlo, o es evidencia real) o
  `'refuerzo'` (ilustra lo que la docente ya dijo). Es una decisión editorial.
- **Un recurso ilegible es peor que no ponerlo.** Si la imagen del cliente trae texto adentro, se
  recompone como `kind: 'checklist'`.
- **Pisos que hace cumplir `check-layout`:**
  - 60 frames por bloque;
  - 50 frames por ítem de una tira;
  - 380 px de ancho mínimo;
  - 26 px de cuerpo.
- **La cabecera del `data.ts` es parte del entregable.** Tiene que decir:
  - la coreografía del máster;
  - lo que la escaleta pide y el máster no da;
  - los errores de ASR con su frame;
  - los rects quemados;
  - cada excepción con su motivo.

**Las cuatro comprobaciones que ningún script hace:**
1. Un score de 1.00 en un gatillo sólo dice que la palabra existe, no que sea el cue correcto.
2. Buscá cada palabra-gatillo en `words.json`, una por una, para detectar lo que nunca se grabó.
3. El nombre de la docente sale de la placa quemada y se confirma con Isaac, nunca de la escaleta.
4. Leé los subtítulos generados. Whisper cambia palabras por otras que existen; se corrigen con
   `CAPTION_FIX`.

## Estética: la plataforma EducaPlay (`docs/ESTETICA.md`)

Es la única. Toma los colores medidos sobre la web de Corrientes Play:

| Uso | Color |
|---|---|
| Bandas | cian `#5DCBE1`, rojo `#EA3355`, amarillo `#F5C042`, verde `#54B835` |
| Tarjeta oscura | `#3B3B3E` |
| Gris | `#F0F0F0` |
| Tinta | `#201D2F` |
| Menta | `#6CEACB` |

Y sus piezas:
- titulares en tarjeta oscura con franja de 4 colores y subrayado menta con flecha ↓;
- baldosa "2° PASO";
- recursos de refuerzo como filas con miniatura;
- checklists en baldosa gris con discos de color;
- portada "Educaplay | Nivel Secundario";
- barridos de bandas diagonales en los traslados.

**Movimiento:** `easeOutBack` regulado por `Rebote (%)`; con 0 no hay sobrepaso, que el sistema de
Ambiente desaconseja.

La capa `CONTROL` de la comp principal gobierna todo el capítulo:
- colores: Gris, Oscuro, Tinta, Menta y Banda cian/roja/amarilla/verde;
- `Entrada`, `Salida`, `Deslizamiento`, `Rebote` y `Sombra`;
- `Subtítulos` on/off.

Las precomps la leen por expresión. Un cambio de marca se hace ahí, no capa por capa.

## Subtítulos (`docs/SUBTITULOS.md` §1.4)

- **Sin resaltado por palabra.** Una capa de texto por subtítulo: se edita con doble clic y el
  timing se ajusta con los bordes de la capa.
- **Pastilla canónica:**
  - scrim plano negro al 55 %, con 10 px de desenfoque detrás;
  - radio 20, borde blanco al 16 %, filete interior y sombra.
  - Es negro y no la tinta del documento, porque la tinta da 3,84:1 y el piso es 4,5:1.
- **Tipografía:** Museo Sans Rounded 700 blanca con sombra, interlineado 1,32.
- **Máximo dos líneas:** el export pagina con `paginateCaptions`, igual que `check-layout`, y AE
  corta de forma balanceada.
- **Placa de nombre:** si un subtítulo se cruza con la placa de la docente, va **elevado toda su
  duración**. La placa del máster se anima unos 25 frames antes de su `RESERVED`, y un texto no se
  mueve mientras se lee.

## Trampas de After Effects (cada una costó una iteración)

1. **`addProperty` invalida las referencias anteriores del mismo grupo.** Agregá todo y después
   pedí cada propiedad de nuevo por matchName.
2. **Un grupo de shape nuevo queda DEBAJO de los anteriores.** Para ponerlo al frente,
   `grp.moveTo(1)` y volvé a pedir la referencia (`toFront()`).
3. **Ubicá el null (ancla y posición) ANTES de emparentarle hijos.** Si lo movés después, los
   arrastra fuera de cuadro.
4. **`ADBE Text Render Order` = 2** es «rellenos sobre trazos». Con 3, el trazo tapa la letra.
5. **Cuántos `KeyframeEase` pide cada propiedad no se deduce del tipo.** Scale de una capa 2D es
   ThreeD pero pide 2; lo espacial pide 1. `keys()` prueba 1, 2 y 3.
6. **`saveFrameToPng` es asíncrono.** Vuelve antes de escribir: hay que esperar a que exista el
   archivo, y no cerrar el proyecto enseguida.
7. **Manejo desde la terminal:**
   - `DoScript` siempre devuelve "0": lo que haya que leer de vuelta se escribe a un archivo
     temporal;
   - con `DoScriptFile`, esas escrituras quedan en 0 bytes: se usa `DoScript "$.evalFile(…)"`;
   - ExtendScript en Mac escribe `\r` salvo `lineFeed = 'Unix'`.
8. **Una capa de ajuste dentro de una precomp alcanza al máster** sólo si la capa de la precomp va
   con «contraer transformaciones». Así se hace el esmerilado de los subtítulos.
9. **AE importa un GIF como cuadro fijo.** El export los transcodifica a `.mov` (Animation, con
   alfa) y el `.jsx` los loopea.
10. **Nombres visibles cambian con el idioma de AE.** Siempre matchNames, y efectos por índice en
    las expresiones.
11. **Una fuente faltante no da error: AE la sustituye.** El constructor mide cada texto, así que la
    sustitución cambia el alto de las tarjetas y desarma el cuadro. Por eso `build-episode.jsx`
    verifica las 7 fuentes con `app.fonts.getFontsByPostScriptName` y no arma si falta alguna.
12. **En otra máquina no se vuelve a medir.** `nuevo`/`prep` regeneran `track.ts`, `captions.ts`,
    etc. con el ffmpeg y el Whisper locales, y el resultado cambia. `npm run doctor` lo detecta
    contra git.
13. **Windows:** AE se maneja con `AfterFX.exe -r <script>`, que vuelve enseguida; `ae/run.mjs`
    espera una marca de fin. Las fuentes instaladas sólo para el usuario pueden no verse en AE.
14. **ExtendScript es ES3 puro (sin String.prototype.trim):** Invocar `.trim()` arroja inmediatamente
    `ReferenceError: La función capText.trim no está definida`. Al ser capturado por `soft()`, aborta la
    construcción del bloque en silencio, dejando composiciones vacías (`✗ photo:... quedó incompleto`).
    Regla mandatoria: incluir siempre el polyfill universal al inicio de cada `.jsx` o usar
    `.replace(/^\s+|\s+$/g, '')`.
15. **Bloqueo modal en segundo plano con `app.newProject()`:** Si hay un proyecto abierto con ítems al
    evaluar un script, `app.newProject()` despliega el cuadro "¿Desea guardar cambios?", deteniendo la
    ejecución por terminal indefinidamente. Solución obligatoria: cerrar siempre con
    `app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)`.
16. **Stickers con alfa vs Tarjetas opacas:** Si el recurso es transparente (PNG, GIF transcodificado a
    ProRes 4444 con canal alfa), `mediaCard()` NO debe generar la capa `card()` ni forzar una máscara
    alfa rectangular que recorta el asset; se coloca el medio directamente con `ADBE Drop Shadow`
    (sombra suave al 40 %, ángulo 135°, suavidad 24 px).
17. **Cálculo de color y hex en ExtendScript:** En funciones utilitarias de color como `hex(h)`, verificar
    siempre si el argumento ya es un array de números normalizados `[r, g, b]` (`h instanceof Array`). Si se le
    pasa un array a un método que asume string y llama a `.replace('#', '')`, lanzará
    `ReferenceError: La función h.replace no está definida`, provocando que los bloques queden incompletos
    (`✗ photo:... quedó incompleto`).

## Verificación

- `npm run check -- <CODE>`: tipos, layout (docente, rects, 2 líneas con la fuente real) y
  contraste.
- `npm run ae -- <CODE>`: falla ante cualquier ⚠ o ✗ del LOG, si faltan tarjetas,
  subtítulos o stills, o si no se guardó el `.aep`.
- **Mirar las hojas de contacto** de `episodios/<CODE>/revision/`. Los scripts no ven un texto
  cortado ni un gráfico feo.
- `npm run publicar -- <CODE>` repite todo y sólo entonces commitea, pushea y abre el PR.
