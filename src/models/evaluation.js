"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let EvaluationSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Empleooye",
    required: true,
  },
  date: String,
  dateOrder: Number,
  evaluatorName: String,
  evaluatorPosition: String,
  evaluatorDocument: Number,
  comment: String,
  topics: {
    communication: {
      name: { type: String, default: "Habilidad de comunicación" },
      value: Number,
    },
    teamWork: {
      name: { type: String, default: "Trabajo en equipo" },
      value: Number,
    },
    problemSolving: {
      name: { type: String, default: "Resolución de problemas" },
      value: Number,
    },
    productivity: {
      name: { type: String, default: "Productividad laboral" },
      value: Number,
    },
    punctuality: {
      name: { type: String, default: "Puntualidad" },
      value: Number,
    },
    quality: {
      name: { type: String, default: "Calidad de trabajo" },
      value: Number,
    },
  },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
