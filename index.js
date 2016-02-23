var gulp = require('gulp'),
    sass = require('./tasks/sass'),
    watch = require('./tasks/watch'),
    lint = require('./tasks/lint'),
    vendor = require('./tasks/vendor'),
    copy = require('./tasks/copy'),
    styles = require('./tasks/styles'),
    scripts = require('./tasks/scripts'),
    cacheBust = require('./tasks/cacheBust'),
    clean = require('./tasks/clean'),
    assetConfig = require('./Config'),
    runSequence = require('run-sequence');

gulp.task('lint', lint(assetConfig));
gulp.task('vendor', vendor(assetConfig));
gulp.task('copy', copy(assetConfig));
gulp.task('clean', clean(assetConfig));
gulp.task('sass', sass(assetConfig));
gulp.task('styles', styles(assetConfig));
gulp.task('scripts', scripts(assetConfig));
gulp.task('cacheBust', cacheBust(assetConfig));

gulp.task('watch', watch(assetConfig));

gulp.task('build', ['clean'], function () {
    runSequence('lint', 'sass', 'styles', 'scripts', 'copy', 'cacheBust');
});
