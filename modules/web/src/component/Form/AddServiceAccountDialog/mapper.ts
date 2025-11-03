import type { ServiceAccount } from '@/types/serviceAccount';

export function toServiceAccount(values: any): { ns: string; body: ServiceAccount | any } {
  const ns = values?.namespace || '';
  const body: ServiceAccount = {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      name: values?.name,
      namespace: ns,
    },
    secrets: values?.secret ? [{ name: values.secret }] : [],
  };

  return { ns, body };
}
