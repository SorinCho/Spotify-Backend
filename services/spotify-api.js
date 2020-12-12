const SpotifyWebApi = require('spotify-web-api-node');
const { client_id, client_secret, redirect_uri } = require('../config');

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

// spotifyApi.setAccessToken(req.user.accessToken);
// spotifyApi.setRefreshToken(req.user.refreshToken);

async function setTokens(accessToken, refreshToken) {
  await spotifyApi.setAccessToken(accessToken);
  await spotifyApi.setRefreshToken(refreshToken);
}

async function getMe() {
  const userData = await spotifyApi.getMe();
  return userData.body;
}

function avgDuration(tracks) {
  const total = tracks.reduce((sum, { duration_ms }) => sum + duration_ms, 0);
  return total / tracks.length;
}

function pctExplicit(tracks) {
  const total = tracks.filter((track) => track.explicit == true).length;
  return total / tracks.length;
}

async function getTopTracks() {
  const topTracks = await spotifyApi.getMyTopTracks();
  return topTracks.body.items;
}

async function getTracksData() {
  const output = {};
  output.tracks = await getTopTracks();
  output.avgPopularity = avgPopularity(output.tracks);
  output.avgDuration = avgDuration(output.tracks);
  output.pctExplicit = pctExplicit(output.tracks);
  return output;
}

function avgFollowers(artists) {
  const total = artists.reduce((sum, { followers }) => sum + followers.total, 0);
  return total / artists.length;
}

function avgPopularity(artists) {
  const total = artists.reduce((sum, { popularity }) => sum + popularity, 0);
  return total / artists.length;
}

function aggGenres(artists) {
  const counts = {};
  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      counts[genre] = counts[genre] ? counts[genre] + 1 : 1;
    });
  });
  const sortable = [];
  for (const genre in counts) {
    sortable.push([genre, counts[genre]]);
  }
  sortable.sort((a, b) => b[1] - a[1]);
  return sortable;
}

async function getTopArtists() {
  const topArtists = await spotifyApi.getMyTopArtists();
  return topArtists.body.items;
}

async function getArtistsData() {
  const output = {};
  output.artists = await getTopArtists();
  output.avgFollowers = avgFollowers(output.artists);
  output.avgPopularity = avgPopularity(output.artists);
  output.aggGenres = aggGenres(output.artists);
  return output;
}

module.exports = {
  setTokens,
  getMe,
  getTopTracks,
  getTopArtists,
  getArtistsData,
  getTracksData,
};
