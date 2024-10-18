const events = require('events')
const chokidar = require('chokidar')

const mangaWatcher = {
  emitter: new events.EventEmitter(),

  listen: function (watchPath) {
    let watcher = chokidar.watch(watchPath, {
      usePolling: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    })

    watcher.on('add', (pathToFile) => {
      let filename = pathToFile.substring(pathToFile.lastIndexOf('/') +1, pathToFile.lastIndexOf('.'))

      let data = {
        pathToFile: pathToFile,
        fileName: filename.replaceAll('"', '')
      }

      this.emitter.emit('fileAdded', data)
    })    
  }
}

module.exports = mangaWatcher