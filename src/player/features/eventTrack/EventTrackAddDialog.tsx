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
import {addEventTrack} from "./eventTracksSlice";

interface EventTrackAddDialogProps {
    open: boolean;
    onClose: () => void;
}

export function EventTrackAddDialog({open, onClose} : EventTrackAddDialogProps) {
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
        const id = uuid();
        dispatch(addEventTrack({id, title, background, nodes: {byId: {}, allIds: []}, variables: {byId: {}, allIds: []}}));
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Event Track</DialogTitle>
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