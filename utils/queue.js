const events = require('events')

let running = false;
const book = require('./bookFunctions');

const TaskQueue = {
  queue: [],

  addToQueue: function(task) {
    this.queue.push(task)
    if (running === false) {
      running = true
      run();
    }
  },

  log: function() {
    return(this.queue)
  },

  emitter: new events.EventEmitter()
};

async function run() {
  while(running) {
    let {tasks, data} = TaskQueue.queue[0]

    for(let i=0;i<tasks.length;i++) {
      data = await executeTask(tasks[i], data)
    }

    TaskQueue.queue.shift()
    TaskQueue.emitter.emit('bookAdded', data)

    if (TaskQueue.queue.length === 0) {
      running = false
    }
  }
}

async function executeTask(task, data) {
  switch (task) {
    case 'extractMetadata':
      return(await book.extractMetadata(data))

    case 'parseMetadata':
      return(await book.parseMetadata(data))

    case 'extractCover':
      return(await book.extractCover(data))

    case 'convertToEpub':
      return(await book.convertToEpub(data))

    case 'addBook':
      return(await book.addBook(data))

    case 'removeTemp':
      return(await book.removeTemp(data))
  
    default:
      break;
  }
}

module.exports = TaskQueue
