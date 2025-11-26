(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                console.log('Liya plugin: App ready, ultimate observer + scan starting');
                
                var addedButtons = new Set(); // Чтобы не дублировать
                
                function addButtonToCard(cardElement) {
                    if (addedButtons.has(cardElement)) return;
                    addedButtons.add(cardElement);
                    
                    // Проверяем, что это карточка (по элементам Lampa)
                    if (!cardElement.querySelector('.card__title, .view__title, [data-title]') && 
                        !cardElement.querySelector('.card__img, .view__img')) {
                        return;
                    }
                    
                    console.log('Liya: New card detected, adding button to:', cardElement.className);
                    
                    // Создаём кнопку как иконку play, с hover
                    var btn = $('<div style="position: absolute; bottom: 10px; right: 10px; background: #ff4081; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; z-index: 20; cursor: pointer; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">▶</div>');
                    
                    btn.on('hover:enter', function () {
                        Lampa.Noty.show('Привет от Лии! Твоя кнопка "Смотреть" готова к доработке 💕');
                    });
                    btn.on('hover:long', function () { // Долгий клик для дебага
                        console.log('Liya button long press on card:', cardElement);
                    });
                    
                    // Вставляем
                    var buttons = cardElement.querySelector('.card__buttons, .view__buttons');
                    if (buttons) {
                        buttons.appendChild(btn[0]);
                    } else {
                        cardElement.style.position = 'relative'; // Чтобы absolute работал
                        cardElement.appendChild(btn[0]);
                    }
                    
                    console.log('Liya: Button added to card');
                }
                
                // Функция сканирования всех текущих карточек
                function scanExistingCards() {
                    var cardSelectors = '.card, .card-horizontal, .card-vertical, .full-view__item, .selector-item, .view--cards .item';
                    var totalAdded = 0;
                    $(cardSelectors).each(function() {
                        addButtonToCard(this);
                        totalAdded++;
                    });
                    console.log('Liya: Initial scan complete, added buttons to ' + totalAdded + ' existing cards');
                }
                
                // Initial scan сразу
                setTimeout(scanExistingCards, 1000); // Небольшая задержка, чтобы DOM устаканился
                
                // Observer для новых
                var observer = new MutationObserver(function(mutations) {
                    var newCards = 0;
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) {
                                    // Проверяем сам node или его детей
                                    if ($(node).is('.card, .card-horizontal, .card-vertical, .full-view__item, .selector-item')) {
                                        addButtonToCard(node);
                                        newCards++;
                                    } else {
                                        $(node).find('.card, .card-horizontal, .card-vertical, .full-view__item, .selector-item').each(function() {
                                            addButtonToCard(this);
                                            newCards++;
                                        });
                                    }
                                }
                            });
                        }
                    });
                    if (newCards > 0) {
                        console.log('Liya: Observer caught ' + newCards + ' new cards');
                    }
                });
                
                // Запускаем observer на нескольких контейнерах
                var containers = $('.selector, .full-start, .cards-list, .view--cards, .full-view, body');
                if (containers.length) {
                    containers.each(function() {
                        observer.observe(this, { childList: true, subtree: true });
                        console.log('Liya: Observer on container:', this.className || 'unnamed');
                    });
                } else {
                    observer.observe(document.body, { childList: true, subtree: true });
                    console.log('Liya: Observer on body');
                }
                
                // Усиленный fallback: каждые 1.5 сек, на 1 минуту
                var checkInterval = setInterval(function() {
                    var cardSelectors = '.card:not([data-liya]), .card-horizontal:not([data-liya]), .card-vertical:not([data-liya]), .full-view__item:not([data-liya])';
                    var checked = 0;
                    $(cardSelectors).each(function() {
                        this.setAttribute('data-liya', 'true');
                        addButtonToCard(this);
                        checked++;
                    });
                    if (checked > 0) {
                        console.log('Liya: Interval tick - checked/added to ' + checked + ' cards');
                    }
                }, 1500);
                
                setTimeout(function() {
                    clearInterval(checkInterval);
                    console.log('Liya: Interval stopped');
                }, 60000);
                
                console.log('Liya ultimate plugin ready! Check logs for scans.');
            }
        });
    } else {
        console.error('Liya: Lampa or jQuery not found - plugin failed to load');
    }
})();
