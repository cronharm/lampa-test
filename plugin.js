(function() {
    'use strict';

    if (typeof Lampa !== 'undefined' && typeof $ !== 'undefined') {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') {
                        $('.liya-btn').remove();
                        
                        var attempts = 0;
                        var maxAttempts = 30; // 6 секунд
                        var checkInterval = setInterval(function() {
                            attempts++;
                            console.log('Liya: Attempt ' + attempts + ': searching for buttons block');
                            
                            var buttonsBlock = $(e.object).find('.full-start-new__buttons') || $('.full-start-new__buttons');
                            if (buttonsBlock.length) {
                                clearInterval(checkInterval);
                                var btn = $(`<div class="full-start__button selector liya-btn" style="border: 2px solid #ff4081;">  <!-- Граница для дебага -->
                                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="14" cy="14.5" r="13" stroke="currentColor" stroke-width="2.7"></circle>
                                        <path d="M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z" fill="currentColor"></path>
                                    </svg>
                                    <span>Смотреть локально</span>
                                </div>`);
                                
                                btn.on('hover:enter', function() {
                                    var movie = e.data.movie;
                                    console.log('Liya: Пультом нажали! Movie:', movie);
                                    
                                    if (!movie || !movie.id) {
                                        console.log('Liya: Нет данных фильма', movie);
                                        Lampa.Noty.show('Не удалось определить фильм 😢');
                                        return;
                                    }
                                    
                                    Lampa.Noty.show('Проверяем фильм на сервере...');
                                    $.ajax({
                                        url: 'http://212.86.102.67/check.php',
                                        method: 'POST',
                                        data: { movie_id: movie.id },
                                        dataType: 'json',
                                        success: function(response) {
                                            console.log('Liya: Response from server:', response);
                                            if (!response.available || !response.sources || !Array.isArray(response.sources) || response.sources.length === 0) {
                                                Lampa.Noty.show('Источники не найдены 😢');
                                                return;
                                            }
                                            
                                            var items = response.sources.map(function(src, index) {
                                                return {
                                                    title: src.name || 'Источник ' + (index + 1),
                                                    subtitle: src.url ? src.url.substring(0, 50) + '...' : '',
                                                    id: src.url
                                                };
                                            });
                                            
                                            Lampa.Select.show({
                                                title: 'Источники от Лии 💕',
                                                items: items,
                                                onSelect: function(a) {
                                                    Lampa.Modal.close();
                                                    Lampa.Player.play({
                                                        title: movie.title || movie.name || 'Видео',
                                                        url: a.id,
                                                        poster: movie.poster || '',
                                                        subtitles: movie.subtitles || []
                                                    });
                                                    console.log('Liya: Play started for:', a.id);
                                                },
                                                onBack: function() {
                                                    Lampa.Modal.close();
                                                }
                                            });
                                        },
                                        error: function(xhr, status, err) {
                                            console.error('Liya: Ajax error:', err);
                                            Lampa.Noty.show('Ошибка при запросе к серверу 😵');
                                        }
                                    });
                                });
                                
                                buttonsBlock.append(btn);
                                console.log('Liya: Added to buttons block after ' + attempts + ' attempts');
                                return;
                            }
                            
                            if (attempts >= maxAttempts) {
                                clearInterval(checkInterval);
                                console.log('Liya: Still no block after ' + maxAttempts + ' attempts, fallback to .full-start');
                                // Fallback
                                var fallbackBlock = $(e.object).find('.full-start') || $('.full-start');
                                if (fallbackBlock.length) {
                                    fallbackBlock.append(btn);
                                    console.log('Liya: Fallback added to full-start');
                                } else {
                                    console.log('Liya: No fallback block either');
                                }
                            }
                        }, 200);
                    }
                });
                console.log('Liya fixed-interval ready!');
            }
        });
    }
})();
