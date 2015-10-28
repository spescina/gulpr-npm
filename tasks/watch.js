var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    Logger = require('../Logger');

var getSass = function () {
    var sassFiles = [];

    _.each(config['styles'], function (file) {
        sassFiles.push.apply(sassFiles, _.filter(file.files, function (item) {
            return (typeof item === 'object') && (item.type === 'sass')
        }));
    });

    return sassFiles;
};

var watchAll = function (files) {
    var sassFiles = _.map(files, function (file) {
        if (file.options.watch.constructor === Array) {
            return _.map(file.options.watch, function (item) {
                return path.join(config.base, item);
            });
        }
        else {
            return path.join(config.base, file.options.watch);
        }
    });

    Logger.files(sassFiles, false);

    return gulp.watch(sassFiles, ['sass']);
};

var watchTask = function () {
    Logger.heading('Live coding');
    Logger.message('Watching for changes ...');
    return watchAll(getSass());
};

var task = function (configFile) {
    config = configFile;

    return watchTask;
};

module.exports = task;