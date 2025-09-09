const { getSupabaseClient } = require("../config/supabaseClient");
const { getOrInsertTitleId } = require("./listTablesController");

const PREVIOUS_RECOMMENDED_CACHED = parseInt(
  process.env.PREVIOUS_RECOMMENDED_CACHED
);

// Adds to previous recommendations, but set limit of PREVIOUS_RECOMMENDED_CACHED, if over limit, remove oldest
const addToPreviousRecommendation = async (req, res) => {
  const {
    userId,
    titleId,
    imdbID,
    Title,
    Year,
    Rated,
    Runtime,
    Director,
    Writer,
    Actors,
    Plot,
    Poster,
    Metascore,
    Type,
    recommendedDate,
    ...rest
  } = req.body;

  if (!userId || (!imdbID && !titleId)) {
    return res
      .status(400)
      .json({ error: "userId and either imdbID or titleId are required" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  let resolvedTitleId = titleId;
  if (!resolvedTitleId && imdbID) {
    const titleData = {
      Title,
      ReleaseYear: Year ? parseInt(Year) : null,
      Rating: Rated,
      Runtime,
      Director,
      Writer,
      Actors,
      Plot,
      PosterURL: Poster,
      MetaScore: Metascore ? parseInt(Metascore) : null,
      IMDbId: imdbID,
      Type,
    };
    try {
      resolvedTitleId = await getOrInsertTitleId(supabase, imdbID, titleData);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Count current recommendations for this user
  const { data: existing, error: countError } = await supabase
    .from("PreviousRecommendations")
    .select("PreviousRecommendationItemId, RecommendedDate")
    .eq("UserId", userId)
    .order("RecommendedDate", { ascending: true });

  if (countError) return res.status(400).json({ error: countError.message });

  // 2. If at limit, delete the oldest
  if (existing.length >= PREVIOUS_RECOMMENDED_CACHED) {
    const oldest = existing[0];
    const { error: deleteError } = await supabase
      .from("PreviousRecommendations")
      .delete()
      .eq("PreviousRecommendationItemId", oldest.PreviousRecommendationItemId);
    if (deleteError)
      return res.status(400).json({ error: deleteError.message });
  }

  // 3. Insert the new recommendation
  const { data, error } = await supabase
    .from("PreviousRecommendations")
    .insert([
      {
        UserId: userId,
        TitleId: resolvedTitleId,
        RecommendedDate: recommendedDate || new Date().toISOString(),
        ...rest,
      },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ item: data[0] });
};

// Remove a previous recommendation by item ID
const removeFromPreviousRecommendation = async (req, res) => {
  const { titleId, userId } = req.body;

  if (!titleId || !userId) {
    return res.status(400).json({ error: "titleId and userId are required" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  // Optionally, return the deleted row for confirmation
  const { data, error } = await supabase
    .from("PreviousRecommendations")
    .delete()
    .eq("TitleId", titleId)
    .eq("UserId", userId)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No matching recommendation found" });
  }
  res
    .status(200)
    .json({ message: "Previous recommendation removed", deleted: data });
};

// Get all previous recommendations for a user (joined with Titles)
const getAllPreviousRecommendationsTitles = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const { data, error } = await supabase
    .from("PreviousRecommendations")
    .select("PreviousRecommendationItemId, RecommendedDate, Titles(*)")
    .eq("UserId", userId)
    .order("RecommendedDate", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  // Return the joined Titles info
  const recommendations = data.map((item) => ({
    PreviousRecommendationItemId: item.PreviousRecommendationItemId,
    RecommendedDate: item.RecommendedDate,
    Title: item.Titles,
  }));

  res.status(200).json({ recommendations });
};

module.exports = {
  addToPreviousRecommendation,
  removeFromPreviousRecommendation,
  getAllPreviousRecommendationsTitles,
};
