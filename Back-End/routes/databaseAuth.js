const express = require("express");
const router = express.Router();
const {
  signUp,
  loginUser,
  refreshAccessToken,
} = require("../controllers/databaseAuthController.js");

router.post("/login", loginUser);
router.post("/signUp", signUp);
router.post("/refreshAccessToken", refreshAccessToken);

module.exports = router;
