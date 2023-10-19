import request from '@/utils/request'

export function getList(params) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/clusterroles`,
    method: 'get',
    params
  })
}
// 删除
export function removeItem(clusterrole) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/clusterroles/${clusterrole}`,
    method: 'delete',
  });
}
//apis/rbac.authorization.k8s.io/v1/clusterroles

export function addItem(data) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/clusterroles`,
    method: 'post',
    data
  });
}