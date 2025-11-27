(function() {
    'use strict';

    function initPlugin() {
        console.log('My Online Button: Инициализация плагина'); // Лог для отладки

        Lampa.Listener.follow('full', function (e) {
            console.log('My Online Button: Событие full, тип:', e.type, 'Данные:', e.data); // Лог события

            if (e.type === 'start') {
                var card = e.data.movie || e.data.item; // Расширенная проверка — иногда item или data напрямую
                console.log('My Online Button: Карточка фильма:', card); // Лог данных

                if (card && (card.original_title || card.name || card.title)) { // Более мягкая проверка
                    createOnlineButton(e, card);
                } else {
                    console.log('My Online Button: Нет данных о карточке');
                    createOnlineButton(e, card);
                }
            }
        });
    }

    function createOnlineButton(e, card) {
        // Удаляем старую, если есть
        var oldButton = document.querySelector('#online-watch-btn');
        if (oldButton) {
            oldButton.remove();
            console.log('My Online Button: Удалили старую кнопку');
        }

        // Создаём кнопку через Lampa.Template (если доступно) или вручную
        var buttonHtml = '<div id="online-watch-btn" class="selector focus" style="position: absolute; top: 50px; right: 20px; z-index: 999; background: linear-gradient(to bottom, #ff4757, #ff3838); color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; text-align: center; min-width: 140px;">Смотреть онлайн</div>';

        var button = document.createElement('div');
        button.innerHTML = buttonHtml;
        button = button.firstChild; // Берем первый элемент
        button.onclick = function() {
            console.log('My Online Button: Клик по кнопке');
            openOnlinePlayer(card);
        };

        // Ищем правильный контейнер: контролы плеера
        var playerContainer = document.querySelector('.player-panel') || document.querySelector('.controls') || document.querySelector('.player') || document.body;
        console.log('My Online Button: Вставляем в контейнер:', playerContainer); // Лог

        if (playerContainer) {
            playerContainer.appendChild(button);
            button.focus(); // Фокус для пульта
            console.log('My Online Button: Кнопка добавлена');
        } else {
            console.log('My Online Button: Не нашли контейнер для кнопки');
        }
    }

    function openOnlinePlayer(card) {
        var title = card.original_title || card.name || card.title || '';
        var year = card.release_date ? card.release_date.substring(0, 4) : '';
        var query = encodeURIComponent(title + (year ? ' ' + year : ''));
        console.log('My Online Button: Поиск по запросу:', query);

        // Пример с Rezka (используй прокси, если CORS блокирует; в Lampa есть встроенный)
        var rezkaSearch = 'https://rezkafilm.net/search?phrase=' + query;

        fetch(rezkaSearch, { // Без CORS для теста; добавь прокси если нужно
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        .then(response => response.text())
        .then(html => {
            console.log('My Online Button: HTML получен, длина:', html.length);
            var videoUrl = extractVideoUrl(html);
            if (videoUrl) {
                Lampa.Player.play({url: videoUrl, subtitles: {}}); // Запуск с субтитрами опционально
                console.log('My Online Button: Запуск видео:', videoUrl);
            } else {
                Lampa.Noty.show('Не нашлось ссылки, попробуй другой фильм');
                console.log('My Online Button: Ссылка не найдена');
            }
        })
        .catch(err => {
            Lampa.Noty.show('Ошибка сети: ' + err.message);
            console.log('My Online Button: Ошибка fetch:', err);
        });
    }

    function extractVideoUrl(html) {
        // Улучшенный парсинг для Rezka — ищи первую embed-ссылку
        var match = html.match(/<a href="([^"]+)" class="cell-a">[^<]+<\/a>/); // Ищем первую ссылку на фильм
        if (match) {
            var filmUrl = 'https://rezkafilm.net' + match[1];
            // Здесь можно fetch filmUrl и парсить плеер, но для простоты симулируем
            return 'https://example.com/embed-player.mp4'; // Замени на реальный парсинг или API
        }
        return null;
    }

    // Запуск
    if (typeof Lampa !== 'undefined') {
        initPlugin();
    } else {
        var waitLampa = setInterval(function() {
            if (typeof Lampa !== 'undefined') {
                clearInterval(waitLampa);
                initPlugin();
            }
        }, 500);
    }

    // Регистрация плагина (если Lampa поддерживает)
    if (window.Lampa_Plugins) {
        window.Lampa_Plugins.push({name: 'My Online Button', init: initPlugin});
    }
})();
