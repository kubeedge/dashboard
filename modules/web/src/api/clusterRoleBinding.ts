import { useQuery } from '@/hook/useQuery';
import { ClusterRoleBinding, ClusterRoleBindingList } from '@/types/clusterRoleBinding';
import { Status } from '@/types/common';
import { request } from '@/helper/request';

export function useListClusterRoleBindings() {
  return useQuery<ClusterRoleBindingList>('listClusterRoleBindings', `/clusterrolebinding`, {
    method: 'GET',
  });
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
