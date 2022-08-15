//
//-----------------------------------------------------------------
// 공통 스크립트
//-----------------------------------------------------------------
//

'use strict';

var _gb = function () {
    this.wW = window.innerWidth;
    this.wH = window.innerHeight;
    this.html = $('html');
    this.body = $('body');
    this.main = $('main');
    this.header = $('#gnb');
    this.allMenu = $('#allMenu');
    this.footer = $('footer');
    this.tabMenu = $('.tab-menu');
    this.listTabMenu = $('.list-tab-menu');
    this.dimmed = $('<div class="dimmed"></div>');
    this.vdSwiper = $('.vd-swiper').get();
    this.tabSwiper = $('.tab-swiper').get();
    this.liveOnAir = $('.liveOnAir');
    this.btnActiveModal = $('.button-active-modal');
    this.isMob = this.wW <= 768 ? true : false;
  },
  gb = new _gb();

window.addEventListener('load', function () {
  commonFunction().init();

  if (gb.main.length) {
    if (!gb.html.hasClass('onAir')) {
      commonFunction().MainSwiper();
    }
    commonFunction().showOnLayer();
  }

  if (gb.vdSwiper.length) commonFunction().VdSwiper();
  if (gb.tabSwiper.length) commonFunction().TabSwiper();
  if ($('.list-filter-swiper').length) commonFunction().FilterSwiper();
});

function commonFunction() {
  var commonFunction_ = new gb.CommonFunction();

  return commonFunction_;
}

