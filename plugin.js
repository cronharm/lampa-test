(function() {
    'use strict';

    function initPlugin() {
        console.log('My Online Button: Инициализация с нативным UI');

        Lampa.Listener.follow('full', function (e) {
            console.log('My Online Button: Full event:', e.type, e.data);

            if (e.type === 'start') {
                var card = e.data.movie;
                console.log('My Online Button: Card data:', card);

                if (card && (card.original_title || card.name || card.title)) {
                    // Ждём, пока плеер полностью загрузится (таймаут из примеров плагинов)
                    setTimeout(function() {
                        createNativeOnlineButton(e, card);
                    }, 500);
                }
            }
        });
    }

    function createNativeOnlineButton(e, card) {
        // Удаляем старую
        var oldButton = document.querySelector('#online-watch-btn');
        if (oldButton) oldButton.remove();

        // Создаём через Lampa.Template — как в online_mod.js (button или more для меню)
        var params = {
            title: 'Онлайн',
            html: $('<div></div>').text('Смотреть онлайн (HDRezka)').prop('title', 'Открыть онлайн-плеер'),
            class: 'open focus selector', // Классы для фокуса и стиля Lampa
            onclick: openOnlinePlayer.bind(null, card) // Bind для передачи card
        };

        // Пробуем Template.get('button') — стандарт для кнопок в плеере
        var button;
        if (Lampa.Template && Lampa.Template.get) {
            button = Lampa.Template.get('button', params);
            console.log('My Online Button: Кнопка создана через Template');
        } else {
            // Fallback на HTML, но с классами для эмуляции
            button = $('<div/>', {
                id: 'online-watch-btn',
                class: 'selector focus open',
                text: 'Смотреть онлайн',
                css: { margin: '5px', padding: '10px', background: '#ff4757', color: 'white', borderRadius: '5px', textAlign: 'center' },
                click: function() { openOnlinePlayer(card); }
            });
            console.log('My Online Button: Fallback HTML-кнопка');
        }

        // Ищем правильный контейнер: панель справа в плеере (из исходников player.js)
        var rightPanel = document.querySelector('.player-panel__right') || 
                         document.querySelector('.player__right') || 
                         document.querySelector('.controls__right') || 
                         document.querySelector('.selector'); // Список опций
        console.log('My Online Button: Контейнер для вставки:', rightPanel);

        if (rightPanel) {
            // Append как child — в плагинах так добавляют в меню
            $(rightPanel).append(button);

            // Фокус через Lampa (если доступно) или вручную
            if (Lampa.Controller && Lampa.Controller.focus) {
                Lampa.Controller.focus($(button)[0]);
                console.log('My Online Button: Фокус через Controller');
            } else {
                button.focus();
            }

            // Добавляем в навигацию: обновляем active для selector (из примеров)
            if (rightPanel.classList.contains('selector')) {
                rightPanel.querySelector('.selector').classList.add('active'); // Или button.addClass('active')
            }

            console.log('My Online Button: Кнопка вставлена и сфокусирована');
        } else {
            console.log('My Online Button: Не нашли панель — fallback в body');
            $('body').append(button);
            button.focus();
        }
    }

    function openOnlinePlayer(card) {
        var title = card.original_title || card.name || card.title || '';
        var year = card.release_date ? card.release_date.substring(0, 4) : '';
        var query = encodeURIComponent(title + (year ? ' ' + year : ''));
        console.log('My Online Button: Запрос для онлайн:', query);

        var rezkaSearch = 'https://rezkafilm.net/search?phrase=' + query;

        fetch(rezkaSearch, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0 (Android TV; Lampa)' }
        })
        .then(response => response.text())
        .then(html => {
            var videoUrl = extractVideoUrl(html);
            if (videoUrl) {
                // Запуск в плеере Lampa — как в нативных кнопках
                Lampa.Player.play({ url: videoUrl, timeline: 0 });
                console.log('My Online Button: Плеер запущен');
            } else {
                Lampa.Noty.show('Ссылка не найдена, попробуй поиск вручную');
            }
        })
        .catch(err => {
            Lampa.Noty.show('Ошибка: ' + err.message);
            console.log('Ошибка:', err);
        });
    }

    function extractVideoUrl(html) {
        // Улучшенный матч для Rezka (из парсеров плагинов)
        var match = html.match(/<a href="([^"]+)"[^>]*data-original[^>]*>(.*?"+title+"[^<]*)<\/a>/i);
        if (match) {
            return 'https://rezkafilm.net' + match[1]; // Или полный парсинг плеера
        }
        // Симуляция для теста
        return 'https://example.com/test-stream.m3u8';
    }

    // Запуск с ожиданием Lampa и jQuery (Lampa использует $)
    function waitForLampa() {
        if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
            initPlugin();
        } else {
            setTimeout(waitForLampa, 300);
        }
    }
    waitForLampa();

    if (window.Lampa_Plugins) {
        window.Lampa_Plugins.push({ name: 'My Online Button Native', init: initPlugin });
    }
})();
