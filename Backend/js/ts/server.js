"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data = __importStar(require("../json/users.json"));
const db = __importStar(require("../json/db.json"));
const fs = require('fs');
const path = require('path');
const jssub = "../";
//const express = require('express')
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(errorHandler);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, jssub + '../../FrontEnd')));
//>>>>>>>>>> GET <<<<<<<<<<<<<<<<
//400 - DATOS INCOMPLETOS
//401 - DATOS INCORRECTOS
//200 - MATCH DE DATOS 
//provide right data inputs
const requireUser = () => {
    return (req, res, next) => {
        let usernick = req.headers['user'];
        let password = req.headers['pass'];
        if ((usernick == undefined) || (password == undefined)) {
            res.status(400).send("Require user and password");
        }
        else {
            let dataUser;
            let dataPass;
            let entries;
            try {
                dataUser = (data.allUsers["users"][usernick][2]);
                dataPass = data.allUsers["users"][usernick][1];
                entries = data.allUsers["users"][usernick][3];
            }
            catch (error) {
                res.status(401).send("Invalid input");
            }
            if ((dataUser == true) && (dataPass == password)) {
                data.allUsers["users"][usernick][3] = entries + 1;
                data.allUsers["users"][usernick][0] = createOUT();
                data.allUsers["users"][usernick][4] = getLastLog();
                data.allUsers.logs[getLastLog()] = usernick;
                updateData();
                next();
            }
            else {
                res.status(401).send("Invalid input");
            }
        }
    };
};
const requireOUT = () => {
    return (req, res, next) => {
        let token = req.headers["token"];
        try {
            if (data.allUsers["users"][(token.split('#'))[1]][0] == (token.split('#'))[0]) {
                next();
            }
            else {
                res.status(400).send("Invalid token");
            }
        }
        catch (error) {
            res.status(401).send("Invalid user");
        }
    };
};
const requireInfo = () => {
    return (req, res, next) => {
        let user = req.headers["user"];
        let order = req.headers["order"];
        let lmt = req.headers["lmt"];
        console.log(user);
        if ((user == undefined) || (order == undefined)) {
            res.status(406).send("missed keys");
        }
        else {
            next();
        }
    };
};
function order(user, order, lmt) {
    if (order == "info") {
        //lmt = "name" | "rut" | "mail"
        return db.db[user][order][lmt];
    }
    else if ((order == "ccounts") || (order == "invests")) {
        return db.db[user][order];
    }
}
//MVC-test
app.get('/', (req, res, next) => {
    //res.sendFile(path.join(__dirname,jssub+'../../FrontEnd/home/home.html'));
    console.log("Captured get /");
    //res.sendFile("../home/home.html");
});
//SESION LOGIN
app.get('/userload', requireUser(), (req, res, next) => {
    res.status(200).send(data.allUsers["users"][req.headers["user"]][0] + "#" + data.allUsers.users[req.headers["user"]][4]);
    //res.sendFile(path.join(__dirname,jssub+'../../FrontEnd/user/summary.html'));
    console.log("Capture login:" + req.headers["user"]);
});
//GET USER NICK
app.get('/usernick', (req, res, next) => {
    let ln = req.headers["ln"];
    res.status(200).send(data.allUsers.logs[ln]);
});
//LOAD USER INFO
app.get("/userinfo", requireOUT(), requireInfo(), (req, res) => {
    console.log("matched token");
    res.status(200).send(data.allUsers.logs[((req.headers["token"]).split("#"))[1]]);
});
//LOAD USER DATA
app.get("/userdata", requireOUT(), requireInfo(), (req, res) => {
    console.log("matched token");
    res.send(order(req.headers["user"], req.headers["order"]));
});
function errorHandler(err, req, res, any, next) {
    res.status(500);
    res.render('error', { error: err });
}
//Generate a random string
function createOUT() {
    let randToken = "";
    for (let i = 0; i <= 9; i++) {
        let letter = String.fromCharCode(Math.random() * (65 - 122) + 122);
        randToken = randToken + letter;
    }
    return randToken;
}
function getLastLog() {
    let last = Object.keys(data.allUsers.logs).length;
    return last;
}
//>>>>>>>>>>>>>>>>> POST <<<<<<<<<<<<<<<<<<<
const requirelmnts = () => {
    return (req, res, next) => {
        let name = req.headers["name"];
        let rut = req.headers["rut"];
        let mail = req.headers["mail"];
        let usernick = req.headers["user"];
        let password = req.headers["pass"];
        if ((name == undefined) || (rut == undefined) || (mail == undefined) || (usernick == undefined) || (password == undefined)) {
            res.status(413).send("incomplete");
        }
        else {
            let existnick = db.db[usernick];
            let existmail = db.db["mails"][mail];
            if (existnick != undefined) {
                res.status(414).send("Nick in use");
            }
            else if (existmail != undefined) {
                res.status(415).send("mail in use");
            }
            else {
                next();
            }
            ;
        }
    };
};
function addUser(req) {
    let name = req.headers["name"];
    let rut = req.headers["rut"];
    let mail = req.headers["mail"];
    let usernick = req.headers["user"];
    let password = req.headers["pass"];
    let objinfo = `{
    "info":{
      "name":"${name}",
      "rut":"${rut}",
      "mail":"${mail}"
    },
    "ccounts":[],
    "invests":[]
    }`;
    let objuser = `["${createOUT()}","${password}",true,0]`;
    db.db[usernick] = JSON.parse(objinfo);
    db.db["mails"][mail] = true;
    data.allUsers["users"][usernick] = objuser;
    updateDB();
    updateData();
}
app.post("/newuser", requirelmnts(), (req, res) => {
    console.log("Complete data");
    addUser(req);
    res.send("User added");
});
function updateData() {
    const upd = JSON.stringify(data);
    fs.writeFile("./json/tusers.json", upd, (err) => {
        if (err) {
            throw err;
        }
    });
    fs.writeFile("./js/json/tusers.json", upd, (err) => {
        if (err) {
            throw err;
        }
    });
    //console.log("updated entrie");
    console.log("update test entrie");
}
function updateDB() {
    const upd = JSON.stringify(db);
    fs.writeFile("./json/tdb.json", upd, (err) => {
        if (err) {
            throw err;
        }
    });
    fs.writeFile("./js/json/tdb.json", upd, (err) => {
        if (err) {
            throw err;
        }
    });
    console.log("UPDATED TEST DATABASE");
    //console.log("UPDATED JSON DB");
}
function getNick(out, lognum) {
    console.log();
    const obj = data.allUsers;
}
app.listen(5000, () => console.log('Server started on 5000'));