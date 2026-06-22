import InputField from "./InputField";
import SelectField from "./SelectField";
import SwitchField from "./SwitchField";
import ArrayField from "./ArrayField";
import RadioField from "./RadioField";

const registry: Record<string, (p: any) => JSX.Element> = {
  text: (p) => <InputField {...p} />,
  password: (p) => <InputField {...p} />,
  textarea: (p) => <InputField {...p} />,
  number: (p) => <InputField {...p} />,
  select: (p) => <SelectField {...p} />,
  'multi-select': (p) => <SelectField {...p} />,
  switch: (p) => <SwitchField {...p} />,
  array: (p) => <ArrayField {...p} />,
  radio: (p) => <RadioField {...p} />,
};

export function getFieldComponent(type: string) {
  return registry[type];
}
