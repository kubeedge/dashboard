import type { ConfigMap } from '@/types/configMap';

export function toConfigMap(values: any): ConfigMap {
  const { namespace, name, labels, data } = values;

  const body: ConfigMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      namespace,
      name,
      labels: labels.reduce((acc: any, label: any) => {
        if (label.key && label.value) {
          acc[label.key] = label.value;
        }
        return acc;
      }, {}),
    },
    data: data.reduce((acc: any, datum: any) => {
      if (datum.key && datum.value) {
        acc[datum.key] = datum.value;
      }
      return acc;
    }, {}),
  };

  return body;
}
