import React, {useCallback, useEffect, useState} from "react";

import styled from "@mui/material/styles/styled";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import {Routes, Route, LinkProps as RouterLinkProps, Link as RouterLink} from "react-router-dom";

import {Player} from "../features/player/Player";
import {usePlaylistPlayback} from "../features/playlists/usePlaylistPlayback";
import {PlaylistMediaSession} from "../features/playlists/PlaylistMediaSession";
import {PlaylistRemote} from "../features/playlists/PlaylistRemote";
import {PlaylistPlaybackSync} from "../features/playlists/PlaylistPlaybackSync";
import {Playlists} from "../features/playlists/Playlists";
import {Playlist} from "../features/playlists/Playlist";

import "../../renderer/app/App.css";
import {Home} from "../features/home/Home";
import {Soundboards} from "../features/soundboards/Soundboards";
import {Soundboard} from "../features/soundboards/Soundboard";
import {useSoundboardPlayback} from "../features/soundboards/useSoundboardPlayback";
import {SoundboardRemote} from "../features/soundboards/SoundboardRemote";
import {SoundboardPlaybackSync} from "../features/soundboards/SoundboardPlaybackSync";
import {EventTrackPage} from "../features/eventTrack/EventTrackPage";
import {Link} from "@mui/material";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {useSelector} from "react-redux";
import {RootState} from "./store";
import {useLocation} from "react-router";
import {EventTrack} from "../features/eventTrack/EventTrack";
import Box from "@mui/material/Box";

const HomeLink = React.forwardRef<HTMLAnchorElement,
    Omit<RouterLinkProps, "to">>((props, ref) => <RouterLink ref={ref} to="/" {...props} />);

export function App() {
    const appSelector = useSelector((state: RootState) => state.app);
    const background = appSelector.background ?? null;

    const [errorMessage, setErrorMessage] = useState<string>();
    const [isHome, setIsHome] = useState(true);

    const handleError = useCallback((message: string) => {
        setErrorMessage(message);
    }, []);

    const playlist = usePlaylistPlayback(handleError);
    const soundboard = useSoundboardPlayback(handleError);

    const location = useLocation();

    useEffect(() => {
        setIsHome(location.pathname == "/" || location.pathname.includes("home"));
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
                zIndex: -10000
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

                {!isHome &&
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
                <Container sx={{
                    padding: "1rem 0",
                }}>
                    <Stack direction="row" spacing={1}>
                        <Link className="top-nav__link" color="inherit" underline="hover" component={HomeLink}>
                            <Chip label="Home"/>
                        </Link>
                        <Link className="top-nav__link" color="inherit" underline="hover" component={HomeLink}>
                            <Chip label="Playlists"/>
                        </Link>
                        <Link className="top-nav__link" color="inherit" underline="hover" component={HomeLink}>
                            <Chip label="Soundboards"/>
                        </Link>
                        <Link className="top-nav__link" color="inherit" underline="hover" component={HomeLink}>
                            <Chip label="Event Tracks"/>
                        </Link>
                    </Stack>
                </Container>

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
                                <Home onPlayTrack={playlist.play} onPlaySound={soundboard.play}/>
                            }
                        />
                        <Route
                            path="playlists"
                            element={<Playlists onPlay={playlist.play}/>}
                        />
                        <Route
                            path="playlists/:playlistId"
                            element={<Playlist onPlay={playlist.play}/>}
                        />
                        <Route
                            path="soundboards"
                            element={<Soundboards onPlay={soundboard.play}/>}
                        />
                        <Route
                            path="soundboards/:soundboardId"
                            element={
                                <Soundboard onPlay={soundboard.play} onStop={soundboard.stop}/>
                            }
                        />
                        <Route
                            path="eventTracks"
                            element={<EventTrackPage></EventTrackPage>}
                        />
                        <Route
                            path="eventTracks/:eventTrackId"
                            element={<EventTrack></EventTrack>}
                        />

                    </Routes>
                    <Player
                        onPlaylistSeek={playlist.seek}
                        onPlaylistNext={playlist.next}
                        onPlaylistPrevious={playlist.previous}
                        onSoundboardStop={soundboard.stop}
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
                    <SoundboardRemote onPlay={soundboard.play} onStop={soundboard.stop}/>
                    <SoundboardPlaybackSync onSync={soundboard.sync}/>
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
