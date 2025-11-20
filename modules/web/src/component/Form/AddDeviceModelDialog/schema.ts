import type { FormSchema } from '@/component/FormView';
import { NamespaceList } from '@/types/namespace';

export const deviceModelSchema = (namespaces?: NamespaceList): FormSchema => ({
  fields: [
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 6 },
    },
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 6 },
      options: namespaces?.items?.map(ns => ({
        label: ns?.metadata?.name || '',
        value: ns?.metadata?.name || ''
      })),
    },
    {
      name: 'protocol',
      label: 'table.protocol',
      type: 'text',
      grid: { md: 6 },
    },
    {
      name: 'description',
      label: 'table.description',
      type: 'textarea',
      grid: { md: 12 },
    },
    {
      name: 'attributeName',
      label: 'table.attributeName',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 6 },
    },
    {
      name: 'attributeType',
      label: 'table.attributeType',
      type: 'select',
      options: [
        { label: 'dataTypes.string', value: 'STRING' },
        { label: 'dataTypes.int', value: 'INT' },
        { label: 'dataTypes.float', value: 'FLOAT' },
        { label: 'dataTypes.double', value: 'DOUBLE' },
        { label: 'dataTypes.boolean', value: 'BOOLEAN' },
        { label: 'dataTypes.bytes', value: 'BYTES' },
      ],
      rules: [{ type: 'required' }],
      grid: { md: 6 },
    },
  ],
});
