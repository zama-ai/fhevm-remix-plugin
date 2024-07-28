import { useEffect, useState } from 'react';
import { useRemix } from './modules/utils';
import { initFhevm } from 'fhevmjs';
import './App.css';
import { Contract } from './modules/contract';
import { Homepage } from './pages/Homepage';
import { Disconnect } from './pages/Disconnect';
import { Connect } from './modules/layout/components/Connect';
import { Network } from './modules/layout/components/Network';

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loaded } = useRemix();

  useEffect(() => {
    initFhevm()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (window.location.pathname === '/disconnect') {
    return <Disconnect />;
  }

  if (!isInitialized || !loaded) {
    return <Homepage />;
  }

  if (!isInitialized) return null;

  return (
    <div className="run-tab">
      <Connect>
        <Network>
          <Contract />
        </Network>
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
