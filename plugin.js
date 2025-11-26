(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-desc-btn').remove();
                        
                        setTimeout(function() {
                            try {
                                // Широкий поиск в e.object
                                var descBlock = $(e.object).find('.full-description__text, .full__description, .info__description, .full-description, .view--full .description, .full-text, .full-info__text, .full__content-description, .description-block');
                                if (descBlock.length) {
                                    console.log('Liya: Found desc in object with class:', descBlock[0].className);
                                    // ... (остальное как раньше: btn, after, visible log)
                                    var btn = $('<div class="liya-desc-btn selector" style="background: #ff4081; color: white; padding: 12px 20px; border-radius: 8px; margin: 15px 0; text-align: center; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">Смотреть от Лии 💕</div>');
                                    
                                    btn.on('hover:enter', function () {
                                        Lampa.Noty.show('Нашлась! Теперь доработай под себя 😘');
                                    });
                                    
                                    descBlock.after(btn);
                                    var visible = btn.is(':visible') && btn.outerHeight() > 0;
                                    console.log('Liya: Success in object, visible:', visible);
                                    return;
                                }
                                
                                // Глобальный широкий поиск
                                var globalDesc = $('.full-description__text, .full__description, .info__description, .full-description, .view--full .description, .full-text, .full-info__text, .full__content-description, .description-block, .full__text, .info-text');
                                if (globalDesc.length) {
                                    console.log('Liya: Found global desc with class:', globalDesc[0].className);
                                    globalDesc.after(btn); // btn определена выше? Нет, перемести выше, если нужно
                                    var visible = btn.is(':visible') && btn.outerHeight() > 0;
                                    console.log('Liya: Global fallback worked, visible:', visible);
                                    return;
                                }
                                
                                // Ultimate: в конец full-view
                                console.log('Liya: No desc found, ultimate fallback to .view--full');
                                var fullView = $('.view--full, .full-view, .full-start');
                                if (fullView.length) {
                                    fullView.append(btn);
                                    console.log('Liya: Ultimate added to:', fullView[0].className);
                                } else {
                                    $('body').append(btn);
                                    console.log('Liya: Desperate append to body');
                                }
                                
                            } catch (err) {
                                console.error('Liya: Error:', err.message);
                            }
                        }, 800); // Чуть дольше для полной загрузки
                    }
                });
                console.log('Liya broad-desc ready!');
            }
        });
    }
})();
