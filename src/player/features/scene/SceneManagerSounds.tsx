import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {ArrowLeftOutlined, LibraryMusic, MusicNote} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AgGridReact, CustomCellRendererProps,} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
    RowSelectedEvent,
    RowNode
} from "@ag-grid-community/core";
import Tooltip from "@mui/material/Tooltip";
import {addSoundToScene, removeSoundFromScene, Scene, selectAllSoundIds} from "./scenesSlice";
import {selectAllSounds} from "../sound/soundsSlice";

export function SceneManagerSounds({
                                       setAddSoundsDrawerOpen,
                                       scene
                                   }: { scene: Scene, setAddSoundsDrawerOpen: (open: boolean) => void }) {
    const soundIds: string[] = useSelector(selectAllSoundIds(scene.id))
    const allAudio = useSelector(selectAllSounds);
    const dispatch = useDispatch();

    const [hasFirstDataRendered, setFirstDataRendered] = useState(false);

    const audioTypeComponent = (props: CustomCellRendererProps) => {
        if (props.value == "sound") {
            return <Tooltip title="Sound"><MusicNote/></Tooltip>;
        }
        if (props.value == "track") {
            return <Tooltip title="Track"><LibraryMusic/></Tooltip>
        }
        return 'Unexpected Type';
    };

    const defaultColDef = useMemo(() => {
            return {
                flex: 2,
                filter: true
            }
        }, []
    );

    const columns: any[] = [
        {
            field: 'type', cellRenderer: audioTypeComponent, flex: 0.5, minWidth: 30, cellStyle: () => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                headerTooltip: "Sound Type",
            })
        },
        {field: 'title'},
        {field: 'id'},
    ];
    const rowSelection = useMemo<any>(() => {
        return {
            mode: "multiRow",
            enableClickSelection: true,
            enableSelectionWithoutKeys: true
        };
    }, []);

    const onRowSelected: any = useCallback((event: RowSelectedEvent) => {
        if (event.node.isSelected()) {
            console.log("Add sound");
            dispatch(addSoundToScene({sceneId: scene.id, soundId: event.node.data.id}));
        } else {
            console.log("Remove Sound");
            dispatch(removeSoundFromScene({sceneId: scene.id, soundId: event.node.data.id}));
        }
    }, []);

    const onFirstDataRendered = (params: any) => {
        const nodesToSelect: RowNode[] = [];
        params.api.forEachNode((node: RowNode) => {
                if (node.data && node.data.id && soundIds.includes(node.data.id)) {
                    nodesToSelect.push(node);
                }
            }
        );
        params.api.setNodesSelected({nodes: nodesToSelect, newValue: true});
    }

    // @ts-ignore
    return (
        <Box width={"25rem"}>
            <Button onClick={() => setAddSoundsDrawerOpen(false)}>
                <ArrowLeftOutlined/>
            </Button>

            <Divider></Divider>
            <Container>
                <Typography variant="h5">Manage Sounds</Typography>
            </Container>
            <Divider></Divider>
            <div className="ag-theme-quartz" style={{height: "20rem"}}>
                <AgGridReact
                    defaultColDef={defaultColDef}
                    rowData={allAudio}
                    columnDefs={columns}
                    rowSelection={rowSelection}
                    onRowSelected={onRowSelected}
                    onFirstDataRendered={onFirstDataRendered}/>
            </div>

        </Box>
    );
}