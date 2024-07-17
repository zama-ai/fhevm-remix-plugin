import { ABIParameter } from '@remixproject/plugin-api';

import { Label, TextInput } from '../../../common-ui';

export type InputsProps = {
  values: string[];
  setValues: (values: string[]) => void;
  inputs: (ABIParameter & { indexed: boolean }[]) | ABIParameter[];
};

const isIndexed = (obj: any): obj is { indexed: boolean } => {
  return (obj as { indexed: boolean }).indexed !== undefined;
};

export const Inputs = ({ values, setValues, inputs }: InputsProps) => {
  return (
    <>
      {inputs &&
        inputs.length &&
        inputs.map((v, i) => {
          if (isIndexed(v)) return;
          return (
            <div className="zama_multiArg">
              <Label label={`${v.name}:`} />
              <TextInput
                key={`${v.type}-${i}`}
                className="zama_contractAddressInput"
                placeholder={v.type}
                value={values[i] || ''}
                onChange={(e) => {
                  const cValues = [...values];
                  cValues[i] = e.target.value;
                  setValues(cValues);
                }}
              />
            </div>
          );
        })}
    </>
  );
};
