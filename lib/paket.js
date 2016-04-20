'use strict';

var commands  = require('./commands');
var processor = require('./processor');

var PaketRunner = function(options) {
    var commandGenerator = commands(options);

    return {
        restore: function(options) {
            var restoreCommand = commandGenerator('restore', options);
            return processor(restoreCommand);
        }
    };
};

module.exports = PaketRunner;
