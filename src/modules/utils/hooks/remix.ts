import { createClient } from '@remixproject/plugin-iframe';
import { PluginClient } from '@remixproject/plugin';
import { useEffect, useState } from 'react';

const remixClient = createClient(new PluginClient());

export const useRemix = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    remixClient.onload(async () => {
      setLoaded(true);
    });
  }, []);

  const log = async (value: string) => {
    await remixClient.terminal.log({ value, type: 'log' });
  };

  const error = async (value: string) => {
    await remixClient.terminal.log({ value, type: 'error' });
  };

  const warn = async (value: string) => {
    await remixClient.terminal.log({ value, type: 'warn' });
  };

  const info = async (value: string) => {
    await remixClient.terminal.log({ value, type: 'info' });
  };

  return { remixClient, loaded, log, warn, error, info };
};
