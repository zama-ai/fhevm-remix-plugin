import { getAddress, isAddress } from 'ethers';
import { useEffect, useState } from 'react';
import { ABIDescription, FunctionDescription } from '@remixproject/plugin-api';
import { useWeb3, useFhevmjs, Parameter, useRemix, LOCALSTORAGE_GATEWAY } from '../../../utils';
import { Button, Label, TextInput } from '../../../common-ui';
import { Inputs } from '../Inputs';
import { ContractInterface } from '../ContractInterface';

import './Contract.css';
import { ContractFactory } from 'ethers';

export type ContractItem = { address: string; abi: ABIDescription[]; name: string };

export const Contract = ({}) => {
  const { account, provider } = useWeb3();
  const { remixClient } = useRemix();
  const [name, setName] = useState<string>();
  const [abi, setAbi] = useState<ABIDescription[]>();
  const [bytecode, setBytecode] = useState<string>();
  const [constructor, setConstructor] = useState<FunctionDescription | undefined>();

  const [inputContractAddress, setInputContractAddress] = useState<string>('');

  const [gateway, setGateway] = useState<string>(window.localStorage.getItem(LOCALSTORAGE_GATEWAY) || '');
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);

  const [constructorValues, setConstructorValues] = useState<Parameter[]>([]);

  const { encryptParameters, updateGatewayUrl } = useFhevmjs();

  useEffect(() => {
    if (constructor && constructor.inputs && constructor.inputs.length > 0) {
      setConstructorValues(constructor.inputs.map(() => ({ value: '', flag: '' })));
    }
  }, [constructor]);

  const cleanState = () => {
    setConstructorValues([]);
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
            setConstructor(construct);
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
    const contractFactory = new ContractFactory(abi, bytecode, await provider!.getSigner());
    const c = await contractFactory.deploy(
      ...encryptParameters('0xCE835273d4A97d324A11e30BC900c43C1c1269F9', account!, constructorValues)
    );
    await c.waitForDeployment();
    const addr = await c.getAddress();
    const copiedAbi = structuredClone(abi);
    setContractItems([...contractItems, { address: addr, abi: copiedAbi, name: name! }]);
  };

  const refreshInstance = async () => {
    updateGatewayUrl(gateway);
  };

  let contractSection = <div>You need to select and compile a contract.</div>;
  if (abi && bytecode && name) {
    contractSection = (
      <>
        <div className="form-check-label">{name}</div>
        <div className="zama_contractActionsContainerMultiInner text-dark">
          <Inputs
            values={constructorValues}
            setValues={setConstructorValues}
            inputs={constructor?.inputs || []}
            variant="warning"
            name="Deploy"
            onClick={onDeploy}
            contractAddress={'0x'}
          />
        </div>
        <div className="d-flex flex-column zama_contractAddress">
          <div className="d-flex flex-row">
            <Button
              onClick={() => {
                try {
                  if (!inputContractAddress) return;
                  const checksumAddress = getAddress(inputContractAddress);
                  const copiedAbi = structuredClone(abi);
                  if (isAddress(checksumAddress) && contractItems.every((c) => c.address !== checksumAddress)) {
                    setContractItems([...contractItems, { address: checksumAddress, abi: copiedAbi, name: name }]);
                  }
                } catch (e) {}
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
        {contractItems.map((contractItem) => {
          const onDelete = () => {
            setContractItems(contractItems.filter((c) => c.address !== contractItem.address));
          };
          return (
            <ContractInterface
              name={contractItem.name}
              contractAddress={contractItem.address}
              abi={contractItem.abi}
              key={contractItem.address}
              onDelete={onDelete}
            />
          );
        })}
      </>
    );
  }

  return (
    <div>
      <div className="links_issue mt-2">
        <a href="https://github.com/zama-ai/fhevm-remix-plugin/issues" rel="nofollow" target="_blank">
          🚩 an issue?
        </a>
      </div>
      <div className="p-2 my-2 Connect__account">
        Connected with:
        <br />
        {account}
        <br />
        <a href="https://remix.zama.ai/disconnect" target="_blank">
          Disconnect
        </a>
      </div>
      <div>
        <Label className="mt-2" label="Gateway" />
        <TextInput
          placeholder="Gateway URL"
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
