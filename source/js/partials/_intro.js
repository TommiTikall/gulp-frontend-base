var App = App || {};

/**
 * App Intro
 */
App.Intro = (function() {
    'use strict';

    // ================================================================
    // SETUP
    // ================================================================

    var transform,
        breakpoints = App.Utilities.breakpoints,

        // Selectors for DOM elements
        selectors = {
            introBlock: '.intro-block',
            introHeader: '.intro-block__header',
            introImage: '.intro-block__image'
        },

        // Class names to toggle with js
        classNames = {},

        // introHeaderSpeed = 4.5,
        introHeaderSpeed = Math.max(window.innerHeight / 160),

        dom = {};

    function initialize () {
        _setupDOM();
        console.log("%c%s", "color: #333; font-size: 12px; display: block; line-height: 26px;", "Intro loaded");

        // If CSS3 animations are not supported,
        // trigger the javascript fallback
        if (!Modernizr.cssanimations) {
            introAnimation();
        }

        // Backstretch for the intro image
        // App.Utilities.backstretch(dom.$introBlock, dom.$introImage);

        // var element = document.querySelector( 'img' );
        // Intense( dom.$introImage[0] );
    }

    /**
     * Set up DOM (create?) elements and cache references for future use
     * @return {void}
     */
    function _setupDOM () {
        dom.$body = $( document.body );

        // Elements
        dom.$introBlock = $( selectors.introBlock, dom.$body );
        dom.$introHeader = $( selectors.introHeader, dom.$body );
        dom.$introImage = $( selectors.introImage, dom.$body );
    }


    // ================================================================
    // Functions
    // ================================================================

    // Javascript fallback for CSS intro animation
    function introAnimation () {
        var animationsSpeed = 2000,
            animationDelay = 1500,
            introAnimationElement = $('.intro-animation', dom.$introHeader);

            introAnimationElement.css('opacity', 0);

            $('.first', dom.$introHeader).delay(animationDelay).animate({'opacity': 1}, animationsSpeed);
            animationDelay = animationDelay + 1000;
            $('.second', dom.$introHeader).delay(animationDelay).animate({'opacity': 1}, animationsSpeed);
            animationDelay = animationDelay + 1000;
            $('.third', dom.$introHeader).delay(animationDelay).animate({'opacity': 1}, animationsSpeed);
            animationDelay = animationDelay + 1000;
            $('.fourth', dom.$introHeader).delay(animationDelay).animate({'opacity': 1}, animationsSpeed);
            animationDelay = animationDelay + 1000;
            $('.fifth', dom.$introHeader).delay(animationDelay).animate({'opacity': 1}, animationsSpeed);
    }

    // Intro animation
    function introScrollAnimation () {
        // Apply CSS transformation
        if (window.pageYOffset <= window.innerHeight && window.innerWidth >= breakpoints.large) {
            dom.$introHeader.css({
                'opacity' : (1-(window.pageYOffset/100)/6).toFixed(2)
            });
        }
    }

    return {
        initialize: initialize,
        introScrollAnimation: introScrollAnimation
    };

})();
