import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import accountReducer from './Slices/account/accountSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
  middleware: [thunk]
})