(function() {
    'use strict';

    var addedFlag = false; // Флаг, чтобы не дублировать (из-за повторных complite)

    var button = {
        html: 'Смотреть онлайн',
        class: 'lampac--buttonv selector focus', // Классы для Lampa
        onclick: true
    };

    function addOnlineButton(e) {
        if (addedFlag || e.render.find('.lampac--buttonv').length) {
            console.log('My Online Button: Кнопка уже есть, пропускаем');
            return;
        }

        // Безопасно: оборачиваем render в $ и проверяем
        var renderJq = $(e.render());
        if (!renderJq.length) {
            console.log('My Online Button: Render пустой, fallback');
            // Fallback: ищем глобальный torrent-view
            renderJq = $('.view--torrent') || $('.torrent-list') || $('.view');
            if (!renderJq.length) {
                console.log('My Online Button: Нет torrent-view, вставляем в player-panel');
                renderJq = $('.player-panel') || $('.controls');
            }
        }

        var btn = $(Lampa.Lang.translate(button) || button.html); // Fallback на текст, если translate сломается

        btn.on('hover:enter', function() {
            console.log('My Online Button: Hover — запускаем онлайн');
            addedFlag = false; // Сброс для следующего видео
            resetTemplates();

            var movie = e.movie || {};
            var query = movie.title || movie.original_title || '';

            // Push активность (как в примере)
            Lampa.Activity.push({
                url: '',
                title: 'Онлайн: ' + query,
                component: 'full', // Или 'search'/'modal' по версии
                search: query,
                search_one: query,
                search_two: movie.original_title || '',
                movie: movie,
                page: 1,
                online: true
            });

            // Если push не открывает модалку, раскомменти: openOnlinePlayer(movie);
        });

        // Вставляем перед .view--torrent, но только если элемент есть
        var torrentView = renderJq.find('.view--torrent');
        if (torrentView.length) {
            torrentView.before(btn);
            console.log('My Online Button: Кнопка перед .view--torrent');
        } else {
            // Fallback: аппенд в render
            renderJq.append(btn);
            console.log('My Online Button: Кнопка аппендирована в render');
        }

        // Фокус
        if (Lampa.Controller && Lampa.Controller.focus) {
            Lampa.Controller.focus(btn[0]);
        }

        addedFlag = true;
        console.log('My Online Button: Кнопка готова');
    }

    Lampa.Listener.follow('full', function(e) {
        console.log('My Online Button: Full complite');
        if (e.type == 'complite') {
            addOnlineButton({
                render: e.object.activity.render, // Передаём функцию render, а не вызов
                movie: e.data.movie || e.data.card || e.data
            });
        }
    });

    function openOnlinePlayer(movie) {
        var title = movie.title || movie.original_title || '';
        var year = movie.release_date ? movie.release_date.substring(0, 4) : '';
        var query = encodeURIComponent(title + (year ? ' ' + year : ''));
        console.log('My Online Button: Поиск:', query);

        var searchUrl = 'https://rezkafilm.net/search?phrase=' + query;

        fetch(searchUrl, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0 (Lampa/Plugin)' }
        })
        .then(response => response.text())
        .then(html => {
            var videoUrl = extractVideoUrl(html);
            if (videoUrl && Lampa.Player && Lampa.Player.play) {
                Lampa.Player.play({ url: videoUrl });
                console.log('Запуск:', videoUrl);
            } else {
                Lampa.Noty ? Lampa.Noty.show('Ссылка не найдена') : alert('Не нашлось');
            }
        })
        .catch(err => {
            console.log('Ошибка:', err);
            Lampa.Noty ? Lampa.Noty.show(err.message) : alert(err.message);
        });
    }

    function extractVideoUrl(html) {
        var match = html.match(/<a href="([^"]*\/release\/[^"]*)"[^>]*>/i);
        return match ? 'https://rezkafilm.net' + match[1] : null;
    }

    function resetTemplates() {
        if (Lampa.Templates && Lampa.Templates.reset) Lampa.Templates.reset();
    }

    function init() {
        if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
            console.log('My Online Button: Готово');
        } else {
            setTimeout(init, 500);
        }
    }
    init();

    if (window.Lampa_Plugins) {
        window.Lampa_Plugins.push({ name: 'Online Button Safe', init: init });
    }
})();
