const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const {
  getMe,
  setTokens,
  getArtistsData,
  getTracksData,
  createPlaylist,
} = require('../services/spotify-api');

const jsonParser = bodyParser.json();
const { CLIENT_HOME_URL } = process.env;
const CLIENT_REDIRECT_URL = `${CLIENT_HOME_URL}`;

// when login is successful, retrieve user info
router.get('/login/success', jsonParser, async (req, res) => {
  if (req.user) {
    let userData;
    let artistsData;
    let tracksData;
    try {
      await setTokens(req.user.accessToken, req.user.refreshToken);
      userData = await getMe();
      artistsData = await getArtistsData();
      tracksData = await getTracksData();
    } catch (err) {
      console.log('authenticate failure or retrieval failure');
      console.log(err);
      return res.status(401).json({
        success: false,
        message: 'user failed to authenticate.',
      });
    }
    res.json({
      success: true,
      message: 'user has successfully authenticated',
      userData,
      artistsData,
      tracksData,
    });
  } else {
    res.status(204).json({
      message: 'user not yet authenticated',
    });
  }
});

router.post('/createTracksPlaylist', jsonParser, async (req, res) => {
  if (req.user) {
    try {
      await setTokens(req.user.accessToken, req.user.refreshToken);
      await createPlaylist(req.body.timeRange, req.body.tracks);
    } catch (err) {
      console.log('authenticate failure or retrieval failure');
      console.log(err);
      return res.status(401).json({
        success: false,
        message: 'user failed to authenticate.',
      });
    }

    res.json({
      success: true,
      message: 'playlist successfully created',
    });
  }
});

// when login failed, send failed msg
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'user failed to authenticate.',
  });
});

// When logout, redirect to client
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_URL);
});

// auth with twitter
router.get(
  '/spotify',
  passport.authenticate('spotify', {
    successRedirect: CLIENT_REDIRECT_URL,
    // failureRedirect: '/auth/login/failed',
    failureRedirect: CLIENT_HOME_URL,
    scope: [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'playlist-modify-public',
      'ugc-image-upload',
    ],
    showDialog: true,
  }),
);

// redirect to home page after successfully login via twitter
router.get(
  '/spotify/redirect',
  passport.authenticate('spotify', {
    successRedirect: CLIENT_REDIRECT_URL,
    failureRedirect: CLIENT_HOME_URL,
    scope: [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'playlist-modify-public',
      'ugc-image-upload',
    ],
    showDialog: true,
  }),
);

module.exports = router;
