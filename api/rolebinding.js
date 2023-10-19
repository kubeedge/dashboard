import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/rolebindings`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, rolebindings) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/rolebindings/${rolebindings}`,
    method: 'delete',
  });
}

export function addItem(namespaces, data) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/rolebindings`,
    method: 'post',
    data
  });
}