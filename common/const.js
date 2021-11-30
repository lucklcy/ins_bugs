const Y = 'y'
const N = 'n'
const NO_USER_TOKEN_STATUS_CODE = 400
const SERVER_ERROR_STATUS_CODE = 500
const SUCCESS_STATUS_CODE = 200
const ERROR_RESULT_CODE = -1
const EXCEPTION_MSG = '服务器繁忙，请稍后再试！'
const PROXY_IP = '172.20.18.99'
const PROXY_PORT = '10800'
const ROOT_DIRECTORY = '/home/lucklcy/self/ins'

// 请求接口的方式
const REQUEST_METHOD_GET = 'get'
const REQUEST_METHOD_POST = 'post'
const INS_URL = 'https://www.instagram.com'
const QUERY_HASH = '8c2a529969ee035a5063f2fc8602a0fd'

const HEADERS = {
  cookie:
    'mid=YaScKgALAAFn9q94OyGz93ZkB1n0; ig_did=282E2B17-8525-468B-AA85-ED1FD99BA053; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; csrftoken=oIyKY9hISPIaxbjgm22dLOC5YCjyAsmf; ds_user_id=31693274020; sessionid=31693274020%3AnhvJZhSHYaXTcm%3A16;',
  accept: '*/*',
}

module.exports = {
  Y,
  N,
  NO_USER_TOKEN_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
  ERROR_RESULT_CODE,
  EXCEPTION_MSG,
  PROXY_IP,
  PROXY_PORT,
  ROOT_DIRECTORY,
  REQUEST_METHOD_GET,
  REQUEST_METHOD_POST,
  INS_URL,
  QUERY_HASH,
  HEADERS,
}
