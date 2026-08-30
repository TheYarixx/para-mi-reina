(function () {
  var letterFallbackData = {
    badge: '15 de octubre · Happy Birthday, mon amour',
    signature: 'Con todo mi amor,\nJuan Camilo Gonzalez Yaya',
    paragraphs: [
      'Mon amour,',
      'Hoy es 15 de octubre, un día infinitamente especial porque el mundo celebra el regalo de tu existencia. No hay palabras suficientes en ningún idioma para expresar lo profundamente agradecido que estoy por tenerte en mi vida y por poder caminar a tu lado.',
      'Eres una mujer extraordinaria: fuerte, inteligente, sensible y con una luz única que transforma todo a su alrededor. Cada día me descubro admirando la forma en que ves el mundo, tu valentía, tu ternura y la gracia incomparable con la que iluminas mis días.',
      'Para ti, my love, en este nuevo año de vida que comienzas, deseo que nunca olvides lo infinitamente valiosa y amada que eres. Que persigas cada uno de tus sueños con la misma pasión que te caracteriza y que recuerdes siempre que aquí estaré, sosteniendo tu mano en cada paso del camino.',
      'Estudiar idiomas es abrir ventanas a mundos nuevos, pero contigo he descubierto que el amor es nuestro lenguaje más bonito. Tu sonrisa es mi lugar favorito en la tierra y mi refugio más seguro.',
      'Me encanta la forma en que sueñas y cómo le pones el corazón a cada historia y a cada mundo que creas. Escucharte hablar con tanta pasión de tus proyectos, compartir nuestras charlas de todos los días y ver lo brillante que eres me llena de un orgullo gigante. Sin importar la distancia, no hay un solo día en que no me sienta el hombre más afortunado por acompañarte, apoyarte y ser tu fan número uno. Quiero que hoy y siempre te sientas la mujer más valorada y amada del mundo, porque para mí lo eres todo.',
      'Gracias por ser tú. Gracias por existir. Gracias por regalarme la dicha de amarte.',
      'Joyeux anniversaire, mon bien-aimé. Happy Birthday, my love.',
      'Te amo hoy, mañana y pour toujours.'
    ]
  };

  function applyLetter(data) {
    var badge = document.getElementById('letter-badge');
    var content = document.getElementById('letter-content');
    var signature = document.getElementById('letter-signature');

    if (badge && data.badge) {
      badge.textContent = data.badge;
    }

    if (content && Array.isArray(data.paragraphs)) {
      content.innerHTML = '';
      data.paragraphs.forEach(function (paragraph, index) {
        var paragraphElement = document.createElement('p');
        paragraphElement.textContent = paragraph;
        paragraphElement.className = 'letter__paragraph';
        paragraphElement.style.setProperty('--delay', index * 90 + 'ms');
        content.appendChild(paragraphElement);
      });
    }

    if (signature && data.signature) {
      signature.textContent = data.signature;
    }
  }

  function renderLetter() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutId = window.setTimeout(function () {
      if (controller) controller.abort();
    }, 8000);

    return fetch('assets/data/letter.json', controller ? { signal: controller.signal } : undefined)
      .then(function (response) {
        if (!response.ok) throw new Error('letter unavailable');
        return response.json();
      })
      .then(function (data) {
        applyLetter(data);
        return data;
      })
      .catch(function () {
        applyLetter(letterFallbackData);
        return letterFallbackData;
      })
      .finally(function () {
        window.clearTimeout(timeoutId);
      });
  }

  function setupLetterEnvelope() {
    var openButton = document.getElementById('open-letter-button');
    var envelopeScene = document.getElementById('envelope-scene');
    var letterSection = document.getElementById('letter');
    var letterCard = document.getElementById('letter-card');

    if (!openButton || !envelopeScene || !letterCard || !letterSection) {
      return;
    }

    var isOpen = false;
    var closeTimer = null;
    var resizeFrame = null;
    var openFrame = null;
    var resizeObserver = null;

    function calculateOpenEnvelopeHeight() {
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      var letterHeight = Math.ceil(letterCard.getBoundingClientRect().height || letterCard.offsetHeight);
      var envelope = envelopeScene.querySelector('.envelope');
      var envelopeHeight = envelope ? envelope.getBoundingClientRect().height : 0;
      var controlHeight = openButton.getBoundingClientRect().height;

      // El espacio adicional depende de la pantalla y de los elementos medidos,
      // no de breakpoints ni de alturas fijas.
      var verticalBreathingRoom = Math.max(viewportHeight * 0.12, viewportWidth * 0.05);
      var contentHeight = letterHeight + envelopeHeight * 0.45 + controlHeight + verticalBreathingRoom;
      return Math.ceil(Math.max(contentHeight, viewportHeight * 0.82));
    }

    function applyDynamicOpenHeight() {
      var height = calculateOpenEnvelopeHeight();
      envelopeScene.style.minHeight = height + 'px';
    }

    function clearDynamicHeight() {
      envelopeScene.style.removeProperty('min-height');
    }

    function openLetter() {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      letterSection.classList.add('section--letter-open');
      envelopeScene.classList.remove('envelope-scene--closing');
      envelopeScene.classList.add('envelope-scene--open');
      openButton.textContent = 'Cerrar carta';
      openButton.setAttribute('aria-pressed', 'true');
      isOpen = true;

      openFrame = window.requestAnimationFrame(function () {
        openFrame = window.requestAnimationFrame(function () {
          openFrame = null;
          if (isOpen) applyDynamicOpenHeight();
        });
      });
    }

    function closeLetter() {
      if (openFrame) {
        window.cancelAnimationFrame(openFrame);
        openFrame = null;
      }

      letterSection.classList.remove('section--letter-open');
      envelopeScene.classList.add('envelope-scene--closing');
      envelopeScene.classList.remove('envelope-scene--open');
      openButton.textContent = 'Abrir carta';
      openButton.setAttribute('aria-pressed', 'false');
      isOpen = false;
      clearDynamicHeight();

      closeTimer = window.setTimeout(function () {
        envelopeScene.classList.remove('envelope-scene--closing');
      }, 760);
    }

    function toggleLetter() {
      if (isOpen) {
        closeLetter();
      } else {
        openLetter();
      }
    }

    openButton.addEventListener('click', toggleLetter);

    window.addEventListener('resize', function () {
      if (!isOpen || resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(function () {
        resizeFrame = null;
        applyDynamicOpenHeight();
      });
    });

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(function () {
        if (isOpen) applyDynamicOpenHeight();
      });
      resizeObserver.observe(letterCard);
    }

    window.MemoriesLetter = {
      refreshLayout: function () {
        if (isOpen) applyDynamicOpenHeight();
      }
    };
  }

  function setupIntroGateAndMusic() {
    var overlay = document.getElementById('intro-gate');
    var startButton = document.getElementById('start-experience');
    var audio = document.getElementById('global-love-song');
    var player = document.getElementById('floating-music-player');
    var playerToggle = document.getElementById('player-toggle');
    var playPauseButton = document.getElementById('player-play-pause');
    var volumeUpButton = document.getElementById('player-volume-up');
    var volumeDownButton = document.getElementById('player-volume-down');

    if (!overlay || !startButton || !audio || !player) {
      return;
    }

    var experienceStarted = false;

    function safePlay() {
      try {
        return Promise.resolve(audio.play());
      } catch (error) {
        return Promise.reject(error);
      }
    }

    function updatePlayPauseButton() {
      if (!playPauseButton) {
        return;
      }

      if (audio.paused) {
        playPauseButton.textContent = 'Tocar';
        playPauseButton.setAttribute('aria-label', 'Reproducir música');
      } else {
        playPauseButton.textContent = 'Pausar';
        playPauseButton.setAttribute('aria-label', 'Pausar música');
      }
    }

    function adjustVolume(delta) {
      var currentVolume = typeof audio.volume === 'number' ? audio.volume : 0.5;
      var nextVolume = Math.max(0, Math.min(1, currentVolume + delta));
      audio.volume = Math.round(nextVolume * 100) / 100;
    }

    function showPlayer() {
      player.classList.remove('player-music--hidden');
      player.classList.add('player-music--active');
      player.setAttribute('aria-hidden', 'false');
    }

    function setPlayerExpanded(expanded) {
      player.classList.toggle('player-music--expanded', expanded);
      if (playerToggle) {
        playerToggle.setAttribute('aria-expanded', String(expanded));
        playerToggle.setAttribute('aria-label', expanded ? 'Cerrar controles de música' : 'Abrir controles de música');
      }
    }

    function revealMainExperience() {
      overlay.classList.add('intro-overlay--leaving');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('experience-locked');
      document.body.classList.add('experience-unlocked');

      window.setTimeout(function () {
        overlay.hidden = true;
      }, 900);
    }

    function playInitialSong() {
      function playFromPoint() {
        try {
          audio.currentTime = 0;
          audio.volume = 0.5;
          return safePlay();
        } catch (e) {
          return Promise.reject(e);
        }
      }

      if (audio.readyState >= 1) {
        return playFromPoint();
      }

      return new Promise(function (resolve, reject) {
        var finished = false;
        var timeoutId = window.setTimeout(function () {
          finishWithError();
        }, 5000);

        function finishWithSuccess() {
          if (finished) {
            return;
          }

          finished = true;
          clearListeners();
          playFromPoint().then(resolve).catch(reject);
        }

        function finishWithError() {
          if (finished) {
            return;
          }

          finished = true;
          clearListeners();
          reject(new Error('Audio file pending or not loaded'));
        }

        function clearListeners() {
          window.clearTimeout(timeoutId);
          audio.removeEventListener('loadedmetadata', finishWithSuccess);
          audio.removeEventListener('error', finishWithError);
        }

        audio.addEventListener('loadedmetadata', finishWithSuccess, { once: true });
        audio.addEventListener('error', finishWithError, { once: true });
        audio.load();
      });
    }

    function startExperience() {
      if (experienceStarted) {
        return;
      }

      experienceStarted = true;
      startButton.disabled = true;
      startButton.setAttribute('aria-busy', 'true');

      playInitialSong()
        .catch(function (error) {
          console.log('Información: Audio listo para reproducir cuando agregues la canción.', error);
        })
        .finally(function () {
          showPlayer();
          revealMainExperience();
          updatePlayPauseButton();
          startButton.removeAttribute('aria-busy');
        });
    }

    function togglePlayPause() {
      if (audio.paused) {
        safePlay().catch(function (error) {
          console.warn('Reproducción de audio no iniciada:', error);
        });
        return;
      }

      audio.pause();
    }

    startButton.addEventListener('click', startExperience);

    if (playerToggle) {
      playerToggle.addEventListener('click', function () {
        setPlayerExpanded(!player.classList.contains('player-music--expanded'));
      });
    }

    if (playPauseButton) {
      playPauseButton.addEventListener('click', togglePlayPause);
    }

    if (volumeUpButton) {
      volumeUpButton.addEventListener('click', function () {
        adjustVolume(0.1);
      });
    }

    if (volumeDownButton) {
      volumeDownButton.addEventListener('click', function () {
        adjustVolume(-0.1);
      });
    }

    audio.addEventListener('play', updatePlayPauseButton);
    audio.addEventListener('pause', updatePlayPauseButton);

    audio.volume = 0.5;
    updatePlayPauseButton();
  }

  function setupBackToTop() {
    var backButton = document.getElementById('back-to-top');
    var start = document.getElementById('hero');

    if (!backButton || !start) {
      return;
    }

    backButton.addEventListener('click', function () {
      start.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  var hasInitialized = false;

  function refreshLayouts() {
    if (window.MemoriesLetter) window.MemoriesLetter.refreshLayout();
  }

  function initProject() {
    if (hasInitialized) return;
    hasInitialized = true;
    if (window.MemoriesIntro) window.MemoriesIntro.init();
    if (window.MemoriesTimeline) window.MemoriesTimeline.init();
    if (window.MemoriesGallery) window.MemoriesGallery.init();
    if (window.MemoriesCounter) window.MemoriesCounter.init();
    if (window.MemoriesEffects) window.MemoriesEffects.init();
    if (window.MemoriesMeteors) window.MemoriesMeteors.init();

    setupLetterEnvelope();
    renderLetter().then(function () {
      window.requestAnimationFrame(refreshLayouts);
    });
    setupIntroGateAndMusic();
    setupBackToTop();
  }

  document.addEventListener('DOMContentLoaded', initProject);
  window.addEventListener('load', refreshLayouts, { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshLayouts).catch(function () {});
  }
})();
