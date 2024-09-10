import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Role, RoleList } from '@/types/role';
import { request } from '@/helper/request';

export function useListRoles(namespace?: string) {
  const url = namespace ? `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/roles` : '/apis/rbac.authorization.k8s.io/v1/roles';
  return useQuery<RoleList>('listRoles', url, {
    method: 'GET',
  });
}

export function getRole(namespace: string, name: string) {
  return request<Role>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/roles/${name}`, {
    method: 'GET',
  });
}

export function createRole(namespace: string, data: Role) {
  return request<Role>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/roles`, {
    method: 'POST',
    data,
  });
}

export function updateRole(namespace: string, name: string, data: Role) {
  return request<Role>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/roles/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRole(namespace: string, name: string) {
  return request<Status>(`/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/roles/${name}`, {
    method: 'DELETE',
  });
}
