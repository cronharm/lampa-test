(function() {
    'use strict';

    // Проверяем, что мы в Lampa
    if (typeof Lampa !== 'undefined') {
        // Добавляем кнопку в карточки (фильмы/сериалы)
        Lampa.Listener.follow('card', function (e) {
            if (e.type === 'add') {
                // Создаём кнопку — иконка просмотра
                var btn = $('<div class="card__view icon-view"></div>');
                
                // При клике/наведении — действие
                btn.on('hover:enter', function () {
                    // Hello World! Замени на реальный код, например, Lampa.Player.play(...)
                    Lampa.Noty.show('Hello World from Liya! Кнопка работает 😊');
                    // Или для теста: alert('Hello World!');
                });

                // Вставляем кнопку в карточку
                e.object.find('.card__buttons').append(btn);
            }
        });

        // Логируем, что плагин загрузился (для дебага в консоли Lampa)
        console.log('Liya Hello Watch plugin loaded!');
    }
})();
