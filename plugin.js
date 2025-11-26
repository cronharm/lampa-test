(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                console.log('Liya plugin: App ready, super observer starting');
                
                var addedButtons = new Set(); // Чтобы не дублировать
                
                function addButtonToCard(cardElement) {
                    if (addedButtons.has(cardElement)) return;
                    addedButtons.add(cardElement);
                    
                    // Проверяем, что это карточка (по типичным классам/элементам Lampa)
                    if (!cardElement.classList.contains('card') && 
                        !cardElement.querySelector('.card__title') && 
                        !cardElement.querySelector('.card__img')) {
                        return;
                    }
                    
                    console.log('Liya: New card detected, adding button');
                    
                    var btn = $('<div style="position: absolute; bottom: 10px; right: 10px; background: #007bff; color: white; padding: 8px; border-radius: 5px; font-size: 12px; z-index: 20; cursor: pointer; border: 1px solid #0056b3;">Liya Watch 💕</div>');
                    
                    btn.on('hover:enter', function () {
                        Lampa.Noty.show('Привет от Лии! Кнопка на месте, теперь твоя очередь доработать 😘');
                    });
                    
                    // Вставляем в конец карточки или в buttons, если есть
                    var buttons = cardElement.querySelector('.card__buttons');
                    if (buttons) {
                        buttons.appendChild(btn[0]);
                    } else {
                        cardElement.appendChild(btn[0]);
                    }
                    
                    console.log('Liya: Button added to card');
                }
                
                // Основной observer
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) {
                                    if (node.classList && (node.classList.contains('card') || node.classList.contains('card-horizontal') || node.classList.contains('full-view__card'))) {
                                        addButtonToCard(node);
                                    } else {
                                        // Рекурсивно проверяем детей
                                        $(node).find('.card, .card-horizontal').each(function() {
                                            addButtonToCard(this);
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
                
                // Запускаем на возможных контейнерах
                var containers = $('.selector, .full-start, .cards-list, .view--cards, body');
                if (containers.length) {
                    containers.each(function() {
                        observer.observe(this, { childList: true, subtree: true });
                        console.log('Liya: Observer on container:', this.className);
                    });
                } else {
                    observer.observe(document.body, { childList: true, subtree: true });
                    console.log('Liya: Observer on body');
                }
                
                // Fallback: периодическая проверка (каждые 2 сек, на 30 сек)
                var checkInterval = setInterval(function() {
                    $('.card:not([data-liya])').each(function() {
                        this.setAttribute('data-liya', 'true');
                        addButtonToCard(this);
                    });
                    console.log('Liya: Observer tick - checked for cards');
                }, 2000);
                
                setTimeout(function() {
                    clearInterval(checkInterval);
                    console.log('Liya: Fallback check stopped');
                }, 30000);
                
                console.log('Liya super observer ready!');
            }
        });
    } else {
        console.error('Liya: Lampa or $ not found');
    }
})();
