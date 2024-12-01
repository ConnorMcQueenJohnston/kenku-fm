import Container from "@mui/material/Container";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {RootState} from "../../app/store";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Back from "@mui/icons-material/ChevronLeftRounded";
import Tooltip from "@mui/material/Tooltip";
import MoreVert from "@mui/icons-material/MoreVertRounded";
import Backdrop from "@mui/material/Backdrop";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";
import {backgrounds, isBackground} from "../../backgrounds";
import {setBackground} from "../../app/appSlice";
import {Sound} from "../soundboards/soundboardsSlice";
import {useDrop} from "../../common/useDrop";
import {removeScene} from "./scenesSlice";
import {SceneSettings} from "./SceneSettings";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {AddOutlined, Album, LibraryMusic, MusicNote} from "@mui/icons-material";
import {Badge} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export interface Scene {
    id: string;
    title: string;
    background: string;
    variables: {
        byId: Record<string, SceneVariable>
        allIds: string[]
    },
    nodes: {
        byId: Record<string, SceneNode>
        allIds: string[]
    }
}

export type SceneVariableType = "boolean | trigger";

export type SceneVariable = {
    type: SceneVariableType;
}

export type SceneNode = {
    id: string;
    title?: string;
}

export function Scene() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {sceneId} = useParams();
    const scene = useSelector(
        (state: RootState) => state.scenes.scenes.byId[sceneId]
    );

    const [addOpen, setAddOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const image = isBackground(scene.background)
        ? backgrounds[scene.background]
        : scene.background;

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
        navigator.clipboard.writeText(scene.id);
        handleMenuClose();
    }

    function handleDelete() {
        dispatch(removeScene(scene.id));
        navigate(-1);
        handleMenuClose();
    }

    const {dragging, containerListeners, overlayListeners} = useDrop(
        (directories) => {
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
            // dispatch(addSounds({ sounds, soundboardId: soundboard.id }));
        }
    );


    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh"
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
                    <Typography sx={{zIndex: 1, textShadow: "2px 2px #000"}} variant="h3" noWrap>
                        {scene.title}
                    </Typography>
                    <Stack direction="row">
                        <Tooltip title="Add Track">
                            <IconButton onClick={() => setAddOpen(true)}>
                                <Badge badgeContent={<AddOutlined/>}>
                                    <LibraryMusic></LibraryMusic>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Sound">
                            <IconButton onClick={() => setAddOpen(true)}>
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

                <Box sx={{
                    flexGrow: 1,
                    padding: "2rem 4rem"
                }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <Box>
                                <Stack spacing={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Variables</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Nodes</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Sounds</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Track Timeline</Typography>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item xs={2} sx={{
                            paddingLeft: "1rem"
                        }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Search</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                {/*<SoundboardSounds*/}
                {/*    soundboard={soundboard}*/}
                {/*    onPlay={onPlay}*/}
                {/*    onStop={onStop}*/}
                {/*/>*/}
                <Backdrop
                    open={dragging}
                    sx={{zIndex: 100, bgcolor: "rgba(0, 0, 0, 0.8)"}}
                    {...overlayListeners}
                >
                    <Typography sx={{pointerEvents: "none"}}>
                        Drop the sounds here...
                    </Typography>
                </Backdrop>
            </Box>
            <Menu
                id="Scene-menu"
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
            {/*<SceneAddDialog*/}
            {/*    soundboardId={Scene.id}*/}
            {/*    open={addOpen}*/}
            {/*    onClose={() => setAddOpen(false)}*/}
            {/*/>*/}
            <SceneSettings
                scene={scene}
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}