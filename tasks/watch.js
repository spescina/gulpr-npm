var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var getSass = function () {
    var sassFiles = [];

    _.each(config['styles'], function (file) {
        sassFiles.push.apply(sassFiles, _.filter(file.files, function (item) {
            return (typeof item === 'object') && (item.type === 'sass')
        }));
    });

    return sassFiles;
};

var watchLint = function(files) {
    var lintFiles = _.map(files, function (file) {
        return resolve(file);
    });

    Logger.files(lintFiles, false);
    gulp.watch(lintFiles, ['lint']);
};

var watchSass = function (files) {
    var sassFiles = _.map(files, function (file) {
        return resolve(file.options.watch);
    });

    Logger.files(sassFiles, false);
    gulp.watch(sassFiles, ['sass']);
};

var watchTask = function () {
    Logger.heading('Live coding');
    Logger.message('Watching for changes ...');
    watchSass(getSass());
    watchLint(config.lint);
};

var task = function (configFile) {
    config = configFile;

    return watchTask;
};

module.exports = task;