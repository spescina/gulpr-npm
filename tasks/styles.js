var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    q = require('q'),
    config;

var getStyles = function(key) {
    var stylesFiles = [];

    _.each(config.styles[key].files, function(item) {
        var file = (typeof item === 'object') ? path.join(item.dest.path, item.dest.filename) : item;

        stylesFiles.push(resolve(file));
    });

    return stylesFiles;
};

var optimize = function(key) {
    return gulp.src(getStyles(key))
        .pipe(concat(key + '.css'))
        .pipe(gulp.dest(resolve(path.join(config.dist.base, config.dist.styles))))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(resolve(path.join(config.dist.base, config.dist.styles))));
};

var optimizeAll = function() {
    var queue = _.size(config.styles);
    var deferred = q.defer();

    _.each(config.styles, function(file, key) {
        optimize(key);

        queue--;

        if (queue == 0) {
            Logger.info('Styles complete');
            deferred.resolve();
        }
    });

    return deferred.promise;
};

var stylesTask = function () {
    Logger.heading('Styles optimizations');
    Logger.message('optimizing ...');
    return optimizeAll();
};

var task = function (configFile) {
    config = configFile;

    return stylesTask;
};

module.exports = task;