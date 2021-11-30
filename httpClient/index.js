const axios = require('axios')
const _ = require('lodash')
const { SUCCESS_STATUS_CODE, PROXY_IP, PROXY_PORT } = require('../common/const')
const ins = require('./api/ins')
const moment = require('moment')
const { HEADERS } = require('../common/const')
const HttpsProxyAgent = require('https-proxy-agent')

const agent = new HttpsProxyAgent(`http://${PROXY_IP}:${PROXY_PORT}`)

const defaultConfig = {
  timeout: 10000,
  httpsAgent: agent,
  httpAgent: agent,
}

const initConfig = baseUrl => {
  return _.merge(true, defaultConfig, {
    baseURL: baseUrl,
  })
}

function Service() {
  let services = [...ins]
  let _this = this
  let _http = axios.create(initConfig(''))

  // 添加请求拦截器
  _http.interceptors.request.use(
    config => {
      config['headers'] = HEADERS
      config['startTime'] = new Date().getTime()
      return config
    },
    err => {
      // 对请求错误做些什么
      console.log({ err })
      return Promise.reject(error)
    }
  )

  _http.interceptors.response.use(
    response => {
      let { data: responseResult, status, config } = response
      let { url, params: requestParams, method, startTime } = config
      let costTime = new Date().getTime() - parseInt(startTime)
      let now = moment().format('YYYY-MM-DD HH:mm:SSS')
      console.log(
        `${costTime}ms ${now} ${method.toUpperCase()} for ${url}\r\nRequestParams:  ${JSON.stringify(requestParams)}\r\n>>>>>>>>>>Response Status:  ${status}`
      )
      if (status !== SUCCESS_STATUS_CODE) {
        return Promise.reject(responseResult)
      }
      return responseResult
    },
    err => {
      console.dir(err)
      return Promise.reject(err)
    }
  )

  services.forEach(item => {
    let { subUrl, name, method } = item
    _this[name] = params => {
      if (method === 'get') {
        return _http.get(subUrl, params ? { params } : {})
      } else {
        return _http.post(subUrl, params ? params : {})
      }
    }
  })
}

module.exports = new Service()
