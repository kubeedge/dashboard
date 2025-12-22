import type { Device } from '@/types/device';

export function toDevice(namespace: string | undefined, values: any): Device {
  const annotations = values?.description
    ? { description: values.description }
    : undefined;

  const body: Device = {
    apiVersion: "devices.kubeedge.io/v1beta1",
    kind: "Device",
    metadata: {
      labels: {
        description: values.description,
      },
      name: values.name,
      namespace: namespace || 'default',
    },
    spec: {
      deviceModelRef: {
        name: values.deviceModel,
      },
      nodeName: values.node,
      protocol: {
        protocolName: values.protocol,
      },
    },
    status: {
      twins: values.attributes?.map((item: any) => {
        return {
          observedDesired: {
            metadata: {
              type: item.type,
            },
            value: item.attributeValue,
          },
          propertyName: item.attributeName,
          reported: {
            metadata: {
              type: item.type,
            },
            value: item.attributeValue,
          },
        };
      }),
    },
  };

  return body;
}
