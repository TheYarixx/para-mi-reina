(function () {
  var METEOR_PHRASES = [
    'Happy Birthday, my love',
    'Joyeux anniversaire, mon amour',
    'Te amo',
    'Mon amour',
    'Eres mi persona favorita',
    '15 de Octubre · Un día especial',
    'My favorite place is by your side',
    'Pour toujours',
    'Iluminas cada uno de mis días',
    'Forever and always',
    'Tu sonrisa es mi refugio',
    'For you',
    'Cada instante a tu lado es un regalo',
    'Mon bien-aimé',
    'Simplemente perfecta',
    'Universo de mi corazón',
    'Gracias por existir',
    'You take my breath away',
    'Je t\'aime',
    'La paz de mi corazón tiene tu nombre',
    'Tu luz lo cambia todo',
    'Eres mi sueño más bonito',
    'Un amor para siempre',
    'Happy Birthday'
  ];

  var intervals = [];
  var timeouts = [];
  var initialized = false;
  var scene = null;

  function randomPhrase() {
    return METEOR_PHRASES[Math.floor(Math.random() * METEOR_PHRASES.length)];
  }

  function meteorImages() {
    return [
      'assets/img/gallery/provas-do-meu-amor/1-prova-do-meu-amor-por-voce.jpg.jpeg',
      'assets/img/gallery/provas-do-meu-amor/2-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/3-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/4-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/5-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/6-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/7-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/8-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/9-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/10-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/11-prova-do-meu-amor-por-voce.jpeg',
      'assets/img/gallery/provas-do-meu-amor/12-prova-do-meu-amor-por-voce.jpeg'
    ];
  }

  function clearIntervals() {
    intervals.forEach(function (id) {
      window.clearInterval(id);
    });
    intervals = [];
    timeouts.forEach(function (id) {
      window.clearTimeout(id);
    });
    timeouts = [];
  }

  function createStars(container) {
    var total = window.matchMedia('(max-width: 768px)').matches ? 52 : 104;
    for (var i = 0; i < total; i++) {
      var star = document.createElement('span');
      star.className = 'meteor-star';
      star.style.left = (Math.random() * 100).toFixed(2) + '%';
      star.style.top = (Math.random() * 100).toFixed(2) + '%';
      star.style.opacity = (0.18 + Math.random() * 0.62).toFixed(2);
      star.style.animationDelay = (Math.random() * 6).toFixed(2) + 's';
      container.appendChild(star);
    }
  }

  function countActive(container, selector) {
    return container.querySelectorAll(selector).length;
  }

  function createMeteorPhrase(container) {
    var limit = window.matchMedia('(max-width: 768px)').matches ? 4 : 8;
    if (countActive(container, '.meteor-phrase') >= limit) {
      return;
    }

    var item = document.createElement('span');
    item.className = 'meteor-phrase';
    item.textContent = randomPhrase();
    item.style.left = (64 + Math.random() * 34).toFixed(2) + '%';
    item.style.top = (-12 + Math.random() * 26).toFixed(2) + '%';
    item.style.animationDuration = (18 + Math.random() * 12).toFixed(2) + 's';
    item.style.fontSize = (14 + Math.random() * 12).toFixed(0) + 'px';
    item.style.opacity = (0.6 + Math.random() * 0.34).toFixed(2);
    container.appendChild(item);

    item.addEventListener('animationend', function () {
      item.remove();
    });
  }

  function createMeteorImage(container, photos) {
    var limit = window.matchMedia('(max-width: 768px)').matches ? 2 : 4;
    if (countActive(container, '.meteor-image') >= limit) {
      return;
    }

    var wrapper = document.createElement('span');
    wrapper.className = 'meteor-image';
    wrapper.style.left = (70 + Math.random() * 28).toFixed(2) + '%';
    wrapper.style.top = (-10 + Math.random() * 24).toFixed(2) + '%';
    wrapper.style.animationDuration = (20 + Math.random() * 12).toFixed(2) + 's';

    var image = document.createElement('img');
    image.src = photos[Math.floor(Math.random() * photos.length)];
    image.alt = 'Recuerdo imborrable';

    wrapper.appendChild(image);
    container.appendChild(wrapper);

    wrapper.addEventListener('animationend', function () {
      wrapper.remove();
    });
  }

  function startMeteors() {
    if (!scene) {
      return;
    }

    clearIntervals();
    scene.innerHTML = '';

    createStars(scene);
    var photos = meteorImages();

    intervals.push(window.setInterval(function () {
      createMeteorPhrase(scene);
    }, 3000));

    intervals.push(window.setInterval(function () {
      if (Math.random() > 0.26) {
        createMeteorImage(scene, photos);
      }
    }, 6400));

    for (var index = 0; index < 2; index++) {
      timeouts.push(window.setTimeout(function () {
        createMeteorPhrase(scene);
      }, index * 3200));
    }
  }

  function initMeteors() {
    if (initialized) return;
    initialized = true;
    scene = document.getElementById('meteors-scene');
    if (!scene) return;
    if (!document.hidden) startMeteors();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearIntervals();
      else startMeteors();
    });
  }

  window.MemoriesMeteors = {
    init: initMeteors,
    destroy: clearIntervals
  };
})();
