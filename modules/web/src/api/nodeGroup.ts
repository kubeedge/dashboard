import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { NodeGroup, ConciseNodeGroupList } from '@/types/nodeGroup';

export function useListNodeGroups(params?: Record<string, string | number | undefined>) {
  return useQuery<ConciseNodeGroupList>(
    `listNodeGroups:${JSON.stringify(params)}`,
    '/nodegroup',
    { method: 'GET', params },
  );
}

export function getNodeGroup(name: string) {
  return request<NodeGroup>(`/nodegroup/${name}`, {
    method: 'GET',
  });
}

export function createNodeGroup(data: NodeGroup) {
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
