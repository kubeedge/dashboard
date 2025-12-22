import { NodeGroup } from "@/types/nodeGroup";

export function toNodeGroup(values: any): NodeGroup {
  const labels: Record<string, string> = {};
  (values.matchLabels || []).forEach((row: any) => {
    if (row?.key) labels[row.key] = String(row.value ?? '');
  });

  const nodes = Array.isArray(values.nodes)
    ? values.nodes
    : values.nodes ? [values.nodes] : [];

  const body: NodeGroup = {
    apiVersion: 'apps.kubeedge.io/v1alpha1',
    kind: 'NodeGroup',
    metadata: {
      name: values.name,
    },
    spec: {
      nodes,
      ...(Object.keys(labels).length ? { matchLabels: labels } : {}),
    },
  };

  return body;
}
