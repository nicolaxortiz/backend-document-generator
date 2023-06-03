"use strict";

const express = require("express");
const Evaluation = require("../controllers/evaluation");

//Llamado al objeto router de express
const router = express.Router();

//Rutas para las evaluaciones
router.post("/save", Evaluation.save);

router.get("/getAll", Evaluation.getAll);

router.get("/:id", Evaluation.getEvaluation);

router.put("/update/:id", Evaluation.update);

router.delete("/delete/:id", Evaluation.delete);

module.exports = router;
