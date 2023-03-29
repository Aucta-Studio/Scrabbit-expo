import { createSlice } from '@reduxjs/toolkit'

const init = {
  darkMode: true
}

export const settingSlice = createSlice({
    name:"setting",
    initialState: init,
    reducers: {
      setDarkMode: (state, action)=>{
        state.darkMode = action.payload;
      }
    }
});

export const {setDarkMode} = settingSlice.actions;

export default settingSlice.reducer;