const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc Auth with Goole
// @route Get /auth/google
//  http://www.passportjs.org/packages/passport-google-oauth2/

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
//  http://www.passportjs.org/packages/passport-google-oauth2/

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})


module.exports = router
