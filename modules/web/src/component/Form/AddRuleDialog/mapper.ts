import type { Rule } from '@/types/rule';

export function toRule(values: any): Rule {
  const body: Rule = {
    apiVersion: 'rules.kubeedge.io/v1',
    kind: 'Rule',
    metadata: {
      namespace: values?.namespace,
      name: values?.name,
      labels: {
        description: values?.description,
      },
    },
    spec: {
      source: values?.source,
      sourceResource: {
        path: values?.sourceResource,
      },
      target: values?.target,
      targetResource: {
        path: values?.targetResource,
      },
    },
  };

  return body;
}
