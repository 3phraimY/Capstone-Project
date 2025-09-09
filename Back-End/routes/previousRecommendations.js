const express = require("express");
const router = express.Router();
const {
  addToPreviousRecommendation,
  removeFromPreviousRecommendation,
  getAllPreviousRecommendationsTitles,
} = require("../controllers/previousRecommendationsController.js");

router.post("/add", addToPreviousRecommendation);
router.post("/remove", removeFromPreviousRecommendation);
router.get("/getAll", getAllPreviousRecommendationsTitles);

module.exports = router;
