(function () {
    'use strict';

    // Чтобы не добавлять кнопку сто раз
    let buttonAdded = false;

    // Сама кнопка
    function createButton() {
        let btn = $('<div class="selector focus button--online">Смотреть онлайн2</div>');
        
        btn.on('hover:enter', function () {
            let movie = window.movie || Lampa.Storage.get('activity_movie') || {};
            let query = (movie.title || movie.original_title || ' ').trim();

            // Самый надёжный способ открыть онлайн-поиск в Lampa
            Lampa.Activity.push({
                url: '',
                title: 'Онлайн — ' + query,
                component: 'online',
                search: query,
                movie: movie,
                page: 1
            });
        });

        return btn;
    }

    // Основная функция — вызывается на complite
    function tryAddButton() {
        if (buttonAdded) return;

        // Ищем любой из известных контейнеров торрентов (подходит для всех сборок)
        let container = $(
            '.view--torrent, ' +
            '.torrents, ' +
            '.view--sources, ' +
            '.sources--torrent, ' +
            '.full-activity .view'
        ).first();

        if (container.length === 0) return;

        // Если уже есть наша кнопка — выходим
        if (container.find('.button--online').length) {
            buttonAdded = true;
            return;
        }

        // Вставляем в начало списка (самое красивое место)
        container.prepend(createButton());
        buttonAdded = true;

        console.log('Онлайн-кнопка добавлена красиво и без ошибок');
    }

    // Ловим на завершение загрузки плеера
    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') {
            // Небольшая задержка, чтобы DOM точно отрисовался
            setTimeout(tryAddButton, 300);
        }
    });

    // На случай, если пользователь переключает серии/источники
    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'start') buttonAdded = false;
    });

    console.log('Плагин «Смотреть онлайн» загружен (без ошибок)');
})();
