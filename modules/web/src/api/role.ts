import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Role, ConciseRoleList } from '@/types/role';

export function useListRoles(namespace?: string, params?: Record<string, string | number | undefined>) {
  const url = namespace ? `/role/${namespace}` : '/role';

  return useQuery<ConciseRoleList>(
    `listRoles`,
    url,
    { method: 'GET', params }
  );
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
