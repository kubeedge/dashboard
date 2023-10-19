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

// 设备实例新增
export async function addDevice(namespaces, params) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devices`,
    method: 'post',
    data: params,
  });
}

// 获取详情
export function getInfo(namespaces, app) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devices/${app}`,
    method: 'get',
  });
}

// 设备模型列表
export function getDevicemodelsList(namespaces) {
  return request({
    url: `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels`,
    method: 'get'
  })
}

/** 获取边缘计算列表 */
export async function getNodes(options) {
  return request({
    url: '/api/v1/nodes',
    method: 'get',
    ...(options || {}),
  });
}