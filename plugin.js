(function () {
    'use strict';

    function addButton(e) {
        let container = e.render;

        if (!container || !container.length) {
            return;
        }

        // Чтобы не добавлять два раза
        if (container.find('.button--ourserver').length) {
            return;
        }

        // Создаем кнопку в стиле Лампы
        let btn = $(`
            <div class="full-start__button selector button--ourserver">
                <svg><use xlink:href="#sprite-play"></use></svg>
                <span>Смотреть онлайн</span>
            </div>
        `);

        // Обработка нажатия
        btn.on('hover:enter', function () {
            const movie = e.movie;
        
            if (!movie) {
                Lampa.Noty.show('Не удалось определить фильм 😢');
                return;
            }
        
            //Lampa.Noty.show('Проверяем фильм на сервере...');

            window.LiyaRezka.getVideo(969, 1, function (result) {
                if (result.error) {
                    Lampa.Noty.show(result.error);
                    return;
                }
            
                // result.sources — массив { name, url }
                // Открывай Modal или Activity, как раньше
                // Превращаем источники в формат selectbox
                    let items = response.sources.map(src => ({
                        title: src.name,
                        url: src.url
                    }));
        
                    // Открываем ламповый selectbox
                    Lampa.Select.show({
                        title: 'Источники',
                        items: items,
                        onSelect: function (item) {
                            Lampa.Player.play({
                                title: movie.title,
                                url: item.url,
                                poster: movie.poster || '',
                                subtitles: movie.subtitles || []
                            });
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('content');
                        }
                    });
            });
        
            /*$.ajax({
                url: 'http://212.86.102.67/check.php',
                method: 'POST',
                data: { movie_id: movie.id || movie.name },
                dataType: 'json',
        
                success: function (response) {
                    if (!response.available || !response.sources?.length) {
                        Lampa.Noty.show('Источники не найдены 😢');
                        return;
                    }
        
                    // Превращаем источники в формат selectbox
                    let items = response.sources.map(src => ({
                        title: src.name,
                        url: src.url
                    }));
        
                    // Открываем ламповый selectbox
                    Lampa.Select.show({
                        title: 'Источники',
                        items: items,
                        onSelect: function (item) {
                            Lampa.Player.play({
                                title: movie.title,
                                url: item.url,
                                poster: movie.poster || '',
                                subtitles: movie.subtitles || []
                            });
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('content');
                        }
                    });
                },
        
                error: function () {
                    Lampa.Noty.show('Ошибка при запросе 😵');
                }
            });*/
        });

        // Вставляем ВНУТРЬ блока
        container.append(btn);

    }

    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') {
            let parent = e.object.activity.render();
            let block = parent.find('.full-start-new__buttons');
            addButton({
                render: block,
                movie: e.data.movie
            });
        }
    });

})();

// rezka_direct.js — плагин Lampa
(function () {
    'use strict';

    window.LiyaRezka = {
        getVideo: function (filmId, translatorId, callback) {
            var url = 'https://rezka.ag/ajax/get_cdn_series/';
            var postData = 'id=' + encodeURIComponent(filmId) +
                          '&translator_id=' + encodeURIComponent(translatorId) +
                          '&is_camrip=0&is_ads=0&is_director=0&favs=0';

            Lampa.Network.send({
                url: url,
                method: 'POST',
                headers: {
                    'Referer': 'https://rezka.ag/',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: postData
            }, function (result) {
                try {
                    var data = JSON.parse(result);

                    if (data.success === false) {
                        callback({ error: 'Rezka: ' + (data.message || 'ошибка') });
                        return;
                    }

                    var sources = [];
                    if (data.url) {
                        if (typeof data.url === 'string') {
                            sources.push({ name: 'Видео', url: data.url });
                        } else if (typeof data.url === 'object') {
                            for (var quality in data.url) {
                                sources.push({ name: quality + 'p', url: data.url[quality] });
                            }
                        }
                    } else if (data.episodes) {
                        // Сериал — берём первый эпизод
                        var s1 = Object.keys(data.episodes)[0];
                        var e1 = Object.keys(data.episodes[s1])[0];
                        sources.push({
                            name: 'Сезон ' + s1 + ', эпизод ' + e1,
                            url: data.episodes[s1][e1]
                        });
                    }

                    callback({ sources: sources });
                } catch (e) {
                    callback({ error: 'Ошибка парсинга: ' + e.message, raw: result });
                }
            }, function () {
                callback({ error: 'Ошибка сети' });
            });
        }
    };
})();
