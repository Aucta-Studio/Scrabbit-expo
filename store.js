import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import accountReducer from './Slices/account/accountSlice'
import settingReducer from './Slices/setting/settingSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    setting: settingReducer,
  },
  middleware: [thunk]
})