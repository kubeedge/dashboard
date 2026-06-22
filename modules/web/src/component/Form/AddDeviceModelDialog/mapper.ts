import type { DeviceModel } from '@/types/deviceModel';

const typeOptions = {
  int: {
    accessMode: "ReadWrite",
    defaultValue: '1',
    minimum: '1',
    maximum: '5',
    unit: "度",
  },
  string: {
    accessMode: "ReadWrite",
    defaultValue: "default",
  },
  double: {
    accessMode: "ReadWrite",
    defaultValue: "1.0",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  float: {
    accessMode: "ReadWrite",
    defaultValue: "1.0",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  boolean: {
    accessMode: "ReadWrite",
    defaultValue: 'true',
  },
  bytes: {
    accessMode: "ReadWrite",
  },
};

export function toDeviceModel(values: any): DeviceModel {
  const ns = values.namespace;


  const body: DeviceModel = {
    apiVersion: "devices.kubeedge.io/v1beta1",
    kind: "DeviceModel",
    metadata: {
      name: values.name,
    },
    spec: {
      protocol: values.protocol,
      properties: [
        {
          name: values.attributeName,
          description: values.description,
          type: values.attributeType,
          ...((typeOptions as any)[values.attributeType] || {}),
        },
      ],
    },
  };

  return body;
}
