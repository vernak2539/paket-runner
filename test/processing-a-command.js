'use strict';

const assert = require('assert');
const mockSpawnModule = require('mock-spawn');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('general use of promises', () => {
  it('should return a promise object', () => {
    // Arrange
    const processor = proxyquire('../lib/processor', {
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

describe('unsuccessful commands', () => {
  it('should reject promise with error on exit code > 0', done => {
    // Arrange
    const exitCode = 1;
    const spawnMock = mockSpawnModule();
    const processor = proxyquire('../lib/processor', {
      child_process: {
        spawn: spawnMock
      }
    });
    spawnMock.sequence.add(spawnMock.simple(exitCode));

    // Act
    processor({}).catch(err => {
      // Assert
      assert.equal(err.message, 'Paket command failed to run with exit code: ' + exitCode);
      done();
    });
  });

  it('should reject promise with stderr if there', done => {
    // Arrange
    const exitCode = 1;
    const spawnMock = mockSpawnModule();
    const sampleStderr = 'sample stderr';
    const processor = proxyquire('../lib/processor', {
      child_process: {
        spawn: spawnMock
      }
    });
    spawnMock.sequence.add(spawnMock.simple(exitCode, null, sampleStderr));

    // Act
    processor({}).catch(err => {
      // Assert
      assert.equal(err.message, 'Paket command failed: ' + sampleStderr);
      done();
    });
  });

  it('should reject promise with error when child_process spawn errors', done => {
    // Arrange
    const spawnMock = mockSpawnModule();
    const sampleError = new Error('spawn ENOENT');
    const processor = proxyquire('../lib/processor', {
      child_process: {
        spawn: spawnMock
      }
    });
    spawnMock.sequence.add(function(cb) {
      this.emit('error', sampleError);
      setTimeout(() => {
        return cb(8);
      }, 10);
    });

    // Act
    processor({}).catch(err => {
      // Assert
      assert.equal(err, sampleError);
      done();
    });
  });
});

describe('successful commands', () => {
  it('should resolve promise on exit code === 0', done => {
    // Arrange
    const sampleStdout = 'sample stdout';
    const spawnMock = mockSpawnModule();
    const processor = proxyquire('../lib/processor', {
      child_process: {
        spawn: spawnMock
      }
    });
    spawnMock.sequence.add(spawnMock.simple(null, sampleStdout));
    spawnMock.sequence.add(spawnMock.simple(0));

    // Act
    processor({}).then(stdout => {
      // Assert
      assert.equal(stdout, sampleStdout);
      done();
    });
  });
});

describe('spawing child proceses', () => {
  it('should spawn child process with correct commands', () => {
    // Arrange
    const spawnStub = sinon.stub().returns({
      stdout: {
        on: () => {}
      },
      stderr: {
        on: () => {}
      }
    });
    const command = {
      path: './path/to/paket.exe',
      args: ['restore', '--force']
    };
    const processor = proxyquire('../lib/processor', {
      child_process: {
        spawn: spawnStub
      },
      bluebird: class {}
    });

    // Act
    processor(command);

    // Assert
    assert(spawnStub.calledWith(command.path, command.args));
  });
});
