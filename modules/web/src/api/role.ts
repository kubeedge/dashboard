import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Role, ConciseRoleList } from '@/types/role';

export function useListRoles(params?: Record<string, string | number | undefined>) {
  const url = params?.namespace ? `/role/${params.namespace}` : '/role';

  return useQuery<ConciseRoleList>(
    `listRoles:${JSON.stringify(params)}`,
    url,
    {
      method: 'GET',
      params
    }
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
