import request from '@/utils/request'

// 列表
export function getList(namespaces) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/secrets`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, name) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/secrets/${name}`,
    method: 'delete',
  });
}

// 详情
export function getInfo(namespaces, name) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/secrets/${name}`,
    method: 'get'
  })
}

// 新增
export async function addSecret(namespaces, params) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/secrets`,
    method: 'POST',
    data: params,
  });
}