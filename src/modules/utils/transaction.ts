import { ContractMethod, ContractMethodArgs } from 'ethers';

export const createTransaction = async <
  A extends [...{ [I in keyof A]-?: A[I] }],
>(
  method: ContractMethod<A>,
  ...params: A
) => {
  const gasLimit = await method.estimateGas(...params);
  const updatedParams: ContractMethodArgs<A> = [
    ...params,
    { gasLimit: Math.min(Math.round(+gasLimit.toString() * 1.2), 10000000) },
  ];
  return method(...updatedParams);
};

export const formatParameters = (
  arr: (string | number | Uint8Array | any[])[],
): string => {
  return arr
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'number') {
        return item.toString();
      } else if (item instanceof Uint8Array) {
        return `<bytes: ${item.length} items>`;
      } else if (Array.isArray(item)) {
        return `[${formatParameters(item)}]`;
      } else {
        return '<unknown>';
      }
    })
    .join(', ');
};
