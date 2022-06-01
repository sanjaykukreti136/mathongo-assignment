const mongoose = require("mongoose");
let database_link;
if (process.env.link) {
  database_link = process.env.link;
} else {
  // local
  database_link = require("../secrets").link;
}

const validator = require("email-validator");
let dbLink = database_link;
mongoose
  .connect(dbLink)
  .then(function (connection) {
    console.log("db has been conncetd");
  })
  .catch(function (error) {
    console.log("err", error);
  });
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      // third party library
      return validator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    validate: function () {
      return this.password == this.confirmPassword;
    },
  },
  createdAt: {
    type: String,
  },
  token: String,
  validUpto: Date,
  role: {
    type: String,
    enum: ["admin", "ce", "user"],
    default: "user",
  },
});
// hook
userSchema.pre("save", function (next) {
  // do stuff
  this.confirmPassword = undefined;
  next();
});
// document method
userSchema.methods.resetHandler = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.token = undefined;
};
// model
let userModel = mongoose.model("PABUserModel", userSchema);
module.exports = userModel;
