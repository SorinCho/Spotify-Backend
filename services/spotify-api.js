const SpotifyWebApi = require('spotify-web-api-node');
const { client_id, client_secret, redirect_uri } = require('../config');
const { create } = require('../models/user-model');

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

async function getTopTracks(timeRange) {
  const topTracks = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: timeRange,
  });
  return topTracks.body.items;
}

async function getTracksData() {
  const output = {};
  output.long = await getTopTracks('long_term');
  output.short = await getTopTracks('short_term');
  output.medium = await getTopTracks('medium_term');
  return output;
}

async function getTopArtists(timeRange) {
  const topArtists = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: timeRange,
  });
  return topArtists.body.items;
}

async function getArtistsData() {
  const output = {};
  output.long = await getTopArtists('long_term');
  output.short = await getTopArtists('short_term');
  output.medium = await getTopArtists('medium_term');
  // const output = [artistsShort, artistsMedium, artistsLong];
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
