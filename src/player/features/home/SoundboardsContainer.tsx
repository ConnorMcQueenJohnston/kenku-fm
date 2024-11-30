import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import {SoundboardItem} from "../soundboards/SoundboardItem";
import React from "react";
import {Link as RouterLink, LinkProps as RouterLinkProps, useNavigate} from "react-router-dom";
import {SelectChangeEvent} from "@mui/material/Select";
import {setSoundboardShowNumber, Sound} from "../soundboards/soundboardsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {DisplayItemOption} from "./Home";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import FormControl from "@mui/material/FormControl";

const SoundboardsLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/soundboards" {...props} />);

type SoundboardsContainerProps = {
    onPlaySound: (sound: Sound) => void;
    setSoundboardAddOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
};

export function SoundboardsContainer({onPlaySound, setSoundboardAddOpen}: SoundboardsContainerProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const soundboardsState = useSelector((state: RootState) => state.soundboards);
    const maxNumberOfSoundboardItems = soundboardsState.showNumber ?? 4;
    const soundboardItems = getSoundBoardItems();

    const maxNumberOfPlaylistItemsOptions: DisplayItemOption[] = [{value: 4}, {value: 8}, {value: 16}, {value: 32}, {value: Number.MAX_VALUE, displayName: "all"}];

    const handleSoundboardDisplayOptionClick = (event: SelectChangeEvent) => {
        const resultNum: number = typeof(event.target.value) == "string" ? 300 : event.target.value;
        dispatch(setSoundboardShowNumber(resultNum));
    }

    function getSoundBoardItems() {
        return soundboardsState.soundboards.allIds
            .slice(0, maxNumberOfSoundboardItems)
            .map((id) => soundboardsState.soundboards.byId[id]);
    }

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
                    <Link color="inherit" underline="hover" component={SoundboardsLink}> Soundboards</Link>
                </Typography>
                <Tooltip title="Add Soundboard">
                    <IconButton onClick={() => setSoundboardAddOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Box sx={{ flexGrow: 1 }} />
                Showing:
                <FormControl size="small">
                    <Select
                        id="soundBoardDisplayMaxSelect"
                        value={maxNumberOfSoundboardItems.toString()}
                        onChange={handleSoundboardDisplayOptionClick}
                    >
                        {maxNumberOfPlaylistItemsOptions.map((soundboardOption) => (
                            <MenuItem value={soundboardOption.value}>{soundboardOption.displayName ?? soundboardOption.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </CardContent>
        <CardContent>
            <Grid container spacing={2}>
                {soundboardItems.map((soundboard) => (
                    <Grid xs={6} sm={4} md={3} item key={soundboard.id}>
                        <SoundboardItem
                            soundboard={soundboard}
                            onSelect={(id) => navigate(`/soundboards/${id}`)}
                            onPlay={onPlaySound}
                        />
                    </Grid>
                ))}
            </Grid>
        </CardContent>
    </Card>
    );
}