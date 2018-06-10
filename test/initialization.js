'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('initializing runner', () => {
  var processorSpy;
  var PaketRunner;

  beforeEach(() => {
    processorSpy = sinon.spy();
    PaketRunner = proxyquire('../lib/paket', {
      './processor': processorSpy
    });
  });

  it('should use provided path to paket.exe', () => {
    // Arrange
    var options = { paketPath: 'test path' };
    var paket = new PaketRunner(options);

    // Act
    paket.restore();

    // Assert
    assert.equal(processorSpy.args[0][0].path, options.paketPath);
  });

  it('should use default paket.exe path', () => {
    // Arrange
    var paket = new PaketRunner();

    // Act
    paket.restore();

    // Assert
    assert.equal(processorSpy.args[0][0].path, './.paket/paket.exe');
  });
});
