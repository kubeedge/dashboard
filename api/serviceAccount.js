import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `api/v1/namespaces/${namespaces}/serviceaccounts`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, account) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/serviceaccounts/${account}`,
    method: 'delete',
  });
}

// 新增
export function addAccount(namespaces, params) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/serviceaccounts`,
    method: 'post',
    data: params
  })
}

// 获取秘钥列表
export function getSecretsList(namespaces) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/secrets`,
    method: 'get'
  })
}