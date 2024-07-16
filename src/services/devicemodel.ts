import type { Status } from "@/models/common";
import type { DeviceModel,  DeviceModelList } from "@/models/devicemodel";
import request from "@/utils/request";

export function listDeviceModels(namespace: string) {
  return request<DeviceModelList>(
    `/apis/devices.kubeedge.io/v1beta1${
      namespace ? `/namespaces/${namespace}` : ""
    }/devicemodels`,
    {
      method: "GET",
    }
  );
}

export function getDeviceModel(namespace: string, name: string) {
  return request<DeviceModel>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels/${name}`,
    {
      method: "GET",
    }
  );
}

export function createDeviceModel(namespace: string, data: DeviceModel) {
  return request<DeviceModel>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels`,
    {
      method: "POST",
      data,
    }
  );
}

export function updateDeviceModel(namespace: string, name: string, data: DeviceModel) {
  return request<DeviceModel>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels/${name}`,
    {
      method: "PUT",
      data,
    }
  );
}

export function deleteDeviceModel(namespace: string, name: string) {
  return request<Status>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devicemodels/${name}`,
    {
      method: "DELETE",
    }
  );
}
