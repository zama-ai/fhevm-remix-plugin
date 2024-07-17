import React, { useState } from 'react';

export type SelectOption = { label: string; value: string };

export type SelectProps = {
  options: SelectOption[];
  selected?: string;
};

export const Select = ({ options, selected = '' }: SelectProps) => {
  const selectedOption = options.find((o) => o.value === selected) || options[0];
  const [optionSelected, setOptionSelected] = useState<SelectOption>(selectedOption);
  return (
    <div className="udapp_environment">
      <div className="dropdown">
        <button className="btn btn-light btn-block w-100 d-inline-block border border-dark form-control ">
          <div className="d-flex">
            <div className="mr-auto text-nowrap text-truncate overflow-hidden">{optionSelected.label}</div>
            <div>
              <i className="fad fa-sort-circle"></i>
            </div>
          </div>
        </button>
        <div className="w-100 custom-dropdown-items dropdown-menu" aria-labelledby="" data-id="custom-dropdown-items">
          <ul className="overflow-auto list-unstyled mb-0">
            <a data-id="dropdown-item-injected-MetaMask" href="#" className="dropdown-item" role="button">
              <span className="">Injected Provider - MetaMask</span>
            </a>
            <a data-id="dropdown-item-injected-Portefeuille Brave" href="#" className="dropdown-item" role="button">
              <span className="">Injected Provider - Portefeuille Brave</span>
            </a>
            <a data-id="dropdown-item-vm-cancun" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM (Cancun)</span>
            </a>
            <a data-id="dropdown-item-vm-mainnet-fork" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM - Mainnet fork</span>
            </a>
            <a data-id="dropdown-item-vm-sepolia-fork" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM - Sepolia fork</span>
            </a>
            <a data-id="dropdown-item-vm-custom-fork" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM - Custom fork</span>
            </a>
            <a data-id="dropdown-item-injected-metamask-sepolia" href="#" className="dropdown-item" role="button">
              <span className="">Testnet - Sepolia</span>
            </a>
            <a data-id="dropdown-item-walletconnect" href="#" className="dropdown-item" role="button">
              <span className="">WalletConnect</span>
            </a>
            <a data-id="dropdown-item-injected-metamask-optimism" href="#" className="dropdown-item" role="button">
              <span className="">L2 - Optimism</span>
            </a>
            <a data-id="dropdown-item-injected-metamask-arbitrum" href="#" className="dropdown-item" role="button">
              <span className="">L2 - Arbitrum</span>
            </a>
            <a data-id="dropdown-item-injected-metamask-ephemery" href="#" className="dropdown-item" role="button">
              <span className="">Ephemery Testnet</span>
            </a>
            <a data-id="dropdown-item-basic-http-provider" href="#" className="dropdown-item" role="button">
              <span className="">Custom - External Http Provider</span>
            </a>
            <a data-id="dropdown-item-hardhat-provider" href="#" className="dropdown-item" role="button">
              <span className="">Dev - Hardhat Provider</span>
            </a>
            <a data-id="dropdown-item-ganache-provider" href="#" className="dropdown-item" role="button">
              <span className="">Dev - Ganache Provider</span>
            </a>
            <a data-id="dropdown-item-foundry-provider" href="#" className="dropdown-item" role="button">
              <span className="">Dev - Foundry Provider</span>
            </a>
            <a data-id="dropdown-item-vm-shanghai" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM (Shanghai)</span>
            </a>
            <a data-id="dropdown-item-vm-paris" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM (Paris)</span>
            </a>
            <a data-id="dropdown-item-vm-london" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM (London)</span>
            </a>
            <a data-id="dropdown-item-vm-berlin" href="#" className="dropdown-item" role="button">
              <span className="">Remix VM (Berlin)</span>
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};
