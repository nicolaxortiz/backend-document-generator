"use strict";

require("dotenv").config();
const CertLab = require("../Documents/CertificadoLaboral");
const ContIndef = require("../Documents/ContratoIndefinido");
const ContFijo = require("../Documents/ContratoFijo");
const Empleoyee = require("../models/employee");
const Layoffs = require("../models/layoffs");
const Payrolls = require("../models/payroll");
const Evaluations = require("../models/evaluation");
const encryptPass = require("../functions/encrypt");
const compare = require("../functions/compare");
const nodemailer = require("nodemailer");
const generatePassword = require("generate-password");

//Configuracion del correo
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "empresaejemplo01@outlook.com",
    pass: "EmpresaEmpresa0101",
  },
});

//metodos de ruta
const controller = {
  //Metodo para guardar los empleados
  save: async (req, res) => {
    let params = req.body;

    let empleoyee = new Empleoyee();

    empleoyee.name = params.name;
    empleoyee.lastName = params.lastName;
    empleoyee.document = params.document;
    empleoyee.birthDate = params.birthDate;
    empleoyee.address = params.address;
    empleoyee.country = params.country;
    empleoyee.region = params.region;
    empleoyee.city = params.city;
    empleoyee.position = params.position;
    empleoyee.startDate = params.startDate;
    empleoyee.endDate = params.endDate;
    empleoyee.contract = params.contract;
    empleoyee.endContract = params.endContract;
    empleoyee.salary = params.salary;
    empleoyee.isWorking = params.isWorking;
    empleoyee.email = params.email;
    empleoyee.password = await encryptPass("" + params.document);

    //guardar el empleado
    empleoyee.save((err, sav) => {
      if (err || !sav) {
        return res.status(404).send({
          status: "error",
          message: "El empleado no pudo ser guardado",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "El empleado ha sido registrado",
      });
    });
  },

  //Metodo para listar los empleados
  getEmpleoyees: (req, res) => {
    let query = Empleoyee.find({});

    query.sort("-startDate").exec((err, emp) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido listar los empleados",
        });
      }

      if (!emp) {
        return res.status(404).send({
          status: "error" + err,
          message: "No se encontraron empleados para listar",
        });
      }

      return res.status(200).send({
        status: "success",
        emp,
      });
    });
  },

  //Metodo para listar un solo empleado por id
  getEmpleoyeeById: (req, res) => {
    let EmpleooyeId = req.params.id;

    Empleoyee.findOne({ _id: EmpleooyeId }, (err, empleoyee) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido listar el empleado",
        });
      }

      if (!empleoyee) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun empleado",
        });
      }

      return res.status(200).send({
        status: "success",
        empleoyee,
      });
    });
  },

  //Metodo para buscar contraseña y correo de un empleado
  getCredentialsEmpleoyee: (req, res) => {
    let { email, password } = req.body;

    if (
      email == process.env.USER_ADMIN &&
      password == process.env.PASSWORD_ADMIN
    ) {
      return res.status(200).send({
        status: "success",
        empleoyee: { name: "Administrador", position: "admin" },
      });
    }

    Empleoyee.findOne({ email }, async (err, empleoyee) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se ha podido encontrar al empleado",
        });
      }

      if (!empleoyee) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún empleado con ese correo y contraseña",
        });
      }

      let verification = compare(password, empleoyee.password);

      try {
        verification = await compare(password, empleoyee.password);
      } catch (error) {
        // Manejo del error en caso de que ocurra algún problema con la comparación
        return res.status(500).send({
          status: "error",
          message: "Error al comparar las contraseñas",
        });
      }

      if (verification) {
        // La contraseña es válida
        return res.status(200).send({
          status: "success",
          empleoyee,
        });
      } else {
        // La contraseña es inválida
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún empleado con ese correo y contraseña",
        });
      }
    });
  },

  //metodo para obtener un empleado por documento de indentidad (Recordatorio de contraseña)
  getEmpleoyeeByDocument: (req, res) => {
    let { document, birthDate, email } = req.body;

    Empleoyee.findOne(
      { document: document, birthDate: birthDate, email: email },
      async (err, empleoyee) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "No se han podido listar el empleado",
          });
        }

        if (!empleoyee) {
          return res.status(404).send({
            status: "error",
            message: "No se encontro ningun empleado",
          });
        }

        const randomPassword = generatePassword.generate({
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          excludeSimilarCharacters: true,
        });

        const newPassword = await encryptPass(randomPassword);

        Empleoyee.updateOne(
          { user_id: empleoyee?._id },
          { password: newPassword },
          (err, empl) => {
            if (err) {
              return res.status(500).send({
                status: "error",
                message: "No se ha podido enviar la nueva contraseña",
              });
            }

            if (!empleoyee) {
              return res.status(404).send({
                status: "error",
                message: "No se encontro ningun empleado",
              });
            }

            const enviarCorreo = async () => {
              try {
                // Configura los detalles del correo electrónico
                const opcionesCorreo = {
                  from: "empresaejemplo01@outlook.com",
                  to: empleoyee?.email,
                  subject:
                    "Recordatorio de la contraseña - Software Empresarial",
                  text: `Estimado usuario, su nueva contraseña es: ${randomPassword}
                \nLe recordamos que ingrese a la plataforma y cambie su contraseña para mantener su seguridad. \nEste mensaje ha sido enviado a peticion del usuario.`,
                };

                // Envía el correo electrónico
                const info = await transporter.sendMail(opcionesCorreo);
                return res.status(200).send({
                  status: "success",
                  message: "Correo electronico enviado",
                });
              } catch (error) {
                return res.status(500).send({
                  status: "error",
                  message: "No se pudo enviar el correo electronico",
                });
              }
            };

            enviarCorreo();
          }
        );
      }
    );
  },

  //Metodo para eliminar un empleado
  delete: (req, res) => {
    let EmpleooyeId = req.params.id;

    Evaluations.deleteMany({ user_id: EmpleooyeId }, (err, eva) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar las evaluaciones",
        });
      }

      if (!eva) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna evaluacion del empleado",
        });
      }
    });

    Layoffs.deleteMany({ user_id: EmpleooyeId }, (err, lay) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar los paz y salvos",
        });
      }

      if (!lay) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun paz y salvo para eliminar",
        });
      }
    });

    Payrolls.deleteMany({ user_id: EmpleooyeId }, (err, pay) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar las nominas",
        });
      }

      if (!pay) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna nomina para eliminar",
        });
      }
    });

    Empleoyee.findOneAndDelete({ _id: EmpleooyeId }, (err, empleoyee) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido eliminar el empleado",
        });
      }

      if (!empleoyee) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun empleado",
        });
      }

      return res.status(200).send({
        status: "success",
        empleoyee,
      });
    });
  },

  //Metodo para editar un empleado
  update: (req, res) => {
    let empleadoId = req.params.id;
    let update = req.body;

    Empleoyee.findByIdAndUpdate(
      empleadoId,
      update,
      { new: true },
      (err, empleadoUpdated) => {
        if (err || !empleadoUpdated) {
          return res.status(404).send({
            status: "error",
            message: "No se pudo actualizar el empleado",
          });
        }

        return res.status(200).send({
          status: "success",
          message: "El empleado ha sido actualizado",
          empleado: empleadoUpdated,
        });
      }
    );
  },

  //metodo para editar la contraseña de los empleados
  updatePassword: async (req, res) => {
    try {
      const empleadoId = req.params.id;
      const { oldPassword, newPassword, password } = req.body;

      let verification;

      try {
        verification = await compare(oldPassword, password);
      } catch (error) {
        // Manejo del error en caso de que ocurra algún problema con la comparación
        return res.status(500).send({
          status: "error",
          message: "Error al comparar las contraseñas",
        });
      }

      if (verification) {
        const firstPass = newPassword;
        const hashedPassword = await encryptPass(firstPass);
        let finalPassword = { password: hashedPassword };

        const empleadoUpdated = await Empleoyee.findByIdAndUpdate(
          empleadoId,
          finalPassword,
          {
            new: true,
          }
        );

        if (!empleadoUpdated) {
          return res.status(404).send({
            status: "error",
            message: "No se pudo actualizar el empleado",
          });
        }

        return res.status(200).send({
          status: "success",
          message: "El empleado ha sido actualizado",
          empleado: empleadoUpdated,
        });
      } else {
        // La contraseña es inválida
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún empleado con ese correo y contraseña",
        });
      }
    } catch (err) {
      console.error("Error al actualizar el empleado:", err);
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el empleado",
        error: err.message,
      });
    }
  },

  //metodo para generar el certificado laboral
  getCertificadoLaboral: (req, res) => {
    let EmpleoyeeId = req.params.id;
    Empleoyee.findById(EmpleoyeeId, (err, empl) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido listar el empleado",
        });
      }

      if (!empl) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun empleado",
        });
      }

      CertLab(res, empl);
    });
  },

  //metodo para generar contrato indefinido
  getContratoIndefinido: (req, res) => {
    const EmpleooyeId = req.params.id;
    Empleoyee.findById({ _id: EmpleooyeId }, (err, empleado) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido listar el empleado",
        });
      }

      if (!empleado) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun empleado",
        });
      }

      ContIndef(res, empleado);
    });
  },

  //metodo para generar contrato fijo
  getContratoFijo: (req, res) => {
    const EmpleooyeId = req.params.id;
    Empleoyee.findById({ _id: EmpleooyeId }, (err, empleado) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "No se han podido listar el empleado",
        });
      }

      if (!empleado) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun empleado",
        });
      }

      ContFijo(res, empleado);
    });
  },
};

module.exports = controller;
