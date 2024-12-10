import React, {useState} from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ShuffleIcon from "@mui/icons-material/ShuffleRounded";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import {backgrounds, isBackground} from "../../backgrounds";

import {Collection, removeCollection} from "./collectionsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store/store";
import {selectAllSounds, selectSoundById, Sound} from "../sound/soundsSlice";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import {Fade} from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVertRounded";
import Tooltip from "@mui/material/Tooltip";
import PauseIcon from "@mui/icons-material/PauseRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrowRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {PlaylistSettings} from "../playlists/PlaylistSettings";
import {removePlaylist} from "../playlists/playlistsSlice";
import {CollectionSettings} from "./CollectionSettings";

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
    const allSounds = useSelector(selectAllSounds);

    const image = isBackground(collection.background)
        ? backgrounds[collection.background]
        : collection.background;

    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const dispatch = useDispatch();

    function handleShuffle() {
        let sounds = [...collection.sounds];
        // Play a random sound from the collection
        const soundId = sounds[Math.floor(Math.random() * sounds.length)];
        const sound = allSounds.filter(x => x.id == soundId)[0];
        if (sound) {
            onPlay(sound);
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
        navigator.clipboard.writeText(collection.id);
        handleMenuClose();
    }

    function handleDelete() {
        dispatch(removeCollection(collection.id));
        handleMenuClose();
    }

    return (
        <Card sx={{position: "relative"}}>
            <CardActionArea onClick={() => onSelect(collection.id)} onMouseOver={() => handleSettingsMenuVisible(true)}
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
                            <Tooltip title={collection.title} placement="top">
                                <Typography variant="h5" noWrap sx={{zIndex: 1, cursor: "pointer"}}>
                                    {collection.title}
                                </Typography>
                            </Tooltip>
                            <Tooltip title="Play a random sound from this collection.">
                                <IconButton
                                    aria-label="shuffle"
                                    sx={{pointerEvents: "all"}}
                                    onClick={handleShuffle}
                                >
                                    <ShuffleIcon sx={{fontSize: "2rem"}}/>
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
            <CollectionSettings
                collection={collection}
                open={settingsMenuOpen}
                onClose={() => setSettingsMenuOpen(false)}
            />
        </Card>
    );
}

