const router = require('express').Router();
const passport = require('passport');
const {
  getMe, setTokens, getArtistsData, getTracksData,
} = require('../services/spotify-api');

const CLIENT_HOME_PAGE_URL = 'http://localhost:3000';

// when login is successful, retrieve user info
router.get('/login/success', async (req, res) => {
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
      user: req.user,
      cookies: req.cookies,
      userData,
      artistsData,
      tracksData,
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
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with twitter
router.get(
  '/spotify',
  passport.authenticate('spotify', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: '/auth/login/failed',
    scope: ['user-read-email', 'user-read-private', 'user-top-read'],
    // showDialog: true,
  }),
);

// redirect to home page after successfully login via twitter
router.get(
  '/spotify/redirect',
  passport.authenticate('spotify', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: '/auth/login/failed',
    scope: ['user-read-email', 'user-read-private', 'user-top-read'],
    showDialog: true,
  }),
);

module.exports = router;
