import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import Box from "@mui/material/Box";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import {PlaylistItem} from "../playlists/PlaylistItem";
import Card from "@mui/material/Card";
import React from "react";
import {DisplayItemOption} from "./Home";
import {SelectChangeEvent} from "@mui/material/Select";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store/store";
import {Link as RouterLink, LinkProps as RouterLinkProps, useNavigate} from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import {Sound} from "../sound/soundsSlice";
import {setPlaylistShowNumber} from "../playlists/playlistsSlice";

const PlaylistsLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/playlists" {...props} />);

type PlaylistsContainerProps = {
    onPlayTrack: (sound: Sound) => void;
    setPlaylistAddOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
};

export function PlaylistsContainer ({onPlayTrack, setPlaylistAddOpen}: PlaylistsContainerProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const playlistsState = useSelector((state: RootState) => state.playlists);
    const maxNumberOfPlaylistItems = playlistsState.showNumber ?? 4;
    const playlistItems = getPlayListItems();

    function getPlayListItems() {
        return playlistsState.playlists.allIds
            .slice(0, maxNumberOfPlaylistItems)
            .map((id) => playlistsState.playlists.byId[id]);
    }

    const handlePlaylistDisplayOptionClick = (event: SelectChangeEvent) => {
        const resultNum: number = typeof(event.target.value) == "string" ? 300 : event.target.value;
        dispatch(setPlaylistShowNumber(resultNum));
    }

    const maxNumberOfPlaylistItemsOptions: DisplayItemOption[] = [{value: 4}, {value: 8}, {value: 16}, {value: 32}, {value: Number.MAX_VALUE, displayName: "all"}];

    return (
    <Card>
        <CardContent>
            <Stack
                gap={1}
                justifyContent="space-between"
                alignItems="center"
                direction="row"
            >
                <Typography variant="h5" component="div">
                    <Link color="inherit" underline="hover" component={PlaylistsLink}>Playlists</Link>

                </Typography>
                <Tooltip title="Add Playlist">
                    <IconButton onClick={() => setPlaylistAddOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Box sx={{ flexGrow: 1 }} />
                Showing:
                <FormControl size="small">
                    <Select
                        id="playlistDisplayMaxSelect"
                        value={maxNumberOfPlaylistItems.toString()}
                        onChange={handlePlaylistDisplayOptionClick}
                    >
                        {maxNumberOfPlaylistItemsOptions.map((playlistOption) => (
                            <MenuItem value={playlistOption.value}>{playlistOption.displayName ?? playlistOption.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </CardContent>
        <CardContent>
            <Grid container spacing={2}>
                {playlistItems.map((playlist) => (
                    <Grid xs={6} sm={4} md={3} item key={playlist.id}>
                        <PlaylistItem
                            playlist={playlist}
                            onSelect={(id) => navigate(`/playlists/${id}`)}
                            onPlay={onPlayTrack}
                        />
                    </Grid>
                ))}
            </Grid>
        </CardContent>
    </Card>
    );
}