import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import type { ConciseNodeList, Node, NodeList } from '@/types/node';

export function useListNodes(params?: Record<string, string | number | undefined>) {
  let path = '/node';
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') search.set(k, String(v));
    });
    const qs = search.toString();
    if (qs) path += `?${qs}`;
  }
  return useQuery<ConciseNodeList>(`listNodes:${path}`, path, { method: 'GET' });
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

export async function listNodes(namespace?: string): Promise<NodeList> {
  const url = namespace ? `/node/${namespace}` : '/node';
  const res = await request<NodeList>(url, { method: 'GET' });
  return res.data;
}
