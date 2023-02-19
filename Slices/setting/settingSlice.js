import { createSlice } from '@reduxjs/toolkit'

const init = {
  darkMode: false
}

export const settingSlice = createSlice({
    name:"setting",
    initialState: init,
    reducers: {}
});