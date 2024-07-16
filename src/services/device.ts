import type { Status } from "@/models/common";
import type { Device, DeviceList} from "@/models/device";
import request from "@/utils/request";

export function listDevices(namespace?: string) {
  return request<DeviceList>(
    `/apis/devices.kubeedge.io/v1beta1${
      namespace ? `/namespaces/${namespace}` : ""
    }/devices`,
    {
      method: "GET",
    }
  );
}

export function getDevice(namespace: string, name: string) {
  return request<Device>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices/${name}`,
    {
      method: "GET",
    }
  );
}

export async function createDevice(namespace: string, data: Device) {
  return request<Device>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices`,
    {
      method: "POST",
      data,
    }
  );
}

export function deleteDevice(namespace: string, name: string) {
  return request<Status>(
    `/apis/devices.kubeedge.io/v1beta1/namespaces/${namespace}/devices/${name}`,
    {
      method: "DELETE",
    }
  );
}
