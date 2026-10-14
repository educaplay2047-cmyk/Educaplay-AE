---
trigger: always
description: Reglas obligatorias y permanentes de sincronización temporal y zonas seguras para subtítulos y recursos (cero colisión con zócalo y mosca, sincronía exacta con escaleta).
---

# Reglas Obligatorias: Sincronización de Subtítulos y Zonas Seguras

Esta regla es de cumplimiento estricto y no negociable para **todos los episodios de todas las materias** de EducaPlay Secundaria (Corrientes).

---

## 1. Sincronización Temporal Estricta y Copia Fiel de Escaleta
- **Copia fiel de la escaleta al pie de la letra por defecto**: Por defecto, y a menos que se indique lo contrario en la matriz de sincronización pre-edición desmarcando la casilla marcable `☑ Copia fiel de escaleta`, los subtítulos deben ser una copia fiel de lo expuesto en la escaleta correspondiente, preservando la redacción curricular oficial.
- **A tiempo exacto con la voz**: Los subtítulos en pantalla deben sincronizarse **al cuadro exacto (frame-accurate)** con los fonemas y tiempos de entrada y salida de la locución del docente.
- **Sin desfasajes**: Queda terminantemente prohibido adelantar o retrasar subtítulos respecto del audio. Cada frase o cláusula sintáctica debe entrar en el primer fonema y salir al concluir la palabra final.
- **División inteligente (Máximo 2 líneas)**: Ningún bloque de subtítulos puede superar las 2 líneas en pantalla. Si una oración es extensa, se divide en cláusulas gramaticales completas, sincronizando cada segmento con su intervalo exacto de voz.
- **Sin puntos suspensivos**: Prohibido usar puntos suspensivos (`...`) en los subtítulos. Se utilizan comas, puntos o pausas limpias.

---

## 2. Cero Colisión con el Zócalo (Lower-Third del Docente)
- **Prioridad del Zócalo**: Durante el intervalo en que el zócalo con el nombre del profesor está en pantalla (`lowerThirdIn` a `lowerThirdOut`), **ningún subtítulo ni recurso gráfico puede solaparse con él**.
- **Evasión automática**:
  * El componente de subtítulos (`SentenceCaptions`) debe detectar si el frame actual coincide con el zócalo y elevarse automáticamente (`bottom: 230px` con transición suave `transition: 'bottom 0.25s ease'`).
  * Al retirarse el zócalo, el subtítulo desciende a su posición base estándar (`bottom: 48px`).
- **Recursos gráficos**: Ningún recurso gráfico puede anclarse en la franja inferior izquierda mientras el zócalo esté visible.

---

## 3. Cero Colisión con la Mosca Institucional
- **Zona de Reserva Superior Derecha**: La mosca institucional de EducaPlay (`top: 40px`, `right: 60px`) es un elemento intocable de identidad.
- **Márgenes de seguridad**: Ningún recurso gráfico, titular, tarjeta lateral ni subtítulo puede invadir ni rozar el bounding box de la mosca.
- **Recursos a pantalla completa**: En recursos centrales o videos en off (`large_center`), la altura máxima y el margen superior deben configurarse de modo que queden libres al menos 120px desde el borde superior derecho.
