(function() {
    'use strict';

    var button = {
        html: 'Смотреть онлайн',
        class: 'lampac--buttonv selector focus', // Уникальный класс + Lampa-классы для фокуса
        onclick: true // Для hover:enter
    };

    function addOnlineButton(e) {
        // Проверяем, нет ли уже (как в примере)
        if (e.render.find('.lampac--buttonv').length) return;

        var btn = $(Lampa.Lang.translate(button)); // Перевод, если нужно; fallback на html

        btn.on('hover:enter', function() {
            console.log('My Online Button: Hover enter — поиск онлайн');
            resetTemplates(); // Если есть, очищаем (из примера; убери, если не нужно)

            // Вместо чужого 'lampavod' — пушим активность с поиском (стандарт Lampa)
            // Или модал с поиском; адаптируй под card
            var movie = e.movie || {}; // Данные фильма
            var query = movie.title || movie.original_title || '';

            Lampa.Activity.push({
                url: '', // Пустой для модалки/поиска
                title: 'Онлайн: ' + query,
                component: 'full', // Или 'modal' для попапа; используй 'search' если есть
                search: query,
                search_one: query,
                search_two: movie.original_title || '',
                movie: movie,
                page: 1,
                online: true // Флаг для онлайн-поиска
            });

            // Альтернатива: прямой запуск функции (если push не сработает)
            // openOnlinePlayer(movie);
        });

        // Вставляем перед .view--torrent (как в примере)
        e.render.before(btn);
        console.log('My Online Button: Кнопка добавлена перед torrent-view');

        // Фокус на кнопку (Lampa сама подхватит через selector)
        if (Lampa.Controller && Lampa.Controller.focus) {
            Lampa.Controller.focus(btn[0]);
        }
    }

    // Listener на 'complite' — когда плеер полностью готов (ключевой момент из примера)
    Lampa.Listener.follow('full', function(e) {
        console.log('My Online Button: Full complite, добавляем кнопку');
        if (e.type == 'complite') {
            addOnlineButton({
                render: e.object.activity.render().find('.view--torrent'), // Точка вставки
                movie: e.data.movie || e.data.card || e.data // Данные фильма
            });
        }
    });

    // Функция поиска (если используешь вместо push; интегрируй в hover)
    function openOnlinePlayer(movie) {
        var query = encodeURIComponent((movie.title || '') + ' ' + (movie.original_title || '') + ' ' + (movie.release_date ? movie.release_date.substring(0, 4) : ''));
        console.log('My Online Button: Поиск по:', query);

        var rezkaSearch = 'https://rezkafilm.net/search?phrase=' + query;

        fetch(rezkaSearch, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0 (Lampa Plugin)' }
        })
        .then(response => response.text())
        .then(html => {
            var videoUrl = extractVideoUrl(html);
            if (videoUrl) {
                Lampa.Player.play({ url: videoUrl });
                console.log('Видео запущено');
            } else {
                Lampa.Noty.show('Не нашлось онлайн-ссылки');
            }
        })
        .catch(err => {
            console.log('Ошибка:', err);
            Lampa.Noty.show('Ошибка поиска: ' + err.message);
        });
    }

    function extractVideoUrl(html) {
        // Простой парсер для Rezka
        var match = html.match(/<a href="([^"]*\/release\/[^"]*)"[^>]*>/i);
        return match ? 'https://rezkafilm.net' + match[1] : null;
    }

    // Reset templates (если нужно; из примера, но опционально)
    function resetTemplates() {
        if (Lampa.Templates && Lampa.Templates.reset) {
            Lampa.Templates.reset();
        }
    }

    // Ждём Lampa и jQuery
    function init() {
        if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
            console.log('My Online Button: Инициализация по примеру');
            // Listener уже внутри
        } else {
            setTimeout(init, 500);
        }
    }
    init();

    if (window.Lampa_Plugins) {
        window.Lampa_Plugins.push({ name: 'Online Button Native', init: init });
    }
})();
