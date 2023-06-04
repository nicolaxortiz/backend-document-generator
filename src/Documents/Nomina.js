const Logo = __dirname + "/logo.png";
const Firma = __dirname + "/firma.png";
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

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const formattedDate = date.toLocaleDateString("es-ES", options);

const generatePDF = (res, nom) => {
  let movimientos = [
    [
      {
        text: "Concepto",
        style: "header",
      },
      { text: "Devengos", style: "header" },
      {
        text: "Deducciones",
        style: "header",
      },
    ],
  ];

  let totalDevengos = 0;

  let totalDeducciones = 0;

  Object.keys(nom.moves).forEach((key) => {
    const move = nom.moves[key];
    movimientos.push([
      { text: move.name, style: "cell" },
      {
        text: move.isProfit ? "$ " + move.value.toLocaleString("es-ES") : "",
        style: "price",
      },
      {
        text: !move.isProfit ? "$ " + move.value.toLocaleString("es-ES") : "",
        style: "price",
      },
    ]);

    if (move.isProfit) {
      totalDevengos = totalDevengos + move.value;
    } else {
      totalDeducciones = totalDeducciones + move.value;
    }
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
          widths: ["*", "auto", "auto"],
          heights: 15,
          body: [
            [
              { text: "Datos del trabajador", colSpan: 3, style: "header" },
              { text: "" },
              { text: "" },
            ],
            [
              {
                text: `Nombre completo: ${nom.user_id.name} ${nom.user_id.lastName}`,
                colSpan: 2,
                style: "cell2",
              },
              { text: "", style: "cell2" },
              {
                text: `C.C: ${nom.user_id.document}`,
                style: "cell2",
              },
            ],
            [
              {
                text: `Cargo: ${nom.user_id.position}`,
                style: "cell2",
              },
              {
                text: `Tipo de contrato: ${nom.user_id.contract}`,
                style: "cell2",
              },
              {
                text: `Fecha de inicio: ${nom.user_id.startDate}`,
                style: "cell2",
              },
            ],
            [
              {
                text: `Fecha liquidación: ${nom.date}`,
                style: "cell2",
              },
              {
                text: "",
                style: "price",
              },
              {
                text: "",
                style: "cell2",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },

      //Valores de la nomina
      {
        table: {
          headerRows: 1,
          widths: [300, "*", "*"],
          heights: 20,
          body: movimientos,
        },
        margin: [0, 0, 0, 5],
      },

      //Totales
      {
        table: {
          headerRows: 1,
          widths: [300, "*", "*"],
          heights: 20,
          body: [
            [
              {
                text: `Totales`,
                style: "totalTitle",
              },
              {
                text: `$ ${totalDevengos.toLocaleString("es-ES")}`,
                style: "total",
              },
              {
                text: `$ ${totalDeducciones.toLocaleString("es-ES")}`,
                style: "total",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },

      {
        table: {
          headerRows: 1,
          widths: [300, "*", "*"],
          heights: 20,
          body: [
            [
              { text: "Total líquido a percibir", style: "totalTitle" },
              {
                text: `$ ${(totalDevengos - totalDeducciones).toLocaleString(
                  "es-ES"
                )}`,
                style: "total",
                colSpan: 2,
              },
              {
                text: "",
                style: "total",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },

      {
        text: `Este documento ha sido expedido a solicitud del trabajador a la fecha ${formattedDate}.`,
        margin: [0, 0, 0, 20],
      },
      { text: "Firmado por:", margin: [0, 0, 0, 20] },
      { image: Firma, fit: [150, 150] },
      { text: "_____________________", margin: [0, 0, 0, 10] },
      { text: company.owner },
      { text: "C.C: " + company.ownerDocument },
    ],

    //Estilos de las tablassss
    styles: {
      header: {
        bold: true,
        fontSize: 12,
        color: "black",
        fillColor: "#d1d1d1",
        alignment: "center",
        margin: [0, 5],
      },
      header2: {
        bold: true,
        fontSize: 12,
        color: "black",
        alignment: "center",
        margin: [0, 5],
      },
      cell: {
        fontSize: 11,
        margin: [5, 10],
        cellPadding: 5,
        borderBottom: 1,
        borderColor: "#CCCCCC",
      },
      cell2: {
        fontSize: 11,
        margin: [5, 5],
        cellPadding: 5,
        borderBottom: 1,
        borderColor: "#CCCCCC",
      },
      price: {
        fontSize: 11,
        margin: [5, 10],
        cellPadding: 5,
        borderBottom: 1,
        borderColor: "#CCCCCC",
        alignment: "right",
      },
      totalTitle: {
        fontSize: 11,
        margin: [5, 10],
        cellPadding: 5,
        borderBottom: 1,
        borderColor: "#CCCCCC",
        alignment: "right",
      },
      total: {
        fontSize: 11,
        margin: [5, 10],
        cellPadding: 5,
        borderBottom: 1,
        borderColor: "#CCCCCC",
        fillColor: "#d1d1d1",
        alignment: "right",
      },
    },
    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = generatePDF;
