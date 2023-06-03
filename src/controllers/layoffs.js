"use strict";

const Layoffs = require("../models/layoffs");
const LayoffDocument = require("../Documents/Pazysalvo");
const Nominas = require("../models/payroll");

//metodos
const controller = {
  //metodo para guardar cesantias
  save: (req, res) => {
    const { user_id, isSaved, startDate, quantity } = req.body;

    const parts = startDate.split("/");
    const fecha = new Date(parts[2], parts[1] - 1, parts[0]);
    const dateOrder = Date.parse(fecha);

    const layoffs = new Layoffs({
      user_id,
      isSaved,
      startDate,
      dateOrder,
      quantity,
    });

    layoffs.save((err, layoffsSave) => {
      if (err || !layoffsSave) {
        res.status(500).send({
          status: "error",
          message: "La cesantia no pudo ser guardada",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "La cesantia ha sido registrada",
      });
    });
  },

  getAll: (req, res) => {
    let query = Layoffs.find({})
      .sort({ dateOrder: "desc" })
      .populate("user_id")
      .then((ces) => {
        if (!ces) {
          return res.status(404).send({
            status: "error",
            message: "No se encontraron cesantias",
          });
        }
        return res.status(200).send({
          status: "success",
          ces,
        });
      })
      .catch((err) => {
        console.error("Error al obtener las cesantias: ", err);
        return res.status(500).send({
          status: "error",
          message: "Error al obtener las cesantias: " + err,
        });
      });
  },

  //Metodo para obtener las cesantias mediante el id de un empleado
  getByEmployeeId: (req, res) => {
    let EmployeeId = req.params.id;

    Layoffs.findOne({ user_id: EmployeeId })
      .sort({ dateOrder: "desc" })
      .limit(1)
      .populate("user_id")
      .then((ces) => {
        if (!ces) {
          return res.status(404).send({
            status: "error",
            message: "No se encontró la cesantia",
          });
        }
        return res.status(200).send({
          status: "succes",
          ces,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          status: "error",
          message: "Error al obtener la cesantia: " + err,
        });
      });
  },

  //metodo para editar una cesantia
  update: (req, res) => {
    let layoffsId = req.params.id;
    let update = req.body;

    const parts = update.startDate.split("/");
    const fecha = new Date(parts[2], parts[1] - 1, parts[0]);

    const dateOrder = Date.parse(fecha);

    update.dateOrder = dateOrder;

    Layoffs.findByIdAndUpdate(
      layoffsId,
      update,
      { new: true },
      (err, layoffsUpdate) => {
        if (err || !layoffsUpdate) {
          return res.status(404).send({
            status: "error",
            message: "No se pudo actualizar la cesantia",
          });
        }

        return res.status(200).send({
          status: "success",
          message: "La cesantia ha sido actualizada",
          ces: layoffsUpdate,
        });
      }
    );
  },

  //metodo para eliminar una cesantia
  delete: (req, res) => {
    let layoffsId = req.params.id;

    Layoffs.findOneAndDelete({ _id: layoffsId }, (err, layoffs) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar la cesantia",
        });
      }

      if (!layoffs) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna cesantia",
        });
      }

      return res.status(200).send({
        status: "success",
        layoffs,
      });
    });
  },

  //metodo para generar Paz y salvos
  getLayoffsDocument: (req, res) => {
    let EmpleooyeId = req.params.id;

    Layoffs.find({ user_id: EmpleooyeId })
      .sort({ dateOrder: "desc" })
      .populate("user_id")
      .then((ces) => {
        if (!ces) {
          return res.status(404).send({
            status: "error",
            message: "No se encontraron cesantias",
          });
        }

        //Busqueda de las nominas
        let query = Nominas.find({ user_id: EmpleooyeId })
          .sort({ dateOrder: "desc" })
          .populate("user_id")
          .then((nom) => {
            if (!nom) {
              return res.status(404).send({
                status: "error",
                message: "No se encontraron las nóminas",
              });
            }
            LayoffDocument(res, ces, nom);
          })
          .catch((err) => {
            return res.status(500).send({
              status: "error",
              message: "Error al obtener las nominas " + err,
            });
          });
      })
      .catch((err) => {
        console.error("Error al obtener las cesantias: ", err);
        return res.status(500).send({
          status: "error",
          message: "Error al obtener las cesantias: " + err,
        });
      });
  },
};

module.exports = controller;
