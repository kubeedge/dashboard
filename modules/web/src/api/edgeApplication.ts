import { useQuery } from '@/hook/useQuery';
import { request } from '@/helper/request';
import { Status } from '@/types/common';
import { ConciseEdgeApplicationList, EdgeApplication } from '@/types/edgeApplication';

export function useListEdgeApplications(namespace?: string, params?: Record<string, string | number | undefined>) {
  const path = namespace ? `/edgeapplication/${namespace}` : '/edgeapplication';

  return useQuery<ConciseEdgeApplicationList>(
    `listEdgeApplications`,
    path,
    { method: 'GET', params },
  );
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