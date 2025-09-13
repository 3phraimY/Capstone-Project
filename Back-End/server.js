const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const DatabaseAuthRoutes = require("./routes/databaseAuth.js");
app.use("/api/auth", DatabaseAuthRoutes);

const UserRoutes = require("./routes/usersTable.js");
app.use("/api/user", UserRoutes);

const ListTableRoutes = require("./routes/listTables.js");
app.use("/api/list", ListTableRoutes);

const PreviousRecommendationsRoutes = require("./routes/previousRecommendations.js");
app.use("/api/previousRecommendations", PreviousRecommendationsRoutes);

const OMDbRoutes = require("./routes/omdbAPI.js");
app.use("/api/omdb", OMDbRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
