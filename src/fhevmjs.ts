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

export const createFhevmInstance = async () => {
  if (instancePromise) return instancePromise;
  instancePromise = createInstance({ network: window.ethereum });
  instance = await instancePromise;
};

export const getInstance = (): FhevmInstance => {
  if (!instance) throw new Error('Instance not initialized yet');
  return instance;
};
