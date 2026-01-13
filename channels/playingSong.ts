import { createChannel } from "better-sse";
import { RecentTrack } from "../types";

// create channel with initial state
const playingSongChannel = createChannel<{ recentTrack: RecentTrack }>({
  state: {
    recentTrack: {
      name: "404 - not playing",
      artist: "aditya yadav",
      image: "https://i.ibb.co/4nrzCNQN/1499-solid-color.jpg",
      isPlaying: false,
    },
  },
});

// new user gets the last played song directly
playingSongChannel.on("session-registered", (session) => {
  session.push(playingSongChannel.state.recentTrack, "update");
});

export { playingSongChannel };
