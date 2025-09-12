import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { EdgeApplication, EdgeApplicationList } from '@/types/edgeApplication';

export function useListEdgeApplications(namespace?: string) {
  const url = namespace ? `/edgeapplication/${namespace}` : '/edgeapplication';
  return useQuery<EdgeApplicationList>('listEdgeApplications', url, {
    method: 'GET',
  });
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