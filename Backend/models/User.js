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
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.deviantart.com%2Fkarmaanddestiny%2Fart%2FDefault-user-icon-4-858661084&psig=AOvVaw3aSxWNAqHTJbzCc6wgvtl0&ust=1733830604329000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCSor7MmooDFQAAAAAdAAAAABAS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
