import passport from 'passport';

passport.serializeUser(function (user: any, cb) {
    cb(null, { id: user.id, username: user.username });
});
passport.deserializeUser(function (user: any, cb) {
    // @TODO：结合 redis
    cb(null, user);
});

export default passport;
