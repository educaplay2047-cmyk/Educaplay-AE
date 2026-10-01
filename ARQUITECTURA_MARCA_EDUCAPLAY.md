# Arquitectura Reutilizable de Marca — EducaPlay

> Sistema oficial de diseño y marca paraguas para EducaPlay Secundaria (Corrientes). Diseñado para unificar la identidad visual entre materias (Ambiente, Lengua, Matemática, Historia, Ciudadanía, etc.) preservando la coherencia pedagógica e institucional.

---

## 1. Núcleo EducaPlay Compartido

No cambia entre materias y define el ADN del canal:

- **Wordmark oficial de EducaPlay**: Como arte entregado en alta resolución, sin reconstrucciones arbitrarias ni alteraciones de proporción.
- **Tipografía Oficial**:
  - `Museo` (pesos 700 y 900): Exclusivo para identidad, titulares principales y números de pasos pedagógicos.
  - `Museo Sans` (pesos 400, 600, 700 y 800): Para kickers, subtítulos, cuerpo explicativo y elementos de interfaz.
- **Paleta Institucional Arcoíris (Ceja Cromática de 4 colores)**:
  Toda placa, tarjeta y titular pedagógico incorpora en su borde superior el riel cuatricolor oficial en proporciones exactamente iguales (25% cada color):
  1. `Rojo / Coral`: `#D43453` (25%)
  2. `Amarillo Cálido / Oro`: `#F0BA46` (25%)
  3. `Cian / Celeste`: `#60B6D3` (25%)
  4. `Verde Hoja / Materia`: `#5DAA46` (25%)
  - Altura: 6 px a 8 px (`eyebrowHeight: '6px'`).
- **Sistema de Tarjetas**:
  - Superficie: Blanco puro `#FFFFFF` (opacidad $\ge 0.94$).
  - Vértices: `borderRadius: '24px'` con `overflow: 'hidden'`.
  - Borde: `1.5px solid rgba(7, 32, 44, 0.09)`.
  - Sombra: `0 20px 48px rgba(7, 32, 44, 0.16), 0 4px 12px rgba(7, 32, 44, 0.05)`.
- **Estructura de Titulares (`TitularCard`)**:
  - Tag superior / Kicker: `Museo Sans 800` en mayúsculas con espaciado `letterSpacing: '0.12em'`, en color de acento profundo.
  - Título: `Museo 900` en tinta oscura (`#0C2B24` / `#07202C`), tamaño 36–38 px.
  - Filete inferior de acento: Barra horizontal verde (`84px × 4px`, `borderRadius: 2px`) colocada bajo el título.
  - Subtítulo / Bajada: `Museo Sans 600` (piso de legibilidad $\ge 26\text{ px}$).
- **Tarjetas de Pasos Modulares**:
  - `StepHeaderCard`: Número de paso gigante (56 px en `Museo 900`), separador vertical, etiqueta `PASO` y título de paso.
  - `StepBodyCard`: Ceja cuatricolor, íconos de servicios delineados, keywords en `Museo Sans 900`, texto explicativo en `Museo Sans 600` y nota al pie.
- **Pastillas de Alerta Flotantes (`AlertPill`)**:
  - Cápsula blanca redondeada (`borderRadius: '20px'`), sombra flotante, badge de ícono a la izquierda y tipografía `Museo 900` (30 px).
- **Subtítulos con Scrim Calibrado**:
  - Fondo negro semitransparente con opacidad $\alpha = 0.55$ (`rgba(7, 32, 44, 0.55)`), `backdropFilter: blur(10px)` y borde sutil `rgba(255, 255, 255, 0.16)` para garantizar ratio $\ge 4.5:1$ sobre fondos claros o vestimenta del docente.
- **Reglas de Legibilidad y Layout Dual**:
  - Ancho útil mínimo: 380 px.
  - Piso tipográfico en pantalla: 26 px.
  - Duración mínima en pantalla: 60 frames (2.4 s).

---

## 2. Variables de Materia

Cada materia declara únicamente sus parámetros cromáticos y de identidad:

```ts
type SubjectIdentity = {
  id: string;
  name: string;
  shortName: string;
  codePrefix: string;
  accent: string;      // Color de acento para filetes e indicadores
  accentDeep: string;  // Tinta oscura de la materia para lectura y tags (WCAG AAA)
  ink: string;         // Tinta base oscura para textos
  onAccent: string;    // Color sobre acento (blanco o tinta)
  monogram?: string;   // Opcional, solo si existe en el sistema oficial
  brandIcon?: string;  // Opcional, solo si está aprobado explícitamente
};
```

### Educación Ambiental Integral (Ambiente)
```ts
{
  id: 'ambiente',
  name: 'Educación Ambiental Integral',
  shortName: 'AMBIENTE',
  codePrefix: 'AMB',
  accent: '#10BA1B',      // Verde vibrante de materia (filetes y acentos)
  accentDeep: '#06590D',  // Verde profundo para kickers y tags (8.6:1 WCAG AAA)
  ink: '#0C2B24',         // Tinta oscura de ambiente (>15:1 sobre blanco)
  onAccent: '#FFFFFF',
}
```

---

## 3. Variables de Capítulo

Pertenecen al contenido del episodio y varían en cada entrega:
- Código y título del episodio.
- Guion, transcripción palabra por palabra y palabras-gatillo (`cues`).
- Recursos audiovisuales (imágenes, videos, diagramas).
- Timings, subtítulos y locución.
- Selección de componentes según la función pedagógica (titular, video, concepto, paso, checklist, etc.).

---

## 4. Qué NO Pertenece al Núcleo

- Elementos visuales aislados de una materia usados como marca global (ej. libros de Historia, fórmulas de Matemática, hojas de Ambiente).
- Bordes superiores monocolores verdes, amarillos o cian (la marca oficial siempre usa los 4 colores).
- Textos sueltos sobre el color del plató sin tarjeta o superficie blanca.
- Tamaños tipográficos inferiores a 26 px en cuerpos explicativos.

---

## 5. Exportación de Entregables en Remotion

Para la edición en Premiere Pro, DaVinci Resolve o Final Cut, cada episodio produce dos tipos de archivo:
1. **MP4 Completo**: Video final con máster de cámara y motion graphics montados.
2. **MOV ProRes 4444 con Canal Alfa**: Pista transparente que contiene únicamente los Motion Graphics, subtítulos con *scrim* y efectos sonoros (`whoosh_in`, `whoosh_out`), permitiendo a los montajistas superponer los gráficos directamente sobre cualquier corte del máster:
   ```bash
   npx remotion render src/index.ts Episode<CODE>-Overlay out/<CODE>-OVERLAYS-ALPHA.mov --codec=prores --prores-profile=4444 --concurrency=8
   ```
