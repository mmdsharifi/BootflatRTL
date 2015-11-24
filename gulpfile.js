var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'), // Add browser syns plugin
    bower = require('gulp-bower');

var config = {
        sassPath: './resources/sass',
        bowerDir: './bower_components'
    }
    // create a task to do bower install
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

// Copy js files to public folder
gulp.task('js', function() {
    return gulp.src([config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            config.bowerDir + '/jquery/dist/jquery.min.js'
        ])
        .pipe(gulp.dest('./public/js'));
});

// Copy fontawesome icons to public/fonts folder
gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('css', function() {
    return sass(config.sassPath + '/style.scss', { // Our coustom sass
            style: 'compressed', // minify css
            loadPath: [ // load paths to easy use import in resources/sass
                './resources/sass',
                config.bowerDir + '/bootstrap-sass/assets/stylesheets', // bootstrap sass files
                config.bowerDir + '/font-awesome/scss' // awesome icons sass files
            ]
        })
        .on('error', notify.onError(function(error) {
            return 'Error: ' + error.message;
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Add browserSync task
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

// Rerun the task when a file changes
// Run this task : gulp watch

gulp.task('watch', ['css', 'browserSync'], function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    browserSync.watch("./*.html").on("change", browserSync.reload); // browserSync watch task
});

// Run this task : gulp
// OR gulp default
gulp.task('default', ['bower', 'icons', 'css', 'js']);
