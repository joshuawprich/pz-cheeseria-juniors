// Types
import { CartItemType } from '../../App';
// Styles
import { Wrapper } from './RecentItem.styles';

type Props = {
  item: CartItemType;
};

// Wrapper for showing recent items in drawer

const RecentItem: React.FC<Props> = ({item}) => (
  <Wrapper>
    <h3>{item.title}</h3>
    <div className='information'>
      <p>Price: ${item.price}</p>
      <p>Amount: {item.amount}</p>
      <p>Total: ${(item.amount * item.price).toFixed(2)}</p>
      <img src={item.image} alt={item.title}/>
    </div>
  </Wrapper>
)

export default RecentItem;
