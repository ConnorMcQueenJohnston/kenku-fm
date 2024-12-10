import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useDispatch } from "react-redux";
import { editCollection, Collection } from "./collectionsSlice";
import { ImageSelector } from "../../common/ImageSelector";

type CollectionSettingsProps = {
  collection: Collection;
  open: boolean;
  onClose: () => void;
};

export function CollectionSettings({
  collection,
  open,
  onClose,
}: CollectionSettingsProps) {
  const dispatch = useDispatch();

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(editCollection({ id: collection.id, title: event.target.value }));
  }

  function handleBackgroundChange(background: string) {
    dispatch(editCollection({ id: collection.id, background }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Collection</DialogTitle>
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
            value={collection.title}
            onChange={handleTitleChange}
          />
          <ImageSelector
            value={collection.background}
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
