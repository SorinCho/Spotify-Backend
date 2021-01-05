const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
// const keys = require("./keys");
// const User = require('./models/user-model');

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((obj, done) => {
  done(null, obj);
  // User.findById(id)
  //   .then((user) => {
  //     done(null, user);
  //   })
  //   .catch((e) => {
  //     done(new Error('Failed to deserialize an user'));
  //   });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      process.nextTick(() => {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        const obj = { accessToken, refreshToken };
        return done(null, obj);
      });
      // // find current user in UserModel
      // // console.log(accessToken);
      // // console.log(profile);
      // const currentUser = await User.findOne({
      //   spotifyId: profile.id,
      // });
      // // create new user if the database doesn't have this user
      // // spotifyApi.setAccessToken(accessToken);
      // if (!currentUser) {
      //   const newUser = await new User({
      //     spotifyId: profile.id,
      //     accessToken,
      //     refreshToken,
      //   }).save();
      //   if (newUser) {
      //     done(null, newUser);
      //   }
      // }
      // currentUser.accessToken = accessToken;
      // currentUser.refreshToken = refreshToken;
      // await currentUser.save();
      // done(null, currentUser);
    },
  ),
);
