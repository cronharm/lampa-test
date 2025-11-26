(function() {
'use strict';


if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'start') {
                    $('.liya-btn').remove();

                    //var btn = $('<div class="liya-btn" style="background:#ff4081;color:white;padding:8px 16px;border-radius:4px;margin:4px;text-align:center;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-width:120px;">Смотреть от Лии 💕</div>');
                    var btn = $(`<div class="full-start__button selector liya-btn">
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14" cy="14.5" r="13" stroke="currentColor" stroke-width="2.7"></circle>
                        <path d="M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z" fill="currentColor"></path>
                    </svg>

                    <span>Смотреть локально</span>
                </div>`);
                    btn.on('click', function() {
                        var movie = e.data.movie; // <-- вот оно!
                        console.log('Посмотрим!', e);
                        
                        if(!movie || !movie.id){
                            console.log('Нет данных фильма!', movie);
                            Lampa.Noty.show('Не удалось определить фильм 😢');
                            return;
                        }
                        
                        Lampa.Noty.show('Проверяем фильм на сервере...');

                        // Пример запроса на сервер
                        $.ajax({
                            url: 'http://212.86.102.67/check.php', // твой API endpoint
                            method: 'POST',
                            data: { movie_id: movie.name }, // передаём ID фильма
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


})();
