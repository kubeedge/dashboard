import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { ClusterRoleBinding, ClusterRoleBindingList } from '@/types/clusterRoleBinding';
import { Status } from '@/types/common';

export function useListClusterRoleBindings(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  let url = '/clusterrolebinding';

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }

  const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  return useQuery<ClusterRoleBindingList>('listClusterRoleBindings', finalUrl, {
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
