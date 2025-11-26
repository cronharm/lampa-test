(function() {
    'use strict';

    if (typeof Lampa !== 'undefined') {
        // Добавляем шаблон для full-view
        Lampa.Template.add('full', {
            // Это секция под описанием или в buttons
            liya_watch: {
                html: function() {
                    return '<div class="full-block liya-section"><div class="full-block__title">Liya: Смотреть 💕</div><div class="full-block__content"><div class="selector" data-action="liya-play">Запустить просмотр от Лии</div></div></div>';
                },
                bind: function(select) {
                    // Обработчик клика
                    select.find('[data-action="liya-play"]').on('hover:enter', function() {
                        Lampa.Noty.show('Привет из шаблона! Теперь впихни свой плеер-код сюда 😘');
                        // Здесь твой код: Lampa.Player.play({url: '...', ...}) или что нужно
                    });
                }
            }
        });

        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        // Вставляем нашу секцию после описания
                        setTimeout(function() {
                            var desc = e.object.find('.full-description, .info__description');
                            if (desc.length) {
                                desc.after(Lampa.Template.get('full', 'liya_watch', {}));
                                console.log('Liya: Template added after description');
                            } else {
                                // Fallback в конец full
                                e.object.find('.full-start').append(Lampa.Template.get('full', 'liya_watch', {}));
                                console.log('Liya: Template added to full-start');
                            }
                        }, 1000);
                    }
                });
                console.log('Liya template-watch ready!');
            }
        });
    }
})();
