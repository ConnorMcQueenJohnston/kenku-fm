import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store/store";

export interface Playlist {
    tracks: string[];
    background: string;
    title: string;
    id: string;
}

export interface PlaylistsState {
    playlists: {
        byId: Record<string, Playlist>;
        allIds: string[];
    };
    showNumber: number;
}

const initialState: PlaylistsState = {
    playlists: {
        byId: {},
        allIds: [],
    },
    showNumber: 8
};

// @ts-ignore
const selectApp = createSelector.withTypes<RootState>();

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        addPlaylist: (state, action: PayloadAction<Playlist>) => {
            state.playlists.byId[action.payload.id] = action.payload;
            state.playlists.allIds.push(action.payload.id);
        },
        removePlaylist: (state, action: PayloadAction<string>) => {
            delete state.playlists.byId[action.payload];
            state.playlists.allIds = state.playlists.allIds.filter(
                (id) => id !== action.payload
            );
        },
        editPlaylist: (state, action: PayloadAction<Partial<Playlist>>) => {
            if (!action.payload.id) {
                throw Error("Id needed in editPlaylist payload");
            }
            state.playlists.byId[action.payload.id] = {
                ...state.playlists.byId[action.payload.id],
                ...action.payload,
            };
        },
        setPlaylistShowNumber: (
            state,
            action: PayloadAction<number>
        ) => {
            state.showNumber = action.payload
        },
        addSoundToPlaylist: (
            state,
            action: PayloadAction<{ soundId: string; playlistId: string }>
        ) => {
            const {soundId, playlistId} = action.payload;
            state.playlists.byId[playlistId].tracks.unshift(soundId);
        },
        addSoundsToPlaylist: (
            state,
            action: PayloadAction<{ soundIds: string[]; playlistId: string }>
        ) => {
            const {soundIds, playlistId} = action.payload;
            state.playlists.byId[playlistId].tracks.unshift(
                ...soundIds.map((id) => id)
            );
        },
        removeSoundFromPlaylist: (
            state,
            action: PayloadAction<{ soundId: string; playlistId: string }>
        ) => {
            const {soundId, playlistId} = action.payload;
            state.playlists.byId[playlistId].tracks = state.playlists.byId[
                playlistId
                ].tracks.filter((id) => id !== soundId);
        },
        movePlaylist: (
            state,
            action: PayloadAction<{ active: string; over: string }>
        ) => {
            const oldIndex = state.playlists.allIds.indexOf(action.payload.active);
            const newIndex = state.playlists.allIds.indexOf(action.payload.over);
            state.playlists.allIds.splice(oldIndex, 1);
            state.playlists.allIds.splice(newIndex, 0, action.payload.active);
        },
        moveSoundInPlaylist: (
            state,
            action: PayloadAction<{
                playlistId: string;
                active: string;
                over: string;
            }>
        ) => {
            const playlist = state.playlists.byId[action.payload.playlistId];
            const oldIndex = playlist.tracks.indexOf(action.payload.active);
            const newIndex = playlist.tracks.indexOf(action.payload.over);
            playlist.tracks.splice(oldIndex, 1);
            playlist.tracks.splice(newIndex, 0, action.payload.active);
        },
    },
});

export const {
    addPlaylist,
    removePlaylist,
    editPlaylist,
    movePlaylist,
    addSoundToPlaylist,
    addSoundsToPlaylist,
    removeSoundFromPlaylist,
    moveSoundInPlaylist,
    setPlaylistShowNumber,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
