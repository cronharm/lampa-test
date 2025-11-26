(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-btn').remove();
                        
                        setTimeout(function() {
                            try {
                                // Целимся в твой блок
                                var buttonsBlock = $(e.object).find('.full-start-new__buttons') || $('.full-start-new__buttons');
                                if (buttonsBlock.length) {
                                    var btn = $('<div class="liya-btn selector" style="background: #ff4081; color: white; padding: 8px 16px; border-radius: 4px; margin: 4px; text-align: center; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; min-width: 120px;">Смотреть от Лии 💕</div>');
                                    
                                    btn.on('hover:enter', function () {
                                        Lampa.Noty.show('В панели! Теперь твой код для просмотра, Андрей 😘');
                                    });
                                    
                                    buttonsBlock.append(btn);
                                    console.log('Liya: Added to .full-start-new__buttons');
                                    return;
                                }
                                
                                // Если не нашлось, лог классов в похожих блоках
                                var possibleBlocks = $(e.object).find('[class*="buttons"], .full-start *').filter(function() { return this.className.includes('buttons') || this.className.includes('action'); });
                                console.log('Liya: Buttons not found, possible classes:', possibleBlocks.map(function() { return this.className; }).get());
                                
                            } catch (err) {
                                console.error('Liya: Error:', err.message);
                            }
                        }, 700);
                    }
                });
                console.log('Liya target-buttons ready!');
            }
        });
    }
})();
