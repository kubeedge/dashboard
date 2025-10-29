import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import type { Node, NodeList } from '@/types/node';
import { request } from '@/helper/request';

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
  return useQuery<any>(`listNodes:${path}`, path, { method: 'GET' });
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
