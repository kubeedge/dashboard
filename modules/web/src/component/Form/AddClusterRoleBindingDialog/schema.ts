import type { FormSchema } from '@/components/FormView';
import { listNamespaces } from '@/api/namespace';

async function nsOptions() {
  const res = await listNamespaces();
  const items = (res?.data?.items ?? []) as any[];
  return items.map(n => ({
    label: n?.metadata?.name,
    value: n?.metadata?.name,
  }));
}

export const addClusterRoleBindingSchema: FormSchema = {

  fields: [
    // Name
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      rules: [{ type: 'required', message: 'Missing name' }],
      fullWidth: true,
      grid: { md: 12 },
    },

    // RoleRef
    {
      name: 'roleRefKind',
      label: 'Kind *',
      type: 'select',

      options: [{ label: 'ClusterRole', value: 'ClusterRole' }],
      defaultValue: 'ClusterRole',
      rules: [{ type: 'required', message: 'Missing roleRef kind' }],
      grid: { xs: 12, sm: 4, md: 3 },
    },
    {
      name: 'roleRefName',
      label: 'Name *',
      type: 'text',
      rules: [{ type: 'required', message: 'Missing roleRef name' }],
      grid: { xs: 12, sm: 4, md: 4 },
    },
    {
      name: 'roleRefApiGroup',
      label: 'ApiGroup',
      type: 'text',
      // rbac
      defaultValue: 'rbac.authorization.k8s.io',
      grid: { xs: 12, sm: 4, md: 5 },
    },

    // Subjects
    {
      name: 'subjects',
      label: 'Subjects',
      type: 'array',
      addText: 'ADD SUBJECT',
      removeText: 'REMOVE',
      itemSchema: [
        {
          name: 'kind',
          label: 'Kind *',
          type: 'select',
          rules: [{ type: 'required', message: 'Missing subject kind' }],
          options: [
            { label: 'ServiceAccount', value: 'ServiceAccount' },
            { label: 'User', value: 'User' },
            { label: 'Group', value: 'Group' },
          ],
          grid: { xs: 12, sm: 6, md: 4 },
        },
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          rules: [{ type: 'required', message: 'Missing subject name' }],
          grid: { xs: 12, sm: 6, md: 4 },
        },
        {
          // Namespace
          name: 'namespace',
          label: 'Namespace *',
          type: 'select',
          options: nsOptions,
          rules: [{ type: 'required', message: 'Miss subject namespace' }],
          grid: { xs: 12, sm: 6, md: 4 },
        },
      ],
    },
  ],
};
