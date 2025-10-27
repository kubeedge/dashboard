import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { DeviceModel, DeviceModelList } from '@/types/deviceModel';
import { request } from '@/helper/request';

export function useListDeviceModels(namespace?: string) {
  const url = namespace ? `/devicemodel/${namespace}` : 'devicemodel';
  return useQuery<DeviceModelList>('listDeviceModels', url, {
    method: 'GET',
  });
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
