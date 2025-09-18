const express = require("express");
const router = express.Router();
const {
  addToList,
  removeFromList,
  getAllListTitles,
  searchTitleByImdbId,
} = require("../controllers/listTablesController.js");

router.post("/addToList", addToList);
router.post("/removeFromList", removeFromList);
router.get("/getListTitles", getAllListTitles);
router.get("/findTitleByImdbId", searchTitleByImdbId);

module.exports = router;
