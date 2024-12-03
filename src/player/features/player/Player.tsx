import React from "react";

import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import {SoundboardPlayer} from "./SoundboardPlayer";
import {PlaylistPlayer} from "./PlaylistPlayer";
import {DragHandle} from "@mui/icons-material";
import Box from "@mui/material/Box";

type PlayerProps = {
    onPlaylistNext: () => void;
    onPlaylistPrevious: () => void;
    onPlaylistSeek: (to: number) => void;
    onSoundboardStop: (id: string) => void;
};

export function Player({
                           onPlaylistNext,
                           onPlaylistPrevious,
                           onPlaylistSeek,
                           onSoundboardStop,
                       }: PlayerProps) {
    return (
        <Container
            sx={{
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
            }}
            maxWidth="md"
        >
            <Paper
                elevation={8}
                sx={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                }}
            >
                {/* TODO: Add in Track / Soundboard Player so that soundboards can be grabbed when in playlist view and vice versa.*/}
                {/*<Box sx={{*/}
                {/*    position: "absolute",*/}
                {/*    display: "flex",*/}
                {/*    top: 0,*/}
                {/*    left: 0,*/}
                {/*    bottom: 0,*/}
                {/*    right: 0,*/}
                {/*    justifyContent: "center"*/}
                {/*}}>*/}
                {/*    <DragHandle></DragHandle>*/}
                {/*</Box>*/}
                <SoundboardPlayer onSoundboardStop={onSoundboardStop}/>
                <PlaylistPlayer
                    onPlaylistNext={onPlaylistNext}
                    onPlaylistPrevious={onPlaylistPrevious}
                    onPlaylistSeek={onPlaylistSeek}
                />
            </Paper>
        </Container>
    );
}
