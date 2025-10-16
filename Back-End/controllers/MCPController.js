const { adminClient } = require("../config/supabaseClient");
const { validLists } = require("./listTablesController.js");

async function getUserLists(req, res) {
  const userId = req.query.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const supabase = adminClient;

  try {
    const [saved, seen, exclusion, previous] = await Promise.all([
      supabase
        .from(validLists.saved)
        .select("TitleId, Titles(*)")
        .eq("UserId", userId),
      supabase
        .from(validLists.seen)
        .select("TitleId, Titles(*)")
        .eq("UserId", userId),
      supabase
        .from(validLists.exclusion)
        .select("TitleId, Titles(*)")
        .eq("UserId", userId),
      supabase
        .from(validLists.previous)
        .select("PreviousRecommendationItemId, RecommendedDate, Titles(*)")
        .eq("UserId", userId)
        .order("RecommendedDate", { ascending: false }),
    ]);

    const savedList = saved.data
      ? saved.data.map((item) => ({
          IMDbId: item.Titles?.IMDbId,
          Title: item.Titles?.Title,
          ReleaseYear: item.Titles?.ReleaseYear,
        }))
      : [];
    const seenList = seen.data
      ? seen.data.map((item) => ({
          IMDbId: item.Titles?.IMDbId,
          Title: item.Titles?.Title,
          ReleaseYear: item.Titles?.ReleaseYear,
        }))
      : [];
    const exclusionList = exclusion.data
      ? exclusion.data.map((item) => ({
          IMDbId: item.Titles?.IMDbId,
          Title: item.Titles?.Title,
          ReleaseYear: item.Titles?.ReleaseYear,
        }))
      : [];
    const previousList = previous.data
      ? previous.data.map((item) => ({
          IMDbId: item.Titles?.IMDbId,
          Title: item.Titles?.Title,
          ReleaseYear: item.Titles?.ReleaseYear,
        }))
      : [];

    res.status(200).json({
      saved: savedList,
      seen: seenList,
      exclusion: exclusionList,
      previous: previousList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getUserLists };
