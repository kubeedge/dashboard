import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { ClusterRoleBinding, ConciseClusterRoleBindingList } from '@/types/clusterRoleBinding';
import { Status } from '@/types/common';

export function useListClusterRoleBindings(params?: Record<string, string | number | undefined>) {
  return useQuery<ConciseClusterRoleBindingList>(
    'listClusterRoleBindings',
    '/clusterrolebinding',
    { method: 'GET', params },
  );
}

export function getClusterRoleBinding(name: string) {
  return request<ClusterRoleBinding>(`/clusterrolebinding/${name}`, {
    method: 'GET',
  });
}

export function createClusterRoleBinding(data: ClusterRoleBinding) {
  return request<ClusterRoleBinding>(`/clusterrolebinding`, {
    method: 'POST',
    data,
  });
}

export function updateClusterRoleBinding(name: string, data: ClusterRoleBinding) {
  return request<ClusterRoleBinding>(`/clusterrolebinding`, {
    method: 'PUT',
    data,
  });
}

export function deleteClusterRoleBinding(name: string) {
  return request<Status>(`/clusterrolebinding/${name}`, {
    method: 'DELETE',
  });
}
