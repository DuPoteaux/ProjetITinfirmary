/*! HackerThemes Themes picker and inspector code
 *  License: Unlicensed (please do not copy this code without permission)
 *  Copyright HackerThemes 2017
 * */

$(document).ready(function() {

  //neon glow modal test
  // $("#abort-modal").modal('show');

  // Safari detectiong for clipboard message
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  if ((is_chrome)&&(is_safari)) {is_safari=false;}


  if  (typeof isDarkTheme == 'undefined') {
    isDarkTheme = false;
  }

  pickerOn = false;
  inspectorOn = false;

  var previousTooltip;

  $(".ht-tm-toggle-sidenav").click(function(){
    $(".ht-tm-sidenav").toggleClass("d-none"); //argh
  });

  // SideNav Positioning

  var mainColumnTop;
  var mainColumnBottom;
  var sideNavTopSpace;
  var sidenavFixedRangeStart;
  var sidenavFixedRangeStop;

  var jumbotronBottom;

  function calculateMessagePos() {
    jumbotronBottom = $("#ht-tm-jumbotron").offset().top + $("#ht-tm-jumbotron").outerHeight();
  }

  function calculatePositions() {
    // Calculate all relevant positions for sidenav positioning

    mainColumnTop = $("#ht-tm-maincolumn").offset().top;
    mainColumnBottom = mainColumnTop + $("#ht-tm-maincolumn").outerHeight();
    sideNavTopSpace = 110; // padding-top of the side nav
    sideNavHeight = $("#ht-tm-sidenav").height();

    calculateMessagePos();
    sidenavFixedRangeStart = mainColumnTop - sideNavTopSpace;
    sidenavFixedRangeStop = mainColumnBottom + ($(window).height() - sideNavHeight - sideNavTopSpace );
  }

  function adjustSidenavState() {
    // determine if sidenav is in the range and adjust classes accordingly

    var windowTopPos = $(window).scrollTop();

    $("#scroll-top").text(windowTopPos);

    var windowBottomPos = windowTopPos + $(window).height();

    $("#scroll-bottom").text(windowBottomPos);
    if(windowTopPos < sidenavFixedRangeStart) {
      // We're in the header, and sidenav should be without extra classes
      $("#ht-tm-sidenav").removeClass("fixed").removeClass("bottom");
      $("#ht-tm-toggle-sidenav-external").removeClass("fixed").removeClass("bottom");
    } else {
      if (windowBottomPos > sidenavFixedRangeStop)  {
        // we're below threshold so it needs bottom
        $("#ht-tm-sidenav").removeClass("fixed").addClass("bottom");
        $("#ht-tm-toggle-sidenav-external").removeClass("fixed").addClass("bottom");
      } else {
        // we're within the range so we need fixed

        $("#ht-tm-sidenav").removeClass("bottom").addClass("fixed");
        $("#ht-tm-toggle-sidenav-external").removeClass("bottom").addClass("fixed");
      }
    }
  }

  function adjustMessagePositioning(){
    var windowTopPos = $(window).scrollTop();

    var navbarSpace = 54;
    if ($(window).width() < 769 ) {
      navbarSpace = 0;
    }

    if (windowTopPos > jumbotronBottom - navbarSpace) {
      $("#ht-tm-message").addClass("ht-tm-message-fixed");
    } else {
      $("#ht-tm-message").removeClass("ht-tm-message-fixed");
    }
  }


  calculatePositions();
  adjustSidenavState();

  $(window).scroll(function() {
    adjustSidenavState();
    adjustMessagePositioning();
  });

  // not sure this is even needed
  $(window).resize(function() {
    calculateMessagePos();
    adjustMessagePositioning();
  });

  window.setTimeout(calculatePositions, 1000);

  // Test to light
  // window.setTimeout(function(){
  //   $('.ht-tm-colorpicker-btn.btn-light').click();
  // }, 50);

  function togglePicker() {
    $(".ht-tm-wrapper").toggleClass("ht-tm-wrapper-pickeron");

    pickerOn = !pickerOn;
    $("#ht-tm-picker").toggleClass("active");

  }

  function toggleInspector() {
    $(".ht-tm-wrapper").toggleClass("ht-tm-wrapper-inspectoron");
    inspectorOn = !inspectorOn;
    $("#ht-tm-inspector").toggleClass("active");
  }

  $("#ht-tm-picker").click(function(){
    if(inspectorOn) {
      toggleInspector();
    }
    togglePicker();
  });

  $("#ht-disable-picker").click(function(e) {
    togglePicker();
  });

  $("#ht-tm-inspector").click(function() {
    if (pickerOn) {
      togglePicker();
    }
    toggleInspector();
  });

  $("#ht-disable-inspector").click(function(e) {
    toggleInspector();
  });

  function getStyledHTML(jQueryObject) {
    var html;
    if ($(jQueryObject).hasClass("ht-tm-element-inner")) {
      // only copy the inner html
      html = $(jQueryObject).html();
    }
    else {
      $("#ht-tm-codesample-code pre").text(
        html = $(jQueryObject).clone().removeClass("ht-tm-element").wrap("<p>").parent().html()
      );
    }

   return html_beautify(html, {
     'indent_inner_html' : true,
     'indent_size' : 2,
     'wrap_line_length' : 85,
     'end_with_newline' : true,
     'unformatted' : []

  });
  }

  $(".ht-tm-element").click(function(e) {
    if (pickerOn){
      e.preventDefault();
      if(typeof previousTooltip != "undefined") {
        previousTooltip.remove();
      }

      var elementOffset = {top: e.pageY - 30, left: e.pageX + 5};

      var newToolTip = $("#ht-tm-copied-msg").clone().appendTo("body").hide();

      previousTooltip = newToolTip;

      newToolTip.offset(elementOffset).fadeIn(500);

      setTimeout(function() {
        newToolTip.fadeOut(500);
      }, 2000);
    }

    if (inspectorOn) {
      e.preventDefault();

      $("#ht-tm-codesample-code pre").text(getStyledHTML(this));

      $('#ht-tm-codesample-code pre').each(function(i, block) {
        hljs.highlightBlock(block);
      });

      $('#ht-tm-codemodal').modal('show');
    }
  });

  new Clipboard('.ht-tm-element', {
    text: function(trigger) {
        if(pickerOn) {
          return getStyledHTML(trigger);
        }
        return null;
    }
  });

  var currentSize = "default";
  var previousSize = "default";

  $(".ht-tm-sizepicker").click(function() {
    var chosenSize = $(this).attr("data-sizepicker");

    if(chosenSize != currentSize) {

      $(".ht-tm-sizepicker").removeClass("active-size");
      $(this).addClass("active-size");

      previousSize = currentSize;
      currentSize = chosenSize;

      replaceableSizes.forEach(function(item, index, array) {
        if(currentSize === "default") {
          $(item.get("selector")).removeClass(item.get("lg")).removeClass(item.get("sm"));
        }

        if(currentSize === "sm") {
          $(item.get("selector")).removeClass(item.get("lg")).addClass(item.get("sm"));
        }

        if(currentSize === "lg") {
          $(item.get("selector")).addClass(item.get("lg")).removeClass(item.get("sm"));
        }
      });

      calculatePositions();
    }

    setTimeout(function(){
      calculatePositions();
      adjustSidenavState();
    }, 1000);

  });

  var replaceableSizes = [];

  var mapSizeBtn = new Map();
  mapSizeBtn.set ("selector", '.ht-tm-btn-replaceable .btn')
  mapSizeBtn.set ("default", '')
  mapSizeBtn.set ("sm", 'btn-sm')
  mapSizeBtn.set ("lg", 'btn-lg')
  replaceableSizes.push(mapSizeBtn);

  var mapSizeBtnGroup= new Map();
  mapSizeBtnGroup.set ("selector", '.btn-group')
  mapSizeBtnGroup.set ("default", '')
  mapSizeBtnGroup.set ("sm", 'btn-group-sm')
  mapSizeBtnGroup.set ("lg", 'btn-group-lg')
  replaceableSizes.push(mapSizeBtnGroup);

  var mapSizeBtnGroupVertical= new Map();
  mapSizeBtnGroupVertical.set ("selector", '.btn-group-vertical')
  mapSizeBtnGroupVertical.set ("default", '')
  mapSizeBtnGroupVertical.set ("sm", 'btn-group-sm')
  mapSizeBtnGroupVertical.set ("lg", 'btn-group-lg')
  replaceableSizes.push(mapSizeBtnGroupVertical);

  var mapSizeFormControl= new Map();
  mapSizeFormControl.set ("selector", '.form-control')
  mapSizeFormControl.set ("default", '')
  mapSizeFormControl.set ("sm", 'form-control-sm')
  mapSizeFormControl.set ("lg", 'form-control-lg')
  replaceableSizes.push(mapSizeFormControl);

  var mapSizePagination= new Map();
  mapSizePagination.set ("selector", '.pagination')
  mapSizePagination.set ("default", '')
  mapSizePagination.set ("sm", 'pagination-sm')
  mapSizePagination.set ("lg", 'pagination-lg')
  replaceableSizes.push(mapSizePagination);


  var currentColor = 1;
  var previousColor = 1;

  // color stuff
  // 0 = primary / default
  // 1 = secondary
  // 2 = success
  // 3 = info
  // 4 = warning
  // 5 = danger

  $(".ht-tm-colorpicker-btn").click(function() {
    var chosenColor = parseInt($(this).attr("data-colorpicker"));

    if (chosenColor != currentColor) {
      previousColor = currentColor;
      currentColor = chosenColor;

      $("[data-colorpicker='"+previousColor+"']").html("&nbsp;");
      $("[data-colorpicker='"+currentColor+"']").html('<span class="fa fa-check"></span>');

      if(currentColor == 8 && isDarkTheme == false) {
        $(".ht-tm-needs-darkness").addClass("ht-tm-darkness");
      } else if (previousColor == 8 && isDarkTheme == false) {
        $(".ht-tm-needs-darkness").removeClass("ht-tm-darkness");
      }

      if(currentColor == 7 && isDarkTheme == true) {
        $(".ht-tm-needs-darkness").addClass("ht-tm-darkness");
      } else if (previousColor == 7 && isDarkTheme == true) {
        $(".ht-tm-needs-darkness").removeClass("ht-tm-darkness");
      }


      replaceableColors.forEach(function(item, index, array) {
        var replaceWith = item.get(currentColor);
        var replaceString = item.get(previousColor);

        // double class?
        if (replaceString.indexOf(" ") >= 0) {
          var replaceStringOne = replaceString.split(" ")[0];
          var replaceStringTwo = replaceString.split(" ")[1];

          $(".ht-tm-codeblock ." + replaceStringOne + "." + replaceStringTwo).removeClass(replaceString)
            .addClass(replaceWith);

        } else {
          $(".ht-tm-codeblock ." + replaceString).removeClass(replaceString)
            .addClass(replaceWith);
        }

      });
    }
  });

  var replaceableColors = [];

  var mapColBtn = new Map();
  mapColBtn.set (1, 'btn-primary');
  mapColBtn.set (2, 'btn-secondary');
  mapColBtn.set (3, 'btn-success');
  mapColBtn.set (4, 'btn-info');
  mapColBtn.set (5, 'btn-warning');
  mapColBtn.set (6, 'btn-danger');
  mapColBtn.set (7, 'btn-dark');
  mapColBtn.set (8, 'btn-light');
  replaceableColors.push(mapColBtn);

  var mapColBtnOutline = new Map();
  mapColBtnOutline.set (1, 'btn-outline-primary');
  mapColBtnOutline.set (2, 'btn-outline-secondary');
  mapColBtnOutline.set (3, 'btn-outline-success');
  mapColBtnOutline.set (4, 'btn-outline-info');
  mapColBtnOutline.set (5, 'btn-outline-warning');
  mapColBtnOutline.set (6, 'btn-outline-danger');
  mapColBtnOutline.set (7, 'btn-outline-dark');
  mapColBtnOutline.set (8, 'btn-outline-light');
  replaceableColors.push(mapColBtnOutline);

  var mapColAlerts = new Map();
  mapColAlerts.set (1, 'alert-primary');
  mapColAlerts.set (2, 'alert-secondary');
  mapColAlerts.set (3, 'alert-success');
  mapColAlerts.set (4, 'alert-info');
  mapColAlerts.set (5, 'alert-warning');
  mapColAlerts.set (6, 'alert-danger');
  mapColAlerts.set (7, 'alert-dark');
  mapColAlerts.set (8, 'alert-light');
  replaceableColors.push(mapColAlerts);

  var mapColBadges = new Map();
  mapColBadges.set (1, 'badge-primary');
  mapColBadges.set (2, 'badge-secondary');
  mapColBadges.set (3, 'badge-success');
  mapColBadges.set (4, 'badge-info');
  mapColBadges.set (5, 'badge-warning');
  mapColBadges.set (6, 'badge-danger');
  mapColBadges.set (7, 'badge-dark');
  mapColBadges.set (8, 'badge-light');
  replaceableColors.push(mapColBadges);

  var mapColListItems = new Map();
  mapColListItems.set (1, 'list-group-item-primary');
  mapColListItems.set (2, 'list-group-item-secondary');
  mapColListItems.set (3, 'list-group-item-success');
  mapColListItems.set (4, 'list-group-item-info');
  mapColListItems.set (5, 'list-group-item-warning');
  mapColListItems.set (6, 'list-group-item-danger');
  mapColListItems.set (7, 'list-group-item-dark');
  mapColListItems.set (8, 'list-group-item-light');
  replaceableColors.push(mapColListItems);

  var mapColBgAndText = new Map();
  mapColBgAndText.set (1, 'bg-primary text-white');
  mapColBgAndText.set (2, 'bg-secondary text-dark');
  mapColBgAndText.set (3, 'bg-success text-white');
  mapColBgAndText.set (4, 'bg-info text-white');
  mapColBgAndText.set (5, 'bg-warning text-dark');
  mapColBgAndText.set (6, 'bg-danger text-white');
  mapColBgAndText.set (7, 'bg-dark text-white');
  mapColBgAndText.set (8, 'bg-light text-dark');
  replaceableColors.push(mapColBgAndText);

  var mapColNavbar = new Map();
  mapColNavbar.set (1, 'navbar-dark bg-primary');
  mapColNavbar.set (2, 'navbar-dark bg-secondary');
  mapColNavbar.set (3, 'navbar-dark bg-success');
  mapColNavbar.set (4, 'navbar-dark bg-info');
  mapColNavbar.set (5, 'navbar-light bg-warning');
  mapColNavbar.set (6, 'navbar-dark bg-danger');
  mapColNavbar.set (7, 'navbar-dark bg-dark');
  mapColNavbar.set (8, 'navbar-light bg-light');
  replaceableColors.push(mapColNavbar);



  var mapColBackgrounds = new Map();
  mapColBackgrounds.set (1, 'bg-primary');
  mapColBackgrounds.set (2, 'bg-secondary');
  mapColBackgrounds.set (3, 'bg-success');
  mapColBackgrounds.set (4, 'bg-info');
  mapColBackgrounds.set (5, 'bg-warning');
  mapColBackgrounds.set (6, 'bg-danger');
  mapColBackgrounds.set (7, 'bg-dark');
  mapColBackgrounds.set (8, 'bg-light');
  replaceableColors.push(mapColBackgrounds);


  // maybe fully exclude these?
  // var mapColText = new Map();
  // mapColText.set (1, 'text-primary');
  // mapColText.set (2, 'text-secondary');
  // mapColText.set (3, 'text-success');
  // mapColText.set (4, 'text-info');
  // mapColText.set (5, 'text-warning');
  // mapColText.set (6, 'text-danger');
  // mapColText.set (7, 'text-dark');
  // mapColText.set (8, 'text-light');
  // replaceableColors.push(mapColText);

  var mapColBorder = new Map();
  mapColBorder.set (1, 'border-primary');
  mapColBorder.set (2, 'border-secondary');
  mapColBorder.set (3, 'border-success');
  mapColBorder.set (4, 'border-info');
  mapColBorder.set (5, 'border-warning');
  mapColBorder.set (6, 'border-danger');
  mapColBorder.set (7, 'border-dark');
  mapColBorder.set (8, 'border-light');
  replaceableColors.push(mapColBorder);


  var mapColTables = new Map();
  mapColTables.set (1, 'table-primary');
  mapColTables.set (2, 'table-secondary');
  mapColTables.set (3, 'table-success');
  mapColTables.set (4, 'table-info');
  mapColTables.set (5, 'table-warning');
  mapColTables.set (6, 'table-danger');
  mapColTables.set (7, 'table-dark');
  mapColTables.set (8, 'table-light');
  replaceableColors.push(mapColTables);

});

$(function () {
  $('[data-toggle="popover"]').popover()
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})