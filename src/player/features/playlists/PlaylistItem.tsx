import React, {useState} from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import PlayArrowIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import {backgrounds, isBackground} from "../../backgrounds";

import {Playlist, removePlaylist} from "./playlistsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store/store";
import {playPause, startQueue} from "./playlistPlaybackSlice";
import {selectAllSounds, Sound} from "../sound/soundsSlice";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {SceneSettings} from "../scene/SceneSettings";
import {removeScene} from "../scene/scenesSlice";
import {PlaylistSettings} from "./PlaylistSettings";
import Stack from "@mui/material/Stack";
import {Fade} from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVertRounded";
import Tooltip from "@mui/material/Tooltip";

type PlaylistItemProps = {
    playlist: Playlist;
    onSelect: (id: string) => void;
    onPlay: (track: Sound) => void;
};

export function PlaylistItem({
                                 playlist,
                                 onSelect,
                                 onPlay,
                             }: PlaylistItemProps) {
    const playing = useSelector(
        (state: RootState) =>
            state.playlistPlayback.playing &&
            state.playlistPlayback.queue?.playlistId === playlist.id
    );
    const queue = useSelector((state: RootState) => state.playlistPlayback.queue);
    const shuffle = useSelector(
        (state: RootState) => state.playlistPlayback.shuffle
    );
    const allSounds = useSelector(selectAllSounds);

    const dispatch = useDispatch();

    const image = isBackground(playlist.background)
        ? backgrounds[playlist.background]
        : playlist.background;

    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    function handlePlay() {
        if (queue?.playlistId === playlist.id) {
            dispatch(playPause(!playing));
        } else {
            let tracks = [...playlist.tracks];
            const trackIndex = shuffle
                ? Math.floor(Math.random() * tracks.length)
                : 0;
            const trackId = tracks[trackIndex];
            const track: Sound = allSounds.filter(x => x.id == trackId)[0];
            if (track) {
                dispatch(startQueue({tracks, trackId, playlistId: playlist.id}));
                onPlay(track);
            }
        }
    }

    function handleSettingsMenuVisible(isVisible: boolean) {
        setSettingsMenuVisible(isVisible);
    }

    function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    function handleEdit() {
        setSettingsMenuOpen(true);
        handleMenuClose();
    }

    function handleCopyID() {
        navigator.clipboard.writeText(playlist.id);
        handleMenuClose();
    }

    function handleDelete() {
        dispatch(removePlaylist(playlist.id));
        handleMenuClose();
    }

    return (
        <Card sx={{position: "relative"}}>
            <CardActionArea onClick={() => onSelect(playlist.id)} onMouseOver={() => handleSettingsMenuVisible(true)}
                            onMouseOut={() => handleSettingsMenuVisible(false)}>
                <CardMedia
                    component="img"
                    height="200px"
                    image={image}
                    alt={"Background"}
                    sx={{pointerEvents: "none"}}
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
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: "none",
                }}
            >
                <CardContent sx={{
                    height: "100%",
                }}>
                    <Stack sx={{
                        height: "100%",
                        display: "flex",
                        direction: "column",
                        alignItems: "space-between",
                        justifyContent: "space-between"
                    }}
                    >

                        <Box sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}>
                            <Fade in={settingsMenuVisible}>
                                <IconButton sx={{
                                    minWidth: "2rem",
                                    flexShrink: 0,
                                    pointerEvents: "auto"
                                }} onClick={handleMenuClick} onMouseOver={() => handleSettingsMenuVisible(true)}>
                                    <MoreVert/>
                                </IconButton>
                            </Fade>

                        </Box>

                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Tooltip title={playlist.title} placement="top">
                                <Typography variant="h5" noWrap sx={{zIndex: 1, cursor: "pointer"}}>
                                    {playlist.title}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={"Play a random song from " + playlist.title} placement="top">
                                <IconButton
                                    aria-label="play/pause"
                                    sx={{pointerEvents: "all"}}
                                    onClick={handlePlay}
                                >
                                    {playing ? (
                                        <PauseIcon sx={{fontSize: "2rem"}}/>
                                    ) : (
                                        <PlayArrowIcon sx={{fontSize: "2rem"}}/>
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>

                    </Stack>
                </CardContent>
            </Box>

            <Menu
                id="collection-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    "aria-labelledby": "more-button",
                }}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleCopyID}>Copy ID</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            <PlaylistSettings
                playlist={playlist}
                open={settingsMenuOpen}
                onClose={() => setSettingsMenuOpen(false)}
            />
        </Card>
    );
}
