(function () {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-btn').remove();

                        var btn = $(`<div class="full-start__button selector liya-btn">
                            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="14" cy="14.5" r="13" stroke="currentColor" stroke-width="2.7"></circle>
                                <path d="M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z" fill="currentColor"></path>
                            </svg>
                            <span>Смотреть локально</span>
                        </div>`);

                        btn.on('hover:enter', function () {
                            var movie = e.data.movie;
                            if (!movie || !movie.id) {
                                Lampa.Noty.show('Не удалось определить фильм 😢');
                                return;
                            }

                            Lampa.Noty.show('Проверяем фильм на сервере...');

                            $.ajax({
                                url: 'http://212.86.102.67/check.php',
                                method: 'POST',
                                data: { movie_id: movie.name }, // ← исправлено: добавлено 'data'
                                dataType: 'json',
                                success: function (response) {
                                    if (!response.available || !response.sources || !response.sources.length) {
                                        Lampa.Noty.show('Источники не найдены 😢');
                                        return;
                                    }

                                    let list = $('<div class="liya-sources" style="padding:10px;"></div>');

                                    response.sources.forEach(function (src) {
                                        let item = $(`
                                            <div class="selector liya-source-item" 
                                                 style="padding:10px;margin:6px;background:#222;border-radius:8px;">
                                                ${Lampa.Utils.escape(src.name || 'Без названия')}
                                            </div>
                                        `);

                                        item.on('hover:enter', function () {
                                            Lampa.Player.play({
                                                title: movie.title || 'Видео',
                                                url: src.url,
                                                poster: movie.poster || '',
                                                subtitles: [] // ← временно отключено для стабильности
                                            });
                                        });

                                        list.append(item);
                                    });

                                    let modal = Lampa.Modal.open({
                                        title: 'Источники от Лии 💕',
                                        html: list,
                                        size: 'medium',
                                        focus: true
                                    });

                                    let selectorItems = list.find('.selector');
                                    if (selectorItems.length > 0) {
                                        Lampa.Selector.set(modal, selectorItems);
                                    }
                                },
                                error: function () {
                                    Lampa.Noty.show('Ошибка при запросе к серверу 😵');
                                }
                            });
                        });

                        var interval = setInterval(function () {
                            var buttonsBlock = $(e.object).find('.full-start-new__buttons');
                            if (!buttonsBlock.length) {
                                buttonsBlock = $('.full-start-new__buttons');
                            }
                            if (buttonsBlock.length) {
                                clearInterval(interval);
                                buttonsBlock.append(btn);
                            }
                        }, 200);
                    }
                });
            }
        });
    }
})();
