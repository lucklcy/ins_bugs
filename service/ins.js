const Router = require('koa-router')
const cheerio = require('cheerio')
const { getHtml, getPicFromQuery } = require('../business/ins/res')

let insService = new Router()

const quertGraph = async ctx => {
  let { path } = ctx.query
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
                  let { display_url, edge_sidecar_to_children } = edgeItem && edgeItem['node']
                  if (edge_sidecar_to_children && edge_sidecar_to_children.edges) {
                    let childEdges = edge_sidecar_to_children.edges
                    childEdges.forEach(edgeSideItem => {
                      let {
                        node: { display_url },
                      } = edgeSideItem
                      picInHtmls.push(display_url)
                    })
                  } else {
                    picInHtmls.push(display_url)
                  }
                })
              }
              getPicFromQuery(id, end_cursor, picInHtmls)
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

insService.get('/queryPics', quertGraph)

module.exports = insService
