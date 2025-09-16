const express = require("express");
const router = express.Router();
const {
  signUp,
  loginUser,
  refreshAccessToken,
  checkAuthentication,
} = require("../controllers/databaseAuthController.js");

router.post("/login", loginUser);
router.post("/signUp", signUp);
router.post("/refreshAccessToken", refreshAccessToken);
router.get("/checkAuthentication", checkAuthentication);

module.exports = router;
