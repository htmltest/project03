var speedSlider     = 1000; // скорость смены слайда
var periodSlider    = 3000; // период автоматической смены слайда (0 - автоматическая смена отключена)

var speedResponses  = 500;  // скорость прокрутки отзывов

var speedWho        = 500;  // скорость работы блока "Для кого..."

var speedFAQ        = 500;  // скорость разворачивания блоков FAQ

var timerSlider = null;

var availableCities = [
    'Москва',
    'Санкт-Петербург',
    'Волгоград',
    'Воронеж',
    'Иваново',
    'Калининград',
    'Калуга',
    'Нижний Новгород',
    'Хабаровск'
];

var speedScroll     = 500;  // скорость прокрутки к полям с ошибками

(function($) {

    $(document).ready(function() {

        if (getBrowser()[0] == 'Opera' || getBrowser()[0] == 'Safari' || getBrowser()[0] == 'Chrome') {
            $('head').append('<link rel="stylesheet" href="css/style-add.css" type="text/css" />');
        }

        // слайдер
        $('.slider-content').each(function() {
            var curSlider = $(this);
            if (curSlider.find('li').length > 1) {
                curSlider.data('curIndex', 0);
                curSlider.data('disableAnimate', false);

                var ctrlHTML = '';
                curSlider.find('li').each(function() {
                    ctrlHTML += '<a href="#"></a>';
                });
                $('.slider-ctrl').html(ctrlHTML);
                $('.slider-ctrl a:first').addClass('active');
                $('.slider-ctrl a').click(function() {
                    var curSlider = $('.slider-content');
                    if (!curSlider.data('disableAnimate')) {
                        window.clearTimeout(timerSlider);
                        timerSlider = null;

                        curSlider.data('disableAnimate', true);

                        var curIndex = curSlider.data('curIndex');
                        var newIndex = $('.slider-ctrl a').index($(this));

                        $('.slider-ctrl a.active').removeClass('active');
                        $('.slider-ctrl a').eq(newIndex).addClass('active');

                        curSlider.find('li').eq(curIndex).fadeOut(speedSlider / 2, function() {
                            curSlider.find('li').eq(newIndex).fadeIn(speedSlider / 2, function() {
                                curSlider.data('curIndex', newIndex);
                                curSlider.data('disableAnimate', false);
                                if (periodSlider > 0) {
                                    timerSlider = window.setTimeout(sliderNext, periodSlider);
                                }
                            });
                        });
                    }
                    return false;
                });

                if (periodSlider > 0) {
                    timerSlider = window.setTimeout(sliderNext, periodSlider);
                }
            }
        });

        // видео на главной странице
        $('.main-video-preview a').click(function() {
            $('.main-video-preview').html('<iframe width="534" height="300" src="' + $(this).attr('href') + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
            return false;
        });

        // корректировка фотографий для поддержки старых браузеров
        $('.responses-item-author-photo').each(function() {
            $(this).css({'background': 'url(' + $(this).find('img').attr('src') + ')'});
            $(this).find('img').hide();
        });

        // отзывы
        $('.responses-content').each(function() {
            var curSlider = $(this);
            curSlider.find('.responses-list').width(curSlider.find('.responses-item').length * curSlider.find('.responses-item:first').width());
            curSlider.data('curIndex', 0);
            if (curSlider.find('.responses-item').length < 2) {
                $('.responses-prev, .responses-next').hide();
            }
        });

        $('.responses-next').click(function() {
            var curSlider = $('.responses-content');
            var curIndex = curSlider.data('curIndex');
            curIndex++;

            if (curIndex >= curSlider.find('.responses-item').length - 1) {
                curIndex = curSlider.find('.responses-item').length - 1;
            }
            curSlider.data('curIndex', curIndex);
            curSlider.find('.responses-list').animate({'left': -curIndex * curSlider.find('.responses-item:first').width()}, speedResponses);

            return false;
        });

        $('.responses-prev').click(function() {
            var curSlider = $('.responses-content');
            var curIndex = curSlider.data('curIndex');
            curIndex--;

            if (curIndex < 0) {
                curIndex = 0;
            }
            curSlider.data('curIndex', curIndex);
            curSlider.find('.responses-list').animate({'left': -curIndex * curSlider.find('.responses-item:first').width()}, speedResponses);

            return false;
        });

        // "Для кого..."
        $('.who').each(function() {
            $(this).data('curActiveAnimate', true);
            $(this).data('newActiveAnimate', true);
        });

        $('.who-item-title').click(function() {
            var newActive = $(this).parent();
            if (!newActive.hasClass('who-item-open')) {
                if ($('.who').data('curActiveAnimate') && $('.who').data('newActiveAnimate')) {
                    $('.who-item-content').stop(true, true);
                    $('.who').data('curActiveAnimate', false);
                    $('.who').data('newActiveAnimate', false);
                    if ($('.who-item-open').length > 0) {
                        var curActive = $('.who-item-open');
                        curActive.find('.who-item-content').slideUp(speedWho / 2, function() {
                            curActive.removeClass('who-item-open');
                            $('.who').data('curActiveAnimate', true);
                            newActive.addClass('who-item-open');
                            newActive.find('.who-item-content').slideDown(speedWho / 2, function() {
                                $('.who').data('newActiveAnimate', true);
                            });
                        });
                    } else {
                        newActive.addClass('who-item-open');
                        newActive.find('.who-item-content').slideDown(speedWho / 2, function() {
                            $('.who').data('newActiveAnimate', true);
                            $('.who').data('curActiveAnimate', true);
                        });
                    }
                }
            } else {
                if ($('.who').data('curActiveAnimate') && $('.who').data('newActiveAnimate')) {
                    $('.who-item-content').stop(true, true);
                    $('.who').data('curActiveAnimate', false);
                    $('.who').data('newActiveAnimate', false);
                    newActive.removeClass('who-item-open');
                    newActive.find('.who-item-content').slideUp(speedWho / 2, function() {
                        $('.who').data('curActiveAnimate', true);
                        $('.who').data('newActiveAnimate', true);
                    });
                }
            }
        });

        // форма "Задайте вопрос"
        $('.header-callback a').click(function() {
            $('.overlay').show();
            $('#window-question').show();
            $('#window-question').css({'margin-top':-$('#window-question').height() / 2});
            return false;
        });

        $('.window-close, .window-form-cancel a').click(function() {
            $('.window').hide();
            $('.overlay').hide();
            return false;
        });

        $('.overlay').click(function() {
            $('.window').hide();
            $('.overlay').hide();
        });

        $('body').keypress(function(e) {
            if (e.keyCode == 27) {
                $('.window').hide();
                $('.overlay').hide();
            }
        });

        $('body').keydown(function(e) {
            if (e.keyCode == 27) {
                $('.window').hide();
                $('.overlay').hide();
            }
        });

        // FAQ
        $('.faq-item-title a').click(function() {
            $(this).parent().parent().toggleClass('faq-item-open').find('.faq-item-text').slideToggle(speedFAQ);
            return false;
        });

        $('.registration').each(function() {
            // стилизация селектов
            var params = {
                changedEl: 'select',
                visRows: 5,
                scrollArrows: true
            }
            cuSel(params);

            // автозаполнение поля "Город"
            $('#city').autocomplete({
                source: function(request, response) {
                    var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex( request.term ), 'i');
                    response($.grep(availableCities, function(item) {
                        return matcher.test(item);
                    }));
                }
            });

            $('.registration-input input').click('click', function() {
                $('.registration').addClass('registration-error-hide');
            });

            // проверка формы
            $.extend($.validator.messages, {
                required: 'Это обязательное поле!'
            });

            $('.registration form').validate({
                invalidHandler: function(form, validator) {
                    $('.registration').removeClass('registration-error-hide');
                    $('.registration-input').animate({'opacity': .99}, 100).css({'opacity': 1});
                    validator.showErrors();
                    if ($('.registration form .error:first').length > 0) {
                        $.scrollTo('.registration form .error:visible:first', {offset: {'top': -42}, duration: speedScroll});
                    }
                }
            });

        });

        $('.registration-demo').each(function() {
            $('.registration-input input').click('click', function() {
                $('.registration-demo').addClass('registration-error-hide');
            });

            // проверка формы
            $('.registration-demo form').validate({
                messages: {
                    email: 'Это обязательное поле!'
                },
                invalidHandler: function(form, validator) {
                    $('.registration-demo').removeClass('registration-error-hide');
                    $('.registration-input').animate({'opacity': .99}, 100).css({'opacity': 1});
                    validator.showErrors();
                    if ($('.registration-demo form .error:first').length > 0) {
                        $.scrollTo('.registration-demo form .error:visible:first', {offset: {'top': -42}, duration: speedScroll});
                    }
                },
                submitHandler: function(form) {
                    $('.overlay-demo').show();
                    $('#window-demo').show();
                }
            });

        });

        if ($(".overview-group-screen-inner a").length > 0) {
            $(".overview-group-screen-inner a").fancybox({
                openEffect	: 'none',
                closeEffect	: 'none'
            });
        }

        // пример сообщения
        if ($('#window-message').length == 1) {
            $(window).load(function() {
                $('.overlay').show();
                $('#window-message').show();
                $('#window-message').css({'margin-top':-$('#window-message').height() / 2});
            });
        }

    });

    // переход к следующему слайду
    function sliderNext() {
        var curSlider = $('.slider-content');
        if (!curSlider.data('disableAnimate')) {
            window.clearTimeout(timerSlider);
            timerSlider = null;

            curSlider.data('disableAnimate', true);

            var curIndex = curSlider.data('curIndex');
            var newIndex = curIndex + 1;
            if (newIndex == curSlider.find('li').length) {
                newIndex = 0;
            }

            $('.slider-ctrl a.active').removeClass('active');
            $('.slider-ctrl a').eq(newIndex).addClass('active');

            curSlider.find('li').eq(curIndex).fadeOut(speedSlider / 2, function() {
                curSlider.find('li').eq(newIndex).fadeIn(speedSlider / 2, function() {
                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimate', false);
                    if (periodSlider > 0) {
                        timerSlider = window.setTimeout(sliderNext, periodSlider);
                    }
                });
            });
        }
    }

})(jQuery);