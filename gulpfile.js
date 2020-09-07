/*
 * If you want a livereload for gulpfile, or browserSync config, use the following command:
 * npx nodemon -w ./{gulpfile,bs-config}.js -x "gulp {TASKNAME}"
 */

const { gulp, watch, src, dest, series, parallel } = require('gulp'),
      chalk        = require('chalk'),
      moment       = require('moment'),
      path         = require('path'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS     = require('gulp-clean-css'),
      print        = require('gulp-print').default,
      rename       = require('gulp-rename'),
      uglify       = require('gulp-uglify-es').default,
      browserSync  = require('browser-sync').create()

// Loads the browserSync configuration
var browserSyncConfig = require('./bs-config.js')

// Chalk color
const debug      = chalk.blueBright
const info       = chalk.green
const warn       = chalk.yellow
const error      = chalk.red.bold

const gulpTime  = chalk.gray
const gulpDelay = chalk.magenta

/**
 * Helper to respect Gulp's console display
 */
const log = (...vars) => {
  console.log(`[${gulpTime(moment().format('HH:mm:ss'))}]`, ...vars)
}

/**
 * Launches the web server via browserSync
 */
const server = (cb) => {
  /**
   * Temporary fix to force local use only
   * https://github.com/BrowserSync/browser-sync/issues/1691
   * @type {Object}
   */
  browserSyncConfig = {...browserSyncConfig, ...{ listen: 'localhost' }}

  browserSync.init(browserSyncConfig)

  watch(['./css/*.css', '!**/*.min.css'], css)
  watch(['./js/*.js', '!**/*.min.js'], js)
  watch('index.html').on('change', browserSync.reload)

  cb()
}

/**
 * Prefix & minify CSS Files
 */
const css = (cb) => {
  return src(['./css/*.css', '!**/*.min.css'])
    .pipe(print(filepath => `built: ${filepath}`))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ debug: true }, (details) => {
      log(`― ${debug(details.stats.originalSize + ' byte(s)')} => ${debug(details.stats.minifiedSize + ' byte(s)')}`)
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./css'))
}

/**
 * Minify JS Files
 */
const js = (cb) => {
  return src(['./js/*.js', '!**/*.min.js'])
    .pipe(print(filepath => `built: ${filepath}`))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./js'))
}

// const dump = (cb) => {
//   return src(['./dump/*.json'])
//     .pipe()
// }

exports.default = series(parallel(css, js), server)

exports.server = server
exports.css    = css
exports.js     = js
// exports.dump   = dump
