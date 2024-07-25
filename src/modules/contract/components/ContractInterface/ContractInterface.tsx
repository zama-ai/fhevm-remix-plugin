import { FunctionDescription, ABIDescription } from '@remixproject/plugin-api';
import { ContractFunction } from '../ContractFunction';
import { Contract, BrowserProvider, FunctionFragment } from 'ethers';
import { createTransaction, encryptParameters, Parameter } from '../../../utils';
import { Accordion, IconCopy } from '../../../common-ui';

import './ContractInterface.css';

export type ContractInterfaceProps = {
  contractAddress: string;
  account: string;
  abi: ABIDescription[];
  provider: BrowserProvider;
};

export const ContractInterface: React.FC<ContractInterfaceProps> = ({ contractAddress, abi, account, provider }) => {
  const functionABI: FunctionDescription[] = (
    abi.filter((desc) => desc.type === 'function') as FunctionDescription[]
  ).sort((a, b) => {
    if (a.stateMutability !== b.stateMutability) {
      if (a.stateMutability === 'view') return 1;
      if (b.stateMutability === 'view') return -1;
    }
    return 0;
  });

  return (
    <Accordion
      label={
        <>
          {contractAddress.substring(0, 20)}...
          <IconCopy value={contractAddress} />
        </>
      }
      containerClassName="contractinterface"
    >
      {functionABI.map((desc, i) => {
        const onTransaction = async (values: Parameter[]) => {
          if (!desc.name) return;
          const contract = new Contract(contractAddress, abi, await provider.getSigner());
          const fragment = FunctionFragment.from(desc);
          const name = fragment.format();
          if (desc.stateMutability !== 'view') {
            const tx = await createTransaction(contract[name], ...encryptParameters(contractAddress, account, values));
            await tx.wait();
          } else {
            const res = await contract[name](...values);
            return res;
          }
        };
        return <ContractFunction abiDescription={desc} onTransaction={onTransaction} key={`${desc.name}-${i}`} />;
      })}
    </Accordion>
  );
};
