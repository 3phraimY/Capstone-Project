const express = require("express");
const router = express.Router();
const {
  searchResults,
  searchTitleById,
} = require("../controllers/omdbAPIController.js");

router.get("/searchResults", searchResults);
router.get("/findTitle", searchTitleById);

module.exports = router;
