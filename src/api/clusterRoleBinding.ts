import { useQuery } from '@/hook/useQuery';
import { ClusterRoleBinding, ClusterRoleBindingList } from '@/types/clusterRoleBinding';
import { Status } from '@/types/common';
import { request } from '@/helper/request';

export function useListClusterRoleBindings() {
  return useQuery<ClusterRoleBindingList>('listClusterRoleBindings', `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`, {
    method: 'GET',
  });
}

export function getClusterRoleBinding(name: string) {
  return request<ClusterRoleBinding>(`/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${name}`, {
    method: 'GET',
  });
}

export function createClusterRoleBinding(data: ClusterRoleBinding) {
  return request<ClusterRoleBinding>(`/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`, {
    method: 'POST',
    data,
  });
}

export function updateClusterRoleBinding(name: string, data: ClusterRoleBinding) {
  return request<ClusterRoleBinding>(`/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteClusterRoleBinding(name: string) {
  return request<Status>(`/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${name}`, {
    method: 'DELETE',
  });
}
