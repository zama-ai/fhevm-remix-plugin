import { IconCopy } from '../IconCopy';
import './Result.css';

export type ResultProps = {
  value: string;
};

export const Result: React.FC<ResultProps> = ({ value }) => {
  return (
    <div className="zama__result">
      <span>{value}</span>
      <IconCopy value={value} />
    </div>
  );
};
