import React, {useState} from "react";
import Container from "@mui/material/Container";
import {Track} from "../playlists/playlistsSlice";
import {Sound} from "../soundboards/soundboardsSlice";
import {SoundboardsContainer} from "./SoundboardsContainer";
import {PlaylistAdd} from "../playlists/PlaylistAdd";
import {SoundboardAdd} from "../soundboards/SoundboardAdd";
import {PlaylistsContainer} from "./PlaylistsContainer";

type HomeProps = {
    onPlayTrack: (track: Track) => void;
    onPlaySound: (sound: Sound) => void;
};

export interface DisplayItemOption {
    value: number | string;
    displayName?: string;
}

export function Home({onPlayTrack, onPlaySound}: HomeProps) {
    const [playlistAddOpen, setPlaylistAddOpen] = useState(false);
    const [soundboardAddOpen, setSoundboardAddOpen] = useState(false);

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 4,
                mb: "248px",
            }}
        >
                <PlaylistsContainer onPlayTrack={onPlayTrack}
                                    setPlaylistAddOpen={setPlaylistAddOpen}></PlaylistsContainer>
                <SoundboardsContainer onPlaySound={onPlaySound}
                                      setSoundboardAddOpen={setSoundboardAddOpen}></SoundboardsContainer>
                <PlaylistAdd
                    open={playlistAddOpen}
                    onClose={() => setPlaylistAddOpen(false)}
                />
                <SoundboardAdd
                    open={soundboardAddOpen}
                    onClose={() => setSoundboardAddOpen(false)}
                />
        </Container>
    );
}
