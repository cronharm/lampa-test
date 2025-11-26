(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function(e) {
                    if (e.type === 'start') {
                        $('.liya-btn').remove();

                        var btn = $('<div class="liya-btn" style="background:#ff4081;color:white;padding:8px 16px;border-radius:4px;margin:4px;text-align:center;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-width:120px;">Смотреть от Лии 💕</div>');

                        btn.on('click', function() {
                            Lampa.Noty.show('Проверяем фильм на сервере...');

                            const filmId = 'example_movie_id';
                            const serverUrl = `https://yourserver.com/check_film?id=${filmId}`;

                            fetch(serverUrl)
                                .then(res => res.json())
                                .then(data => {
                                    if (data.available && data.url) {
                                        Lampa.Player.play(data.url);
                                        console.log('Фильм найден, воспроизведение запущено');
                                    } else {
                                        Lampa.Noty.show('Фильм не найден на сервере 😢');
                                        console.warn('Фильм отсутствует на сервере');
                                    }
                                })
                                .catch(err => {
                                    Lampa.Noty.show('Ошибка при запросе к серверу');
                                    console.error('Ошибка запроса:', err);
                                });
                        });

                        var interval = setInterval(function() {
                            var buttonsBlock = $(e.object).find('.full-start-new__buttons');
                            if (!buttonsBlock.length) {
                                buttonsBlock = $('.full-start-new__buttons');
                            }
                            if (buttonsBlock.length) {
                                clearInterval(interval);
                                buttonsBlock.append(btn);
                                console.log('Liya: Кнопка добавлена в .full-start-new__buttons');
                            }
                        }, 200);
                    }
                });
                console.log('Liya target-buttons ready!');
            }
        });
    }
})();
