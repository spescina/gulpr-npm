var gulp = require('gulp'),
    path = require('path'),
    fsExtra = require('fs-extra'),
    rimraf = require('rimraf'),
    q = require('q'),
    _ = require('lodash'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var clean = function () {
    var deferred = q.defer();

    rimraf(resolve(config.vendor.dest), function () {
        deferred.resolve();
    });

    return deferred.promise;
};

var buildVendorGlob = function (vendor) {
    return path.resolve(path.join(process.cwd(), 'node_modules', vendor));
};

var buildVendorDest = function (vendor) {
    return path.resolve(path.join(resolve(config.vendor.dest), vendor));
};

var clone = function () {
    var queue = config.vendor.packages.length;
    var deferred = q.defer();

    _.each(config.vendor.packages, function (vendor) {
        fsExtra.copy(buildVendorGlob(vendor), buildVendorDest(vendor), function () {
            Logger.message(vendor + ' ... done!');
            queue--;

            if (!queue) {
                deferred.resolve();
            }
        });
    });

    return deferred.promise;
};

var vendorTask = function () {
    Logger.heading('Vendor packages');
    Logger.message('cleaning ...');

    return clean().then(function () {
        Logger.message('cloning ...');
        return clone();
    });
};

var task = function (configFile) {
    config = configFile;

    return vendorTask;
};

module.exports = task;