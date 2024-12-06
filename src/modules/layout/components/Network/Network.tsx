import { useFhevmjs } from '../../../utils';

export const Network: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  useFhevmjs();

  return children;
};
