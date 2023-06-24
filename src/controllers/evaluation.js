"use strict";

const Evaluation = require("../models/evaluation");
const EvaDesem = require("../Documents/EvaluacionDesempeno");

//metodos
const controller = {
  //metodo para guardar una evaluacion de deseñempeño
  save: (req, res) => {
    const {
      user_id,
      date,
      evaluatorName,
      evaluatorPosition,
      evaluatorDocument,
      comment,
      topics,
    } = req.body;

    const parts = date.split("/");
    const fecha = new Date(parts[2], parts[1] - 1, parts[0]);

    const dateOrder = Date.parse(fecha);

    const evaluation = new Evaluation({
      user_id,
      date,
      dateOrder,
      evaluatorName,
      evaluatorPosition,
      evaluatorDocument,
      comment,
      topics,
    });

    evaluation.save((err, evaluationSaved) => {
      if (err || !evaluationSaved) {
        res.status(404).send({
          status: "error",
          message: "La evaluacion no pudo ser guardada:" + err,
        });
      }

      return res.status(200).send({
        status: "success",
        message: "La evaluacion ha sido registrada",
      });
    });
  },

  //metodo para obtener todas las evaluaciones
  getAll: (req, res) => {
    let query = Evaluation.find({})
      .sort({ dateOrder: "desc" })
      .populate("user_id")
      .then((eva) => {
        if (!eva) {
          return res.status(404).send({
            status: "error" + err,
            message: "No se encontraron evaluaciones para listar",
          });
        }
        return res.status(200).send({
          status: "success",
          eva,
        });
      })
      .catch((err) => {
        console.error("Error al obtener las nomins:", err);
        return res.status(500).send({
          status: "error",
          message: "No se han podido listar las evaluaciones",
        });
      });
  },

  //metodo para editar una evaluacion
  update: (req, res) => {
    let evaluationId = req.params.id;
    let update = req.body;

    const parts = update.date.split("/");
    const fecha = new Date(parts[2], parts[1] - 1, parts[0]);

    const dateOrder = Date.parse(fecha);

    update.dateOrder = dateOrder;

    Evaluation.findByIdAndUpdate(
      evaluationId,
      update,
      { new: true },
      (err, evaluationUpdate) => {
        if (err || !evaluationUpdate) {
          return res.status(404).send({
            status: "error",
            message: "No se pudo actualizar la evaluacion",
          });
        }

        return res.status(200).send({
          status: "success",
          message: "La evaluacion ha sido actualizada",
          nomina: evaluationUpdate,
        });
      }
    );
  },

  //metodo para eliminar una evaluacion
  delete: (req, res) => {
    let evaluationId = req.params.id;

    Evaluation.findOneAndDelete({ _id: evaluationId }, (err, evaluation) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar la evaluacion",
        });
      }

      if (!evaluation) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna evaluacion",
        });
      }

      return res.status(200).send({
        status: "success",
        evaluation,
      });
    });
  },

  //metodo para generar evaluacion de desempeño
  getEvaluation: (req, res) => {
    let EmpleooyeId = req.params.id;

    Evaluation.findOne({ user_id: EmpleooyeId })
      .sort({ dateOrder: "desc" })
      .limit(1)
      .populate("user_id")
      .then((eva) => {
        if (!eva) {
          return res.status(404).send({
            status: "error",
            message: "No se encontró la evaluacion",
          });
        }
        //envio de la response y la data a la funcion para generar la evaluacion
        EvaDesem(res, eva);
      })
      .catch((err) => {
        return res.status(500).send({
          status: "error",
          message: "Error al obtener la evaluacion: " + err,
        });
      });
  },
};

module.exports = controller;
