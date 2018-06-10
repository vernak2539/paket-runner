'use strict';

const assign = Object.assign || require('lodash.assign');

const commandsArgs = {
  restore: options => {
    const args = ['restore'];

    if (options.force) {
      args.push('--force');
    }
    if (options.onlyReferenced) {
      args.push('--only-referenced');
    }
    if (options.touchAffectedRefs) {
      args.push('--touch-affected-refs');
    }
    if (typeof options.group === 'string') {
      args.push('group ' + options.group);
    }
    if (typeof options.referencesFiles === 'string') {
      args.push('--references-files ' + options.referencesFiles);
    }

    return args;
  }
};

module.exports = globalOptions => {
  return (command, options) => {
    options = assign(
      {
        paketPath: './.paket/paket.exe'
      },
      globalOptions,
      options
    );

    return {
      path: options.paketPath,
      args: commandsArgs[command].call(null, options)
    };
  };
};
