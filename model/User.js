"use strict";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "145OkyayNo668Pass";
const FILE_PATH = __dirname + "/../data/users.json";
const fs = require("fs");

 class User{
     constructor(username, email, password){
         this.username = username;
         this.email = email;
         this.password = password;
         this.maxscore = 0;
         //a voir si mis ou pas
         this.numberofgame = 0;
         //plus de paramètres?
     }

     //sauvegarde user
     async save(){
         let userList = getUserListFromFile(FILE_PATH);
         const hashedPassword = await bcrypt.hash(this.password,saltRounds);
         //console.log("save:",this.email);
         userList.push({
             username: this.username,
             email: this.email,
             password: hashedPassword,
             maxscore: this.maxscore,
             numberofgame: this.numberofgame
         })
         saveUserListToFile(FILE_PATH,userList);
         return true;
     }

     //promesse
     checkCredentials(email, password) {
        if (!email || !password) return false;
        let userFound = User.getUserFromList(email);
        if (!userFound) return Promise.resolve(false);
        this.username = userFound.username;
        return bcrypt
          .compare(password, userFound.password)
          .then((match) => match)
          .catch((err) => err);
     }

     //SET Max Score
     static setMaxScore(username,scorePartie){
         // charger la liste d'utilisateurs
        let userList = getUserListFromFile(FILE_PATH);
        // trouver user associé à username et charger le user
        let userFound;
        for (let index = 0; index < userList.length; index++) {
            if (userList[index].username === username) {
                userFound = userList[index];
                break;
            }
        }
        if(userFound.maxscore<scorePartie){
            userFound.maxscore=scorePartie;
        }        
        // sauver tous les users à nouveau dans users.json
        let data = JSON.stringify(userList); //listisanarrayofobjects
        fs.writeFileSync(FILE_PATH,data);
     }
     
     //SET Number Of Game
     static setNumberOfGames(username){
        let userList = getUserListFromFile(FILE_PATH);
        // trouver user associé à username et charger le user
        let userFound;
        for (let index = 0; index < userList.length; index++) {
          if (userList[index].username === username) {
            userFound = userList[index];
            console.log(userFound);
            break;
          }
        }
        userFound.numberofgame=+1;
        // sauver tous les users à nouveau dans users.json
        let data = JSON.stringify(userList); //listisanarrayofobjects
        fs.writeFileSync(FILE_PATH,data);
     }

     //Get Max Score
     static getMaxScore(username){
        // charger la liste d'utilisateurs
        let userList = getUserListFromFile(FILE_PATH);
        // trouver user associé à username et charger le user
        let userFound;
        for (let index = 0; index < userList.length; index++) {
            if (userList[index].username === username) {
                userFound = userList[index];
                break;
            }
        }
        return userFound.maxscore;    
     }
     
     //Get Number Of Game
     static getNumberOfGames(username){
        // charger la liste d'utilisateurs
        let userList = getUserListFromFile(FILE_PATH);
        // trouver user associé à username et charger le user
        let userFound;
        for (let index = 0; index < userList.length; index++) {
            if (userList[index].username === username) {
                userFound = userList[index];
                break;
            }
        }
        return userFound.numberofgame; 
     }

     //verification si user est déjà dans la user File
     static isUser(email) {
        const userFound = User.getUserFromList(email);
        console.log("User::isUser:", userFound);
        return userFound !== undefined;
     }

     //Get user from user File
     static getUserFromList(email) {
        const userList = getUserListFromFile(FILE_PATH);
        for (let index = 0; index < userList.length; index++) {
          if (userList[index].email === email) return userList[index];
        }
        return;
     }

     //Get allMaxscore
     static getAllUserAndMaxScore(){
        console.log("t'es arrivé au bout"); 
        let userList = getUserListFromFile(FILE_PATH);
         return userList.map(userEntry =>{
             return {
                 username: userEntry.username,
                 maxscore: userEntry.maxscore  
             }
         }).sort((a,b) => b.maxscore - a.maxscore);
     }

     
 }



function getUserListFromFile(filePath) {
    if (!fs.existsSync(filePath)) return [];
    let userListRawData = fs.readFileSync(filePath);
    let userList;
    if (userListRawData) userList = JSON.parse(userListRawData);
    else userList = [];
    return userList;
}

function saveUserListToFile(filePath, userList) {
    console.log(FILE_PATH);
    console.log(filePath);
    let data = JSON.stringify(userList);
    fs.writeFileSync(filePath, data);
}

module.exports = User;