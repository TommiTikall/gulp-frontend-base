var App = App || {};

/**
 * App Utilities
 * Collection of global functions and configuration/settings objects to be used anywhere in the application
 *
 * Global Objects:
 * ----------------------------
 * breakpoints [global]: Exposes the breakpoints associated with the css
 * dimensions [global]: Exposes some variables for viewport and client dimensions
 *
 * Functions:
 * ----------------------------
 * setDimensions() [global]: sets values in the dimensions object.
 * callers:
 * - main.js - onResize()
 *
 * backgroundCover() [global]: Loads a data-src attribute image in parent container
 */
App.Utilities = (function() {
    'use strict';

    // ================================================================
    // SETUP
    // ================================================================

    // Breakpoints
    var breakpoints = {
        small       : 480,
        medium      : 768,
        large       : 1020,
        xLarge      : 1200,
        xxLarge     : 1440,
        xxxLarge    : 1600,
        mega        : 2000
    },

    selectors = {
        pageHeader: '.page-header',
        coverImage: '.intro-block__image'
    },

    classNames = {
        noScroll: 'no-scroll',
        persistentScroll: 'persistent-scroll'
    },

    // Global object for viewport and client dimensions
    dimensions = {
        viewportHeight: null,
        viewportWidth: null,
        documentHeight: null,
        documentWidth: null,
        touch: null
    },

    supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints,
    isTouchDevice = 'ontouchstart' in document.documentElement,

    // Modernizr object to store the most used checks
    support = {
        cssTransitions: Modernizr.csstransitions,
        cssTransforms: Modernizr.csstransforms,
        cssTransforms3d : Modernizr.csstransforms3d,
        cssAnimations: Modernizr.cssanimations,
        touch: Modernizr.touch,
        isTouchDevice: 'ontouchstart' in document.documentElement
    };

    function initialize () {
        console.log("%c%s", "color: #333; font-size: 12px; display: block; line-height: 26px;", "Utilities loaded");

        // Check support
        addSupportClasses();

        // Set initial viewport dimensions
        setDimensions();
    }


    // ================================================================
    // Functions
    // ================================================================

    /**
     * Check support and add values to html as classes, if supported
     * @return {void}
     */
    function addSupportClasses () {

        // console.log(support.cssTransitions);

        // Loop through support object and add true values as classes to <html>
        for (var k in support){
            if (support.hasOwnProperty(k)) {
                if (support[k] === true) { // if true, add key name as class
                    // alert(k.toString().toLowerCase());
                    $('html').addClass(k.toString().toLowerCase());
                }
            }
        }
    }

    // Set viewport dimensions to global object variable
    function setDimensions () {
        dimensions.viewportHeight = window.innerHeight;
        dimensions.viewportWidth = window.innerWidth;
        dimensions.documentHeight = document.body.scrollHeight;
        dimensions.documentWidth = document.body.scrollWidth;
    }

    // Background cover image
    function backgroundCover ($parent) {
        var $image = $parent.find( selectors.coverImage );
        $parent.css({
            'background-image': 'url('+$image.attr("src")+')'
        });
        $image.remove();
    }

    /**
     * Debounce
     * David Walsh article: http://davidwalsh.name/essential-javascript-functions
     *
     * Throttles callback function to frequently-firing events
     * @param  {function} func          The function to debounce
     * @param  {integer} wait           Time in ms, to set the timeout for next function callback
     * @param  {[type]} immediate       If "immediate" is passed, trigger the function on the leading edge, instead of the trailing
     *
     * Usage:
     * var myFunction = debounce(function() {
     *   // All the taxing stuff you do
     * }, 250);
     */
     function debounce (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Get offset for an html element
    function getOffset (el) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }


    /**
     * Disable Scroll on specific key events
     */
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    // Disable scroll
    function disableScroll() {
      if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', preventDefault, false);
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove  = preventDefault; // mobile
      document.onkeydown  = preventDefaultForScrollKeys;
    }

    // Enable scroll
    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }

    /**
     * Scroll from current position to a given element
     * This takes in account the height of the page header
     * @param  {event} e [the event (where we get our element)]
     * @return false
     */
    function scrollToElement (e) {
        e.preventDefault();

        var $this = $(e.target),
            href = $this.attr("href"),
            topY = $(href).offset().top;

        TweenMax.to($(window), 0.7, {
            scrollTo: {
               y: topY,
               autoKill: false,
               force3D: true
            },
            ease:Power3.easeOut
        });

        return false;
    }



    /**
     * Lock body scroll, activate scroll on element
     * @param  {element selector} scrollingElementSelector [jquery object, class, id or other selector, to identify element]
     * @return {void}
     */
    function disableBodyScroll ($scrollingElement) {

        // Disable scroll on <body>
        $('body').addClass( classNames.noScroll );

        // If element is applied
        if ($scrollingElement) {

            // Wrap element in jQuery
            if ($scrollingElement instanceof jQuery) {
                // LOL
            } else {
                $scrollingElement = $($scrollingElement);
            }

            // Apply persistent scroll to element
            $scrollingElement.css({
                'overflow': 'scroll!important',
                '-webkit-overflow-scroll': 'touch!important'
            });

        }
    }

    function enableBodyScroll () {
        // Disable scroll on <body>
        $('body').removeClass( classNames.noScroll );
    }


    ////////////////
    // Public API //
    ////////////////

    return {
        initialize: initialize,
        breakpoints: breakpoints,
        dimensions: dimensions,
        setDimensions: setDimensions,
        addSupportClasses: addSupportClasses,
        // isTouchDevice: isTouchDevice,
        backgroundCover: backgroundCover,
        debounce: debounce,
        getOffset: getOffset,
        disableScroll: disableScroll,
        enableScroll: enableScroll,
        scrollToElement: scrollToElement,
        disableBodyScroll: disableBodyScroll,
        enableBodyScroll: enableBodyScroll
    };

})();
