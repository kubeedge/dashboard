import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Service, ServiceList } from '@/types/service';
import { request } from '@/helper/request';

export function useListServices(namespace?: string) {
  const url = namespace ? `/service/${namespace}` : '/service';
  return useQuery<ServiceList>('listServices', url, {
    method: 'GET',
  });
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
