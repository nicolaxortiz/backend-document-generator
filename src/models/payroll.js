"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PayrollSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Empleooye",
    required: true,
  },
  date: { type: String, required: true },
  dateOrder: Number,
  moves: {
    salary: {
      name: {
        type: String,
        default: "Salario base",
      },
      value: {
        type: Number,
        required: true,
      },
      isProfit: {
        type: Boolean,
        default: true,
      },
    },
    transportation: {
      name: {
        type: String,
        default: "Auxilio de transporte",
      },
      value: {
        type: Number,
        default: 0,
      },
      isProfit: {
        type: Boolean,
        default: true,
      },
    },
    commissions: {
      name: {
        type: String,
        default: "Comisiones",
      },
      value: {
        type: Number,
        default: 0,
      },
      isProfit: {
        type: Boolean,
        default: true,
      },
    },
    health: {
      name: {
        type: String,
        default: "Seguridad social",
      },
      value: {
        type: Number,
        required: true,
      },
      isProfit: {
        type: Boolean,
        default: false,
      },
    },
    pension: {
      name: {
        type: String,
        default: "Pensión",
      },
      value: {
        type: Number,
        required: true,
      },
      isProfit: {
        type: Boolean,
        default: false,
      },
    },
  },
});

module.exports = mongoose.model("Payroll", PayrollSchema);
