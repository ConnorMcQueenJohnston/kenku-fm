import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sound } from "../sound/soundsSlice";

export interface SoundPlayback extends Sound {
  progress: number;
  duration: number;
}

export interface PlaylistPlaybackState {
  playback: Record<string, SoundPlayback>;
}

const initialState: PlaylistPlaybackState = {
  playback: {},
};

export const collectionPlaybackSlice = createSlice({
  name: "collectionPlayback",
  initialState,
  reducers: {
    playSound: (
      state,
      action: PayloadAction<{ sound: Sound; duration: number }>
    ) => {
      const { sound, duration } = action.payload;
      state.playback[sound.id] = { ...sound, progress: 0, duration };
    },
    stopSound: (state, action: PayloadAction<string>) => {
      delete state.playback[action.payload];
    },
    updatePlayback: (
      state,
      action: PayloadAction<{ id: string; progress: number }[]>
    ) => {
      const updates = action.payload;
      for (let { id, progress } of updates) {
        if (id in state.playback) {
          state.playback[id].progress = progress;
        }
      }
    },
  },
});

export const { playSound, stopSound, updatePlayback } =
  collectionPlaybackSlice.actions;

export default collectionPlaybackSlice.reducer;
