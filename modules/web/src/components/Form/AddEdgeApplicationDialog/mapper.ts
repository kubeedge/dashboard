import yaml from 'js-yaml';



export function toEdgeApplication(values: any) {
  const ns = values.namespace;

  const workloadTemplate = (values.workloadTemplate ?? []).map((w: any) => {
    const obj = safeLoadYaml(w?.manifests);
    return { manifests: obj };
  });

  const targetNodeGroups = (values.targetNodeGroups ?? []).map((t: any) => {
    const obj = safeLoadYaml(t?.overriders);
    return { name: t?.name, overriders: obj };
  });

  const body: any = {
    apiVersion: 'apps.kubeedge.io/v1alpha1',
    kind: 'EdgeApplication',
    metadata: {
      name: values.name,
      namespace: ns,
    },
    spec: {
      ...(workloadTemplate.length ? { workloadTemplate } : {}),
      ...(targetNodeGroups.length ? { targetNodeGroups } : {}),
    },
  };

  return { ns, body };
}

function safeLoadYaml(text: string) {
  if (!text || typeof text !== 'string') return {};
  try {
    const obj = yaml.load(text);
    return obj ?? {};
  } catch (e) {

    return {};
  }
}
