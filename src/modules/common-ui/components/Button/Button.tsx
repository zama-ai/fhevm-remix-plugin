import classNames from 'classnames';
import { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'warning';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const Button = ({ children, variant = 'primary', onClick, disabled = false, className = '' }: ButtonProps) => {
  return (
    <button
      className={classNames(`btn btn-sm py-2 btn-${variant}`, className)}
      id="runAndDeployAtAdressButton"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
