(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                console.log('Liya plugin: Using MutationObserver for cards');
                
                // Наблюдаем за контейнером карточек (обычно .cards или .selector)
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1 && (node.classList.contains('card') || $(node).hasClass('card'))) {
                                    console.log('New card detected:', node);
                                    
                                    var btn = $('<div class="card__view icon-view" style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.5); color: white; padding: 5px; border-radius: 3px;">Liya Watch</div>');
                                    
                                    btn.on('hover:enter', function () {
                                        Lampa.Noty.show('Hello from Liya via Observer! 😘');
                                    });
                                    
                                    // Вставляем в карточку
                                    $(node).append(btn);
                                }
                            });
                        }
                    });
                });
                
                // Запускаем наблюдение за основным контейнером (адаптируй, если нужно)
                var cardsContainer = $('.selector, .full-start, body'); // .selector — это основной view в Lampa
                if (cardsContainer.length) {
                    observer.observe(cardsContainer[0], { childList: true, subtree: true });
                    console.log('Observer started on:', cardsContainer[0].className);
                } else {
                    observer.observe(document.body, { childList: true, subtree: true });
                    console.log('Observer started on body');
                }
            }
        });
    }
})();
