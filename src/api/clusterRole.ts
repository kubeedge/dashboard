import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { request } from '@/helper/request';
import { ClusterRole, ClusterRoleList } from '@/types/clusterRole';

export function useListClusterRoles() {
  return useQuery<ClusterRoleList>('listClusterRoles', `/apis/rbac.authorization.k8s.io/v1/clusterroles`, {
    method: 'GET',
  });
}

export function getClusterRole(name: string) {
  return request<ClusterRole>(`/apis/rbac.authorization.k8s.io/v1/clusterroles/${name}`, {
    method: 'GET',
  });
}

export function createClusterRole(data: ClusterRole) {
  return request<ClusterRole>(`/apis/rbac.authorization.k8s.io/v1/clusterroles`, {
    method: 'POST',
    data,
  });
}

export function updateClusterRole(name: string, data: ClusterRole) {
  return request<ClusterRole>(`/apis/rbac.authorization.k8s.io/v1/clusterroles/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteClusterRole(name: string) {
  return request<Status>(`/apis/rbac.authorization.k8s.io/v1/clusterroles/${name}`, {
    method: 'DELETE',
  });
}
