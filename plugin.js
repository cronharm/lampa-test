(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        // Удаляем старые кнопки
                        $('.liya-desc-btn').remove();
                        
                        setTimeout(function() {
                            // Ищем описание (расширенные селекторы)
                            var descBlock = e.object.find('.full-description__text, .full__description, .info__description, .full-description, .view--full .description, .full-text');
                            if (descBlock.length) {
                                var btn = $('<div class="liya-desc-btn selector" style="background: #ff4081; color: white; padding: 12px 20px; border-radius: 8px; margin: 15px 0; text-align: center; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">Смотреть от Лии 💕</div>');
                                
                                btn.on('hover:enter', function () {
                                    Lampa.Noty.show('Привет под описанием! Всё работает, добавляй свой код 😘');
                                });
                                
                                descBlock.after(btn);
                                // Проверяем видимость
                                var visible = btn.is(':visible') && btn.outerHeight() > 0;
                                console.log('Liya: Button added after description, visible:', visible);
                            } else {
                                console.log('Liya: No description block found');
                            }
                        }, 600);
                    }
                });
                console.log('Liya simple-desc ready!');
            }
        });
    }
})();
