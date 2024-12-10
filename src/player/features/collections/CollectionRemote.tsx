import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";

import {selectAllSounds, selectSoundById, Sound} from "../sound/soundsSlice";

type CollectionRemoteProps = {
  onPlay: (sound: Sound) => void;
  onStop: (id: string) => void;
};

export function CollectionRemote({ onPlay, onStop }: CollectionRemoteProps) {
  const collections = useSelector((state: RootState) => state.collections);
  const playback = useSelector((state: RootState) => state.collectionPlayback);
  const sounds = useSelector(selectAllSounds);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_PLAY", (args) => {
      const id = args[0];

      if (id in sounds) {
        const sound = useSelector(selectSoundById(id));
        onPlay(sound);
      } else if (id in collections.collections.byId) {
        const collection = collections.collections.byId[id];
        const sounds = [...collection.sounds];
        const soundId = sounds[Math.floor(Math.random() * sounds.length)];
        const sound = useSelector(selectSoundById(soundId));
        if (sound) {
          onPlay(sound);
        }
      }
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_PLAY");
    };
  }, [onPlay, collections]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_STOP", (args) => {
      const id = args[0];
      onStop(id);
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_STOP");
    };
  }, [onPlay, collections]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_PLAYBACK_REQUEST", () => {
      const sounds = Object.values(playback.playback);
      window.player.collectionPlaybackReply({
        sounds,
      });
    });

    return () => {
      window.player.removeAllListeners(
        "PLAYER_REMOTE_SOUNDBOARD_PLAYBACK_REQUEST"
      );
    };
  }, [playback]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_GET_ALL_REQUEST", () => {
      window.player.collectionGetAllReply({
        collections: collections.collections.allIds.map(
          (id) => collections.collections.byId[id]
        ),
        sounds: useSelector(selectAllSounds),
      });
    });
  }, [collections]);

  return <></>;
}
