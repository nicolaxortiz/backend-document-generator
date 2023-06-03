"use strict";

const express = require("express");
const Payroll = require("../controllers/payroll");
const payroll = require("../models/payroll");

const router = express.Router();

router.post("/save", Payroll.save);

router.get("/nomina/:id", Payroll.getPayrollByEmpleoyeeId);

router.get("/getAll", Payroll.getPayrolls);

router.put("/update/:id", Payroll.update);

router.delete("/delete/:id", Payroll.delete);

module.exports = router;
