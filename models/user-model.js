const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
