var path = require('path'),
    _ = require('lodash'),
    config = require('./Config');

var resolve = function (glob) {
    if (glob.constructor === Array) {
        return _.map(glob, function(el) {
            return path.join(config.base, el);
        });
    }
    else {
        return path.join(config.base, glob);
    }

};

module.exports = resolve;