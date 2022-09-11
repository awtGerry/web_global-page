const express = require("express");
const app = express();

const cookies = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv").config();
const db = require("./db.js");

// deps
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookies());
app.set('view engine', 'html');

// Definir rutas
app.use(express.static('pages'));
app.use('/', require('./js/routes.js'));
app.use('/val', require('./js/validate.js'));

app.listen(3000)
