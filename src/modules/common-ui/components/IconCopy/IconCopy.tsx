import copy from 'copy-to-clipboard';

import './IconCopy.css';
import { MouseEvent, useCallback } from 'react';

export type IconCopyProps = {
  value: string;
};

export const IconCopy: React.FC<IconCopyProps> = ({ value }) => {
  const onCopy = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      copy(value);
      event.stopPropagation();
    },
    [value]
  );
  return (
    <button className="btn copyButton text-dark" onClick={onCopy}>
      <i className="far fa-copy" aria-hidden="true"></i>
    </button>
  );
};
