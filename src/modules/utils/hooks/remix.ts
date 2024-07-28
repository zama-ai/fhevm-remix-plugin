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

  return { remixClient, loaded };
};
