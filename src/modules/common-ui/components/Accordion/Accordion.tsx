import classNames from 'classnames';
import { ReactNode, useState } from 'react';

import './Accordion.css';

export type HeaderProps = {
  defaultVisible?: boolean;
  label: ReactNode | string;
  labelOpen?: ReactNode | string;
  children: ReactNode;
  hidden?: boolean;
  containerClassName?: string;
  left?: boolean;
};

export const Accordion: React.FC<HeaderProps> = ({
  label,
  labelOpen,
  children,
  hidden = true,
  containerClassName,
  left = false,
}) => {
  const [visible, setVisible] = useState(!hidden);

  const arrow = (
    <i
      className={classNames('fas zama_methCaret', 'mx-1', {
        'fa-angle-up': visible,
        'fa-angle-down': !visible,
      })}
    ></i>
  );

  return (
    <div className={classNames('accordion', 'px-1', 'my-2', { 'border-dark': visible, 'bg-light': visible })}>
      <div
        className="zama_multiHeader"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {left && arrow}
        <div className="accordion__label px-1">{visible ? labelOpen || label : label}</div>
        {!left && arrow}
      </div>
      <div style={{ display: visible ? 'block' : 'none' }} className={classNames('pb-2', containerClassName)}>
        {children}
      </div>
    </div>
  );
};
