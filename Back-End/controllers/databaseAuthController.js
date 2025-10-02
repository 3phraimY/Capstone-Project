const { adminClient } = require("../config/supabaseClient");
const { getSupabaseClient } = require("../config/supabaseClient");

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
    secure: true,
    sameSite: "none",
    domain: process.env.FRONT_URL.replace(/^https?:\/\//, ""),
    maxAge: 60 * 60 * 1000, // 1 hour
    overwrite: true,
  });
  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: process.env.FRONT_URL.replace(/^https?:\/\//, ""),
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    overwrite: true,
  });

  res.json({
    user: data.user.id,
  });
};

const signUp = async (req, res) => {
  const { email, password, full_name } = req.body;

  const { data, error } = await adminClient.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  // Insert into Users table after successful sign up
  try {
    const userId = data.user.id;
    const userClient = await getSupabaseClient({
      cookies: { access_token: data.session?.access_token },
    });

    const { error: insertError } = await userClient
      .from("Users")
      .insert([{ userId, UserDisplayName: full_name || "" }]);

    if (insertError) {
      console.error("Failed to insert into Users table:", insertError.message);
    }
  } catch (err) {
    console.error("Error inserting user:", err.message);
  }

  if (data.session) {
    res.cookie("access_token", data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.FRONT_URL.replace(/^https?:\/\//, ""),
      maxAge: 60 * 60 * 1000, // 1 hour
      overwrite: true,
    });
    res.cookie("refresh_token", data.session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.FRONT_URL.replace(/^https?:\/\//, ""),
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      overwrite: true,
    });
  }

  res.status(200).json({ user: data.user.id });
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
    secure: true,
    sameSite: "none",
    domain: process.env.FRONT_URL.replace(/^https?:\/\//, ""),
    maxAge: 60 * 60 * 1000, // 1 hour
    overwrite: true,
  });
  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: process.env.FRONT_URL.replace(/^https?:\/\//, ""),
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    overwrite: true,
  });

  res.json({
    user: data.user.id,
  });
};

const checkAuthentication = async (req, res) => {
  console.log("Cookies received in checkAuthentication:", req.cookies);

  const hasRefreshToken = !!(req.cookies && req.cookies.refresh_token);
  try {
    const supabase = await getSupabaseClient(req);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ authenticated: false, hasRefreshToken });
    }
    res
      .status(200)
      .json({ authenticated: true, user: user.id, hasRefreshToken });
  } catch (err) {
    res
      .status(401)
      .json({ authenticated: false, hasRefreshToken, error: err.message });
  }
};

module.exports = { signUp, loginUser, refreshAccessToken, checkAuthentication };
