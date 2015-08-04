var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    plumber   = require('gulp-plumber'),
    webserver = require('gulp-webserver'),
    opn       = require('opn');

var tinylr;

gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

var server = {
  host: '0.0.0.0',
  port: '8001'
}

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('styles', function() {
      return gulp.src('public/css/*.scss')
        .pipe(plumber())
        .pipe(sass({ style: 'expanded' }))
        .pipe(gulp.dest('public/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css/'));
});

gulp.task('webserver', function() {
  gulp.src( 'public/.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      directoryListing: false
    }));
});

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port );
});

gulp.task('watch', function() {
  gulp.watch('public/css/*.scss', ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('public/css/*.css', notifyLiveReload);
});

gulp.task('default', ['styles', 'livereload', 'watch', 'webserver', 'openbrowser'], function() {

});