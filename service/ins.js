const Router = require('koa-router')
const fs = require('fs')
const util = require('util')
const path = require('path')
const cheerio = require('cheerio')
const { getHtml, getPicFromQuery, downloadOfList } = require('../business/ins/res')
const { generateSubDir } = require('../utils/index.js')
const { ROOT_DIRECTORY } = require('../common/const')

let insService = new Router()

const quertGraph = async ctx => {
  let { path } = ctx.query
  const subDir = generateSubDir(path)
  if (path) {
    let html = await getHtml(path)
    const $ = cheerio.load(html) //cheerio模块开始处理 DOM处理
    let scripts = $('script')
    if (scripts && scripts.length > 0) {
      Array.prototype.forEach.call(scripts, item => {
        let children = item.children
        if (children.length === 1) {
          let data = children[0]['data'] || ''
          if (data.startsWith('window._sharedData')) {
            let dataScript = eval(data.substring(7))
            let { entry_data } = dataScript || {}
            let { ProfilePage } = entry_data || {}
            let { graphql } = (ProfilePage && ProfilePage.length > 0 && ProfilePage[0]) || {}
            let { user } = graphql || {}
            let { edge_owner_to_timeline_media } = user || {}
            let { page_info, edges } = edge_owner_to_timeline_media || {}
            if (user && page_info) {
              const picInHtmls = []
              let { id } = user
              let { end_cursor } = page_info
              if (edges && edges.length > 0) {
                edges.forEach(edgeItem => {
                  let { display_url, dimensions, edge_sidecar_to_children, video_url, is_video, id } = edgeItem && edgeItem['node']
                  if (is_video) {
                    picInHtmls.push({ src: video_url, is_video: true, id })
                  } else {
                    if (edge_sidecar_to_children && edge_sidecar_to_children.edges) {
                      let childEdges = edge_sidecar_to_children.edges
                      childEdges.forEach(edgeSideItem => {
                        let {
                          node: { display_url: child_display_url, dimensions: child_dimensions },
                        } = edgeSideItem
                        picInHtmls.push({
                          id,
                          src: child_display_url,
                          config_height: child_dimensions.height,
                          config_width: child_dimensions.width,
                        })
                      })
                    } else {
                      picInHtmls.push({
                        id,
                        src: display_url,
                        config_height: dimensions.height,
                        config_width: dimensions.width,
                      })
                    }
                  }
                })
              }
              getPicFromQuery(id, end_cursor, picInHtmls, subDir)
            }
          }
        }
      })
    }
    ctx.body = {
      result: 0,
      message: '成功',
    }
  } else {
    ctx.body = {
      result: -1,
      message: '缺少必要参数',
    }
  }
}

const downloadByJsonFile = async ctx => {
  let { path: queryPath } = ctx.query
  const subDir = generateSubDir(queryPath)
  const jsonFileDir = path.resolve(ROOT_DIRECTORY, `./${subDir}`)
  const jsonFileDirStats = await util.promisify(fs.stat)(jsonFileDir)
  if (jsonFileDirStats.isDirectory()) {
    const jsonFilePath = path.resolve(jsonFileDir, `./pic.json`)
    const jsonFilePathStats = await util.promisify(fs.stat)(jsonFilePath)
    if (jsonFilePathStats.isFile()) {
      const picArray = require(jsonFilePath)
      console.log({ picArray })
      downloadOfList(picArray, 0, subDir)
      ctx.body = { result: 0, message: '成功' }
    } else {
      ctx.body = { result: -1, message: '缺少必要参数' }
    }
  } else {
    ctx.body = { result: -1, message: '缺少必要参数' }
  }
}

insService.get('/queryPics', quertGraph)
insService.get('/downByJson', downloadByJsonFile)

module.exports = insService
