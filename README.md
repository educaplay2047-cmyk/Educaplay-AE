# EducaPlay After Effects — Motor de Postproducción y Motion Graphics

Sistema automatizado de medición, sincronización y construcción de episodios educativos de **EducaPlay Secundaria (Corrientes)** en **Adobe After Effects 2026**.

A partir del máster grabado y la escaleta `.docx`, el motor analiza el encuadre de la docente, genera la transcripción sincronizada por palabra con Whisper, coteja las discrepancias textuales en la **Matriz de Sincronización Pre-Edición**, resuelve las cajas libres seguras (*safe zones*) y genera un proyecto editable `.aep` completo con la estética visual oficial de la plataforma EducaPlay.

---

## 📁 Mapa del Repositorio

```text
├── .agents/
│   ├── skills/
│   │   ├── educaplay-after-effects/   # Reglas, estándares y trampas para After Effects
│   │   ├── educaplay-motion-graphics/ # Reglas históricas de Remotion y estética
│   │   └── educaplay-redes/           # Formatos verticales 9:16 (Reels/Shorts)
│   └── workflows/
│       └── episodio-ae.md             # Workflow paso a paso del agente (/episodio-ae)
├── motor/                             # Motor de medición y verificación en Node (sin React/Remotion)
│   ├── plantillas/                    # data.molde.ts para nuevos episodios
│   ├── scripts/                       # check, export-ae, track, transcribe, cues, doctor
│   └── src/episodes/<CODE>/           # data.ts (único archivo editado a mano)
├── ae/                                # Constructor ExtendScript y driver de terminal
│   ├── build-episode.jsx              # Constructor universal de composiciones, capas y keyframes
│   └── run.mjs                        # Driver multiplataforma que ejecuta AE desde terminal
├── episodios/<CODE>/                  # Salida versionada: manifest.json y revision/ (stills, contacto.jpg)
├── docs/                              # Documentación técnica
│   ├── SUBTITULOS.md                  # Estándar de subtitulado esmerilado en ≤ 2 líneas
│   ├── ESTETICA.md                    # Identidad cromática de la plataforma EducaPlay
│   └── MIGRACION.md                   # Registro de arquitectura
└── AGENTS.md                          # Reglas duras y estándares mandatorios para agentes
```

---

## 🛠️ Requisitos de la Máquina

Para montar este sistema desde cero en una máquina nueva (Windows o macOS):

1. **Adobe After Effects 2026** instalado (en español o en inglés; el código utiliza *matchNames* universales).
2. **Node.js ≥ 22.6** (con soporte nativo para TypeScript strip types `--experimental-strip-types`).
3. **FFmpeg y FFprobe** instalados y accesibles en el `PATH` del sistema.
4. **Whisper CLI** (`whisper-cli`) instalado (requerido para transcripción offline en el paso `nuevo`/`prep`).
5. **Tipografías Oficiales de EducaPlay**: 7 fuentes instaladas en el sistema ("Instalar para todos los usuarios" en Windows):
   - `Museo-700` (PostScript: `Museo-700`)
   - `MuseoSans-300` (PostScript: `MuseoSans-300`)
   - `MuseoSans-500` (PostScript: `MuseoSans-500`)
   - `MuseoSans-700` (PostScript: `MuseoSans-700`)
   - `MuseoSans-900` (PostScript: `MuseoSans-900`)
   - `MuseoSansRounded-700` (PostScript: `MuseoSansRounded-700`)
   - `MuseoSansRounded-900` (PostScript: `MuseoSansRounded-900`)

---

## 🚀 Instalación y Puesta en Marcha (Paso a Paso)

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd educaplay-after-effects
```

### 2. Instalar dependencias del motor
```bash
cd motor
npm install
```

### 3. Auditar la máquina (Doctor)
Verifica que las fuentes, After Effects, Node y las herramientas del sistema estén correctamente instaladas:
```bash
npm run doctor -- AMB26-04
```
*(Debe reportar 0 problemas).*

---

## 🎬 Flujo de Trabajo para un Episodio

```text
1. Medición y Datos:       npm run nuevo -- <CODE>
2. Matriz Pre-Edición:     Abrir TABLA_SINCRONIZACION_PRE_EDICION_<CODE>.html
3. Correcciones:           Editar motor/src/episodes/<CODE>/data.ts
4. Verificación técnica:   npm run check -- <CODE>
5. Exportar Manifiesto:    npm run export:ae -- <CODE>
6. Construcción en AE:     npm run ae -- <CODE>
7. Publicación formal:     npm run publicar -- <CODE>
```

### Comandos Clave (desde `motor/`)

| Comando | Descripción |
|---|---|
| `npm run doctor -- <CODE>` | Auditoría de máquina, fuentes tipográficas y máster. |
| `npm run medios -- <CODE> --desde "<ruta>"` | Vincula los medios físicos al motor mediante enlaces duros. |
| `npm run nuevo -- <CODE>` | Mide el máster, transcribe con Whisper, alinea gatillos y genera borrador. |
| `npm run sync:matrix -- <CODE>` | Genera la Matriz de Sincronización Pre-Edición (HTML interactivo, JSON y reporte Markdown). |
| `npm run bridge -- <CODE>` | Inicia el servidor local Bridge para comunicación bidireccional entre el HTML y After Effects. |
| `npm run check -- <CODE>` | Valida tipos TypeScript, márgenes de seguridad, evasión de docente y contraste WCAG AAA. |
| `npm run export:ae -- <CODE>` | Genera `episodios/<CODE>/manifest.json` y transcodifica assets a formatos seguros con canal alfa. |
| `npm run build:ae -- <CODE>` | Automatización directa de compilación y ejecución de After Effects. |
| `npm run ae -- <CODE>` | Abre After Effects, arma composiciones/keyframes, exporta stills y genera la hoja de contacto `contacto.jpg`. |
| `npm run publicar -- <CODE>` | Chequeo completo estricto y, solo si pasa sin ⚠ ni ✗, realiza commit y push a GitHub. |

---

## 📐 Reglas Estéticas y Técnicas Mandatorias

1. **La docente decide el encuadre**: Las coordenadas nunca se escriben a mano; las calcula el motor (`resolveSlot`) según la posición real de la docente en cada fotograma.
2. **Dimensionamiento por Carga**:
   - **Carga Baja**: Entrada a la izquierda de la docente (480–520 px).
   - **Carga Media**: Entrada a la derecha de la docente (640–760 px), eludiendo estrictamente la mosca institucional (`[1400, 35, 420, 140]`).
   - **Carga Alta**: Despliegue de impacto didáctico dentro de Title Safe (~1520×840 px).
3. **Stickers con Transparencia**: Recursos PNG o GIF con canal alfa entran como **stickers flotantes sin pastilla ni tarjeta de fondo blanca**, con sombra sutil (`ADBE Drop Shadow`: 40 % opacidad, ángulo 135°, suavidad 24 px).
4. **Kickers de Recursos**: Tamaño fijado en **22 px** (`MuseoSans-700` y `MuseoSans-900`).
5. **Subtítulos Canónicos**: Pastilla esmerilada de fondo, máximo 2 líneas por subtítulo, elevación automática ante placas institucionales inferiores quemadas.
6. **Medios Fuera del Repo**: Los archivos pesados de video (`.mp4`, `.mov`), archivos `.aep` binarios y modelos de Whisper no se suben a Git; quedan en el almacenamiento local.
