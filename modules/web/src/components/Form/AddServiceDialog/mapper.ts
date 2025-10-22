
import type { Service } from '@/types/service';

type PortForm = {
  name?: string;
  port: number;
  targetPort?: string | number;
  protocol?: 'TCP' | 'UDP' | 'SCTP';
  nodePort?: number;
};

export function toService(values: any): { ns: string; body: any } {
  const ns = values?.namespace || '';
  const type = values?.serviceType; // 'ClusterIP' | 'NodePort' | 'Headless'

  // labels/annotations/selectors
  const kv = (arr?: Array<{ key: string; value: string }>) =>
    (arr ?? []).reduce((acc, it) => {
      if (it?.key) acc[it.key] = it?.value ?? '';
      return acc;
    }, {} as Record<string, string>);

  const metadata: any = {
    name: values?.name,
    namespace: ns,
    annotations: kv(values?.annotations),
    labels: kv(values?.labels),
  };

  // ports
  const ports = (values?.ports ?? []).map((p: PortForm) => {
    const base: any = {
      name: p?.name,
      port: Number(p?.port),
      protocol: p?.protocol || 'TCP',
    };
    if (p?.targetPort !== undefined && p?.targetPort !== '') {

      const num = Number(p.targetPort);
      base.targetPort = Number.isNaN(num) ? p.targetPort : num;
    }
    if (type === 'NodePort' && p?.nodePort) {
      base.nodePort = Number(p.nodePort);
    }
    return base;
  });

  // selectors
  const selector = kv(values?.selectors);


const publishNotReady =
  values.publishNotReadyAddresses === 'true'
    ? true
    : values.publishNotReadyAddresses === 'false'
      ? false
      : undefined;




const spec: any = {
  ports,
  selector,
  type,
};


if (publishNotReady !== undefined) {
  spec.publishNotReadyAddresses = publishNotReady;
}


if (type === 'Headless') {
  spec.clusterIP = 'None';
} else {



  if (Array.isArray(values.externalIPs) && values.externalIPs.length > 0) {
    spec.externalIPs = values.externalIPs
      .map((x: any) => x?.ip)
      .filter((x: any) => !!x);
  }


  if (values.sessionAffinity && values.sessionAffinity !== 'None') {
    spec.sessionAffinity = values.sessionAffinity;
  }
}


  const body: Service | any = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata,
    spec,
  };

  return { ns, body };
}
