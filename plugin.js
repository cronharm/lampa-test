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
            console.log('[PLUGIN] кнопка нажата');

            Lampa.Component.add('lampavod', component);
            Lampa.Activity.push({
                url: '',
                title: 'Смотреть онлайн',
                component: 'lampavod',
                movie: e.movie,
                page: 1
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
