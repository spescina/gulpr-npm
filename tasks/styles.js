var gulp = require('gulp'),
    path = require('path'),
    rimraf = require('rimraf'),
    _ = require('lodash'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var clean = function() {
    rimraf(resolve(path.join(config.dist.base, config.dist.styles)), function(){});
};

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
    _.each(config.styles, function(file, key) {
        optimize(key);
    });
};

var stylesTask = function () {
    Logger.heading('Styles optimizations');
    Logger.message('cleaning ...');
    clean();
    Logger.message('optimizing ...');
    return optimizeAll();
};

var task = function (configFile) {
    config = configFile;

    return stylesTask;
};

module.exports = task;