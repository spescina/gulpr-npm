var gulp = require('gulp'),
    path = require('path'),
    rimraf = require('rimraf'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    q = require('q'),
    config;

var clean = function () {
    var deferred = q.defer();

    rimraf(resolve(config.dist.base), function () {
        Logger.info('Clean complete');
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanTask = function () {
    Logger.heading('Clean');
    Logger.message('cleaning ...');
    return clean();
};

var task = function (configFile) {
    config = configFile;

    return cleanTask;
};

module.exports = task;