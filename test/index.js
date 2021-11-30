// const { Writable } = require('stream')
// const outStream = new Writable({
//   write(chunk, encoding, callback) {
//     console.log(chunk.toString())
//     callback()
//   },
// })

// process.stdin.pipe(outStream)
// ----------------------------------------//
// process.stdin.pipe(process.stdout)
// ----------------------------------------//
// const { Readable } = require('stream')
// const inStream = new Readable()
// inStream.push('Hello World!!!\n')
// inStream.push('What would you like?\n')
// inStream.push(null)

// inStream.pipe(process.stdout)

// ----------------------------------------//
// const { Readable } = require('stream')
// const inStream = new Readable({
//   read(size) {
//     this.push(String.fromCharCode(this.currentCharCode++))
//     if (this.currentCharCode > 90) {
//       this.push(null)
//     }
//   },
// })
// inStream.currentCharCode = 65
// inStream.pipe(process.stdout)

// ----------------------------------------//
// const { Duplex } = require('stream')

// const inoutStream = new Duplex({
//   write(chunk, encoding, callback) {
//     console.log(chunk.toString())
//     callback()
//   },
//   read(size) {
//     this.push(String.fromCharCode(this.currentCharCode++))
//     if (this.currentCharCode > 90) {
//       this.push(null)
//     }
//   },
// })
// inoutStream.currentCharCode = 65
// process.stdin.pipe(inoutStream).pipe(process.stdout)

// ----------------------------------------//

// const { Transform } = require('stream')
// const upperCaseTr = new Transform({
//   transform(chunk, encoding, callback) {
//     this.push(chunk.toString().toUpperCase())
//     callback()
//   },
// })

// process.stdin.pipe(upperCaseTr).pipe(process.stdout)

// ----------------------------------------//
// const { Transform } = require('stream')

// const commaSplitter = new Transform({
//   readableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     this.push(chunk.toString().trim().split(','))
//     callback()
//   },
// })

// const arrayToObject = new Transform({
//   readableObjectMode: true,
//   writableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     const obj = {}
//     for (let i = 0; i < chunk.length; i += 2) {
//       obj[chunk[i]] = chunk[i + 1]
//     }
//     this.push(obj)
//     callback()
//   },
// })

// const objectToString = new Transform({
//   writableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     this.push(JSON.stringify(chunk) + '\n')
//     callback()
//   },
// })

// process.stdin.pipe(commaSplitter).pipe(arrayToObject).pipe(objectToString).pipe(process.stdout)

// ----------------------------------------//
// const fs = require('fs')
// const zlib = require('zlib')
// const file = process.argv[2]

// fs.createReadStream(file)
//   .pipe(zlib.createGzip())
//   .on('data', () => process.stdout.write('.'))
//   .pipe(fs.createWriteStream(file + '.zz'))
//   .on('finish', () => process.stdout.write('\ndone\n'))

const fs = require('fs')
let ws = fs.createWriteStream('write.txt', {
  highWaterMark: 3,
  encoding: 'utf8',
})
let index = 9
function write() {
  let flag = true
  while (flag && index > 0) {
    flag = ws.write(index-- + '')
  }
  if (index == 0) {
    ws.end('0', function () {
      console.log('finished')
    })
  }
}
write()
ws.on('drain', function () {
  write()
  console.log('drain')
})
ws.on('error', function (err) {
  console.log(err)
})
ws.on('finish', function () {
  console.log('finish')
})
ws.on('close', function () {
  console.log('close')
})
