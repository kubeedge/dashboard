

import type { ConfigMap } from '@/types/configMap';

export function toConfigMap(values: any): { ns: string; body: ConfigMap } {
  const ns = values.namespace;

  const labelsEntries = Array.isArray(values.labels) ? values.labels : [];
  const dataEntries   = Array.isArray(values.data)   ? values.data   : [];

  const labels: Record<string, string> = {};
  labelsEntries.forEach((row: any) => {
    if (row?.key) labels[row.key] = String(row.value ?? '');
  });

  const data: Record<string, string> = {};
  dataEntries.forEach((row: any) => {
    if (row?.key) data[row.key] = String(row.value ?? '');
  });

  const body: ConfigMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: values.name,
      namespace: ns,
      ...(Object.keys(labels).length ? { labels } : {}),
    },
    ...(Object.keys(data).length ? { data } : {}),
  };

  return { ns, body };
}
