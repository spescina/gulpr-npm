var fs = require('fs'),
    randomString = require('randomstring'),
    Logger = require('../Logger'),
    resolve = require('../PathResolver'),
    config;

var cacheBustTask = function () {
    Logger.heading('CacheBust');
    Logger.message('Generating hash ...');
    var random = randomString.generate();
    return fs.writeFileSync(resolve('cacheBust.json'), '{"value": "' + random + '"}');
};

var task = function (configFile) {
    config = configFile;

    return cacheBustTask;
};

module.exports = task;