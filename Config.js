var fs = require('fs'),
    path = require('path');

var load = function () {
    var file = path.resolve(process.cwd() + '/assets.json');

    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

module.exports = load();