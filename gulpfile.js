/*=============================================
Gulp startup project by Tómas Thorvardarson (@TommiTikall)
=============================================*/

// Todo:
// - Set development flag on js minification
// - Make Clean task work, to clean out dist/ folder on every build, individually
// - Add seperate watch task to initiate clean/correctly (?)
// - Investigate PostCSS and CSSWring: https://github.com/postcss/gulp-postcss
// - Consider to replace gulp-filesize with gulp-size : https://github.com/sindresorhus/gulp-size
// - Add/cleanup in tasks to let each task perform one thing, and then have one task to init build
// - Take a look at ModRewrite: https://github.com/tinganho/connect-modrewrite
// and init server, and a way to only init builds (when server is up and running):
//      - scripts : compile,minify and sourcemaps for scripts
//      - html :  compile templates
//      - sass : compile, minify and sourcemaps for css
//      - images : minify images, copy to dist


/**
*
* Gulp packages
* ==================================================================================================
*
* del                   : Delete files and folders (clean). Part of gulp
*                         https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
*
* gulp-debug            : Debug vinyl file streams to see what files are run through your gulp pipeline
* 						  https://github.com/sindresorhus/gulp-debug
*
* gulp-file-include     : Simple html partial inclusion
*                         https://github.com/coderhaoxin/gulp-file-include
*
* gulp-ruby-sass        : Compile SASS to CSS
*                         https://github.com/sindresorhus/gulp-ruby-sass
*
* gulp-minify-css       : Minify CSS
* 						  https://github.com/murphydanger/gulp-minify-css
*
* browser-sync          : Server and browser live preview
*                         http://www.browsersync.io/
*
* gulp-plumber          : Prevent pipe breaking caused by errors from gulp plugins
*                         https://github.com/floatdrop/gulp-plumber
*
* gulp-concat           : Concat files by your operating systems newLine.
* 						  It will take the base directory from the first file that passes through it.
*                         https://github.com/wearefractal/gulp-concat
*
* gulp-uglify           : Minify JavaScript with UglifyJS2
*                         https://github.com/terinjokes/gulp-uglify
*
* gulp-rename           : Rename files easily
*                         https://github.com/hparra/gulp-rename
*
* gulp-imagemin         : Minify PNG, JPEG, GIF and SVG images
*                         https://github.com/sindresorhus/gulp-imagemin
*
* imagemin-pngquant     : pngquant imagemin plugin
*                         https://github.com/imagemin/imagemin-pngquant
*
* gulp-filesize         : Show file size
*                         https://github.com/Metrime/gulp-filesize
*
* gulp-chalk            : Terminal string styling done right
*                         https://github.com/chalk/chalk
*
* gulp-svg-sprite       : Create svg sprite
*                         https://github.com/jkphl/gulp-svg-sprite
*                         https://www.liquidlight.co.uk/blog/article/creating-svg-sprites-using-gulp-and-sass/
*
**/


var gulp            = require('gulp'),
    del             = require('del'),
    debug           = require('gulp-debug'),
    fileinclude     = require('gulp-file-include'),
    sass            = require('gulp-ruby-sass'),
    minifyCss       = require('gulp-minify-css'),
    browserSync     = require('browser-sync'),
    prefix          = require('gulp-autoprefixer'),
    plumber         = require('gulp-plumber'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    rename          = require("gulp-rename"),
    imagemin        = require("gulp-imagemin"),
    pngquant        = require('imagemin-pngquant'),
    filesize        = require('gulp-filesize'),
    chalk           = require('chalk'),
    svgSprite       = require('gulp-svg-sprite');



// ===================================================
// GULP CONFIG AND SETTINGS
// ===================================================

// var plumberErrorHandler = function (err) {
//     console.log(err);
//     this.emit('end');
// };

// ==============================================
// Gulp config
// Some settings for some of the gulp plugins
// ==============================================
var gulpConfig = {
    rootFolder: '/',
    sourceFolder: 'source/',
    distFolder: 'dist/',
    bowerSource: 'bower_components/',
    vendorDist: 'dist/js/libs',
    development: true, // set to false, when building for production
    prefixerSupport: [
      'last 2 versions', '> 1%', 'ie 9', 'Android 2', 'Firefox ESR'
    ]
};

// Chalk setup
var chalkError = chalk.bold.red,
    chalkInfo = chalk.bold.green;

// ==============================================
// Bower components to keep track on the bower files to move to the js/libs folder for compiling with the main.js
// ==============================================
var bowerBundle = [
    gulpConfig.bowerSource + 'viewport-units-buggyfill/viewport-units-buggyfill.js'
];


// ===================================================
// TASKS
// ===================================================

/**
 * Delete files and folders
 * - Deletes files in the dist folder
 */
gulp.task('clean', function (cb) {
    del([ gulpConfig.distFolder + '*' ], cb);
});


// ==============================================
// Templates
// - Compiles html templates
// ==============================================
gulp.task('html', function() {
    gulp.src([gulpConfig.sourceFolder + 'html/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: gulpConfig.sourceFolder + 'html/'
        }))
        .pipe(gulp.dest(gulpConfig.distFolder));
});


