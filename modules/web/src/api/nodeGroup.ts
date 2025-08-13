import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { NodeGroup, NodeGroupList } from '@/types/nodeGroup';
import { request } from '@/helper/request';

export function useListNodeGroups(params?: Record<string, string | number | undefined>) {
  let path = '/nodegroup';
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') search.set(k, String(v));
    });
    const qs = search.toString();
    if (qs) path += `?${qs}`;
  }
  return useQuery<any>(`listNodeGroups:${path}`, path, { method: 'GET' });
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
