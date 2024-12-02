import {Record} from "@sinclair/typebox";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {v4 as uuid} from "uuid";

export interface Scene {
    id: string;
    title: string;
    background: string;
    duration: number;
    variables: {
        byId: Record<string, SceneVariable>
        allIds: string[]
    },
    nodes: {
        byId: Record<string, SceneNode>
        allIds: string[]
    },
    sceneTracks: {
        byId: Record<string, ISceneTrack>,
        allIds: string[]
    }
}

export type SceneVariableType = "boolean" | "number" | "trigger";

export interface SceneVariable extends SceneVariableBase {
    type: SceneVariableType;
}

interface SceneVariableBase {
    id: string;
    title: string;
    value: boolean | number | null;
    isActive: boolean;
}

export type SceneNode = {
    id: string;
    title: string;
    required: boolean;
}

export type ISceneTrack = {
    id: string;
    title: string
}

interface ISceneIdentifier {
    sceneId: string;
}

export interface INewSceneNode extends ISceneIdentifier {
    newNode: {
        title: string;
        required: boolean;
    }
}

export interface INewSceneVariable extends ISceneIdentifier {
    newSceneVariable: {
        title: string;
        type: SceneVariableType;
    }
}

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
            editScene: (state, action: PayloadAction<Partial<Scene>>) => {
                if (!action.payload.id) {
                    throw Error("Id needed in editScene payload");
                }
                state.scenes.byId[action.payload.id] = {
                    ...state.scenes.byId[action.payload.id],
                    ...action.payload,
                };
            },
            addSceneNode: (state, action: PayloadAction<INewSceneNode>) => {
                const newNodeId = uuid();
                state.scenes.byId[action.payload.sceneId].nodes.byId[newNodeId] = {
                    ...action.payload.newNode,
                    id: newNodeId
                }
                state.scenes.byId[action.payload.sceneId].nodes.allIds.push(newNodeId);
            },
            removeSceneNode: (state, action: PayloadAction<{sceneId: string, nodeId: string}>) => {
                delete state.scenes.byId[action.payload.sceneId].nodes.byId[action.payload.nodeId];
                state.scenes.byId[action.payload.sceneId].nodes.allIds = state.scenes.byId[action.payload.sceneId].nodes.allIds.filter(id => id !== action.payload.nodeId);
            },
            addSceneVariable: (state, action: PayloadAction<INewSceneVariable>) => {
                const newVariableId = uuid();
                const type = action.payload.newSceneVariable.type;
                let newSceneVariable: SceneVariable;
                switch(type) {
                    case "number":
                        newSceneVariable = {
                            ...action.payload.newSceneVariable,
                            id: newVariableId,
                            value: 0,
                            isActive: false
                        };
                        break;
                    case "boolean":
                        newSceneVariable = {
                            ...action.payload.newSceneVariable,
                            id: newVariableId,
                            value: false,
                            isActive: false
                        };
                        break;
                    case "trigger":
                        newSceneVariable = {
                            ...action.payload.newSceneVariable,
                            id: newVariableId,
                            value: null,
                            isActive: false
                        }
                        break;
                    default:
                        console.error("Should not encounter type outwith expected range.")
                        return;
                }
                state.scenes.byId[action.payload.sceneId].variables.byId[newVariableId] = newSceneVariable;
                state.scenes.byId[action.payload.sceneId].variables.allIds.push(newVariableId);
            },
            removeSceneVariable: (state, action: PayloadAction<{sceneId: string, variableId: string}>) => {
                delete state.scenes.byId[action.payload.sceneId].variables.byId[action.payload.variableId];
                state.scenes.byId[action.payload.sceneId].variables.allIds = state.scenes.byId[action.payload.sceneId].variables.allIds.filter(id => id !== action.payload.variableId);
            },
            moveScene: (
                state,
                action: PayloadAction<{ active: string; over: string }>
            ) => {
                const oldIndex = state.scenes.allIds.indexOf(action.payload.active);
                const newIndex = state.scenes.allIds.indexOf(action.payload.over);
                state.scenes.allIds.splice(oldIndex, 1);
                state.scenes.allIds.splice(newIndex, 0, action.payload.active);
            },
        }
    }
);

export const {
    addScene,
    removeScene,
    setSceneShowNumber,
    editScene,
    moveScene,
    addSceneNode,
    removeSceneNode,
    addSceneVariable,
    removeSceneVariable
} = scenesSlice.actions;

export default scenesSlice.reducer;