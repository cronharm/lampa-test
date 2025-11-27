(function () {
    'use strict';

    // Чтобы не добавлять кнопку сто раз
    let buttonAdded = false;

    function addButton(e) {
      if (e.render.find('.lampac--buttonv').length) return;
      var btn = $(Lampa.Lang.translate(button));
      btn.on('hover:enter', function() {
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
      e.render.before(btn);
    }
    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'complite') {
        addButton({
          render: e.object.activity.render().find('.view--torrent'),
          movie: e.data.movie
        });
      }
    });

    console.log('Плагин «Смотреть онлайн» загружен (без ошибок)');
})();
