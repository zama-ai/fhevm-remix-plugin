import { BrowserProvider, ContractFactory, getAddress, isAddress } from 'ethers';
import { useEffect, useState } from 'react';
import { ABIDescription, FunctionDescription } from '@remixproject/plugin-api';
import classNames from 'classnames';
import { useRemix } from '../../../../remix';
import { Button, TextInput } from '../../../common-ui';

import './Contract.css';
import { Inputs } from '../Inputs';
import { ContractInterface } from '../ContractInterface';

export type ContractProps = {
  provider: BrowserProvider;
  account: string;
};

export const Contract = ({ provider, account }: ContractProps) => {
  const [name, setName] = useState<string>();
  const [abi, setAbi] = useState<ABIDescription[]>();
  const [bytecode, setBytecode] = useState<string>();
  const [constructor, setConstructor] = useState<FunctionDescription>();

  const [inputContractAddress, setInputContractAddress] = useState<string>('');
  const [contractAddresses, setContractAddresses] = useState<string[]>([]);

  const [constructorValues, setConstructorValues] = useState<string[]>([]);

  const { remixClient } = useRemix();

  const refreshAbi = () => {
    remixClient.solidity.getCompilationResult().then((result) => {
      const target = result.source?.target;
      if (target) {
        const contracts = result.data?.contracts[target];
        if (contracts) {
          const names = Object.keys(contracts);
          const name = names[0];
          setName(name);
          const contract = contracts[name];
          const currentAbi = contract.abi;
          if (currentAbi) {
            setAbi(currentAbi);
            const construct = currentAbi.find((desc) => desc.type === 'constructor') as FunctionDescription;
            if (construct) setConstructor(construct);
          }
          const currentBytecode = contract.evm.bytecode.object;
          if (currentBytecode) {
            setBytecode(currentBytecode);
          }
        }
      }
    });
  };

  useEffect(() => {
    remixClient.solidity.on('compilationFinished', refreshAbi);
    refreshAbi();
  }, []);

  const onDeploy = async () => {
    if (!abi || !bytecode) return;
    const contractFactory = new ContractFactory(abi, bytecode, await provider.getSigner());
    const c = await contractFactory.deploy(...constructorValues);
    await c.waitForDeployment();
    const addr = await c.getAddress();
    setContractAddresses([...contractAddresses, addr]);
  };

  if (!abi || !bytecode || !name) {
    return <div>You need to select and compile a contract.</div>;
  }

  return (
    <div>
      <p>{name}</p>

      <div className="zama_contractActionsContainerMultiInner text-dark">
        {constructor && constructor.inputs && constructor.inputs.length > 0 && (
          <Inputs
            values={constructorValues}
            setValues={setConstructorValues}
            inputs={constructor.inputs}
            variant="warning"
            name="Deploy"
            onClick={onDeploy}
          />
        )}
      </div>
      <div className="pt-2 d-flex flex-column zama_contractAddress">
        <div className="d-flex flex-row">
          <Button
            onClick={() => {
              const checksumAddress = getAddress(inputContractAddress);
              console.log(isAddress(checksumAddress));
              if (isAddress(checksumAddress) && contractAddresses.every((c) => c !== checksumAddress)) {
                setContractAddresses([...contractAddresses, checksumAddress]);
              }
            }}
          >
            At address
          </Button>
          <TextInput
            className="zama_contractAddressInput"
            value={inputContractAddress}
            onChange={(e) => {
              setInputContractAddress(e.target.value);
            }}
            placeholder="Load contract from Address"
          />
        </div>
      </div>

      {abi &&
        contractAddresses.map((contractAddress) => (
          <ContractInterface contractAddress={contractAddress} abi={abi} provider={provider} key={contractAddress} />
        ))}
    </div>
  );
};