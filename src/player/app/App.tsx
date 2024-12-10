import React, {useCallback, useEffect, useState} from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import {Routes, Route} from "react-router-dom";

import {Player} from "../features/player/Player";
import {usePlaylistPlayback} from "../features/playlists/usePlaylistPlayback";
import {PlaylistMediaSession} from "../features/playlists/PlaylistMediaSession";
import {PlaylistRemote} from "../features/playlists/PlaylistRemote";
import {PlaylistPlaybackSync} from "../features/playlists/PlaylistPlaybackSync";
import {Playlists} from "../features/playlists/Playlists";
import {PlaylistComponent} from "../features/playlists/PlaylistComponent";

import "../../renderer/app/App.css";
import {Home} from "../features/home/Home";
import {CollectionsComponent} from "../features/collections/CollectionsComponent";
import {CollectionComponent} from "../features/collections/CollectionComponent";
import {useCollectionPlayback} from "../features/collections/useCollectionPlayback";
import {CollectionRemote} from "../features/collections/CollectionRemote";
import {CollectionPlaybackSync} from "../features/collections/CollectionPlaybackSync";
import {ScenePage} from "../features/scene/ScenePage";
import Container from "@mui/material/Container";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/store";
import {useLocation} from "react-router";
import Box from "@mui/material/Box";
import {Scene} from "../features/scene/Scene";
import {TopNav} from "../navigation/TopNav";
import {SoundAdd} from "../features/sound/SoundAdd";
import {selectIsAddSoundPanelOpen, setAddSoundPanelOpen} from "./store/appSlice";
import {SwipeableDrawer} from "@mui/material";
import {SceneManagerSounds} from "../features/scene/SceneManagerSounds";

export function App() {
    const dispatch = useDispatch();
    const appSelector = useSelector((state: RootState) => state.app);
    const background = appSelector.background ?? null;

    const [errorMessage, setErrorMessage] = useState<string>();
    const [shouldShowBacklight, setShouldShowBacklight] = useState(true);

    const handleError = useCallback((message: string) => {
        setErrorMessage(message);
    }, []);

    const playlist = usePlaylistPlayback(handleError);
    const collection = useCollectionPlayback(handleError);

    const location = useLocation();
    const locationsToIgnoreBackingLight: string[] = ['/', '/home', '/collections', '/playlists', '/scenes'];

    const addSoundOpen = useSelector(selectIsAddSoundPanelOpen);

    function setAddSoundOpen(open: boolean) {
        dispatch(setAddSoundPanelOpen(open));
    }

    useEffect(() => {
        setShouldShowBacklight( locationsToIgnoreBackingLight.includes(location.pathname));
    }, [location]);

    return (
        <>
            <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: "100%",
                zIndex: -10000,
                overflowX: "hidden"
            }}>
                <Box sx={{
                    backgroundImage: `url("${background}")`,
                    backgroundSize: "cover",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "100%",
                    zIndex: -1000
                }}>
                </Box>

                {!shouldShowBacklight &&
                    <Container sx={{
                        backgroundImage: "linear-gradient(0deg, #ffffff44 300%,  #00000088 100%)",
                        opacity: "70%",
                        backgroundSize: "cover",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "100%",
                        zIndex: -100
                    }}>
                    </Container>
                }

                <TopNav></TopNav>

                <Box sx={
                    {
                        position: "relative"
                    }
                }
                >
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home onPlayTrack={playlist.play} onPlaySound={collection.play}/>
                            }
                        />
                        <Route
                            path="playlists"
                            element={<Playlists onPlay={playlist.play}/>}
                        />
                        <Route
                            path="playlists/:playlistId"
                            element={<PlaylistComponent onPlay={playlist.play}/>}
                        />
                        <Route
                            path="collections"
                            element={<CollectionsComponent onPlay={collection.play}/>}
                        />
                        <Route
                            path="collections/:collectionId"
                            element={
                                <CollectionComponent onPlay={collection.play} onStop={collection.stop}/>
                            }
                        />
                        <Route
                            path="scenes"
                            element={<ScenePage></ScenePage>}
                        />
                        <Route
                            path="scenes/:sceneId"
                            element={<Scene></Scene>}
                        />

                    </Routes>

                    <SoundAdd
                        open={addSoundOpen}
                        onClose={() => setAddSoundOpen(false)}
                    />

                    <Player
                        onPlaylistSeek={playlist.seek}
                        onPlaylistNext={playlist.next}
                        onPlaylistPrevious={playlist.previous}
                        onCollectionStop={collection.stop}
                    />
                    <PlaylistMediaSession
                        onSeek={playlist.seek}
                        onNext={playlist.next}
                        onPrevious={playlist.previous}
                        onStop={playlist.stop}
                    />
                    <PlaylistRemote
                        onPlay={playlist.play}
                        onSeek={playlist.seek}
                        onNext={playlist.next}
                        onPrevious={playlist.previous}
                    />
                    <PlaylistPlaybackSync
                        onMute={playlist.mute}
                        onPauseResume={playlist.pauseResume}
                        onVolume={playlist.volume}
                    />
                    <CollectionRemote onPlay={collection.play} onStop={collection.stop}/>
                    <CollectionPlaybackSync onSync={collection.sync}/>
                    <Snackbar
                        open={Boolean(errorMessage)}
                        autoHideDuration={4000}
                        onClose={() => setErrorMessage(undefined)}
                        anchorOrigin={{vertical: "top", horizontal: "center"}}
                    >
                        <Alert severity="error">{errorMessage}</Alert>
                    </Snackbar>
                </Box>
            </Box>

        </>
    );
}
