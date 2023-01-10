import request from '@/utils/request';
import type { DeptType } from './data.d';

// 列表
export function getList(namespaces: string) {
  return request(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles`, {
    method: 'get'
  })
}

// 删除
export function removeItem(namespaces: string, name: string) {
  return request(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles/${name}`, {
    method: 'delete',
  });
}

// 新增
export function addRole(namespaces: string, params) {
  return request(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles`, {
    method: 'post',
    data: params
  });
}