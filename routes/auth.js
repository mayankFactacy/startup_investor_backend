// const { session } = require("passport");
// const passport = require("../passport");

import { sendOtp, verifyOtp, login, profileSetup } from "../controllers/authController.js";
import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authroizeRole.js";
const router = express.Router();

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
//   (req, res) => {
//     res.redirect(`/auth/google/success?token=${req.user.token}`);
//   }
// );

// router.get('/google/success', (req, res) => {
//   res.json({
//     message: 'Google authentication successful',
//     user: req.user
//   });
// });


// router.get('/google/failure', (req, res) => {
//   res.status(401).json({
//     message: 'Google authentication failed'
//   });
// });
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/setup",authenticate,authorizeRole("startup"), profileSetup);
// router.get("/getprofile", getProfile);

export default router;