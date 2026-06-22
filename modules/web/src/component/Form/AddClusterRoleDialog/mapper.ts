import { ClusterRole } from "@/types/clusterRole";

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export const toClusterRole = (data: any): ClusterRole => {
  return {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRole',
    metadata: {
      name: data.name,
    },
    aggregationRule: {
      clusterRoleSelectors: data.matchLabels.map((label: any) => ({
        matchLabels: {
          [label.key]: label.value,
        },
      })),
    },
    rules: data.rules.map((rule: any) => ({
      apiGroups: toArray(rule.apiGroups),
      resources: toArray(rule.resources),
      verbs: toArray(rule.verbs),
      resourceNames: toArray(rule.resourceNames),
      nonResourceURLs: toArray(rule.nonResourceURLs),
    })),
  };
}
