import { BrowserProvider, ContractFactory, getAddress, isAddress } from 'ethers';
import { useEffect, useState } from 'react';
import { ABIDescription, FunctionDescription } from '@remixproject/plugin-api';
import { useRemix } from '../../../../remix';
import { Button, Label, TextInput } from '../../../common-ui';

import './Contract.css';
import { Inputs } from '../Inputs';
import { ContractInterface } from '../ContractInterface';
import { encryptParameters, Parameter } from '../../../utils';

export type ContractProps = {
  provider: BrowserProvider;
  account: string;
};

export const Contract = ({ provider, account }: ContractProps) => {
  const [name, setName] = useState<string>();
  const [abi, setAbi] = useState<ABIDescription[]>();
  const [bytecode, setBytecode] = useState<string>();
  const [constructor, setConstructor] = useState<FunctionDescription>();

  const [inputContractAddress, setInputContractAddress] = useState<string>(
    '0x89fa7AD8b036af9eFB061f1ea945Da119eC4508F'
  );

  const [gateway, setGateway] = useState<string>('');
  const [contractAddresses, setContractAddresses] = useState<string[]>([]);

  const [constructorValues, setConstructorValues] = useState<Parameter[]>([]);

  const { remixClient } = useRemix();

  useEffect(() => {
    if (constructor && constructor.inputs && constructor.inputs.length > 0) {
      setConstructorValues(constructor.inputs.map(() => ({ value: '', flag: '' })));
    }
  }, [constructor]);

  const cleanState = () => {
    setConstructorValues([]);
    setContractAddresses([]);
  };

  const refreshAbi = () => {
    remixClient.solidity.getCompilationResult().then((result) => {
      const target = result.source?.target;
      if (target) {
        const contracts = result.data?.contracts[target];
        if (contracts) {
          cleanState();
          const names = Object.keys(contracts);
          setName(names[0]);
          const contract = contracts[names[0]];
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
    const c = await contractFactory.deploy(
      ...encryptParameters('0xCE835273d4A97d324A11e30BC900c43C1c1269F9', account, constructorValues)
    );
    await c.waitForDeployment();
    const addr = await c.getAddress();
    setContractAddresses([...contractAddresses, addr]);
  };

  const refreshInstance = () => {};

  let contractSection = <div>You need to select and compile a contract.</div>;
  if (abi && bytecode && name) {
    contractSection = (
      <>
        <div className="form-check-label">{name}</div>
        <div className="zama_contractActionsContainerMultiInner text-dark">
          {constructor && (
            <Inputs
              values={constructorValues}
              setValues={setConstructorValues}
              inputs={constructor.inputs || []}
              variant="warning"
              name="Deploy"
              onClick={onDeploy}
            />
          )}
        </div>
        <div className="d-flex flex-column zama_contractAddress">
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
            <ContractInterface
              name={name}
              contractAddress={contractAddress}
              abi={abi}
              provider={provider}
              account={account}
              key={contractAddress}
            />
          ))}
      </>
    );
  }

  return (
    <div>
      <div>
        <Label className="mt-2" label="Gateway" />
        <TextInput
          placeholder="Gateway"
          value={gateway}
          onChange={(e) => {
            setGateway(e.target.value);
          }}
        />
        <div className="mt-2 mb-2">
          <Button onClick={refreshInstance}>Use this gateway</Button>
        </div>
      </div>
      {contractSection}
    </div>
  );
};
