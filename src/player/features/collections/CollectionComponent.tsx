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
import {addSoundsToCollection, removeCollection} from "./collectionsSlice";
import {SoundAdd} from "../sound/SoundAdd";
import {CollectionSettings} from "./CollectionSettings";
import {CollectionSounds} from "./CollectionSounds";

import {isBackground, backgrounds} from "../../backgrounds";
import {Directories, useDrop} from "../../common/useDrop";
import {useNavigate, useParams} from "react-router-dom";
import {setBackground} from "../../app/store/appSlice";
import {Badge} from "@mui/material";
import {AddOutlined, MusicNote} from "@mui/icons-material";
import {Sound} from "../sound/soundsSlice";

type CollectionProps = {
    onPlay: (sound: Sound) => void;
    onStop: (id: string) => void;
};

export function CollectionComponent({onPlay, onStop}: CollectionProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {collectionId} = useParams();
    console.log(`Collection ID: ${collectionId}`);
    const collection = useSelector(
        (state: RootState) => state.collections.collections.byId[collectionId]
    );

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [addSoundToCollectionOpen, setAddSoundToCollectionOpen ] = useState(false);

    const image = isBackground(collection.background)
        ? backgrounds[collection.background]
        : collection.background;

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
        navigator.clipboard.writeText(collection.id);
        handleMenuClose();
    }

    function handleDelete() {
        dispatch(removeCollection(collection.id));
        navigate(-1);
        handleMenuClose();
    }

    const {dragging, containerListeners, overlayListeners} = useDrop(
        (directories: Directories) => {
            const sounds: Sound[] = [];
            for (let directory of Object.values(directories)) {
                sounds.push(
                    ...directory.audioFiles.map((file) => ({
                        ...file,
                        loop: false,
                        volume: 1,
                        fadeIn: 100,
                        fadeOut: 100,
                    }))
                );
            }
            dispatch(addSoundsToCollection({soundIds: sounds.map(x => x.id), collectionId: collection.id}));
        }
    );

    return (
        <>
            <Container
                sx={{
                    padding: "0px !important",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh"
                }}
                {...containerListeners}
            >
                {/*<Box*/}
                {/*  sx={{*/}
                {/*    backgroundImage:*/}
                {/*      "linear-gradient(0deg, #ffffff44 30%,  #00000088 100%)",*/}
                {/*    position: "absolute",*/}
                {/*    top: 0,*/}
                {/*    left: 0,*/}
                {/*    right: 0,*/}
                {/*    bottom: 0,*/}
                {/*    pointerEvents: "none",*/}
                {/*  }}*/}
                {/*/>*/}
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
                        {collection.title}
                    </Typography>
                    <Stack direction="row">
                        <Tooltip title="Add Sound To Collection">
                            <IconButton onClick={() => setAddSoundToCollectionOpen(true)}>
                                <Badge badgeContent={<AddOutlined/>}>
                                    <MusicNote></MusicNote>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleMenuClick}>
                            <MoreVert/>
                        </IconButton>
                    </Stack>
                </Stack>
                <CollectionSounds
                    collection={collection}
                    onPlay={onPlay}
                    onStop={onStop}
                />
                <Backdrop
                    open={dragging}
                    sx={{zIndex: 100, bgcolor: "rgba(0, 0, 0, 0.8)"}}
                    {...overlayListeners}
                >
                    <Typography sx={{pointerEvents: "none"}}>
                        Drop the sounds here...
                    </Typography>
                </Backdrop>
            </Container>
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

            <SoundAdd
                collectionId={collectionId}
                open={addSoundToCollectionOpen}
                onClose={() => setAddSoundToCollectionOpen(false)}></SoundAdd>

            <CollectionSettings
                collection={collection}
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}
