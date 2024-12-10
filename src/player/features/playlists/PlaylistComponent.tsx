import React, {useState} from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/AddCircleRounded";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Back from "@mui/icons-material/ChevronLeftRounded";
import MoreVert from "@mui/icons-material/MoreVertRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Backdrop from "@mui/material/Backdrop";

import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store/store";
import {TrackAdd} from "./TrackAdd";
import {PlaylistSettings} from "./PlaylistSettings";
import {PlaylistTracks} from "./PlaylistTracks";

import {isBackground, backgrounds} from "../../backgrounds";
import {startQueue} from "./playlistPlaybackSlice";
import {useDrop} from "../../common/useDrop";
import {useNavigate, useParams} from "react-router-dom";
import {setBackground} from "../../app/store/appSlice";
import {Badge} from "@mui/material";
import {AddOutlined, LibraryMusic} from "@mui/icons-material";
import {selectAllAudioByAudioIds, selectAllSounds, selectSoundById, Sound} from "../sound/soundsSlice";
import {addSoundsToPlaylist, removePlaylist} from "./playlistsSlice";

type PlaylistProps = {
    onPlay: (track: Sound) => void;
};

export function PlaylistComponent({onPlay}: PlaylistProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const playlists = useSelector((state: RootState) => state.playlists);
    const {playlistId} = useParams();
    const playlist = playlists.playlists.byId[playlistId];
    const allSounds = useSelector(selectAllSounds);

    const [addOpen, setAddOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const items = useSelector(selectAllAudioByAudioIds(playlist.tracks));

    const image = isBackground(playlist.background)
        ? backgrounds[playlist.background]
        : playlist.background;

    dispatch(setBackground(image));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    function handleEdit() {
        setSettingsOpen(true);
        handleMenuClose();
    }

    function handleCopyID() {
        navigator.clipboard.writeText(playlist.id);
        handleMenuClose();
    }

    function handleDelete() {
        dispatch(removePlaylist(playlist.id));
        navigate(-1);
        handleMenuClose();
    }

    function handleTrackPlay(trackId: string) {
        const track: Sound = allSounds.filter(x => x.id == trackId)[0];
        if (track) {
            let tracks = [...playlist.tracks];
            dispatch(startQueue({tracks, trackId, playlistId}));
            onPlay(track);
        }
    }

    const {dragging, containerListeners, overlayListeners} = useDrop(
        (directories) => {
            const tracks: string[] = [];
            for (let directory of Object.values(directories)) {
                tracks.push(...directory.audioFiles.map(x => x.id));
            }
            dispatch(addSoundsToPlaylist({soundIds: tracks, playlistId}));
        }
    );

    return (
        <>
            <Container
                sx={{
                    padding: "0px !important",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                }}
                {...containerListeners}
            >
                <Stack
                    p={4}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{zIndex: 1}}
                >
                    <IconButton onClick={() => navigate(-1)} sx={{mr: "40px"}}>
                        <Back/>
                    </IconButton>
                    <Typography sx={{zIndex: 1}} variant="h3" noWrap>
                        {playlist.title}
                    </Typography>
                    <Stack direction="row">
                        <Tooltip title="Add Track">
                            <IconButton onClick={() => setAddOpen(true)}>
                                <Badge badgeContent={<AddOutlined/>}>
                                    <LibraryMusic></LibraryMusic>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleMenuClick}>
                            <MoreVert/>
                        </IconButton>
                    </Stack>
                </Stack>
                <PlaylistTracks
                    items={items}
                    playlist={playlist}
                    onPlay={handleTrackPlay}
                />
                <Backdrop
                    open={dragging}
                    sx={{zIndex: 100, bgcolor: "rgba(0, 0, 0, 0.8)"}}
                    {...overlayListeners}
                >
                    <Typography sx={{pointerEvents: "none"}}>
                        Drop the tracks here...
                    </Typography>
                </Backdrop>
            </Container>
            <Menu
                id="playlist-menu"
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
            <TrackAdd
                playlistId={playlist.id}
                open={addOpen}
                onClose={() => setAddOpen(false)}
            />
            <PlaylistSettings
                playlist={playlist}
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}
