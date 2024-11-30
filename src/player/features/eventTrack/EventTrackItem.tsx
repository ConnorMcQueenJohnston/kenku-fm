import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";

import { backgrounds, isBackground } from "../../backgrounds";

import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {EventTrack} from "./EventTrack";

type EventTrackItemProps = {
    eventTrack: EventTrack;
    onSelect: (id: string) => void;
};

export function EventTrackItem({
                                   eventTrack,
                                   onSelect,
                               }: EventTrackItemProps) {
    const eventTracks = useSelector((state: RootState) => state.soundboards);
    const image = isBackground(eventTrack.background)
        ? backgrounds[eventTrack.background]
        : eventTrack.background;

    return (
        <Card sx={{ position: "relative" }}>
            <CardActionArea onClick={() => onSelect(eventTrack.id)}>
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
                    {eventTrack.title}
                </Typography>
                {/*<IconButton*/}
                {/*    aria-label="shuffle"*/}
                {/*    sx={{ pointerEvents: "all" }}*/}
                {/*    onClick={handleShuffle}*/}
                {/*>*/}
                {/*    <ShuffleIcon sx={{ fontSize: "2rem" }} />*/}
                {/*</IconButton>*/}
            </Box>
        </Card>
    );
}
