(function() {
    'use strict';

    if (typeof Lampa !== 'undefined') {
        // Ждём готовности Lampa
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                // Теперь добавляем кнопку в карточки
                Lampa.Listener.follow('card', function (e) {
                    if (e.type === 'add') {
                        // Создаём кнопку — иконка просмотра
                        var btn = $('<div class="card__view icon-view"></div>');
                        
                        // При клике/наведении — действие
                        btn.on('hover:enter', function () {
                            Lampa.Noty.show('Hello World from Liya! Кнопка работает 😊');
                        });

                        // Вставляем кнопку в карточку
                        e.object.find('.card__buttons').append(btn);
                    }
                });

                console.log('Liya Hello Watch plugin loaded after ready!');
            }
        });
    }
})();
