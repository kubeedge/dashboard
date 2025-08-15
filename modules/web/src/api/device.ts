import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Device, DeviceList } from '@/types/device';
import { request } from '@/helper/request';

export function useListDevices(params?: Record<string, string | number | undefined>) {
  let path = '/device';
  // Optional namespace path parameter for compatibility
  const namespace = params?.namespace as string | undefined;
  if (namespace) {
    path = `/device/${namespace}`;
  }
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== '' && k !== 'namespace') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  if (qs) path += `?${qs}`;
  return useQuery<any>(`listDevices:${path}`, path, { method: 'GET' });
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