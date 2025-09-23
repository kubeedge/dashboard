import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { NodeGroup, NodeGroupList } from '@/types/nodeGroup';
import { request } from '@/helper/request';

export function useListNodeGroups() {
  return useQuery<NodeGroupList>('listNodeGroups', '/nodegroup', {
    method: 'GET',
  });
}

export function getNodeGroup(name: string) {
  return request<NodeGroup>(`/nodegroup/${name}`, {
    method: 'GET',
  });
}

export function createNodeGroup(data: NodeGroup, body: any) {
  return request<NodeGroup>(`/nodegroup`, {
    method: 'POST',
    data,
  });
}

export function updateNodeGroup(name: string, data: NodeGroup) {
  return request<NodeGroup>(`/nodegroup`, {
    method: 'PUT',
    data,
  });
}

export function deleteNodeGroup(name: string) {
  return request<Status>(`/nodegroup/${name}`, {
    method: 'DELETE',
  });
}
