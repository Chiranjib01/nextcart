const addToCart = (product) => {
  return {
    type: 'ADD_TO_CART',
    payload: product,
  };
};
const removeFromCart = (product) => {
  return {
    type: 'REMOVE_FROM_CART',
    payload: product,
  };
};
const emptyCart = () => {
  return {
    type: 'EMPTY_CART',
  };
};
const saveShippingAddress = (data) => {
  return {
    type: 'SAVE_SHIPPING_ADDRESS',
    payload: data,
  };
};
const savePaymentMethod = (method) => {
  return {
    type: 'SAVE_PAYMENT_METHOD',
    payload: method,
  };
};
const showAlert = (msg, type = '', time = 3000) => {
  return {
    type: 'SHOW_ALERT',
    payload: { msg, type, time },
  };
};
const removeAlert = () => {
  return {
    type: 'REMOVE_ALERT',
  };
};
const userLogin = (user) => {
  return {
    type: 'LOGIN_USER',
    payload: user,
  };
};
const logoutUser = () => {
  return {
    type: 'LOGOUT_USER',
  };
};
const adminLogin = (adminInfo) => {
  return {
    type: 'ADMIN_LOGIN',
    payload: adminInfo,
  };
};
const adminLogout = () => {
  return {
    type: 'ADMIN_LOGOUT',
  };
};

export default {
  addToCart,
  removeFromCart,
  emptyCart,
  saveShippingAddress,
  savePaymentMethod,
  showAlert,
  removeAlert,
  userLogin,
  logoutUser,
  adminLogin,
  adminLogout,
};
