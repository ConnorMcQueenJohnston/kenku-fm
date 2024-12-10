import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store/store";
import {AudioType} from "../collections/collectionsSlice";

export interface SoundState {
    sounds: {
        byId: Record<string, Sound>,
        allIds: string[]
    },
}

const initialState: SoundState = {
    sounds: {
        byId: {},
        allIds: []
    },
}

export interface Sound {
    id: string;
    url: string;
    title: string;
    loop: boolean;
    volume: number;
    fadeIn: number;
    fadeOut: number;
}

// @ts-ignore
const selectApp = createSelector.withTypes<RootState>()
const selectSoundsState = selectApp([
        (rootState: RootState) => rootState.sounds
    ],
    (rootState: SoundState) => rootState
);

export const selectAllSounds = selectApp(
    [
        selectSoundsState
    ],
    (state: SoundState) => state.sounds.allIds.map((id: string) => state.sounds.byId[id]));

export const selectSoundById = (id: string) => createSelector(
    [selectAllSounds],
    ((sounds) => sounds.filter(sound => sound.id === id)[0] ?? null)
);

export const selectAllAudioByAudioIds = (audioIds: string[]) => createSelector([
        selectAllSounds
    ],
    (allAudio: any[]) => allAudio.filter((audio: AudioType) => audioIds.includes(audio.id))
);

export const soundsSlice = createSlice({
        name: "sounds",
        initialState,
        reducers: {
            addSound: (
                state,
                action: PayloadAction<{ sound: Sound }>
            ) => {
                const {sound} = action.payload;
                state.sounds.byId[sound.id] = sound;
                state.sounds.allIds.push(sound.id);
            },
            addSounds: (
                state,
                action: PayloadAction<{ sounds: Sound[] }>
            ) => {
                const {sounds} = action.payload;
                for (let sound of sounds) {
                    state.sounds.byId[sound.id] = sound;
                    state.sounds.allIds.push(sound.id);
                }
            },
            removeSound: (
                state,
                action: PayloadAction<{ soundId: string }>
            ) => {
                const {soundId} = action.payload;
                delete state.sounds.byId[soundId];
                state.sounds.allIds = state.sounds.allIds.filter(id => id !== soundId);
            },
            editSound: (state, action: PayloadAction<Partial<Sound>>) => {
                if (!action.payload.id) {
                    throw Error("Id needed in editSound payload");
                }
                state.sounds.byId[action.payload.id] = {
                    ...state.sounds.byId[action.payload.id],
                    ...action.payload,
                };
            },
        }
    }
)

export const {
    addSound,
    addSounds,
    removeSound,
    editSound,
} = soundsSlice.actions;

export default soundsSlice.reducer;