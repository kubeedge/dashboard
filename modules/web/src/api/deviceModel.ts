import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { DeviceModel, DeviceModelList } from '@/types/deviceModel';
import { request } from '@/helper/request';

export function useListDeviceModels(params?: Record<string, string | number | undefined>) {
  let path = '/devicemodel';
  // Optional namespace path parameter for compatibility
  const namespace = params?.namespace as string | undefined;
  if (namespace) {
    path = `/devicemodel/${namespace}`;
  }
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== '' && k !== 'namespace') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  if (qs) path += `?${qs}`;
  return useQuery<any>(`listDeviceModels:${path}`, path, { method: 'GET' });
}

export function getDeviceModel(namespace: string, name: string) {
  return request<DeviceModel>(`/devicemodel/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createDeviceModel(namespace: string, data: DeviceModel) {
  return request<DeviceModel>(`/devicemodel/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateDeviceModel(namespace: string, name: string, data: DeviceModel) {
  return request<DeviceModel>(`/devicemodel/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDeviceModel(namespace: string, name: string) {
  return request<Status>(`/devicemodel/${namespace}/${name}`, {
    method: 'DELETE',
  });
}

export async function listDeviceModels(namespace?: string): Promise<DeviceModelList> {
  const url = namespace ? `/devicemodel/${namespace}` : 'devicemodel';
  const res = await request<DeviceModelList>(url, { method: 'GET' });
  return res.data;
}
