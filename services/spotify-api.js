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

async function getTopTracks() {
  const topTracks = await spotifyApi.getMyTopTracks();
  // console.log(topTracks);
  return topTracks.body.items;
}

async function getTopArtists() {
  const topArtists = await spotifyApi.getMyTopArtists();
  return topArtists.body.items;
}

module.exports = {
  setTokens,
  getMe,
  getTopTracks,
  getTopArtists,
};
