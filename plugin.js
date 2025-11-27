(function () {
    'use strict';

    function addButton(e) {
        if (!e.render.length) return; // чтобы не падало
        if (e.render.find('.lampac--buttonv').length) return;

        let btn = $('<div class="full-start__button selector button--online"><svg><use xlink:href="#sprite-play"></use></svg><span>Смотреть онлайн</span></div>');

        btn.on('hover:enter', function () {
            resetTemplates();
            Lampa.Component.add('lampavod', component);
            Lampa.Activity.push({
                url: '',
                title: 'test btn',
                component: 'lampavod',
                search: e.movie.title,
                search_one: e.movie.title,
                search_two: e.movie.original_title,
                movie: e.movie,
                page: 1
            });
        });

        e.render.after(btn);
    }

    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') {
            let parent = e.object.activity.render();
            let block = parent.find('.full-start-new__buttons');

            addButton({
                render: block,
                movie: e.data.movie
            });
        }
    });

    console.log('Плагин «Смотреть онлайн» загружен');
})();
