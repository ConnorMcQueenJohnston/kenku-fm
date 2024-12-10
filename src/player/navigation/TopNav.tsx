import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {Badge, Link, SwipeableDrawer} from "@mui/material";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {AddOutlined, MusicNote} from "@mui/icons-material";
import MoreVert from "@mui/icons-material/MoreVertRounded";
import React, {useState} from "react";
import {Link as RouterLink, LinkProps as RouterLinkProps} from "react-router-dom";
import {selectEntireStore, selectIsAddSoundPanelOpen, setAddSoundPanelOpen} from "../app/store/appSlice";
import {useDispatch, useSelector} from "react-redux";

const HomeLink = React.forwardRef<HTMLAnchorElement,
    Omit<RouterLinkProps, "to">>((props, ref) => <RouterLink ref={ref} to="/" {...props} />);

const CollectionsLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/collections" {...props} />);

const PlaylistsLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/playlists" {...props} />);

const ScenesPageLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/scenes" {...props} />);

export function TopNav() {

    const dispatch = useDispatch();
    const [storeDebugOpen, setStoreDebugOpen] = useState(false);
    const store = useSelector(selectEntireStore);

    function handleMenuClick(){
        setStoreDebugOpen(!storeDebugOpen);
    }

    function setAddOpen(open: boolean) {
        dispatch(setAddSoundPanelOpen(open));
    }

    return (
        <Container sx={{
            padding: "1rem 0",
            display: "flex",
            justifyContent: "space-between"
        }}>
            <Stack direction="row" spacing={1}>
                <Link className="top-nav__link" color="inherit" underline="hover" component={HomeLink}>
                    <Chip label="Home"/>
                </Link>
                <Link className="top-nav__link" color="inherit" underline="hover" component={PlaylistsLink}>
                    <Chip label="Playlists"/>
                </Link>
                <Link className="top-nav__link" color="inherit" underline="hover" component={CollectionsLink}>
                    <Chip label="Collections"/>
                </Link>
                <Link className="top-nav__link" color="inherit" underline="hover" component={ScenesPageLink}>
                    <Chip label="Scenes"/>
                </Link>
            </Stack>

            <Stack direction="row">
                <Tooltip title="Add Sound to Sound Library">
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

            <React.Fragment key={"left"}>
                <SwipeableDrawer
                    anchor={"left"}
                    open={storeDebugOpen}
                    onClose={() => setStoreDebugOpen(false)}
                    onOpen={() => setStoreDebugOpen(true)}
                >
                    <pre>
                        {JSON.stringify(store, null, 2)}
                    </pre>
                </SwipeableDrawer>
            </React.Fragment>
        </Container>
    );
}