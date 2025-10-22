import type { ClusterRoleBinding } from '@/types/clusterRoleBinding';


export function toClusterRoleBinding(values: any) {
  const name = values?.name?.trim();

  const roleRef = {
    apiGroup: values?.roleRefApiGroup || 'rbac.authorization.k8s.io',
    kind: values?.roleRefKind || 'ClusterRole',
    name: values?.roleRefName || '',
  };

  const subjects = (values?.subjects ?? []).map((s: any) => ({
    kind: s?.kind,
    name: s?.name,
    namespace: s?.namespace,
    apiGroup: s?.apiGroup,
  }));

  const body: ClusterRoleBinding | any = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRoleBinding',
    metadata: { name },
    roleRef,
    subjects,
  };

  return { body };
}
