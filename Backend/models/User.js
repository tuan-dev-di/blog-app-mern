const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      min: 7,
      max: 25,
    },
    password: {
      type: String,
      require: true,
      min: 7,
    },
    email: {
      type: String,
      unique: true,
    },
    displayName: {
      type: String,
      require: false,
      min: 2,
      max: 50,
    },
    profileImage: {
      type: String,
      default:
        "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
