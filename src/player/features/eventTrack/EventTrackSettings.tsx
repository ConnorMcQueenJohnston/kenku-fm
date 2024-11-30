import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useDispatch } from "react-redux";
import { ImageSelector } from "../../common/ImageSelector";
import {EventTrack} from "./EventTrack";
import {editEventTrack} from "./eventTracksSlice";

type EventTrackSettingsProps = {
    eventTrack: EventTrack;
    open: boolean;
    onClose: () => void;
};

export function EventTrackSettings({
                                       eventTrack,
                                       open,
                                       onClose,
                                   }: EventTrackSettingsProps) {
    const dispatch = useDispatch();

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(editEventTrack({ id: eventTrack.id, title: event.target.value }));
    }

    function handleBackgroundChange(background: string) {
        dispatch(editEventTrack({ id: eventTrack.id, background }));
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Event Track</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        autoComplete="off"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={eventTrack.title}
                        onChange={handleTitleChange}
                    />
                    <ImageSelector
                        value={eventTrack.background}
                        onChange={handleBackgroundChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Done</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
