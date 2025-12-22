import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import type { ConciseNodeList, Node } from '@/types/node';

export function useListNodes(params?: Record<string, string | number | undefined>) {
  return useQuery<ConciseNodeList>(
    'listNodes',
    '/node',
    { method: 'GET', params },
  );
}

export function getNode(name: string) {
  return request<Node>(`/node/${name}`, {
    method: 'GET',
  });
}

export function updateNode(name: string, data: Node) {
  return request<Node>(`/node`, {
    method: 'PUT',
    data,
  });
}

export function deleteNode(name: string) {
  return request<Status>(`/node/${name}`, {
    method: 'DELETE',
  });
}

export async function listNodes(namespace?: string): Promise<ConciseNodeList> {
  const url = namespace ? `/node/${namespace}` : '/node';
  const res = await request<ConciseNodeList>(url, { method: 'GET' });
  return res.data;
}
