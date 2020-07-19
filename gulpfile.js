const {src, dest, watch, parallel, series}  = require('gulp');

const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const cleancss      = require('gulp-clean-css');
const ttf2woff      = require('gulp-ttf2woff');
const ttf2woff2     = require('gulp-ttf2woff2');
const fonter        = require('gulp-fonter');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const cssmediagroup   = require('gulp-group-css-media-queries');

const src_directory = 'src';
const dist_directory = 'dist';

const path = {
  src: {
    scripts: [
      'node_modules/swiper/swiper-bundle.min.js',
      src_directory + '/js/main.js'
    ],
    styles: [
      src_directory + '/scss/style.scss'
    ],
    fonts: src_directory + '/fonts/',
    html: src_directory + '/index.html',
    images: src_directory + '/img/*'
  },
  dist: {
    scripts: dist_directory + '/js/',
    styles:  dist_directory + '/css/',
    fonts:   dist_directory + '/fonts/',
    html:    dist_directory,
    images:  dist_directory + '/img'
  }
}

const images = () => {
  return src(path.src.images)
         .pipe(imagemin())
         .pipe(dest(path.dist.images));
}
const fonts = () => {
  src(path.src.fonts + '/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(dest(path.dist.fonts));

  return src(path.src.fonts + '/**/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest(path.dist.fonts));
}

const otf2ttf = () => {
  return src(path.src.fonts + '/**/*.otf')
          .pipe(fonter({
            formats: ['ttf']
          }))
          .pipe(dest(path.src.fonts));
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
  .pipe(cssmediagroup())
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


const clean = () => {
  return del(dist_directory);
}

const createFolders = () => {
  return src('*.*', {read: false})
          .pipe(dest(dist_directory))
          .pipe(dest(dist_directory + '/css'))
          .pipe(dest(dist_directory + '/js'))
          .pipe(dest(dist_directory + '/fonts'))
          .pipe(dest(dist_directory + '/img'))
}

exports.createFolders = createFolders;
exports.clean         = clean;
exports.images        = images;
exports.otf2ttf       = otf2ttf;
exports.fonts         = fonts;
exports.watchScripts  = watchScripts;
exports.watchStyles   = watchStyles;
exports.watchHtml     = watchHtml;
exports.watchAll      = watchAll;
exports.html          = html;
exports.scripts       = scripts;
exports.styles        = styles;
exports.browsersync   = browsersync;

exports.default       = series(clean, createFolders, fonts, images, html, parallel(styles, scripts, browsersync, watchAll));