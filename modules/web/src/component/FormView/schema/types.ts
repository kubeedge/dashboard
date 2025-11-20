export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'date'
  | 'switch'
  | 'textarea'
  | 'password'
  | 'radio'
  | 'checkbox'
  | 'multi-select'
  | 'array';

export type Rule =
  | { type: 'required'; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'in'; values: any[]; message?: string }
  | { type: 'regex'; value: RegExp; message?: string }
  | { type: 'custom'; fn: (val: any, form: any) => true | string };

export interface FieldOption { label: string; value: string | number; disabled?: boolean }

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  rules?: Rule[];
  ruleIf?: { field: string; value: string };
  options?:
  | { label: string; value: any }[]
  | (() => Promise<{ label: string; value: any }[]>)
  | (() => { label: string; value: any }[]);
  fullWidth?: boolean;
  grid?: { xs?: number; sm?: number; md?: number; lg?: number };
  visibleWhen?: (form: any) => boolean;
  disabledWhen?: (form: any) => boolean;
  itemSchema?: ArrayItemField[];
  addText?: string;
  removeText?: string;
  rows?: number;
  inlineRemove?: boolean;
  props?: Record<string, any>;
}

export interface FormSchema {
  fields: FieldSchema[];
  layout?: 'vertical' | 'horizontal';
  submitText?: string;
  resetText?: string;
}

export interface ArrayItemField
  extends Omit<FieldSchema, 'visibleWhen' | 'disabledWhen'> {
  visibleWhen?: FieldSchema['visibleWhen'];
  disabledWhen?: FieldSchema['disabledWhen'];
}
