import type { FormSchema } from '@/component/FormView';
import { ConciseSecretList } from '@/types/secret';
import { NamespaceList } from '@/types/namespace';

export const addSaSchema = (namespaces?: NamespaceList, secrets?: ConciseSecretList): FormSchema => ({
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      fullWidth: true,
      grid: { xs: 12, sm: 12, md: 12 },
      rules: [{ type: 'required' }],
      options: () => {
        return (namespaces?.items || []).map(n => ({
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
      options: () => {
        return (secrets?.items || []).map(s => ({
          label: s?.name || '',
          value: s?.name || '',
        }));
      },
    },
  ],
});
