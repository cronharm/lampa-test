(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-buttons-btn').remove(); // Чистим
                        
                        setTimeout(function() {
                            try {
                                // Основной: в твой блок
                                var buttonsBlock = $(e.object).find('.full-start-new__buttons') || $('.full-start-new__buttons');
                                if (buttonsBlock.length) {
                                    var btn = $('<div class="liya-buttons-btn selector" style="background: #ff4081; color: white; padding: 10px 15px; border-radius: 6px; margin: 5px; text-align: center; font-weight: bold; cursor: pointer; display: inline-block; vertical-align: middle;">Смотреть от Лии 💕</div>');
                                    
                                    btn.on('hover:enter', function () {
                                        Lampa.Noty.show('В панели кнопок! Теперь твой плеер сюда, Андрей 😘');
                                    });
                                    
                                    buttonsBlock.append(btn);
                                    var visible = btn.is(':visible') && btn.outerHeight() > 0;
                                    console.log('Liya: Button added to .full-start-new__buttons, visible:', visible);
                                    return;
                                }
                                
                                // Fallback
                                console.log('Liya: Buttons block not found, fallback to .full-start');
                                var fallback = $(e.object).find('.full-start') || $('.full-start');
                                if (fallback.length) {
                                    fallback.append(btn);
                                    console.log('Liya: Fallback to full-start');
                                }
                                
                            } catch (err) {
                                console.error('Liya: Error:', err.message);
                            }
                        }, 600);
                    }
                });
                console.log('Liya buttons-watch ready!');
            }
        });
    }
})();
