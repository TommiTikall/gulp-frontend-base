App = App || {};

/**
 * Images
 */
App.Images = (function() {
    'use strict';

    // ================================================================
    // SETUP
    // ================================================================

    // Variables
    var breakpoints = App.Utilities.breakpoints,
        dimensions = App.Utilities.dimensions,

        // Selectors for DOM elements
        selectors = {
            bigImage: '.big-image' // Example
        },

        // Object to store our DOM references
        dom = {};

    // Initilizing function (makes all things in this namespace function available and activated)
    function initialize () {
        console.log("%c%s", "color: #333; font-size: 12px; display: block; line-height: 26px;", "Images loaded");

        // Setup everything DOM related
        _setupDOM();

        _addBigImages();

    }

    /**
     * Set up DOM elements and cache references for future use
     * @return {void}
     */
    function _setupDOM () {
        dom.$body = $( document.body );
        dom.$bigImage = $( selectors.bigImage );
    }


    // ================================================================
    // Functions
    // ================================================================

    /**
     * Find all bgImages and append them to DOM on the fly.
     * This is so that big images are not loaded when not needed, e.g on smaller devices
     */
    function _addBigImages () {

        // If viewport is big enough, we load the big images
        if (dimensions.viewportWidth >= breakpoints.medium) {

            // Beer background images
            dom.$bigImage.each(function() {
                var image = {};

                image.element = $(this);
                image.url = image.element.data('big-image');

                // Load image
                image.element[0].style.backgroundImage = 'url(' + image.url + ')';

            });
        }
    }

    return {
        initialize: initialize
    };

})();
