import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';
import { listSecrets } from '@/api/secret';

export const addSaSchema: FormSchema = {
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required' }],
      options: async () => {
        const res = await listNamespaces();
        const items = res?.data?.items || [];
        return items.map(n => ({
          label: n?.metadata?.name || '',
          value: n?.metadata?.name || '',
        }));
      },
    },
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required' }],
    },
    {
      name: 'secrets',
      label: 'table.secret',
      type: 'multi-select',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required' }],
      options: async (_form: any, values: any) => {
        const ns = values?.namespace;
        if (!ns) return [];
        const res = await listSecrets(ns);
        const items = res?.data?.items || [];
        return items.map(s => ({
          label: s?.name,
          value: s?.name,
        }));
      },
      watchFields: ['namespace'],
    },
  ],
};
