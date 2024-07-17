import { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'warning';
  onClick: () => void;
};

export const Button = ({ children, variant = 'primary', onClick }: ButtonProps) => {
  return (
    <button className={`btn btn-sm py-2 btn-${variant}`} id="runAndDeployAtAdressButton" onClick={onClick}>
      {children}
    </button>
  );
};
