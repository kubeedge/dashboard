import type { FormSchema } from '@/component/FormView';
import { listNodes } from '@/api/node';
import { ConciseDeviceModelList } from '@/types/deviceModel';
import { ConciseNodeList } from '@/types/node';

export const addDeviceSchema = (deviceModels?: ConciseDeviceModelList, nodes?: ConciseNodeList): FormSchema => ({
  fields: [
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'deviceModel',
      label: 'table.deviceModel',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
      options: () => {
        return (deviceModels?.items || []).map((m) => ({
          label: m?.name || '',
          value: m?.name || '',
        }));
      },
    },
    {
      name: 'protocol',
      label: 'table.protocol',
      type: 'text',
      grid: { md: 12 },
    },
    {
      name: 'node',
      label: 'table.node',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
      options: () => {
        return (nodes?.items ?? []).map((n) => ({
          label: n?.name || '',
          value: n?.name || '',
        }));
      },
    },
    {
      name: 'description',
      label: 'table.description',
      type: 'textarea',
      grid: { md: 12 },
      rows: 6,
    },
    {
      name: 'attributes',
      label: '',
      type: 'array',
      addText: 'table.addRowOfData',
      grid: { md: 12 },
      inlineRemove: true,
      itemSchema: [
        {
          name: 'attributeName',
          label: 'table.attributeName',
          type: 'text',
          rules: [{ type: 'required' }],
          grid: { md: 4 },
        },
        {
          name: 'type',
          label: 'table.type',
          type: 'select',
          rules: [{ type: 'required' }],
          grid: { md: 2 },
          options: [
            { label: 'dataTypes.string', value: 'string' },
            { label: 'dataTypes.int', value: 'int' },
            { label: 'dataTypes.double', value: 'double' },
            { label: 'dataTypes.float', value: 'float' },
            { label: 'dataTypes.boolean', value: 'boolean' },
            { label: 'dataTypes.bytes', value: 'bytes' },
          ],
        },
        {
          name: 'attributeValue',
          label: 'table.attributeValue',
          type: 'text',
          rules: [{ type: 'required' }],
          grid: { md: 6 },
        },
      ],
    },
  ],
});
