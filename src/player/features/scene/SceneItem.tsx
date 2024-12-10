import React, {useState} from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";

import {backgrounds, isBackground} from "../../backgrounds";

import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store/store";
import {removeScene, Scene} from "./scenesSlice";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVertRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {SceneSettings} from "./SceneSettings";
import {Fade} from "@mui/material";

type SceneItemProps = {
    scene: Scene;
    onSelect: (id: string) => void;
};

export function SceneItem({
                              scene,
                              onSelect,
                          }: SceneItemProps) {
    const dispatch = useDispatch();

    const image = isBackground(scene.background)
        ? backgrounds[scene.background]
        : scene.background;

    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

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
        navigator.clipboard.writeText(scene.id);
        handleMenuClose();
    }

    function handleDelete() {
        dispatch(removeScene(scene.id));
        handleMenuClose();
    }

    return (
        <Card sx={{position: "relative"}}>
            <CardActionArea onClick={() => onSelect(scene.id)} onMouseOver={() => handleSettingsMenuVisible(true)}
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

                        <Tooltip title={scene.title} placement="top">
                            <Typography variant="h5" noWrap sx={{zIndex: 1, cursor: "pointer"}}>
                                {scene.title}
                            </Typography>
                        </Tooltip>
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
            <SceneSettings
                scene={scene}
                open={settingsMenuOpen}
                onClose={() => setSettingsMenuOpen(false)}
            />
        </Card>

    );
}
