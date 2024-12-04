import { ABIParameter } from '@remixproject/plugin-api';

import {
  Accordion,
  Button,
  Label,
  Loader,
  Result,
  TextInput,
} from '../../../common-ui';
import { ReactNode, useState } from 'react';

import './Inputs.css';
import { SelectEncrypted } from '../SelectEncrypted';
import classNames from 'classnames';
import { InputProof } from '../InputProof';

const INPUTPROOF_NAMES = [
  'inputProof',
  'proof',
  'zkproof',
  'zkpok',
  'input',
  'proof',
  'data',
  'inputs',
];

export type InputsProps = {
  values: { value: string; flag: string }[];
  setValues: (values: { value: string; flag: string }[]) => void;
  inputs: (ABIParameter & { indexed: boolean }[]) | ABIParameter[];
  onClick: () => Promise<void | string>;
  name: string;
  variant?: 'primary' | 'warning';
  titleButton?: boolean;
  contractAddress: string;
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
  contractAddress,
}) => {
  const [result, setResult] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onClickProp = async () => {
    setLoading(true);
    setResult(undefined);
    try {
      const res = await onClick();
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

  if (values.length < inputs.length) return null;

  return (
    <>
      <Accordion label={headerLabel} labelOpen={name}>
        {inputs &&
          inputs.length > 0 &&
          inputs.map((v, i) => {
            if (isIndexed(v)) return;
            const canEncrypt = v.type === 'bytes32';
            const canInputProof =
              v.type === 'bytes' &&
              INPUTPROOF_NAMES.some((n) =>
                v.name.toLowerCase().includes(n.toLowerCase()),
              );
            return (
              <div className="zama_multiArg" key={`${v.name}-${i}`}>
                <Label label={`${v.name}`} />
                <div
                  className={classNames({
                    zama_inputContainer: true,
                    zama_inputContainer__small: canEncrypt,
                  })}
                >
                  <TextInput
                    placeholder={v.type}
                    value={values[i].value || ''}
                    onChange={(e) => {
                      const cValues = [...values];
                      cValues[i].value = e.target.value;
                      setValues(cValues);
                    }}
                    disabled={values[i].flag === 'inputProof'}
                  />
                  {canEncrypt && (
                    <SelectEncrypted
                      onChange={(flag) => {
                        const cValues = [...values];
                        cValues[i].flag = flag;
                        setValues(cValues);
                      }}
                      selected={values[i].flag}
                    />
                  )}
                  {canInputProof && (
                    <InputProof
                      onClick={() => {
                        const cValues = [...values];
                        if (values[i].flag === 'inputProof') {
                          cValues[i].flag = '';
                        } else {
                          cValues[i].flag = 'inputProof';
                          cValues[i].value = '';
                        }
                        setValues(cValues);
                      }}
                      checked={values[i].flag === 'inputProof'}
                    />
                  )}
                </div>
              </div>
            );
          })}
        <div className="d-flex zama_multiArg my-2">
          {loading && <Loader />}
          <Button onClick={onClickProp} variant={variant}>
            Submit
          </Button>
        </div>
        {result != null && (
          <Result value={result} contractAddress={contractAddress} />
        )}
      </Accordion>
    </>
  );
};
