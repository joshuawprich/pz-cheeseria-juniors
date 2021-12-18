import CartItem from './CartItem/CartItem';
import Button from '@material-ui/core/Button'; // Imported Button
// Types
import { CartItemType } from '../App';
// Styles
import { Wrapper } from './Cart.styles';

type Props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
  handlePurchase: () => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart, handlePurchase }) => {
  const calculateTotal = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

  return (
    <Wrapper>
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? <p>No items in cart.</p> : null}
      {cartItems.map(item => (
        <CartItem
          key={item.id}
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
      <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
      
      {/* Button for purchasing cheeses */}
      {cartItems.length === 0 ? null : 
        <Button 
          onClick={() => handlePurchase()}
          data-cy={`purchase-items`}>Purchase
        </Button>
      }
    </Wrapper>
  );
};

export default Cart;
