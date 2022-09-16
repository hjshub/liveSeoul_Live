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
    this.layout = $('#layout');
    this.main = $('main');
    this.wrap = $('.wrap');
    this.header = $('#gnb');
    this.allMenu = $('#allMenu');
    this.footer = $('footer');
    this.tabMenu = $('.tab-menu');
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
  if ($('.curation-swiper').length) commonFunction().CurationSwiper();
  if ($('.dropArea').length) commonFunction().setCurList();
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

          gb.layout.css({
            height: '100vh',
            overflow: 'hidden',
          });
        });

        $('.button-close-allMenu').on('click', function () {
          gb.allMenu.stop().animate(
            {
              right: '-100%',
            },
            300
          );

          if (!$('.button-open-sideMenu').hasClass('active')) {
            gb.layout.css({
              height: 'auto',
              overflow: 'visible',
            });
          }
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

        $('.gnb > li > a').on({
          'mouseenter focusin': function () {
            var trg = $(this);

            $('.gnb > li > a').removeClass('on');
            $('.gnb > li > a').next('div').stop().slideUp(300);
            trg.closest('li').addClass('on');
            trg.next('div').stop().slideDown(300);
          },
        });

        $('.gnb > li').on({
          mouseleave: function () {
            var trg = $(this);

            trg.removeClass('on');
            trg.find('> div').stop().slideUp(300);
          },
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
            $('.modal').css('display', 'none');

            if (trg.hasClass('fixed')) {
              $('.dimmed fixed').remove();
              gb.body.css({
                height: 'auto',
                overflow: 'visible',
              });
            }
          } else {
            $('.button-active-modal').not(trg).removeClass('on');
            trg.addClass('on');

            $('.modal').css('display', 'none');
            $('.modal#modal-' + modalName)
              .stop()
              .fadeIn(300);

            if (trg.hasClass('fixed')) {
              gb.body.append('<div class="dimmed fixed"></div>');
              gb.body.css({
                height: '100vh',
                overflow: 'hidden',
              });
            }
          }
        });

        $(document).on('click', '.modal-off, .dimmed.fixed', function () {
          modalOff();
        });
      },
      modalOff = function () {
        $('.button-active-modal').removeClass('on');
        $('.modal').css('display', 'none');
        $('.dimmed.fixed').remove();
        gb.body.css({
          height: 'auto',
          overflow: 'visible',
        });
      },
      MainSwiper = function () {
        // 메인 스와이퍼
        gb.mainSwiper = new Swiper('.main-swiper', {
          // Optional parameters
          loop: true,
          speed: 600,
          centeredSlides: true,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          slidesPerView: 1,
          debugger: true, // Enable debugger
        });

        gb.mainSwiper.on('activeIndexChange', function (swiper) {
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

            notCurrentvd.forEach(function (elem) {
              elem.pause();
              $(elem).prop('currentTime', 0);
            });

            currentVd.play();

            currentVd.addEventListener('ended', function () {
              gb.mainSwiper.slideNext();
            });

            $('.button-swiperController').removeClass('play').addClass('pause').find('em').text('일시정지');
          }, 100);
        });

        var currentVd = document.querySelector('.swiper-slide-active video'),
          notCurrentvd = $('.swiper-slide:not(.swiper-slide-active) video').get(),
          animate = $('.swiper-slide-active .animate').get();

        notCurrentvd.forEach(function (elem) {
          elem.load();
        });

        currentVd.play();

        setTimeout(function () {
          animate.forEach(function (elem) {
            $(elem).addClass('animation--start');
          });
        }, 100);

        /*********************************************
          동영상 재생이 끝나고
          다음 동영상으로 이어서 스와이프
          *********************************************/
        currentVd.addEventListener('ended', function () {
          gb.mainSwiper.slideNext();
        });

        $('.main-swiper')
          .find('.swiper-pagination')
          .append('<button type="button" class="button-swiperController pause"><em class="hidden-txt">일시정지</em></button>');

        $(document).on('click', '.button-swiperController', function () {
          var trg = $(this),
            currentVd = document.querySelector('.swiper-slide-active video');

          if (trg.hasClass('play')) {
            trg.removeClass('play').addClass('pause').find('em').text('일시정지');
            currentVd.play();
          } else {
            trg.removeClass('pause').addClass('play').find('em').text('재생');
            currentVd.pause();
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
      CurationSwiper = function () {
        // 큐레이션 스와이퍼
        gb.curationSwiper = new Swiper('.curation-swiper', {
          // Optional parameters
          loop: true,
          speed: 500,
          centeredSlides: true,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          slidesPerView: 1,
          debugger: true, // Enable debugger
        });

        gb.curationSwiper.on('activeIndexChange', function (swiper) {
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
            notCurrentvd.forEach(function (elem) {
              elem.pause();
              $(elem).prop('currentTime', 0);
            });
          }, 100);
        });

        var animate = $('.swiper-slide-active .animate').get();

        setTimeout(function () {
          animate.forEach(function (elem) {
            $(elem).addClass('animation--start');
          });
        }, 100);
      },
      showOnLayer = function () {
        // 편성표 보기
        $('.button-showLayer').on('click', function () {
          var trg = $(this);

          if (trg.hasClass('on')) {
            trg.removeClass('on');
            gb.liveOnAir.slideUp(300, function () {
              gb._liveOnSwiper.destroy();
              trg.find('em').html(trg.find('em').html().replace('닫기', '보기'));
            });
          } else {
            trg.addClass('on');
            gb.liveOnAir.slideDown(300, LiveOnSwiper);
            trg.find('em').html(trg.find('em').html().replace('보기', '닫기'));
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
      datePick = function () {
        $('.calendar').datepicker({
          showOn: 'both',
          buttonImageOnly: true,
          buttonImage: '../assets/images/icon-calendar.png',
          dateFormat: 'yy-mm-dd',
        });
      },
      fileUpload = function (el, type) {
        // input file
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
        // 클립 보드에 복사
        var t = document.createElement('textarea');

        document.body.appendChild(t);

        t.value = val;
        t.select();

        document.execCommand('copy');
        document.body.removeChild(t);
      },
      copyUrl = function () {
        // url 복사
        copyToClipboard(location.href);
        alert('링크가 복사되었습니다.\n ' + location.href);
      },
      allCheck = function () {
        // 전체 선택
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
      menuAll = function (t, el) {
        // 프로그램 전체메뉴
        if ($(t).hasClass('active')) {
          $(t).removeClass('active');
          $(el).stop().fadeOut(300);
        } else {
          $(t).addClass('active');
          $(el).stop().fadeIn(300);
        }
      },
      setLnb = function () {
        // 모바일 사이드 메뉴 (공통 목록, 공통 상세)
        $('.button-open-sideMenu').on('click', function () {
          var trg = $(this);
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
              )
              .next('.dimmed')
              .remove();

            gb.layout.css({
              height: 'auto',
              overflow: 'visible',
            });
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
              )
              .after('<div class="dimmed side"></div>');

            gb.layout.css({
              height: '100vh',
              overflow: 'hidden',
            });
          }

          $(document).on('click', '.dimmed.side', function () {
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
            gb.layout.css({
              height: 'auto',
              overflow: 'visible',
            });
            $(this).remove();
          });
        });
      },
      filterMoreView = function () {
        // 주제별 영상 목록 필터 더보기
        $('.button-more-list').each(function () {
          var trg = $(this),
            filterWrap = trg.siblings('.list-filter .filter-wrap'),
            listWrap = filterWrap.find('ul'),
            filterWrapHT = filterWrap.height();

          trg.on('click', function () {
            var listWrapHT = listWrap.height();

            if (trg.hasClass('more')) {
              filterWrap.css('height', filterWrapHT + 'px');
              trg.removeClass('more');
              trg.find('em').text('더 보기');
            } else {
              filterWrap.css('height', listWrapHT + 'px');
              trg.addClass('more');
              trg.find('em').text('접기');
            }
          });
        });
      },
      setCurList = function () {
        // 큐레이션 등록 영상 설정
        $('.set-cur-list').each(function () {
          var curTrg = $(this),
            curTop = curTrg.filter('.set-Top'),
            curBT = curTrg.filter('.set-BT');

          // Top 영역에 등록된 영상이 없을 시
          if (!curTop.find('.sort-inner li').length) {
            curTop
              .find('.sort-inner')
              .prepend('<div class="empty"><b>TOP영역에 등록할 영상을<br/> 드래그해서 이곳에 놓아주세요.</b></div>');
          }

          // 하단 영역에 등록된 영상이 없을 시
          if (!curBT.find('.sort-inner li').length) {
            curBT
              .find('.sort-inner')
              .prepend('<div class="empty"><b>하단영역에 등록할 영상을<br/> 드래그해서 이곳에 놓아주세요.</b></div>');
          }

          // 영상선택 (drag)
          curTrg.find('.drag-item').draggable({
            helper: function () {
              var trg = $(this),
                chWidth = trg.find('.dataArea').outerWidth(),
                _cloneItem = trg.clone();
              gb.dragItemNumb = $(_cloneItem).data('number');

              _cloneItem.css('width', chWidth + 'px').addClass('drag');

              curTrg.find('.sort-inner').prepend('<div class="dropped"><em class="hidden-txt">드롭영역</em></div>');

              gb.draggable = curTrg.find('.sort-inner li[data-number=' + gb.dragItemNumb + ']').length > 0;

              return _cloneItem
                .appendTo(curTrg.find('.sort-inner'))
                .css({
                  zIndex: 20,
                })
                .show();
            },
            stop: function (e, el) {
              var trg = $(this);

              curTrg.find('.sort-inner .dropped').remove();
              trg.removeClass('drag');
            },
            opacity: 0.7,
            cursor: 'move',
            containment: 'document',
          });

          // 영상 등록 (drop)
          curTrg
            .find('.sort-inner')
            .droppable({
              accept: curTrg.find('.drag-item'),
              drop: function (e, el) {
                var _currentItem = $(el.draggable),
                  _cloneItem = _currentItem.clone(),
                  trg = $(this),
                  dropEl = trg.find('li').get();

                _cloneItem.removeClass('ui-draggable').removeClass('drag-item').removeClass('drag');
                $(_cloneItem).find('.chk-wrap').remove();
                $(_cloneItem).find('.dataArea').append('<button class="button-delete"><em class="hiddne-txt">삭제</em></button>');

                // 등록 영상이 있을 경우
                if (dropEl.length) {
                  trg.find('.empty').remove();
                }

                // 영상을 드롭하는 경우
                trg.find('.dropped').remove();

                if (gb.draggable) {
                  // 중복 영상 구분
                  alert('해당 영상은 이미 등록된 영상입니다.');
                  return false;
                } else {
                  if (curTrg.hasClass('set-Top')) {
                    // Top 영역
                    if (dropEl.length <= 5) {
                      // 등록 영상 개수 설정 최대 5개
                      trg.append(_cloneItem);
                    } else {
                      alert('TOP영역 영상은 최대 5개까지 설정가능합니다.');
                      return false;
                    }
                  } else {
                    // 하단 영역
                    trg.append(_cloneItem);
                  }
                }
              },
            })
            .sortable({
              placeholder: 'ui-shift',
              cursor: 'move',
            });

          // 이동(copy) 버튼
          curTrg.find('.button-item-move').on('click', function () {
            var trg = $(this),
              itemChecked = curTrg.find('.drag-item input[type=checkbox]:checked'),
              itemDropArea = curTrg.find('.sort-inner'),
              itemDropped = itemDropArea.find('li'),
              itemCheckedArray = itemChecked.get();

            itemCheckedArray.forEach(function (elem, idx) {
              var itemClone = $(elem).closest('.drag-item').clone();

              gb.clickItemNumb = $(itemClone).data('number');
              gb.draggable = curTrg.find('.sort-inner li[data-number=' + gb.clickItemNumb + ']').length > 0;

              $(itemClone).removeClass('ui-draggable').removeClass('drag-item');
              $(itemClone).find('.chk-wrap').remove();
              $(itemClone).find('.dataArea').append('<button class="button-delete"><em class="hiddne-txt">삭제</em></button>');

              console.log(gb.draggable);

              if (gb.draggable) {
                // 중복 영상 구분
                alert('해당 영상은 이미 등록된 영상입니다.');

                return false;
              } else {
                if (curTrg.hasClass('set-Top')) {
                  // Top 영역
                  if (itemDropped.length + itemCheckedArray.length <= 5) {
                    // 등록 영상 개수 설정 최대 5개
                    itemDropArea.append(itemClone);
                  } else {
                    alert('TOP영역 영상은 최대 5개까지 설정가능합니다.');

                    return false;
                  }
                } else {
                  itemDropArea.append(itemClone);
                }
              }
            });

            curTrg.find('.drag-item input[type=checkbox]').prop('checked', '');

            if (itemChecked.length) {
              itemDropArea.find('.empty').remove();
            }
          });
        });

        $('.sort-inner li').disableSelection();

        // 등록 영상 삭제
        $(document).on('click', '.button-delete', function () {
          $(this).closest('li').remove();
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
        allCheck();
        datePick();
        modal();
        filterMoreView();
        //blockContextMenu();
      };

    return {
      init: init,
      modalOff: modalOff,
      MainSwiper: MainSwiper,
      VdSwiper: VdSwiper,
      LiveOnSwiper: LiveOnSwiper,
      TabSwiper: TabSwiper,
      FilterSwiper: FilterSwiper,
      CurationSwiper: CurationSwiper,
      showOnLayer: showOnLayer,
      goScrollTop: goScrollTop,
      fileUpload: fileUpload,
      setCurList: setCurList,
      menuAll: menuAll,
      copyUrl: copyUrl,
    };
  };

  window.Modernizr = {
    touch: true,
  };

  window.addEventListener('resize', function () {
    gb.isMob = this.wW <= 768 ? true : false;

    if (gb.vdSwiper.length) commonFunction().VdSwiper();
    if (gb.liveOnAir.length) commonFunction().LiveOnSwiper();
    if (gb.tabSwiper.length) commonFunction().TabSwiper();
    if ($('.list-filter-swiper').length) commonFunction().FilterSwiper();

    if (!gb.isMob) {
      $('.mob-sideMenu')
        .stop()
        .animate(
          {
            left: '-80%',
          },
          {
            duration: 300,
            complete: function () {
              $('.button-open-sideMenu').removeClass('active');
            },
          }
        )
        .next('.dimmed')
        .remove();

      gb.layout.css({
        height: 'auto',
        overflow: 'visible',
      });
    }
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

crVisSwiper.on('activeIndexChange', function (swiper) {
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
    notCurrentvd.forEach(function (elem) {
      elem.pause();
      $(elem).prop('currentTime', 0);
    });
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

crProfileSwiper.on('activeIndexChange', function (swiper) {
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
  });
}, 100);
