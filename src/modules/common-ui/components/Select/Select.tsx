import './Select.css';

export type SelectOption = { label: string; value: string };

export type SelectProps = {
  options: SelectOption[];
  selected: string;
  onChange: (v: string) => void;
};

export const Select = ({ options, onChange, selected }: SelectProps) => {
  return (
    <select
      onChange={(e) => {
        const v = options.find((o) => o.value === e.target.value);
        if (v) onChange(v.value);
      }}
      value={selected}
      className="form-control border-dark zama_select"
    >
      {options.map((o) => (
        <option value={o.value} key={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};
