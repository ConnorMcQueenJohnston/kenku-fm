import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import {CollectionItem} from "../collections/CollectionItem";
import React from "react";
import {Link as RouterLink, LinkProps as RouterLinkProps, useNavigate} from "react-router-dom";
import {SelectChangeEvent} from "@mui/material/Select";
import {setCollectionShowNumber} from "../collections/collectionsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store/store";
import {DisplayItemOption} from "./Home";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import FormControl from "@mui/material/FormControl";
import {Sound} from "../sound/soundsSlice";

const CollectionsLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to">
    >((props, ref) => <RouterLink ref={ref} to="/collections" {...props} />);

type CollectionsContainerProps = {
    onPlaySound: (sound: Sound) => void;
    setCollectionAddOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
};

export function CollectionsContainer({onPlaySound, setCollectionAddOpen}: CollectionsContainerProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const collectionsState = useSelector((state: RootState) => state.collections);
    const maxNumberOfCollectionItems = collectionsState.showNumber ?? 4;
    const collectionItems = getSoundBoardItems();

    const maxNumberOfPlaylistItemsOptions: DisplayItemOption[] = [{value: 4}, {value: 8}, {value: 16}, {value: 32}, {value: Number.MAX_VALUE, displayName: "all"}];

    const handleCollectionDisplayOptionClick = (event: SelectChangeEvent) => {
        const resultNum: number = typeof(event.target.value) == "string" ? 300 : event.target.value;
        dispatch(setCollectionShowNumber(resultNum));
    }

    function getSoundBoardItems() {
        return collectionsState.collections.allIds
            .slice(0, maxNumberOfCollectionItems)
            .map((id) => collectionsState.collections.byId[id]);
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
                    <Link color="inherit" underline="hover" component={CollectionsLink}> Collections</Link>
                </Typography>
                <Tooltip title="Add Collection">
                    <IconButton onClick={() => setCollectionAddOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Box sx={{ flexGrow: 1 }} />
                Showing:
                <FormControl size="small">
                    <Select
                        id="soundBoardDisplayMaxSelect"
                        value={maxNumberOfCollectionItems.toString()}
                        onChange={handleCollectionDisplayOptionClick}
                    >
                        {maxNumberOfPlaylistItemsOptions.map((collectionOption) => (
                            <MenuItem value={collectionOption.value}>{collectionOption.displayName ?? collectionOption.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </CardContent>
        <CardContent>
            <Grid container spacing={2}>
                {collectionItems.map((collection) => (
                    <Grid xs={6} sm={4} md={3} item key={collection.id}>
                        <CollectionItem
                            collection={collection}
                            onSelect={(id) => navigate(`/collections/${id}`)}
                            onPlay={onPlaySound}
                        />
                    </Grid>
                ))}
            </Grid>
        </CardContent>
    </Card>
    );
}