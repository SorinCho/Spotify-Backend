const express = require('express'); // Express web server framework
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
// const session = require('express-session');
const mongoose = require('mongoose');
// const SpotifyWebApi = require('spotify-web-api-node');
const authRoutes = require('./routes/auth-routes');

const port = process.env.PORT || 8888;
// var spotifyApi = require('./spotify-setup')
const passportSetup = require('./passport-setup');

// const spotifyApi = new SpotifyWebApi();

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('connected to mongo db');
  },
);

const app = express();
// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: true, // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  }),
);

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  }),
);

app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

app.use('/auth', authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: 'user has not been authenticated',
    });
  } else {
    next();
  }
};

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get('/', authCheck, async (req, res) => {
  // const { user } = req;
  // spotifyApi.setAccessToken(user.accessToken);
  // spotifyApi.setRefreshToken(user.refreshToken);
  // var userData;
  // await spotifyApi.getMe().then(result => {
  //   userData = result.body;
  //   console.log(result.body);
  // }).catch(e => {
  //   console.log("error get user");
  // })
  // console.log("APP ROUTE");
  res.status(200).json({
    authenticated: true,
    message: 'user successfully authenticated',
    user: req.user,
    cookies: req.cookies,
    // name: userData.display_name
  });
});

// async function getUserData() {
//   let v;
//   try {
//     v = await spotifyApi.getMe();
//     console.log(v.body);
//   } catch(e) {
//     v = "error";
//     console.log("user get erorr");
//   }
//   return v.body;
// }

// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
