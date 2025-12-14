require("dotenv").config();
const express = require("express");
const app = express();
// require("./src/db/connection");

// Set default BASE_URL if missing
if (!process.env.BASE_URL) {
    process.env.BASE_URL = "https://www.gsmarena.com";
}

const indexRoutes = require("./src/routes/v2/index");
const errorRoutes = require("./src/routes/error");

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	next();
});

app.use("/", indexRoutes);
app.use("*", errorRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
