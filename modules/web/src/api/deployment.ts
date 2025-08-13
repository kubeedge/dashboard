import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Deployment } from '@/types/deployment';
import { request } from '@/helper/request';

export function useListDeployments(params?: Record<string, string | number | undefined>) {
  let path = '/deployment';
  // Optional namespace path parameter for compatibility
  const namespace = params?.namespace as string | undefined;
  if (namespace) {
    path = `/deployment/${namespace}`;
  }
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== '' && k !== 'namespace') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  if (qs) path += `?${qs}`;
  return useQuery<any>(`listDeployments:${path}`, path, { method: 'GET' });
}

export function getDeployment(namespace: string, name: string) {
  return request<Deployment>(`/deployment/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createDeployment(namespace: string, data: Deployment) {
  return request<Deployment>(`/deployment/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateDeployment(namespace: string, name: string, data: Deployment) {
  return request<Deployment>(`/deployment/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDeployment(namespace: string, name: string) {
  return request<Status>(`/deployment/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
