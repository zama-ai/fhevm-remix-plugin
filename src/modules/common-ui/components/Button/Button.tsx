import { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'warning';
  onClick: () => void;
  disabled?: boolean;
};

export const Button = ({ children, variant = 'primary', onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      className={`btn btn-sm py-2 btn-${variant}`}
      id="runAndDeployAtAdressButton"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
