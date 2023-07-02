import { reducerProperty } from '@views/Owner/ListProperty/data/reducer';
import { reducerLogin } from '@views/Owner/Login/data/reducer';
import { combineReducers } from 'redux';

import home from './home/home.reducer';

// COMBINED REDUCERS
const reducers = {
  home,
  reducerProperty,
  reducerLogin,
};

export default combineReducers(reducers);
