import { FunctionDescription, ABIDescription } from '@remixproject/plugin-api';
import { ContractFunction } from '../ContractFunction';
import { FunctionFragment } from 'ethers';
import { Accordion, IconCopy, IconDelete } from '../../../common-ui';
import { useWeb3, useFhevmjs, Parameter, createTransaction } from '../../../utils';
import './ContractInterface.css';
import { Contract } from 'ethers';

export type ContractInterfaceProps = {
  contractAddress: string;
  abi: ABIDescription[];
  name: string;
  onDelete: () => void;
};

export const ContractInterface: React.FC<ContractInterfaceProps> = ({ contractAddress, name, abi, onDelete }) => {
  const { account, provider } = useWeb3();
  const { encryptParameters } = useFhevmjs();

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
          <span>
            {name} at {contractAddress}
          </span>
          <IconCopy value={contractAddress} />
          <IconDelete onDelete={onDelete} />
        </>
      }
      containerClassName="contractinterface"
      left
    >
      {functionABI.map((desc, i) => {
        const onTransaction = async (values: Parameter[]) => {
          if (!desc.name) return;
          const contract = new Contract(contractAddress, abi, await provider!.getSigner());
          const fragment = FunctionFragment.from(desc);
          const name = fragment.format();
          if (desc.stateMutability !== 'view') {
            const tx = await createTransaction(contract[name], ...encryptParameters(contractAddress, account!, values));
            await tx.wait();
          } else {
            const res = await contract[name](...encryptParameters(contractAddress, account!, values));
            return res;
          }
        };
        return (
          <ContractFunction
            abiDescription={desc}
            onTransaction={onTransaction}
            contractAddress={contractAddress}
            key={`${desc.name}-${i}`}
          />
        );
      })}
    </Accordion>
  );
};
