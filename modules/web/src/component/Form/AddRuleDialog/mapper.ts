import type { Rule } from '@/types/rule';

export function toRule(values: any): { ns: string; body: Rule } {
  const ns = values?.namespace || '';

  //  sourceResource / targetResource
  const srcRes: Record<string, string> = {};
  if (values.sourceResource) srcRes.resource = String(values.sourceResource);

  const tgtRes: Record<string, string> = {};
  if (values.targetResource) tgtRes.resource = String(values.targetResource);

  const body: Rule = {
    apiVersion: 'rules.kubeedge.io/v1alpha1',
    kind: 'Rule',
    metadata: {
      name: values.name,
      namespace: ns,
      annotations: values.description
        ? { description: String(values.description) }
        : undefined,
    },
    spec: {
      source: String(values.source || ''),
      target: String(values.target || ''),
      sourceResource: srcRes,
      targetResource: tgtRes,
    },
  };

  return { ns, body };
}
