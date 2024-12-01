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
import {Scene} from "../scene/Scene";
import {setSceneShowNumber} from "../scene/scenesSlice";
import {SceneItem} from "../scene/SceneItem";
import FormControl from "@mui/material/FormControl";

const ScenesPageLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/scenes" {...props} />);

type ScenesContainerProps = {
    setSceneAddOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void;
};

export function ScenesContainer ({setSceneAddOpen}: ScenesContainerProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const scenesState = useSelector((state: RootState) => state.scenes);
    const maxNumberOfSceneItems = scenesState.showNumber ?? 4;
    const sceneItems: Scene[] = getSceneItems();

    const maxNumberOfPlaylistItemsOptions: DisplayItemOption[] = [{value: 4}, {value: 8}, {value: 16}, {value: 32}, {value: Number.MAX_VALUE, displayName: "all"}];

    const handleSceneDisplayOptionClick = (event: SelectChangeEvent) => {
        const resultNum: number = typeof(event.target.value) == "string" ? 300 : event.target.value;
        dispatch(setSceneShowNumber(resultNum));
    }

    function getSceneItems() {
        return scenesState.scenes.allIds
            .slice(0, maxNumberOfSceneItems)
            .map((id) => scenesState.scenes.byId[id]);
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
                        <Link color="inherit" underline="hover" component={ScenesPageLink}> Scenes</Link>
                    </Typography>
                    <Tooltip title="Add Scene">
                        <IconButton onClick={() => setSceneAddOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }} />
                    Showing:
                    <FormControl size="small">
                        <Select
                            id="ScenesDisplayMaxSelect"
                            value={maxNumberOfSceneItems.toString()}
                            onChange={handleSceneDisplayOptionClick}
                        >
                            {maxNumberOfPlaylistItemsOptions.map((SceneOption) => (
                                <MenuItem value={SceneOption.value}>{SceneOption.displayName ?? SceneOption.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </CardContent>
            <CardContent>
                <Grid container spacing={2}>
                    {sceneItems.map((Scene: Scene) => (
                        <Grid xs={6} sm={4} md={3} item key={Scene.id}>
                            <SceneItem Scene={Scene} onSelect={(id) => navigate(`/scenes/${id}`)}/>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}