(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-desc-btn').remove(); // Чистим старое
                        
                        setTimeout(function() {
                            try {
                                // Правильно: оборачиваем e.object в jQuery
                                var descBlock = $(e.object).find('.full-description__text, .full__description, .info__description, .full-description, .view--full .description, .full-text');
                                if (descBlock.length) {
                                    var btn = $('<div class="liya-desc-btn selector" style="background: #ff4081; color: white; padding: 12px 20px; border-radius: 8px; margin: 15px 0; text-align: center; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">Смотреть от Лии 💕</div>');
                                    
                                    btn.on('hover:enter', function () {
                                        Lampa.Noty.show('Всё ок, Андрей! Кнопка живая, теперь твой ход с плеером 😘');
                                    });
                                    
                                    descBlock.after(btn);
                                    var visible = btn.is(':visible') && btn.outerHeight() > 0;
                                    console.log('Liya: Success, button added and visible:', visible);
                                } else {
                                    console.log('Liya: No desc block, fallback to global');
                                    // Fallback глобальный
                                    var globalDesc = $('.full-description__text, .full__description');
                                    if (globalDesc.length) {
                                        globalDesc.after(btn);
                                        console.log('Liya: Fallback worked');
                                    }
                                }
                            } catch (err) {
                                console.error('Liya: Error in full listener:', err.message);
                            }
                        }, 600);
                    }
                });
                console.log('Liya fixed-desc ready!');
            }
        });
    } else {
        console.error('Liya: Lampa or $ missing');
    }
})();
