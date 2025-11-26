(() => {
    const plugin_id = 'our-server-watch';

    function ready(fn){
        if(!window.Lampa) setTimeout(() => ready(fn), 200);
        else fn();
    }

    ready(() => {
        Lampa.Plugin.create(plugin_id, {
            onStart() {
                console.log('[PLUGIN] our-server-watch started');
            }
        });

        // Добавляем кнопку через событие card.build — самый стабильный способ
        Lampa.Listener.follow('full', (event) => {
            if(event.type !== 'build') return;

            const card = event.data;

            // Ждём когда кнопки появятся
            setTimeout(() => {
                let $buttons = $('.full-start__buttons');

                if(!$buttons.length) return;

                let btn = $(`<div class="full-start__button selector">Смотреть (наш сервер)</div>`);
                $buttons.append(btn);

                btn.on('hover:enter', () => {
                    playFromServer(card);
                });
            }, 200);
        });

        async function playFromServer(card){
            Lampa.Loading.start();

            try {
                let title = card.movie.title;
                let year  = card.movie.year;

                let url = `https://ТВОЙ_ДОМЕН/check?title=${encodeURIComponent(title)}&year=${year}`;
                let resp = await fetch(url);
                let data = await resp.json();

                if(data && data.exists && data.url){
                    Lampa.Player.play({
                        title: title,
                        url: data.url,
                        quality: 'Auto'
                    });
                } else {
                    Lampa.Noty.show('Файл на сервере не найден');
                }

            } catch(err){
                console.log('[PLUGIN ERROR]', err);
                Lampa.Noty.show('Ошибка подключения к серверу');
            }

            Lampa.Loading.stop();
        }
    });
})();
