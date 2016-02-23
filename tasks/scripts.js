var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    q = require('q'),
    config;

var getScripts = function (key) {
    return _.map(config.scripts[key].files, function (item) {
        return resolve(item);
    });
};

var optimize = function (key) {
    return gulp.src(getScripts(key))
        .pipe(concat(key + '.js'))
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest(resolve(path.join(config.dist.base, config.dist.scripts))));
};

var optimizeAll = function () {
    var queue = _.size(config.scripts);
    var deferred = q.defer();

    _.each(config.scripts, function (file, key) {
        optimize(key);

        queue--;

        if (queue == 0) {
            Logger.info('Scripts complete');
            deferred.resolve();
        }
    });

    return deferred.promise;
};

var scriptsTask = function () {
    Logger.heading('Scripts optimizations');
    Logger.message('optimizing ...');
    return optimizeAll();
};

var task = function (configFile) {
    config = configFile;

    return scriptsTask;
};

module.exports = task;