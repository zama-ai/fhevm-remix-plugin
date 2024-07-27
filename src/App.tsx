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
    window.requestAnimationFrame(() => {
      try {
        remixClient.solidity.getCompilationResult().then(() => {
          setIsInIDE(true);
        });
      } catch (e) {
        setIsInIDE(false);
      }
    });
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
    </div>
  );
};
