Lampa.Plugin.add('my-button-plugin', {
title: 'Моя кнопка',
description: 'Пример плагина, добавляющего кнопку',
icon: 'fa-play', // иконка кнопки

```
init: function () {
    console.log('Плагин загружен');

    // Ждём инициализации плеера
    Lampa.Player.once('init', () => {
        console.log('Плеер инициализирован, добавляем кнопку');

        Lampa.Player.addButton({
            title: 'Нажми меня',
            icon: 'fa-hand-pointer',
            click: () => {
                Lampa.Noty.show('Кнопка сработала!');
                console.log('Кнопка нажата');
            }
        });
    });
}
```

});
