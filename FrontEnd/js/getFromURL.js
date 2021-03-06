"use strict";
/**
 * @param name name
 * @return String
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function getLangPath(name) {
    if (name == "es") {
        console.log("Spanish");
        return "/lang/es.json";
    }
    else if (name == "en") {
        console.log("English");
        return "/lang/en.json";
    }
    else {
        console.log("Default Languaje");
        return "/lang/es.json";
    }
}
function fillVars() {
    var nombre = getParameterByName("name");
    var correo = getParameterByName("mail");
    //Nombre - email
    var input = document.getElementById("Nombre");
    if (nombre != "") {
        input.value = nombre;
        input.style.color = "rgb(0,0,0)";
    }
    ;
    var input = document.getElementById("Email");
    if (correo != "") {
        input.value = correo;
        input.style.color = "rgb(0,0,0)";
    }
    ;
    console.log("Taken variables from URL");
}
/**EJECUCIONES INMEDIATAS */
var tkn = getParameterByName("out");
var lang = getLangPath(getParameterByName("lang"));
var tempdb = "/tempbackend/tempdb.json";
var cc = getParameterByName("cc");
var shortln = getParameterByName("lang");
if (shortln == "") {
    shortln = "es";
}
console.log("Languaje set:" + shortln);
function reqNewToken(token) {
    var tkns = token.split("_");
    var ln = tkns[1];
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText + "_" + ln);
            return this.responseText + "_" + ln;
        }
    };
    req.open("POST", "/burntoken", true);
    req.setRequestHeader("token", token);
    req.send(null);
}
