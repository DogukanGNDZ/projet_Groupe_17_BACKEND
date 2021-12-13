var express = require('express');
var router = express.Router();
var User = require("../model/User");
let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000 ; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h 

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
  return res.json(User.list);
});

/* POST user data for authentication */
router.post("/login", function (req, res, next) {
  let user = new User(req.body.username, req.body.email, req.body.password);
  console.log("POST users/login:", User.list);
  user.checkCredentials(req.body.email, req.body.password).then((match) => {
    if (match) {
      jwt.sign({ username: user.username, email: user.email }, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST users/ token:", token);
        //on recupère le username pour pouvoir l'afficher dans le profile
        return res.json({ username: user.username, token });
      });
    } else {
      console.log("POST users/loginRegister Error:", "Unauthentified");
      return res.status(401).send("bad email/password");
    }
  })  
});

/* POST a new user */
router.post("/", function (req, res, next) {
  console.log("POST users/", User.list);
  console.log("email:", req.body.email);
  if (User.isUser(req.body.email))
    return res.status(409).end();
    // Ici on va géré l'utilisateur qui va être add
  let newUser = new User(req.body.username, req.body.email, req.body.password);
  newUser.save().then(() => {
    console.log("afterRegisterOp:", User.list);
    //on garde le username et l'email quand l'utilisateur se connecte
    jwt.sign({ username: newUser.username, email:newUser.email}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
      if (err) {
        console.error("POST users/ :", err);
        return res.status(500).send(err.message);
      }
      console.log("POST users/ token:", token);
      return res.json({ username: newUser.username, token });
    });
  });
});

//création des routes utilisé dans gameScene
//GET Max Score
router.get("/getMaxScore", authorize, function(req, res, next){
  res.json({
    score : User.getMaxScore(req.user.username)
  });
});

//GET Number Of Games
router.get("/getNumberOfGames", authorize, function(req, res, next){
  res.json({
    score : User.getNumberOfGames(req.user.username)
  });
});

//SET Max Score
router.get("/setMaxScore", authorize, function(req, res, next){
  res.json({
    score : User.setMaxScore(req.user.username,req.body.score)
  });
});

//SET Number Of Game
router.get("/setNumberOfGames", authorize, function(req,res, next){
  res.json({
    score : User.setNumberOfGames(req.user.username)
  });
});

//va chercher le username de l'utilisateur connecté
router.get("/:username", function (req, res, next) {
  const userFound = User.getUserFromList(req.params.username);
  if (userFound) {
    return res.json(userFound);
  } else {
    return res.status(404).send("ressource not found");
  }
});

//Get maxscore file
router.get("/maxscoreBoard",function(req,res){
  res.json({maxscoreBoard : User.getAllUserAndMaxScore()})
})


module.exports = router;
