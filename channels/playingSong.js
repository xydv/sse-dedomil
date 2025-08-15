const { createChannel } = require("better-sse");
const fetchRecentTrack = require("../helpers/lastFm");

const playingSong = createChannel();

let lastTrack = {
  name: "not playing anything",
  artist: "n/a",
  image: "https://f4.bcbits.com/img/a3316669401_16.jpg",
  isPlaying: false,
};

setInterval(async () => {
  let track = await fetchRecentTrack();
  if (Object.keys(track).length != 0 && track.name != lastTrack.name) {
    playingSong.broadcast(track, "update");
    lastTrack = track;
  }
}, 5000);

/** new session joined the channel
 *  1) send `connected` event to the session who registered with current count and track
 *  2) broadcast channel's sesssion count to other session except this one
 */

playingSong.on("session-registered", (session) => {
  session.push(lastTrack, "update");

  playingSong.broadcast([playingSong.sessionCount], "count-updated", {
    filter: (broadcastSession) => {
      return broadcastSession != session; // comparing Session works!
    },
  });
});

playingSong.on("session-deregistered", (session) => {
  playingSong.broadcast([playingSong.sessionCount], "count-updated", {
    filter: (broadcastSession) => {
      return broadcastSession != session;
    },
  });
});

module.exports = playingSong;
