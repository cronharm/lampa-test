(function () {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {

        var LiyaSourcesComponent = {
            render: function () {
                var div = $('<div class="liya-sources-screen"></div>');
                var scroll = Lampa.Scroll.render('liya_sources_scroll');

                var activity = Lampa.Activity.active();
                var movie = activity.params.movie || {};
                var sources = activity.params.sources || [];

                if (sources.length === 0) {
                    scroll.append(Lampa.Empty.render('Источники не найдены'));
                } else {
                    sources.forEach(function (src) {
                        if (!src || !src.url) return;

                        var item = $(`
                            <div class="selector" style="padding:12px;margin:6px;background:#222;border-radius:8px;font-size:16px;">
                                ${Lampa.Utils.escape(src.name || 'Источник')}
                            </div>
                        `);

                        item.on('hover:enter', function () {
                            Lampa.Player.play({
                                title: movie.title || 'Видео',
                                url: src.url,
                                poster: movie.poster || '',
                                subtitles: []
                            });
                        });

                        scroll.append(item);
                    });
                }

                div.append(scroll.render());

                return {
                    append: function (parent) {
                        parent.append(div);
                    }
                };
            }
        };

        Lampa.Component.add('liya_sources_screen', LiyaSourcesComponent);

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
                                data: { movie_id: movie.name }, // ← ИСПРАВЛЕНО: добавлено 'data'
                                dataType: 'json',
                                timeout: 10000,
                                success: function (response) {
                                    if (!response || !response.sources || !Array.isArray(response.sources) || response.sources.length === 0) {
                                        Lampa.Noty.show('Источники не найдены 😢');
                                        return;
                                    }

                                    Lampa.Activity.push({
                                        url: '',
                                        title: 'Источники от Лии 💕',
                                        component: 'liya_sources_screen',
                                        movie: movie,
                                        sources: response.sources
                                    });
                                },
                                error: function (xhr, status) {
                                    let msg = 'Ошибка сервера 😵';
                                    if (status === 'timeout') msg = 'Сервер не отвечает ⏳';
                                    if (status === 'parsererror') msg = 'Ответ не в формате JSON';
                                    Lampa.Noty.show(msg);
                                }
                            });
                        });

                        var interval = setInterval(function () {
                            var block = $(e.object).find('.full-start-new__buttons');
                            if (!block.length) block = $('.full-start-new__buttons');
                            if (block.length) {
                                clearInterval(interval);
                                block.append(btn);
                            }
                        }, 200);
                    }
                });
            }
        });
    }
})();
