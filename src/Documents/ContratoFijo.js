const Logo = __dirname + "/logo.png";
const Firma = __dirname + "/firma.png";
const PdfPrinter = require("pdfmake/src/printer");
const NumerosALetras = require("./PriceConvert");
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

const generatePDF = (res, empl) => {
  const docDefinition = {
    pageSize: "letter",
    watermark: {
      text: "Not original",
      opacity: 0.1,
      bold: true,
      italics: false,
      fontSize: 150,
    },
    content: [
      {
        image: Logo,
        fit: [150, 150],
        margin: [0, 0, 0, 20],
      },
      {
        text: `CONTRATO DE TRABAJO ENTRE ${company.name} Y ${(
          empl.name +
          " " +
          empl.lastName
        ).toUpperCase()}`,
        style: "title",
        margin: [0, 0, 0, 20],
      },
      {
        text: `Entre las partes, por un lado ${
          company.owner
        }, domiciliado en la ciudad de ${
          company.city
        }, representante legal de ${company.name}, con NIT ${
          company.NIT
        }, quien en adelante y para los efectos del presente contrato se denomina como EL EMPLEADOR, y por el otro, ${
          empl.name + " " + empl.lastName
        }, domiciliado en la ciudad de ${
          empl.city
        }, quien en adelante y para los efectos del presente contrato se denomina como EL TRABAJADOR, ambos mayores de edad, identificados como aparece al pie de las firmas, hemos acordado suscribir este contrato de trabajo, el cual se regirá por las siguientes cláusulas:`,
        margin: [0, 0, 0, 10],
      },
      {
        text: [
          { text: "Artículo 1.", style: "boldText" },
          {
            text: ` Naturaleza y Objeto. Se trata de un contrato de trabajo a término indefinido, en vigencia del cual el EMPLEADOR contrata al TRABAJADOR para que este, de forma personal, dirija su capacidad de trabajo en aras de la prestación de servicios y desempeño de las actividades propias del cargo de ${empl.position}, y como contraprestación el EMPLEADOR pagará una remuneración. `,
          },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        text: [
          { text: "Artículo 2.", style: "boldText" },
          {
            text: " Obligaciones de las partes",
          },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        text: "1. Del EMPLEADOR",
        style: "sangriaText",
      },
      {
        text: "a) Pagar en la forma pactada el monto equivalente a la remuneración.",
        style: "listText",
      },
      {
        text: "b) Realizar la afiliación y correspondiente aporte a parafiscales.",
        style: "listText",
      },
      {
        text: "c) Dotar al TRABAJADOR de los elementos de trabajo necesarios para el correcto desempeño de la gestión contratada.",
        style: "listText",
      },
      {
        text: "d) Las obligaciones especiales enunciadas en los artículos 56 y 57 del Código Sustantivo del Trabajo.",
        style: "listText",
        margin: [35, 0, 0, 20],
      },

      {
        text: "1. Del TRABAJADOR",
        style: "sangriaText",
      },
      {
        text: "a) Cumplir a cabalidad con el objeto del contrato, en la forma convenida. ",
        style: "listText",
      },
      {
        text: "b) Las obligaciones especiales enunciadas en los artículos 56 y 58 del Código Sustantivo del Trabajo. ",
        style: "listText",
        margin: [35, 0, 0, 20],
      },

      {
        text: [
          { text: "Artículo 3.", style: "boldText" },
          {
            text: ` Lugar de prestación del servicio. El TRABAJADOR prestará sus servicios de forma personal, en la ${company.address}; dirección que corresponde al domicilio de la empresa. `,
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 4.", style: "boldText" },
          {
            text: " Jornada de trabajo. La jornada de trabajo será de: lunes a viernes en el horario de 8:00am a 5:00pm.",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 5.", style: "boldText" },
          {
            text: ` Remuneración. El EMPLEADOR deberá pagar al TRABAJADOR, a título de remuneración por las actividades, un monto de ${NumerosALetras(
              empl.salary
            ).toLowerCase()} ($ ${empl.salary.toLocaleString("es-ES")}).`,
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 6.", style: "boldText" },
          {
            text: " Forma de pago. La forma de pago del salario señalado en la cláusula anterior, será así: mensual. El pago se hará por consignacion a la cuenta bancaria con numero: ",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 7.", style: "boldText" },
          {
            text: ` Duración del contrato. El presente contrato será vigente hasta la fecha: ${empl.endContract}, dicha duracion es prorrogable de forma automática por un término igual al inicialmente pactado. `,
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 8.", style: "boldText" },
          {
            text: " Preaviso. La parte que desee terminar el contrato, así deberá notificarlo por escrito dentro de los 30 días anteriores al vencimiento del término de duración.",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 9.", style: "boldText" },
          {
            text: " Terminación unilateral del contrato. El presente contrato se podrá terminar unilateralmente y sin indemnización alguna, por cualquiera de las partes, siempre y cuando se configure algunas de las situaciones previstas en el artículo 62 del Código Sustantivo del Trabajo o haya incumplimiento grave de alguna cláusula prevista en el contrato de trabajo. Se considera incumplimiento grave el desconocimiento de las obligaciones o prohibiciones previstas en el contrato.",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 10.", style: "boldText" },
          {
            text: ` Domicilio de las partes. Para todos los efectos legales y convencionales, el domicilio de las partes es: el EMPLEADOR: la ciudad de ${
              company.ownerCity
            }, en la dirección ${
              company.ownerAddress
            }; y el TRABAJADOR, la ciudad de ${
              empl.city + ", " + empl.region
            }, en la dirección ${empl.address}.`,
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: "Artículo 11.", style: "boldText" },
          {
            text: " Integridad. El presente contrato, remplaza en su integridad y deja sin efecto cualquier acuerdo de voluntades que sea haya pactado con anterioridad a la suscripción del mismo.",
          },
        ],
        margin: [0, 0, 0, 20],
      },

      {
        text: [
          {
            text: `En señal de conformidad, las partes suscriben el presente contrato, en dos ejemplares del mismo tenor, el día ${empl.starDate}, en 2 folios.`,
          },
        ],
        margin: [0, 0, 0, 40],
      },

      {
        columns: [
          {
            width: "*",
            text: "EL EMPLEADOR,",
            style: "boldText",
          },
          {
            width: "*",
            text: "EL TRABAJADOR,",
            style: "boldText",
          },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 10],
      },

      {
        columns: [
          {
            width: "*",
            image: Firma,
            fit: [150, 150],
          },
          {
            width: "*",
            text: "",
          },
        ],
        columnGap: 10,
      },

      {
        columns: [
          {
            width: "*",
            text: "______________________",
          },
          {
            width: "*",
            text: "______________________",
          },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 5],
      },
      {
        columns: [
          {
            width: "*",
            text: company.owner,
          },
          {
            width: "*",
            text: empl.name + " " + empl.lastName,
          },
        ],

        columnGap: 10,
      },
      {
        columns: [
          {
            width: "*",
            text: "C.C: " + company.ownerDocument,
          },
          {
            width: "*",
            text: "C.C: " + empl.document,
          },
        ],
        columnGap: 10,
      },
    ],

    //Estilos
    styles: {
      title: {
        alignment: "center",
        bold: true,
      },
      boldText: {
        bold: true,
      },
      sangriaText: {
        margin: [20, 0, 0, 15],
      },
      listText: {
        margin: [35, 0, 0, 0],
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
