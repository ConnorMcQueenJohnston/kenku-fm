import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";

export interface AppState {
    background: string | null;
}

const initialState: AppState = {
    background: null
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setBackground: (state, action: PayloadAction<string>) => {
          state.background = action.payload
        },
        resetBackground: (state) => {
            state.background = null;
        }
    }
});

export const {
    setBackground,
    resetBackground
} = appSlice.actions;

export default appSlice.reducer;