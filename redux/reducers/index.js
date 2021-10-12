import { combineReducers } from 'redux';

//import reducers
import cartReducer from './cart';
import userReducer from './user';
import alertReducer from './alert';
import adminReducer from './admin';

const reducer = combineReducers({
  cartReducer,
  userReducer,
  alertReducer,
  adminReducer,
});

export default reducer;
