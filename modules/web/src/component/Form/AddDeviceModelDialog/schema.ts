import type { FormSchema } from '@/components/FormView';

export const deviceModelSchema: FormSchema = {
  submitText: 'save',
  resetText: 'reset',
  fields: [
    { name: 'name', label: 'Name', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
    { name: 'namespace', label: 'Namespace', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },

    { name: 'protocol', label: 'Protocol', type: 'text', grid: { md: 6 } },

    { name: 'description', label: 'Description', type: 'textarea', grid: { md: 12 } },

    {
      name: 'attributes',
      label: 'Attribute list',
      type: 'array',
      itemSchema: [
        {
          name: 'name',
          label: 'Attribute Name',
          type: 'text',
          rules: [{ type: 'required', message: 'Attribute Name' }],
          grid: { md: 6 },
        },
        {
          name: 'type',
          label: 'Attribute Type',
          type: 'select',

          options: [
            { label: 'string', value: 'string' },
            { label: 'int', value: 'int' },
            { label: 'float', value: 'float' },
            { label: 'boolean', value: 'boolean' },
          ],
          rules: [{ type: 'required', message: 'Attribute Type' }],
          grid: { md: 6 },
        },
      ],
      grid: { md: 12 },
    },
  ],
};
