import { CreateSlice } from "@reduxjs/toolkit";

const intialState = {
  emailAddress: "",
  firstName: "",
  lastName: "",
  bio: "",
  userName: "",
  pfp: "",
  uid: "",
};

// export const accountSlice = CreateSlice({
//   name: "account",
//   intialState,
//   reducers: {
//     setEmail: () => {},
//     setUserName: ()=>{},
//     setUID: ()=>{}
//   },
// });

// export const {setEmail} = accountSlice.actions;

// export const selectAccount = state => state.account.emailAddress;

// export default accountSlice.reducer;
