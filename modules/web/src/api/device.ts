import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Device, DeviceList } from '@/types/device';
import { request } from '@/helper/request';

export function useListDevices(namespace?: string) {
  const url = namespace ? `/device/${namespace}` : '/device';
  return useQuery<DeviceList>('listDevices', url, {
    method: 'GET',
  });
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