const fs = require('fs').promises

async function readFiles(files) {
  if (!Array.isArray(files)) {
    files = [files]
  }

  const fileContents = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, 'utf8')
      return JSON.parse(content)
    })
  )
  
  return fileContents
}

// 异步写入文件，如果文件不存在则创建它
async function writeFile(file, content) {
  const contentString = JSON.stringify(content, null, 4)
  await fs.writeFile(file, contentString, { flag: 'w' })
}


function toRepeat(array, key) {
  const seen = {};
  const unique = array.filter(item => {
    if (seen.hasOwnProperty(item[key])) {
      return false;
    } else {
      seen[item[key]] = true;
      return true;
    }
  });
  return unique;
}

module.exports = {
  readFiles,
  writeFile,
  toRepeat
}



// // 使用示例
// const filesToRead = ['file1.txt', 'file2.txt']

// readFiles(filesToRead)
//   .then(contents => {
//     console.log('File contents:', contents)
//   })
//   .catch(err => {
//     console.error('Error reading files:', err)
//   })

// const fileToWrite = 'file3.txt'
// const contentToWrite = 'Hello world!'

// writeFile(fileToWrite, contentToWrite)
//   .then(() => {
//     console.log('File written successfully')
//   })
//   .catch(err => {
//     console.error('Error writing file:', err)
//   })