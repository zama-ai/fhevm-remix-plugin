import { useEffect, useState } from 'react';
import { createInstance, FhevmInstance } from 'fhevmjs';

export const LOCALSTORAGE_GATEWAY = 'gatewayUrl';

export type Parameter = { value: string; flag: string };

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

export const useFhevmjs = () => {
  const [instance, setInstance] = useState<FhevmInstance>();
  const [gatewayUrl, setGatewayUrl] = useState<string | undefined>(
    window.localStorage.getItem(LOCALSTORAGE_GATEWAY) || undefined
  );

  useEffect(() => {
    createInstance({ network: window.ethereum, gatewayUrl }).then((i) => {
      setInstance(i);
    });
  }, []);

  useEffect(() => {
    createInstance({ network: window.ethereum, gatewayUrl }).then((i) => {
      setInstance(i);
    });
  }, [gatewayUrl]);

  const updateGatewayUrl = (url: string) => {
    setGatewayUrl(url);
    window.localStorage.setItem(LOCALSTORAGE_GATEWAY, url);
  };

  const encryptParameters = (contractAddress: string, userAddress: string, params: Parameter[]): string[] => {
    if (!instance) return params.map((p) => p.value);
    const input = instance.createEncryptedInput(contractAddress, userAddress);
    const values: any[] = [];
    params.forEach((param) => {
      switch (param.flag) {
        case 'ebool': {
          input.addBool(!!param.value);
          break;
        }
        case 'euint4': {
          input.add4(BigInt(param.value));
          break;
        }
        case 'euint8': {
          input.add8(BigInt(param.value));
          break;
        }
        case 'euint16': {
          input.add16(BigInt(param.value));
          break;
        }
        case 'euint32': {
          input.add32(BigInt(param.value));
          break;
        }
        case 'euint64': {
          input.add64(BigInt(param.value));
          break;
        }
        case 'euint128': {
          input.add128(BigInt(param.value));
          break;
        }
        case 'eaddress': {
          input.addAddress(param.value);
          break;
        }
      }
    });
    if (input.getValues().length > 0) {
      const { handles, inputProof } = input.encrypt();

      params.forEach((param, i) => {
        switch (param.flag) {
          case 'ebool':
          case 'euint4':
          case 'euint8':
          case 'euint16':
          case 'euint32':
          case 'euint64':
          case 'euint128':
          case 'eaddress': {
            values[i] = handles.shift();
            break;
          }
          case 'inputProof': {
            values[i] = inputProof;
            break;
          }
          default: {
            values[i] = param.value;
          }
        }
      });
      console.log(values);
      return values;
    } else {
      return params.map((o) => o.value);
    }
  };

  const reencrypt = async (contractAddress: string, userAddress: string, value: bigint) => {
    if (!instance) return value;
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

  return { instance, gatewayUrl, updateGatewayUrl, encryptParameters, reencrypt };
};
