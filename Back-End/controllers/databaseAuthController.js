const { adminClient } = require("../config/supabaseClient");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await adminClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  // HTTP-only cookies
  res.cookie("access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  res.json({
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
  const refresh_token = req.cookies && req.cookies.refresh_token;
  if (!refresh_token) {
    return res.status(400).json({ error: "No refresh token cookie provided." });
  }

  const { data, error } = await adminClient.auth.refreshSession({
    refresh_token,
  });
  if (error) return res.status(401).json({ error: error.message });

  // HTTP-only cookies
  res.cookie("access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  res.json({
    user: data.user,
  });
};

module.exports = { signUp, loginUser, refreshAccessToken };
