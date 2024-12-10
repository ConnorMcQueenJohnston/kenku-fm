import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ShuffleIcon from "@mui/icons-material/ShuffleRounded";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { backgrounds, isBackground } from "../../backgrounds";

import { Collection } from "./collectionsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import {selectSoundById, Sound} from "../sound/soundsSlice";

type CollectionItemProps = {
  collection: Collection;
  onSelect: (id: string) => void;
  onPlay: (sound: Sound) => void;
};

export function CollectionItem({
  collection,
  onSelect,
  onPlay,
}: CollectionItemProps) {
  const collections = useSelector((state: RootState) => state.collections);
  const image = isBackground(collection.background)
    ? backgrounds[collection.background]
    : collection.background;

  function handleShuffle() {
    let sounds = [...collection.sounds];
    // Play a random sound from the collection
    const soundId = sounds[Math.floor(Math.random() * sounds.length)];
    const sound = useSelector(selectSoundById(soundId));
    if (sound) {
      onPlay(sound);
    }
  }

  return (
    <Card sx={{ position: "relative" }}>
      <CardActionArea onClick={() => onSelect(collection.id)}>
        <CardMedia
          component="img"
          height="200px"
          image={image}
          alt={"Background"}
          sx={{ pointerEvents: "none" }}
        />
      </CardActionArea>
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(0deg, #00000088 30%, #ffffff44 100%)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <Typography variant="h5" component="div">
          {collection.title}
        </Typography>
        <IconButton
          aria-label="shuffle"
          sx={{ pointerEvents: "all" }}
          onClick={handleShuffle}
        >
          <ShuffleIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box>
    </Card>
  );
}
