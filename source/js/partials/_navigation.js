var App = App || {};

/**
 * App Navigation
 */
App.Navigation = (function() {
    'use strict';

    // ================================================================
    // SETUP
    // ================================================================

    // Selectors for DOM elements
    var selectors = {
        mainNavTrigger: '.main-nav__trigger',
        navigationOverlay : '.navigation-overlay',
        navText: '.main-nav__text',
        navIcon: '.main-nav__icon',
        introBlockImage: '.intro-block__image',
        overlayBackgroundImage: '.overlay__media',
        languageChooser: '.language-chooser'
    },

    // Class names to toggle with js
    classNames = {
        noScroll : 'no-scroll',
        visible : 'visible',
        hidden: 'hidden',
        mainNavOpen: 'main-nav-open',
        alternative: 'alternative',
        active: 'active',
        langNavOpen: 'lang-nav-open'
    },

    // Shorthand mapping for App.Utilities
    enableScroll = App.Utilities.enableScroll, // function
    disableScroll = App.Utilities.disableScroll, // function
    dimensions = App.Utilities.dimensions, // the dimensions object. use this to read from
    navIsOpen = false,
    langNavOpen = false,

    dom = {};


    function initialize () {
        console.log("%c%s", "color: #333; font-size: 12px; display: block; line-height: 26px;", "Navigation loaded");

        _setupDOM();
        _addEventListeners();

        // Append cloned image to the main navigation background
        dom.$navigationOverlay.prepend(dom.$introBlockImage.clone());
    }

    function _setupDOM () {
        dom.$document = $( 'html' );
        dom.$body = $( document.body );
        dom.$mainNavTrigger = $( selectors.mainNavTrigger, dom.$body );
        dom.$navText = $( selectors.navText );
        dom.$navIcon = $( selectors.navIcon, dom.$body );
        dom.$navigationOverlay = $( selectors.navigationOverlay, dom.$body );
        dom.$introBlockImage = $( selectors.introBlockImage, dom.$body );
        dom.$overlayBackgroundImage = $( selectors.overlayBackgroundImage, dom.$body );
        dom.$languageChooser = $( selectors.languageChooser, dom.$body);
    }

    /**
    * Attach event listeners to DOM elements
    */
    function _addEventListeners () {
        dom.$mainNavTrigger.on( 'click', _toggleNavigation );
        dom.$languageChooser.on( 'click', _toggleLanguageChooser );
    }


    // ================================================================
    // Functions
    // ================================================================

    /**
     * Event handler for 'click' on main navigation trigger
     * @param  {object} event event object
     * @return {void}
     */
    function _toggleNavigation () {

        // If lang navigation is active, shut it down
        if (langNavOpen) {
            dom.$document.removeClass( classNames.langNavOpen );
            langNavOpen = false;
        }

        // Check main navigation status before proceeding
        if (!navIsOpen) {
            navIsOpen = true;
            _showNavigation();
        } else {
            navIsOpen = false;
            _hideNavigation();
        }
    }

    /**
     * Event handler for 'click' on language chooser navigation
     * @param  {event} e
     * @return {void}
     */
    function _toggleLanguageChooser (e) {
        e.stopPropagation();

        // Check status
        if (!langNavOpen) {
            langNavOpen = true;
            dom.$document.addClass( classNames.langNavOpen );
        } else {
            langNavOpen = false;
            dom.$document.removeClass( classNames.langNavOpen );
        }

        // Toggle class on language navigation
        // dom.$languageChooser.toggleClass(classNames.active);
    }

    /**
     * Show main navigation
     * @return {void}
     */
    function _showNavigation () {
        dom.$navIcon.attr('class', 'nav-open open');
        dom.$document.addClass( classNames.mainNavOpen );
        disableScroll();
        dom.$navigationOverlay.addClass( classNames.visible ).css({ width: dimensions.width, height: dimensions.height });
        dom.$navigationOverlay.removeClass( classNames.hidden );
    }

    /**
     * Show main navigation
     * @return {void}
     */
    function _hideNavigation () {
        dom.$navIcon.attr('class', 'nav-open');
        dom.$document.removeClass( classNames.mainNavOpen );
        enableScroll();
        dom.$navigationOverlay.addClass( classNames.hidden );
        dom.$navigationOverlay.removeClass( classNames.visible );
    }

    return {
        initialize: initialize,
        _hideNavigation: _hideNavigation
    };

})();
