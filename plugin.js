(function () {
    'use strict';

    function addButton(e) {
        let container = e.render;

        if (!container || !container.length) {
            console.log('[PLUGIN] контейнер кнопок не найден');
            return;
        }

        // Чтобы не добавлять два раза
        if (container.find('.button--ourserver').length) {
            console.log('[PLUGIN] кнопка уже есть');
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
        
            Lampa.Noty.show('Проверяем фильм на сервере...');
        
            $.ajax({
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
                        title: 'Источники от Лии 💕',
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
            });
        });

        // Вставляем ВНУТРЬ блока
        container.append(btn);

        console.log('[PLUGIN] кнопка вставлена внутрь full-start-new__buttons');
    }

    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') {
            let parent = e.object.activity.render();
            let block = parent.find('.full-start-new__buttons');

            console.log('[PLUGIN] найден блок кнопок:', block.length);

            addButton({
                render: block,
                movie: e.data.movie
            });
        }
    });

})();
