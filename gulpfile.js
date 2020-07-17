const {src, dest, watch, parallel, series}  = require('gulp');

const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const cleancss      = require('gulp-clean-css');

const src_directory = 'src';
const dist_directory = 'dist';

const path = {
  src: {
    scripts: [
      src_directory + '/js/main.js'
    ],
    styles: [
      src_directory + '/scss/style.scss'
    ],
    html: src_directory + '/index.html'
  },
  dist: {
    scripts: dist_directory + '/js/',
    styles:  dist_directory + '/css/',
    html:    dist_directory
  }
}

const browsersync = () => {
  return browserSync.init({
    server: {
      baseDir: 'dist',
      notify: false,
      online: false
    }
  })
}

const html = () => {
  return src(path.src.html)
  .pipe(dest(path.dist.html))
  .pipe(browserSync.stream())
}

const scripts = () => {
  return src(path.src.scripts)
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest(path.dist.scripts))
  .pipe(browserSync.stream())
}

const styles = () => {
  return src(path.src.styles)
  .pipe(sass())
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
  }))
  .pipe(cleancss({
    level: {
      1: {
        specialsComments: 0
      }    
    },
    /*format: 'beautify'*/
  }))
  .pipe(dest(path.dist.styles))
  .pipe(browserSync.stream())
}

const watchHtml = () => {
  watch(src_directory + '/**/*.html', html);
}
const watchScripts = () => {
  watch(path.src.scripts, scripts);
}

const watchStyles = () => {
  watch(src_directory + '/scss/**/*.scss', styles);
}

const watchAll = () => {
  watchScripts();
  watchStyles();
  watchHtml();
}


exports.watchScripts = watchScripts;
exports.watchStyles  = watchStyles;
exports.watchHtml    = watchHtml;
exports.watchAll     = watchAll;
exports.html         = html;
exports.scripts      = scripts;
exports.styles       = styles;
exports.browsersync  = browsersync;

exports.build        = series(html, parallel(styles, scripts, browsersync, watchAll));
