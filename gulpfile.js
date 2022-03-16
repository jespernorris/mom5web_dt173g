const {src, dest, watch, series, parallel} = require('gulp');
const concat = require('gulp-concat'); // Slå ihop filer
const terser = require('gulp-terser').default; // Komprimera JS
const cleanCSS = require('gulp-clean-css'); // Komprimera CSS
const htmlmin = require('gulp-htmlmin'); // Komprimera HTML
const sourcemaps = require('gulp-sourcemaps'); // Kartlägger kod
const autoprefixer = require('gulp-autoprefixer'); // Stöd för fler webbläsare
const sass = require('gulp-sass')(require('sass'));

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    sassPath: "src/style/*.scss",
    jsPath: "src/js/*.js"
}

// HTML-task, kopierar filer
function htmlTask() {
    return src(files.htmlPath)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub'))
}

// JS-task, konkatenera filer
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'))
}

// Sass-task, förvandlar till css, konkatenerar ihop till main.css och komprimerar
function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/style'))
}

// Watch
function watchTask() {
    watch([files.htmlPath, files.jsPath, files.sassPath], parallel(htmlTask, jsTask, sassTask));
}

exports.default = series(
    parallel(htmlTask, jsTask, sassTask),
    watchTask
);