'use strict';

const commands = require('./commands');
const processor = require('./processor');

class PaketRunner {
  constructor(options) {
    this.commandGenerator = commands(options);
  }
  restore(options) {
    const restoreCommand = this.commandGenerator('restore', options);
    return processor(restoreCommand);
  }
}

module.exports = PaketRunner;
