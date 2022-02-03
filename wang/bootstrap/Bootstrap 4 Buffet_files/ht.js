/**
 * Created by alex on 9/05/17.
 */

function demoNavIsMobile() {
  return $('#ht-demo-mobile-indicator').is(':visible');
}
function navIsMobile() {
  return $('#ht-nav-mobile-indicator').is(':visible');
}

$(document).ready(function() {
  $(".ht-nav-dropdown-toggle").click(function(e){
    $(this).parent(".ht-nav-dropdown").toggleClass("ht-nav-dropdown-show");
    $(this).parent().siblings(".ht-nav-dropdown").removeClass("ht-nav-dropdown-show");
  });

  $(".ht-nav-dropdown").hover(function(){
    if (!navIsMobile()) {
      $(this).addClass("ht-nav-dropdown-show");
      $(this).siblings(".ht-nav-dropdown").removeClass("ht-nav-dropdown-show");
    }
  }, function() {
    if (!navIsMobile()) {
      $(this).removeClass("ht-nav-dropdown-show");
    }
  });

  $(".ht-mobile-nav-toggle").click(function(e){
    $(".ht-nav-wrapper").toggleClass("ht-nav-visible");
    $(".ht-mobile-nav-toggle").toggleClass("ht-nav-visible");
  });

  $('.ht-license-switch-dev').click(function(e){
    $('.ht-license-buy-dev').removeClass("ht-button-hidden");
    $('.ht-license-buy-ent').addClass("ht-button-hidden");

    $('.ht-license-switch-dev').addClass("active");
    $('.ht-license-switch-ent').removeClass("active");
    $('.ht-license-descriptor').text("Developer");

  });

  $('.ht-license-switch-ent').click(function(e){
    $('.ht-license-buy-dev').addClass("ht-button-hidden");
    $('.ht-license-buy-ent').removeClass("ht-button-hidden");

    $('.ht-license-switch-dev').removeClass("active");
    $('.ht-license-switch-ent').addClass("active");
    $('.ht-license-descriptor').text("Entrepreneur");

  });

  $("a[data-toggle='ht-special-modal']").click(function() {
    var targetId = $(this).attr("data-target");
    $(targetId).modal('toggle');

    var file = $(this).attr("href");
    ga('send', {
      hitType: 'event',
      eventCategory: 'Download',
      eventAction: file
    });
  });

  $('.btn-ht-dl-message').click(function(e){
    // e.preventDefault(); // comment before live!!
    $(".ht-dl-modal-backdrop").removeClass("ht-hidden");

    var file = $(this).attr("href");
    ga('send', {
      hitType: 'event',
      eventCategory: 'Download',
      eventAction: file
    });
  });

  $('.ht-dl-modal-x').click(function(){
    $(".ht-dl-modal-backdrop").addClass("ht-hidden");
  });

  $('.ht-dl-modal-backdrop').click(function(){
    $(".ht-dl-modal-backdrop").addClass("ht-hidden");
  });

  $('.ht-dl-modal-message').click(function(e){
    e.stopPropagation();
  });

  if(typeof(Paddle) != "undefined") {
    Paddle.Setup({
      vendor: 15205
    });
  }

  $(document).ready(function(){
    $('.ht-license-buy-dev').click(function(){
      Paddle.Checkout.open({
        product: 506947,
        successCallback: function(){
          ga('send', {
            hitType: 'event',
            eventCategory: 'Paddle',
            eventAction: "purchase",
            eventLabel: 'Charming Developer',
            eventValue: 14
          });
        },
        closeCallback: function(){
          ga('send', {
            hitType: 'event',
            eventCategory: 'Paddle',
            eventAction: "close",
            eventLabel: 'Charming Developer'
          });
        }
      });
    });

    $('.ht-license-buy-ent').click(function(){
      Paddle.Checkout.open({
        product: 506850,
        successCallback: function(){
          ga('send', {
            hitType: 'event',
            eventCategory: 'Paddle',
            eventAction: "purchase",
            eventLabel: 'Charming Entrepreneur',
            eventValue: 139
          });
        },
        closeCallback: function(){
          ga('send', {
            hitType: 'event',
            eventCategory: 'Paddle',
            eventAction: "close",
            eventLabel: 'Charming Entrepreneur'
          });
        }
      });
    });

  });

  function resizeWideVideo() {
    $("#ht-wide-video").height($("#ht-wide-video").width() / 32 * 9);
  }
  $(window).resize(function() {
    resizeWideVideo();
  });
  resizeWideVideo();

  $(".ht-charming-slider-slides").click(function(){
    $(this).children().fadeToggle(500);
  });

  // setInterval(function(){
  //   var isHover = $(".ht-charming-slider-slides").is(":hover");
  //   if(isHover === false) {
  //     $(".ht-charming-slider-slides").children().fadeToggle(2000);
  //   }
  // }, 6000);


  // TEST
  // $("#theme-download-modal").modal('toggle');

  $(".ht-demo-device-desktop").click (function(){
    $(this).addClass("active").siblings().removeClass("active");
    $(".ht-demo-iframe-box").removeClass("ht-demo-iframe-box-tablet").removeClass("ht-demo-iframe-box-mobile");
    $(".ht-demo-iframe-note").addClass("d-none");
  });

  $(".ht-demo-device-tablet").click (function(){
    $(this).addClass("active").siblings().removeClass("active");
    $(".ht-demo-iframe-box").addClass("ht-demo-iframe-box-tablet").removeClass("ht-demo-iframe-box-mobile");
    $(".ht-demo-iframe-note").removeClass("d-none");
  });

  $(".ht-demo-device-mobile").click (function(){
    $(this).addClass("active").siblings().removeClass("active");
    $(".ht-demo-iframe-box").addClass("ht-demo-iframe-box-mobile").removeClass("ht-demo-iframe-box-tablet");
    $(".ht-demo-iframe-note").removeClass("d-none");
  });

  $(".ht-demo-bar-dropup").click(function() { // on hover in
    $(this).toggleClass("show");
  });

  var popperOffset = '16px';
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    popperOffset = '-1px';
  }
  // popperOffset = '0';

  $(".ht-demo-bar-dropup").hover(function(){ // on hover in
    $(this).addClass("show");
    if(!demoNavIsMobile()) {
      var thisRef = $(this);
      var thisPop = $(this).children(".ht-demo-bar-dropup-menu");

      $(this).data('itemPopper', new Popper(
        thisRef,
        thisPop,
        {
          placement: 'top-start',
          modifiers: {
            preventOverflow: { enabled: false},
            flip: {enabled: false},
            offset: {enabled: true, offset: popperOffset}
          }
        }
      ));
    }

  }, function(){ // on hover out
    $(this).removeClass("show");
    if (typeof $(this).data('itemPopper') !== 'undefined') {
      $(this).data('itemPopper').destroy();
    }
  });

});

window.onmessage = function(e){
  if (
    e.origin !== "https://hackerthemes.com" &&
    e.origin !== "http://test.hackerthemes.com" &&
    e.origin !== "http://vm.local:5000"
  ) return;

  if(e.data.type === "example-switch") {
    if(e.data.content === 'startup') {
      $("#ht-demo-bar-example-startup").addClass("active");
      $("#ht-demo-bar-example-dashboard").removeClass("active");
    }
    if(e.data.content === 'dashboard') {
      $("#ht-demo-bar-example-dashboard").addClass("active");
      $("#ht-demo-bar-example-startup").removeClass("active");
    }
  }
};