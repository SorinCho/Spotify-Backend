const express = require('express'); // Express web server framework
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
// const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes');

const port = process.env.PORT || 8888;
const passportSetup = require('./passport-setup');

// mongoose.connect(
//   process.env.MONGODB_URI,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log('connected to mongo db');
//   },
// );

const app = express();
// set up cors to allow us to accept requests from our client
// const whitelist = [process.env.CLIENT_HOME_URL, `${process.env.CLIENT_HOME_URL}/home`];
// var corsOptions = {
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
app.use(
  cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: process.env.ORIGIN,
  }),
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
