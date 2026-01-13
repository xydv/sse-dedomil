import { createResponse } from "better-sse";
import { Hono } from "hono";
import { playingSongChannel } from "./channels/playingSong";
import { getRecentTracks } from "./helpers/getRecentTrack";

const app = new Hono();

// background worker, maybe use bun workers in future
async function createPolling() {
  setInterval(async () => {
    if (playingSongChannel.sessionCount === 0) return; // dont poll api if no one is listening

    const oldTrack = playingSongChannel.state.recentTrack;
    const newTrack = await getRecentTracks("adbtya");

    if (oldTrack.name != newTrack.name) {
      playingSongChannel.broadcast(newTrack, "update");
      playingSongChannel.state.recentTrack = newTrack;
    }
  }, 5000);
}

app.get("/", async (c) => {
  return createResponse(c.req.raw, (session) => {
    playingSongChannel.register(session);
  });
});

createPolling();

export default {
  fetch: app.fetch,
  idleTimeout: 0, // https://github.com/oven-sh/bun/issues/13392#issuecomment-2490671520
};
