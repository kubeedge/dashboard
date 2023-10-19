import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devices`,
    method: 'get'
  })
}

// 删除
export function removeItem(namespaces, app) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devices/${app}`,
    method: 'delete',
  });
}