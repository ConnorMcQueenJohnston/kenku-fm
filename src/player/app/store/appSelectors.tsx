import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {AppState} from "./appSlice";

const selectApp = createSelector.withTypes<RootState>();