(function ($) {
  gb.CommonFunction = function () {
    var setGnb = function () {
        // 헤더
        if (gb.main.length) {
          gsap.to('main', { y: 0, duration: 0.5, delay: 0.3 });
          gsap.to('#gnb', { y: 0, opacity: 1, duration: 0.5, delay: 0.4 });
        }

        if (document.documentElement.scrollTop >= 50) {
          gb.header.addClass('fixed');
        } else {
          gb.header.removeClass('fixed');
        }

        $('.button-open-allMenu').on('click', function () {
          gb.allMenu.stop().animate(
            {
              right: 0,
            },
            300
          );
        });

        $('.button-close-allMenu').on('click', function () {
          gb.allMenu.stop().animate(
            {
              right: '-100%',
            },
            300
          );
        });

        gb.allMenu.find('.depth1 > li > button').on('click', function () {
          var trg = $(this);

          if (trg.hasClass('on')) {
            trg.removeClass('on');
            trg.next('.box').slideUp(300);
          } else {
            gb.allMenu.find('.depth1 > li > button').removeClass('on');
            gb.allMenu.find('.depth1 > li > button').next('.box').slideUp(300);
            trg.addClass('on');
            trg.next('.box').slideDown(300);
          }
        });
      },
      modal = function () {
        // 공통 모달
        gb.btnActiveModal.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var trg = $(this),
            modalName = trg.data('modal-name');

          if (trg.hasClass('on')) {
            $('.button-active-modal').removeClass('on');
            $('.modal').stop().fadeOut(300).remove();
          } else {
            $('.button-active-modal').removeClass('on');
            trg.addClass('on');
            $('.modal').stop().fadeOut(300).remove();

            $.get('../modal/modal.html', function (data) {
              gb.result = $(data)
                .filter('#modal-' + modalName)
                .html();

              if (trg.hasClass('fixed')) {
                gb.body.append(gb.result);
              } else {
                trg.next('.modal-wrap').append(gb.result);
              }
            });
          }
        });

        $(document).on('click', '.modal-change', function () {
          var _trg = $(this),
            _modalName = _trg.data('modal-name');

          $.get('../modal/modal.html', function (data) {
            gb.result = $(data)
              .filter('#modal-' + _modalName)
              .html();

            _trg.closest('.modal').html(gb.result);
          });
        });

        $(document).on('click', '.modal-off', function () {
          $('.modal').stop().fadeOut(300).remove();
          $('.button-active-modal').removeClass('on');
        });
      },
      MainSwiper = function () {
        // 메인 스와이퍼
        gb.mainSwiper = new Swiper('.main-swiper', {
          // Optional parameters
          loop: true,
          speed: 600,
          centeredSlides: true,
          effect: 'coverflow',
          coverflowEffect: {
            rotate: 45,
            slideShadows: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          slidesPerView: 1,
          debugger: true, // Enable debugger
        });

        gb.mainSwiper.on('slideChangeTransitionEnd', function (swiper) {
          setTimeout(function () {
            var currentVd = document.querySelector('.swiper-slide-active video'),
              notCurrentvd = $('.swiper-slide:not(.swiper-slide-active) video').get(),
              animate = $('.swiper-slide-active .animate').get(),
              animate_ = $('.swiper-slide:not(.swiper-slide-active) .animate').get();

            animate_.forEach(function (elem) {
              $(elem).removeClass('animation--start');
            });
            animate.forEach(function (elem) {
              $(elem).addClass('animation--start');
            });

            if (!gb.isMob) {
              notCurrentvd.forEach(function (elem) {
                elem.load();
              });

              currentVd.play();

              currentVd.addEventListener('ended', function () {
                gb.mainSwiper.slideNext();
              });
            }

            $('.button-swiperController').removeClass('play').addClass('pause').find('em').text('일시정지');
          }, 100);
        });

        var currentVd = document.querySelector('.swiper-slide-active video'),
          animate = $('.swiper-slide-active .animate').get();

        if (!gb.isMob) currentVd.play();

        setTimeout(function () {
          animate.forEach(function (elem) {
            $(elem).addClass('animation--start');
          }, 1000);
        });

        /*********************************************
          동영상 재생이 끝나고
          다음 동영상으로 이어서 스와이프
          *********************************************/
        currentVd.addEventListener('ended', function () {
          gb.mainSwiper.slideNext();
        });

        $('.main-swiper')
          .find('.swiper-pagination')
          .append('<span class="button-swiperController pause"><em class="hidden-txt">일시정지</em></span>');

        $(document).on('click', '.button-swiperController', function () {
          var trg = $(this),
            currentVd = document.querySelector('.swiper-slide-active video');

          if (trg.hasClass('play')) {
            trg.removeClass('play').addClass('pause').find('em').text('일시정지');
            if (!gb.isMob) currentVd.play();
          } else {
            trg.removeClass('pause').addClass('play').find('em').text('재생');
            if (!gb.isMob) currentVd.pause();
          }
        });
      },
      VdSwiper = function () {
        // 공통 스와이퍼
        gb._vdSwiper = gb._vdSwiper || [];

        gb.vdSwiper.forEach(function (elem, i) {
          if (typeof gb._vdSwiper[i] !== 'undefined') {
            gb._vdSwiper[i].destroy();
          }

          gb.vdSwiperOption = {
            // Optional parameters
            loop: false,
            speed: 600,
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: false,
            debugger: true, // Enable debugger
            // resistance: false,
            // allowTouchMove: true,
            // observer: true,
            // observeParents: true,
            // SimulateTouch: false,
            scrollbar: {
              el: '.swiper-scrollbar-customed',
              hide: false,
              draggable: true,
            },
            navigation: {
              nextEl: '.button-swiper-nxt',
              prevEl: '.button-swiper-prev',
            },
          };

          gb._vdSwiper[i] = new Swiper(elem, gb.vdSwiperOption);
        });
      },
      LiveOnSwiper = function () {
        // 편성표 스와이퍼
        if (typeof gb._liveOnSwiper !== 'undefined') {
          gb._liveOnSwiper.destroy();
        }

        gb._liveOnSwiper = new Swiper('.liveOn-swiper', {
          // Optional parameters
          loop: true,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger
          navigation: {
            nextEl: '.button-swiper-nxt',
            prevEl: '.button-swiper-prev',
          },
        });
      },
      TabSwiper = function () {
        // 탭 메뉴 스와이퍼
        gb._tabSwiper = gb._tabSwiper || [];

        gb.tabSwiper.forEach(function (elem, i) {
          if (typeof gb._tabSwiper[i] !== 'undefined') {
            gb._tabSwiper[i].destroy();
          }

          gb.tabSwiperOption = {
            // Optional parameters
            loop: false,
            speed: 600,
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: false,
            debugger: true, // Enable debugger,
            navigation: {
              nextEl: '.button-swiper-nxt',
              prevEl: '.button-swiper-prev',
            },
          };
          //if (window.innerWidth <= 1280) {
          gb._tabSwiper[i] = new Swiper(elem, gb.tabSwiperOption);
          //}
        });
      },
      FilterSwiper = function () {
        // 서울오리지널 필터 스와이퍼
        if (typeof gb.filterSwiper !== 'undefined') {
          gb.filterSwiper.destroy();
        }

        gb.filterSwiperOption = {
          // Optional parameters
          loop: false,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger,
          navigation: {
            nextEl: '.button-swiper-nxt',
            prevEl: '.button-swiper-prev',
          },
        };

        gb.filterSwiper = new Swiper('.list-filter-swiper', gb.filterSwiperOption);
      },
      showOnLayer = function () {
        $('.button-showLayer').on('click', function () {
          var trg = $(this);

          if (trg.hasClass('on')) {
            trg.removeClass('on');
            gb.liveOnAir.slideUp(300, function () {
              gb._liveOnSwiper.destroy();
            });
            trg.find('em').html('LIVE ON Air<br/> 편성표 보기');
          } else {
            trg.addClass('on');
            gb.liveOnAir.slideDown(300, LiveOnSwiper);
            trg.find('em').html('LIVE ON Air<br/> 편성표 닫기');
          }
        });

        $(document).on('mouseenter focusin', '.liveOnAir .info', function () {
          var trg = $(this);

          trg.closest('article').addClass('on');
          trg
            .find('.preview')
            .stop()
            .fadeIn(200, function () {
              gsap.to(trg.find('.preview'), { opacity: 1, scaleY: 1, duration: 0.4 });
            });
        });

        $(document).on('mouseleave focusout', '.liveOnAir .info', function () {
          var trg = $(this);

          trg.closest('article').removeClass('on');
          gsap.to(trg.find('.preview'), { opacity: 0, scaleY: 0, duration: 0.4 });
          trg.find('.preview').stop().fadeOut(300);
        });
      },
      tabMenu = function () {
        // 메인 탭 메뉴
        gb.tabMenu.each(function () {
          var trg_tabList = this,
            tabList_idx = gb.tabMenu.index(trg_tabList);

          $(trg_tabList)
            .find('a')
            .on('click', function (e) {
              e.preventDefault();
              e.stopPropagation();

              var trg = $(this),
                trg_idx = $(trg_tabList).find('a').index(this),
                tabId = trg.attr('href').substr(1);

              gb._tabSwiper[tabList_idx].slideTo(trg_idx);

              if (!trg.closest('li').hasClass('on')) {
                $(trg_tabList).find('li').removeClass('on');
                trg.closest('li').addClass('on');

                $.get('./tabContents/' + trg_tabList.id + '.html', function (data) {
                  $(trg_tabList)
                    .next('.tab-contents')
                    .html($(data).filter('#' + tabId));

                  new Swiper('#' + tabId + ' .vd-swiper', gb.vdSwiperOption);

                  setTimeout(function () {
                    $('#' + tabId).addClass('active');
                  }, 200);
                });
              }
            });
        });
      },
      listTabMenu = function () {
        // 리스트 탭 메뉴
        gb.listTabMenu.each(function () {
          var trg_tabList = this;

          $(trg_tabList)
            .find('a')
            .on('click', function (e) {
              e.preventDefault();
              e.stopPropagation();

              var trg = $(this),
                tabId = trg.attr('href').substr(1);

              if (!trg.closest('li').hasClass('on')) {
                $(trg_tabList).find('li').removeClass('on');
                trg.closest('li').addClass('on');
                $('.list-tab-contents').css('display', 'none');
                $('.list-tab-contents')
                  .filter('#' + tabId)
                  .css('display', 'block');
              }
            });
        });
      },
      datePick = function () {
        $('.calendar').datepicker({
          showOn: 'both',
          buttonImageOnly: true,
          buttonImage: '/assets/images/icon-calendar.png',
          dateFormat: 'yy-mm-dd',
        });
      },
      fileUpload = function (el, type) {
        var pathpoint = el.value.lastIndexOf('.'),
          filepoint = el.value.substring(pathpoint + 1, el.length),
          filetype = filepoint.toLowerCase(); // 업로드 파일 확장자

        if (window.FileReader) {
          // modern browser
          var fileReader = new FileReader(),
            fileName = $(el)[0].files[0].name, // 첨부 파일 명
            filesize = $(el)[0].files[0].size; // 첨부 파일 용량

          fileReader.readAsDataURL($(el)[0].files[0]);
        }

        if (type == 'image') {
          // 이미지 업로드
          if (filetype == 'jpg' || filetype == 'gif' || filetype == 'png' || filetype == 'jpeg' || filetype == 'bmp') {
            // 정상적인 이미지 확장자 파일일 경우
            fileReader.onload = function (e) {
              $(el).siblings('img').attr('src', e.target.result);
            };
          } else {
            alert('이미지 파일만 선택 할 수 있습니다.');
            parentObj = el.parentNode;
            node = parentObj.replaceChild(el.cloneNode(true), el);
            return false;
          }
        } else {
          $(el).closest('.file-attach').find('.text-wrap input[type=text]').val(fileName);
        }
      },
      copyToClipboard = function (val) {
        var t = document.createElement('textarea');

        document.body.appendChild(t);

        t.value = val;
        t.select();

        document.execCommand('copy');
        document.body.removeChild(t);
      },
      copyUrl = function () {
        copyToClipboard(location.href);
        alert('링크가 복사되었습니다.\n ' + location.href);
      },
      vdOnPlay = function () {
        $('.vd-play').on('click', function () {
          var container = document.querySelector('.vd-container video');

          $(this).stop().fadeOut('400');
          $(this).next('.vd-cover').stop().fadeOut('400');

          container.play();
        });
      },
      allCheck = function () {
        var checked_ItemAll = $('input[type=checkbox][name^=chkAll]'),
          check_Item = $('input[type=checkbox][name^=chk_]');

        checked_ItemAll.on('change', function () {
          if ($(this).prop('checked')) {
            check_Item.prop('checked', '');
          }
        });

        check_Item.on('change', function () {
          if ($(this).prop('checked')) {
            checked_ItemAll.prop('checked', '');
          }
        });
      },
      goScrollTop = function () {
        gb.html.stop().animate({ scrollTop: 0 }, 400);
      },
      menuAll = function (t, el, status) {
        if ($(t).hasClass('active')) {
          $(t).removeClass('active');
          $(el).stop().fadeOut(300);
        } else {
          $(t).addClass('active');
          $(el).stop().fadeIn(300);
        }
      },
      setLnb = function () {
        $('.button-open-sideMenu').on('click', function () {
          var trg = $(this);
          var pageTop = $('.page-body').offset().top;

          $('.mob-sideMenu').css('top', pageTop + 'px');

          if (trg.hasClass('active')) {
            $('.mob-sideMenu')
              .stop()
              .animate(
                {
                  left: '-80%',
                },
                {
                  duration: 300,
                  complete: function () {
                    trg.removeClass('active');
                  },
                }
              );
            gb.body.css({
              height: 'auto',
              overflow: 'visible',
            });
            $('.dimmed.bk').remove();
          } else {
            $('.mob-sideMenu')
              .stop()
              .animate(
                {
                  left: 0,
                },
                {
                  duration: 300,
                  complete: function () {
                    trg.addClass('active');
                  },
                }
              );
            gb.body.css({
              height: '100vh',
              overflow: 'hidden',
            });
            $('.page-body').append('<div class="dimmed bk"></div>');
          }

          $(document).on('click', '.dimmed.bk', function () {
            $('.mob-sideMenu')
              .stop()
              .animate(
                {
                  left: '-80%',
                },
                {
                  duration: 300,
                  complete: function () {
                    trg.removeClass('active');
                  },
                }
              );
            gb.body.css({
              height: 'auto',
              overflow: 'visible',
            });
            $(this).remove();
          });
        });
      },
      blockContextMenu = function () {
        // 우 클릭, 드래그 방지
        $(document).on('contextmenu selectstart dragstart', function () {
          return false;
        });
      },
      init = function () {
        setGnb();
        setLnb();
        tabMenu();
        listTabMenu();
        allCheck();
        datePick();
        vdOnPlay();
        modal();
        //blockContextMenu();
      };

    return {
      init: init,
      MainSwiper: MainSwiper,
      VdSwiper: VdSwiper,
      LiveOnSwiper: LiveOnSwiper,
      TabSwiper: TabSwiper,
      FilterSwiper: FilterSwiper,
      showOnLayer: showOnLayer,
      goScrollTop: goScrollTop,
      fileUpload: fileUpload,
      menuAll: menuAll,
      copyUrl: copyUrl,
    };
  };

  window.Modernizr = {
    touch: true,
  };

  window.addEventListener('resize', function () {
    if (gb.vdSwiper.length) commonFunction().VdSwiper();
    if (gb.liveOnAir.length) commonFunction().LiveOnSwiper();
    if (gb.tabSwiper.length) commonFunction().TabSwiper();
    if ($('.list-filter-swiper').length) commonFunction().FilterSwiper();
  });

  window.addEventListener('scroll', function () {
    if (document.documentElement.scrollTop >= 50) {
      gb.header.addClass('fixed');
    } else {
      gb.header.removeClass('fixed');
    }
  });
})(jQuery);

