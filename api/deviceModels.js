import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, app) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels/${app}`,
    method: 'delete',
  });
}

// 新增
export function addItem(namespaces, data) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels`,
    method: 'post',
    data
  });
}

// 修改
export function putItem(namespaces, data, name) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels/${name}`,
    method: 'put',
    data
  });
}

export function getDetail(namespaces, name) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels/${name}`,
    method: 'get'
  })
}