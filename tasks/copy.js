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
    var queue = _.size(config.copy);
    var deferred = q.defer();
    
    _.each(config.copy, function (copy) {
        fsExtra.copySync(buildCopyGlob(copy), buildCopyDest(copy));
        Logger.message(' ... done!');

        queue--;

        if (queue == 0) {
            Logger.info('Copy complete');
            deferred.resolve();
        }
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