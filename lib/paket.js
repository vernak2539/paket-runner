'use strict';

var processor = require('./processor');

var commandsArgs = {
    restore: function(options) {
        var args = ['restore'];

        if(options.force) {
            args.push('--force');
        }
        if(options.onlyReferenced) {
            args.push('--only-referenced');
        }
        if(options.touchAffectedRefs) {
            args.push('--touch-affected-refs');
        }
        if(typeof options.group === 'string') {
            args.push('group ' + options.group);
        }
        if(typeof options.referencesFiles === 'string') {
            args.push('--references-files ' + options.referencesFiles);
        }

        return args;
    }
};

var PaketRunner = function(options) {
    options = options || {};
    var path = options.paketPath || './.paket/paket.exe';



    return {
        restore: function(options) {
            options = options || {};
            var command = {
                path: path,
                args: commandsArgs.restore.call(null, options)
            };

            processor(command);
        }
    };
};

module.exports = PaketRunner;
