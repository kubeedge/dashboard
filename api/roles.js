import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles`,
    method: 'get'
  })
}
// 删除
export function removeItem(namespaces, name) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles/${name}`,
    method: 'delete',
  });
}

// 新增
export function addRole(namespaces, params) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles`,
    method: 'post',
    data: params
  });
}