// ==============================================
// Copy files task
// ==============================================
gulp.task('copy', function () {

    var copyPaths = [
        { // Fonts
            type: 'Fonts',
            from: [
                gulpConfig.sourceFolder + 'fonts/icomoon.eot',
                gulpConfig.sourceFolder + 'fonts/icomoon.svg',
                gulpConfig.sourceFolder + 'fonts/icomoon.ttf',
                gulpConfig.sourceFolder + 'fonts/icomoon.woff',
            ],
            to: gulpConfig.distFolder + 'fonts'
        },
        // Javascript bower files
        // We copy these files to the libs folder in src, to include them in the scriptFilesOrdered array when concating
        {
            type: 'Javascript',
            from: [
                gulpConfig.bowerSource + 'viewport-units-buggyfill/viewport-units-buggyfill.js',
                gulpConfig.bowerSource + 'jquery/dist/jquery.js'
            ],
            to: gulpConfig.sourceFolder + 'js/libs'
        },
        {
            type: 'html',
            from: [
                gulpConfig.sourceFolder + 'html/datahtml/*'
            ],
            to: gulpConfig.distFolder + 'datahtml'
        }
    ];

    copyPaths.forEach(function(obj) {
        console.log('Copying ' + chalk.green(obj.type) +'\nto: ' + chalk.cyan(obj.to));
        gulp.src(obj.from)
            .pipe(gulp.dest(obj.to));
    });

});


