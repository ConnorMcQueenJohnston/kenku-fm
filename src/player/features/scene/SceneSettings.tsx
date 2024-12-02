import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useDispatch } from "react-redux";
import { ImageSelector } from "../../common/ImageSelector";
import {editScene, Scene} from "./scenesSlice";

type SceneSettingsProps = {
    scene: Scene;
    open: boolean;
    onClose: () => void;
};

export function SceneSettings({
                                       scene,
                                       open,
                                       onClose,
                                   }: SceneSettingsProps) {
    const dispatch = useDispatch();

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(editScene({ id: scene.id, title: event.target.value }));
    }

    function handleBackgroundChange(background: string) {
        dispatch(editScene({ id: scene.id, background }));
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Scene</DialogTitle>
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
                        value={scene.title}
                        onChange={handleTitleChange}
                    />
                    <ImageSelector
                        value={scene.background}
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
