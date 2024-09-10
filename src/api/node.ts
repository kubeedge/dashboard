import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import type { Node, NodeList } from '@/types/node';
import { request } from '@/helper/request';

export function useListNodes() {
  return useQuery<NodeList>('listNodes', '/api/v1/nodes', {
    method: 'GET',
  });
}

export function getNode(name: string) {
  return request<Node>(`/api/v1/nodes/${name}`, {
    method: 'GET',
  });
}

export function updateNode(name: string, data: Node) {
  return request<Node>(`/api/v1/nodes/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteNode(name: string) {
  return request<Status>(`/api/v1/nodes/${name}`, {
    method: 'DELETE',
  });
}
