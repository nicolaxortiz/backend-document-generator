"use strict";

const Payroll = require("../models/payroll");
const NominaLab = require("../Documents/Nomina");

//metodos
const controller = {
  //metodo para guardar una nomina
  save: (req, res) => {
    const { user_id, date, moves } = req.body;

    const parts = date.split("/");
    const fecha = new Date(parts[2], parts[1] - 1, parts[0]);

    const dateOrder = Date.parse(fecha);

    const payroll = new Payroll({ user_id, date, dateOrder, moves });

    payroll.save((err, payrollSaved) => {
      if (err || !payrollSaved) {
        res.status(404).send({
          status: "error",
          message: "La nomina no pudo ser guardada",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "La nomina ha sido registrada",
      });
    });
  },

  //metodo para obtener todas las nominas
  getPayrolls: (req, res) => {
    let query = Payroll.find({})
      .sort({ dateOrder: "desc" })
      .populate("user_id")
      .then((nom) => {
        if (!nom) {
          return res.status(404).send({
            status: "error",
            message: "No se encontraron las nóminas",
          });
        }
        return res.status(200).send({
          status: "success",
          nom,
        });
      })
      .catch((err) => {
        console.error("Error al obtener las nomins:", err);
        return res.status(500).send({
          status: "error",
          message: "Error al obtener las nominas " + err,
        });
      });
  },

  //metodo para generar la nomina
  getPayrollByEmpleoyeeId: (req, res) => {
    let EmpleooyeId = req.params.id;

    Payroll.findOne({ user_id: EmpleooyeId })
      .sort({ dateOrder: "desc" })
      .limit(1)
      .populate("user_id")
      .then((nom) => {
        if (!nom) {
          return res.status(404).send({
            status: "error",
            message: "No se encontró la nómina",
          });
        }
        //envio de la response a la funcion para generar la nomina
        NominaLab(res, nom);
      })
      .catch((err) => {
        console.error("Error al obtener la nomina más reciente:", err);
        return res.status(500).send({
          status: "error",
          message: "Error al obtener la nómina: " + err,
        });
      });
  },

  //metodo para editar una nomina
  update: (req, res) => {
    let PayrollId = req.params.id;
    let update = req.body;

    const parts = update.date.split("/");
    const fecha = new Date(parts[2], parts[1] - 1, parts[0]);

    const dateOrder = Date.parse(fecha);

    update.dateOrder = dateOrder;

    Payroll.findByIdAndUpdate(
      PayrollId,
      update,
      { new: true },
      (err, payrollUpdate) => {
        if (err || !payrollUpdate) {
          return res.status(404).send({
            status: "error",
            message: "No se pudo actualizar la nomina",
          });
        }

        return res.status(200).send({
          status: "success",
          message: "La nomina ha sido actualizada",
          nomina: payrollUpdate,
        });
      }
    );
  },

  //metodo para eliminar una nomina
  delete: (req, res) => {
    let PayrollId = req.params.id;

    Payroll.findOneAndDelete({ _id: PayrollId }, (err, payroll) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar la nomina",
        });
      }

      if (!payroll) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna nomina",
        });
      }

      return res.status(200).send({
        status: "success",
        payroll,
      });
    });
  },
};

module.exports = controller;
