import { RuleEndpoint } from "@/types/ruleEndpoint";

export function toRuleEndpoint(values: any): RuleEndpoint {
  const body = {
    apiVersion: 'rules.kubeedge.io/v1',
    kind: 'RuleEndpoint',
    metadata: {
      name: values?.name,
      namespace: values?.namespace,
    },
    spec: {
      ruleEndpointType: values.type,
      ...(values.type === 'servicebus' && {
        properties: {
          service_port: `${values.servicePort}`,
        },
      }),
    },
  };

  return body;
}
