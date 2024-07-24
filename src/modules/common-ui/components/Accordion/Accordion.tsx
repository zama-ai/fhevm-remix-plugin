import classNames from 'classnames';
import { ReactNode, useState } from 'react';

export type HeaderProps = {
  defaultVisible?: boolean;
  label: ReactNode | string;
  labelOpen?: ReactNode | string;
  children: ReactNode;
  hidden?: boolean;
  containerClassName?: string;
};

export const Accordion: React.FC<HeaderProps> = ({ label, labelOpen, children, hidden = true, containerClassName }) => {
  const [visible, setVisible] = useState(!hidden);

  return (
    <>
      <div
        className="zama_multiHeader"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        <div className="zama_multiTitle run-instance-multi-title">{visible ? labelOpen || label : label}</div>
        <i
          className={classNames('fas zama_methCaret', {
            'fa-angle-up': visible,
            'fa-angle-down': !visible,
          })}
        ></i>
      </div>
      <div style={{ display: visible ? 'block' : 'none' }} className={containerClassName}>
        {children}
      </div>
    </>
  );
};
