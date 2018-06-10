'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('using restore command', () => {
  let processorSpy;
  let paket;

  beforeEach(() => {
    var PaketRunner;
    processorSpy = sinon.spy();
    PaketRunner = proxyquire('../lib/paket', {
      './processor': processorSpy
    });
    paket = new PaketRunner();
  });

  it('should have "restore" as first arg', () => {
    // Act
    paket.restore({ force: true });

    // Assert
    assert.equal(processorSpy.args[0][0].args[0], 'restore');
  });

  it('add --force to args', () => {
    // Act
    paket.restore({ force: true });

    // Assert
    assert.ok(processorSpy.args[0][0].args.indexOf('--force') >= 0);
  });

  it('should --only-referenced to args', () => {
    // Act
    paket.restore({ onlyReferenced: true });

    // Assert
    assert.ok(processorSpy.args[0][0].args.indexOf('--only-referenced') >= 0);
  });

  it('should --touch-affected-refs to args', () => {
    // Act
    paket.restore({ touchAffectedRefs: true });

    // Assert
    assert.ok(processorSpy.args[0][0].args.indexOf('--touch-affected-refs') >= 0);
  });

  it('should group to args', () => {
    // Act
    paket.restore({ group: 'MyGroup' });

    // Assert
    assert.ok(processorSpy.args[0][0].args.indexOf('group MyGroup') >= 0);
  });

  it('should --references-files to args', () => {
    // Act
    paket.restore({ referencesFiles: 'TestString' });

    // Assert
    assert.ok(processorSpy.args[0][0].args.indexOf('--references-files TestString') >= 0);
  });
});
