(function() {
    'use strict';

    function initPlugin() {
        console.log('My Online Button: Запуск без Template — нативный HTML');

        Lampa.Listener.follow('full', function (e) {
            console.log('My Online Button: Full событие:', e.type, 'Данные:', e.data);

            if (e.type === 'start') {
                var card = e.data.movie;
                console.log('My Online Button: Данные карточки:', card);

                if (card && (card.original_title || card.name || card.title)) {
                    // Небольшая задержка, чтобы плеер отрисовался (как в плагинах)
                    setTimeout(function() {
                        createHtmlOnlineButton(e, card);
                    }, 800);
                } else {
                    console.log('My Online Button: Нет карточки — пропускаем');
                }
            }
        });
    }

    function createHtmlOnlineButton(e, card) {
        // Чистим старую
        var oldButton = document.getElementById('online-watch-btn');
        if (oldButton) {
            oldButton.remove();
            console.log('My Online Button: Старую удалили');
        }

        // HTML-кнопка с классами Lampa для фокуса и стилей (из примеров плагинов)
        var buttonHtml = '<div id="online-watch-btn" class="selector focus open" style="display: inline-block; margin: 5px; padding: 10px 15px; background: #ff4757; color: white; border-radius: 5px; font-size: 14px; text-align: center; cursor: pointer; z-index: 10;">Смотреть онлайн</div>';

        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = buttonHtml;
        var button = tempDiv.firstChild;

        // Обработчик клика
        button.addEventListener('click', function() {
            console.log('My Online Button: Кликнули!');
            openOnlinePlayer(card);
        });

        // Ищем контейнер: toolbar или selector в плеере (стандарт из player.js)
        var toolbar = document.querySelector('.player-panel__toolbar') || 
                      document.querySelector('.player__controls') || 
                      document.querySelector('.selector') || 
                      document.querySelector('.player-panel');
        console.log('My Online Button: Контейнер найден:', toolbar);

        if (toolbar) {
            toolbar.appendChild(button);

            // Фокус: через Lampa.Controller (если есть, как в плагинах) или нативно
            if (Lampa.Controller && Lampa.Controller.focus) {
                Lampa.Controller.focus(button);
                console.log('My Online Button: Фокус через Controller');
            } else {
                button.focus();
                // Эмуляция active для пульта (добавляем класс)
                button.classList.add('active');
            }

            // Дополнительно: обновляем контроллер, чтобы кнопка в навигации (из примеров)
            if (Lampa.Controller && Lampa.Controller.update) {
                Lampa.Controller.update();
            }

            console.log('My Online Button: Кнопка на месте, фокус дан');
        } else {
            console.log('My Online Button: Контейнер не найден — в body');
            document.body.appendChild(button);
            button.focus();
        }
    }

    function openOnlinePlayer(card) {
        var title = card.original_title || card.name || card.title || '';
        var year = card.release_date ? card.release_date.substring(0, 4) : '';
        var query = encodeURIComponent(title + (year ? ' ' + year : ''));
        console.log('My Online Button: Ищем по:', query);

        // Пример для Rezka (добавь прокси, если CORS)
        var searchUrl = 'https://rezkafilm.net/search?phrase=' + query;

        fetch(searchUrl, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0 (Android; Lampa/1.0)' }
        })
        .then(function(response) { return response.text(); })
        .then(function(html) {
            console.log('My Online Button: HTML загружен');
            var videoUrl = extractVideoUrl(html);
            if (videoUrl) {
                // Запуск как в Lampa
                if (Lampa.Player && Lampa.Player.play) {
                    Lampa.Player.play({ url: videoUrl });
                } else {
                    window.location.href = videoUrl; // Fallback
                }
                console.log('My Online Button: Видео пошло:', videoUrl);
            } else {
                Lampa.Noty ? Lampa.Noty.show('Не нашлось, поищи сам') : alert('Ссылка не найдена');
            }
        })
        .catch(function(err) {
            console.log('My Online Button: Ошибка:', err);
            Lampa.Noty ? Lampa.Noty.show('Сеть барахлит: ' + err.message) : alert(err.message);
        });
    }

    function extractVideoUrl(html) {
        // Простой парсинг для Rezka (улучши по нужде)
        var match = html.match(/<a href="([^"]*\/release\/[^"]*)"[^>]*>(.*?"+title+"[^<]*)<\/a>/i);
        if (match) {
            return 'https://rezkafilm.net' + match[1]; // Полная страница, потом парсь плеер
        }
        // Тестовая ссылка
        return 'https://example.com/stream.m3u8';
    }

    // Ждём Lampa
    function waitAndInit() {
        if (typeof Lampa !== 'undefined') {
            initPlugin();
        } else {
            setTimeout(waitAndInit, 400);
        }
    }
    waitAndInit();

    // Плагин-регистр
    if (window.Lampa_Plugins) {
        window.Lampa_Plugins.push({ name: 'Online Button HTML', init: initPlugin });
    }
})();
