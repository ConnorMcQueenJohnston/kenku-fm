import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface Track {
    id: string;
    url: string;
    title: string;
}

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
    tracks: {
        byId: Record<string, Track>;
        allIds: string[];
    }
    showNumber: number;
}

const initialState: PlaylistsState = {
    playlists: {
        byId: {},
        allIds: [],
    },
    tracks: {
        byId: {},
        allIds: []
    },
    showNumber: 8
};

// @ts-ignore
const selectApp = createSelector.withTypes<RootState>();
export const selectAllTracks = selectApp(
    [
        (state: RootState) => state.playlists
    ],
    (playlists: PlaylistsState) => playlists.tracks.allIds.map((id: string) => playlists.tracks.byId[id]));


export const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        addPlaylist: (state, action: PayloadAction<Playlist>) => {
            state.playlists.byId[action.payload.id] = action.payload;
            state.playlists.allIds.push(action.payload.id);
        },
        removePlaylist: (state, action: PayloadAction<string>) => {
            for (let track of state.playlists.byId[action.payload].tracks) {
                delete state.tracks.byId[track];
                state.tracks.allIds = state.tracks.allIds.filter(id => id !== track);
            }
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
        addTrack: (
            state,
            action: PayloadAction<{ track: Track; playlistId: string }>
        ) => {
            const {track, playlistId} = action.payload;
            state.playlists.byId[playlistId].tracks.unshift(track.id);
            state.tracks.byId[track.id] = track;
            state.tracks.allIds.push(track.id);
        },
        addTracks: (
            state,
            action: PayloadAction<{ tracks: Track[]; playlistId: string }>
        ) => {
            const {tracks, playlistId} = action.payload;
            state.playlists.byId[playlistId].tracks.unshift(
                ...tracks.map((track) => track.id)
            );
            for (let track of tracks) {
                state.tracks.byId[track.id] = track;
                state.tracks.allIds.push(track.id)
            }
        },
        removeTrack: (
            state,
            action: PayloadAction<{ trackId: string; playlistId: string }>
        ) => {
            const {trackId, playlistId} = action.payload;
            state.playlists.byId[playlistId].tracks = state.playlists.byId[
                playlistId
                ].tracks.filter((id) => id !== trackId);
            delete state.tracks.byId[trackId];
            state.tracks.allIds = state.tracks.allIds.filter(id => id !== trackId);
        },
        editTrack: (state, action: PayloadAction<Partial<Track>>) => {
            if (!action.payload.id) {
                throw Error("Id needed in editTrack payload");
            }
            state.tracks.byId[action.payload.id] = {
                ...state.tracks.byId[action.payload.id],
                ...action.payload,
            };
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
        moveTrack: (
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
    addTrack,
    addTracks,
    removeTrack,
    editTrack,
    moveTrack,
    setPlaylistShowNumber,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
