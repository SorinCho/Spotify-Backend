const passport = require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy;
// const keys = require("./keys");
const { client_id, client_secret, redirect_uri } = require('./config');
const User = require("./models/user-model");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: redirect_uri
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
            // find current user in UserModel
            // console.log(accessToken);
            const currentUser = await User.findOne({
              spotifyId: profile.id
            });
            // create new user if the database doesn't have this user
            if (!currentUser) {
              const newUser = await new User({
                spotifyId: profile.id,
                accessToken: accessToken,
                refreshToken: refreshToken
              }).save();
              if (newUser) {
                done(null, newUser);
              }
            }
            currentUser.accessToken = accessToken;
            currentUser.refreshToken = refreshToken;
            await currentUser.save();
            done(null, currentUser);
          }
  )
);
