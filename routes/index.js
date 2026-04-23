const express = require("express");
const session = require("express-session");
const path = require("path");
const Database = require("./utils/Database"); // Singleton DB
const routes = require("./routes"); // MVC routes

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions (required for login)
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", routes);

// Start server + connect DB
(async () => {
  try {
    await Database.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
