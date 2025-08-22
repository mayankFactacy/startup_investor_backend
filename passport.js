// const { v4: uuidv4 } = require('uuid');
// const container = require('./db');
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const { GoogleUserSchema } = require('./utils/UserSchema');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const { resource: user } = await container.item(id, id).read();
//         done(null, user);
//     } catch (error) {
//         done(error);
//     }
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     scope: ['email', 'profile']
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             const emails = profile.emails;
//             if (!emails || !emails.length || !emails[0].value || emails[0].verified === false) {
//                 return done(new Error('Verified email required'));
//             }

//             const email = emails[0].value.toLowerCase().trim();
//             const querySpec = {
//                 query: 'SELECT * FROM c WHERE c.email = @email',
//                 parameters: [{ name: '@email', value: email }]
//             };

//             const { resources: users } = await container.items.query(querySpec).fetchAll();
//             let user = users[0];

//             if (!user) {
//                 const queryByGoogleId = {
//                     query: 'SELECT * FROM c WHERE c.googleId = @googleId',
//                     parameters: [{ name: '@googleId', value: profile.id }]
//                 };

//                 const { resources: usersByGoogleId } = await container.items.query(queryByGoogleId).fetchAll();
//                 user = usersByGoogleId[0];
//             }

//             if (!user) {
//                 const newUser = {
//                     id: uuidv4(),
//                     googleId: profile.id,
//                     firstName: profile.name?.givenName || '',
//                     lastName: profile.name?.familyName || '',
//                     email: email,
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString(),
//                     status: 'pending',
//                 };

//                 const parsedUser = GoogleUserSchema.safeParse(newUser);
//                 if (!parsedUser.success) {
//                     return done(new Error('User Validation failed: ' + parsedUser.error.message));
//                 }

//                 const { resource } = await container.items.create(parsedUser.data);
//                 user = resource;
//             } else {
//                 if (!user.googleId) {
//                     user.googleId = profile.id;
//                     const parsedUser = GoogleUserSchema.safeParse(user);
//                     if (!parsedUser.success) {
//                         return done(new Error("User update validation failed: " + parsedUser.error.message));
//                     }
//                     await container.item(user.id, user.id).replace(parsedUser.data);
//                 }
//             }

//             const token = jwt.sign({
//                 id: user.id,
//                 email: user.email
//             }, process.env.JWT_SECRET, { expiresIn: '1h' });

//             user.token = token;
//             const parsedToken = GoogleUserSchema.safeParse(user);

//             if (!parsedToken.success) {
//                 return done(new Error("Final user validation failed: " + parsedToken.error.message));
//             }

//             await container.item(user.id, user.id).replace(parsedToken.data);

//             return done(null, parsedToken.data);
//         } catch (error) {
//             return done(error);
//         }
//     }
// ));
