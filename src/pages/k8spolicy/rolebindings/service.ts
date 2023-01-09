import request from '@/utils/request';

// 列表
export function getList(namespaces: string) {
 return request(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/rolebindings`, {
  method: 'get'
 }) 
}
// 删除
export function removeItem(namespaces: string, rolebindings: string) {
  return request(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/rolebindings/${rolebindings}`, {
    method: 'delete',
  });
}

// 新增
export async function addBinding(namespaces: string, params) {
  return request(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/rolebindings`, {
    method: 'POST',
    data: params,
  });
}
