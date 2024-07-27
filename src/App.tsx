import { useEffect, useState } from 'react';
import { useRemix } from './remix';
import { init } from './fhevmjs';
import './App.css';
import { Contract } from './modules/contract';
import { Connect } from './modules/layout/components/Connect';
import { Homepage } from './Homepage';

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInIDE, setIsInIDE] = useState(false);

  const { remixClient } = useRemix();
  console.log(remixClient);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  useEffect(() => {
    let timerId = window.setInterval(() => {
      try {
        remixClient.solidity.getCompilationResult().then(() => {
          setIsInIDE(true);
          window.clearInterval(timerId);
        });
      } catch (e) {}
    }, 200);
  }, []);

  if (!isInitialized || !isInIDE) {
    return <Homepage />;
  }

  if (!isInitialized) return null;

  return (
    <div className="run-tab">
      <Connect>
        {(account, provider) => {
          return <Contract provider={provider} account={account} />;
        }}
      </Connect>
      <div className="links mt-2">
        <a href="https://docs.zama.ai/fhevm" rel="nofollow" target="_blank">
          📒 Documentation
        </a>{' '}
        |{' '}
        <a href="https://zama.ai/community" rel="nofollow" target="_blank">
          💛 Community support
        </a>
      </div>
    </div>
  );
};
