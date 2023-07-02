import types from './types';

const initialState = {
  loading: false,
  error: {},
};

export const reducerLogin = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.LOGIN_LOADING:
      return {
        ...initialState,
        loading: true,
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};
