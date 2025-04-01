//? ---------------| IMPORT TECHs & LIBRARIES |---------------
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");

//? ---------------| IMPORT ROUTES |---------------
const user_route = require("./routes/UserRoute");
const post_route = require("./routes/PostRoute");
const comment_route = require("./routes/CommentRoute");

//? ---------------| CALL PORT FROM .ENV |---------------
const app = express();
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`MERN Blog App | Backend started on port ${PORT}`)
);

//? ---------------| CONNECT DATABASE MONGOOSE |---------------
const MongoDB_Username = process.env.MONGO_Username;
const MongoDB_Password = process.env.MONGO_Password;
const MongoDB_Cluster = process.env.MONGO_Cluster;
const MongoDB_Database = process.env.MONGO_Database;
const MongoDB_URL = `mongodb+srv://${MongoDB_Username}:${MongoDB_Password}@${MongoDB_Cluster}.mongodb.net/?retryWrites=true&w=majority&appName=${MongoDB_Database}`;

mongoose
  .connect(MongoDB_URL)
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

//* Maybe using another connection
// const MongoDB_Connection = async () => {
//   try {
//     await mongoose.connect(MongoDB_URL);
//     console.log("Mongoose Connected");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

//? ---------------| RUN APIs |---------------
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth/users", user_route);
app.use("/api/posts", post_route);
app.use("/api/comments", comment_route);

// app.use((error, req, res, next) => {
//   const statusCode = error.statusCode || 500;
//   const message = error.message || "Internal Error Server";
//   res.status(statusCode).json({
//     code: statusCode,
//     success: false,
//     message: message,
//   });
// });
