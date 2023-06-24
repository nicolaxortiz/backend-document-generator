"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let EvaluationSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Empleooye",
    required: true,
  },
  date: { type: String, required: true },
  dateOrder: Number,
  evaluatorName: { type: String, required: true },
  evaluatorPosition: { type: String, required: true },
  evaluatorDocument: { type: Number, required: true },
  comment: String,
  topics: {
    communication: {
      name: { type: String, default: "Habilidad de comunicación" },
      value: { type: Number, required: true },
    },
    teamWork: {
      name: { type: String, default: "Trabajo en equipo" },
      value: { type: Number, required: true },
    },
    problemSolving: {
      name: { type: String, default: "Resolución de problemas" },
      value: { type: Number, required: true },
    },
    productivity: {
      name: { type: String, default: "Productividad laboral" },
      value: { type: Number, required: true },
    },
    punctuality: {
      name: { type: String, default: "Puntualidad" },
      value: { type: Number, required: true },
    },
    quality: {
      name: { type: String, default: "Calidad de trabajo" },
      value: { type: Number, required: true },
    },
  },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
