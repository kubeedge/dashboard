import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RoleBinding, RoleBindingList } from '@/types/roleBinding';
import { request } from '@/helper/request';

export function useListRoleBindings(namespace?: string) {
  const url = namespace ? `/rolebinding/${namespace}` : '/rolebinding';
  return useQuery<RoleBindingList>('listRoleBindings', url, {
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
