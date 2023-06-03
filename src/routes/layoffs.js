"use strict";

const express = require("express");
const Layoffs = require("../controllers/layoffs");

const router = express.Router();

router.post("/save", Layoffs.save);

router.get("/getAll", Layoffs.getAll);

router.get("/:id", Layoffs.getByEmployeeId);

router.get("/pazysalvo/:id", Layoffs.getLayoffsDocument);

router.put("/update/:id", Layoffs.update);

router.delete("/delete/:id", Layoffs.delete);

module.exports = router;
