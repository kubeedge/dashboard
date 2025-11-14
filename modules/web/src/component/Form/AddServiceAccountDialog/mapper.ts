import type { ServiceAccount } from '@/types/serviceAccount';

export function toServiceAccount(values: any): ServiceAccount {
  const namespace = values?.namespace || '';
  const body: ServiceAccount = {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      name: values?.name,
      namespace: namespace,
    },
    secrets: values?.secrets?.map((s: string) => ({ name: s })) || [],
  };

  return body;
}
