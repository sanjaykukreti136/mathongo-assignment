const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRouter = require("./Router/authRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.listen(process.env.PORT || 8081, function () {
  console.log("server started");
});
app.use(function (req, res) {
  res.status(404).json({
    message: "page Not found",
  });
});
