import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ClusterRole, ClusterRoleList, ConciseClusterRoleList } from '@/types/clusterRole';

export function useListClusterRoles(params?: Record<string, string | number | undefined>) {
  return useQuery<ConciseClusterRoleList>(
    'listClusterRoles',
    '/clusterrole',
    { method: 'GET', params },
  );
}

export function getClusterRole(name: string) {
  return request<ClusterRole>(`/clusterrole/${name}`, {
    method: 'GET',
  });
}

export function createClusterRole(data: ClusterRole) {
  return request<ClusterRole>(`/clusterrole`, {
    method: 'POST',
    data,
  });
}

export function updateClusterRole(name: string, data: ClusterRole) {
  return request<ClusterRole>(`/clusterrole`, {
    method: 'PUT',
    data,
  });
}

export function deleteClusterRole(name: string) {
  return request<Status>(`/clusterrole/${name}`, {
    method: 'DELETE',
  });
}
