const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

/*
Function that provides google-oauth-20 and writes current user data to MongoDB database

For more details: http://www.passportjs.org/packages/passport-google-oauth2/

Module passport lets you authenticate using Google in your Node.js
*/

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
      async (request, accessToken, refreshToken, profile, done) => {
        console.log('passport.js - profile: ', profile);

        // const new User = {
        //   googleId: profile.id,
        //   displayName: profile.displayName,
        //   firstName: profile.firstName,
        //   lastName: profile.lastName,
        //   image: profile.photoss[0].value
        // }
        // try {
        //   let user = await User.findOne({ googleId: profile.id })
        //   if (user) {
        //     done(null, user)
        //   } else {
        //     user = User.create(newUser)
        //     done(null, user)
        //   }
        // } catch (err) {
        //   cosole.error(err)
        // }
      }
    )
  )

  //  In order to support login sessions, Passport will serialize and deserialize user instances to and from the session (http://www.passportjs.org/docs/downloads/html/)

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}