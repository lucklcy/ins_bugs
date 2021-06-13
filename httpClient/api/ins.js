const { REQUEST_METHOD_POST, INS_URL, REQUEST_METHOD_GET } = require('../../common/const')
module.exports = [
  // 获取个人资料里的图片
  {
    subUrl: `${INS_URL}/graphql/query/`,
    name: 'graphqlQuery',
    method: REQUEST_METHOD_GET,
  },
]
