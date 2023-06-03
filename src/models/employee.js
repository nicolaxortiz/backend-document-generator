"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let EmpleoyeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  document: {
    type: Number,
    required: true,
    unique: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  country: String,
  region: String,
  city: String,
  address: {
    type: String,
    default: "",
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    default: "",
  },
  contract: {
    type: String,
    required: true,
  },
  endContract: {
    type: String,
    default: "No aplica",
  },
  salary: {
    type: Number,
    required: true,
  },
  isWorking: {
    type: Boolean,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Empleooye", EmpleoyeeSchema);
