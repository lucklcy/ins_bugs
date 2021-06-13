const fs = require('fs')
const path = require('path')

const _replaceAll = (find, replace, str) => {
  find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  return str.replace(new RegExp(find, 'g'), replace)
}

/**
 * 生成uuid，以作临时id用
 * @param {生成的uuid的长度} len
 * @param {随机的字符范围}} radix
 * @returns 返回uuid字符串
 */
const uuid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i = 0
  let r = 0
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

const emptyDirectory = directoryPath => {
  let targetDirectory = path.resolve(directoryPath)
  if (fs.existsSync(targetDirectory)) {
    let targetInnerFiles = fs.readdirSync(targetDirectory)
    targetInnerFiles.forEach(fileItem => {
      let tempPathString = `${targetDirectory}${path.sep}${fileItem}`
      let fileItemStat = fs.statSync(tempPathString)
      if (fileItemStat.isDirectory()) {
        emptyDirectory(tempPathString)
      } else {
        fs.unlinkSync(tempPathString)
      }
    })
  }
}

const createDirectory = (directoryPath, rootPath) => {
  directoryPath.split(path.sep).reduce((accumulator, currentValue) => {
    if (currentValue) {
      let tempDirectoryString = `${accumulator}${path.sep}${currentValue}`
      let tempDirectory = path.resolve(tempDirectoryString)
      if (!fs.existsSync(tempDirectory)) {
        console.log({ tempDirectory })
        fs.mkdirSync(tempDirectory)
      }
      return tempDirectoryString
    }
    return accumulator
  }, rootPath)
}

const copyFile = (srcPath, tarPath, cb) => {
  if (fs.existsSync(tarPath)) {
    fs.unlinkSync(tarPath)
    console.log(`${tarPath}文件已存在,删除..`)
  }
  let rs = fs.createReadStream(srcPath)
  rs.on('error', function (err) {
    if (err) {
      console.log('read error', srcPath)
    }
    cb && cb(err)
  })

  let ws = fs.createWriteStream(tarPath)
  ws.on('error', function (err) {
    if (err) {
      console.log('write error', tarPath)
    }
    cb && cb(err)
  })
  ws.on('close', function (ex) {
    cb && cb(ex)
  })

  rs.pipe(ws)
  console.log(`${tarPath}文件写入成功`)
}

const copyFolder = (srcDir, tarDir, cb) => {
  fs.readdir(srcDir, function (err, files) {
    let count = 0
    let checkEnd = function () {
      ++count == files.length && cb && cb()
    }

    if (err) {
      checkEnd()
      return
    }

    files.forEach(function (file) {
      let srcPath = path.join(srcDir, file)
      let tarPath = path.join(tarDir, file)
      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          console.log('拷贝目录', tarPath)
          if (!fs.existsSync(tarPath)) {
            fs.mkdirSync(tarPath)
          }
          copyFolder(srcPath, tarPath, checkEnd)
        } else {
          copyFile(srcPath, tarPath, checkEnd)
        }
      })
    })
    //为空时直接回调
    files.length === 0 && cb && cb()
  })
}

module.exports = {
  emptyDirectory,
  createDirectory,
  copyFolder,
  uuid,
  _replaceAll,
}
