import { PlayerManager } from "../managers/PlayerManager";
import { get as playlistGet } from "./routes/playlist";
import { play as playlistPlay } from "./routes/playlist/play";
import { playback as playlistPlayback } from "./routes/playlist/playback";
import { get as collectionGet } from "./routes/collection";
import { play as collectionPlay } from "./routes/collection/play";
import { stop as collectionStop } from "./routes/collection/stop";
import { playback as collectionPlayback } from "./routes/collection/playback";

export type ReplyError = {
  statusCode: number;
  error: string;
  message: string;
};

export const VIEW_ERROR: ReplyError = {
  statusCode: 503,
  error: "Service Unavailable",
  message: "Unable to connect to Kenku FM",
};

export function registerRemote(manager: PlayerManager) {
  manager.fastify.register(playlistGet(manager), {
    prefix: "/v1/playlist",
  });
  manager.fastify.register(playlistPlay(manager), {
    prefix: "/v1/playlist/play",
  });
  manager.fastify.register(playlistPlayback(manager), {
    prefix: "/v1/playlist/playback",
  });
  manager.fastify.register(collectionGet(manager), {
    prefix: "/v1/collection",
  });
  manager.fastify.register(collectionPlay(manager), {
    prefix: "/v1/collection/play",
  });
  manager.fastify.register(collectionStop(manager), {
    prefix: "/v1/collection/stop",
  });
  manager.fastify.register(collectionPlayback(manager), {
    prefix: "/v1/collection/playback",
  });
}
