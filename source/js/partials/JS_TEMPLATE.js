App = App || {};

/**
 * App JS template
 */
App.JsTemplate = (function() {
    'use strict';

    // ================================================================
    // SETUP
    // ================================================================

    // Variables
    var breakpoints = App.Utilities.breakpoints,
        viewport = App.Utilities.viewport,

        // Selectors for DOM elements
        selectors = {
            submitButton: '.submit-button' // Example
        },

        // Class names to toggle with js
        classNames = {
            noScroll: 'no-scroll',
            active: 'active' // Example
        },

        // Object to store our DOM references
        dom = {};

    // Initilizing function (makes all things in this namespace function available and activated)
    function initialize () {

        // Setup everything DOM related
        _setupDOM();

        // Add event listeners
        _addEventListeners();

    }

    /**
     * Set up DOM elements and cache references for future use
     * @return {void}
     */
    function _setupDOM () {
        dom.$body = $( document.body );

        // Elements
        dom.$submit = $( selectors.submitButton, dom.$body ); // Example
    }

    /**
    * Attach event listeners to DOM elements
    */
    function _addEventListeners () {
        dom.$gridToggle.on('click', _toggleGrid); // Example of DOM element interaction
        document.onkeypress = keyPress; // Example
        window.addEventListener('scroll', _pageScroll); // Example
        window.addEventListener('resize', _windowResize); // Example
    }


    // ================================================================
    // Functions
    // ================================================================

    function _windowResize () {
        // Will be called when window is resized,
        // and is initialized in the _addEventListeners function
    }

    function _pageScroll () {
        // Will be called when window is resized,
        // and is initialized in the _pageScroll function
    }

    return {
        initialize: initialize
    };

})();
