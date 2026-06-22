import type { Service } from '@/types/service';

export function toService(values: any): Service {
  const body = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: values?.name,
      namespace: values?.namespace,
      annotations: values?.annotations?.reduce((acc: any, annotation: any) => {
        acc[annotation?.key] = annotation?.value;
        return acc;
      }, {} as any),
      labels: values?.labels?.reduce((acc: any, label: any) => {
        acc[label?.key] = label?.value;
        return acc;
      }, {} as any),
    },
    spec: {
      type: values?.serviceType,
      ports: values?.ports.map((port: any) => ({
        protocol: port?.protocol,
        name: port?.name,
        port: Number(port?.port),
        nodePort: values?.serviceType === 'NodePort' && port?.nodePort ? Number(port?.nodePort) : undefined,
        targetPort: port?.targetPort ? Number(port?.targetPort) : undefined,
      })),
      selector: values?.selectors?.reduce((acc: any, selector: any) => {
        acc[selector?.key] = selector?.value;
        return acc;
      }, {} as any),
      publishNotReadyAddresses: values?.publishNotReadyAddresses === 'True',
      sessionAffinity: values?.sessionAffinity,
      sessionAffinityConfig: values?.sessionAffinity === 'ClientIP' ? { clientIP: { timeoutSeconds: Number(values?.timeoutSeconds) } } : undefined,
      externalIPs: values?.externalIPs ? values?.externalIPs?.map((v: any) => v.ip) : undefined,
    },
  }

  return body;
}
