import { FunctionDescription, ABIDescription } from '@remixproject/plugin-api';
import { ContractFunction } from '../ContractFunction';
import { FunctionFragment, getAddress } from 'ethers';
import { Accordion, IconCopy, IconDelete } from '../../../common-ui';
import {
  useWeb3,
  useFhevmjs,
  Parameter,
  createTransaction,
  useRemix,
  formatParameters,
} from '../../../utils';
import './ContractInterface.css';
import { Contract } from 'ethers';

export type ContractInterfaceProps = {
  contractAddress: string;
  abi: ABIDescription[];
  name: string;
  onDelete: () => void;
};

export const ContractInterface: React.FC<ContractInterfaceProps> = ({
  contractAddress,
  name,
  abi,
  onDelete,
}) => {
  const { account, provider } = useWeb3();
  const { encryptParameters } = useFhevmjs();
  const { log, info, error } = useRemix();

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
          if (values.some((v) => v.value === '' && v.flag !== 'inputProof'))
            return;
          const contract = new Contract(
            contractAddress,
            abi,
            await provider!.getSigner(),
          );
          const fragment = FunctionFragment.from(desc);
          const name = fragment.format();
          const parameters = await encryptParameters(
            getAddress(contractAddress),
            getAddress(account!),
            values,
          );
          if (desc.stateMutability !== 'view') {
            log('Sending transaction');
            log(`Contract address: ${contractAddress}`);
            log(`Method: ${name}`);
            if (parameters.length > 0)
              log(`Params: ${formatParameters(parameters)}`);
            try {
              const tx = await createTransaction(contract[name], ...parameters);
              log('Waiting for transaction...');
              await tx.wait();
              info('Transaction succeeded!');
            } catch (e) {
              error('Transaction failed!');
            }
          } else {
            log('Calling');
            log(`Contract address: ${contractAddress}`);
            log(`Method: ${name}`);
            if (parameters.length > 0)
              log(`Params: ${formatParameters(parameters)}`);
            try {
              const res = await contract[name](...parameters);
              info(`Result: ${res.toString()}`);
              return res;
            } catch (e) {
              error('Call failed!');
            }
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
