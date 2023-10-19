import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/services`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, app) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/services/${app}`,
    method: 'delete',
  });
}

// 新增
export function addItem(namespaces, data) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/services`,
    method: 'post',
    data
  });
}