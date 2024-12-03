import { combineReducers, configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "../features/playlists/playlistsSlice";
import soundboardsReducer, {
  Sound,
  SoundboardsState,
  V1SoundboardsState
} from "../features/soundboards/soundboardsSlice";
import playlistPlaybackReducer from "../features/playlists/playlistPlaybackSlice";
import soundboardPlaybackReducer from "../features/soundboards/soundboardPlaybackSlice";
import scenesReducer from "../features/scene/scenesSlice";
import appReducer from "../app/appSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, createMigrate,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// const migrations: any = {
//   2: (state: RootState): RootState => {
//     let oldSoundboardsState = state.soundboards as unknown;
//     oldSoundboardsState = oldSoundboardsState as V1SoundboardsState;
//     return {
//       ...state,
//       soundboards: {
//         ...state.soundboards,
//         sounds: {
//           byId: oldSoundboardsState.soundboards.sounds,
//           allIds: Object.keys(oldSoundboardsState.sounds)
//         }
//       }
//     } as SoundboardsState
//   }
// };

const playbackPersistConfig = {
  key: "playback",
  version: 1,
  storage,
  whitelist: ["volume", "muted", "shuffle", "repeat"],
  // migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  app: appReducer,
  playlists: playlistsReducer,
  soundboards: soundboardsReducer,
  scenes: scenesReducer,
  playlistPlayback: persistReducer(
    playbackPersistConfig,
    playlistPlaybackReducer
  ),
  soundboardPlayback: soundboardPlaybackReducer,
});

const persistConfig = {
  key: "player",
  version: 1,
  storage,
  whitelist: ["playlists", "soundboards", "scenes"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
