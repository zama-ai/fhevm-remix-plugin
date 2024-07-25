import { getInstance } from '../../fhevmjs';

export type Parameter = { value: string; flag: string };

export const encryptParameters = (contractAddress: string, userAddress: string, params: Parameter[]): string[] => {
  const instance = getInstance();
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
