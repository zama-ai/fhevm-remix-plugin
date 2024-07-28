import { useWeb3 } from '../../../utils';
import './Connect.css';
import { Button } from '../../../common-ui';

export const Connect: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { account, connect } = useWeb3();

  if (!account) {
    return (
      <div className="Connect__info">
        <Button onClick={connect}>Connect your wallet</Button>
      </div>
    );
  }

  return children;
};
