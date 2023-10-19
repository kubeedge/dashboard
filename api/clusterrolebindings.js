import request from '@/utils/request'

export function getList() {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`,
    method: 'get',
  })
}

// 删除
export function removeItem(clusterrolebindings) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${clusterrolebindings}`,
    method: 'delete',
  });
}

export function addItem(data) {
  return request({
    url: `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`,
    method: 'post',
    data
  });
}