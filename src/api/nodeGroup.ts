import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { NodeGroup, NodeGroupList } from '@/types/nodeGroup';
import { request } from '@/helper/request';

export function useListNodeGroups() {
  return useQuery<NodeGroupList>('listNodeGroups', '/apis/apps.kubeedge.io/v1alpha1/nodegroups', {
    method: 'GET',
  });
}

export function getNodeGroup(name: string) {
  return request<NodeGroup>(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${name}`, {
    method: 'GET',
  });
}

export function createNodeGroup(data: NodeGroup) {
  return request<NodeGroup>(`/apis/apps.kubeedge.io/v1alpha1/nodegroups`, {
    method: 'POST',
    data,
  });
}

export function updateNodeGroup(name: string, data: NodeGroup) {
  return request<NodeGroup>(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteNodeGroup(name: string) {
  return request<Status>(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${name}`, {
    method: 'DELETE',
  });
}
