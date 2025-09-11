const axios = require("axios");

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Search OMDb by title and optionally page number
const searchResults = async (req, res) => {
  const { title, page } = req.query;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const formattedTitle = title.replace(/ /g, "+");

  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        s: formattedTitle,
        page: page || 1,
      },
    });

    if (response.data.Response === "False") {
      return res.status(404).json({ error: response.data.Error });
    }

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "error fetching data from OMDb" });
  }
};

const searchTitleById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        i: id,
        plot: "full",
      },
    });

    if (response.data.Response === "False") {
      return res.status(404).json({ error: response.data.Error });
    }

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OMDb" });
  }
};

module.exports = {
  searchResults,
  searchTitleById,
};
