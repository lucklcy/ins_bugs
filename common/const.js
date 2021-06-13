const Y = 'y'
const N = 'n'
const NO_USER_TOKEN_STATUS_CODE = 400
const SERVER_ERROR_STATUS_CODE = 500
const SUCCESS_STATUS_CODE = 200
const ERROR_RESULT_CODE = -1
const EXCEPTION_MSG = '服务器繁忙，请稍后再试！'

// 请求接口的方式
const REQUEST_METHOD_GET = 'get'
const REQUEST_METHOD_POST = 'post'
const INS_URL = 'https://www.instagram.com'
const QUERY_HASH = '32b14723a678bd4628d70c1f877b94c9'

const HEADERS = {
  cookie:
    'mid=YIPvAwAEAAHjDIzveK9Lycun_y1w; ig_did=800673D1-5D3A-484D-B774-1786CF81B26E; ig_nrcb=1; csrftoken=eMDjSLwIXgCHx6tBECYQof2vHyNU3nry; ds_user_id=31693274020; sessionid=31693274020%3AM9XKbczHRawJXl%3A11; shbid=1307; shbts=1621125924.0506704; rur=RVA',
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
  REQUEST_METHOD_GET,
  REQUEST_METHOD_POST,
  INS_URL,
  QUERY_HASH,
  HEADERS,
}
