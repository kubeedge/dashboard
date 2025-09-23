
export function toRuleEndpoint(values: any): { ns: string; body: any } {
  const ns = values?.namespace || '';


  const body = {
    apiVersion: 'rules.kubeedge.io/v1',
    kind: 'RuleEndpoint',
    metadata: {
      name: values?.name,
      namespace: ns,
    },
    spec: {
      type: values?.type,
      properties: undefined,
    },
  };

  return { ns, body };
}
