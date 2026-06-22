import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Service, ConciseServiceList } from '@/types/service';

export function useListServices(namespace?: string, params?: Record<string, string | number | undefined>) {
  const path = namespace ? `/service/${namespace}` : '/service';

  return useQuery<ConciseServiceList>(
    'listServices',
    path,
    { method: 'GET', params },
  );
}

export function getService(namespace: string, name: string) {
  return request<Service>(`/service/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createService(namespace: string, data: Service) {
  return request<Service>(`/service/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateService(namespace: string, name: string, data: Service) {
  return request<Service>(`/service/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteService(namespace: string, name: string) {
  return request<Status>(`/service/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
