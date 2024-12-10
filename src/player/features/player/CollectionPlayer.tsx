import React from "react";

import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import { stopSound } from "../collections/collectionPlaybackSlice";

const SoundProgress = styled(LinearProgress)({
  height: 32,
  borderRadius: 16,
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  "& .MuiLinearProgress-bar": {
    transition: "transform 1s linear",
  },
});

type CollectionPlayerProps = {
  onCollectionStop: (id: string) => void;
};

export function CollectionPlayer({ onCollectionStop }: CollectionPlayerProps) {
  const dispatch = useDispatch();
  const collectionPlayback = useSelector(
    (state: RootState) => state.collectionPlayback
  );

  function handleCollectionStop(id: string) {
    dispatch(stopSound(id));
    onCollectionStop(id);
  }

  const sounds = Object.values(collectionPlayback.playback);

  if (sounds.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" gap={1} pb={1} overflow="auto">
      {sounds.map((sound) => (
        <Box sx={{ position: "relative" }} key={sound.id}>
          <SoundProgress
            variant="determinate"
            value={Math.min((sound.progress / sound.duration) * 100, 100)}
          />
          <Chip
            label={sound.title}
            onDelete={() => handleCollectionStop(sound.id)}
          />
        </Box>
      ))}
    </Stack>
  );
}
