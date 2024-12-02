import React, {useEffect, useState} from "react";
import {v4 as uuid} from "uuid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import {ImageSelector} from "../../common/ImageSelector";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {backgrounds} from "../../backgrounds";
import {useDispatch} from "react-redux";
import {addScene, Scene, SceneNode} from "./scenesSlice";

interface SceneAddDialogProps {
    open: boolean;
    onClose: () => void;
}

export function SceneAddDialog({open, onClose}: SceneAddDialogProps) {
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [background, setBackground] = useState(Object.keys(backgrounds)[0]);

    useEffect(() => {
        if (!open) {
            setTitle("");
        }
    }, [open]);


    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value);
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        dispatch(addScene(returnNewScene()));
        onClose();
    }

    function returnNewScene(): Scene {
        const id = uuid();
        const [startNodeId, endNodeId] = [uuid(), uuid()];
        const startNode: SceneNode = {id: startNodeId, title: "Start Node", required: true};
        const endNode: SceneNode = {id: endNodeId, title: "End Node", required: true}
        return {
            id,
            title,
            background,
            duration: 200000,
            nodes: {
                byId: {
                    [startNodeId]: startNode,
                    [endNodeId]: endNode
                },
                allIds: [startNodeId, endNodeId]
            },
            variables: {
                byId: {},
                allIds: []
            }, sceneTracks: {
                byId: {},
                allIds: []
            }
        };
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Scene</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        autoComplete="off"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <ImageSelector value={background} onChange={setBackground}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button disabled={!title || !background} type="submit">
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}