const { DOMParser } = require('xmldom')
const fs = require('fs')
const unzipper = require('unzipper')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const book = {
  extractMetadata: async function(data) {
    const directory = await unzipper.Open.file(data.pathToFile)
    let metadata = directory.files.find((file) => file.path === 'ComicInfo.xml');
  
    return new Promise( (resolve, reject) => {
      metadata
      .stream()
      .pipe(fs.createWriteStream(`./temp/${data.fileName}.xml`))
      .on('error', reject)
      .on('finish', function() {
        resolve(data)
      })
    });
  },

  parseMetadata: function(data) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./temp/${data.fileName}.xml`, 'utf8', (err, file) => {
        if (err) {
          console.error(err);
          return;
        }
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(file, 'text/xml');
        try {
          data.title = xmlDoc.getElementsByTagName('Title')[0].textContent.replaceAll('"', '');
        } catch (err) {
          data.title = undefined
        };
  
        try {
          data.series = xmlDoc.getElementsByTagName('Series')[0].textContent.replaceAll('"', '');      
        } catch (err) {
          data.series = undefined
        };
  
        try {
          data.number = xmlDoc.getElementsByTagName('Number')[0].textContent.replaceAll('"', '');
        } catch (err) {
          data.number = undefined
        };
  
        try {
          data.tags = xmlDoc.getElementsByTagName('Genre')[0].textContent.replaceAll('"', '');        
        } catch (err) {
          data.tags = undefined
        };
  
        try {
          data.author = xmlDoc.getElementsByTagName('Writer')[0].textContent.replaceAll('"', '');
        } catch (err) {
          data.author = 'UNKNOWN'
        };
  
        try {
          data.cover = `./temp/${data.fileName}.jpg`
        } catch (err) {
          data.cover = undefined
        }

        resolve(data)
      });    
    })
  },

  extractCover: async function(data) {
    const directory = await unzipper.Open.file(data.pathToFile)
    let cover = directory.files.find((file) => file.path === '001.jpeg')
    let ext = '.jpeg'
    if (cover === undefined) {
      cover = directory.files.find((file) => file.path === '001.png')
      ext = '.png'
    }
  
    return new Promise( (resolve, reject) => {
      cover
      .stream()
      .pipe(fs.createWriteStream(`./temp/${data.fileName}.jpg`))
      .on('error', reject)
      .on('finish', function() {
        resolve(data)
      })
    });
  },

  convertToEpub: async function(data) {
    let command = `ebook-convert "${data.pathToFile}" "./temp/${data.fileName}.epub"`
    if (data.title !== undefined) {
      command = command + ` --title "${data.title}"`;    
    } 
    if (data.series !== undefined) {
      command = command + ` --series "${data.series}"`;
    } 
    if (data.number !== undefined) {
      command = command + ` --series-index "${data.number}"`;
    } 
    if (data.author !== undefined) {
      command = command + ` --authors "${data.author}"`;
    } 
    if (data.tags !== undefined) {
      command = command + ` --tags "${data.tags}"`
    } 
    if (data.tags !== undefined) {
      command = command + ` --cover "${data.cover}"`
    }
    const { stdout, stderr } = await exec(command);
    return(data)
  },

  addBook: async function(data) {
    const { stdout, stderr } = await exec(`calibredb add "./temp/${data.fileName}.epub"`);
    return(data)
  },

  removeTemp: function(data) {
    fs.unlink(`./temp/${data.fileName}.xml`, (err) => {
      if (err) {
        console.log(err)
      }
    })

    fs.unlink(`./temp/${data.fileName}.jpg`, (err) => {
      if (err) {
        console.log(err)
      }
    })

    fs.unlink(`./temp/${data.fileName}.epub`, (err) => {
      if (err) {
        console.log(err)
      }
    })

    fs.unlink(data.pathToFile, (err) => {
      if (err) {
        console.log(err)
      }
    })
    return(data)
  }
}

module.exports = book
