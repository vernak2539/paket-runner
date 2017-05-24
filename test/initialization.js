'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('initializing runner', function() {
  var processorSpy;
  var PaketRunner;

  beforeEach(function() {
    processorSpy = sinon.spy();
    PaketRunner = proxyquire('../lib/paket', {
      './processor': processorSpy
    });
  });

  it('should use provided path to paket.exe', function() {
    // Arrange
    var options = { paketPath: 'test path' };
    var paket = new PaketRunner(options);

    // Act
    paket.restore();

    // Assert
    assert.equal(processorSpy.args[0][0].path, options.paketPath);
  });

  it('should use default paket.exe path', function() {
    // Arrange
    var paket = new PaketRunner();

    // Act
    paket.restore();

    // Assert
    assert.equal(processorSpy.args[0][0].path, './.paket/paket.exe');
  });
});
