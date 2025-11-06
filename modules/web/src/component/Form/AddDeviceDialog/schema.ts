import type { FormSchema } from '@/component/FormView';
import { listNodes } from '@/api/node';
import { listDeviceModels } from '@/api/deviceModel';

export const addDeviceSchema: FormSchema = {
  submitText: undefined,
  resetText: undefined,
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss name' }],
      grid: { md: 12 },
    },
    {
      name: 'deviceModel',
      label: 'Device Type',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss device type' }],
      grid: { md: 12 },
      options: async () => {
        const res = await listDeviceModels(/*  namespace: values?.namespace */);
        return (res?.items ?? []).map((m: any) => ({
          label: m?.metadata?.name,
          value: m?.metadata?.name,
        }));
      },
    },
    {
      name: 'protocol',
      label: 'Protocol',
      type: 'text',     // or select
      grid: { md: 12 },
    },
    {
      name: 'node',
      label: 'Node',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss node' }],
      grid: { md: 12 },
      options: async () => {
        const res = await listNodes();
        return (res?.items ?? []).map((n: any) => ({
          label: n?.metadata?.name,
          value: n?.metadata?.name,
        }));
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      grid: { md: 12 },
      rows: 6,
    },
    {
      //  Attributes
      name: 'attributes',
      label: '',
      type: 'array',
      addText: '+ ADD A ROW OF DATA',
      grid: { md: 12 },
      itemSchema: [
        { name: 'key', label: 'AttributeName', type: 'text', rules: [{ type: 'required', message: 'Miss key' }], grid: { md: 4 } },
        {
          name: 'type', label: 'Type', type: 'select', rules: [{ type: 'required', message: 'Miss type' }], grid: { md: 2 },
          options: [
            { label: 'string', value: 'string' },
            { label: 'int', value: 'int' },
            { label: 'float', value: 'float' },
            { label: 'boolean', value: 'boolean' },
          ],
        },
        { name: 'value', label: 'AttributeValue', type: 'text', rules: [{ type: 'required', message: 'Miss value' }], grid: { md: 6 } },
      ],
    },
  ],
};
