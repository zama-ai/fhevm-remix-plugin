import './Label.css';

export type LabelProps = {
  label: string;
};

export const Label = ({ label }: LabelProps) => {
  return (
    <label id="selectExEnv" className="udapp_settingsLabel">
      <span className="zama__label">{label}</span>
    </label>
  );
};
