import { getInstance } from '../../fhevmjs';

export type Keypair = {
  publicKey: string;
  privateKey: string;
  signature: string;
};

export type Keypairs = {
  [key: string]: Keypair;
};

const keypairs: Keypairs = {};

const createKey = (contractAddress: string, userAddress: string) => `${contractAddress}-${userAddress}`;

export const reencrypt = async (contractAddress: string, userAddress: string, value: bigint) => {
  const instance = getInstance();
  const key = createKey(contractAddress, userAddress);
  let { publicKey, privateKey, signature } = keypairs[key] || {};
  if (!publicKey || !privateKey || !signature) {
    const keypair = instance.generateKeypair();
    privateKey = keypair.privateKey;
    publicKey = keypair.publicKey;
    const eip712 = instance.createEIP712(publicKey, contractAddress, userAddress);
    // Request the user's signature on the public key
    const params = [userAddress, JSON.stringify(eip712)];
    signature = await window.ethereum.request({ method: 'eth_signTypedData_v4', params });
    keypairs[key] = { publicKey, privateKey, signature };
  }
  try {
    const res = await instance.reencrypt(value, privateKey, publicKey, signature, contractAddress, userAddress);
    return res;
  } catch (e) {
    console.log(e);
  }
};
