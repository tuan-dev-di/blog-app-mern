const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./index");

const PORT = process.env.PORT;

//? ---------------| CONNECT DATABASE MONGOOSE |---------------
const MongoDB_Username = process.env.MONGO_Username;
const MongoDB_Password = process.env.MONGO_Password;
const MongoDB_Cluster = process.env.MONGO_Cluster;
const MongoDB_Database = process.env.MONGO_Database;
const MongoDB_URL = `mongodb+srv://${MongoDB_Username}:${MongoDB_Password}@${MongoDB_Cluster}.mongodb.net/?retryWrites=true&w=majority&appName=${MongoDB_Database}`;

mongoose
  .connect(MongoDB_URL)
  .then(() => {
    console.log("Mongoose connected successfully!");
    app.listen(PORT, () =>
      console.log(`MERN Blog App | Backend started on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.log("Mongoose connection error:", error);
    process.exit(1);
  });
