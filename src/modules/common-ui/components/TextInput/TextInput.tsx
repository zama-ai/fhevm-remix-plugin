import { ChangeEvent } from 'react';
import classNames from 'classnames';
import './TextInput.css';

export type TextInputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
  className?: string;
};

export const TextInput = ({ placeholder, value, className, onChange }: TextInputProps) => {
  return (
    <input
      className={classNames('border-dark form-control zama_input h-100', className)}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
