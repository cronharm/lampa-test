(function() {
    'use strict';

    // Ждём загрузки Lampa
    if (typeof Lampa !== 'undefined') {
        initPlugin();
    } else {
        document.addEventListener('DOMContentLoaded', initPlugin);
    }

    function initPlugin() {
        // Подписываемся на событие полного экрана плеера
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start') {
                // e.data — данные о карточке (фильм/сериал)
                var card = e.data.card || e.data; // Возьми данные
                if (card && card.original_title) { // Проверяем, есть ли фильм
                    createOnlineButton(e, card);
                }
            }
        });
    }

    function createOnlineButton(e, card) {
        // Удаляем старую кнопку, если есть
        var oldButton = document.querySelector('#online-watch-btn');
        if (oldButton) oldButton.remove();

        // Создаём кнопку
        var button = Lampa.Template.get('button', {
            title: 'Смотреть онлайн',
            html: 'Онлайн (HDRezka)',
            class: 'selector focus',
            onclick: function() {
                openOnlinePlayer(card);
            }
        });

        // Добавляем стиль (опционально, для красоты)
        button.style.cssText = 'position: absolute; top: 10px; right: 10px; z-index: 100; background: #ff0000; color: white; padding: 10px; border-radius: 5px;';

        // Вставляем в плеер (в body или в контролы плеера)
        var player = document.querySelector('.player') || document.body;
        button.id = 'online-watch-btn';
        player.appendChild(button);

        // Фокус на кнопку (для пульта)
        button.focus();
    }

    // Функция открытия онлайн-плеера (пример с парсингом Rezka)
    function openOnlinePlayer(card) {
        var query = encodeURIComponent(card.original_title + ' ' + (card.release_date || ''));
        var rezkaUrl = 'https://rezkafilm.net/search/' + query; // Пример URL поиска

        // Fetch ссылок (нужен CORS-прокси, если блокирует; в плагинах используют proxy)
        fetch('https://cors-anywhere.herokuapp.com/' + rezkaUrl) // Замени на рабочий прокси
            .then(response => response.text())
            .then(html => {
                // Парсим HTML (простой пример; в реальности используй cheerio или regex)
                var videoUrl = extractVideoUrl(html); // Твоя функция парсинга
                if (videoUrl) {
                    Lampa.Player.play({url: videoUrl}); // Запуск в плеере Lampa
                } else {
                    Lampa.Noty.show('Ссылка не найдена :(');
                }
            })
            .catch(err => {
                Lampa.Noty.show('Ошибка поиска: ' + err);
            });
    }

    // Пример функции парсинга (упрощённо; доработай под Rezka API)
    function extractVideoUrl(html) {
        // Ищи iframe или video src в HTML
        var match = html.match(/<iframe src="([^"]+embed[^"]+)"/);
        return match ? match[1] : null;
    }

    // Автозапуск
    if (window.Lampa_Plugins) {
        window.Lampa_Plugins.push({name: 'My Online Button', init: initPlugin});
    }
})();
