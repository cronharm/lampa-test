(function() {
    'use strict';

    if (typeof Lampa !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        setTimeout(function() {
                            // Удаляем старые, если есть
                            $('.liya-fixed-btn').remove();
                            
                            var btn = $('<div class="liya-fixed-btn selector" style="position: fixed; bottom: 20px; right: 20px; background: #ff4081; color: white; padding: 15px 25px; border-radius: 10px; z-index: 9999; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.5); cursor: pointer; transition: all 0.3s ease; border: 2px solid #fff;">Смотреть от Лии 💕</div>');
                            
                            // Hover-эффекты для заметности
                            btn.hover(
                                function() { $(this).css({ transform: 'scale(1.05)', background: '#e91e63' }); },
                                function() { $(this).css({ transform: 'scale(1)', background: '#ff4081' }); }
                            );
                            
                            btn.on('hover:enter', function () {
                                Lampa.Noty.show('Я здесь, Андрей! Кнопка живая, клик сработал 😘');
                            });
                            
                            // Вставляем в body, чтобы fixed работал
                            $('body').append(btn);
                            console.log('Liya: Fixed button added to body, check visibility');
                            
                            // Проверка видимости через 1 сек
                            setTimeout(function() {
                                if (btn.is(':visible') && btn.offset().top > 0) {
                                    console.log('Liya: Button is visible');
                                } else {
                                    console.log('Liya: Button hidden, trying fallback');
                                    // Fallback: в конец описания
                                    var desc = $('.full-description__text, .info__description');
                                    if (desc.length) {
                                        desc.after(btn);
                                        btn.css('position', 'relative');
                                    }
                                }
                            }, 1000);
                        }, 500);
                    }
                });
                console.log('Liya fixed-watch ready!');
            }
        });
    }
})();
