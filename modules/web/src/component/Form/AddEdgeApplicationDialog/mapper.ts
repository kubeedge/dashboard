import { EdgeApplication } from '@/types/edgeApplication';
import yaml from 'js-yaml';

function safeLoadYaml(text: string) {
  if (!text || typeof text !== 'string') return {};
  try {
    const obj = yaml.load(text);
    return obj ?? {};
  } catch (e) {
    return {};
  }
}

export function toEdgeApplication(values: any): EdgeApplication {
  const body: any = {
    apiVersion: 'apps.kubeedge.io/v1alpha1',
    kind: 'EdgeApplication',
    metadata: {
      namespace: values.namespace,
      name: values.name,
    },
    spec: {
      workloadScope: {
        targetNodeGroups: values.targetNodeGroups?.map((nodeGroup: any) => ({
          name: nodeGroup.name,
          overrides: safeLoadYaml(nodeGroup.overriders),
        })),
      },
      workloadTemplate: {
        manifests: values.workloadTemplate?.map((template: any) => safeLoadYaml(template.manifests)),
      },
    }
  }

  return body;
}
