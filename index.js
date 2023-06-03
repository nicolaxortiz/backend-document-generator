"use strict";

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const moongoose = require("mongoose");
const app = express();
const cors = require("cors");
const empleoyee_routes = require("./src/routes/empleoyee");
const payroll_routes = require("./src/routes/payroll");
const layoffs_routes = require("./src/routes/layoffs");
const contract_routes = require("./src/routes/contracts");
const evaluation_routes = require("./src/routes/evaluation");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const port = 3900;

let url = process.env.URL_DATABASE;

moongoose.Promise = global.Promise;

//Body-parser para analizar el body de la peticion a traves de la url
app.use(bodyParser.urlencoded({ extended: false }));

//convertimos la peticion en un JSON
app.use(bodyParser.json());

//Activacion del CORS para permitir peticiones AJAX y HTTP
app.use((req, res, next) => {
  res.header("Acces-Control-Allow-Origin: http://localhost:3000");
  res.header(
    "Acces-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/", empleoyee_routes);
app.use("/payroll", payroll_routes);
app.use("/layoffs", layoffs_routes);
app.use("/contract", contract_routes);
app.use("/evaluation", evaluation_routes);

moongoose.connect(url, { useNewUrlParser: true }).then(() => {
  console.log("Conexion a la base de datos completada");
  app.listen(port, () => {
    console.log("Ejecutando en el puerto " + port);
  });
});
