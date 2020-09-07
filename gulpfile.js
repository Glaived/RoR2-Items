const { series, parallel } = require('gulp')
const browserSync = require('browser-sync').create()

function server(cb) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })

  cb()
}

exports.default = server
exports.server = server
