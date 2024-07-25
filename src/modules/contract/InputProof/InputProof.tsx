import classNames from 'classnames';

import './InputProof.css';

export type InputProofProps = {
  onClick: () => void;
  checked: boolean;
};

export const InputProof: React.FC<InputProofProps> = ({ onClick, checked }) => {
  return (
    <div className={classNames('zama_inputproof', { zama_inputproof__checked: checked })} onClick={onClick}>
      input
    </div>
  );
};
