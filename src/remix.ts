import { createClient } from '@remixproject/plugin-iframe';
import { PluginClient } from '@remixproject/plugin';

export class RemixClient extends PluginClient {
  constructor() {
    super();
    this.methods = ['loadFolderFromUrl', 'loadFolderFromGithub'];
  }

  async getCurrentContract(): Promise<any> {
    try {
      await this.call('solidity', 'getCompilationResult');
    } catch (error) {
      console.error('Error getting result:', error);
    }
  }
}

const remixClient = createClient(new RemixClient());

export const useRemix = () => {
  return { remixClient };
};
