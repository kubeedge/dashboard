import type { ObjectMeta, ResourceList, TypeMeta } from "./common";

interface ModelProperty {
  accessMode: string;
  description?: string;
  maximum?: string;
  minimum?: string;
  name: string;
  type: string;
  unit?: string;
}

interface DeviceModelSpec {
  properties?: ModelProperty[];
  protocol: string
}

export interface DeviceModel extends TypeMeta {
  metadata?: ObjectMeta;
  spec: DeviceModelSpec;
}

export interface DeviceModelList extends ResourceList<DeviceModel> {}
