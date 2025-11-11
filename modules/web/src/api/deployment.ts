import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseDeployment, ConciseDeploymentList, Deployment } from '@/types/deployment';

export function useListDeployments(params?: Record<string, string | number | undefined>) {
  let path = '/deployment';
  // Optional namespace path parameter for compatibility
  if (params?.namespace) {
    path = `/deployment/${params.namespace}`;
  }
  return useQuery<ConciseDeploymentList>(
    `listDeployments:${JSON.stringify(params)}`,
    path,
    { method: 'GET', params },
  );
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
