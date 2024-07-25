import { Select } from '../../../common-ui';

export type SelectEncryptedProps = {
  onChange: (v: string) => void;
  selected: string;
};

const OPTIONS = [
  { label: 'none', value: '' },
  { label: 'ebool', value: 'ebool' },
  { label: 'euint4', value: 'euint4' },
  { label: 'euint8', value: 'euint8' },
  { label: 'euint16', value: 'euint16' },
  { label: 'euint32', value: 'euint32' },
  { label: 'euint64', value: 'euint64' },
  { label: 'euint128', value: 'euint128' },
  { label: 'eaddress', value: 'eaddress' },
];

export const SelectEncrypted: React.FC<SelectEncryptedProps> = ({ onChange, selected }) => {
  return <Select onChange={onChange} selected={selected} options={OPTIONS} />;
};
