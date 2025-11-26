(function() {
'use strict';

```
if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'start') {
                    $('.liya-btn').remove();

                    var btn = $('<div class="liya-btn" style="background:#ff4081;color:white;padding:8px 16px;border-radius:4px;margin:4px;text-align:center;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-width:120px;">Смотреть от Лии 💕</div>');

                    btn.on('click', function() {
                        Lampa.Noty.show('Проверяем фильм на сервере...');

                        // Пример запроса на сервер
                        $.ajax({
                            url: 'https://твoй-сервер.com/check_movie', // твой API endpoint
                            method: 'POST',
                            data: { movie_id: e.object.data.id }, // передаём ID фильма
                            dataType: 'json',
                            success: function(response) {
                                if(response.available) {
                                    Lampa.Player.play({
                                        title: response.title,
                                        url: response.url,
                                        poster: response.poster || '',
                                        subtitles: response.subtitles || []
                                    });
                                    console.log('Liya: Запуск фильма', response.title);
                                } else {
                                    Lampa.Noty.show('Фильм недоступен 😢');
                                }
                            },
                            error: function() {
                                Lampa.Noty.show('Ошибка при запросе к серверу 😵');
                            }
                        });
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
```

})();
