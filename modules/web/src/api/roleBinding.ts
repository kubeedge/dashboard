import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseRoleBindingList, RoleBinding } from '@/types/roleBinding';

export function useListRoleBindings(namespace?: string, params?: Record<string, string | number | undefined>) {
  const url = namespace ? `/rolebinding/${namespace}` : '/rolebinding';

  return useQuery<ConciseRoleBindingList>(
    `listRoleBindings`,
    url,
    { method: 'GET', params }
  );
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
