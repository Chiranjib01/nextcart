import Cookie from 'js-cookie';

const initialState = {
  cartItems: Cookie.get('cartItems') ? JSON.parse(Cookie.get('cartItems')) : [],
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      const cartItems = existItem
        ? state.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cartItems, newItem];
      Cookie.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'REMOVE_FROM_CART': {
      const cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookie.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'EMPTY_CART': {
      Cookie.remove('cartItems');
      return { ...state, cartItems: [] };
    }
    default:
      return state;
  }
};

export default cart;
