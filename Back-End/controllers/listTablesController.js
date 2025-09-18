const { getSupabaseClient } = require("../config/supabaseClient");

const validLists = {
  exclusion: "ExlusionList",
  saved: "SavedRecommendations",
  seen: "SeenMovies",
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

  const { data, error } = await supabase
    .from(tableName)
    .insert([{ UserId: userId, TitleId: resolvedTitleId, ...rest }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ item: data[0] });
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

  // Join the list with Titles
  const { data, error } = await supabase
    .from(tableName)
    .select("TitleId, Titles(*)")
    .eq("UserId", userId);

  if (error) return res.status(400).json({ error: error.message });

  const titles = data.map((item) => item.Titles);

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

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("UserId", userId)
    .eq("TitleId", titleId);

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

module.exports = {
  addToList,
  getAllListTitles,
  removeFromList,
  getOrInsertTitleId,
  searchTitleByImdbId,
};
