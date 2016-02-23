var fs = require('fs'),
    randomString = require('randomstring'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var cacheBustTask = function () {
    Logger.heading('CacheBust');
    Logger.message('generating hash ...');
    var random = randomString.generate();
    fs.writeFileSync(resolve('cacheBust.json'), '{"value": "' + random + '"}');

    Logger.info('Cacheust complete');
    return;
};

var task = function (configFile) {
    config = configFile;

    return cacheBustTask;
};

module.exports = task;