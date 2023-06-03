"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let LayoffsSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Empleooye",
    required: true,
  },
  isSaved: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  dateOrder: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Layoffs", LayoffsSchema);
