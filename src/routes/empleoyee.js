"use strict";

const express = require("express");
const Empleoyee = require("../controllers/empleoyee");

//Llamado al objeto router de express
const router = express.Router();

//Rutas para los empleados
router.post("/save", Empleoyee.save);

router.get("/empleoyee", Empleoyee.getEmpleoyees);

router.get("/empleoyee/:id", Empleoyee.getEmpleoyeeById);

router.get("/certificado/:id", Empleoyee.getCertificadoLaboral);

router.get("/contract/indefinido/:id", Empleoyee.getContratoIndefinido);

router.get("/contract/fijo/:id", Empleoyee.getContratoFijo);

router.post("/document", Empleoyee.getEmpleoyeeByDocument);

router.post("/empleoyee/login", Empleoyee.getCredentialsEmpleoyee);

router.delete("/delete/:id", Empleoyee.delete);

router.put("/update/:id", Empleoyee.update);

router.put("/updatePass/:id", Empleoyee.updatePassword);

module.exports = router;
