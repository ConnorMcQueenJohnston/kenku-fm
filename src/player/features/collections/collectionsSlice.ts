import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store/store";
import {Sound} from "../sound/soundsSlice";

export interface Collection {
    sounds: string[];
    background: string;
    title: string;
    id: string;
}

export interface CollectionsState {
    collections: {
        byId: Record<string, Collection>;
        allIds: string[];
    };
    showNumber: number;
}

export type AudioTypeString = "sound";
export type AudioType = Sound;
// @ts-ignore
const selectApp = createSelector.withTypes<RootState>();


const initialState: CollectionsState = {
    collections: {
        byId: {},
        allIds: [],
    },
    showNumber: 8
};

export const collectionsSlice = createSlice({
    name: "collections",
    initialState,
    reducers: {
        addCollection: (state, action: PayloadAction<Collection>) => {
            state.collections.byId[action.payload.id] = action.payload;
            state.collections.allIds.push(action.payload.id);
        },
        removeCollection: (state, action: PayloadAction<string>) => {
            delete state.collections.byId[action.payload];
            state.collections.allIds = state.collections.allIds.filter(
                (id) => id !== action.payload
            );
        },
        setCollectionShowNumber: (
            state,
            action: PayloadAction<number>
        ) => {
            state.showNumber = action.payload
        },
        editCollection: (state, action: PayloadAction<Partial<Collection>>) => {
            if (!action.payload.id) {
                throw Error("Id needed in editCollection payload");
            }
            state.collections.byId[action.payload.id] = {
                ...state.collections.byId[action.payload.id],
                ...action.payload,
            };
        },
        addSoundToCollection: (
            state,
            action: PayloadAction<{ soundId: string; collectionId: string }>
        ) => {
            const {soundId, collectionId} = action.payload;
            state.collections.byId[collectionId].sounds.unshift(soundId);
        },
        addSoundsToCollection: (
            state,
            action: PayloadAction<{ soundIds: string[]; collectionId: string }>
        ) => {
            const {soundIds, collectionId} = action.payload;
            state.collections.byId[collectionId].sounds.unshift(
                ...soundIds
            );
        },
        removeSoundFromCollection: (
            state,
            action: PayloadAction<{ soundId: string; collectionId: string }>
        ) => {
            const {soundId, collectionId} = action.payload;
            state.collections.byId[collectionId].sounds = state.collections.byId[
                collectionId
                ].sounds.filter((id) => id !== soundId);
        },
        moveCollection: (
            state,
            action: PayloadAction<{ active: string; over: string }>
        ) => {
            const oldIndex = state.collections.allIds.indexOf(action.payload.active);
            const newIndex = state.collections.allIds.indexOf(action.payload.over);
            state.collections.allIds.splice(oldIndex, 1);
            state.collections.allIds.splice(newIndex, 0, action.payload.active);
        },
        moveSoundInCollection: (
            state,
            action: PayloadAction<{
                collectionId: string;
                active: string;
                over: string;
            }>
        ) => {
            const collection = state.collections.byId[action.payload.collectionId];
            const oldIndex = collection.sounds.indexOf(action.payload.active);
            const newIndex = collection.sounds.indexOf(action.payload.over);
            collection.sounds.splice(oldIndex, 1);
            collection.sounds.splice(newIndex, 0, action.payload.active);
        },
    },
});

export const {
    addCollection,
    removeCollection,
    editCollection,
    moveCollection,
    setCollectionShowNumber,
    addSoundToCollection,
    addSoundsToCollection,
    removeSoundFromCollection,
    moveSoundInCollection
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
