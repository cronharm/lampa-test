(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-btn').remove();

                        var btn = $('<div class="liya-btn" style="background:#ff4081;color:white;padding:8px 16px;border-radius:4px;margin:4px;text-align:center;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-width:120px;">Смотреть от Лии 💕</div>');

                        btn.on('click', function() {
                            Lampa.Noty.show('В панели! Теперь твой код для просмотра, Андрей 😘');
                        });

                        var interval = setInterval(function() {
                            var buttonsBlock = $(e.object).find('.full-start-new__buttons');
                            if(!buttonsBlock.length) {
                                buttonsBlock = $('.full-start-new__buttons');
                            }
                            if(buttonsBlock.length) {
                                clearInterval(interval);
                                buttonsBlock.append(btn);
                                console.log('Liya: Added to .full-start-new__buttons');
                            }
                        }, 200);
                    }
                });
                console.log('Liya target-buttons ready!');
            }
        });
    }
})();
