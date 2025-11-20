import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';

async function nsOptions() {
  const res = await listNamespaces();
  const items = res?.data?.items || [];
  return items.map(n => ({
    label: n?.metadata?.name || '',
    value: n?.metadata?.name || '',
  }));
}

export const addClusterRoleBindingSchema: FormSchema = {
  fields: [
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      fullWidth: true,
      grid: { md: 12 },
    },
    {
      name: 'roleRefKind',
      label: 'table.kind',
      type: 'select',
      options: [{ label: 'table.clusterRole', value: 'ClusterRole' }],
      defaultValue: 'ClusterRole',
      rules: [{ type: 'required' }],
      grid: { xs: 12, sm: 4, md: 3 },
    },
    {
      name: 'roleRefName',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { xs: 12, sm: 4, md: 4 },
    },
    {
      name: 'roleRefApiGroup',
      label: 'table.apiGroup',
      type: 'text',
      defaultValue: 'rbac.authorization.k8s.io',
      grid: { xs: 12, sm: 4, md: 5 },
    },
    {
      name: 'subjects',
      label: 'table.subjects',
      type: 'array',
      addText: 'table.addSubject',
      inlineRemove: true,
      itemSchema: [
        {
          name: 'kind',
          label: 'table.kind',
          type: 'select',
          rules: [{ type: 'required' }],
          options: [
            { label: 'table.serviceAccount', value: 'ServiceAccount' },
            { label: 'table.user', value: 'User' },
            { label: 'table.group', value: 'Group' },
          ],
          grid: { xs: 12, sm: 6, md: 4 },
        },
        {
          name: 'name',
          label: 'table.name',
          type: 'text',
          rules: [{ type: 'required' }],
          grid: { xs: 12, sm: 6, md: 4 },
        },
        {
          name: 'namespace',
          label: 'table.namespace',
          type: 'select',
          options: nsOptions,
          rules: [{ type: 'required' }],
          grid: { xs: 12, sm: 6, md: 4 },
        }
      ],
    }
  ],
};
