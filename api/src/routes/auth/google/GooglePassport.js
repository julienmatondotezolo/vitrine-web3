var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport =require("passport")


router.get('/profile', passport.authenticate('google', { scope: ['profile'] }))
router.get(
        '/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/signin' }),
        async function (_req, res, _next) {
          res.redirect('/')
        }
      )
      