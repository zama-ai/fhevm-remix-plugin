import './IconDelete.css';

export type IconDeleteProps = {
  onDelete: () => void;
};

export const IconDelete: React.FC<IconDeleteProps> = ({ onDelete }) => {
  return (
    <button className="btn deleteButton text-dark" onClick={onDelete}>
      <i className="fas fa-times" aria-hidden="true"></i>
    </button>
  );
};
