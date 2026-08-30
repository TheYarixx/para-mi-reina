(function () {
  var revealObserver = null;
  var mutationObserver = null;
  var parallaxFrame = null;
  var initialized = false;

  function makeVisible(element) {
    if (!element || element.classList.contains('visible')) {
      return;
    }

    element.classList.add('visible');
  }

  function observeElement(element) {
    if (!element || !element.classList || !element.classList.contains('reveal')) {
      return;
    }

    if (!revealObserver) {
      makeVisible(element);
      return;
    }

    revealObserver.observe(element);
  }

  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        makeVisible(element);
      });
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          makeVisible(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    elements.forEach(function (element) {
      observeElement(element);
    });

    mutationObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (addedNode) {
          if (!addedNode || addedNode.nodeType !== 1) {
            return;
          }

          if (addedNode.matches && addedNode.matches('.reveal')) {
            observeElement(addedNode);
          }

          if (addedNode.querySelectorAll) {
            addedNode.querySelectorAll('.reveal').forEach(function (element) {
              observeElement(element);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function createBackgroundParticles() {
    var layer = document.getElementById('particles-layer');
    if (!layer) {
      return;
    }

    var total = window.matchMedia('(max-width: 768px)').matches ? 42 : 78;
    var fragment = document.createDocumentFragment();

    for (var index = 0; index < total; index++) {
      var particle = document.createElement('span');
      particle.className = 'particle-light';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = (Math.random() * 6).toFixed(2) + 's';
      particle.style.animationDuration = (6 + Math.random() * 7).toFixed(2) + 's';
      particle.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
      fragment.appendChild(particle);
    }

    layer.innerHTML = '';
    layer.appendChild(fragment);
  }

  function fillHearts(container, total) {
    if (!container) {
      return;
    }

    container.innerHTML = '';

    var fragment = document.createDocumentFragment();

    for (var index = 0; index < total; index++) {
      var heart = document.createElement('span');
      var size = (8 + Math.random() * 16).toFixed(1);
      var duration = (8 + Math.random() * 9).toFixed(2);
      var delay = (-Math.random() * 14).toFixed(2);

      heart.className = 'heart-floating';
      heart.style.left = (Math.random() * 100).toFixed(2) + '%';
      heart.style.setProperty('--heart-size', size + 'px');
      heart.style.animationDuration = duration + 's';
      heart.style.animationDelay = delay + 's';
      heart.style.opacity = (0.12 + Math.random() * 0.35).toFixed(2);
      fragment.appendChild(heart);
    }

    container.appendChild(fragment);
  }

  function initHeartsInSections() {
    var sections = document.querySelectorAll('section.section');
    var total = window.matchMedia('(max-width: 768px)').matches ? 16 : 26;

    sections.forEach(function (section) {
      if (section.id === 'hero') {
        return;
      }

      var container = section.querySelector('.time-hearts');
      if (!container) {
        container = section.querySelector('.background-hearts');
      }

      if (!container) {
        container = document.createElement('div');
        container.className = 'background-hearts';
        container.setAttribute('aria-hidden', 'true');
        section.insertBefore(container, section.firstChild);
      }

      fillHearts(container, total);
    });
  }

  function initSubtleParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var lastValue = 0;
    var pendingOffset = 0;

    window.addEventListener('scroll', function () {
      pendingOffset = window.scrollY * 0.06;
      if (parallaxFrame) return;
      parallaxFrame = window.requestAnimationFrame(function () {
        parallaxFrame = null;
        if (Math.abs(pendingOffset - lastValue) <= 0.4) return;
        document.documentElement.style.setProperty('--parallax-offset', pendingOffset.toFixed(2) + 'px');
        lastValue = pendingOffset;
      });
    }, { passive: true });
  }

  function initEffects() {
    if (initialized) return;
    initialized = true;
    createBackgroundParticles();
    initScrollReveal();
    initHeartsInSections();
    initSubtleParallax();
  }

  window.MemoriesEffects = {
    init: initEffects,
    observeReveal: observeElement,
    destroy: function () {
      if (revealObserver) revealObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      if (parallaxFrame) window.cancelAnimationFrame(parallaxFrame);
    }
  };
})();
