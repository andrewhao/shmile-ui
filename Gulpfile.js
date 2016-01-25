var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var Server = require('karma').Server;

var paths = {
	tests: [
		'test/**/*Spec.js'
	]
};

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

gulp.task("default", ['test'])
