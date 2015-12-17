var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var del = require('del');
var Server = require('karma').Server;

var paths = {
  scripts: [
    'ui/cameraUtils.js',
    'ui/config.js',
    'ui/appState.js',
    'ui/shmileStateMachine.js',
    'ui/stateMachineEventHandler.js',
    'ui/cameraUtils.js',
    'ui/socketProxy.js',
    'ui/socketLayer.js',
    'ui/photoView.js',
    'ui/buttonView.js',
    'ui/shmile.js'
  ],
	tests: [
		'test/**/*Spec.js'
	],
  styles: [
    "css/shmile.css"
  ]
};

gulp.task("watch", function() {
  gulp.watch(paths.scripts, ['test']);
	gulp.watch(paths.tests, ['test']);
});

gulp.task("clean", function(cb) {
  del(['build'], cb);
});

gulp.task('test', function(done) {
	file = __dirname + '/karma.conf.js'
  new Server({
    configFile: file,
    singleRun: true
  }, done).start();
});

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
