import { FunctionDescription } from '@remixproject/plugin-api';
import { useEffect, useState } from 'react';
import { Inputs } from '../Inputs';
import { Button, Loader, Result } from '../../../common-ui';
import { Parameter } from '../../../utils';

export type ContractFunctionProps = {
  abiDescription: FunctionDescription;
  onTransaction: (values: any) => Promise<any>;
  account: string;
  contractAddress: string;
};

export const ContractFunction: React.FC<ContractFunctionProps> = ({
  abiDescription,
  onTransaction,
  account,
  contractAddress,
}) => {
  const [values, setValues] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>();

  useEffect(() => {
    if (abiDescription.inputs && abiDescription.inputs.length > 0) {
      setValues(abiDescription.inputs.map(() => ({ value: '', flag: '' })));
    }
  }, [abiDescription]);

  const onClickProp = async () => {
    try {
      return await onTransaction(values);
    } catch (e) {}
  };

  const onClick = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await onTransaction(values);
      console.log(res);
      if (res != undefined) setResult(res.toString());
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div>
      {!!abiDescription.inputs && abiDescription.inputs.length > 0 && (
        <Inputs
          values={values}
          setValues={setValues}
          inputs={abiDescription.inputs}
          name={abiDescription.name!}
          onClick={onClickProp}
          variant={abiDescription.stateMutability === 'view' ? 'primary' : 'warning'}
          titleButton
          account={account}
          contractAddress={contractAddress}
        />
      )}
      {(!abiDescription.inputs || abiDescription.inputs.length === 0) && (
        <div className="d-flex px-2 my-2 zama_multiHeader">
          <Button onClick={onClick} variant={abiDescription.stateMutability === 'view' ? 'primary' : 'warning'}>
            {abiDescription.name}
          </Button>
          {loading && <Loader />}
          {result && <Result value={result} userAddress={account} contractAddress={contractAddress} />}
        </div>
      )}
    </div>
  );
};
