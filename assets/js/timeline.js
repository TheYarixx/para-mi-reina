(function () {
  var timelineFallbackData = {
    subtitle: "Algunas fechas y momentos que cuentan lo mucho que amarte se ha vuelto parte de mí.",
    events: [
      {
        date: "[FECHA]",
        title: "[MOMENTO ESPECIAL 1]",
        text: "[LO QUE QUIERO DECIR AQUÍ]"
      },
      {
        date: "[FECHA]",
        title: "[MOMENTO ESPECIAL 2]",
        text: "[LO QUE QUIERO DECIR AQUÍ]"
      },
      {
        date: "[FECHA]",
        title: "[MOMENTO ESPECIAL 3]",
        text: "[LO QUE QUIERO DECIR AQUÍ]"
      },
      {
        date: "[FECHA]",
        title: "[MOMENTO ESPECIAL 4]",
        text: "[LO QUE QUIERO DECIR AQUÍ]"
      },
      {
        date: "15/10",
        title: "Tu cumpleaños · Happy Birthday",
        text: "El día en que llegó al mundo la persona que llena mis días de alegría y amor. Joyeux anniversaire, mon amour!"
      },
      {
        date: "15/10",
        title: "tus cualidades",
        text: "cariñosa,inteligenteetc"
      }
    ],
    closingMessage: "Cada una de estas fechas se convirtió en un tesoro en mi memoria. Gracias por llenar mi vida de magia. Je t'aime pour siempre."
  };
  var initialized = false;

  function fetchTimelineData() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutId = window.setTimeout(function () {
      if (controller) controller.abort();
    }, 8000);

    return fetch('assets/data/timeline.json', controller ? { signal: controller.signal } : undefined)
      .then(function (response) {
        if (!response.ok) throw new Error('timeline unavailable');
        return response.json();
      })
      .finally(function () {
        window.clearTimeout(timeoutId);
      });
  }

  function createEventCard(event, index) {
    var card = document.createElement('article');
    card.className = 'timeline-stairs__card reveal';
    card.style.setProperty('--delay', index * 80 + 'ms');
    card.style.setProperty('--step', String(index % 3));
    var date = document.createElement('p');
    var title = document.createElement('h3');
    var text = document.createElement('p');
    date.className = 'timeline__date';
    date.textContent = event.date || '';
    title.textContent = event.title || '';
    text.textContent = event.text || '';
    card.append(date, title, text);
    return card;
  }

  function renderTimeline(data) {
    var listContainer = document.getElementById('timeline-list');
    var subtitle = document.getElementById('timeline-subtitle');
    var closing = document.getElementById('timeline-closing');

    if (!listContainer || !data || !Array.isArray(data.events)) return;

    if (subtitle && data.subtitle) {
      subtitle.textContent = data.subtitle;
    }

    listContainer.innerHTML = '';
    data.events.forEach(function (event, index) {
      listContainer.appendChild(createEventCard(event, index));
    });

    if (closing && data.closingMessage) {
      closing.textContent = data.closingMessage;
    }
  }

  function initTimeline() {
    if (initialized) return;
    initialized = true;
    fetchTimelineData()
      .then(renderTimeline)
      .catch(function () {
        renderTimeline(timelineFallbackData);
      });
  }

  window.MemoriesTimeline = { init: initTimeline };
})();
