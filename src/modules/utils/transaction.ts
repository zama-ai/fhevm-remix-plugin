import { ContractMethod, ContractMethodArgs } from 'ethers';

export const createTransaction = async <A extends [...{ [I in keyof A]-?: A[I] }]>(
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
