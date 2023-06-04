const PDFDocument = require("pdfkit");
const NumeroALetras = require("../Documents/PriceConvert");
const company = require("./CompanyInfo");

const date = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const formattedDate = date.toLocaleDateString("es-ES", options);

const generatePDF = (res, e) => {
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.image(__dirname + "/logo.png", {
    fit: [150, 150],
    align: "left",
    valign: "top",
  });
  doc.moveDown(4);

  doc.fontSize(20);

  doc.text("CERTIFICADO LABORAL", { align: "center", bold: true });
  doc.moveDown(2);

  doc.fontSize(14);
  doc.text(
    `Por medio de la presente se hace constar que ${e.name} ${
      e.lastName
    } identificado con cedula de ciudadanía No. ${e.document}, ${
      e.endDate === "" ? "labora" : "trabajó"
    } en nuestra empresa desde el día ${e.startDate} hasta ${
      e.endDate === "" ? "la fecha" : "el dia " + e.endDate
    }, desempeñando el cargo de ${e.position}, con contrato ${
      e.contract
    }, con un salario mensual de ${NumeroALetras(e.salary)} ($${e.salary}).`,
    {
      align: "left",
    }
  );

  doc.moveDown(1);
  doc.text(
    `El presente certificado se expide en solicitud del interesado a la fecha ${formattedDate}.`,
    {
      align: "left",
    }
  );

  doc.moveDown(1);
  doc.text("Atentamente,", {
    align: "left",
  });

  doc.moveDown(3);
  doc.image(__dirname + "/firma.png", {
    fit: [150, 150],
    align: "left",
    valign: "top",
  });
  doc.text("_________________", {
    align: "left",
  });
  doc.text(company.name, {
    align: "left",
  });
  doc.text(company.owner, {
    align: "left",
  });
  doc.text(company.address, {
    align: "left",
  });
  doc.text(company.city, {
    align: "left",
  });
  doc.text(company.country, {
    align: "left",
  });

  doc.end();
};

module.exports = generatePDF;
