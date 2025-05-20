import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Role, RoleList } from '@/types/role';
import { request } from '@/helper/request';

export function useListRoles(namespace?: string) {
  const url = namespace ? `/role/${namespace}` : '/role';
  return useQuery<RoleList>('listRoles', url, {
    method: 'GET',
  });
}

export function getRole(namespace: string, name: string) {
  return request<Role>(`/role/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createRole(namespace: string, data: Role) {
  return request<Role>(`/role/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateRole(namespace: string, name: string, data: Role) {
  return request<Role>(`/role/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRole(namespace: string, name: string) {
  return request<Status>(`/role/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
