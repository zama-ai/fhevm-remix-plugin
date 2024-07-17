import { BrowserProvider, ContractFactory } from 'ethers';
import { useEffect, useState } from 'react';
import { ABIDescription } from '@remixproject/plugin-api';
import classNames from 'classnames';
import { useRemix } from '../../../../remix';
import { Button, TextInput } from '../../../common-ui';

import './Contract.css';
import { Inputs } from '../Inputs';

export type ContractProps = {
  provider: BrowserProvider;
  account: string;
};

export const Contract = ({ provider, account }: ContractProps) => {
  const [deployVisible, setDeployVisible] = useState(false);
  const [name, setName] = useState<string>();
  const [abi, setAbi] = useState<ABIDescription[]>();
  const [bytecode, setBytecode] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [inputContractAddress, setInputContractAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');

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
            console.log(currentAbi);
            setAbi(currentAbi);
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
    console.log('ok', abi, bytecode);
    if (!abi || !bytecode) return;
    const contractFactory = new ContractFactory(abi, bytecode, await provider.getSigner());
    const c = await contractFactory.deploy(...constructorValues);
    await c.waitForDeployment();
    const addr = await c.getAddress();
    setContractAddress(addr);
    setInputContractAddress(addr);
  };

  if (!abi || !bytecode || !name) {
    return <div>You need to select and compile a contract.</div>;
  }

  return (
    <div>
      <p>{name}</p>

      <div className="zama_contractActionsContainerMultiInner text-dark">
        <div
          className="zama_multiHeader"
          onClick={() => {
            setDeployVisible(!deployVisible);
          }}
        >
          <div className="zama_multiTitle run-instance-multi-title">Deploy</div>
          <i
            className={classNames('fas zama_methCaret', {
              'fa-angle-up': deployVisible,
              'fa-angle-down': !deployVisible,
            })}
          ></i>
        </div>
        <div style={{ display: deployVisible ? 'block' : 'none' }}>
          {abi[0].inputs && (
            <Inputs values={constructorValues} setValues={setConstructorValues} inputs={abi[0].inputs} />
          )}
          <div className="d-flex zama_multiArg">
            <div>
              <Button variant="warning" onClick={onDeploy}>
                Deploy
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2 d-flex flex-column zama_contractAddress">
        <div className="d-flex flex-row">
          <Button
            onClick={() => {
              setContractAddress(inputContractAddress);
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

      <div></div>
    </div>
  );
};
