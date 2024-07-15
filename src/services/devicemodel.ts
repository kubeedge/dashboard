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

export function getDeviceModel(namespaces: string, name: string) {
  return request<DeviceModel>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespaces}/devicemodels/${name}`,
    {
      method: "GET",
    }
  );
}

export function createDeviceModel(namespaces: string, data: object) {
  return request<DeviceModel>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespaces}/devicemodels`,
    {
      method: "POST",
      data,
    }
  );
}

export function deleteDeviceModel(namespaces: string, name: string) {
  return request<Status>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespaces}/devicemodels/${name}`,
    {
      method: "DELETE",
    }
  );
}
