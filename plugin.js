(function() {
    'use strict';

    if (typeof Lampa !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        setTimeout(function() {
                            // Ищем блок с описанием
                            var descBlock = $('.full-description__text, .info__description, .full__description, .view--full .text');
                            if (descBlock.length) {
                                var btn = $('<div class="selector" style="background: #ff4081; color: white; padding: 12px 20px; border-radius: 8px; margin: 10px 0; text-align: center; cursor: pointer; font-weight: bold;">Смотреть от Лии 💕</div>');
                                
                                btn.on('hover:enter', function () {
                                    Lampa.Noty.show('Привет с описания! Готова к твоему коду для плеера 😘');
                                });
                                
                                // Вставляем после описания
                                descBlock.after(btn);
                                console.log('Liya: Button added after description');
                            } else {
                                console.log('Liya: Description block not found, trying fallback');
                                // Fallback: в конец .full-start
                                $('.full-start').append(btn);
                            }
                        }, 800); // Чуть подольше, чтобы описание прогрузилось
                    }
                });
                console.log('Liya desc-watch ready!');
            }
        });
    }
})();
