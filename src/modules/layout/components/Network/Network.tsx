import { useFhevmjs } from '../../../utils';

export const Network: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { created } = useFhevmjs();

  if (!created) {
    return <p>This network doesn't run fhEVM 0.5.x. Please change to a network using fhEVM 0.5.x.</p>;
  }

  return children;
};
