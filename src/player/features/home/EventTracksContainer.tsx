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
import Card from "@mui/material/Card";
import React from "react";
import {Link as RouterLink, LinkProps as RouterLinkProps, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {DisplayItemOption} from "./Home";
import {SelectChangeEvent} from "@mui/material/Select";
import {EventTrack} from "../eventTrack/EventTrack";
import {setEventTrackShowNumber} from "../eventTrack/eventTracksSlice";
import {EventTrackItem} from "../eventTrack/EventTrackItem";
import FormControl from "@mui/material/FormControl";

const EventTracksPageLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/eventTracks" {...props} />);

type EventTracksContainerProps = {
    setEventTrackAddOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void;
};

export function EventTracksContainer ({setEventTrackAddOpen}: EventTracksContainerProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const eventTracksState = useSelector((state: RootState) => state.eventTracks);
    const maxNumberOfEventTrackItems = eventTracksState.showNumber ?? 4;
    const eventTrackItems: EventTrack[] = getEventTrackItems();

    const maxNumberOfPlaylistItemsOptions: DisplayItemOption[] = [{value: 4}, {value: 8}, {value: 16}, {value: 32}, {value: Number.MAX_VALUE, displayName: "all"}];

    const handleEventTrackDisplayOptionClick = (event: SelectChangeEvent) => {
        const resultNum: number = typeof(event.target.value) == "string" ? 300 : event.target.value;
        dispatch(setEventTrackShowNumber(resultNum));
    }

    function getEventTrackItems() {
        return eventTracksState.eventTracks.allIds
            .slice(0, maxNumberOfEventTrackItems)
            .map((id) => eventTracksState.eventTracks.byId[id]);
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
                        <Link color="inherit" underline="hover" component={EventTracksPageLink}> Event Tracks</Link>
                    </Typography>
                    <Tooltip title="Add Event Track">
                        <IconButton onClick={() => setEventTrackAddOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }} />
                    Showing:
                    <FormControl size="small">
                        <Select
                            id="eventTracksDisplayMaxSelect"
                            value={maxNumberOfEventTrackItems.toString()}
                            onChange={handleEventTrackDisplayOptionClick}
                        >
                            {maxNumberOfPlaylistItemsOptions.map((eventTrackOption) => (
                                <MenuItem value={eventTrackOption.value}>{eventTrackOption.displayName ?? eventTrackOption.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </CardContent>
            <CardContent>
                <Grid container spacing={2}>
                    {eventTrackItems.map((eventTrack: EventTrack) => (
                        <Grid xs={6} sm={4} md={3} item key={eventTrack.id}>
                            <EventTrackItem eventTrack={eventTrack} onSelect={(id) => navigate(`/eventTracks/${id}`)}/>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}