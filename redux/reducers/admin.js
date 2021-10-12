import Cookie from 'js-cookie';

const initialState = {
  adminInfo: Cookie.get('adminInfo')
    ? JSON.parse(Cookie.get('adminInfo'))
    : null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADMIN_LOGIN':
      Cookie.set('adminInfo', JSON.stringify(action.payload));
      return { ...state, adminInfo: action.payload };
    case 'ADMIN_LOGOUT':
      Cookie.remove('adminInfo');
      return { ...state, adminInfo: null };
    default:
      return state;
  }
};

export default reducer;
