import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { DeviceModel, DeviceModelList } from '@/types/deviceModel';
import { request } from '@/helper/request';

export function useListDeviceModels(namespace?: string) {
  const url = namespace
    ? `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels`
    : '/apis/devices.kubeedge.io/v1beta1/devicemodels'
  return useQuery<DeviceModelList>('listDeviceModels', url, {
    method: 'GET',
  });
}

export function getDeviceModel(namespace: string, name: string) {
  return request<DeviceModel>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels/${name}`, {
    method: 'GET',
  });
}

export function createDeviceModel(namespace: string, data: DeviceModel) {
  return request<DeviceModel>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels`, {
    method: 'POST',
    data,
  });
}

export function updateDeviceModel(namespace: string, name: string, data: DeviceModel) {
  return request<DeviceModel>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDeviceModel(namespace: string, name: string) {
  return request<Status>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels/${name}`, {
    method: 'DELETE',
  });
}
