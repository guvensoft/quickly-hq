// import * as passport from 'passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ManagementDB } from '../databases/management';

// const jwt_opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: 'quickly_secret_jwt',
//     // issuer: 'hq.quickly.com.tr',
//     // audience: 'quickly.com.tr'
// }

// const jwt_strategy = new Strategy(jwt_opts, (jwt_payload, done) => {
//     ManagementDB.Users.find({ selector: { username: jwt_payload.username } }).then(res => {
//         let user = res.docs[0];
//         if (user) {
//             done(null, user);
//         } else {
//             done(null, false);
//         }
//     })
// })


// passport.use(jwt_strategy);