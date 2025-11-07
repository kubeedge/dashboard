import type { Secret } from '@/types/secret';

export function toSecret(values: any): { ns: string; body: Secret } {
  const ns = values.namespace;
  const data: Record<string, string> = {};
  (values.data || []).forEach((row: any) => { if (row?.key) data[row.key] = String(row.value ?? ''); });

  return {
    ns,
    body: {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name: values.name, namespace: ns },
      type: values.type || 'Opaque',
      data,
    },
  };
}
