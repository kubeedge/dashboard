import type { FormSchema } from '@/component/FormView';
import { NamespaceList } from '@/types/namespace';

export const addRuleEndpointSchema = (namespaces?: NamespaceList): FormSchema => ({
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      grid: { md: 12 },
      rules: [{ type: 'required' }],
      options: () => {
        return (namespaces?.items || [])?.map((n) => ({
          label: n?.metadata?.name || '',
          value: n?.metadata?.name || '',
        }));
      },
    },
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      grid: { md: 12 },
      rules: [{ type: 'required' }],
    },
    {
      name: 'type',
      label: 'table.ruleEndpointType',
      type: 'select',
      grid: { md: 12 },
      rules: [{ type: 'required' }],
      options: [
        { label: 'rest', value: 'rest' },
        { label: 'eventbus', value: 'eventbus' },
        { label: 'servicebus', value: 'servicebus' },
      ],
    },
    {
      name: 'servicePort',
      label: 'table.servicePort',
      type: 'text',
      grid: { md: 12 },
      visibleWhen: (values) => values?.type === 'servicebus',
    }
  ],
});
