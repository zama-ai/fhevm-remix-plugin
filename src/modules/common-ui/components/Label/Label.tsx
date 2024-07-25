import classNames from 'classnames';
import './Label.css';

export type LabelProps = {
  label: string;
  className?: string;
};

export const Label = ({ label, className = '' }: LabelProps) => {
  return (
    <label id="selectExEnv" className={classNames('udapp_settingsLabel', className)}>
      <span className="zama__label">{label}</span>
    </label>
  );
};
