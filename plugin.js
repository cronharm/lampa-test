Lampa.Listener.follow('full', function(ev) {
    if (ev.type === 'render') {

        // удаляем старые, если дублировались
        $('.liya-btn').remove();

        let buttonsBlock = $(ev.object).find('.full-start-new__buttons');
        if (!buttonsBlock.length) return;

        // создаём ламповую кнопку
        let btn = createLiyaButton();

        // обработчик — как у тебя
        $(btn).on('hover:enter', function() {
            let movie = ev.data.movie;

            if (!movie || !movie.id) {
                Lampa.Noty.show('Не удалось определить фильм 😢');
                return;
            }

            Lampa.Noty.show('Проверяем фильм на сервере...');

            $.ajax({
                url: 'http://212.86.102.67/check.php',
                method: 'POST',
                data: { movie_id: movie.name },
                dataType: 'json',
                success: function(response) {
                    if (!response.available || !response.sources) {
                        Lampa.Noty.show('Источники не найдены 😢');
                        return;
                    }

                    let list = $('<div style="padding:10px;"></div>');

                    response.sources.forEach(src => {
                        let item = $(`<div class="selector" style="padding:10px;margin:6px;background:#222;border-radius:8px;">${src.name}</div>`);
                        item.on('hover:enter', () => {
                            Lampa.Player.play({
                                title: movie.title || 'Видео',
                                url: src.url,
                                poster: movie.poster || ''
                            });
                        });
                        list.append(item);
                    });

                    let modal = Lampa.Modal.open({
                        title: 'Источники от Лии 💕',
                        html: list,
                        size: 'medium',
                        onBack: () => Lampa.Modal.close()
                    });

                    Lampa.Selector.set(modal, list.find('.selector'));
                },
                error: () => {
                    Lampa.Noty.show('Ошибка при запросе 😵');
                }
            });
        });

        // ВСТАВЛЯЕМ ламповую кнопку
        buttonsBlock.append(btn);

        // навигация начнёт работать сразу (ламповый компонент)
        Lampa.Selector.update();

        console.log('Liya: ламповая кнопка добавлена');
    }
});
