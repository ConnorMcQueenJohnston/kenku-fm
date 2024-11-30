import {Record} from "@sinclair/typebox";
import {EventTrack} from "./EventTrack";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Sound, Soundboard} from "../soundboards/soundboardsSlice";

export interface EventTracksState {
    eventTracks: {
        byId: Record<string, EventTrack>,
        allIds: string[]
    },
    showNumber: number
}

const initialState: EventTracksState = {
    eventTracks: {
        byId: {},
        allIds: []
    },
    showNumber: 8
}

export const eventTracksSlice = createSlice({
        name: "eventTracks",
        initialState,
        reducers: {
            addEventTrack: (state, action: PayloadAction<EventTrack>) => {
                state.eventTracks.byId[action.payload.id] = action.payload;
                state.eventTracks.allIds.push(action.payload.id);
            },
            removeEventTrack: (state, action: PayloadAction<string>) => {
                delete state.eventTracks.byId[action.payload];
                state.eventTracks.allIds = state.eventTracks.allIds.filter(
                    (id) => id !== action.payload
                );
            },
            setEventTrackShowNumber: (
                state,
                action: PayloadAction<number>
            ) => {
                state.showNumber = action.payload
            },
            editEventTrack: (state, action: PayloadAction<Partial<Soundboard>>) => {
                if (!action.payload.id) {
                    throw Error("Id needed in editEventTrack payload");
                }
                state.eventTracks.byId[action.payload.id] = {
                    ...state.eventTracks.byId[action.payload.id],
                    ...action.payload,
                };
            },
            // addSound: (
            //     state,
            //     action: PayloadAction<{ sound: Sound; soundboardId: string }>
            // ) => {
            //     const {sound, soundboardId} = action.payload;
            //     state.soundboards.byId[soundboardId].sounds.unshift(sound.id);
            //     state.sounds[sound.id] = sound;
            // },
            // addSounds: (
            //     state,
            //     action: PayloadAction<{ sounds: Sound[]; soundboardId: string }>
            // ) => {
            //     const {sounds, soundboardId} = action.payload;
            //     state.soundboards.byId[soundboardId].sounds.unshift(
            //         ...sounds.map((sound) => sound.id)
            //     );
            //     for (let sound of sounds) {
            //         state.sounds[sound.id] = sound;
            //     }
            // },
            // removeSound: (
            //     state,
            //     action: PayloadAction<{ soundId: string; soundboardId: string }>
            // ) => {
            //     const {soundId, soundboardId} = action.payload;
            //     state.soundboards.byId[soundboardId].sounds = state.soundboards.byId[
            //         soundboardId
            //         ].sounds.filter((id) => id !== soundId);
            //     delete state.sounds[soundId];
            // },
            // editSound: (state, action: PayloadAction<Partial<Sound>>) => {
            //     if (!action.payload.id) {
            //         throw Error("Id needed in editSound payload");
            //     }
            //     state.sounds[action.payload.id] = {
            //         ...state.sounds[action.payload.id],
            //         ...action.payload,
            //     };
            // },
            moveEventTrack: (
                state,
                action: PayloadAction<{ active: string; over: string }>
            ) => {
                const oldIndex = state.eventTracks.allIds.indexOf(action.payload.active);
                const newIndex = state.eventTracks.allIds.indexOf(action.payload.over);
                state.eventTracks.allIds.splice(oldIndex, 1);
                state.eventTracks.allIds.splice(newIndex, 0, action.payload.active);
            },
        //     moveSound: (
        //         state,
        //         action: PayloadAction<{
        //             soundboardId: string;
        //             active: string;
        //             over: string;
        //         }>
        //     ) => {
        //         const soundboard = state.soundboards.byId[action.payload.soundboardId];
        //         const oldIndex = soundboard.sounds.indexOf(action.payload.active);
        //         const newIndex = soundboard.sounds.indexOf(action.payload.over);
        //         soundboard.sounds.splice(oldIndex, 1);
        //         soundboard.sounds.splice(newIndex, 0, action.payload.active);
        //     },
        }
    }
);

export const {
    addEventTrack,
    removeEventTrack,
    setEventTrackShowNumber,
    editEventTrack,
    moveEventTrack
} = eventTracksSlice.actions;

export default eventTracksSlice.reducer;