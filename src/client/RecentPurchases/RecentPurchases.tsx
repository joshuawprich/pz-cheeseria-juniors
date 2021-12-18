import RecentItem from './RecentItem/RecentItem';
// Types
import { CartItemType } from '../App';
// Styles
import { Wrapper } from './RecentPurchases.styles';

type Props = {
  transaction: CartItemType[];
};

// Displays recently bought cheeses in transactions for the user to view
const RecentPurchases: React.FC<Props> = ({ transaction }) => {
    const calculateTotal = (items: CartItemType[]) => 
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

  return (
    <Wrapper>
      <div>
        {transaction.map(item => (
          <RecentItem key={item.id} item={item}/>
        ))}
        <h3>Total: ${calculateTotal(transaction).toFixed(2)}</h3>
    </div>
    </Wrapper>
  );
};

export default RecentPurchases;
