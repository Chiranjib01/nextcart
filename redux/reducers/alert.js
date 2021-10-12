const initialState = {
  show: false,
  msg: '',
  type: '',
  time: 3000,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        ...state,
        show: true,
        type: action.payload.type,
        msg: action.payload.msg,
        time: action.payload.time,
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        show: false,
        msg: '',
        type: '',
      };
    default:
      return { ...state };
  }
};

export default reducer;
