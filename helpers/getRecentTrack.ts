import { LastFMUser } from "lastfm-ts-api";
import { RecentTrack } from "../types";

const user = new LastFMUser(process.env.LASTFM_API_KEY!);

const getRecentTracks = async (username: string): Promise<RecentTrack> => {
  const lastTrack = await user.getRecentTracks({ user: username, limit: 1 });
  const track = lastTrack.recenttracks.track[0];
  const name = track.name;
  const image = track.image[3]["#text"];
  const artist = track.artist["#text"];
  const isPlaying = track["@attr"] ? true : false;

  return {
    name,
    image,
    artist,
    isPlaying,
  };
};

export { getRecentTracks };
