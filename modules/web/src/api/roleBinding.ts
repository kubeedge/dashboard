import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RoleBinding, RoleBindingList } from '@/types/roleBinding';

export function useListRoleBindings(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  let url = '/rolebinding';

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'namespace') {
        searchParams.append(key, String(value));
      }
    });

    if (params.namespace) {
      url = `/rolebinding/${params.namespace}`;
    }
  }

  const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  return useQuery<RoleBindingList>('listRoleBindings', finalUrl, {
    method: 'GET',
  });
}

export function getRoleBinding(namespace: string, name: string) {
  return request<RoleBinding>(`/rolebinding/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createRoleBinding(namespace: string, data: RoleBinding) {
  return request<RoleBinding>(`/rolebinding/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateRoleBinding(namespace: string, name: string, data: RoleBinding) {
  return request<RoleBinding>(`/rolebinding/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRoleBinding(namespace: string, name: string) {
  return request<Status>(`/rolebinding/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
