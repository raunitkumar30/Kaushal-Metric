const express = require("express");

const {
  register,
  login,
  me,
  giveConsent,
} = require("../controllers/authController");

const {
  authenticate,
} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, me);

router.post("/consent", authenticate, giveConsent);

module.exports = router;