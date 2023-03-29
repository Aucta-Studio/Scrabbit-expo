import { createSlice } from '@reduxjs/toolkit'

const init = {
  email: "",
  username: "",
  firstname: "",
  lastname: "",
  pfp: "",
  bio: ""
}

export const accountSlice = createSlice({
  name: 'account',
  initialState: init,
  reducers: {
    setEmail: (state, action) =>{
      state.email = action.payload;
    },
    setUsername: (state, action) =>{
      state.username = action.payload;
    },
    setFirstName: (state,action) => {
      state.firstname = action.payload;
    },
    setLastName: (state,action) => {
      state.lastname = action.payload;
    },
    setPfp: (state,action) => {
      state.pfp = action.payload;
    },
    setBio: (state,action) => {
      state.bio = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setEmail, setUsername, setFirstName, setLastName, setPfp, setBio } = accountSlice.actions

export default accountSlice.reducer