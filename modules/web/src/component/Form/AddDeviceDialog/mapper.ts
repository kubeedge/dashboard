import type { Device } from '@/types/device';

export function toDevice(values: any): { ns: string; body: Device } {

  const ns = values?.namespace || values?.ns || '';
  const annotations = values?.description
    ? { description: values.description }
    : undefined;

  const body: Device = {
    apiVersion: 'devices.kubeedge.io/v1alpha2',
    kind: 'Device',
    metadata: {
      name: values.name,
      namespace: ns,
      ...(annotations ? { annotations } : {}),
    },
    spec: {
      deviceModelRef: { name: values.deviceModel },

      protocol: values?.protocol ? { protocolName: values.protocol } : undefined,
      nodeName: values.node,
      properties: (values?.attributes || []).map((it: any) => ({
        name: it.key,
        type: it.type,
        value: it.value,

      })),
    },
  };

  return { ns, body };
}
