(function() {
    'use strict';

    if (typeof Lampa !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                console.log('Liya plugin: App ready, starting card listener');
                
                Lampa.Listener.follow('card', function (e) {
                    console.log('Card listener fired for type:', e.type, 'object classes:', e.object[0] ? e.object[0].className : 'no object');
                    
                    if (e.type === 'add') {
                        console.log('Adding button to card:', e.object.html().substring(0, 100) + '...'); // Первые 100 символов HTML для дебага
                        
                        var btn = $('<div class="card__view icon-view" style="position: absolute; bottom: 5px; right: 5px; z-index: 10;">Custom Watch</div>'); // Добавила стиль для видимости
                        
                        btn.on('hover:enter', function () {
                            Lampa.Noty.show('Hello from Liya! Кнопка живая 💕');
                        });

                        // Пробуем разные селекторы для вставки
                        var buttons = e.object.find('.card__buttons');
                        if (buttons.length) {
                            buttons.append(btn);
                            console.log('Button appended to .card__buttons');
                        } else {
                            // Альтернатива: в конец карточки
                            e.object.append(btn);
                            console.log('Button appended to card end');
                        }
                    }
                });

                console.log('Liya plugin: Card listener set up!');
            }
        });
    }
})();