// ==============================================
// Javascript
// - Uglify
// ==============================================
gulp.task('scripts', function() {

    // Define an array with Javascript partial files, ordered correctly for concat to read
    var scriptFilesOrdered = [

        // External libraries
        gulpConfig.sourceFolder + 'js/libs/jquery.js',
        gulpConfig.sourceFolder + 'js/libs/modernizr-2.8.3.js',
        gulpConfig.sourceFolder + 'js/libs/viewport-units-buggyfill.js',
        gulpConfig.sourceFolder + 'js/libs/scrollReveal.js',
        gulpConfig.sourceFolder + 'js/libs/bigtext.js',

        // Project files
        gulpConfig.sourceFolder + 'js/partials/_utilities.js',
        gulpConfig.sourceFolder + 'js/partials/_intro.js',
        gulpConfig.sourceFolder + 'js/partials/_navigation.js',
        gulpConfig.sourceFolder + 'js/partials/_beer-gallery.js',
        gulpConfig.sourceFolder + 'js/partials/_cards.js',
        gulpConfig.sourceFolder + 'js/partials/_maps.js',
        gulpConfig.sourceFolder + 'js/partials/_images.js',
        gulpConfig.sourceFolder + 'js/main.js' // Always load main.js last
    ];

    // If development is false, minify
    if (!gulpConfig.development) {
        gulp.src(scriptFilesOrdered)
            .pipe(concat('main.js'))
            .pipe(uglify()) // Minify
            // .pipe(rename({
            //     dirname: "min",
            //     suffix: ".min",
            // }))
            .pipe(filesize())
            .pipe(gulp.dest(gulpConfig.distFolder + 'js'));
    } else {
        gulp.src(scriptFilesOrdered)
            .pipe(debug({
                title: 'Scripts-task ',
            }))
            .pipe(plumber({
                handleError: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(concat('main.js'))
            .pipe(filesize())
            .pipe(gulp.dest(gulpConfig.distFolder + 'js'));
    }
});


/**
*
* Styles
* - Compile
* - Compress/Minify
* - Autoprefixer
* - Catch errors (plumber)
*
**/
gulp.task('sass', ['icons'], function() {

    return sass(gulpConfig.sourceFolder + 'scss/main.scss', {
        // If development, output nested css
        style: gulpConfig.development ? 'nested' : 'compressed' // nested, compact, compressed
    })
    .on('error', function (err) {
        console.log(chalkError('Error!', err.message));
    })
    .pipe(prefix(gulpConfig.prefixerSupport))
    .pipe(plumber())
    .pipe(filesize())
    // .pipe(minifyCss())
    .pipe(gulp.dest(gulpConfig.distFolder + 'css'));
});


/**
 * Icons (SVG's)
 * Is called as an dependency from the 'sass' task.
 * This is so we can be sure that the sprite.scss file is
 * included in the scss folder before compiling the scss files
 */

// SVG Icons config
var svgSpriteConfig = {
    shape: {
        id: {
            generator: 'icon-%s'
        }
    },
    mode: {
        symbol : {
            prefix : 'icon-%s',
            dimensions : false,
            // sprite : '/svg-icons.svg'
            sprite : '../../../' + gulpConfig.distFolder + '/icons/icons.svg'
        }
    }
};

// Icons task
gulp.task('icons', function () {
    gulp.src(gulpConfig.sourceFolder + 'icons/**/*.svg')
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest(gulpConfig.distFolder + 'icons'));
});

gulp.task('favicons', function () {
    gulp.src(gulpConfig.sourceFolder + 'favicons/**')
        .pipe(gulp.dest(gulpConfig.distFolder + 'favicons'));
});


/**
*
* Images
* - Compress them!
*
**/
gulp.task('images', function () {
    return gulp.src(gulpConfig.sourceFolder + 'images/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(gulpConfig.distFolder + 'images'));

});

// Copy videos to dist folder
gulp.task('videos', function () {
    gulp.src(gulpConfig.sourceFolder + 'videos/**/*')
        .pipe(gulp.dest(gulpConfig.distFolder + 'videos'));

});


/**
 * Vendor
 * Copy vendor files from bower_components and eventual other places
 * The file paths are defined in the bowerBundle array
 */
gulp.task('vendor', function () {
    bowerBundle.forEach(function (filePath) {
        gulp.src(filePath)
            .pipe(gulp.dest(gulpConfig.sourceFolder + 'js/libs'));
            // .pipe(gulp.dest(gulpConfig.vendorDist));
    });

});


/**
*
* BrowserSync.io
* - Watch CSS, JS & HTML for changes
* - View project at: localhost:3000
* - Options: http://www.browsersync.io/docs/options/
**/
gulp.task('browser-sync', function() {

    // browserSync({server: gulpConfig.distFolder});

    browserSync.init([
            gulpConfig.distFolder
        ], {
        server: {
            baseDir: gulpConfig.distFolder
        },
        browser: "google chrome", // ['google chrome', 'firefox']
        notify: false,
        scrollProportionally: true
    });

});


/**
* Default task
* - Runs sass, browser-sync, scripts and image tasks
* - Watchs for file changes for images, scripts, sass/css and templates
* - Cleans out the dist folder before starting building
**/
gulp.task('default', [
        // 'clean',
        'copy',
        'icons',
        'favicons',
        'vendor',
        'html',
        'scripts',
        'images',
        'videos',
        'sass',
        'browser-sync'
    ], function () {
        gulp.watch(gulpConfig.sourceFolder + 'scss/**/*.scss', ['sass']);
        gulp.watch(gulpConfig.sourceFolder + 'js/**/*.js', ['copy', 'scripts']);
        gulp.watch(gulpConfig.sourceFolder + 'images/**/*', ['images']);
        gulp.watch(gulpConfig.sourceFolder + 'html/**/*.html', ['copy', 'html']);
        gulp.watch(gulpConfig.sourceFolder + 'icons/*.svg', ['icons']);
        gulp.watch(gulpConfig.sourceFolder + 'favicons/**', ['favicons']);
        gulp.watch(gulpConfig.bowerSource + '/**/*', ['vendor']);

        console.log(chalkInfo('Gulp watch started'));
});
