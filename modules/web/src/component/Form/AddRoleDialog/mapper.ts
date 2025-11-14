import { Role } from "@/types/role";

function toArray(v: any): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export function toRole(values: any): Role {
  const body = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'Role',
    metadata: {
      name: values?.name,
      namespace: values?.namespace,
    },
    rules: (values?.rules ?? []).map((r: any) => ({
      verbs: toArray(r?.verbs),
      apiGroups: toArray(r?.apiGroups),
      resources: toArray(r?.resources),
      resourceNames: toArray(r?.resourceNames),
    })),
  };

  return body;
}
