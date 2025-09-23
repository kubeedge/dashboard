
import type { FormSchema } from '@/components/FormView';
import { listNamespaces } from '@/api/namespace';
import { listSecrets } from '@/api/secret';

export const addSaSchema: FormSchema = {

  fields: [
    {
      name: 'namespace',
      label: 'Namespace *',
      type: 'select',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required', message: 'Miss namespace' }],
      options: async () => {
        const res = await listNamespaces();
        const items = (res?.data?.items ?? []) as any[];
        return items.map(n => ({
          label: n?.metadata?.name,
          value: n?.metadata?.name,
        }));
      },
    },
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required', message: 'Miss name' }],
    },
    {
      name: 'secrets',
      label: 'Secrets *',
      type: 'select',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required', message: 'Miss secret' }],

      options: async (_form: any, values: any) => {
        const ns = values?.namespace;
        if (!ns) return [];
        const res = await listSecrets(ns);
        const items = (res?.data?.items ?? []) as any[];
        return items.map(s => ({
          label: s?.metadata?.name,
          value: s?.metadata?.name,
        }));
      },
    },
  ],
};
