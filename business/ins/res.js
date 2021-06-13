const https = require('https')
const { INS_URL, HEADERS, QUERY_HASH } = require('../../common/const')
const api = require('../../httpClient')
const path = require('path')
const { createDirectory, uuid, _replaceAll } = require('../../utils/index.js')
const fs = require('fs')
const request = require('request')
const rootDirectory = '/Users/liuchongyang/ins'
let subDir = null

const generateSubDir = path => {
  if (path.indexOf('.') > -1) subDir = _replaceAll('.', '_', path)
  subDir = path
}

const getHtml = queryPath => {
  return new Promise((resolve, reject) => {
    generateSubDir(queryPath)
    const req = https.get(`${INS_URL}/${queryPath}/`, { headers: HEADERS }, function (res) {
      let chunks = []
      let size = 0
      res.on('data', function (chunk) {
        chunks.push(chunk)
        size += chunk.length
      })
      res.on('end', function () {
        let data = Buffer.concat(chunks, size)
        resolve(data.toString())
      })
    })
    req.on('error', e => {
      reject(e)
    })
  })
}

const downloadFile = (url, filePath, callback) => {
  let fileName = new Date().getTime() + '_' + uuid(16) + '.jpg'
  let stream = fs.createWriteStream(path.resolve(filePath, `./${fileName}`))
  request(url)
    .pipe(stream)
    .on('close', function (err) {
      console.log('文件[' + fileName + ']下载完毕')
      setTimeout(() => {
        callback && callback()
      }, 100)
    })
}

const downloadOfList = (list, index) => {
  if (list && list.length > 0 && index < list.length) {
    let url = list[index]
    if (url.indexOf('.jpg') > -1) {
      downloadFile(url, path.resolve(rootDirectory, `./${subDir}`), function () {
        console.log('=========== 开始下载第 ' + index + ' 个文件===========')
        downloadOfList(list, ++index)
      })
    }
  } else {
    console.log('没有更多的文件了=======')
  }
}

const getPicFromQuery = (id, endPoint, picArray) => {
  let requestParams = { query_hash: QUERY_HASH, variables: JSON.stringify({ id, first: 12, after: endPoint }) }
  api.graphqlQuery(requestParams).then(res => {
    let {
      data: { user },
    } = res || { data: {} }
    let { edge_owner_to_timeline_media } = user || {}
    let { edges, page_info } = edge_owner_to_timeline_media || {}
    if (edges && edges.length > 0) {
      edges.forEach(edgeItem => {
        let { display_url, edge_sidecar_to_children } = edgeItem && edgeItem['node']
        if (edge_sidecar_to_children && edge_sidecar_to_children.edges) {
          let childEdges = edge_sidecar_to_children.edges
          childEdges.forEach(edgeSideItem => {
            let {
              node: { display_url },
            } = edgeSideItem
            picArray.push(display_url)
          })
        } else {
          picArray.push(display_url)
        }
      })
    }
    console.log({ picArrayLength: picArray.length })
    let { end_cursor, has_next_page } = page_info
    if (has_next_page) {
      setTimeout(() => {
        getPicFromQuery(id, end_cursor, picArray)
      }, 200)
    } else {
      createDirectory(`/${subDir}`, rootDirectory)
      fs.writeFile(path.resolve(rootDirectory, `./${subDir}/pic.json`), JSON.stringify(picArray), err => {
        if (err) {
          console.error(err)
          return
        }
        console.log('File has been created')
      })
      downloadOfList(picArray, 0)
    }
  })
}

module.exports = {
  getHtml,
  getPicFromQuery,
}
