import request from '@/utils/request'

/** 获取名称空间列表 */
export async function getNamespaces (options?: Record<string, any>) {
  return request('/v1/namespaces', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取边缘计算列表 */
export async function getNodes (options?: Record<string, any>) {
  return request('/v1/nodes', {
    method: 'GET',
    ...(options || {}),
  });
}
// 
export async function getDeviceModels (options?: Record<string, any>) {
  return request('/apis/devices.kubeedge.io/v1alpha2/namespaces/default/devicemodels', {
    method: 'GET',
    ...(options || {}),
  });
}

