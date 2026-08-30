(function () {
  var galleryItems = [];
  var currentIndex = 0;
  var currentGalleryData = null;
  var resizeFrame = null;
  var initialized = false;
  var renderedItemsPerRow = 0;
  var defaultCaptions = [
    'Esta sonrisa podría arreglarme un día entero.',
    'La forma en que miras al mundo me transmite tanta paz.',
    'Uno de mis detalles favoritos de ti. Simply beautiful.',
    'Tu risa es la melodía más bonita que conozco. Mon amour.',
    'Guardar fotos tuyas es guardar un trocito de felicidad.',
    'Eres hermosa en cada instante. You take my breath away.'
  ];

  function buildGalleryFallback() {
    var items = [];
    for (var index = 1; index <= 12; index++) {
      var extension = index === 1 ? '.jpg.jpeg' : '.jpeg';
      items.push({
        src: 'assets/img/gallery/provas-do-meu-amor/' + index + '-prova-do-meu-amor-por-voce' + extension,
        alt: 'Recuerdo de ti ' + index,
        caption: defaultCaptions[(index - 1) % defaultCaptions.length]
      });
    }

    return {
      subtitle: 'Cada mirada, cada sonrisa y cada instante tuyo guardado como un tesoro.',
      items: items,
      captionLines: defaultCaptions
    };
  }

  function updateLightbox() {
    var image = document.getElementById('lightbox-image');
    var caption = document.getElementById('lightbox-caption');

    if (!image || !caption || !galleryItems[currentIndex]) {
      return;
    }

    var item = galleryItems[currentIndex];
    image.src = item.src;
    image.alt = item.alt || 'Imagen de nuestra galería';
    caption.textContent = item.caption || '';
  }

  function openLightbox(index) {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox || !galleryItems.length) {
      return;
    }

    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      return;
    }

    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  function createGalleryCard(item, index) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'gallery__card reveal';
    card.style.setProperty('--delay', index * 38 + 'ms');

    var media = document.createElement('span');
    var image = document.createElement('img');
    media.className = 'gallery__media';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.src = item.src;
    image.alt = item.alt || 'Foto de ti';
    media.appendChild(image);
    card.appendChild(media);

    card.addEventListener('click', function () {
      openLightbox(index);
    });

    return card;
  }

  function createCaptionLine(text, index) {
    var line = document.createElement('p');
    line.className = 'gallery__phrase-line reveal';
    line.setAttribute('data-caption-line', 'true');
    line.style.setProperty('--delay', index * 70 + 'ms');
    line.textContent = text;
    return line;
  }

  function extractCaptionLines(data) {
    if (data && Array.isArray(data.captionLines) && data.captionLines.length) {
      return data.captionLines.filter(function (caption) {
        return typeof caption === 'string' && caption.trim();
      });
    }

    if (data && Array.isArray(data.items)) {
      var uniqueCaptions = [];
      data.items.forEach(function (item) {
        if (!item || !item.caption) {
          return;
        }

        if (uniqueCaptions.indexOf(item.caption) === -1) {
          uniqueCaptions.push(item.caption);
        }
      });

      if (uniqueCaptions.length) {
        return uniqueCaptions;
      }
    }

    return defaultCaptions.slice();
  }

  function getItemsPerRow(container) {
    var columns = window.getComputedStyle(container).gridTemplateColumns;
    var repeatMatch = columns.match(/repeat\((\d+)/);
    if (repeatMatch) return Number(repeatMatch[1]);
    return Math.max(1, columns.split(' ').filter(Boolean).length);
  }

  function renderGallery(data) {
    var container = document.getElementById('gallery-grid');
    var subtitle = document.getElementById('gallery-subtitle');

    if (!container || !data || !Array.isArray(data.items)) {
      return;
    }

    currentGalleryData = data;

    if (subtitle && data.subtitle) {
      subtitle.textContent = data.subtitle;
    }

    galleryItems = data.items.filter(function (item) {
      return item && item.src;
    });

    var captionLines = extractCaptionLines(data);
    var itemsPerRow = getItemsPerRow(container);
    renderedItemsPerRow = itemsPerRow;
    var captionIndex = 0;

    container.innerHTML = '';

    if (galleryItems.length) {
      container.appendChild(createCaptionLine(captionLines[captionIndex % captionLines.length], captionIndex));
    }

    galleryItems.forEach(function (item, index) {
      container.appendChild(createGalleryCard(item, index));

      var isRowEnd = (index + 1) % itemsPerRow === 0;
      var hasMoreItems = index < galleryItems.length - 1;

      if (isRowEnd && hasMoreItems) {
        captionIndex += 1;
        container.appendChild(createCaptionLine(captionLines[captionIndex % captionLines.length], captionIndex));
      }
    });
  }

  function setupRowResponsiveness() {
    window.addEventListener('resize', function () {
      if (!currentGalleryData) {
        return;
      }

      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(function () {
        resizeFrame = null;
        var container = document.getElementById('gallery-grid');
        if (container && getItemsPerRow(container) !== renderedItemsPerRow) {
          renderGallery(currentGalleryData);
        }
      });
    });
  }

  function setupLightbox() {
    var closeButton = document.getElementById('lightbox-close');
    var lightbox = document.getElementById('lightbox');

    if (!lightbox) {
      return;
    }

    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    if (closeButton) {
      closeButton.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', function (event) {
      if (!lightbox.hidden && event.key === 'Escape') {
        closeLightbox();
      }
    });
  }

  function initGallery() {
    if (initialized) return;
    initialized = true;
    setupLightbox();
    setupRowResponsiveness();

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutId = window.setTimeout(function () {
      if (controller) controller.abort();
    }, 8000);

    fetch('assets/data/gallery.json', controller ? { signal: controller.signal } : undefined)
      .then(function (response) {
        if (!response.ok) throw new Error('gallery unavailable');
        return response.json();
      })
      .then(renderGallery)
      .catch(function () {
        renderGallery(buildGalleryFallback());
      })
      .finally(function () {
        window.clearTimeout(timeoutId);
      });
  }

  window.MemoriesGallery = {
    init: initGallery
  };
})();
