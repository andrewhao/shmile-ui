var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var del = require('del');

var paths = {
  scripts: [
    'ui/cameraUtils.js',
    'ui/config.js',
    'ui/appState.js',
    'ui/shmileStateMachine.js',
    'ui/cameraUtils.js',
    'ui/socketProxy.js',
    'ui/socketLayer.js',
    'ui/photoView.js',
    'ui/buttonView.js',
    'ui/shmile.js'
  ],
  styles: [
    "css/shmile.css"
  ]
};

gulp.task("watch", function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task("clean", function(cb) {
  del(['build'], cb);
})

gulp.task('scripts', ['clean'], function() {
  gulp.src(paths.styles)
    .pipe(gulp.dest('build/css'))
    .pipe(concat('shmile-ui.css'));
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(concat('shmile-ui.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("../maps"))
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest('build/js'));
});

gulp.task("default", ['scripts'])
