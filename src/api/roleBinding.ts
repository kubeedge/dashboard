import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RoleBinding, RoleBindingList } from '@/types/roleBinding';
import { request } from '@/helper/request';

export function useListRoleBindings(namespace?: string) {
  const url = namespace
    ? `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings`
    : '/apis/rbac.authorization.k8s.io/v1/rolebindings';
  return useQuery<RoleBindingList>('listRoleBindings', url, {
    method: 'GET',
  });
}

export function getRoleBinding(namespace: string, name: string) {
  return request<RoleBinding>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/${name}`, {
    method: 'GET',
  });
}

export function createRoleBinding(namespace: string, data: RoleBinding) {
  return request<RoleBinding>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings`, {
    method: 'POST',
    data,
  });
}

export function updateRoleBinding(namespace: string, name: string, data: RoleBinding) {
  return request<RoleBinding>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRoleBinding(namespace: string, name: string) {
  return request<Status>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/${name}`, {
    method: 'DELETE',
  });
}
