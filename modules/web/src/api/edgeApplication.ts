import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { EdgeApplication } from '@/types/edgeApplication';

export function useListEdgeApplications(params?: Record<string, string | number | undefined>) {
  let path = '/edgeapplication';
  const namespace = params?.namespace as string | undefined;
  if (namespace) {
    path = `/edgeapplication/${namespace}`;
  }
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== '' && k !== 'namespace') search.set(k, String(v));
  });
  if (process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true' && process.env.NEXT_PUBLIC_MOCK_COUNT) {
    search.set('mock', String(process.env.NEXT_PUBLIC_MOCK_COUNT));
  }
  const qs = search.toString();
  if (qs) path += `?${qs}`;
  return useQuery<any>(`listEdgeApplications:${path}`, path, { method: 'GET' });
}

export function getEdgeApplication(namespace: string, name: string) {
  return request<EdgeApplication>(`/edgeapplication/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createEdgeApplication(namespace: string, data: EdgeApplication) {
  return request<EdgeApplication>(`/edgeapplication/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateEdgeApplication(namespace: string, name: string, data: EdgeApplication) {
  return request<EdgeApplication>(`/edgeapplication/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteEdgeApplication(namespace: string, name: string) {
  return request<Status>(`/edgeapplication/${namespace}/${name}`, {
    method: 'DELETE',
  });
}