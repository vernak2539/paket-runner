'use strict';

var assert     = require('assert');
var mockSpawnModule  = require('mock-spawn');
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

describe('general use of promises', function() {
    it('should return a promise object', function() {
        // Arrange
        var processor = proxyquire('../lib/processor', {
            child_process: {
                spawn: mockSpawnModule()
            }
        });

        // Act
        var runningProcess = processor({});

        // Assert
        // not sure of another good way to figure if it's a promise
        assert.ok(typeof runningProcess.then === 'function');
    });
});

describe('unsuccessful commands', function() {
    it('should reject promise with error on exit code > 0', function(done) {
        // Arrange
        var exitCode = 1;
        var spawnMock = mockSpawnModule();
        var processor = proxyquire('../lib/processor', {
            child_process: {
                spawn: spawnMock
            }
        });
        spawnMock.sequence.add(spawnMock.simple(exitCode));

        // Act
        processor({})
            .catch(function(err) {
                // Assert
                assert.equal(err.message, 'Paket command failed to run with exit code: ' + exitCode);
                done();
            });
    });

    it('should reject promise with stderr if there', function(done) {
        // Arrange
        var exitCode = 1;
        var spawnMock = mockSpawnModule();
        var sampleStderr = 'sample stderr';
        var processor = proxyquire('../lib/processor', {
            child_process: {
                spawn: spawnMock
            }
        });
        spawnMock.sequence.add(spawnMock.simple(exitCode, null, sampleStderr));

        // Act
        processor({})
            .catch(function(err) {
                // Assert
                assert.equal(err.message, 'Paket command failed: ' + sampleStderr);
                done();
            });
    });

    it('should reject promise with error when child_process spawn errors', function(done) {
        // Arrange
        var spawnMock = mockSpawnModule();
        var sampleError = new Error('spawn ENOENT');
        var processor = proxyquire('../lib/processor', {
            child_process: {
                spawn: spawnMock
            }
        });
        spawnMock.sequence.add(function(cb) {
            this.emit('error', sampleError);
            setTimeout(function() {
                return cb(8);
            }, 10);
        });

        // Act
        processor({})
            .catch(function(err) {
                // Assert
                assert.equal(err, sampleError);
                done();
            });
    });
});

describe('successful commands', function() {
    it('should resolve promise on exit code === 0', function(done) {
        // Arrange
        var sampleStdout = 'sample stdout';
        var spawnMock = mockSpawnModule();
        var processor = proxyquire('../lib/processor', {
            child_process: {
                spawn: spawnMock
            }
        });
        spawnMock.sequence.add(spawnMock.simple(null, sampleStdout));
        spawnMock.sequence.add(spawnMock.simple(0));

        // Act
        processor({})
            .then(function(stdout) {
                // Assert
                assert.equal(stdout, sampleStdout);
                done();
            });
    });
});

describe('spawing child proceses', function() {
    it('should spawn child process with correct commands', function() {
        // Arrange
        var spawnStub = sinon.stub().returns({
            stdout: {
                on: function() {}
            },
            stderr: {
                on: function() {}
            }
        });
        var command = {
            path: './path/to/paket.exe',
            args: ['restore', '--force']
        };
        var processor = proxyquire('../lib/processor', {
            child_process: {
                spawn: spawnStub
            },
            bluebird: function() {}
        });

        // Act
        processor(command);

        // Assert
        assert(spawnStub.calledWith(command.path, command.args));
    });
});
