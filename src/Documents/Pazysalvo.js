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

const generatePDF = (res, ces, nom) => {
  let endDateEmpleado = "";
  let nombreEmpleado = "";
  let cedulaEmpleado = "";
  let salarioBase = 0;
  let sumaComisiones = 0;
  let sumaAuxilio = 0;
  let sumaSalarios = 0;
  nom.forEach((n) => {
    sumaComisiones = sumaComisiones + n.moves.commissions.value;
    sumaAuxilio = sumaAuxilio + n.moves.transportation.value;
    sumaSalarios = sumaSalarios + n.moves.salary.value;
    if (nombreEmpleado == "") {
      endDateEmpleado = n.user_id.endDate;
      nombreEmpleado = n.user_id.name + " " + n.user_id.lastName;
      cedulaEmpleado = n.user_id.document;
      salarioBase = n.user_id.salary;
    }
  });

  const endDateSplit = endDateEmpleado.split("/");

  const fecha = new Date();
  fecha.setMonth(endDateSplit[1] - 1); // Restamos 1 al número de mes ya que los meses en JavaScript se representan del 0 al 11

  const nombreMes = fecha.toLocaleString("es-ES", { month: "long" });

  let valorCesantias = 0;
  ces.forEach((c) => {
    if (c.isSaved === true) {
      valorCesantias = valorCesantias + c.quantity;
    }
  });

  let prima = (salarioBase * 180) / 360;

  let vacaciones = (salarioBase * 360) / 720;

  let sumaTotales =
    sumaSalarios +
    sumaComisiones +
    sumaAuxilio +
    valorCesantias +
    prima +
    vacaciones;

  const docDefinition = {
    pageSize: "A4",
    content: [
      //imagen logo
      {
        image: Logo,
        fit: [150, 150],
        margin: [0, 0, 0, 20],
      },
      //Texto informativo
      {
        text: `En la ciudad de ${company.city}, a los ${endDateSplit[0]} días del mes de ${nombreMes} del año ${endDateSplit[2]} se da por terminado el contrato de trabajo celebrado entre ${company.name} y ${nombreEmpleado}, identificado/a con la cédula de ciudadanía número ${cedulaEmpleado}. Razón por la cual se procede a la liquidación de prestaciones y conceptos monetarios derivados de la relacion laboral, en los siguientes términos:`,
        margin: [0, 0, 0, 20],
      },

      //Tabla de valores
      {
        table: {
          headerRows: 1,
          widths: ["*", "*"],
          heights: 20,
          body: [
            [
              {
                text: "Concepto",
                style: "header",
              },
              {
                text: "Valor cancelado",
                style: "header",
              },
            ],
            [
              {
                text: "Salarios",
                style: "cell",
              },
              {
                text: "$ " + sumaSalarios.toLocaleString("es-ES"),
                style: "price",
              },
            ],
            [
              {
                text: "Comisiones",
                style: "cell",
              },
              {
                text: "$ " + sumaComisiones.toLocaleString("es-ES"),
                style: "price",
              },
            ],
            [
              {
                text: "Auxilio de cesantías",
                style: "cell",
              },
              {
                text: "$ " + valorCesantias.toLocaleString("es-ES"),
                style: "price",
              },
            ],
            [
              {
                text: "Auxilio de transporte",
                style: "cell",
              },
              {
                text: "$ " + sumaAuxilio.toLocaleString("es-ES"),
                style: "price",
              },
            ],
            [
              {
                text: "Primas de servicio",
                style: "cell",
              },
              {
                text: "$ " + prima.toLocaleString("es-ES"),
                style: "price",
              },
            ],
            [
              {
                text: "Vacaciones",
                style: "cell",
              },
              {
                text: "$ " + vacaciones.toLocaleString("es-ES"),
                style: "price",
              },
            ],
            [
              {
                text: "Total",
                style: "cell",
              },
              {
                text: "$ " + sumaTotales.toLocaleString("es-ES"),
                style: "price",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },

      {
        text:
          "Con la firma del presente paz y salvo el trabajador afirma haber recibido a satisfacción" +
          " los valores aquí liquidados, y declara que el empleador no le adeuda ningún otro concepto y valor" +
          " relacionado con el contrato de trabajo del cual se declara su terminación.",
        margin: [0, 0, 0, 20],
      },
      { text: "Trabajador", margin: [0, 0, 0, 30] },
      { text: "_____________________  (Firma)", margin: [0, 0, 0, 20] },
      { text: "_____________________  (Nombre)", margin: [0, 0, 0, 20] },
      { text: "_____________________  (Cedula)", margin: [0, 0, 0, 10] },
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
        lineHeight: 1,
      },

      cell: {
        margin: [5, 3],
        cellPadding: 5,
        borderColor: "#CCCCCC",
      },
      price: {
        fontSize: 11,
        margin: [5, 3],
        cellPadding: 5,
        borderBottom: 1,
        borderColor: "#CCCCCC",
        alignment: "center",
        lineHeight: 1,
      },
    },
    defaultStyle: {
      font: "Helvetica",
      fontSize: 13,
      lineHeight: 1.3,
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = generatePDF;
