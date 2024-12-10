import { ipcMain } from "electron";

import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { VIEW_ERROR } from "../..";
import { CollectionsReply } from "../../../../types/player";

async function waitForCollectionReply(): Promise<CollectionsReply> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Request timeout");
    }, 5000);
    ipcMain.once(
      "PLAYER_REMOTE_SOUNDBOARD_GET_ALL_REPLY",
      (_: Electron.IpcMainEvent, collections: CollectionsReply) => {
        clearTimeout(timeout);
        resolve(collections);
      }
    );
  });
}

export const get: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.get("/", async (_, reply) => {
      const view = manager.getView();
      if (view) {
        view.send("PLAYER_REMOTE_SOUNDBOARD_GET_ALL_REQUEST");
        try {
          const collections = await waitForCollectionReply();
          reply.status(200).send(collections);
        } catch {
          reply.status(408).send({
            statusCode: 408,
            error: "Request Timeout",
            message: "Unable to retrieve collections in a reasonable time",
          });
        }
      } else {
        reply.status(503).send(VIEW_ERROR);
      }
    });

    done();
  };
