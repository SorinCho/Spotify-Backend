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

async function getTopTracks(data) {
  const topTracks = await spotifyApi.getMyTopTracks({
    limit: data.limit,
    time_range: data.timeRange,
  });
  return topTracks.body.items;
}

async function getTracksData(data) {
  const output = {};
  output.tracks = await getTopTracks(data);
  return output;
}

async function getTopArtists(data) {
  const topArtists = await spotifyApi.getMyTopArtists({
    limit: data.limit,
    time_range: data.timeRange,
  });
  return topArtists.body.items;
}

async function getArtistsData(data) {
  const output = {};
  output.artists = await getTopArtists(data);
  return output;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

async function createPlaylist(timeRange, tracks) {
  let id;
  try {
    const date = new Date();
    const data = await spotifyApi.createPlaylist(monthNames[date.getMonth()], {
      description: 'My description',
      public: true,
    });
    await spotifyApi.addTracksToPlaylist(data.body.id, tracks);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  setTokens,
  getMe,
  getTopTracks,
  getTopArtists,
  getArtistsData,
  getTracksData,
  createPlaylist,
};
