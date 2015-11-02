var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    eslint = require('gulp-eslint'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var lint = function () {
    gulp.src(resolve(config.lint))
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