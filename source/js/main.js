var App = App || {};

/**
 * App Main
 */
App.Main = (function() {
    'use strict';

    // ================================================================
    // SETUP
    // ================================================================

    // Selectors for DOM elements
    var selectors = {
        pageHeader: '.page-header',
        gridToggle: '.grid-toggle',
        scrollToLink: '.scroll-to',
        mainNavTrigger: 'main-nav__trigger',
        coverImageParent: '.intro-block'
    },

    // Class names to toggle with js
    classNames = {
        showGrid: 'show-grid',
        noScroll: 'no-scroll',
        visible: 'visible',
        hidden: 'hidden',
        pageHeaderSolid: 'alternative',
    },

    // Shorthand mapping for App.Utilities
    breakpoints = App.Utilities.breakpoints,
    setDimensions = App.Utilities.setDimensions, // function to update viewport object
    dimensions = App.Utilities.dimensions, // the dimensions object. use this to read from
    scrollToElement = App.Utilities.scrollToElement,

    // Nav trigger Y Offset
    navTriggerOffset = null,
    currentScroll = 0,
    didScroll,
    lastScrollTop = 0,
    delta = 5,
    pageHeaderHeight = $('.page-header').outerHeight(),


    // Store cached references to DOM elements
    // that will be used over and over again
    dom = {};

    /**
     * Initialize function
     * @return {void}
     */
    function initialize () {
        console.log("%c%s", "color: #333; font-size: 12px; display: block; line-height: 26px;", "Main loaded");

        // viewport-units-buggyfill initialization
        viewportUnitsBuggyfill.init();

        // Set up DOM and cache references
        _setupDOM();

        // Add event listeners
        _addEventListeners();

        // Set initial variables for screen size
        _windowResize();

        // Initialize background cover image
        // App.Utilities.backgroundCover( $(selectors.coverImageParent) );
    }

    /**
     * Set up DOM (create?) elements and cache references for future use
     * @return {void}
     */
    function _setupDOM() {
        dom.$body = $( document.body );

        // Elements
        dom.$html = $( 'html' );
        dom.$pageHeader = $ ( selectors.pageHeader, dom.$body );
        dom.$gridToggle = $( selectors.gridToggle, dom.$body );
        dom.$scrollToLink = $( selectors.scrollToLink, dom.$body );
        dom.$mainNavTrigger = $( selectors.mainNavTrigger, dom.$body );
        dom.$coverImageParent = $( selectors.coverImageParent, dom.$body );
    }

    /**
    * Attach event listeners to DOM elements
    */
    function _addEventListeners () {
        dom.$gridToggle.on('click', _toggleGrid);
        dom.$scrollToLink.on('click', scrollToElement);
        document.onkeypress = keyPress;
        document.onkeydown = keyDown;
        window.addEventListener('scroll', _pageScroll);
        window.addEventListener('resize', _windowResize);
    }


    // ================================================================
    // Functions
    // ================================================================

    /**
     * Window resize
     * Alters some variables depending on the viewport size
     */
    function _windowResize () {

        // Update the global viewport variables
        setDimensions();

        // Set the navtriggeroffset if viewport dimensions change
        navTriggerOffset = window.innerHeight + 50;

        // Add orientation classes to html tag
        var orientationClasses = {
            landscape: 'orientation-landscape',
            portrait: 'orientation-portrait',
            square: 'orientation-square'
        };

        if (dimensions.viewportWidth === dimensions.viewportHeight) {
            // orientation-square
            if (!dom.$html.hasClass('orientation-square')) {
                dom.$html.removeClass('orientation-landscape orientation-portrait').addClass('orientation-square');
            }
        } else if (dimensions.viewportWidth < dimensions.viewportHeight) {
            // orientation-portrait
            if (!dom.$html.hasClass('orientation-portrait')) {
                dom.$html.removeClass('orientation-landscape orientation-square').addClass('orientation-portrait');
            }
        } else if (dimensions.viewportWidth > dimensions.viewportHeight) {
            // orientation-landscape
            if (!dom.$html.hasClass('orientation-landscape')) {
                dom.$html.removeClass('orientation-portrait orientation-square').addClass('orientation-landscape');
            }
        }
    }

    /**
     * Page scroll
     * Reacts to page scroll events
     * This is a global listener for all scroll functions
     */

    var _pageScroll = function () {

        didScroll = true;
        // _hasScrolled();

        // Update scroll position
        currentScroll = window.pageYOffset;

        // Intro scroll, fades out when scrolling
        // App.Intro.introScrollAnimation();

        // Trigger alternative header state
        if ( window.pageYOffset > navTriggerOffset ) {
            dom.$body.addClass( classNames.pageHeaderSolid );
        } else {
            dom.$body.removeClass( classNames.pageHeaderSolid );
        }


    };

    /**
     * Hide/show pageheader on scroll
     * Inspired by: https://github.com/alexcican/lab/tree/gh-pages/teehan_lax_navigation
     * @return {void}
     */

     setInterval(function() {
         if (didScroll) {
             _hasScrolled();
             didScroll = false;
         }
     }, 250);

    var _hasScrolled = function () {
        // didScroll = false;

        var st = currentScroll;

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta) {
            return;
        }

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        // if (st > lastScrollTop && st > (navTriggerOffset+dom.$pageHeader.outerHeight())) {
        // if (st > lastScrollTop && st > (navTriggerOffset/2)) {
        if (st > lastScrollTop && st > dom.$pageHeader.outerHeight() + 100) {
            // Scroll Down
            dom.$pageHeader.removeClass( classNames.visible ).addClass( classNames.hidden );

            if (currentScroll >= navTriggerOffset) {
                dom.$pageHeader.addClass( classNames.pageHeaderSolid );
            }
        } else {
            // Scroll Up

            if (st + $(window).height() < $(document).height()) {
                dom.$pageHeader.removeClass( classNames.hidden ).addClass( classNames.visible );
            } if (currentScroll < navTriggerOffset) {
                dom.$pageHeader.removeClass( classNames.pageHeaderSolid );
            }
        }

        lastScrollTop = st;
    };



    /**
     * Key press handler
     * @param  {event} e The key press event object
     * This is a global listener for all key event functions
     */
    function keyPress (e) {
        var evtObj = window.event ? event : e;

        // If ctrl/alt + g is pressed, toggle grid
        if (evtObj.keyCode === 7 || event.keyCode === 169) {
            _toggleGrid();
        }


    }

    function keyDown (e) {
        var evtObj = window.event ? event : e;

        // Close overlays
        if (evtObj.keyCode == 27 || event.keyCode == 27) {
            console.log('Escape!!');
            console.log($('html').hasClass('main-nav-open'));
            if ($('html').hasClass('main-nav-open')) {
                App.Navigation._hideOverlay();
            }
        }
    }

    /**
     * Toggle grid
     */
    function _toggleGrid () {
        dom.$body.toggleClass(classNames.showGrid);
    }

    ////////////////
    // Public API //
    ////////////////

    return {
        initialize: initialize
    };

})();

// Init all partials
// Needs to be added to gulpfile as well, in [scriptFilesOrdered]
$(document).ready(function() {
    App.Utilities.initialize();
    App.Intro.initialize();
    App.Navigation.initialize();
    App.Images.initialize();

    // Loads last
    App.Main.initialize();
});
