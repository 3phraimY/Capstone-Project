const { getSupabaseClient } = require("../config/supabaseClient");

const createUser = async (req, res) => {
  const { userId, UserDisplayName } = req.body;

  if (!userId || !UserDisplayName) {
    return res
      .status(400)
      .json({ error: "userId and UserDisplayName are required" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const { data, error } = await supabase
    .from("Users")
    .insert([{ userId, UserDisplayName }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data[0] });
};

const updateUser = async (req, res) => {
  const { userId, UserDisplayName } = req.body;

  if (!userId || !UserDisplayName) {
    return res
      .status(400)
      .json({ error: "userId and UserDisplayName are required" });
  }

  let supabase;
  try {
    supabase = await getSupabaseClient(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const { data, error } = await supabase
    .from("Users")
    .update({ UserDisplayName })
    .eq("userId", userId)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ data: data[0] });
};

module.exports = { createUser, updateUser };
