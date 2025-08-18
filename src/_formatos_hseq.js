import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import QRCode from 'qrcode'

const pesoytalla = data => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20,
    };

    let registros = data.registros.map((reg, i) => [
      i + 1,
      reg.fecha_rep,
      "0",
      data.cargo,
      reg.peso_rep.trim(),
      reg.estatura_rep,
      reg.tension_rep,
      reg.fcardiaca_rep.trim(),
      parseInt(reg.ejercicio_rep) > 0 ? "SI" : "NO",
      reg.ejercicio_rep.trim(),
    ]);
    


    var dd = {
      defaultStyle: {
        fontSize: 9,
      },
      styles: {
        headers: {
          bold: true,
          alignment: "center",
          fontSize: 8

        },
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageMargins: [margin.left, 124, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return {
          fontSize: 10,
          margin: [margin.left, 40, margin.right, 40],
          
          table: {
            widths: ["30%", "*"],
            body: [
              [
                {
                  alignment: "center",
                  image: data.logo,
                  fit: [110, 110],

                },
                {
                  alignment: "right",
                  stack: [
                    { text: "CONTROL DE PESO Y TENSION ARTERIAL", bold: true, fontSize: 14 },
                    { columns: ["FO-HSEQ-35", `28-07-2023-01`] }
                  ]
                }
              ]
            ]
          }
        };
      },

      content: [
        {
          margin: [0, -2, 0, 0],
          table: {
            widths: ["55%", "*"],
            body: [
              [{ text: `NOMBRE:${data.nombre}`, rowSpan: 2 }, "META DE PESO"],
              ["", "TOTAL PESO A PERDER"],
            ]
          }
        },
        {

          layout: {
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },

          },
          table: {
            widths: ["auto", "10%", "7%", "*", "8%", "10%", "9%", "10%", "9%", "9%"],
            body: [
              [{ text: "INFORMACION PERSONAL BÁSICA", colSpan: 4, style: "boldcenter" }, "", "", "", { text: "TAMIZAJE", colSpan: 6, style: "boldcenter" }, "", "", "", "", ""],
              [
                { text: "ITEM", style: "headers" },
                { text: "FECHA", style: "headers" },
                { text: "EDAD", style: "headers" },
                { text: "CARGO", style: "headers" },
                { text: "PESO", style: "headers" },
                { text: "ESTATURA", style: "headers" },
                { text: "TENSION ARTERIAL", style: "headers" },
                { text: "FRECUENCIA CARDIACA", style: "headers" },
                { text: "HACE EJERCICIO SI/NO", style: "headers" },
                { text: "SI HACE EJERCICIO No. VECES SEMANA", style: "headers" },
              ],
              ...registros
            ]
          }
        },
        {
          margin: [0,20,0,0],
          stack: [
            {text: "GRÁFICOS", style: "boldcenter", fontSize: 11},
            {
              margin: [0,10,0,0],
              alignment: "center",
              image: data.chartImage,

            },
          ]
        }
      ]
    }


    pdfMake.createPdf(dd).open();
    res();
  })
};


export {
  pesoytalla,
};

