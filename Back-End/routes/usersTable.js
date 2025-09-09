const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
} = require("../controllers/UsersTableController.js");

router.post("/createUser", createUser);
router.post("/updateUser", updateUser);

module.exports = router;
