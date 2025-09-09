const { adminClient } = require("../config/supabaseClient");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await adminClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
  });
};

const signUp = async (req, res) => {
  const { email, password, full_name } = req.body;

  const { data, error } = await adminClient.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ user: data.user });
};

const refreshAccessToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: "refresh_token is required" });
  }

  const { data, error } = await adminClient.auth.refreshSession({
    refresh_token,
  });
  if (error) return res.status(401).json({ error: error.message });

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
  });
};

module.exports = { signUp, loginUser, refreshAccessToken };
