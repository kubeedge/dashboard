import type { FormSchema } from '@/components/FormView';
import { listNamespaces } from '@/api/namespace';

export const addRuleEndpointSchema: FormSchema = {

  resetText: undefined,
  fields: [
    {
      name: 'namespace',
      label: 'Namespace *',
      type: 'select',
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss namespace' }],
      options: async () => {
        const res = await listNamespaces();
        const items = (res?.data?.items ?? []) as any[];
        return items.map((n) => ({
          label: n?.metadata?.name,
          value: n?.metadata?.name,
        }));
      },
    },
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss name' }],
    },
    {
      name: 'type',
      label: 'RuleEndpointType *',
      type: 'select',
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss type' }],
      options: [
        { label: 'rest', value: 'rest' },
        { label: 'eventbus', value: 'eventbus' },
        { label: 'servicebus', value: 'servicebus' },
      ],
    },
  ],
};
