# 💌 Romantic Experience Web

<p align="center">
  <a href="https://theyarixx.github.io/para-mi-reina/">
    <img src="https://img.shields.io/badge/GitHub-romantic--experience--web-181717?style=for-the-badge&logo=github" alt="Repository GitHub">
  <a href="https://theyarixx.github.io/para-mi-reina/">
    <img src="https://img.shields.io/badge/Page-Web-ff69b4?style=for-the-badge" alt="Web Page">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-2ea44f?style=for-the-badge" alt="MIT License">
  </a>
</p>

# Un regalo para ti

Experiencia romántica interactiva creada como una página web estática y personalizada para Isabel Yung. La web combina una bienvenida animada, recuerdos, una carta y música en una sola página adaptable a móviles y escritorio.

## Contenido de la web

- **Bienvenida:** una pantalla inicial que da paso a la experiencia tras pulsar «Comenzar».
- **Portada floral:** lirios animados, una mariposa decorativa y un mensaje de cumpleaños.
- **Nuestra historia:** una cronología de fechas y recuerdos cargada desde JSON.
- **Galería:** 12 fotografías con textos, carga diferida y visor ampliado (lightbox).
- **Contador:** tiempo transcurrido desde el 16 de julio de 2026, actualizado cada segundo y desglosado en días, horas, minutos y segundos; incluye también el resumen en años, meses y días.
- **Carta:** carta personalizada cargada desde JSON y presentada en un sobre animado que se puede abrir y cerrar.
- **Universo en movimiento:** estrellas, frases y fotografías que cruzan una escena animada.
- **Música:** reproductor flotante para «Zombie Lady», de Damiano David, con controles de reproducción y volumen.
- **Detalles de interacción:** navegación entre secciones, botón para volver al inicio, elementos que aparecen al desplazarse, partículas y corazones animados. El efecto parallax se desactiva si el sistema tiene activada la preferencia para reducir el movimiento.

## Estructura del proyecto

```text
.
├── index.html
├── LICENSE
├── README.md
└── assets/
    ├── audio/
    │   └── Damiano David - Zombie Lady.mp3
    ├── css/
    │   ├── main.css
    │   ├── sections.css
    │   ├── animations.css
    │   └── responsive.css
    ├── data/
    │   ├── gallery.json
    │   ├── letter.json
    │   └── timeline.json
    ├── img/
    │   ├── flowers.png
    │   ├── decorative/
    │   └── gallery/
    │       └── provas-do-meu-amor/
    ├── js/
    │   ├── counter.js
    │   ├── effects.js
    │   ├── gallery.js
    │   ├── intro.js
    │   ├── main.js
    │   ├── meteor.js
    │   └── timeline.js
    └── scss/
        └── main.scss
```

`index.html` contiene las secciones y carga los estilos y scripts. Los módulos de `assets/js/` inicializan la interacción de cada parte; `main.js` coordina la carta, la bienvenida, la música y el arranque. La cronología, la galería y la carta obtienen su contenido de `assets/data/`. Los estilos se separan entre la hoja principal, los estilos de secciones, las animaciones y las reglas adaptables.

## Personalizar el contenido

- **Cronología:** edita `assets/data/timeline.json`. Cada evento incluye `date`, `title` y `text`; también puedes cambiar el subtítulo y el mensaje de cierre.
- **Galería:** edita `assets/data/gallery.json` para actualizar el subtítulo, las imágenes, sus textos alternativos y sus pies de foto. Las rutas de las imágenes deben apuntar a archivos dentro de `assets/`.
- **Carta:** edita `assets/data/letter.json` para cambiar el distintivo, los párrafos y la firma.
- **Fecha del contador:** cambia `rawDateStr` en `assets/js/counter.js` y actualiza el texto visible «Desde 16 de Julio de 2026» en `index.html` para que ambos coincidan. La fecha del script usa el formato ISO con zona horaria.
- **Portada y textos estáticos:** actualiza los textos correspondientes directamente en `index.html`.
- **Música e imágenes:** sustituye los archivos de `assets/audio/` o `assets/img/` y actualiza sus rutas en `index.html`, JSON o scripts, según dónde se utilicen.
- **Estilos:** los CSS se cargan directamente desde `assets/css/`. Si modificas `assets/scss/main.scss`, compílalo para actualizar `assets/css/main.css`; los otros CSS se mantienen directamente.

Los archivos JSON se solicitan mediante `fetch`, por lo que la web debe abrirse desde un servidor HTTP local o un alojamiento estático, no directamente como archivo (`file://`). Si la carga de la galería o la cronología falla, sus scripts disponen de contenido de respaldo.

## Requisitos y ejecución local

No se requiere framework ni proceso de compilación para ejecutar la web. Solo necesitas un servidor HTTP estático. Por ejemplo, con Python instalado:

```bash
py -m http.server 8000
```

Después, abre <http://localhost:8000/>. También puedes usar cualquier otro servidor estático desde la carpeta raíz del proyecto.

Para compilar el Sass tras editar `assets/scss/main.scss`, con Sass disponible:

```bash
npx sass assets/scss/main.scss assets/css/main.css
```

## Publicación

Al ser un sitio estático, puede alojarse en GitHub Pages u otro servicio de alojamiento estático. El repositorio no incluye actualmente un flujo de despliegue configurado; publica la carpeta raíz que contiene `index.html` y `assets/`.

## Contenido y licencia

Esta web contiene fotografías, textos y una canción asociados a una experiencia personal. La licencia MIT del repositorio se conserva tal como aparece en [LICENSE](./LICENSE) y se refiere al software; no debe interpretarse como una licencia de uso de esos contenidos personales o de recursos de terceros. Comprueba los derechos y permisos aplicables antes de reutilizarlos o publicarlos.

El aviso de copyright del software identifica a Lucas Hochmann Rosa, según el archivo de licencia conservado.


## 📄 License

Licensed under MIT. Feel free to use, modify, and distribute, while keeping the copyright notice and crediting **Lucas Hochmann Rosa**.

See [LICENSE](./LICENSE).

---
