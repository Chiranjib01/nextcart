import Cookie from 'js-cookie';

const initialState = {
  user: Cookie.get('user') ? JSON.parse(Cookie.get('user')) : null,
  shippingAddress: Cookie.get('shippingAddress')
    ? JSON.parse(Cookie.get('shippingAddress'))
    : {},
  paymentMethod: Cookie.get('paymentMethod')
    ? JSON.parse(Cookie.get('paymentMethod'))
    : '',
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_SHIPPING_ADDRESS': {
      Cookie.set('shippingAddress', JSON.stringify(action.payload));
      return { ...state, shippingAddress: action.payload };
    }
    case 'SAVE_PAYMENT_METHOD': {
      Cookie.set('paymentMethod', JSON.stringify(action.payload));
      return { ...state, paymentMethod: action.payload };
    }
    case 'LOGIN_USER':
      Cookie.set('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'LOGOUT_USER':
      Cookie.remove('user');
      return { ...state, user: null };
    default:
      return state;
  }
};

export default user;
