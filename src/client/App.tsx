import React, { useState } from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Cart/Item/Item';
import RecentItems from './RecentPurchases/RecentItem/RecentItem';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RestoreIcon from '@material-ui/icons/Restore';
import Badge from '@material-ui/core/Badge';
import { Dialog, DialogContent, DialogTitle, List, ListItem } from '@material-ui/core'; //Imported Dialog
// Styles
import { Wrapper, StyledButton, StyledAppBar, HeaderTypography } from './App.styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import RecentPurchases from './RecentPurchases/RecentPurchases';
// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};


const getCheeses = async (): Promise<CartItemType[]> =>
  await (await fetch(`api/cheeses`)).json();


 
// Posts a string array of cheeses to the back end
// server to be stored for later use.
const postCheeses = async (cheeses: CartItemType[])=> {
  await fetch(`api/recentPurchases`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cheeses),
  });
}

// Gets the string array of cheeses from the server
// to be used for recent purchases
const getRecentCheeses = async () => {
  let cheeses:CartItemType[][] = [];
  await fetch(`api/recentPurchases`)
    .then(response => response.json())
    .then(data => {cheeses = data});

    return cheeses;
}


const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false); // State for recent Drawer
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [cheeseItem, setCheeseItem] = useState<CartItemType>(); // State for currently selected cheese for dialog
  const [recentPurchases, setRecentPurchases] = useState([] as CartItemType[][]); // State for array of recent cheeses
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'cheeses',
    getCheeses
  );
  console.log(data);

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  //Functions for handling the opening and closing of the Dialog
  const handleDialogOpen = (item: CartItemType) => {
    setCheeseItem(item);
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  // Function for handling the purchase button
  const handlePurchase = () => {
    postCheeses(cartItems);
    setCartItems([]);
    setCartOpen(false);
  }

  // Function for handling the Recent drawer
  const handleRecentOpen = async () => {
    var recentPurchases:CartItemType[][] = await getRecentCheeses();
    setRecentPurchases(recentPurchases);
    setRecentOpen(true);
  }

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (

    <Wrapper>
      <StyledAppBar position="static">
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <StyledButton 
              onClick={() => handleRecentOpen()}
              data-cy="recent-purchases"> {/* Added for purchase test */}
              <RestoreIcon />
              <Typography variant="subtitle2">
                Recent Purchases
              </Typography>
            </StyledButton>

            <HeaderTypography variant="h3" noWrap>
              Welcome to Patient Zero's Cheeseria
            </HeaderTypography>

            <StyledButton 
              onClick={() => setCartOpen(true)}
              data-cy="cart-button"> {/* Added for purchase test */}
              <Badge
                badgeContent={getTotalItems(cartItems)}
                color='error'
                data-cy="badge-count">
                <AddShoppingCartIcon />
              </Badge>

              <Typography variant="subtitle2">
                Cart
              </Typography>
            </StyledButton>

          </Grid>
        </Toolbar>
      </StyledAppBar>

      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
          handlePurchase={handlePurchase}
        />
      </Drawer>

      {/* Drawer for viewing recently purchased cheeses */}
      <Drawer anchor='left' open={recentOpen} onClose={() => setRecentOpen(false)}>
        <Wrapper>
          <h2>Recent Purchases</h2>
          {recentPurchases.length === 0 ? <p>No recent purchases.</p> : null}
          {recentPurchases.map((transaction, index) => (
            <div key={index}>
              <h2>Transaction: {index+1}</h2>
              <RecentPurchases transaction={transaction} />
            </div>
          ))}
        </Wrapper>
      </Drawer>

      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} handleDialogOpen={handleDialogOpen}/>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for showing information about cheeses */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>{cheeseItem?.title}</DialogTitle>
        <List>
            <ListItem>
              <b>Category: </b> {cheeseItem?.category}
            </ListItem>
            <ListItem>
              <div><b>Description: </b>{cheeseItem?.description}</div>
            </ListItem>
            <ListItem>
              <b>Price: </b> ${cheeseItem?.price}
            </ListItem>
        </List>
      </Dialog>
    </Wrapper>

  );
};

export default App;
