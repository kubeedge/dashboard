import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Service, ServiceList } from '@/types/service';
import { request } from '@/helper/request';

export function useListServices(namespace?: string) {
  const url = namespace ? `/api/v1/namespaces/${namespace}/services` : '/api/v1/services';
  return useQuery<ServiceList>('listServices', url, {
    method: 'GET',
  });
}

export function getService(namespace: string, name: string) {
  return request<Service>(`/api/v1/namespaces/${namespace}/services/${name}`, {
    method: 'GET',
  });
}

export function createService(namespace: string, data: Service) {
  return request<Service>(`/api/v1/namespaces/${namespace}/services`, {
    method: 'POST',
    data,
  });
}

export function updateService(namespace: string, name: string, data: Service) {
  return request<Service>(`/api/v1/namespaces/${namespace}/services/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteService(namespace: string, name: string) {
  return request<Status>(`/api/v1/namespaces/${namespace}/services/${name}`, {
    method: 'DELETE',
  });
}
