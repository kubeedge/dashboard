import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Device, DeviceList } from '@/types/device';
import { request } from '@/helper/request';

export function useListDevices(namespace?: string) {
  const url = namespace
    ? `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices`
    : '/apis/devices.kubeedge.io/v1beta1/devices'
  return useQuery<DeviceList>('listDevices', url, {
    method: 'GET',
  });
}

export function getDevice(namespace: string, name: string) {
  return request<Device>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices/${name}`, {
    method: 'GET',
  });
}

export function createDevice(namespace: string, data: Device) {
  return request<Device>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices`, {
    method: 'POST',
    data,
  });
}

export function updateDevice(namespace: string, name: string, data: Device) {
  return request<Device>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDevice(namespace: string, name: string) {
  return request<Status>(`/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices/${name}`, {
    method: 'DELETE',
  });
}