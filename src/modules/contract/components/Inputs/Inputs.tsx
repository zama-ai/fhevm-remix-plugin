import { ABIParameter } from '@remixproject/plugin-api';

import { Accordion, Button, Label, Loader, Result, TextInput } from '../../../common-ui';
import { ReactNode, useState } from 'react';

import './Inputs.css';

export type InputsProps = {
  values: string[];
  setValues: (values: string[]) => void;
  inputs: (ABIParameter & { indexed: boolean }[]) | ABIParameter[];
  onClick: () => Promise<void | string>;
  name: string;
  variant?: 'primary' | 'warning';
  titleButton?: boolean;
};

const isIndexed = (obj: any): obj is { indexed: boolean } => {
  return (obj as { indexed: boolean }).indexed !== undefined;
};

export const Inputs: React.FC<InputsProps> = ({
  values,
  setValues,
  inputs,
  name,
  onClick,
  variant = 'primary',
  titleButton = false,
}) => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const onClickProp = async () => {
    setLoading(true);
    try {
      const res = await onClick();
      console.log(res);
      if (res) setResult(res.toString());
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  let headerLabel: ReactNode = name;
  if (titleButton) {
    headerLabel = (
      <Button onClick={onClickProp} variant={variant} disabled>
        {name}
      </Button>
    );
  }
  return (
    <>
      <Accordion label={headerLabel} labelOpen={name}>
        {inputs &&
          inputs.length > 0 &&
          inputs.map((v, i) => {
            if (isIndexed(v)) return;
            return (
              <div className="zama_multiArg" key={`${v.name}-${i}`}>
                <Label label={`${v.name}`} />
                <TextInput
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
        <div className="d-flex zama_multiArg">
          {loading && <Loader />}
          <Button onClick={onClickProp} variant={variant}>
            Submit
          </Button>
        </div>
        {result && <Result value={result} />}
      </Accordion>
    </>
  );
};
