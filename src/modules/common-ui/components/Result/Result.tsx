import { useEffect, useState } from 'react';
import { IconCopy } from '../IconCopy';
import './Result.css';
import { reencrypt } from '../../../utils';
import { hasGateway } from '../../../../fhevmjs';

export type ResultProps = {
  value: string;
  userAddress: string;
  contractAddress: string;
};

export const Result: React.FC<ResultProps> = ({ value, userAddress, contractAddress }) => {
  const [decryption, setDecryption] = useState<string>();

  useEffect(() => {
    setDecryption('');
  }, [value]);

  console.log(hasGateway());

  return (
    <div className="zama__result">
      {!decryption && <span className="zama_value mx-1">{value}</span>}
      {decryption && <span className="zama_decrypted mx-1">{decryption} (decrypted)</span>}
      <IconCopy value={value} />
      {hasGateway() && (
        <span
          onClick={async () => {
            const dec = await reencrypt(contractAddress, userAddress, BigInt(value));
            setDecryption(dec?.toString());
          }}
          className="zama_reencrypt"
        >
          Reencrypt
        </span>
      )}
    </div>
  );
};
