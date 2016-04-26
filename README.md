# Node Paket Runner

Node module for running Paket commands

```js
npm install paket-runner
```

This is a work in progress and only the `restore` function has been created. Although, it should be very easy to add to in the future

### Usage
```js
var PaketRunner = require('paket-runner');

// Note: spawn assumes the cwd is the top level of the project
var paket = PaketRunner({
    paketPath: 'path/to/paket.exe' // default --> './.paket/paket.exe'
});

// promise based
paket
    .restore({ /* ... options ... */ })
    .then(function(stdout) {
        // stdout from the paket process
    })
    .catch(function(stderr) {
        // error object with either stderr or exit code
    });
```

### Paket Commands Available
This list should get bigger over time...

#### Restore
All [paket options][2] are available. The are additive, meaning not enabled by default

```js
page.restore({
    force: true,
    onlyReferenced: true,
    touchAffectedRefs: true,
    group: 'MyGroup',
    referencesFiles: 'Files'
});

// executes
// path/to/paket.exe restore --force --only-referenced group MyGroup --references-files Files
```

This was influenced heavily by [node-nuget-runner][1]. I couldn't figure out why it was doing what it was until I tried it differently. Thanks so much!

Use gulp? Just installed Paket and others work on your repo? Checkout [this sample][3] of initialization/always having the latest Paket

[1]: https://github.com/mikeobrien/node-nuget-runner
[2]: https://fsprojects.github.io/Paket/paket-restore.html
[3]: https://gist.github.com/vernak2539/500e5727be1b9c6d6ff77d02401dabae
