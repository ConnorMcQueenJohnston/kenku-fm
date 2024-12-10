import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import { SoundComponent } from "../sound/SoundComponent";
import {selectSoundById} from "../sound/soundsSlice";

type CollectionPlaybackSyncProps = {
  onSync: (update: (id: string, sound: SoundComponent) => void) => void;
};

// Sync collection redux store and playback
// This is done in a empty component to avoid re-rendering any children
// which is important for high performance live volume updating
export function CollectionPlaybackSync({
  onSync,
}: CollectionPlaybackSyncProps) {
  const collections = useSelector((state: RootState) => state.collections);

  useEffect(() => {
    onSync((id, sound) => {
      const state = useSelector(selectSoundById(id));
      if (state) {
        if (state.volume !== sound.options.volume) {
          sound.volume(state.volume);
        }
        if (state.loop !== sound.options.loop) {
          sound.loop(state.loop);
        }
      }
    });
  }, [collections]);

  return <></>;
}
