var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    eslint = require('gulp-eslint'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var lint = function () {
    var src = resolve(config.lint.included);

    _.each(resolve(config.lint.excluded), function(item){
        src.push('!' + item);
    });

    gulp.src(src)
        .pipe(eslint())
        .pipe(eslint.format());
};

var lintTask = function () {
    Logger.heading('JS Lint');
    Logger.message('linting ...');
    return lint();
};

var task = function (configFile) {
    config = configFile;

    return lintTask;
};

module.exports = task;