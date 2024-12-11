import { getAddress, isAddress, getCreateAddress } from 'ethers';
import { useEffect, useState } from 'react';
import { ABIDescription, FunctionDescription } from '@remixproject/plugin-api';
import { ContractFactory } from 'ethers';

import {
  useWeb3,
  useFhevmjs,
  Parameter,
  useRemix,
  LOCALSTORAGE_GATEWAY,
  formatParameters,
  LOCALSTORAGE_ACL_ADDRESS,
  LOCALSTORAGE_KMS_VERIFIER_ADDRESS,
} from '../../../utils';
import { Button, Label, TextInput, Select } from '../../../common-ui';
import { Inputs } from '../Inputs';
import { ContractInterface } from '../ContractInterface';

import './Contract.css';

import networks from '../../../../../config/networks.json';
import { Divider } from '../../../common-ui/components/Divider';

export type ContractItem = {
  address: string;
  abi: ABIDescription[];
  name: string;
};

export const Contract = ({ }) => {
  const { account, provider } = useWeb3();
  const { remixClient, info, log, error } = useRemix();
  const [name, setName] = useState<string>();
  const [abi, setAbi] = useState<ABIDescription[]>();
  const [bytecode, setBytecode] = useState<string>();
  const [constructor, setConstructor] = useState<
    FunctionDescription | undefined
  >();

  // @dev For now, options are hardcoded.
  // chainId = 11155111 --> Sepolia
  const options = networks['11155111'];

  const [networkMode, setNetworkMode] = useState<string>(
    options[0] ? options[0].label : 'custom',
  );

  const [networkFieldsHidden, setNetworkFieldsHidden] =
    useState<boolean>(true);

  const [inputContractAddress, setInputContractAddress] = useState<string>('');

  const [gatewayURL, setGateway] = useState<string>(
    window.localStorage.getItem(LOCALSTORAGE_GATEWAY) || '',
  );
  const [kmsVerifierAddress, setKMSVerifierAddress] = useState<string>(
    window.localStorage.getItem(LOCALSTORAGE_KMS_VERIFIER_ADDRESS) || '',
  );

  const [aclAddress, setACLAddress] = useState<string>(
    window.localStorage.getItem(LOCALSTORAGE_ACL_ADDRESS) || '',
  );
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);

  const [constructorValues, setConstructorValues] = useState<Parameter[]>([]);

  const {
    encryptParameters,
    updateGatewayUrl,
    updateKMSVerifierAddress,
    updateACLAddress,
  } = useFhevmjs();

  useEffect(() => {
    if (constructor && constructor.inputs && constructor.inputs.length > 0) {
      setConstructorValues(
        constructor.inputs.map(() => ({ value: '', flag: '' })),
      );
    }
  }, [constructor]);

  const cleanState = () => {
    setConstructorValues([]);
  };

  const refreshAbi = () => {
    remixClient.solidity.getCompilationResult().then((result) => {
      const target = result.source?.target;
      if (target) {
        const contracts = result.data?.contracts[target];
        if (contracts) {
          cleanState();
          const names = Object.keys(contracts);
          setName(names[0]);
          const contract = contracts[names[0]];
          const currentAbi = contract.abi;
          if (currentAbi) {
            setAbi(currentAbi);
            const construct = currentAbi.find(
              (desc) => desc.type === 'constructor',
            ) as FunctionDescription;
            setConstructor(construct);
          }
          const currentBytecode = contract.evm.bytecode.object;
          if (currentBytecode) {
            setBytecode(currentBytecode);
          }
        }
      }
    });
  };

  useEffect(() => {
    remixClient.solidity.on('compilationFinished', refreshAbi);
    refreshAbi();
  }, []);

  useEffect(() => {
    const selectedOption = options.find((o) => o.label === networkMode);
    if (selectedOption) {
      setGateway(selectedOption.addresses.gatewayUrl);
      setKMSVerifierAddress(selectedOption.addresses.kmsVerifierAddress);
      setACLAddress(selectedOption.addresses.aclAddress);
      setNetworkFieldsHidden(true);
    } else setNetworkFieldsHidden(false);
  }, [networkMode]);

  const onDeploy = async () => {
    if (!abi || !bytecode) return;
    if (
      constructorValues.some((v) => v.value === '' && v.flag !== 'inputProof')
    )
      return;
    const contractFactory = new ContractFactory(
      abi,
      bytecode,
      await provider!.getSigner(),
    );
    const signer = await provider!.getSigner();
    const nonce = await signer.getNonce();
    const computedAddress = getCreateAddress({ from: account!, nonce });
    log('Deploying contract');
    log(`Deploy at ${computedAddress}`);
    const parameters = await encryptParameters(
      getAddress(computedAddress),
      getAddress(account!),
      constructorValues,
    );
    if (parameters.length > 0) log(`Params: ${formatParameters(parameters)}`);
    try {
      const c = await contractFactory.deploy(...parameters);
      log('Waiting for deployment...');
      await c.waitForDeployment();
      const addr = await c.getAddress();
      const copiedAbi = structuredClone(abi);
      setContractItems([
        ...contractItems,
        { address: addr, abi: copiedAbi, name: name! },
      ]);
      info('Deployment succeeded!');
    } catch (e) {
      error('Deployment failed!');
    }
  };

  const refreshInstance = async () => {
    if (isAddress(aclAddress)) {
      updateACLAddress(aclAddress);
      info('ACL is a valid address.');
    } else {
      error('ACL is not a valid address.');
    }

    if (isAddress(kmsVerifierAddress)) {
      updateKMSVerifierAddress(kmsVerifierAddress);
      info('KMSVerifier is a valid address.');
    } else {
      error('KMSVerifier is not a valid address.');
    }

    const adjustedGatewayURL = gatewayURL.endsWith('/')
      ? gatewayURL
      : gatewayURL + '/';

    try {
      const response = await fetch(adjustedGatewayURL + 'keyurl');

      if (response.status !== 200) {
        error('Gateway URL is invalid. Check console for details.');
        console.error(
          `Failed to fetch data from ${gatewayURL}, status: ${response.status}`,
        );
      } else {
        const jsonResponse = await response.json();

        if (jsonResponse.status === 'success') {
          updateGatewayUrl(adjustedGatewayURL);
          info('Gateway URL is set.');
        } else {
          error('Gateway URL status does not return success.');
        }
      }
    } catch (e) {
      error('Gateway URL is not valid. Check console for details.');
      console.error('Error fetching data:', e);
    }
  };

  let contractSection = <div>You need to select and compile a contract.</div>;
  if (abi && bytecode && name) {
    contractSection = (
      <>
        <div className="form-check-label">{name}</div>
        <div className="zama_contractActionsContainerMultiInner text-dark">
          <Inputs
            values={constructorValues}
            setValues={setConstructorValues}
            inputs={constructor?.inputs || []}
            variant="warning"
            name="Deploy"
            onClick={onDeploy}
            contractAddress={'0x'}
          />
        </div>
        <div className="d-flex flex-column zama_contractAddress">
          <div className="d-flex flex-row">
            <Button
              onClick={() => {
                try {
                  if (!inputContractAddress) return;
                  const checksumAddress = getAddress(inputContractAddress);
                  const copiedAbi = structuredClone(abi);
                  if (
                    isAddress(checksumAddress) &&
                    contractItems.every((c) => c.address !== checksumAddress)
                  ) {
                    setContractItems([
                      ...contractItems,
                      { address: checksumAddress, abi: copiedAbi, name: name },
                    ]);
                  }
                } catch (e) { }
              }}
            >
              At address
            </Button>
            <TextInput
              className="zama_contractAddressInput"
              value={inputContractAddress}
              onChange={(e) => {
                setInputContractAddress(e.target.value);
              }}
              placeholder="Load contract from Address"
            />
          </div>
        </div>
        {contractItems.map((contractItem) => {
          const onDelete = () => {
            setContractItems(
              contractItems.filter((c) => c.address !== contractItem.address),
            );
          };
          return (
            <ContractInterface
              name={contractItem.name}
              contractAddress={contractItem.address}
              abi={contractItem.abi}
              key={contractItem.address}
              onDelete={onDelete}
            />
          );
        })}
      </>
    );
  }

  return (
    <div>
      <div className="links_issue mt-2">
        <a
          href="https://github.com/zama-ai/fhevm-remix-plugin/issues"
          rel="nofollow"
          target="_blank"
        >
          🚩 an issue?
        </a>
      </div>
      <div className="p-2 my-2 Connect__account">
        Connected with:
        <br />
        {account}
        <br />
        <a href="https://remix.zama.ai/disconnect" target="_blank">
          Disconnect
        </a>
      </div>
      <Select
        options={[...options, { label: 'Custom', value: 'custom' }]}
        onChange={(selectedOption) => setNetworkMode(selectedOption)}
        selected={networkMode}
      />
      <div>
        {!networkFieldsHidden && <div>
          <Label className="mt-2" label="Gateway" />
          <TextInput
            placeholder="Gateway URL"
            value={gatewayURL}
            onChange={(e) => {
              setGateway(e.target.value);
            }}
          />
          <Label className="mt-2" label="KMSVerifier" />
          <TextInput
            placeholder="KMSVerifier contract address"
            value={kmsVerifierAddress}
            onChange={(e) => {
              setKMSVerifierAddress(e.target.value);
            }}
          />
          <Label className="mt-2" label="ACL" />
          <TextInput
            placeholder="ACL contract address"
            value={aclAddress}
            onChange={(e) => {
              setACLAddress(e.target.value);
            }}
          />
        </div>}
        <div className="mt-2 mb-2">
          <Button onClick={refreshInstance}>Use this configuration</Button>
          <Divider />
        </div>
      </div>
      {contractSection}
    </div>
  );
};
