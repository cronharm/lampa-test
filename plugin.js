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
            const movie = e.movie; // ← ВОТ ПРАВИЛЬНО! Берём из addButton()
        
            if (!movie) {
                Lampa.Noty.show('Не удалось определить фильм 😢');
                return;
            }
        
            Lampa.Noty.show('Проверяем фильм на сервере...');
        
            $.ajax({
                url: 'http://212.86.102.67/check.php',
                method: 'POST',
                data: { movie_id: movie.id || movie.name || movie.imdb_id },
                dataType: 'json',
        
                success: function (response) {
                    if (!response.available || !response.sources?.length) {
                        Lampa.Noty.show('Источники не найдены 😢');
                        return;
                    }
        
                    // Создаём список
                    let list = $('<div class="liya-sources" style="padding: 10px;"></div>');
        
                    response.sources.forEach(src => {
                        let item = $(`
                            <div class="selector liya-source-item"
                                style="padding:10px;margin:6px;background:#222;border-radius:8px;">
                                ${src.name}
                            </div>
                        `);
        
                        item.on('hover:enter', () => {
                            Lampa.Player.play({
                                title: movie.title,
                                url: src.url,
                                poster: movie.poster || movie.cover || '',
                                subtitles: movie.subtitles || []
                            });
                        });
        
                        list.append(item);
                    });
        
        
                    // === Создаём модалку ===
                    let modal = Lampa.Modal.open({
                        title: 'Источники от Лии 💕',
                        html: list,
                        size: 'medium',
        
                        onBack: function () {
                            Lampa.Modal.close();
                            Lampa.Controller.toggle('content');   // ← Возвращаем управление фильму
                        }
                    });
        
                    // Активируем навигацию внутри модалки
                    Lampa.Controller.add('liya_sources', {
                        toggle: function () {
                            Lampa.Controller.collectionSet(list.find('.selector'));
                        },
                        back: function () {
                            modal.onBack();
                        }
                    });
        
                    // И сразу переключаемся
                    Lampa.Controller.toggle('liya_sources');
                },
        
                error: function () {
                    Lampa.Noty.show('Ошибка запроса 😵');
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
