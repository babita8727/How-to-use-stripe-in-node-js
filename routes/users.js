var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

const USER = require("../app/auth/controller/auth.controller");

router.post("/register", USER.register);
router.post("/addCard", USER.addCard);
router.post("/createCharges", USER.createCharges);

module.exports = router;
