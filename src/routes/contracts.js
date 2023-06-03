"use strict";

const ContIndef = require("../Documents/ContratoIndefinido");
const ContFijo = require("../Documents/ContratoFijo");
const express = require("express");
const axios = require("axios");

//Llamado al objeto router de express
const router = express.Router();

router.get("/indefinido/:id", (req, res) => {
  const EmpleooyeId = req.params.id;

  const getEmpleoyee = async () => {
    const response = await axios.get(
      "http://localhost:3900/empleoyee/" + EmpleooyeId
    );
    if (response.status === 200) {
      const empleado = response.data.empleoyee;
      ContIndef(res, empleado);
    }
  };

  getEmpleoyee();
});

router.get("/fijo/:id", (req, res) => {
  const EmpleooyeId = req.params.id;

  const getEmpleoyee = async () => {
    const response = await axios.get(
      "http://localhost:3900/empleoyee/" + EmpleooyeId
    );
    if (response.status === 200) {
      const empleado = response.data.empleoyee;
      ContFijo(res, empleado);
    }
  };

  getEmpleoyee();
});

module.exports = router;
