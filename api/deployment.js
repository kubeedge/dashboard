import request from '@/utils/request'

// 列表
export function getList(namespaces) {
  return request({
    url: `/apis/apps/v1/namespaces/${namespaces}/deployments`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, app) {
  return request({
    url: `/apis/apps/v1/namespaces/${namespaces}/deployments/${app}`,
    method: 'delete',
  });
}

// 获取容器应用详情
export function getDeploymentDetail(namespaces, name) {
  return request({
    url: `/apis/apps/v1/namespaces/${namespaces}/deployments/${name}`,
    method: 'get'
  })
}

// 获取实例列表
export function getDeploymentPodsList(namespaces) {
  return request({
    url: `/api/v1/namespaces/${namespaces}/pods`,
    method: 'get'
  })
}

export function addItem(namespaces, data){
  return request({
    url: `/apis/apps/v1/namespaces/${namespaces}/deployments`,
    method: 'post',
    data
  })
}