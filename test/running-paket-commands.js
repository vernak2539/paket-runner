'use strict';

var assert     = require('assert');
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

describe('using restore command', function() {
    var processorSpy;
    var paket;

    beforeEach(function() {
        var PaketRunner;
        processorSpy = sinon.spy();
        PaketRunner = proxyquire('../lib/paket', {
            './processor': processorSpy
        });
        paket = new PaketRunner();
    });

    it('should have "restore" as first arg', function() {
        // Act
        paket.restore({ force: true });

        // Assert
        assert.equal(processorSpy.args[0][0].args[0], 'restore');
    });

    it('add --force to args', function() {
        // Act
        paket.restore({ force: true });

        // Assert
        assert.ok(processorSpy.args[0][0].args.indexOf('--force') >= 0);
    });

    it('should --only-referenced to args', function() {
        // Act
        paket.restore({ onlyReferenced: true });

        // Assert
        assert.ok(processorSpy.args[0][0].args.indexOf('--only-referenced') >= 0);
    });

    it('should --touch-affected-refs to args', function() {
        // Act
        paket.restore({ touchAffectedRefs: true });

        // Assert
        assert.ok(processorSpy.args[0][0].args.indexOf('--touch-affected-refs') >= 0);
    });

    it('should group to args', function() {
        // Act
        paket.restore({ group: 'MyGroup' });

        // Assert
        assert.ok(processorSpy.args[0][0].args.indexOf('group MyGroup') >= 0);
    });

    it('should --references-files to args', function() {
        // Act
        paket.restore({ referencesFiles: 'TestString' });

        // Assert
        assert.ok(processorSpy.args[0][0].args.indexOf('--references-files TestString') >= 0);
    });
});
