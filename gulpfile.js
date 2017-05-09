/* global require */

var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var gulpFilter = require('gulp-filter');
var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');
var webserver = require('gulp-webserver');

var lintPathsJS = [
    'static/js/*.js',
    'gulpfile.js'
];

var lintPathsCSS = [
    'static/css/*.css'
];

gulp.task('js:lint', () => {
    return gulp.src(lintPathsJS)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('css:lint', () => {
    return gulp.src(lintPathsCSS)
        .pipe(stylelint({
            reporters: [{ formatter: 'string', console: true}]
        }));
});

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            host: 'localhost',
            port: '8080',
            path: '/'
        }));
});

gulp.task('bower', function(){
    var filterJS = gulpFilter('**/*.js', { restore: true });
    var filterCSS = gulpFilter('**/*.css', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(cleanCSS())
        .pipe(filterCSS.restore)
        .pipe(gulp.dest('./static/lib'));
});

gulp.task('build', function() {
    gulp.start('bower');
});

gulp.task('test', function() {
    gulp.start('js:lint');
    gulp.start('css:lint');
});

gulp.task('run', function() {
    gulp.start('webserver');
});

gulp.task('default', ['build', 'test', 'run']);
