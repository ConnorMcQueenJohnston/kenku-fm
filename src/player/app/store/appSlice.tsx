import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

interface AppWideOpenPanels {
    addSoundOpen: boolean;
    addPlaylistOpen: boolean;
    addCollectionOpen: boolean;
    addSceneOpen: boolean;
}

export interface AppState {
    background: string | null;
    panels: AppWideOpenPanels;
}

const initialState: AppState = {
    background: null,
    panels: {
        addSoundOpen: false,
        addPlaylistOpen: false,
        addCollectionOpen: false,
        addSceneOpen: false
    }
}

const selectRoot = createSelector.withTypes<RootState>();
// TODO: Remove
export const selectEntireStore = selectRoot([
    (rootState: RootState) => rootState
], rootState => rootState);
const selectAppState = selectRoot([
        (rootState: RootState) => rootState.app
    ],
    (rootState: AppState) => rootState
);

const selectPanelsState = selectRoot(
    [
        selectAppState
    ],
    (appState: AppState) => appState.panels
);

export const selectIsAddSoundPanelOpen = selectRoot(
    [
        selectPanelsState
    ],
    (panelsState: AppWideOpenPanels) => panelsState.addSoundOpen
)

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setBackground: (state, action: PayloadAction<string>) => {
            state.background = action.payload
        },
        resetBackground: (state) => {
            state.background = null;
        },
        setAddSoundPanelOpen: (state, action: PayloadAction<boolean>) => {
            state.panels.addSoundOpen = action.payload;
        },
        setAddPlaylistPanelOpen: (state, action: PayloadAction<boolean>) => {
            state.panels.addPlaylistOpen = action.payload;
        },
        setAddCollectionPanelOpen: (state, action: PayloadAction<boolean>) => {
            state.panels.addCollectionOpen = action.payload;
        },
        setAddScenePanelOpen: (state, action: PayloadAction<boolean>) => {
            state.panels.addSceneOpen = action.payload;
        }
    }
});

export const {
    setBackground,
    resetBackground,
    setAddSoundPanelOpen,
    setAddPlaylistPanelOpen,
    setAddCollectionPanelOpen,
    setAddScenePanelOpen
} = appSlice.actions;

export default appSlice.reducer;