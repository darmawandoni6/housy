import httpService from '@helpers/httpService';

import types from './types';

export default {
  login: (payload) => {
    return async (dispatch) => {
      try {
        dispatch({ type: types.LOGIN_LOADING });
        await httpService.post('/login', payload);
        window.location.href = '/owner';
      } catch (error) {
        dispatch({ type: types.LOGIN_ERROR, payload: error });
      }
    };
  },
};
