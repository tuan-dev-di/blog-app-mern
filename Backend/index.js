//? ---------------| IMPORT TECHs & LIBRARIES |---------------
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//? ---------------| IMPORT ROUTES |---------------
const user_route = require("./routes/UserRoute");
const post_route = require("./routes/PostRoute");
const comment_route = require("./routes/CommentRoute");

//? ---------------| MIDDLEWARE FROM LIBRARIES |---------------
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//? ---------------| TEST ROUTE |---------------
app.get("/", (req, res) => {
  res.send("MERN Blog Backend has started!");
});

//? ---------------| USE ROUTE |---------------
app.use("/api/auth/users", user_route);
app.use("/api/posts", post_route);
app.use("/api/comments", comment_route);

module.exports = app;
