import { RoleBinding } from "@/types/roleBinding";

export function toRoleBinding(values: any): RoleBinding {
  const body = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'RoleBinding',
    metadata: {
      namespace: values?.namespace,
      name: values?.name,
    },
    roleRef: {
      apiGroup: values?.roleRefApiGroup || '',
      kind: values?.roleRefKind,
      name: values?.roleRefName,
    },
    subjects: values?.subjects,
  };

  return body;
}
