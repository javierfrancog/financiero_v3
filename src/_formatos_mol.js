import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import { cond, trim } from "lodash";
import printJS from "print-js";
import QRCode from 'qrcode'


var formatNumero = function (val) {
  var mask = IMask.createMask({
    mask: Number,
    scale: 2,
    thousandsSeparator: ",",
    radix: ".",
  });

  mask.resolve(val.toString());
  return mask.value;
};

const liquidamol = (data) => {
  return new Promise(res => {
    let watermark =
      data.estado_liq02 === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";

    let registros = [];
    let vlrTotal = 0;
    let kgsNetos = 0;

    let descuentos = [];
    let totalDesc = 0;

    let empresa = data.empresa;
    let margin = {
      left: 20,
      right: 20
    };

    data.registros.pop();
    data.registros.forEach((el, i) => {
      registros.push([
        { text: i + 1, alignment: "right" },
        el.nropesaje_liq02.trim(),
        el.producto_liq02.trim(),
        formatNumero(parseInt(el.pesoini_liq02.replace(/\,/g, "")) || 0),
        { text: el.humini_liq02.trim(), alignment: "right" },
        { text: el.impini_liq02.trim(), alignment: "right" },
        { text: el.gpart_liq02.trim(), alignment: "right" },
        { text: formatNumero(parseInt(el.pesocomp_liq02.replace(/\,/g, "")) || 0), alignment: "right" },
        { text: formatNumero(parseInt(el.vlrkilo_liq02.replace(/\,/g, "")) || 0), alignment: "right" },
        { text: formatNumero(parseInt(el.vlrprod_liq02.replace(/\,/g, "")) || 0), alignment: "right" },
      ]);

      vlrTotal += parseFloat(el.vlrprod_liq02.replace(/\,/g, "")) || 0;
      kgsNetos += parseFloat(el.pesocomp_liq02.replace(/\,/g, "")) || 0;
    });

    data.descuentos.pop();
    data.descuentos.forEach(el => {
      descuentos.push([
        el.cuenta_liq02,
        { text: el.factura_liq02.trim(), alignment: "center" },
        el.pref_liq02.trim(),
        { text: el.valordesc_liq02, alignment: "right" },
      ]);

      totalDesc += parseFloat(el.valordesc_liq02.replace(/\,/g, "")) || 0;
    });
    let vlriva = parseFloat(data.vlriva_liq02.replace(/\,/g, ""));
    let netoCancelar = vlrTotal - totalDesc + vlriva;


    var dd = {
      watermark,
      pageMargins: [margin.left, 140, margin.right, 40],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
        },
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldright: {
          bold: true,
          alignment: "right"
        },
        headerTabla: {
          bold: true,
          fillColor: "black",
          color: "white"
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 25, margin.right, 5],
            columns: [
              {
                width: "auto",
                margin: [0, 0, 8, 0],
                image: data.logo,
                fit: [130, 130],
              },
              {
                style: "header",
                stack: [
                  empresa.descrip_empr,
                  `NIT. ${parseFloat(empresa.id_empr)}`,
                  `Dir. ${empresa.direccion_empr}`,
                  `Tel. ${empresa.telefono_empr}`,
                  `${empresa.Ciudad} - ${empresa.Departamento}`
                ]
              },
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "LIQUIDACION COMPRA DE PRODUCTOS AGRICOLAS", fontSize: 12, margin: [0, 0, 0, 3] },
                  `Número: ${data.consecut_liq02.trim()}`,
                  data.agencia.descripcion_agc,
                  `Fecha: ${data.fecha_liq02}`,
                ]
              },
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 27,
                x2: 620 - margin.right - margin.left,
                y1: 0,
                y2: 0,
                lineWidth: 1.5,
              },
            ],
          },
        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Plataforma Titan Soluciones S.A.S.",
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      content: [
        {
          fontSize: 9,
          columns: [
            {
              text: [
                { text: "RUT: ", bold: true },
                `${parseFloat(data.idrut_liq02)} ${data.descriprut_liq02.trim()}`
              ]
            },
            {
              text: [
                { text: "CIUDAD: ", bold: true },
                `${data.ciudad_liq02.trim()} - ${data.dpto_liq02.trim()}`
              ]
            }
          ]
        },
        {
          fontSize: 9,
          bold: true,
          margin: [0, 6, 0, 15],
          table: {
            widths: ["30%", "*"],
            heights: 13,
            body: [
              ["Condiciones de compra",
                {
                  columns: [
                    `Humedad: ${data.pdhcomp_liq02.trim()}`,
                    `Impureza: ${data.pdicomp_liq02.trim()}`,
                    `G. Partido: ${data.pdgpcomp_liq02.trim()}`,
                    `G. Rojo: ${data.pdrcomp_liq02.trim()}`,
                    `G. Yesado: ${data.pdycomp_liq02.trim()}`
                  ]
                }
              ]
            ]
          }
        },
        {
          fontSize: 8,
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === 1) ? 0 : 1.5;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === 1) ? 'white' : 'gray';
            },
          },
          table: {
            headerRows: 1,
            widths: ["4%", "6%", "27%", "10%", "8%", "8%", "9%", "9%", "9%", "10%"],
            body: [
              [
                { text: "Item", style: "headerTabla" },
                { text: "Pesaje", style: "headerTabla" },
                { text: "Producto", style: "headerTabla", alignment: "center" },
                { text: "Kgs. Brutos", style: "headerTabla" },
                { text: "Humedad", style: "headerTabla" },
                { text: "Impureza", style: "headerTabla" },
                { text: "Gr. Partido", style: "headerTabla" },
                { text: "Kgs. Netos", style: "headerTabla" },
                { text: "Vlr. Kilo", style: "headerTabla" },
                { text: "Vlr. Total", style: "headerTabla" },
              ],
              ...registros,
              [
                "",
                "",
                "",
                "",
                "",
                { text: "Total Compra", style: "boldcenter", colSpan: 2, fontSize: 8.7 },
                "",
                { text: formatNumero(kgsNetos), style: "boldright", fontSize: 8.7 },
                "",
                { text: formatNumero(vlrTotal), style: "boldright", fontSize: 8.2 },
              ],
            ]
          }
        },
        {
          margin: [0, 18, 0, 8],
          columns: [
            { text: " ", width: "45%" },
            {
              style: "header",

              alignment: "center",
              table: {

                body: [
                  ["DESCUENTOS"]
                ]
              }
            }
          ]
        },
        {
          fontSize: 9,
          layout: 'headerLineOnly',
          table: {
            headerRows: 1,
            widths: ["30%", "20%", "15%", "17%"],
            body: [
              [
                { text: "Descripción", bold: true },
                { text: "Documento", style: "boldcenter" },
                { text: "Fecha Doc.", bold: true },
                { text: "Valor", style: "boldcenter" },
              ],
              ...descuentos
            ]
          }
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 590.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
        },
        {
          fontSize: 9,
          bold: true,
          margin: [0, 5, 0, 0],
          columns: [
            { text: " ", width: "60%" },
            {
              columns: [
                {
                  stack: [
                    "Total Descuentos",
                    "Iva" + ` ${formatNumero(data.tariva_liq02)}` + "%",
                    { text: "Neto a Cancelar", margin: [0, 3, 0, 0] }
                  ]
                },
                {

                  alignment: "right",
                  stack: [
                    `$${formatNumero(totalDesc)}`,
                    `$${formatNumero(data.vlriva_liq02)}`,
                    { text: `$${formatNumero(netoCancelar)}`, margin: [0, 3, 0, 0] }
                  ]
                }
              ]
            }
          ]
        },
        {
          fontSize: 9,
          margin: [0, 25, 0, 0],
          columns: [
            { text: "Revisó", width: "45%", bold: true },
            {


              stack: [
                "Acepto a satisfacción los valores liquidados en la presente liquidación.",
                { text: "Vendedor", bold: true, margin: [0, 13, 0, 0] }
              ]


            }
          ]
        },
        {
          margin: [0, 15, 0, 5],
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 590.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
        },
        {
          fontSize: 9,
          stack: [
            `Generó: ${data.impreso_liq02.trim()}`,
            data.fechagen_liq02,
          ],
        },
      ]

    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const preliquidamol = (data) => {
  return new Promise(res => {
    let watermark =
    {
      text: "Pre_Liquidación",
      angle: 30,
      color: "black",
      opacity: 0.2,
      fontSize: 80,
    };

    let registros = [];
    let vlrTotal = 0;
    let kgsNetos = 0;

    let descuentos = [];
    let totalDesc = 0;

    let empresa = data.empresa;
    let margin = {
      left: 20,
      right: 20
    };

    data.registros.pop();
    data.registros.forEach((el, i) => {
      registros.push([
        { text: i + 1, alignment: "right" },
        el.nropesaje_liq02.trim(),
        el.producto_liq02.trim(),
        formatNumero(parseInt(el.pesoini_liq02.replace(/\,/g, "")) || 0),
        { text: el.humini_liq02.trim(), alignment: "right" },
        { text: el.impini_liq02.trim(), alignment: "right" },
        { text: el.gpart_liq02.trim(), alignment: "right" },
        { text: formatNumero(parseInt(el.pesocomp_liq02.replace(/\,/g, "")) || 0), alignment: "right" },
        { text: formatNumero(parseInt(el.vlrkilo_liq02.replace(/\,/g, "")) || 0), alignment: "right" },
        { text: formatNumero(parseInt(el.vlrprod_liq02.replace(/\,/g, "")) || 0), alignment: "right" },
      ]);

      vlrTotal += parseFloat(el.vlrprod_liq02.replace(/\,/g, "")) || 0;
      kgsNetos += parseFloat(el.pesocomp_liq02.replace(/\,/g, "")) || 0;
    });

    data.descuentos.pop();
    data.descuentos.forEach(el => {
      descuentos.push([
        el.cuenta_liq02,
        { text: el.factura_liq02.trim(), alignment: "center" },
        el.pref_liq02.trim(),
        { text: el.valordesc_liq02, alignment: "right" },
      ]);

      totalDesc += parseFloat(el.valordesc_liq02.replace(/\,/g, "")) || 0;
    });
    let vlriva = parseFloat(data.vlriva_liq02.replace(/\,/g, ""));
    let netoCancelar = vlrTotal - totalDesc + vlriva;


    var dd = {
      watermark,
      pageMargins: [margin.left, 140, margin.right, 40],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
        },
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldright: {
          bold: true,
          alignment: "right"
        },
        headerTabla: {
          bold: true,
          fillColor: "black",
          color: "white"
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 25, margin.right, 5],
            columns: [
              {
                width: "auto",
                margin: [0, 0, 8, 0],
                image: data.logo,
                fit: [130, 130],
              },
              {
                style: "header",
                stack: [
                  empresa.descrip_empr,
                  `NIT. ${parseFloat(empresa.id_empr)}`,
                  `Dir. ${empresa.direccion_empr}`,
                  `Tel. ${empresa.telefono_empr}`,
                  `${empresa.Ciudad} - ${empresa.Departamento}`
                ]
              },
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "PRE-LIQUIDACION COMPRA DE PRODUCTOS AGRICOLAS", fontSize: 12, margin: [0, 0, 0, 3] },
                  `Número: ${data.consecut_liq02.trim()}`,
                  data.agencia.descripcion_agc,
                  `Fecha: ${data.fecha_liq02}`,
                ]
              },
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 27,
                x2: 620 - margin.right - margin.left,
                y1: 0,
                y2: 0,
                lineWidth: 1.5,
              },
            ],
          },
        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Plataforma Titan Soluciones S.A.S.",
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      content: [
        {
          fontSize: 9,
          columns: [
            {
              text: [
                { text: "RUT: ", bold: true },
                `${parseFloat(data.idrut_liq02)} ${data.descriprut_liq02.trim()}`
              ]
            },
            {
              text: [
                { text: "CIUDAD: ", bold: true },
                `${data.ciudad_liq02.trim()} - ${data.dpto_liq02.trim()}`
              ]
            }
          ]
        },
        {
          fontSize: 9,
          bold: true,
          margin: [0, 6, 0, 15],
          table: {
            widths: ["30%", "*"],
            heights: 13,
            body: [
              ["Condiciones de compra",
                {
                  columns: [
                    `Humedad: ${data.pdhcomp_liq02.trim()}`,
                    `Impureza: ${data.pdicomp_liq02.trim()}`,
                    `G. Partido: ${data.pdgpcomp_liq02.trim()}`,
                    `G. Rojo: ${data.pdrcomp_liq02.trim()}`,
                    `G. Yesado: ${data.pdycomp_liq02.trim()}`
                  ]
                }
              ]
            ]
          }
        },
        {
          fontSize: 8,
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === 1) ? 0 : 1.5;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === 1) ? 'white' : 'gray';
            },
          },
          table: {
            headerRows: 1,
            widths: ["4%", "6%", "27%", "10%", "8%", "8%", "9%", "9%", "9%", "10%"],
            body: [
              [
                { text: "Item", style: "headerTabla" },
                { text: "Pesaje", style: "headerTabla" },
                { text: "Producto", style: "headerTabla", alignment: "center" },
                { text: "Kgs. Brutos", style: "headerTabla" },
                { text: "Humedad", style: "headerTabla" },
                { text: "Impureza", style: "headerTabla" },
                { text: "Gr. Partido", style: "headerTabla" },
                { text: "Kgs. Netos", style: "headerTabla" },
                { text: "Vlr. Kilo", style: "headerTabla" },
                { text: "Vlr. Total", style: "headerTabla" },
              ],
              ...registros,
              [
                "",
                "",
                "",
                "",
                "",
                { text: "Total Compra", style: "boldcenter", colSpan: 2, fontSize: 8.7 },
                "",
                { text: formatNumero(kgsNetos), style: "boldright", fontSize: 8.7 },
                "",
                { text: formatNumero(vlrTotal), style: "boldright", fontSize: 8.2 },
              ],
            ]
          }
        },
        {
          margin: [0, 18, 0, 8],
          columns: [
            { text: " ", width: "45%" },
            {
              style: "header",

              alignment: "center",
              table: {

                body: [
                  ["DESCUENTOS"]
                ]
              }
            }
          ]
        },
        {
          fontSize: 9,
          layout: 'headerLineOnly',
          table: {
            headerRows: 1,
            widths: ["30%", "20%", "15%", "17%"],
            body: [
              [
                { text: "Descripción", bold: true },
                { text: "Documento", style: "boldcenter" },
                { text: "Fecha Doc.", bold: true },
                { text: "Valor", style: "boldcenter" },
              ],
              ...descuentos
            ]
          }
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 590.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
        },
        {
          fontSize: 9,
          bold: true,
          margin: [0, 5, 0, 0],
          columns: [
            { text: " ", width: "60%" },
            {
              columns: [
                {
                  stack: [
                    "Total Descuentos",
                    "Iva" + ` ${formatNumero(data.tariva_liq02)}` + "%",
                    { text: "Neto a Cancelar", margin: [0, 3, 0, 0] }
                  ]
                },
                {

                  alignment: "right",
                  stack: [
                    `$${formatNumero(totalDesc)}`,
                    `$${formatNumero(data.vlriva_liq02)}`,
                    { text: `$${formatNumero(netoCancelar)}`, margin: [0, 3, 0, 0] }
                  ]
                }
              ]
            }
          ]
        },
        {
          fontSize: 9,
          margin: [0, 25, 0, 0],
          columns: [
            { text: "Revisó", width: "45%", bold: true },
            {


              stack: [
                "Acepto a satisfacción los valores liquidados en la presente liquidación.",
                { text: "Vendedor", bold: true, margin: [0, 13, 0, 0] }
              ]


            }
          ]
        },
        {
          margin: [0, 15, 0, 5],
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 590.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
        },
        {
          fontSize: 9,
          stack: [
            `Generó: ${data.impreso_liq02.trim()}`,
            data.fechagen_liq02,
          ],
        },
      ]

    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const proceso_trilla = (data) => {
  return new Promise(res => {
    let margin = {
      left: 30,
      right: 30
    };

    let produccion = [];
    let consumo = [];
    let kilosp = 0;
    let porcp = 0;
    let kilosc = 0;
    let porcc = 0;
    let valorp = 0;
    let valorc = 0;

    data.registros.pop()
    data.registros.forEach(el => {
      let item = [
        el.producto_rep.trim(),
        el.ubicacion_rep.trim(),
        { text: el.cantidad_rep.trim(), alignment: "center" },
        { text: el.valor_rep.trim(), alignment: "center" },
        { text: el.kilos_rep.trim(), alignment: "center" },

        { text: el.porc_rep.trim(), alignment: "center" }
      ];

      if (el.tipo_rep == "0") {
        kilosp += parseFloat(el.kilos_rep.replace(/\,/g, "")) || 0;
        porcp += parseFloat(el.porc_rep.replace(/\,/g, "")) || 0;
        valorp += parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        produccion.push(item)
      } else {
        kilosc += parseFloat(el.kilos_rep.replace(/\,/g, "")) || 0;
        valorc += parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        consumo.push(item)
      }
    });

    var dd = {
      pageMargins: [margin.left, 130, margin.right, 40],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
        },
        title: {
          fontSize: 12,
          bold: true,
          alignment: "center"
        },
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 25, margin.right, 5],
            columns: [
              {
                width: "auto",
                margin: [0, 0, 8, 0],
                image: data.logo,
                fit: [130, 130],
              },
              {
                style: "header",
                stack: [
                  data.nombre_rep.trim(),
                  `NIT. ${data.nit_rep.trim()}`,
                  `Dir. `,
                  `Tel. `,
                  `VILLAVICENCIO`
                ]
              },
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "PROCESO DE TRILLA", fontSize: 12, margin: [0, 0, 0, 3] },
                  `Número: ${data.consecutivo_rep.trim()}`,
                  data.registros[0].ubicacion_rep.trim(),
                  `Fecha: ${data.fecha_rep}`,
                ]
              },
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 27,
                x2: 620 - margin.right - margin.left,
                y1: 0,
                y2: 0,
                lineWidth: 1.5,
              },
            ],
          },
        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Plataforma Titan Soluciones S.A.S.",
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      content: [
        { text: "PRODUCCION", style: "title" },
        {
          fontSize: 9.5,
          margin: [0, 4, 0, 20],
          layout: 'lightHorizontalLines',
          table: {
            widths: ["30%", "28%", "12%", "13%", "*", "10%"],
            headerRows: 1,
            body: [
              [
                { text: "Producto", style: "boldcenter" },
                { text: "Ubicación", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Valor", style: "boldcenter" },
                { text: "Kilos", style: "boldcenter" },
                { text: "%", style: "boldcenter" },
              ],
              ...produccion,
              [
                "",
                { text: "TOTAL PRODUCCION", bold: true },
                "",
                { text: formatNumero(valorp), style: "boldcenter" },
                { text: formatNumero(kilosp), style: "boldcenter" },
                { text: formatNumero(porcp), style: "boldcenter" }
              ]
            ]
          }
        },
        { text: "CONSUMO", style: "title" },
        {
          fontSize: 9.5,
          margin: [0, 4, 0, 0],
          layout: 'lightHorizontalLines',
          table: {
            widths: ["30%", "28%", "12%", "13%", "*", "10%"],
            headerRows: 1,
            body: [
              [
                { text: "Producto", style: "boldcenter" },
                { text: "Ubicación", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Valor", style: "boldcenter" },
                { text: "Kilos", style: "boldcenter" },
                { text: "%", style: "boldcenter" },
              ],
              ...consumo,
              [
                "",
                { text: "TOTAL CONSUMO", bold: true },
                "",
                { text: formatNumero(valorc), style: "boldcenter" },
                { text: formatNumero(kilosc), style: "boldcenter" },
                { text: formatNumero(porcc), style: "boldcenter" }
              ]
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fontSize: 9.5,
          bold: true,
          columns: [
            { text: `Revisó: `, width: "60%" },
            `Generó: ${data.impreso_rep.trim()}\n${data.fechagen_rep}`,
          ]
        }
      ]
    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const proceso_secamiento = (data) => {
  return new Promise(res => {
    let margin = {
      left: 30,
      right: 30
    };

    let produccion = [];
    let consumo = [];
    let kilosp = 0;
    let porcp = 0;
    let kilosc = 0;
    let porcc = 0;

    data.registros.pop()
    data.registros.forEach(el => {
      let item = [
        el.producto_rep.trim(),
        el.ubicacion_rep.trim(),
        { text: el.cantidad_rep.trim(), alignment: "center" },
        { text: el.kilos_rep.trim(), alignment: "center" },
        { text: el.porc_rep.trim(), alignment: "center" }
      ];

      if (el.tipo_rep == "0") {
        kilosp += parseFloat(el.kilos_rep.replace(/\,/g, "")) || 0;
        porcp += parseFloat(el.porc_rep.replace(/\,/g, "")) || 0;
        produccion.push(item)
      } else {
        kilosc += parseFloat(el.kilos_rep.replace(/\,/g, "")) || 0;
        porcc += parseFloat(el.porc_rep.replace(/\,/g, "")) || 0;
        consumo.push(item)
      }
    });

    var dd = {
      pageMargins: [margin.left, 130, margin.right, 40],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
        },
        title: {
          fontSize: 12,
          bold: true,
          alignment: "center"
        },
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 25, margin.right, 5],
            columns: [
              {
                width: "auto",
                margin: [0, 0, 8, 0],
                image: data.logo,
                fit: [130, 130],
              },
              {
                style: "header",
                stack: [
                  data.nombre_rep.trim(),
                  `NIT. ${data.nit_rep.trim()}`,
                  `Dir. `,
                  `Tel. `,
                  `VILLAVICENCIO`
                ]
              },
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "PROCESO DE SECAMIENTO", fontSize: 12, margin: [0, 0, 0, 3] },
                  `Número: ${data.consecutivo_rep.trim()}`,
                  data.registros[0].ubicacion_rep.trim(),
                  `Fecha: ${data.fecha_rep}`,
                ]
              },
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 27,
                x2: 620 - margin.right - margin.left,
                y1: 0,
                y2: 0,
                lineWidth: 1.5,
              },
            ],
          },
        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Plataforma Titan Soluciones S.A.S.",
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      content: [
        { text: "PRODUCCION", style: "title" },
        {
          fontSize: 9.5,
          margin: [0, 4, 0, 20],
          layout: 'lightHorizontalLines',
          table: {
            widths: ["30%", "28%", "12%", "16%", "13%"],
            headerRows: 1,
            body: [
              [
                { text: "Producto", style: "boldcenter" },
                { text: "Ubicación", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Kilos", style: "boldcenter" },
                { text: "%", style: "boldcenter" },
              ],
              ...produccion,
              [
                "",
                { text: "TOTAL PRODUCCION", bold: true },
                "",
                { text: formatNumero(kilosp), style: "boldcenter" },
                { text: formatNumero(porcp), style: "boldcenter" }
              ]
            ]
          }
        },
        { text: "CONSUMO", style: "title" },
        {
          fontSize: 9.5,
          margin: [0, 4, 0, 0],
          layout: 'lightHorizontalLines',
          table: {
            widths: ["30%", "28%", "12%", "16%", "13%"],
            headerRows: 1,
            body: [
              [
                { text: "Producto", style: "boldcenter" },
                { text: "Ubicación", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Kilos", style: "boldcenter" },
                { text: "%", style: "boldcenter" },
              ],
              ...consumo,
              [
                "",
                { text: "TOTAL CONSUMO", bold: true },
                "",
                { text: formatNumero(kilosc), style: "boldcenter" },
                { text: formatNumero(porcc), style: "boldcenter" }
              ]
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fontSize: 9.5,
          bold: true,
          columns: [
            { text: `Revisó: `, width: "60%" },
            `Generó: ${data.impreso_rep.trim()}\n${data.fechagen_rep}`,
          ]
        }
      ]
    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const proceso_mol = (data) => {
  return new Promise((res) => {
    let produccion_totales = {
      cantidad: 0,
      kilos: 0,
    };

    let consumo_totales = {
      cantidad: 0,
      kilos: 0,
    };

    let produccion = data.registros.filter((el) => el.tipo == "1");
    let format_produccion = produccion.map((el) => {
      produccion_totales.cantidad += parseFloat(el.cantidad);
      produccion_totales.kilos += parseFloat(el.kilos);

      return [
        el.producto.trim(),
        el.ubicacion.trim(),
        el.cantidad.trim(),
        el.kilos.trim(),
      ];
    });

    format_produccion.unshift([
      { text: "Producto", bold: true },
      { text: "Ubicación", bold: true },
      { text: "Cantidad", bold: true },
      { text: "Kilos", bold: true },
    ]);

    format_produccion.push([
      { text: "Totales: ", bold: true, colSpan: 2 },
      {},
      { text: produccion_totales.cantidad, bold: true },
      { text: produccion_totales.kilos, bold: true },
    ]);

    let consumo = data.registros.filter((el) => el.tipo == "2");
    let format_consumo = consumo.map((el) => {
      consumo_totales.cantidad += parseFloat(el.cantidad);
      consumo_totales.kilos += parseFloat(el.kilos);

      return [
        el.producto.trim(),
        el.ubicacion.trim(),
        el.cantidad.trim(),
        el.kilos.trim(),
      ];
    });

    format_consumo.unshift([
      { text: "Producto", bold: true },
      { text: "Ubicación", bold: true },
      { text: "Cantidad", bold: true },
      { text: "Kilos", bold: true },
    ]);

    format_consumo.push([
      { text: "Totales: ", bold: true, colSpan: 2 },
      {},
      { text: consumo_totales.cantidad, bold: true },
      { text: consumo_totales.kilos, bold: true },
    ]);

    var margin = {
      left: 40,
      right: 40,
    };

    var dd = {
      pageMargins: [margin.left, 90, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 40, margin.left, 0],
            columns: [
              {
                width: "20%",
                margin: [0, 0, 0, 0],
                alignment: "center",
                stack: [
                  {
                    image: "logo",
                    fit: [80, 80],
                  },
                ],
              },
              {
                width: "45%",
                bold: true,
                fontSize: 12,
                stack: [`${data.nombre}`, `NIT. ${data.nit}`],
              },
              {
                width: "35%",
                bold: true,
                fontSize: 12,
                alignment: "center",
                stack: [
                  "Proceso de ".toUpperCase() + data.detalle.trim(),
                  `Nro. ${data.consecutivo.trim()}`,
                  data.fecha,
                ],
              },
            ],
          },
          {
            margin: [0, 10, 0, 0],
            canvas: [
              {
                type: "line",
                x1: margin.left,
                x2: pageSize.width - margin.right,
                y1: 0,
                y2: 0,
                lineWidth: 2,
              },
            ],
          },
        ];
      },
      content: [
        {
          margin: [0, 50, 0, 0],
          columns: [
            {
              width: "50%",
              fontSize: 10,
              stack: [
                {
                  text: "Producción".toUpperCase(),
                  alignment: "center",
                  bold: true,
                  fontSize: 12,
                },
                {
                  table: {
                    widths: ["*", "auto", "auto", "auto"],
                    body: format_produccion,
                  },
                  layout: "lightHorizontalLines",
                },
              ],
            },
            {
              width: "50%",
              fontSize: 10,
              stack: [
                {
                  text: "Consumo".toUpperCase(),
                  alignment: "center",
                  bold: true,
                  fontSize: 12,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ["*", "auto", "auto", "auto"],
                    body: format_consumo,
                  },
                  layout: "lightHorizontalLines",
                },
              ],
            },
          ],
          columnGap: 10,
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 595.28 - margin.right - margin.left,
              y1: 10,
              y2: 10,
              lineWidth: 2,
            },
          ],
        },
        {
          margin: [0, 40, 0, 20],
          bold: true,
          fontSize: 14,
          text: "Generó: ___________________",
        },
      ],
      styles: {
        headerTabla: {
          bold: true,
        },
        infoTabla: {
          bold: true,
          fontSize: 10,
        },
      },
      images: {
        logo: data.logo,
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

const pesaje_entrada = (data) => {
  return new Promise((res) => {
    var agencia = data.agencia;
    var datosTabla = [];
    var items = data.registros;
    let watermark =
      data.estado_pes === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    let cont = 0;
    let humedad = 0;
    let impureza = 0;
    let granoPartido = 0;
    let granorojo = 0;
    let granoyeso = 0;
    let pesoEntrada = 0;
    let pesoSalida = 0;


    var itemsTabla = [
      [
        //fila
        {
          //celda1
          fillColor: "#000000",
          color: "#ffffff",
          fontSize: 10,
          alignment: "center",
          bold: true,
          text: "Item",
        },
        {
          fillColor: "#000000",
          color: "#ffffff",
          fontSize: 10,
          alignment: "center",
          bold: true,
          text: "Producto",
        },
        {
          fillColor: "#000000",
          color: "#ffffff",
          fontSize: 10,
          alignment: "center",
          bold: true,
          text: "Ubicación",
        },
      ],
    ];

    var margin = {
      left: 40,
      right: 40,
    };

    if (items.length <= 0) {
      itemsTabla.push([
        {
          colSpan: 3,
          alignment: "left",
          fillColor: "#ffcd80",
          text: "No se incluyen items",
        },
        {},
        {},
      ]);
    } else {
      items.pop();
      items.forEach((el) => {
        itemsTabla.push([
          {
            fontSize: 10,
            alignment: "left",
            text: ++cont,
          },
          {
            fontSize: 10,
            alignment: "left",
            text: el.producto_pes,
          },
          {
            fontSize: 10,
            alignment: "left",
            text: el.agencia_pes + " - " + el.agencia_pes_desc,
          },
        ]);

        humedad = el.humini_pes;
        impureza = el.impini_pes;
        granoPartido = el.gpart_pes;
        granorojo = el.rojoini_pes;
        granoyeso = el.yesoini_pes;
        pesoEntrada +=
          parseFloat(el.pesoini_pes.replace(/\,/g, "").replace(/\./g, ",")) ||
          0;
        pesoSalida +=
          parseFloat(el.pesodes_pes.replace(/\,/g, "").replace(/\./g, ",")) ||
          0;
      });
    }

    datosTabla.push(
      [
        {
          colSpan: 3,
          table: {
            widths: [
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: [
              [
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "RUT: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: formatNumero(
                    parseInt(data.idrut_pes.replace(/\,/g, "")) || 0
                  ),
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  colSpan: 2,
                  text: data.rut_pes.trim(),
                },
                {},
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Documento:",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.docext_pes,
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Origen: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: `${data.ciudad_pes.trim()} (${data.dpto_pes.trim()})`,
                },
              ],
              [
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Placas: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.placas_pes,
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Conductor:",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.conductor_pes.replace(/\ {2}/g, " "),
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Cedula: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.idconductor_pes.trim(),
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Empresa: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.rut_pes.trim(),
                },
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto"],
            body: itemsTabla,
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          border: [false, true, false, false],
          table: {
            widths: [50, 130, 70, 70, 100],
            body: [
              [
                {},
                {
                  fontSize: 11,
                  alignment: "center",
                  text: "Fecha",
                  bold: true,
                },
                {
                  fontSize: 11,
                  alignment: "center",
                  text: "Hora",
                  bold: true,
                },
                {
                  fontSize: 11,
                  alignment: "center",
                  text: "Peso",
                  bold: true,
                },
                {
                  fontSize: 16,
                  alignment: "center",
                  bold: true,
                  text: "\nKILOS: " + formatNumero(pesoEntrada),
                  rowSpan: 3,
                },
              ],
              [
                {
                  fontSize: 11,
                  alignment: "left",
                  text: "Entrada",
                  bold: true,
                },
                {
                  fontSize: 11,
                  alignment: "center",
                  text: data.fechaent_pes,
                },
                {
                  fontSize: 11,
                  alignment: "center",
                  text: data.horaent_pes,
                },
                {
                  fontSize: 11,
                  alignment: "center",
                  text: formatNumero(pesoEntrada),
                },
                {},
              ],
              [
                {
                  fontSize: 11,
                  border: [false, true, false, false],
                  text: " ",
                },
                {
                  fontSize: 11,
                  border: [false, true, false, false],
                  text: " ",
                },
                {
                  fontSize: 11,
                  border: [false, true, false, false],
                  text: " ",
                },
                {
                  fontSize: 11,
                  border: [false, true, false, false],
                  text: " ",
                },
                {},
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          table: {
            widths: [80, "auto", "*", "auto", "auto"],
            body: [
              [
                {
                  bold: true,
                  fontSize: 11,
                  text: "Observaciones: ",
                },
                {
                  colSpan: 4,
                  fontSize: 11,
                  text: data.observac1_pes, //data.observaciones,
                },
                {},
                {},
                {},
              ],
              [
                {
                  fontSize: 8,
                  bold: true,
                  text: "Revisó:",
                },
                {},
                {},
                {},
                {
                  fontSize: 8,
                  bold: true,
                  stack: [
                    "Generó: " + data.impreso_pes.trim(),
                    data.fechagen_pes.trim() + "_" + data.horagen_pes.trim(),
                  ],
                },
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          fontSize: 7,
          bold: true,
          colSpan: 3,
          text: "Plataforma: Titan Soluciones S.A.S.",
        },
        {},
        {},
      ]
    );

    var dd = {
      watermark,
      //pageOrientation: "landscape",
      pageMargins: [margin.left, 100, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 15, margin.right, 0],
            columns: [
              {
                width: "20%",
                margin: [0, -10, 0, 0],
                alignment: "center",
                stack: [
                  {
                    image: "logo",
                    fit: [80, 80],
                  },
                ],
              },
              {
                width: "40%",
                alignment: "left",
                fontSize: 11,
                bold: true,
                stack: [
                  data.empresa.descrip_empr.trim(),
                  `NIT. ${data.empresa.ideditado_empr}`,
                  `Dir. ${data.empresa.direccion_empr}`,
                  `Tel. ${data.empresa.telefono_empr}`,
                  `${data.empresa.Ciudad} - ${data.empresa.Departamento}`,
                ],
              },
              {
                width: "40%",
                bold: true,
                fontSize: 11,
                alignment: "center",
                stack: [
                  "Pesaje de Entrada".toUpperCase(),
                  "Número: " + data.consecut_pes.trim(),
                  agencia.descripcion_agc,
                  "Fecha: " + data.fechagen_pes,
                  data.nombredoc_pes,
                ],
              },
            ],
          },
          {
            margin: [0, 10, 0, 0],
            canvas: [
              {
                type: "line",
                x1: margin.left,
                x2: pageSize.width - margin.right,
                y1: 0,
                y2: 0,
                lineWidth: 2,
              },
            ],
          },
        ];
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*"],
            body: datosTabla,
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {},
      images: {
        logo: data.logo,
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

const pesaje_salida = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_pes === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    var agencia = data.agencia;
    var datosTabla = [];
    var items = data.registros;
    let cont = 0;
    let humedad = 0;
    let impureza = 0;
    let granoPartido = 0;
    let pesoEntrada = 0;
    let pesoSalida = 0;
    let pesoCompra = 0;
    let granorojo = 0;
    let granoyeso = 0;
    let g_entero = 0;
    let g_dañado = 0;
    let g_nuez = 0;
    let temperatura = 0;
    let empaques = data.empaques_pes;
    let bultos = data.bultos_pes;
    let show_neto = data.empresa.id_empr;

    var itemsTabla = [
      [
        //fila
        {
          //celda1
          fillColor: "#000000",
          color: "#ffffff",
          fontSize: 10,
          alignment: "center",
          bold: true,
          text: "Item",
        },
        {
          fillColor: "#000000",
          color: "#ffffff",
          fontSize: 10,
          alignment: "center",
          bold: true,
          text: "Producto",
        },
        {
          fillColor: "#000000",
          color: "#ffffff",
          fontSize: 10,
          alignment: "center",
          bold: true,
          text: "Ubicación",
        },
      ],
    ];

    var margin = {
      left: 40,
      right: 40,
    };

    if (items.length <= 0) {
      itemsTabla.push([
        {
          colSpan: 3,
          alignment: "left",
          fillColor: "#ffcd80",
          text: "No se incluyen items",
        },
        {},
        {},
      ]);
    } else {
      items.pop();
      items.forEach((el) => {
        itemsTabla.push([
          {
            fontSize: 10,
            alignment: "left",
            text: ++cont,
          },
          {
            fontSize: 10,
            alignment: "left",
            text: el.producto_pes,
          },
          {
            fontSize: 10,
            alignment: "left",
            text: el.agencia_pes + " - " + el.agencia_pes_desc,
          },
        ]);

        humedad = el.humini_pes;
        impureza = el.impini_pes;
        granoPartido = el.gpart_pes;
        granorojo = el.rojoini_pes;
        granoyeso = el.yesoini_pes;
        g_entero = el.gentero_pes;
        g_dañado = el.gdanado_pes;
        g_nuez = el.nuezent_pes;
        temperatura = el.temperatura_pes;


        pesoEntrada +=
          parseFloat(el.pesoini_pes.replace(/\,/g, "").replace(/\./g, ",")) ||
          0;
        pesoSalida +=
          parseFloat(el.pesodes_pes.replace(/\,/g, "").replace(/\./g, ",")) ||
          0;
        pesoCompra +=
          parseFloat(el.pesocomp_pes.replace(/\,/g, "").replace(/\./g, ",")) ||
          0;
      });
    }

    datosTabla.push(
      [
        {
          colSpan: 3,
          table: {
            widths: [
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: [
              [
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "RUT: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: formatNumero(
                    parseInt(data.idrut_pes.replace(/\,/g, "")) || 0
                  ),
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  colSpan: 2,
                  text: data.rut_pes.trim(),
                },
                {},
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Documento:",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.docext_pes,
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Origen: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: `${data.ciudad_pes.trim()} (${data.dpto_pes.trim()})`,
                },
              ],
              [
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Placas: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.placas_pes,
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Conductor:",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.conductor_pes.replace(/\ {2}/g, " "),
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Cedula: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.idconductor_pes.trim(),
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  bold: true,
                  text: "Empresa: ",
                },
                {
                  fontSize: 9,
                  alignment: "left",
                  text: data.rut_pes.trim(),
                },
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto"],
            body: itemsTabla,
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          border: [false, true, false, false],
          table: {
            widths: [50, 130, 70, 50, 80, 60],
            body: [
              [
                {},
                {
                  fontSize: 10,
                  alignment: "center",
                  text: "Fecha",
                  bold: true,
                },
                {
                  fontSize: 10,
                  alignment: "center",
                  text: "Hora",
                  bold: true,
                },
                {
                  fontSize: 10,
                  alignment: "center",
                  text: "Peso",
                  bold: true,
                },
                {
                  fontSize: 12,
                  alignment: "left",
                  bold: true,
                  text:
                    (show_neto != "000000901463276") ? "\n PESO NETO:" + formatNumero(pesoEntrada - pesoSalida - empaques) : "",
                  rowSpan: 3,
                },

                {
                  fontSize: 10,
                  rowSpan: 2,
                  margin: [0, 0, 0, 0],
                  bold: true,
                  alignment: "center",
                  text:
                    (show_neto != "000000901463277") ? "\nKILOS COMPRA: " + formatNumero(pesoCompra) : "",
                },
              ],
              [
                {
                  fontSize: 10,
                  alignment: "left",
                  text: "Entrada",
                  bold: true,
                },
                {
                  fontSize: 10,
                  alignment: "center",
                  text: data.fechaent_pes,
                },
                {
                  fontSize: 10,
                  alignment: "center",
                  text: data.horaent_pes,
                },
                {
                  fontSize: 10,
                  alignment: "center",
                  text: formatNumero(pesoEntrada),
                },
                {},
                {},
              ],
              [
                {
                  fontSize: 10,
                  border: [false, true, false, false],
                  alignment: "left",
                  text: "Salida: ",
                  bold: true,
                },
                {
                  fontSize: 10,
                  border: [false, true, false, false],
                  alignment: "center",
                  text: data.fechasal_pes,
                },
                {
                  fontSize: 10,
                  border: [false, true, false, false],
                  alignment: "center",
                  text: data.horasal_pes,
                },
                {
                  fontSize: 10,
                  border: [false, true, false, false],
                  alignment: "center",
                  text: formatNumero(pesoSalida),
                },
                {},
                {},
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          border: [false, false, false, false],
          table: {
            widths: [60, 30, 50, 50, 40, 40, 40, 40, 40, 40],
            body: [
              data.registros[0].pesocomp_pes.trim()
                ? [
                  {
                    fontSize: 9,
                    bold: true,
                    text: "Humedad:",
                  },
                  {
                    fontSize: 9,
                    text: `${formatNumero(humedad || 0)} %`,
                  },
                  {
                    fontSize: 9,
                    bold: true,
                    text: "Impureza:",
                  },
                  {
                    fontSize: 9,
                    text: `${formatNumero(impureza || 0)} %`,
                  },
                  {
                    fontSize: 9,
                    bold: true,
                    text: "G.Partido",
                  },
                  {
                    fontSize: 9,
                    text: `${formatNumero(granoPartido || 0)} %`,
                  },
                  {
                    fontSize: 9,
                    bold: true,
                    text: "G.Rojo:",
                  },
                  {
                    fontSize: 9,
                    text: `${formatNumero(granorojo || 0)} %`,
                  },
                  {
                    fontSize: 9,
                    bold: true,
                    text: "G.Yesado",
                  },
                  {
                    fontSize: 9,
                    text: `${formatNumero(granoyeso || 0)} %`,
                  },

                ]
                : [],
              [
                {
                  fontSize: 9,
                  bold: true,
                  text: "G.Entero:",
                },
                {
                  fontSize: 9,
                  text: `${formatNumero(g_entero || 0)} %`,
                },
                {
                  fontSize: 9,
                  bold: true,
                  text: "G.Dañado:",
                },
                {
                  fontSize: 9,
                  text: `${formatNumero(g_dañado || 0)} %`,
                },
                {
                  fontSize: 9,
                  bold: true,
                  text: "G.Nuez Entera:",
                },
                {
                  fontSize: 9,
                  text: `${formatNumero(g_nuez || 0)} %`,
                },
                {
                  fontSize: 9,
                  bold: true,
                  text: "Temperat:",
                },
                {
                  fontSize: 9,
                  text: `${formatNumero(temperatura || 0)}`,
                },
                {
                },
                {
                },

              ],
              [
                {
                  fontSize: 9,
                  bold: true,
                  text: "Empaques:",
                },
                {
                  fontSize: 9,
                  text: `${formatNumero(empaques || 0)}`,
                },
                {
                  fontSize: 9,
                  bold: true,
                  text: "Bultos:",
                },
                {
                  fontSize: 9,
                  text: `${formatNumero(bultos || 0)}`,
                },
                {},
                {},
                {},
                {},
                {},
                {},
              ]
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          table: {
            widths: [80, "auto", "*", "auto", "*", "auto", "*", "auto",],
            body: [
              [
                {
                  bold: true,
                  fontSize: 10,
                  text: "Flete Molino: ",
                },
                {
                  fontSize: 10,
                  text: `$${formatNumero(data.fletemol_pes.trim() || 0)}`,
                },
                {
                  bold: true,
                  fontSize: 10,
                  text: "Descargue Molino: ",
                },
                {
                  fontSize: 10,
                  text: `$${formatNumero(data.descmolino_pes.trim() || 0)}`,
                },
                {
                  bold: true,
                  fontSize: 10,
                  text: "Flete fluvial: ",
                },
                {
                  fontSize: 10,
                  text: `$${formatNumero(data.fletecan_pes.trim() || 0)}`,
                },
                {
                  bold: true,
                  fontSize: 10,
                  text: "Descargue fluvial: ",
                },
                {
                  fontSize: 10,
                  text: `$${formatNumero(data.desccanoa_pes.trim() || 0)}`,
                },

              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          colSpan: 3,
          table: {
            widths: ["auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                {
                  colSpan: 4, 
                  bold: false,
                  fontSize: 9,
                  text: "Observaciones: " + data.observac1_pes.trim() + data.observac2_pes.trim() + '\n' + '\n', //data.observaciones,,
                },
                // {
                //   colSpan: 4,
                //   fontSize: 9,
                //   text: data.observac1_pes.trim() + '\n' + data.observac2_pes.trim() + '\n', //data.observaciones,
                // },
                {},
                {},
                {},
                {},
              ],
              [
                {
                  fontSize: 7,
                  bold: true,
                  underline: true,
                  stack: [
                    "Generó: " + data.impreso_pes.trim(),
                    data.fechagen_pes.trim() + "_" + data.horagen_pes.trim(),
                  ],
                },
                // {
                //   alignment: "left",
                //   fontSize: 8,
                //   bold: true,
                //   text: "Elaboró: ________________",
                // },

                {
                  alignment: "left",
                  fontSize: 8,
                  bold: true,
                  text: "Laboratorio:_________________________",
                },
                {
                  alignment: "center",
                  fontSize: 8,
                  bold: true,
                  text: "Conductor:_________________________",
                },
                {
                  alignment: "left",
                  fontSize: 8,
                  bold: true,
                  text: "Revisó:_________________________",
                },
                {},
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      // [
      //   {
      //     fontSize: 7,
      //     bold: true,
      //     colSpan: 3,
      //     text: "Plataforma: Titan Soluciones S.A.S.",
      //   },
      //   {},
      //   {},
      // ]
    );

    var dd = {
      watermark,
      //pageOrientation: "landscape",
      pageMargins: [margin.left, 100, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 15, margin.right, 0],
            columns: [
              {
                width: "25%",
                margin: [0, 0, 0, 0],
                alignment: "center",
                stack: [
                  {
                    image: "logo",
                    width: 100,
                    height: 70,
                  },
                ],
              },
              {
                width: "40%",
                alignment: "left",
                fontSize: 11,
                bold: true,
                stack: [
                  data.empresa.descrip_empr.trim(),
                  `NIT. ${data.empresa.ideditado_empr}`,
                  `Dir. ${data.empresa.direccion_empr}`,
                  `Tel. ${data.empresa.telefono_empr}`,
                  `${data.empresa.Ciudad} - ${data.empresa.Departamento}`,
                ],
              },
              {
                width: "40%",
                bold: true,
                fontSize: 11,
                alignment: "center",
                stack: [
                  "Pesaje de Salida".toUpperCase(),
                  "Número: " + data.consecut_pes.trim(),
                  agencia.descripcion_agc,
                  "Fecha: " + data.fechagen_pes,
                  data.nombredoc_pes,
                ],
              },
            ],
          },
          {
            margin: [0, 10, 0, 0],
            canvas: [
              {
                type: "line",
                x1: margin.left,
                x2: pageSize.width - margin.right,
                y1: 0,
                y2: 0,
                lineWidth: 2,
              },
            ],
          },
        ];
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*"],
            body: datosTabla,
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {},
      images: {
        logo: data.logo,
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

const hoja_vida_conductor = (data) => {
  return new Promise((res) => {
    var dd = {
      pageMargins: [40, 110, 40, 60],
      images: {
        logo: data.logo,
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [40, 40, 40, 60],
            table: {
              widths: ["*", "*", "*", "*"],
              body: [
                [
                  {
                    alignment: "center",
                    stack: [
                      {
                        image: "logo",
                        fit: [50, 50],
                      },
                    ],
                  },
                  {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    stack: [
                      {
                        alignment: "center",
                        text: data.desripEmpresa,
                        fontSize: 12,
                      },
                      {
                        alignment: "center",
                        text: `Nit:${data.idEmpresa}`,
                        fontSize: 10,
                      },
                      {
                        alignment: "center",
                        text: data.direccionEmpresa,
                        fontSize: 10,
                      },
                      {
                        alignment: "center",
                        text: data.ciudadEmpresa + `-` + data.dptoEmpresa,
                        fontSize: 10,
                      },

                      // 'Formato hoja de vida'.toUpperCase(),
                      // 'Agropecuaria el porvenir sas'.toUpperCase()
                    ],
                    colSpan: 2,
                  },
                  {},
                  {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    stack: [
                      "",
                      `Pagina ${currentPage} de ${pageCount}`.toUpperCase(),
                    ],
                  },
                ],
                [
                  { text: "Placa:", aligment: "center", bold: true },
                  { text: "" },
                  { text: "Fecha:", aligment: "center", bold: true },
                  { text: "" },
                ],
              ],
            },
            layout: {
              paddingTop: function (i, node) {
                return i === 0 ? 10 : 2;
              },
              paddingBottom: function (i, node) {
                return i === 0 ? 10 : 2;
              },
            },
          },
        ];
      },
      defaultStyle: {
        fontSize: 10,
      },
      content: [
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  text: "Información conductor".toUpperCase(),
                  style: "header_tabla",
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              [
                { text: "N. cedula: ", style: "h2" },
                parseInt(data.identificacion_rut) || "",
                { text: "Expedida en: ", style: "h2" },
                data.ciudadexp_rut.trim(),
              ],
              [
                { text: "Nombres: ", style: "h2" },
                data.nombres_rut.trim(),
                { text: "Apellidos: ", style: "h2" },
                data.primerApellido_rut.trim() +
                " " +
                data.segundoApellido_rut.trim(),
              ],
              [
                { text: "Dirección: ", style: "h2" },
                data.direccion_rut.trim(),
                { text: "Ciudad: ", style: "h2" },
                "",
              ],
              [
                { text: "Teléfono Movil: ", style: "h2" },
                data.telecontacto_rut,
                { text: "Tipo Sangre: ", style: "h2" },
                data.grpsang_rut,
              ],
              [
                { text: "Nro. Licencia: ", style: "h2" },
                data.licencia_rut,
                { text: "Categoría Licencia: ", style: "h2" },
                data.categoria_rut.trim(),
              ],
              [
                { text: "Ciudad Licencia: ", style: "h2" },
                data.ciudlicencia_rut.trim(),
                { text: "Vencimiento Licencia: ", style: "h2" },
                data.fechavpase_rut.trim(),
              ],
              [
                { text: "Afiliado a: ", style: "h2" },
                data.afiliado_rut.trim(),
                { text: "Años Experiencia: ", style: "h2" },
                data.experiencia_rut.trim(),
              ],

              [
                { text: "Eps: ", style: "h2" },
                data.eps_rut.trim(),
                { text: "Arl: ", style: "h2" },
                data.arl_rut.trim(),
              ],
              [
                { text: "Banco: ", style: "h2" },
                data.banco_rut.trim(),
                { text: "Nro.Cuenta: ", style: "h2" },
                data.nrocta_rut.trim(),
              ],
              [
                { text: "Tipo Cuenta: ", style: "h2" },
                data.tipocta_rut.trim(),
                "",
                "",
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  text: "Contacto Familiar".toUpperCase(),
                  style: "header_tabla",
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              [
                { text: "Nombres: ", style: "h2" },
                { text: data.nombrefam_rut.trim(), colSpan: 3 },
                "",
                "",
              ],
              [
                { text: "Parentezco: ", style: "h2" },
                data.parentezco_rut.trim(),
                "",
                "",
              ],
              [
                { text: "Teléfono Móvil: ", style: "h2" },
                data.telecontacto_rut.trim(),
                { text: "Dirección: ", style: "h2" },
                data.direccionfam_rut.trim(),
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  text: "REFERENCIAS EMPRESARIALES",
                  style: "header_tabla",
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              [
                { text: "Empresa: ", style: "h2" },
                data.empresa1_rut.trim(),
                { text: "Teléfono Móvil: ", style: "h2" },
                data.teleemp1_rut.trim(),
              ],
              [
                { text: "Contacto: ", style: "h2" },
                data.contactoemp1_rut.trim(),
                { text: "Cargo: ", style: "h2" },
                data.cargoemp1_rut.trim(),
              ],
              [
                { text: "Empresa: ", style: "h2" },
                data.empresa2_rut.trim(),
                { text: "Teléfono Móvil: ", style: "h2" },
                data.teleemp2_rut.trim(),
              ],
              [
                { text: "Contacto: ", style: "h2" },
                data.contactoemp2_rut.trim(),
                { text: "Cargo: ", style: "h2" },
                data.cargoemp2_rut.trim(),
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  text: "REFERENCIAS PERSONALES",
                  style: "header_tabla",
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              [
                { text: "Nombres: ", style: "h2" },
                data.nombrerf1_rut.trim(),
                { text: "Teléfono Móvil: ", style: "h2" },
                data.telerf1_rut.trim(),
              ],
              [
                { text: "Dirección: ", style: "h2" },
                data.direccionrf1_rut.trim(),
                { text: "Ciudad: ", style: "h2" },
                data.ciudadrf1_rut.trim(),
              ],
              [
                { text: "Nombres: ", style: "h2" },
                data.nombrerf2_rut.trim(),
                { text: "Teléfono Móvil: ", style: "h2" },
                data.telerf2_rut.trim(),
              ],
              [
                { text: "Dirección: ", style: "h2" },
                data.direccionrf2_rut.trim(),
                { text: "Ciudad: ", style: "h2" },
                data.ciudadrf2_rut.trim(),
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  text: "INFORMACION DEL VEHICULO",
                  style: "header_tabla",
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              [
                { text: "Placas: ", style: "h2" },
                data.placa_rut.trim(),
                { text: "Marca: ", style: "h2" },
                data.marca_rut.trim(),
              ],
              [
                { text: "Color: ", style: "h2" },
                data.color_rut.trim(),
                { text: "Modelo: ", style: "h2" },
                data.modelo_rut.trim(),
              ],
              [
                { text: "Nro.Motor: ", style: "h2" },
                data.motor_rut.trim(),
                { text: "Nro. Chasis: ", style: "h2" },
                data.chasis_rut.trim(),
              ],
              [
                { text: "Vencimiento SOAT: ", style: "h2" },
                data.vsoat_rut.trim(),
                { text: "Vencimiento Tecnomecánica: ", style: "h2" },
                data.vtecno_rut.trim(),
              ],
              [
                { text: "Nro. Trailer: ", style: "h2" },
                data.trailer_rut.trim(),
                { text: "Marca Trailer: ", style: "h2" },
                data.marcatr_rut.trim(),
              ],
              [
                { text: "Tipo Vehículo: ", style: "h2" },
                data.tipovh_rut.trim(),
                { text: "Url Satelital: ", style: "h2" },
                data.urlsat_rut.trim(),
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  text: "PROPIETARIO VEHICULO",
                  style: "header_tabla",
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              [
                { text: "Nombre: ", style: "h2" },
                "",
                { text: "Identificación: ", style: "h2" },
                "",
              ],
              [{ text: "Teléfono Móvil: ", style: "h2" }, "", "", ""],
              [
                { text: "Dirección: ", style: "h2" },
                "",
                { text: "Ciudad: ", style: "h2" },
                "",
              ],
            ],
          },
        },
        {
          pageBreak: "before", // or after
          table: {
            widths: ["*"],
            body: [
              [
                `Autorización: Yo ${data.nombres_rut.trim()
                  ? data.nombres_rut.trim().toUpperCase() +
                  " " +
                  data.primerApellido_rut.trim().toUpperCase()
                  : "____________________"
                } ${data.segundoApellido_rut
                  .trim()
                  .toUpperCase()}   identificado con CC ${parseInt(
                    data.identificacion_rut
                  ) || "____________________"}  de ${data.ciudadexp_rut} autorizo
                a ${data.desripEmpresa.trim().toUpperCase()} Nit ${data.idEmpresa
                } para consultar, verificar y reportar en centrales de riesgo
                y bases de datos las novedades que presenten el propietario, poseedor, conductor y vehiculo durante la prestación del servicio, usar los datos personales segun la Ley 1266 de 2008, conocida como "LEY DE HABEAS DATA"
                `,
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*"],
            body: [
              [
                { text: `Nombre conductor`, style: "header_tabla" },
                { text: `Firma`, style: "header_tabla" },
              ],
              [
                {
                  text:
                    data.nombres_rut.trim().toUpperCase() +
                    ` ` +
                    data.primerApellido_rut.trim().toUpperCase() +
                    ` ` +
                    data.segundoApellido_rut.trim().toUpperCase(),
                  style: "h2",
                },
                { text: ` `, style: "h2" },
              ],
              [
                { text: `N. cédula`, style: "header_tabla" },
                { text: `Expedida en`, style: "header_tabla" },
              ],
              [
                { text: parseInt(data.identificacion_rut), style: "h2" },
                { text: data.ciudadexp_rut, style: "h2" },
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["1.5%", "*", "*", "*", "*", "*"],
            body: [
              [
                {
                  text: "REGISTRO HUELLAS DEL CONDUCTOR",
                  style: "header_tabla",
                  colSpan: 6,
                },
                {},
                {},
                {},
                {},
                {},
              ],
              [
                {
                  text: "Derecha".toUpperCase(),
                  fontSize: 10,
                },
                {
                  text: "Pulgar",
                  style: "header_tabla",
                },
                {
                  text: "Índice",
                  style: "header_tabla",
                },
                {
                  text: "Medio",
                  style: "header_tabla",
                },
                {
                  text: "Anular",
                  style: "header_tabla",
                },
                {
                  text: "Meñique",
                  style: "header_tabla",
                },
              ],
              [
                {
                  text: "Izquierda".toUpperCase(),
                  fontSize: 8,
                },
                {
                  text: "Pulgar",
                  style: "header_tabla",
                },
                {
                  text: "Índice",
                  style: "header_tabla",
                },
                {
                  text: "Medio",
                  style: "header_tabla",
                },
                {
                  text: "Anular",
                  style: "header_tabla",
                },
                {
                  text: "Meñique",
                  style: "header_tabla",
                },
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 ? 0 : 1;
            },
          },
          table: {
            widths: ["*", "*"],
            body: [
              [
                { text: `Nombre conductor`, style: "header_tabla" },
                { text: `Firma`, style: "header_tabla" },
              ],
              [
                {
                  text:
                    data.nombres_rut.trim().toUpperCase() +
                    ` ` +
                    data.primerApellido_rut.trim().toUpperCase() +
                    ` ` +
                    data.segundoApellido_rut.trim().toUpperCase(),
                  style: "h2",
                },
                { text: ` `, style: "h2" },
              ],
              [
                { text: `N. cédula`, style: "header_tabla" },
                { text: `Expedida en`, style: "header_tabla" },
              ],
              [
                { text: parseInt(data.identificacion_rut), style: "h2" },
                { text: data.ciudadexp_rut, style: "h2" },
              ],
            ],
          },
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {
                  text: `Documentos originales recueridos para `.toUpperCase(),
                  style: "header_tabla",
                  colSpan: 3,
                },
                {},
                {},
              ],
              [
                { text: `Conductor`, style: "header_tabla" },
                { text: `Vehiculo`, style: "header_tabla" },
                { text: `Tenedor`, style: "header_tabla" },
              ],
              [
                {
                  stack: [
                    "• Licencia de conduccion (por ambos lados)",
                    "• Cédula de Ciudadanía (por ambos lados)",
                    "• 2 Fotos:",
                    "    1 Con lo que normalmente use. Ej: Gorra, gafas",
                    "    1 Sin Gorra, gafas u otros accesorios",
                    "• Copia del pago de la ultima ARL",
                  ],
                },
                {
                  stack: [
                    "• SOAT",
                    "• Tarjeta de propiedad del vehiculo",
                    "• Tarjeta de propiedad del trailer (para tractomula)",
                    "• Revisión Tecnomecánica",
                    "  Nota: Para vehiculos nuevos se exigirá la RTM a los que tengan dos años contados a partir de la fecha de la matricula",
                    "• Foto del Cabezote frente",
                    "• Foto del Cabezote lado",
                    "• Foto del trailer con la placa visible",
                    "• Foto del numero del motor(legible)",
                    "• Foto del numero del chasis(legible)",
                    "• Carnet de la empresa de transporte donde esta afiliado",
                  ],
                },
                {
                  stack: [
                    "• RUT",
                    "• Autorización autenticada en notaría indicando a quien se le paga el flete y/o el anticipo, para casos en los que el tenedor solicite que el pago se haga a una persona diferente a él.",
                  ],
                },
              ],
            ],
          },
        },
      ],
      styles: {
        header_tabla: {
          alignment: "center",
          bold: true,
          fontSize: 10,
        },
        h2: {
          fontSize: 10,
        },
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

const remision_molino = (data) => {
  return new Promise((res, rej) => {
    var detalle = [];
    let subtotal = 0;

    data.productos.forEach((el) => {
      let obj = [
        el.nombre_servicio,
        { text: formatNumero(el.cantidad), alignment: "right" },
      ];

      detalle.push(obj);
    });

    const margin = {
      right: 40,
      left: 40,
    };

    var dd = {
      pageMargins: [margin.left, 110, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {
                width: "20%",
                stack: [
                  {
                    image: "logo",
                    fit: [100, 80],
                  },
                ],
              },
              {
                width: "40%",
                alignment: "center",
                bold: true,
                color: "#0074c1",
                fontSize: 12,
                stack: [
                  data.desripEmpresa,
                  `${data.tipoId}: ${data.idEmpresa}`,
                  data.direccionEmpresa,
                  data.ciudadEmpresa,
                ],
              },
              {
                width: "40%",
                alignment: "center",
                fontSize: 16,
                bold: true,
                stack: [
                  {
                    text: "Remisión de Mercancías",
                  },
                  {
                    text: `No. ${data.numero_fact.trim()}`,
                    color: "#ad190e",
                  },
                  {
                    margin: [margin.left, 0, margin.right, 0],
                    alignment: "right",
                    fontSize: 12,
                    text: "\nFecha de Remisión: " + data.fecha_factura,
                  },
                ],
              },
            ],
          },
        ];
      },
      styles: {
        header_tabla: {
          bold: true,
          alignment: "center",
        },
      },
      content: [
        {
          fontSize: 9,
          table: {
            widths: [350, 150, 150],
            body: [
              [
                "Destino:  " + data.nombre_cliente,
                "Nit: " + data.nit_cliente.trim(),
              ],
              [
                "Dirección: " +
                data.direccion_cliente.trim() +
                "  " +
                data.ciudad_cliente.trim(),
                "Telefonos:" + data.telefono_cliente,
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? "#ddd" : null;
            },
          },
        },
        {
          margin: [0, 15, 0, 0],
          fontSize: 9,
          table: {
            widths: [350, 150, 150],
            body: [
              [
                "Vehiculo:  " + data.tipoveh_cliente,
                "Placas: " + data.placa_pago.trim(),
              ],
              [
                "Conductor: " + data.conductor_cliente.trim(),
                "Identificación: " + data.idcond_cliente.trim(),
              ],
              ["Telefóno:  " + data.telcond_cliente.trim(), " "],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? "#ddd" : null;
            },
          },
        },
        {
          margin: [0, 15, 0, 0],
          fontSize: 9,
          table: {
            widths: [232, 100],
            body: [
              [
                { text: "DETALLE", style: "header_tabla" },
                { text: "CANTIDAD", style: "header_tabla" },
              ],
              ...detalle,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? "#ddd" : null;
            },
          },
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  text: [
                    {
                      text: "Observaciones: ",
                      bold: true,
                    },
                    {
                      text: data.observaciones,
                    },
                  ],
                  colSpan: 2,
                },
                null,
              ],
            ],
          },
        },
        {
          fontSize: 9,
          margin: [0, 50, 0, 0],
          columns: [
            {
              alignment: "left",
              stack: [
                "_____________________________",
                { text: `Elaborado`, bold: true },
                { text: data.elaboro, bold: true },
              ],
            },
            {
              alignment: "right",
              stack: [
                "_____________________________",
                { text: `Recibí Conforme`, bold: true },
                " ",
              ],
            },
          ],
        },
      ],
      images: {
        logo: data.logo,
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

export {
  hoja_vida_conductor,
  liquidamol,
  preliquidamol,
  pesaje_entrada,
  pesaje_salida,
  proceso_mol,
  proceso_trilla,
  proceso_secamiento,
  remision_molino,
};

