const Logo = "D:/Dev/proyecto-grado/backend/src/img/logo.png";
const Firma = "D:/Dev/proyecto-grado/backend/src/img/firma.png";
const PdfPrinter = require("pdfmake/src/printer");
const company = require("./CompanyInfo");

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

const date = new Date();
const day = date.getDate().toString().padStart(2, "0");
const month = (date.getMonth() + 1).toString().padStart(2, "0");
const year = date.getFullYear().toString();

const currentDate = `${day}/${month}/${year}`;

const generatePDF = (res, eva) => {
  let caracteristicas = [
    [
      { text: "Evaluación de desempeño", colSpan: 6, style: "title" },
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "" },
    ],
    [
      { text: "Calidad", style: "left" },
      { text: "1", style: "center" },
      { text: "2", style: "center" },
      { text: "3", style: "center" },
      { text: "4", style: "center" },
      { text: "5", style: "center" },
    ],
  ];

  Object.keys(eva.topics).forEach((key) => {
    const topic = eva.topics[key];
    caracteristicas.push([
      { text: topic.name, style: "cell" },
      { text: topic.value == 1 ? "X" : "", style: "cell" },
      { text: topic.value == 2 ? "X" : "", style: "cell" },
      { text: topic.value == 3 ? "X" : "", style: "cell" },
      { text: topic.value == 4 ? "X" : "", style: "cell" },
      { text: topic.value == 5 ? "X" : "", style: "cell" },
    ]);
  });

  const docDefinition = {
    pageSize: "A4",
    content: [
      //imagen logo
      {
        image: Logo,
        fit: [150, 150],
        margin: [0, 0, 0, 20],
      },
      //Tablas encabezadas de informacion
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "*"],
          heights: 15,
          body: [
            [
              {
                text: `Nombre del 
                empleado`,
                style: "header",
              },
              {
                text: eva.user_id.name + " " + eva.user_id.lastName,
                style: "left2",
              },
              {
                text: `Nombre del 
                evaluador`,
                style: "header",
              },
              { text: eva.evaluatorName, style: "left2" },
            ],
            [
              {
                text: `C.C del
                empleado`,
                style: "header",
              },
              { text: eva.user_id.document, style: "left2" },
              {
                text: `C.C del
                evaluador`,
                style: "header",
              },
              { text: eva.evaluatorDocument, style: "left2" },
            ],
            [
              {
                text: `Cargo del
                empleado`,
                style: "header",
              },
              { text: eva.user_id.position, style: "left2" },
              {
                text: `Cargo del
                evaluador`,
                style: "header",
              },
              { text: eva.evaluatorPosition, style: "left2" },
            ],
          ],
        },
        margin: [0, 0, 0, 3],
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "*"],
          heights: 15,
          body: [
            [
              {
                text: `Fecha de la evaluación`,
                style: "header",
              },
              { text: eva.date, style: "left2" },
              {
                text: `Fecha de expedición`,
                style: "header",
              },
              { text: currentDate, style: "left2" },
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto", "auto", "auto"],
          heights: 15,
          body: caracteristicas,
        },
        margin: [0, 0, 0, 20],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 15,
          body: [
            [{ text: "Comentarios del evaluador", style: "title" }],
            [{ text: eva.comment, style: "left2" }],
          ],
        },
        margin: [0, 0, 0, 20],
      },

      { text: "Revisado y firmado por:", margin: [0, 0, 0, 20] },
      { image: Firma, fit: [150, 150] },
      { text: "_____________________", margin: [0, 0, 0, 10] },
      { text: company.owner },
      { text: "C.C: " + company.ownerDocument },
    ],

    //Estilos de las tablassss
    styles: {
      header: {
        fillColor: "#C4D7FF",
        margin: [0, 2],
        lineHeight: 1,
      },
      title: {
        fillColor: "#324768",
        color: "white",
        bold: true,
        fontSize: 14,
        alignment: "center",
        margin: [0, 5, 0, 2],
      },
      center: {
        alignment: "center",
        margin: [0, 3],
        bold: true,
      },
      left: {
        margin: [5, 3],
        bold: true,
      },
      center2: {
        alignment: "center",
        margin: [0, 3],
      },
      left2: {
        margin: [5, 3],
      },
    },
    defaultStyle: {
      font: "Helvetica",
      fontSize: 12,
      lineHeight: 1.3,
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = generatePDF;
