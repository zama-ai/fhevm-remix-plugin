import { initFhevm, createInstance, FhevmInstance } from 'fhevmjs';

export const init = async () => {
  await initFhevm();
};

let instancePromise: Promise<FhevmInstance> | null;
let instance: FhevmInstance | null;

export const cleanFhevmInstance = () => {
  instancePromise = null;
  instance = null;
};

let gateway: boolean = false;

export const hasGateway = () => {
  return gateway;
};

export const createFhevmInstance = async (gatewayUrl?: string) => {
  gateway = !!gatewayUrl;
  instancePromise = createInstance({ network: window.ethereum, gatewayUrl });
  instance = await instancePromise;
};

export const getInstance = (): FhevmInstance => {
  if (!instance) throw new Error('Instance not initialized yet');
  return instance;
};
