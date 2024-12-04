import { BrowserProvider } from 'ethers';
import { useEffect, useState } from 'react';

export const useWeb3 = () => {
  const [hasWallet, setHasWallet] = useState(false);
  const [account, setAccount] = useState<string | null>();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [chainId, setChainId] = useState<number>();

  const connect = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const getAccounts = async () => {
    try {
      const acc = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(acc[0]);
    } catch (e) {}
  };

  const onAccountChanged = (acc: string[]) => {
    setAccount(acc[0]);
  };

  const onChainIdChanged = (chainId: string) => {
    setChainId(Number(chainId));
  };

  const onConnect = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
  };

  const onDisconnect = () => {
    setAccount(null);
  };

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    setHasWallet(true);

    const provider = new BrowserProvider(window.ethereum);
    setProvider(provider);

    getAccounts();

    window.ethereum.on('accountsChanged', onAccountChanged);
    window.ethereum.on('chainChanged', onChainIdChanged);
    window.ethereum.on('connect', onConnect);
    window.ethereum.on('disconnect', onDisconnect);
    return () => {
      window.ethereum.off('accountsChanged', onAccountChanged);
      window.ethereum.off('chainChanged', onChainIdChanged);
      window.ethereum.off('connect', onConnect);
      window.ethereum.off('disconnect', onDisconnect);
    };
  }, []);

  return { account, provider, hasWallet, connect, chainId };
};
