const https = require('https')
const { INS_URL, HEADERS, QUERY_HASH, PROXY_IP, PROXY_PORT, ROOT_DIRECTORY } = require('../../common/const')
const api = require('../../httpClient')
const path = require('path')
const { createDirectory, uuid, _replaceAll } = require('../../utils/index.js')
const fs = require('fs')

const request = require('request').defaults({
  proxy: `http://${PROXY_IP}:${PROXY_PORT}`,
})
let subDir = null

const generateSubDir = path => {
  if (path.indexOf('.') > -1) subDir = _replaceAll('.', '_', path)
  subDir = path
}

const getHtml = queryPath => {
  return new Promise((resolve, reject) => {
    generateSubDir(queryPath)
    request.get(`${INS_URL}/${queryPath}/`, { headers: HEADERS }, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    })
  })
}

const downloadFile = (url, filePath, isVideo, callback) => {
  let fileName = new Date().getTime() + '_' + uuid(16)
  fileName += isVideo ? '.mp4' : '.jpg'
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
    const { src: url, is_video, config_height, config_width } = list[index]
    downloadFile(url, path.resolve(ROOT_DIRECTORY, `./${subDir}`), is_video, function () {
      let msg = `=========== 开始下载第 ${index} 个文件, 视频：${is_video ? '是' : '否'}, `
      is_video ? (msg += `===========`) : (msg += `长：${config_height},宽：${config_width} ===========`)
      console.log(msg)
      downloadOfList(list, ++index)
    })
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
        let { display_resources, edge_sidecar_to_children, video_url, is_video } = edgeItem && edgeItem['node']
        if (is_video) {
          picArray.push({ src: video_url, is_video: true })
        } else {
          if (edge_sidecar_to_children && edge_sidecar_to_children.edges) {
            let childEdges = edge_sidecar_to_children.edges
            childEdges.forEach(edgeSideItem => {
              let {
                node: { display_resources: child_display_resources },
              } = edgeSideItem
              picArray.push(child_display_resources[child_display_resources.length - 1])
            })
          } else {
            picArray.push(display_resources[display_resources.length - 1])
          }
        }
      })
    }
    console.log({ picArrayLength: picArray.length })
    let { end_cursor, has_next_page } = page_info
    if (has_next_page) {
      setTimeout(() => {
        getPicFromQuery(id, end_cursor, picArray)
      }, 3000)
    } else {
      createDirectory(`/${subDir}`, ROOT_DIRECTORY)
      fs.writeFile(path.resolve(ROOT_DIRECTORY, `./${subDir}/pic.json`), JSON.stringify(picArray), err => {
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
