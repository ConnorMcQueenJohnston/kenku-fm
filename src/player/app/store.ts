import { combineReducers, configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "../features/playlists/playlistsSlice";
import soundboardsReducer from "../features/soundboards/soundboardsSlice";
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

const migrations: any = {
  2: (state: RootState): RootState => {
    return {
      ...state,
    }
  }
};

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
