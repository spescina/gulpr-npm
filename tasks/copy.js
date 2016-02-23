var gulp = require('gulp'),
    path = require('path'),
    fsExtra = require('fs-extra'),
    q = require('q'),
    _ = require('lodash'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var buildCopyGlob = function (copy) {
    return path.resolve(resolve(copy.source));
};

var buildCopyDest = function (copy) {
    return path.resolve(resolve(copy.dest));
};

var clone = function () {
    var queue = config.copy.length;
    var deferred = q.defer();

    _.each(config.copy, function (copy) {
        fsExtra.copy(buildCopyGlob(copy), buildCopyDest(copy), function () {
            Logger.message(' ... done!');
            queue--;

            if (!queue) {
                deferred.resolve();
            }
        });
    });

    return deferred.promise;
};

var copyTask = function () {
    Logger.heading('Copy static assets');
    Logger.message('cleaning ...');

    Logger.message('copying ...');
    return clone();
};

var task = function (configFile) {
    config = configFile;

    return copyTask;
};

module.exports = task;