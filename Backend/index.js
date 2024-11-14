require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const user_route = require("./routes/user.route");

const app = express();

//TODO: Start Server with PORT
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`MERN Blog App | Backend started on port ${PORT}`)
);

//TODO: Connect to Mongo Database
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

//TODO: Run API
app.use(express.json());
app.use("/api/auth/user", user_route);
