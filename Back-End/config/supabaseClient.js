const { createClient } = require("@supabase/supabase-js");
require("dotenv");

const adminClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function getSupabaseClient(req) {
  const accessToken = req.cookies && req.cookies.access_token;

  if (!accessToken) {
    const err = new Error("No access token cookie provided.");
    err.status = 401;
    throw err;
  }

  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    }
  );

  const {
    data: { user },
    error,
  } = await userClient.auth.getUser();

  if (error || !user) {
    const err = new Error("Invalid or expired access token");
    err.status = 401;
    throw err;
  }

  return userClient;
}

module.exports = { adminClient, getSupabaseClient };
