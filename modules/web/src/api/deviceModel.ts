import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseDeviceModelList, DeviceModel } from '@/types/deviceModel';

export function useListDeviceModels(namespace?: string, params?: Record<string, string | number | undefined>) {
  const path = namespace ? `/devicemodel/${namespace}` : '/devicemodel';

  return useQuery<ConciseDeviceModelList>(
    `listDeviceModels`,
    path,
    { method: 'GET', params },
  );
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

export async function listDeviceModels(namespace?: string): Promise<ConciseDeviceModelList> {
  const url = namespace ? `/devicemodel/${namespace}` : 'devicemodel';
  const res = await request<ConciseDeviceModelList>(url, { method: 'GET' });
  return res.data;
}
