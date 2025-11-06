import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Service, ServiceList } from '@/types/service';

export function useListServices(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'namespace') {
        searchParams.append(key, value.toString());
      }
    });
  }

  const namespace = params?.namespace as string;
  const baseUrl = namespace ? `/service/${namespace}` : '/service';
  const url = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

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
