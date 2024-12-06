import { useEffect, useState } from 'react';
import { IconCopy } from '../IconCopy';
import { useFhevmjs, useWeb3 } from '../../../utils';

import './Result.css';
import { getAddress } from 'ethers';

export type ResultProps = {
  value: string;
  contractAddress: string;
};

export const Result: React.FC<ResultProps> = ({ value, contractAddress }) => {
  const [decryption, setDecryption] = useState<string>();
  const { account } = useWeb3();
  const { reencrypt, gatewayUrl } = useFhevmjs();

  useEffect(() => {
    setDecryption('');
  }, [value]);

  return (
    <div className="zama__result">
      {!decryption && <span className="zama_value mx-1">{value || '0'}</span>}
      {decryption && <span className="zama_decrypted mx-1">{decryption} (decrypted)</span>}
      <IconCopy value={value} />
      {gatewayUrl && (
        <span
          onClick={async () => {
            const dec = await reencrypt(getAddress(contractAddress), getAddress(account!), BigInt(value));
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
