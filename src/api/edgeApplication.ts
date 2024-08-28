import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { EdgeApplication, EdgeApplicationList } from '@/types/edgeApplication';

export function useListEdgeApplications(namespace?: string) {
  const url = namespace
    ? `/apis/apps.kubeedge.io/v1alpha1/namespace/${namespace}/edgeapplications`
    : '/apis/apps.kubeedge.io/v1alpha1/edgeapplications'
  return useQuery<EdgeApplicationList>('listEdgeApplications', url, {
    method: 'GET',
  });
}

export function getEdgeApplication(namespace: string, name: string) {
  return request<EdgeApplication>(`/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications/${name}`, {
    method: 'GET',
  });
}

export function createEdgeApplication(namespace: string, data: EdgeApplication) {
  return request<EdgeApplication>(`/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications`, {
    method: 'POST',
    data,
  });
}

export function updateEdgeApplication(namespace: string, name: string, data: EdgeApplication) {
  return request<EdgeApplication>(`/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteEdgeApplication(namespace: string, name: string) {
  return request<Status>(`/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications/${name}`, {
    method: 'DELETE',
  });
}