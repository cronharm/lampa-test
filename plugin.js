(function() {
    'use strict';

    if (typeof Lampa !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        // Ждём рендера страницы (0.5 сек)
                        setTimeout(function() {
                            // Создаём кнопку
                            var btn = $('<div class="full-button selector" style="background: #ff4081; color: white; padding: 10px; border-radius: 5px; margin: 5px;">Liya: Смотреть 💕</div>');
                            
                            btn.on('hover:enter', function () {
                                Lampa.Noty.show('Hello от Лии на деталях фильма! Теперь добавь свой плеер 😘');
                            });
                            
                            // Вставляем в панель кнопок (стандартный селектор для full view)
                            $('.view--full .view__actions, .full-buttons, .full-start__buttons').append(btn);
                            console.log('Liya: Button added to full view');
                        }, 500);
                    }
                });
                console.log('Liya full-watch ready!');
            }
        });
    }
})();
