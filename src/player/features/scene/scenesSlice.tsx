import {Record} from "@sinclair/typebox";
import {Scene} from "./Scene";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Soundboard} from "../soundboards/soundboardsSlice";

export interface ScenesState {
    scenes: {
        byId: Record<string, Scene>,
        allIds: string[]
    },
    showNumber: number
}

const initialState: ScenesState = {
    scenes: {
        byId: {},
        allIds: []
    },
    showNumber: 8
}

export const scenesSlice = createSlice({
        name: "scenes",
        initialState,
        reducers: {
            addScene: (state, action: PayloadAction<Scene>) => {
                state.scenes.byId[action.payload.id] = action.payload;
                state.scenes.allIds.push(action.payload.id);
            },
            removeScene: (state, action: PayloadAction<string>) => {
                delete state.scenes.byId[action.payload];
                state.scenes.allIds = state.scenes.allIds.filter(
                    (id) => id !== action.payload
                );
            },
            setSceneShowNumber: (
                state,
                action: PayloadAction<number>
            ) => {
                state.showNumber = action.payload
            },
            editScene: (state, action: PayloadAction<Partial<Soundboard>>) => {
                if (!action.payload.id) {
                    throw Error("Id needed in editScene payload");
                }
                state.scenes.byId[action.payload.id] = {
                    ...state.scenes.byId[action.payload.id],
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
            moveScene: (
                state,
                action: PayloadAction<{ active: string; over: string }>
            ) => {
                const oldIndex = state.scenes.allIds.indexOf(action.payload.active);
                const newIndex = state.scenes.allIds.indexOf(action.payload.over);
                state.scenes.allIds.splice(oldIndex, 1);
                state.scenes.allIds.splice(newIndex, 0, action.payload.active);
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
    addScene,
    removeScene,
    setSceneShowNumber,
    editScene,
    moveScene
} = scenesSlice.actions;

export default scenesSlice.reducer;