import { combineReducers, configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "../../features/playlists/playlistsSlice";
import collectionsReducer, {
  CollectionsState,
} from "../../features/collections/collectionsSlice";
import soundsReducer from "../../features/sound/soundsSlice";
import playlistPlaybackReducer from "../../features/playlists/playlistPlaybackSlice";
import collectionPlaybackReducer from "../../features/collections/collectionPlaybackSlice";
import scenesReducer from "../../features/scene/scenesSlice";
import appReducer from "./appSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// const migrations: any = {
//   2: (state: RootState): RootState => {
//     let oldCollectionsState = state.collections as unknown;
//     oldCollectionsState = oldCollectionsState as V1CollectionsState;
//     return {
//       ...state,
//       collections: {
//         ...state.collections,
//         sounds: {
//           byId: oldCollectionsState.collections.sounds,
//           allIds: Object.keys(oldCollectionsState.sounds)
//         }
//       }
//     } as CollectionsState
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
  collections: collectionsReducer,
  sounds: soundsReducer,
  scenes: scenesReducer,
  playlistPlayback: persistReducer(
    playbackPersistConfig,
    playlistPlaybackReducer
  ),
  collectionPlayback: collectionPlaybackReducer,
});

const persistConfig = {
  key: "player",
  version: 1,
  storage,
  whitelist: ["playlists", "collections", "scenes", "sounds"],
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
