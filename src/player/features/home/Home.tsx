import React, {useState} from "react";
import Container from "@mui/material/Container";
import {CollectionsContainer} from "./CollectionsContainer";
import {PlaylistAdd} from "../playlists/PlaylistAdd";
import {CollectionAdd} from "../collections/CollectionAdd";
import {PlaylistsContainer} from "./PlaylistsContainer";
import {ScenesContainer} from "./SceneContainer";
import {SceneAddDialog} from "../scene/SceneAddDialog";
import {useDispatch} from "react-redux";
import {resetBackground} from "../../app/store/appSlice";
import {Sound} from "../sound/soundsSlice";

type HomeProps = {
    onPlayTrack: (track: Sound) => void;
    onPlaySound: (sound: Sound) => void;
};

export interface DisplayItemOption {
    value: number | string;
    displayName?: string;
}

export function Home({onPlayTrack, onPlaySound}: HomeProps) {
    const dispatch = useDispatch();
    dispatch(resetBackground());

    const [playlistAddOpen, setPlaylistAddOpen] = useState(false);
    const [collectionAddOpen, setCollectionAddOpen] = useState(false);
    const [SceneAddOpen, setSceneAddOpen] = useState(false);

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
            <CollectionsContainer onPlaySound={onPlaySound}
                                  setCollectionAddOpen={setCollectionAddOpen}></CollectionsContainer>
            <ScenesContainer setSceneAddOpen={setSceneAddOpen}></ScenesContainer>
            <PlaylistAdd
                open={playlistAddOpen}
                onClose={() => setPlaylistAddOpen(false)}
            />
            <CollectionAdd
                open={collectionAddOpen}
                onClose={() => setCollectionAddOpen(false)}
            />
            <SceneAddDialog open={SceneAddOpen} onClose={() => setSceneAddOpen(false)}
            />
        </Container>
    );
}
