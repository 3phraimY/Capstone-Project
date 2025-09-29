const { getSupabaseClient } = require("../config/supabaseClient");

const validLists = {
  exclusion: "ExclusionList",
  saved: "SavedRecommendations",
  seen: "SeenMovies",
  previous: "PreviousRecommendations",
};

async function getOrInsertTitleId(supabase, imdbId, titleData = {}) {
  // Check title table first to prevent duplication
  let { data, error } = await supabase
    .from("Titles")
    .select("TitleId")
    .eq("IMDbId", imdbId)
    .single();

  if (data && data.TitleId) {
    return data.TitleId;
  }

  // If not found, insert new title
  const insertObj = { IMDbId: imdbId, ...titleData };
  ({ data, error } = await supabase
    .from("Titles")
    .insert([insertObj])
    .select("TitleId")
    .single());

  if (error || !data) throw new Error("Could not insert or find title");

  return data.TitleId;
}

const addToList = async (req, res) => {
  const {
    listType,
    userId,
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
    titleId,
    ...rest
  } = req.body;

  if (!listType || !userId || (!imdbID && !titleId)) {
    return res.status(400).json({
      error: "listType, userId, and either imdbID or titleId are required",
    });
  }

  const tableName = validLists[listType];
  if (!tableName) {
    return res.status(400).json({ error: "Invalid listType" });
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

  // Enforce max limit for "previous"
  if (listType === "previous") {
    // Count current recommendations for this user
    const { data: existing, error: countError } = await supabase
      .from("PreviousRecommendations")
      .select("PreviousRecommendationItemId, RecommendedDate")
      .eq("UserId", userId)
      .order("RecommendedDate", { ascending: true });

    if (countError) return res.status(400).json({ error: countError.message });

    // If at limit, delete the oldest
    if (existing && existing.length >= PREVIOUS_RECOMMENDED_CACHED) {
      const oldest = existing[0];
      const { error: deleteError } = await supabase
        .from("PreviousRecommendations")
        .delete()
        .eq(
          "PreviousRecommendationItemId",
          oldest.PreviousRecommendationItemId
        );
      if (deleteError)
        return res.status(400).json({ error: deleteError.message });
    }
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert([{ UserId: userId, TitleId: resolvedTitleId, ...rest }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ success: true });
};

const getAllListTitles = async (req, res) => {
  const { listType, userId } = req.query;

  if (!listType || !userId) {
    return res.status(400).json({ error: "listType and userId are required" });
  }

  const tableName = validLists[listType];
  if (!tableName) {
    return res.status(400).json({ error: "Invalid listType" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  let data, error;
  if (listType === "previous") {
    // Join PreviousRecommendations with Titles, include extra fields
    ({ data, error } = await supabase
      .from("PreviousRecommendations")
      .select("PreviousRecommendationItemId, RecommendedDate, Titles(*)")
      .eq("UserId", userId)
      .order("RecommendedDate", { ascending: false }));
  } else {
    // Join the list with Titles
    ({ data, error } = await supabase
      .from(tableName)
      .select("TitleId, Titles(*)")
      .eq("UserId", userId));
  }

  if (error) return res.status(400).json({ error: error.message });

  let titles;
  if (listType === "previous") {
    titles = data.map((item) => ({
      TitleId: item.Titles.TitleId,
      ...item.Titles,
    }));
  } else {
    titles = data.map((item) => ({
      TitleId: item.TitleId,
      ...item.Titles,
    }));
  }

  res.status(200).json({ titles });
};

const removeFromList = async (req, res) => {
  const { listType, userId, titleId } = req.body;

  if (!listType || !userId || !titleId) {
    return res.status(400).json({
      error: "listType, userId, and titleId are required",
    });
  }

  const tableName = validLists[listType];
  if (!tableName) {
    return res.status(400).json({ error: "Invalid listType" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  let deleteQuery = supabase.from(tableName).delete().eq("UserId", userId);

  if (listType === "previous") {
    // Remove by PreviousRecommendationItemId if provided, else by TitleId
    if (req.body.PreviousRecommendationItemId) {
      deleteQuery = deleteQuery.eq(
        "PreviousRecommendationItemId",
        req.body.PreviousRecommendationItemId
      );
    } else {
      deleteQuery = deleteQuery.eq("TitleId", titleId);
    }
  } else {
    deleteQuery = deleteQuery.eq("TitleId", titleId);
  }

  const { error } = await deleteQuery;

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Item removed from list" });
};

const searchTitleByImdbId = async (req, res) => {
  const { imdbId } = req.query;

  if (!imdbId) {
    return res.status(400).json({ error: "imdbId is required" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const { data, error } = await supabase
    .from("Titles")
    .select("*")
    .eq("IMDbId", imdbId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Title not found" });
  }

  res.status(200).json({ title: data });
};

const PREVIOUS_RECOMMENDED_CACHED = parseInt(
  process.env.PREVIOUS_RECOMMENDED_CACHED
);

module.exports = {
  validLists,
  addToList,
  getAllListTitles,
  removeFromList,
  getOrInsertTitleId,
  searchTitleByImdbId,
};
