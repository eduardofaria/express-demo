const express = require("express");
const router = express.Router();
//router.set("view engine", "pug"); //With this syntax, Express auto load this module, no need to "require".
//router.set("views", "./views"); // default value, change it is optional.

router.get("/", (req, res) => {
  res.render("index", { title: "My Logger Page", message: "Loging..." });
});

module.exports = router;
