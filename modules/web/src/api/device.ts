import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseDeviceList, Device } from '@/types/device';

export function useListDevices(namespace?: string, params?: Record<string, string | number | undefined>) {
  const path = namespace ? `/device/${namespace}` : '/device';

  return useQuery<ConciseDeviceList>(`listDevices`, path, { method: 'GET', params });
}

export function getDevice(namespace: string, name: string) {
  return request<Device>(`/device/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createDevice(namespace: string, data: Device) {
  return request<Device>(`/device/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateDevice(namespace: string, name: string, data: Device) {
  return request<Device>(`/device/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDevice(namespace: string, name: string) {
  return request<Status>(`/device/${namespace}/${name}`, {
    method: 'DELETE',
  });
}