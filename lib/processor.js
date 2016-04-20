'use strict';
var Promise = require('bluebird');
var spawn   = require('child_process').spawn;

module.exports = function(command) {
    var args = command.args;
    var path = command.path;

    var paket = spawn(path, args);

    var stdout = '';
    var stderr = '';

    var log = function(msg) {
        msg = msg.toString('utf8');
        console.log(msg);
        return msg;
    };

    paket.stdout.on('data', function(msg) { stdout += log(msg); });
    paket.stderr.on('data', function(msg) { stderr += log(msg); });

    return new Promise(function(resolve, reject) {
        paket
            .on('error', function(err) {
                reject(err);
            })
            .on('exit', function(code) {
                if(code > 0) {
                    var error = stderr ? ': ' + stderr : ' to run with exit code: ' + code;
                    reject(new Error('Paket command failed' + error));
                    return;
                }
                resolve(stdout);
            });
    });
};
