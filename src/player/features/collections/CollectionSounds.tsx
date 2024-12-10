import React, { useRef, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { SoundItem } from "../sound/SoundItem";
import { SortableItem } from "../../common/SortableItem";

import { useDispatch } from "react-redux";
import {Collection, moveSoundInCollection} from "./collectionsSlice";

import { useHideScrollbar } from "../../../renderer/common/useHideScrollbar";
import {Sound} from "../sound/soundsSlice";

type CollectionSoundsProps = {
  collection: Collection;
  onPlay: (sound: Sound) => void;
  onStop: (id: string) => void;
};

export function CollectionSounds({
  collection,
  onPlay,
  onStop,
}: CollectionSoundsProps) {
  const dispatch = useDispatch();

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(pointerSensor, keyboardSensor);

  const [dragId, setDragId] = useState<string | null>(null);
  function handleDragStart(event: DragStartEvent) {
    setDragId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over.id) {
      dispatch(
        moveSoundInCollection({
          collectionId: collection.id,
          active: active.id,
          over: over.id,
        })
      );
    }

    setDragId(null);
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const hideScrollbar = useHideScrollbar(scrollRef);

  return (
    <Box
      sx={{
        overflowY: "auto",
        maskImage:
          "linear-gradient(to bottom, transparent, black 60px, black calc(100% - 64px), transparent)",
        position: "absolute",
        width: "100%",
        height: "calc(100% - 60px)",
        pt: "60px",
        top: "60px",
        left: 0,
        px: 2,
      }}
      ref={scrollRef}
      {...hideScrollbar}
    >
      <Grid
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "240px",
        }}
        container
        spacing={2}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={collection.sounds}
            strategy={rectSortingStrategy}
          >
            {collection.sounds.map((id) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={id}>
                <SortableItem key={id} id={id}>
                  <SoundItem
                    id={id}
                    onPlay={onPlay}
                    onStop={onStop}
                  />
                </SortableItem>
              </Grid>
            ))}
            <DragOverlay>
              {dragId ? (
                <SoundItem
                  id={dragId}
                  onPlay={onPlay}
                  onStop={onStop}
                />
              ) : null}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      </Grid>
    </Box>
  );
}
