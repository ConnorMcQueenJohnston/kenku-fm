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
import {AudioType, selectAllAudioByAudioIds, Sound} from "../soundboards/soundboardsSlice";
import {useDrop} from "../../common/useDrop";
import {
    removeScene,
    ISceneTrack,
    SceneNode,
    removeSceneNode,
    addSceneNode,
    addSceneVariable,
    removeSceneVariable, SceneVariable, Scene
} from "./scenesSlice";
import {SceneTrack} from "./SceneTrack";
import {SceneSettings} from "./SceneSettings";
import Box from "@mui/material/Box";
import {AddOutlined, ArrowLeftOutlined, Hub, LibraryMusic, MusicNote, Tune} from "@mui/icons-material";
import {Badge, Input, ListItem, SwipeableDrawer} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {v4 as uuid} from "uuid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import {SceneManagerSounds} from "./SceneManagerSounds";

export function Scene() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {sceneId} = useParams();
    const scene: Scene = useSelector(
        (state: RootState) => state.scenes.scenes.byId[sceneId]
    );
    const allSoundsById = useSelector(selectAllAudioByAudioIds(scene.soundIds));

    const [addOpen, setAddOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [addSoundsDrawerOpen, setAddSoundsDrawerOpen] = useState(false);

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setAddSoundsDrawerOpen(open);
            };


    const image = isBackground(scene.background)
        ? backgrounds[scene.background]
        : scene.background;

    dispatch(setBackground(image));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const sceneTracks: ISceneTrack[] = [
        {
            id: uuid(),
            title: "First Track"
        },
        {
            id: uuid(),
            title: "Second Track"
        }
    ];

    function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    function handleSceneEdit() {
        setSettingsOpen(true);
        handleMenuClose();
    }

    function handleSceneCopyID() {
        navigator.clipboard.writeText(scene.id);
        handleMenuClose();
    }

    function handleSceneDelete() {
        dispatch(removeScene(scene.id));
        navigate(-1);
        handleMenuClose();
    }

    function handleNodeAdd() {
        dispatch(addSceneNode({sceneId, newNode: {title: "New Node", required: false}}));
    }

    function handleNodeDelete(node: SceneNode) {
        if (node.required) return;
        dispatch(removeSceneNode({sceneId, nodeId: node.id}))
    }

    function handleVariableAdd() {
        dispatch(addSceneVariable({sceneId, newSceneVariable: {title: "New Variable", type: "trigger"}}));
    }

    function handleVariableDelete(variable: SceneVariable) {
        dispatch(removeSceneVariable({sceneId, variableId: variable.id}))
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
                    <Box>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5">Variables</Typography>
                                        <Stack direction="row">
                                            <Tooltip title="Add Variable">
                                                <IconButton onClick={() => handleVariableAdd()}>
                                                    <Badge badgeContent={<AddOutlined/>}>
                                                        <Tune></Tune>
                                                    </Badge>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>

                                    <Stack
                                        direction="row"
                                        gap="0.25rem"
                                    >
                                        {scene.variables.allIds.map((id: string) =>
                                            scene.variables.byId[id]).map((sceneVariable: SceneVariable) =>
                                            <Chip label={sceneVariable.title}
                                                  onDelete={() => handleVariableDelete(sceneVariable)}/>)}
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5">Nodes</Typography>
                                        <Stack direction="row">
                                            <Tooltip title="Add Node">
                                                <IconButton onClick={() => handleNodeAdd()}>
                                                    <Badge badgeContent={<AddOutlined/>}>
                                                        <Hub></Hub>
                                                    </Badge>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>

                                    <Stack
                                        direction="row"
                                        gap="0.25rem"
                                    >
                                        {scene.nodes.allIds.slice(0, 2).map((id: string) => scene.nodes.byId[id]).map((sceneNode: SceneNode) =>
                                            <Chip label={sceneNode.title}/>)}
                                        {scene.nodes.allIds.slice(2, 1000).map((id: string) => scene.nodes.byId[id]).map((sceneNode: SceneNode) =>
                                            <Chip label={sceneNode.title}
                                                  onDelete={() => handleNodeDelete(sceneNode)}/>)}
                                    </Stack>

                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5">Sounds</Typography>
                                        <Stack direction="row">
                                            <Tooltip title="Manage Sounds">
                                                <IconButton onClick={toggleDrawer(true)}>
                                                    <Badge badgeContent={<MusicNote/>}>
                                                        <LibraryMusic/>
                                                    </Badge>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                    <Stack gap="0.25rem" direction="row">
                                        {allSoundsById.map((audio: AudioType) => <Chip label={audio.title}/>)}
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5">Track Timeline</Typography>
                                        <Stack>
                                            <FormControl>
                                                <InputLabel id="duration-label">Duration</InputLabel>
                                                <Input
                                                    type="number"
                                                    id="duration-input"
                                                    endAdornment={<InputAdornment
                                                        position={"end"}>(milliseconds)</InputAdornment>}
                                                    defaultValue={0}
                                                    disableUnderline={true}
                                                    value={scene.duration}
                                                />
                                            </FormControl>

                                        </Stack>
                                    </Box>

                                    <Stack gap="0.5rem">
                                        {sceneTracks.map((sceneTrack) => <SceneTrack></SceneTrack>)}
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Stack>
                    </Box>
                </Box>


                <React.Fragment key={"right"}>
                    <SwipeableDrawer
                        anchor={"right"}
                        open={addSoundsDrawerOpen}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                    >
                        <SceneManagerSounds setAddSoundsDrawerOpen={setAddSoundsDrawerOpen}
                                            scene={scene}></SceneManagerSounds>
                    </SwipeableDrawer>
                </React.Fragment>


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
                <MenuItem onClick={handleSceneEdit}>Edit</MenuItem>
                <MenuItem onClick={handleSceneCopyID}>Copy ID</MenuItem>
                <MenuItem onClick={handleSceneDelete}>Delete</MenuItem>
            </Menu>
            <SceneSettings
                scene={scene}
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}