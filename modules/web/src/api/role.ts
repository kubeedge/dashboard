import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Role, RoleList } from '@/types/role';
import { request } from '@/helper/request';

export function useListRoles(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  let url = '/role';
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'namespace') {
        searchParams.append(key, String(value));
      }
    });
    
    if (params.namespace) {
      url = `/role/${params.namespace}`;
    }
  }
  
  const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;
  
  return useQuery<RoleList>('listRoles', finalUrl, {
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
