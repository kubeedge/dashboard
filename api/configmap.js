import request from '@/utils/request'

// 列表
export function getList(namespaces) {
  return request({
    url: `api/v1/namespaces/${namespaces}/configmaps`,
    method: 'get'
  })
}

// 删除
export function removeItem(namespaces, app) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/configmaps/${app}`,
    method: 'delete',
  });
}

// 新增
export async function addConfig(namespaces, params) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/configmaps`,
    method: 'POST',
    data: params,
  });
}