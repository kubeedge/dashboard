import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { request } from '@/helper/request';
import { ClusterRole, ClusterRoleList } from '@/types/clusterRole';

export function useListClusterRoles() {
  return useQuery<ClusterRoleList>('listClusterRoles', `/clusterrole`, {
    method: 'GET',
  });
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
