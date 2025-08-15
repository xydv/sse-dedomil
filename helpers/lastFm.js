require("dotenv").config();
const fetch = require("cross-fetch");
const qs = require("qs");

let url = `https://ws.audioscrobbler.com/2.0/?${qs.stringify({
  method: "user.getrecenttracks",
  user: "adbtya",
  api_key: process.env.LASTFM_API_KEY,
  limit: 1,
  format: "json",
})}`;

module.exports = async () => {
  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    let track = await responseJson.recenttracks.track[0];
    let name = track.name;
    let image = track.image[3]["#text"];
    let artist = track.artist["#text"];
    let isPlaying = track["@attr"] ? true : false;
    return {
      name,
      image,
      artist,
      isPlaying,
    };
  } catch (error) {
    return {};
  }
};