// 쿠키설정
function setCookie(cName, cValue, cDay) {
  var expire = new Date();

  expire.setDate(expire.getDate() + cDay);
  cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
}

function getCookie(cName) {
  cName = cName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = '';
  if (start != -1) {
    start += cName.length;
    var end = cookieData.indexOf(';', start);
    if (end == -1) end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

/*****
 creater main
**** */
var crVisSwiper = new Swiper('.cr-vis-swiper', {
  // Optional parameters
  loop: true,
  speed: 600,
  centeredSlides: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  autoplay: {
    delay: 5000,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  slidesPerView: 1,
  debugger: true, // Enable debugger
});

crVisSwiper.on('slideChangeTransitionEnd', function (swiper) {
  setTimeout(function () {
    var currentVd = document.querySelector('.swiper-slide-active video'),
      notCurrentvd = $('.swiper-slide:not(.swiper-slide-active) video'),
      animate = $('.swiper-slide-active .animate').get(),
      animate_ = $('.swiper-slide:not(.swiper-slide-active) .animate').get();

    animate_.forEach(function (elem) {
      $(elem).removeClass('animation--start');
    });
    animate.forEach(function (elem) {
      $(elem).addClass('animation--start');
    });

    for (var i = 0; i <= notCurrentvd.length; i++) {
      notCurrentvd.get(i).pause();
    }
  }, 100);
});

var $crVisSwiper_playBtn = $('.cr-vis-swiper .swiper-playBtn');

$crVisSwiper_playBtn.click(function () {
  if ($(this).hasClass('play')) {
    crVisSwiper.autoplay.stop();
    $(this).text('재생').removeClass('play').addClass('stop');
  } else {
    crVisSwiper.autoplay.start();
    $(this).text('멈춤').removeClass('stop').addClass('play');
  }
});

var crProfileSwiper = new Swiper('.cr-profile-swiper', {
  // Optional parameters
  loop: true,
  speed: 600,
  centeredSlides: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  autoplay: {
    delay: 5000,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: false,
  slidesPerView: 1,
  debugger: true, // Enable debugger
});

crProfileSwiper.on('slideChangeTransitionEnd', function (swiper) {
  setTimeout(function () {
    var animate = $('.swiper-slide-active .animate').get(),
      animate_ = $('.swiper-slide:not(.swiper-slide-active) .animate').get();

    animate_.forEach(function (elem) {
      $(elem).removeClass('animation--start');
    });
    animate.forEach(function (elem) {
      $(elem).addClass('animation--start');
    });
  }, 100);
});

var animate = $('.swiper-slide-active .animate').get();

setTimeout(function () {
  animate.forEach(function (elem) {
    $(elem).addClass('animation--start');
  }, 1000);
});
