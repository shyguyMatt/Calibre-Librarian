const mangaWatcher = require('./utils/folderWatcher')
const librarian = require('./utils/librarian')
const TaskQueue = require('./utils/queue')


mangaWatcher.listen('/mnt/library/mangas')
mangaWatcher.emitter.on('fileAdded', (data) => {
  TaskQueue.addToQueue({
    tasks: ['extractMetadata', 'parseMetadata', 'extractCover', 'convertToEpub', 'addBook', 'removeTemp'],
    data: data
  })
})

TaskQueue.emitter.on('bookAdded', (data) => {
  librarian.sendMessage(`${data.series}: ${data.title} Has been added to your library!`)
})



