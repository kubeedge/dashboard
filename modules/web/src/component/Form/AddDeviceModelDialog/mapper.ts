import type { DeviceModel } from '@/types/deviceModel';

function toPropertyType(t: string) {
  switch ((t || '').toLowerCase()) {
    case 'string':
      return { string: {} };
    case 'int':
      return { int: {} };
    case 'float':
      return { float: {} };
    case 'boolean':
      return { boolean: {} };
    default:
      return { string: {} };
  }
}

export function toDeviceModel(values: any): { ns: string; body: DeviceModel } {
  const ns = values.namespace;

  const attrList: Array<{ name: string; type: any }> = Array.isArray(values.attributes)
    ? values.attributes
    : [];

  const properties = attrList
    .filter((row) => row && row.name)
    .map((row) => ({
      name: String(row.name),
      type: toPropertyType(row.type),
    }));

  const body: DeviceModel = {
    apiVersion: 'devices.kubeedge.io/v1alpha2',
    kind: 'DeviceModel',
    metadata: {
      name: values.name,
      namespace: ns,
      annotations: {
        ...(values.description ? { 'dashboard.kubeedge.io/description': String(values.description) } : {}),
        ...(values.protocol ? { 'dashboard.kubeedge.io/protocol': String(values.protocol) } : {}),
      },
    },
    spec: {
      ...(properties.length ? { properties } : {}),
    } as any,
  };

  return { ns, body };
}
