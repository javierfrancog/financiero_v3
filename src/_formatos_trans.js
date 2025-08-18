import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;



import printJS from "print-js";
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode/bin/JsBarcode'


var textToBase64Barcode = function (text) {
  var canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE128" });
  return canvas.toDataURL("image/png");
};

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

const ordenCombustible = (data) => {
  return new Promise(res => {
    const margin = {
      left: 20,
      right: 20
    };
    const lightGreen = "#a5ffc3"
    const subrayado = (string) => {
      return {
        margin: [0, -4.5, 0, 0],
        table: {
          widths: "*",
          heights: 5,
          body: [
            [{ text: string, border: [false, false, false, true] }]
          ]
        }
      }
    };
    const formatCaja = (string, color, height) => {
      return {
        layout: {
          fillColor: color ? color : ""
        },
        table: {
          widths: "*",
          heights: height ? height : 5,
          body: [
            [string]
          ]
        }
      }

    };
    var dd = {
      defaultStyle: {
        fontSize: 9,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldright: {
          bold: true,
          alignment: "right"
        },

      },
      pageMargins: [margin.left, 110, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          columns: [
            {
              width: "22%",
              image: data.logo,
              fit: [100, 100],
              margin: [0, 0, 0, 0]
            },
            {
              width: "45%",
              bold: true,
              fontSize: 10,
              stack: [
                { text: `${data.desripEmpresa.trim()}`, fontSize: 13, color: "green" },
                { margin: [0, 2, 0, 0], text: `Nit: ${data.idEmpresa}` },
                { margin: [0, 2, 0, 0], text: `${data.ciudadEmpresa} - ${data.dptoEmpresa} ` }

              ]
            },

            {
              width: "*",
              margin: [20, 0, 0, 0],
              alignment: "center",
              fontSize: 10,
              stack: [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [{ text: "ORDEN COMBUSTIBLE", style: "boldcenter", fillColor: lightGreen }],
                      [{ text: `N° ${parseFloat(data.nro_rep)}`, alignment: "center", fontSize: 11, color: "red" }]
                    ]
                  }
                },
                { text: [{ text: "Fecha: ", bold: true }, data.fecha_rep], margin: [0, 5, 0, 0] }
              ]
            }
          ]
        }

      },
      content: [
        {
          columns: [
            {
              width: "65%",
              stack: [
                {
                  columns: [
                    { text: "PLACAS:", width: "auto" },
                    subrayado(data.placa_rep),
                    { text: "VEHICULO:", width: "auto" },
                    subrayado(data.vehiculo_rep.trim())
                  ]
                },

                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "CONDUCTOR:", width: "auto" },
                    subrayado(data.nombre_conductor)
                  ]
                },
                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "CELULAR:", width: "auto" },
                    subrayado(data.celular_rep),
                    { text: "NRO. ORDEN INTERNA:", width: "auto" },
                    subrayado(parseFloat(data.nrointerno_rep)),
                  ]
                },
                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "PROPIETARIO:", width: "auto" },
                    subrayado(data.propietario_rep.trim())
                  ]
                },
                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "TIPO COMBUSTIBLE:", width: "auto" },
                    subrayado(data.combustible_rep.trim()),
                    { text: "VALOR:", width: "auto" },
                    subrayado(data.valor_rep.trim()),
                  ]
                },

              ]
            },
            {
              margin: [10, 20, 0, 0],
              columns: [
                { text: "ORDEN DE COMPRA N°", width: "30%", bold: true, fontSize: 10 },
                { ...subrayado(parseFloat(data.ordenservic_rep)), margin: [0, 5, 0, 0] }
              ]
            },
          ]
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              width: "48%",
              ...formatCaja({
                stack: [
                  { text: " ", margin: [0, 60, 0, 0] },
                  subrayado(" "),
                  { text: "DESPACHA: " + data.despacha_rep.trim(), alignment: "center", margin: [0, 3, 0, 0] }
                ]
              }, null, 100)
            },
            {
              width: "50%",
              margin: [5, 0, 0, 0],
              ...formatCaja({
                stack: [
                  { text: "FIRMA CONDUCTOR", margin: [0, 55, 0, 0], style: "boldcenter", color: "grey", fontSize: 14 },
                  subrayado(" "),
                  { text: `C.C. ${parseInt(data.idconductor_rep)}`, bold: true, margin: [0, 3, 0, 0] }
                ]
              }, null, 100)
            },
          ]
        },
        {
          style: "boldcenter",
          fontSize: 11,
          margin: [0, 3, 0, 0],
          text: `Cel: ${data.telefono} - Email: ${data.correo}`
        }
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};
const CompEgreso = (data) => {
  return new Promise(res => {
    const margin = {
      left: 20,
      right: 20
    };
    const lightGreen = "#a5ffc3"
    const subrayado = (string) => {
      return {
        margin: [0, -4.5, 0, 0],
        table: {
          widths: "*",
          heights: 5,
          body: [
            [{ text: string, border: [false, false, false, true] }]
          ]
        }
      }
    };
    const formatCaja = (string, color, height) => {
      return {
        layout: {
          fillColor: color ? color : ""
        },
        table: {
          widths: "*",
          heights: height ? height : 5,
          body: [
            [string]
          ]
        }
      }

    };
    var dd = {
      defaultStyle: {
        fontSize: 9,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldright: {
          bold: true,
          alignment: "right"
        },

      },
      pageMargins: [margin.left, 110, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          columns: [
            {
              width: "22%",
              image: data.logo,
              fit: [100, 100],
              margin: [0, 0, 0, 0]
            },
            {
              width: "45%",
              bold: true,
              fontSize: 10,
              stack: [
                { text: `${data.desripEmpresa.trim()}`, fontSize: 13, color: "green" },
                { margin: [0, 2, 0, 0], text: `Nit: ${data.idEmpresa}` },
                { margin: [0, 2, 0, 0], text: `${data.ciudadEmpresa} - ${data.dptoEmpresa} ` }

              ]
            },

            {
              width: "*",
              margin: [20, 0, 0, 0],
              alignment: "center",
              fontSize: 10,
              stack: [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [{ text: "COMPROBANTE DE EGRESO", style: "boldcenter", fillColor: lightGreen }],
                      [{ text: `N° ${parseFloat(data.nro_rep)}`, alignment: "center", fontSize: 11, color: "red" }]
                    ]
                  }
                },
                { text: [{ text: "Fecha: ", bold: true }, data.fecha_rep], margin: [0, 5, 0, 0] }
              ]
            }
          ]
        }

      },
      content: [
        {
          columns: [
            {
              width: "65%",
              stack: [
                {
                  columns: [
                    { text: "PLACAS:", width: "auto" },
                    subrayado(data.placa_rep),
                    { text: "VEHICULO:", width: "auto" },
                    subrayado(data.vehiculo_rep.trim())
                  ]
                },

                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "CONDUCTOR:", width: "auto" },
                    subrayado(data.nombre_conductor)
                  ]
                },
                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "CELULAR:", width: "auto" },
                    subrayado(data.celular_rep),
                    { text: "NRO. INTERNO:", width: "auto" },
                    subrayado(parseFloat(data.nrointerno_rep)),
                  ]
                },
                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "PROPIETARIO:", width: "auto" },
                    subrayado(data.propietario_rep.trim())
                  ]
                },
                {
                  margin: [0, 5, 0, 0],
                  columns: [
                    { text: "VALOR:", width: "auto" },
                    subrayado(data.valor_rep.trim()),
                  ]
                },

              ]
            },
            {
              margin: [10, 20, 0, 0],
              columns: [
                { text: "ORDEN DE COMPRA N°", width: "30%", bold: true, fontSize: 10 },
                { ...subrayado(parseFloat(data.ordenservic_rep)), margin: [0, 5, 0, 0] }
              ]
            },
          ]
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              width: "48%",
              ...formatCaja({
                stack: [
                  { text: " ", margin: [0, 60, 0, 0] },
                  subrayado(" "),
                  { text: "ELABORA: " + data.despacha_rep.trim(), alignment: "center", margin: [0, 3, 0, 0] }
                ]
              }, null, 100)
            },
            {
              width: "50%",
              margin: [5, 0, 0, 0],
              ...formatCaja({
                stack: [
                  { text: "FIRMA CONDUCTOR", margin: [0, 55, 0, 0], style: "boldcenter", color: "grey", fontSize: 14 },
                  subrayado(" "),
                  { text: `C.C. ${parseInt(data.idconductor_rep)}`, bold: true, margin: [0, 3, 0, 0] }
                ]
              }, null, 100)
            },
          ]
        },
        {
          style: "boldcenter",
          fontSize: 11,
          margin: [0, 3, 0, 0],
          text: `Cel: ${data.telefono} - Email: ${data.correo}`
        }
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};

const remision = (data) => {
  return new Promise((res) => {
    const margin = {
      left: 20,
      right: 20,
    };
    const lightGreen = "#a5ffc3"
    const lime = "#70ad47"
    const verdepastoclaro = "#cdeac0"
    const subrayado = (string) => {
      return {
        margin: [0, -6.0, 0, 0],
        table: {
          widths: "*",
          heights: 5,
          body: [
            [{ text: string, border: [false, false, false, true] }]
          ]
        }
      }
    };

    const subrayado6 = (texto = "", ancho = 150) => {
      return {
        margin: [6, -2, 0, 0],
        alignment: "center",
        table: {
          widths: [ancho],
          body: [
            [{
              text: texto,
              border: [false, false, false, true],
              fontSize: 9,
              alignment: "center",
            }]
          ]
        },
        layout: {
          hLineWidth: (i) => (i === 1 ? 1 : 0),
          vLineWidth: () => 0
        }
      };
    };

    const [ano, mes, dia] = data.fechacorta_rep.split("-");
    data.fecha_dia = dia;
    data.fecha_mes = mes;
    data.fecha_ano = ano.slice(2);


    const subrayad1 = (string) => {
      return {
        margin: [0, -6.0, 0, 0],

        table: {
          widths: [90],
          heights: 5,
          body: [
            [{ text: string, border: [false, false, false, true] }]
          ]
        }
      }
    };

    const formatCaja = (string, color, height) => {
      return {
        layout: {
          fillColor: color ? color : ""
        },
        table: {
          widths: "*",
          heights: height ? height : 5,
          body: [
            [string]
          ]
        }
      }
    };


    const formatCajaRedondaTabla = ({
      tableBody,
      width = 140,
      height = 50,
      borderRadius = 10,
      borderColor = 'black',
      borderWidth = 1,
      fillColor = '#ffffff',
      headerColor = null,
      headerHeight = 20,
      margin = [0, 0, 0, 0]
    }) => {
      return {
        margin: margin,
        stack: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: width,
                h: height,
                r: borderRadius,
                lineWidth: borderWidth,
                lineColor: borderColor,
                color: fillColor
              }
            ]
          },
          ...(headerColor ? [{
            canvas: [
              {
                type: 'rect',
                x: 1,
                y: 1,
                w: width - 2,
                h: headerHeight,
                color: headerColor
              }
            ],
            margin: [0, -height, 0, 0]
          }] : []),
          {
            margin: [0, 0, 0, 0],
            layout: 'noBorders',
            table: {
              widths: ["*"],
              body: tableBody
            }
          }
        ]
      };
    };


    const contenido = (copia) => {
      let material = "";
      data.idcond_cliente = data.idcond_cliente.replace(/,/g, ".")
      material = window.atob(
        data.productos[0].base1_pr +
        data.productos[0].base2_pr +
        data.productos[0].base3_pr +
        data.productos[0].base5_pr
      );
      let volumen = data.productos[0].cantidad;
      return {
        stack: [
          {
            image: data.logo,
            fit: [200, 250],
            alignment: 'left',
            margin: [0, 0, 0, 10]
          },
          { width: 110, text: "" },

          {
            margin: [252, -50, 0, 5],
            stack: [

              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 73,
                    h: 32,
                    r: 6,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                  }
                ]
              },

              {
                margin: [0, -32, 0, 0],
                table: {
                  widths: [25, 30],
                  body: [
                    [{ text: "COIGO:", style: "style2" }, { text: "FR-PO-ALV-27", style: "style3" }],
                    [{ text: "VERSION:", style: "style2" }, { text: "0.1", style: "style3" }],
                    [{ text: "FECHA:", style: "style2" }, { text: "06/04/2021", style: "style3" }]
                  ]
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 0 : 0.5; // líneas internas solamente
                  },
                  vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0 : 0.5; // líneas internas solamente
                  },
                  hLineColor: () => '#000',
                  vLineColor: () => '#000'
                }

              }
            ]
          },

          {
            margin: [360, -60, 0, 0],
            stack: [

              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 20,
                    w: 180,
                    h: 40,
                    r: 6,
                    lineWidth: 1,
                    lineColor: 'black',
                    color: '#ffffff'
                  }
                ],
              },
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 180,
                    h: 20,
                    r: 6,
                    color: '#cdeac0'
                  }
                ],
                margin: [0, -40, 0, 0]
              },

              {
                margin: [0, -52, 0, 0],
                layout: 'noBorders',
                table: {
                  widths: ['*'],
                  body: [
                    [{ text: 'REMISION', alignment: 'center', bold: true, margin: [0, 35, 0, 0] }],
                    [{ text: `N° ${data.numero_fact}`, alignment: 'center', color: 'red', fontSize: 11 }]
                  ]
                }
              }
            ]
          },
          {
            margin: [360, 16, 0, 0],
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 180,
                    h: 35,
                    r: 6,
                    lineWidth: 1,
                    lineColor: 'black',
                    color: '#ffffff'
                  },
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 179,
                    h: 20,
                    r: 6,
                    color: '#cdeac0'
                  }
                ]
              },
              {
                margin: [0, -51, 0, 0],
                table: {
                  widths: [51, 52, 51],
                  body: [
                    [
                      {
                        text: 'FECHA',
                        colSpan: 3,
                        alignment: 'center',
                        color: '#000000',
                        bold: true,

                        margin: [0, 17, 0, 3],
                      }, {}, {}
                    ],
                    [
                      { text: data.fecha_dia || ' ', alignment: 'center' },
                      { text: data.fecha_mes || ' ', alignment: 'center' },
                      { text: data.fecha_ano || ' ', alignment: 'center' }
                    ]
                  ]
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 0 : 1;
                  },
                  vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                  },
                  hLineColor: () => '#000',
                  vLineColor: () => '#000'
                }
              }
            ]
          },



          {
            margin: [-10, -40, 0, 0],
            fontSize: 8,
            stack: [
              {
                layout: "noBorders",
                table: {
                  widths: ["34%", "30%"],
                  body: [
                    [
                      {
                        stack: [
                          { text: 'PLACAS: ', bold: true },
                          { text: data.placa_pago || '', margin: [80, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 35, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          { text: 'VEHÍCULO: ', bold: true },
                          { text: data.marcaveh_cliente || '_____', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 40, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      }
                    ],
                    [
                      {
                        stack: [
                          { text: 'MODELO: ', bold: true },
                          { text: data.modelo_rem || '_____', margin: [80, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 40, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          { text: 'COLOR: ', bold: true },
                          { text: data.color_rem || '_____', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 30, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      }
                    ],
                    [
                      {
                        stack: [
                          { text: 'CONDUCTOR: ', bold: true },
                          { text: data.conductor_cliente || '_____', margin: [130, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 53, y1: 0, x2: 350, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ],
                        colSpan: 2,
                        alignment: 'left'
                      },
                      {}
                    ],

                    [
                      {
                        stack: [
                          { text: 'CELULAR: ', bold: true },
                          { text: data.telcond_cliente || '_____', margin: [80, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 40, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }

                        ]
                      },
                      {
                        stack: [
                          { text: 'C.C: ', bold: true },
                          { text: data.idcond_cliente || '_____', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 18, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      }
                    ],
                    [
                      {
                        stack: [
                          { text: 'MATERIAL: ', bold: true },
                          { text: data.productos[0].nombre_servicio || '_____', margin: [80, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 45, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          { text: 'FUENTE: ', bold: true },
                          { text: data.productos[0].origen || '_____', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 35, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      }
                    ],
                    [
                      {
                        stack: [
                          { text: 'LUGAR DE DESCARGUE: ', bold: true },
                          { text: data.productos[0].destino || '_____', margin: [95, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 90, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          { text: 'VOLUMEN: ', bold: true },
                          { text: data.productos[0].cantidad || '_____', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 40, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      }
                    ],
                    [
                      {
                        stack: [
                          { text: 'RECIBO ACPM: ', bold: true },
                          { text: data.rccombust_rem || '_____', margin: [80, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 55, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          { text: 'VALOR: ', bold: true },
                          { text: data.combustible_rem || '_____', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 30, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      }
                    ],
                    [
                      {
                        stack: [
                          { text: 'RECIBO N.ANTICIPO:  ', bold: true },
                          { text: data.rcanticipo_rem || '_____', margin: [80, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 78, y1: 0, x2: 170, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          { text: 'VALOR: ', bold: true },
                          { text: data.anticipo_rem || '__', margin: [60, -10, 0, 0] },
                          {
                            canvas: [
                              { type: 'line', x1: 30, y1: 0, x2: 160, y2: 0, lineWidth: 1 }
                            ]
                          }
                        ]
                      },
                    ]
                  ]
                }
              }
            ]
          },
          {
            width: "*",
            margin: [360, -50, 0, 0],
            fontSize: 8,
            stack: [
              {
                margin: [0, 0, 0, 4],
                columns: [
                  { text: "ORDEN DE COMPRA N°", width: "50%", bold: true },
                  subrayado(data.orden_cliente)
                ]
              },
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0,
                        y: 0,
                        w: 180,
                        h: 150,
                        r: 10,
                        color: '#cdeac0',
                        lineColor: '#000000'
                      }
                    ]
                  },
                  {
                    margin: [10, -140, 10, 0],
                    stack: [
                      { text: "RECIBIDO CLIENTE", style: "boldcenter", margin: [12, 0, 0, 6], fontSize: 10, alignment: "center" },
                      {
                        columns: [
                          { text: "CLIENTE:", width: "auto" },
                          subrayado(data.nombre_cliente)
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [
                          { text: "HORA:______________", width: "auto" },
                          subrayado,
                          { text: "FECHA:_____________", width: "auto" },
                          subrayado
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [
                          { text: "KM DE DESCARGUE:_____________________", width: "auto" },
                          subrayado
                        ]
                      },
                      { text: "FIRMA Y SELLO QUIEN RECIBE", margin: [10, 15, 0, 0], style: "boldcenter", color: "grey", fontSize: 12 },
                      subrayado(" "),
                      { text: "NOMBRE LEGIBLE Y SELLO QUIEN RECIBIO", style: "boldcenter", margin: [-3, 3, 0, 0] },
                      { text: "C.C", bold: true }
                    ]
                  }
                ]
              },

              {
                fontSize: 6,
                margin: [0, 20, 0, 0],
                text: "LA FIRMA PUESTA POR TERCEROS EN REPRESENTACION MANDATO U OTRA CALIDAD SIMILAR A NOMBRE DEL COMPRADOR IMPLICA SU OBLIGACION (ART. 640 DEL CODIGO DE COMERCIO)", alignment: "justify"
              },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 180, y2: 0,
                    lineWidth: 1,
                    dash: { length: 2 }
                  }
                ],
                margin: [0, 8, 0, 0]
              },

              {
                fontSize: 9, bold: true,
                margin: [0, 2, 0, 0],
                text: "GRUPO EMPRESARIAL JAELFA",
                alignment: "center"
              }
            ]
          },
          {
            columns: [
              {
                width: "63%",
                fontSize: 8,
                stack: [
                  { style: "boldcenter", text: "ESTE DOCUMENTO SE ASEMEJA A UN TITULO VALOR, SU PERDIDA O MAL DILIGENCIAMIENTO IMPLICA EL NO PAGO DEL TRANSPORTE- NO SE ACEPTAN COPIAS NI ENMENDADURAS", color: "green", margin: [-10, -160, 0, 0], alignment: "center" },

                  {
                    margin: [-8, 4, 0, 0],
                    columns: [
                      {
                        width: "50%",
                        stack: [
                          {
                            canvas: [
                              {
                                type: 'rect',
                                x: 0,
                                y: 0,
                                w: 170,
                                h: 90,
                                r: 10,
                                color: '#ffffff',
                                lineColor: '#000000'
                              }
                            ]
                          },
                          {
                            margin: [0, -70, 10, 0],
                            stack: [
                              { text: data.elaboro || '_', alignment: "center", bold: true, fontSize: 10, margin: [10, 30, 0, 0] },
                              subrayado6(" "),
                              { text: "DESPACHA", alignment: "center", margin: [10, 3, 0, 0] }
                            ]
                          }
                        ]
                      },
                      {
                        width: "45%",
                        margin: [5, 0, 0, 0],
                        stack: [
                          {
                            canvas: [
                              {
                                type: 'rect',
                                x: 0,
                                y: 0,
                                w: 170,
                                h: 90,
                                r: 10,
                                lineColor: '#000000',
                                color: '#ffffff'
                              }
                            ]
                          },
                          {
                            margin: [10, -70, 10, 0],
                            stack: [
                              { text: "TRANSPORTA", bold: true, alignment: "left", margin: [-4, -12, 0, 0] },
                              {
                                text: "FIRMA CONDUCTOR",
                                margin: [20, 21, 0, 0],
                                style: "boldcenter",
                                color: "grey",
                                fontSize: 14
                              },
                              {
                                canvas: [
                                  {
                                    type: 'line',
                                    x1: 0,
                                    y1: 0,
                                    x2: 160,
                                    y2: 0,
                                    lineWidth: 1

                                  }
                                ],
                                margin: [-5, 4, 0, 0]
                              },
                              {
                                text: "C.C. " + (data.idcond_cliente || "___________"),
                                bold: true,
                                alignment: "left",
                                margin: [0, 3, 0, 0]
                              }
                            ]
                          }
                        ]
                      }

                    ]
                  },

                  {
                    bold: true,
                    color: "black",
                    margin: [20, 4, 0, 0],
                    text: `PBX: 682 42 52 - Cel: 320 310 65 37 - Email: grupoempresarialjaelfa@gmail.com`
                  }
                ]
              }
            ]
          },

          copia ? {
            bold: true,
            margin: [0, 1, 0, 0],
            fontSize: 10,
            text: copia,
            alignment: "center"
          } : {
            bold: true,
            margin: [0, 1, 0, 0],
            fontSize: 10,
            text: "ORIGINAL",
            alignment: "center"
          }
        ]
      }
    }

    var dd = {
      pageSize: "LETTER",
      pageOrientation: "portrait",
      width: 612,
      height: 396,
      defaultStyle: {
        fontSize: 9,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldright: {
          bold: true,
          alignment: "right"
        },
        style2: {
          bold: true,
          fontSize: 5,
          italics: true
        },
        style3: {
          bold: false,
          fontSize: 5,
          italics: true
        },
        styletabla: {
          bold: false,
          border: true
        },
        style7: {
          bold: false,
          border: true,
          alignment: "center",
          margin: [0, 40, 0, 3],
        },

      },

      content: [
        contenido("-ORIGINAL-"), // Primera sección
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 520,
              y2: 0,
              lineWidth: 1,
              alignment: 'right',
              dash: { length: 5, space: 5 },
              lineColor: '#000000'
            }
          ],
          margin: [0, 0, 0, 5]
        },
        contenido("-CLIENTE-"), // Segunda sección
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 520,
              y2: 0,
              lineWidth: 1,
              dash: { length: 5, space: 5 },
              lineColor: '#000000'
            }
          ],
          margin: [0, 0, 0, 5]
        },
        contenido("-CANTERA-") // Tercera sección
      ]
    };


    pdfMake.createPdf(dd).open();
    res();

  })
};


const ordensal_sar = (data) => {
  return new Promise(res => {
    let stylePDF = {
      pageSize: {
        width: 200,
        height: "auto",
      },
      pageMargins: [20, 10, 10, 10],
    };

    let linea = {
      text:
        "------------------------------------------",
      bold: true,
      fontSize: 12,
    };
    let tipo = (data.tipo_rep == "1") ? "DESPACHO S.A.R." :
      (data.tipo_rep == "2") ? "ORDEN DE SALIDA" :
        "ORDEN DE DESPACHO";

    var dd = {
      ...stylePDF,
      content: [
        {
          stack: [
            {
              columns: [
                {
                  image: data.logo,
                  width: 80,
                  height: 40,
                },
                {
                  image: data.logoSuper,
                  width: 80,
                  height: 40,
                },
              ],
            },
          ],
        },
        { ...linea },
        {
          margin: [10, 5, 10, 0],
          stack: [{ text: tipo }],
          style: "header",
        },
        { ...linea },
        {
          columns: [

            {
              style: "subtitles",
              stack: [
                "NUMERO:",
                "ORIGEN:",
                " ",
                "DESTINO:",
                " ",
                "HORA:"
              ]
            },
            {
              style: "contenido1",
              stack: [
                { text: parseFloat(data.nro_rep), bold: true },
                `${parseFloat(data.codorig_rep)} - ${data.descrorig_rep.trim()}\n`,
                `${parseFloat(data.coddest_rep)} - ${data.descrdest_rep.trim()}\n\n`,
                data.hora_rep,
              ]
            },
          ],
        },
        { ...linea },

        {
          columns: [
            {
              style: "subtitles",
              stack: [
                "VEHÍCULO:",
                "NRO_INTERNO:",
                "CONDUCTOR:",
                "PREOPERACIONAL:",
              ]
            },
            {
              style: "right",
              stack: [
                data.placa_rep,
                { text: parseFloat(data.interno_rep), bold: true },
                parseFloat(data.idconductor_rep),
                " ",
              ]
            }
          ]
        },
        { ...linea },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 15,
          alignment: "center"
        },
        contenido1: {
          fontSize: 10,
          alignment: "left",
        },
        subtitles: {
          bold: true,
          fontSize: 10,
        },
        right: {
          alignment: "right",
          fontSize: 10
        }
      }
    };


    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        }
      })
    })



    // pdfMake.createPdf(dd).open();
    // res();




  })
};

const recibo_caja = (data) => {
  return new Promise(res => {
    let stylePDF = {
      pageSize: {
        width: 200,
        height: "auto",
      },
      pageMargins: [20, 10, 10, 10],
    };
    let watermark =
    {
      text: data.marca_agua,
      angle: 60,
      color: "black",
      opacity: 0.2,
      fontSize: 70,
    };

    let linea = {
      text:
        "------------------------------------------",
      bold: true,
      fontSize: 12,
    };

    const objRegistros = []
    let totalRegistros = 0
    data.registros.forEach(item => {
      objRegistros.push({
        margin: [0, 10, 0, 0],
        columns: [
          {
            width: '35%',
            style: "contenido1",
            fontSize: 9,
            table: {
              widths: [100],
              body: [
                [{ text: "Id:", bold: true, alignment: "left" }],
                [{ text: "Concepto:", bold: true, alignment: "left" }],
                [{ text: "Detalle:", bold: true, alignment: "left" }],
                [{ text: "Valor:", bold: true, alignment: "left" }]
              ]
            },
            layout: {
              hLineWidth: function (i, node) {
                return 0;
              },
              vLineWidth: function (i, node) {
                return 0;
              },
            }
          },
          {
            style: "contenido1",
            fontSize: 9,
            table: {
              widths: [100],
              body: [
                [{ text: parseFloat(item.idrut), alignment: "left" }],
                [{ text: item.concepto.trim(), alignment: "left" }],
                [{ text: item.detalle.trim() || '\n', alignment: "left" }],
                [{ text: "$" + item.valor.trim(), alignment: 'left', fontSize: 8 }]
              ]
            },
            layout: {
              hLineWidth: function (i, node) {
                return 0;
              },
              vLineWidth: function (i, node) {
                return 0;
              },
            }
          }
          // {
          //   style: "contenido1",
          //   fontSize: 7,              
          //   stack: [
          //     { text: parseFloat(item.idrut), alignment: "left" },
          //     { text: item.concepto.trim(), alignment:'left'},               
          //     { text: item.detalle.trim() || '\n', alignment:'left'},               
          //     //{ text: item.detalle.trim() || '\n', alignment:'left'},               
          //     { text: "$" + item.valor.trim(), alignment:'left', fontSize: 8},
          //     " "
          //   ]
          // }
        ]
      })

      totalRegistros += parseFloat(item.valor.replace(/\,/g, "")) || 0
    })

    objRegistros.push({
      columns: [
        {
          text: "\nTotal: ",
          bold: true,
          fontSize: 12
        },
        { text: "\n $" + formatNumero(totalRegistros), alignment: 'left', fontSize: 12, bold: true, },
      ]
    })

    var dd = {
      watermark,
      ...stylePDF,
      content: [
        {
          stack: [
            {
              columns: [
                {
                  image: data.logo,
                  width: 80,
                  height: 40,
                },
                {
                  image: data.logoSuper,
                  width: 80,
                  height: 40,
                },
              ],
            },
          ],
        },
        { ...linea },
        {
          margin: [10, 5, 10, 0],
          text: data.tipo === "001" ? "RECIBO PROVISIONAL DE CAJA" : "COMPROBANTE DE EGRESO",
          fontSize: 10,
          bold: true
        },
        { ...linea },
        {
          columns: [
            {
              width: '40%',
              style: "subtitles",
              stack: [
                { text: "NUMERO:", bold: true },
                "Fecha:",
                "Taquilla:",
                " ",
                " ",
                "Placa:",
                "Nro interno:",
                "Detalle Ppal:"
              ]
            },
            {
              style: "contenido1",
              fontSize: 9,
              stack: [
                { text: parseFloat(data.consecutivo), bold: true, alignment: "left" },
                { text: data.fecha.trim(), alignment: 'left' },
                { text: data.descrip_agc.trim(), alignment: 'left' },
                { text: " " },
                { text: data.registros[0].placa, alignment: 'left' },
                { text: data.registros[0].nrointerno.trim(), alignment: 'left' },
                { text: data.detallegral.trim(), alignment: 'left' },
              ]
            },
          ],
        },
        { ...linea },


        ...objRegistros,
        { ...linea },
        {
          columns: [
            {
              style: "subtitles",
              stack: [
                data.tipo === "001" ? "Recibido por:" : "Elaborado por:",
                " ",
                " ",
                "Hora:",
              ]
            },
            {
              style: "contenido1",
              fontSize: 9,
              stack: [
                { text: data.descrelabora.trim(), alignment: 'left' },
                { text: " " },
                { text: data.hora.trim(), alignment: 'left' },
              ]
            },
          ]
        },
        { ...linea },

      ],
      styles: {
        header: {
          bold: true,
          fontSize: 15,
          alignment: "center"
        },
        contenido1: {
          fontSize: 10,
          alignment: "left",
        },
        subtitles: {
          bold: true,
          fontSize: 10,
        },
        right: {
          alignment: "right",
          fontSize: 10
        }
      }
    };
    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        }
      })
    })
  });

  //   pdfMake.createPdf(dd).open();
  //   res();
  // })
};

const tiquete_transporte = async (data, fecha, hora) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_tiq
  let qr = await QRCode.toDataURL(url);


  let watermark =
    data.estado_tiq === "0"
      ? ""
      : {
        text: "Anulado",
        angle: 60,
        color: "black",
        opacity: 0.2,
        fontSize: 100,
      };
  let tiquete = parseFloat(data.nro_tiq);
  let nrodian = "DETP" + parseFloat(data.nrodian_tiq);
  let fechaelabora = parseFloat(data.fechaelab_tiq);
  let nroint = parseFloat(data.nrointer_tiq);
  let agencia = data.descagencia_tiq;
  let taquillero = data.taquillero_tiq;
  let nroPasajeros = data.pasajeros.length;
  let destino = data.destino_tiq.trim();
  let total = 0;
  let idPas = [];
  let nombres = [];
  let dcto = 0;
  let bruto = 0;
  let stylePDF = {
    pageSize: {
      width: 200,
      height: "auto",
    },
    pageMargins: [20, 10, 10, 10],
  };

  data.pasajeros = data.pasajeros.filter(item => item.idpasajero_tiq);
  data.pasajeros.forEach((pa) => {
    pa.idpasajero_tiq = pa.idpasajero_tiq.trim();
    idPas.push(parseFloat(pa.idpasajero_tiq));
    nombres.push(pa.nombrepasajero_tiq.trim() + "\n");
    dcto += parseFloat(pa.dcto_tiq.replace(/\,/g, ""));
    bruto += parseFloat(pa.vlrbruto_tiq.replace(/\,/g, ""));

    total += parseFloat(pa.vlrneto_tiq.replace(/\,/g, "")) || 0;
  });

  let linea = {
    text:
      "--------------------------------------------------------",
    bold: true,
    fontSize: 8,
  };

  let sillas = data.pasajeros.map(item => item.silla_tiq)
  return new Promise((res) => {
    let formapago = "";

    switch (data.pasajeros[0].formapago_tiq) {
      case "01":
        formapago = "Efectivo";
        break;
      case "02":
        formapago = "Tarjeta crédito";
        break;
      case "03":
        formapago = "Débito/Qr.";
        break;
      case "04":
        formapago = "Otro";
        break;
      case "06":
        formapago = "Yates";
        break;
      case "07":
        formapago = "Redbus";
        break;
      case "08":
        formapago = "Reserva";
        break;
      case "09":
        formapago = "Convenio Brasilia";
        break;
      case "10":
        formapago = "Pin Bus";
        break;
      case "11":
        formapago = "Gamarra";
        break;

    }

    var dd = {
      watermark,
      ...stylePDF,
      content: [
        { text: `${fecha} ${hora}\n\n`, fontSize: 3 },
        {
          stack: [
            {
              columns: [
                {
                  image: data.logo,
                  width: 100,
                  height: 50,
                },
                {
                  image: data.logoSuper,
                  width: 100,
                  height: 50,
                },
              ],
            },
          ],
        },
        {
          stack: [{ text: "TAX META S.A" }, { text: "Nit. 892000113 - 0" }],
          style: "titulo1",
        },
        {
          stack: [{ text: "TIQUETE TRANSPORTE DE PASAJEROS" }],
          style: "titulo2",
        },

        {
          stack: [
            {
              text:
                "Documento equivalente a factura de venta Art5. Decreto 1165 - 1996 Póliza No 1003610861004",
            },
            { text: "Seguros Comerciales Bolivar SA" },
          ],
          style: "titulo3",
        },

        (data.iddian_tiq) ? {
          width: 110,
          margin: [30, 0, 0, 0],
          image: qr,
        } : {},

        { ...linea },
        { text: "ORIGINAL", style: "center" },
        { ...linea },
        {
          columns: [
            {
              stack: [
                "Consecutivo Dian: ",
                "Nro:",
                "Taquilla:",
                "Vendedor:",
                " ",
                "Expedición:",
                "Origen:",
                " ",
                "Destino:",
                " ",
                "Fecha viaje:",
                "Hora sala:",
              ],
              style: "contenido1",
            },
            {
              stack: [
                { text: `${nrodian}\n`, bold: true },
                { text: `${tiquete}\n`, bold: true, alignment: "left", },
                { text: `${agencia}\n`, fontSize: 8, alignment: "left", },
                { text: `${taquillero}`, fontSize: 8, alignment: "left", },
                { text: `${data.fechaelab_tiq}` + " Hora:" + `${data.horaelab_tiq}`, fontSize: 8, alignment: "left", },
                `${data.origen_tiq.trim()}\n`,
                `${destino}\n\n`,
                `${data.fechaemb_tiq}`,
                `${data.horaemb_tiq}\n\n`,
              ],
              style: "contenido2",
            },
          ],
        },
        {
          text: "Vehículo:" + `${nroint} - ${data.placa_tiq}\n\n`,
          fontSize: 12,
          alignment: "center",
          bold: true,
        },
        {
          columns: [
            {
              stack: [
                "Servicio:",
                "Pasajeros:",
                "Sillas:",
                "Cliente:",
                ...idPas,
              ],
              style: "contenido3",
            },
            {
              stack: [
                "\n",
                `${nroPasajeros}\n`,
                { text: `${sillas.join(',')}\n`, bold: true },
                "\n",
                ...nombres,
              ],
              style: "contenido2",
            },
          ],
        },
        { ...linea },
        {
          columns: [
            {
              stack: [
                "Forma de pago:",
                "Valor Tiquete:",
                "Descuento:",
                { text: "TOTAL:", fontSize: 12, bold: true },
              ],
              style: "contenido3",
            },
            {
              stack: [
                `${formapago}\n`,
                `$${formatNumero(bruto) || "00"}\n`,
                `$${formatNumero(dcto) || "00"}\n`,
                { text: `${formatNumero(total)}\n`, fontSize: 12, bold: true },
                // `$ ${formatNumero(total)}\n`,
              ],
              style: "contenido2",
            },
          ],
        },
        {
          stack: [
            { text: "Condiciones de viaje:", bold: true },
            "En caso de daño imprevisto del vehículo al presentarse cualquier inconveniente en la vía,el conductor hará lo posible para que los pasajeros puedan continuar el viaje, la empresa no asume responsabilidad por perjuicios ocasionados por esta causa.",
            "El pasajero declara conocer las condiciones de la empresa y asume la responsabilidad y riesgo del transporte",
            "- Todo pasajero tiene derecho a llevar 15 kilos de equipaje pero la empresa no se responsabiliza por el contenido,perdida o cambios de maletas u otros objetos.",
            "- Pasajero que no se presenta a la hora de salida perderá el valor del pasaje",
            "- Si su equipaje contiene objetos de valor deberá aforarlos",
            "- Si lleva equipaje reclame su sticker.",
            "Vigilado superintendencia de Puertos y Transporte",
          ],
          style: "pie1",
          margin: [0, 10, 0, 0],
        },
        { text: `CUFE: : ${data.iddian_tiq}`, margin: [0, 10, 0, 0], fontSize: 6, style: "contenido3", },
        { ...linea },
        {
          stack: [
            "Calle 38 32-41 - Villavicencio",
            "310.563.5045",
            // { text: `${tiquete}\n`, bold: true },
            "Fabricante y nombre del software:",
            "TITAN SOLUCIONES SAS",
            "901.289.171",
          ],
          style: "pie2",
        },
      ],
      styles: {
        titulo1: {
          fontSize: 14,
          alignment: "center",
          bold: true,
        },
        titulo2: {
          fontSize: 10,
          alignment: "center",
          bold: true,
        },
        titulo3: {
          fontSize: 8,
          alignment: "center",
        },
        contenido1: {
          fontSize: 10,
          alignment: "left",
        },
        contenido2: {
          fontSize: 10,
          alignment: "right",
        },

        contenido3: {
          fontSize: 10,
          alignment: "left",
        },

        pie1: {
          fontSize: 8,
          alignment: "center",
        },

        pie2: {
          fontSize: 8,
          alignment: "center",
        },

        center: {
          fontSize: 14,
          alignment: "center",
        },

        right: {
          fontSize: 16,
          alignment: "right",
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: async () => {
          var dd = {
            watermark,
            content: [
              { text: `${fecha} ${hora}\n\n`, fontSize: 10 },
              { ...linea },
              {
                columns: [
                  {
                    stack: [
                      "Número tiquete:",
                      "Forma Pago",
                      "Taquilla:",
                      "Vehículo:",
                      "Destino:",
                      " ",
                      " ",
                      "Valor:",
                      "  ",
                      "  ",
                      "Pasajeros:",
                      ...idPas,

                    ],
                    fontSize: 8,
                  },
                  {
                    stack: [
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      " ",
                      { text: `${nombres}\n`, fontSize: 8, alignment: "left", },
                    ],
                    fontSize: 8,
                  },

                  {
                    stack: [
                      { text: `${tiquete}\n`, bold: true },
                      { text: `${formapago}\n`, bold: false },
                      { text: `${agencia}\n`, fontSize: 6, alignment: "left", },
                      `${nroint}\n`,
                      `${destino}\n\n`,
                      `$ ${formatNumero(total)}\n\n\n`,
                      // `\n${nombres}\n`,
                      " ",
                      `${nroPasajeros}\n`,
                    ],
                    style: "right",
                  },
                  {
                    stack: [
                      " ",
                    ],
                    fontSize: 8,
                  },

                ],
              },
              { ...linea },
            ],
            styles: {
              center: {
                fontSize: 6,
                alignment: "center",
              },
              right: {
                fontSize: 10,
                alignment: "right",
              },
            },
            pageSize: {
              width: 200,
              height: "auto",
            },
            defaultStyle: {
              fontSize: 8,
            },

            pageMargins: [10, 10, 0, 10],
          };


          await new Promise(r => setTimeout(r, 1000));
          const pdfDocGenerator = pdfMake.createPdf(dd);
          pdfDocGenerator.getBlob((blob2) => {
            printJS({
              printable: URL.createObjectURL(blob2),
              onPrintDialogClose: () => {
                res();
              },
            });
          });
        },
      });
    });
  });
};
const cuadre_cajatr = (data) => {
  return new Promise((res) => {
    let stylePDF = {
      pageSize: {
        width: 200,
        height: "auto",
      },
      pageMargins: [20, 10, 10, 10],
    };
    let watermark =
      data.estado_rep.trim() === "Activo"
        ? ""
        : {
          text: "Anulado",
          angle: 60,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        };
    let ventas = parseFloat(data.ventas_cua.replace(/\,/g, "")) || 0;
    let seguro = parseFloat(data.seguro_cua.replace(/\,/g, "")) || 0;
    let rpc = parseFloat(data.rpc_cua.replace(/\,/g, "")) || 0;
    let egresos = parseFloat(data.egresos_cua.replace(/\,/g, "")) || 0;
    let avances = parseFloat(data.avances_cua.replace(/\,/g, "")) || 0;

    let tdebito = parseFloat(data.tdebito_cua.replace(/\,/g, "")) || 0;
    let saldo = parseFloat(data.saldoini_cua.replace(/\,/g, "")) || 0;

    let totalcuadre = ventas + rpc - egresos + seguro - avances + saldo - tdebito

    let cant100 = parseFloat(data.cant100_cua.replace(/\,/g, "")) || 0;
    let vlr100 = cant100 * 100000;
    let cant50 = parseFloat(data.cant50_cua.replace(/\,/g, "")) || 0;
    let vlr50 = cant50 * 50000;
    let cant20 = parseFloat(data.cant20_cua.replace(/\,/g, "")) || 0;
    let vlr20 = cant20 * 20000;
    let cant10 = parseFloat(data.cant10_cua.replace(/\,/g, "")) || 0;
    let vlr10 = cant10 * 10000;
    let cant5 = parseFloat(data.cant5_cua.replace(/\,/g, "")) || 0;
    let vlr5 = cant5 * 5000;
    let cant2 = parseFloat(data.cant2_cua.replace(/\,/g, "")) || 0;
    let vlr2 = cant2 * 2000;
    let cant1 = parseFloat(data.cant1_cua.replace(/\,/g, "")) || 0;
    let vlr1 = cant1 * 1000;
    let vlrmon = parseFloat(data.vlrmonedas_cua.replace(/\,/g, "")) || 0;

    let totalefectivo = vlr100 + vlr50 + vlr20 + vlr10 + vlr5 + vlr2 + vlr1 + vlrmon
    let diferencia = totalcuadre - totalefectivo

    let get_row = (label, value) => {
      return {
        columns: [
          { text: label + ': ' },
          { text: value }
        ]
      }
    }
    let layout = {
      vLineColor: "#A4A4A4",
      hLineColor: "#A4A4A4",
      hLineWidth: function (i, node) {
        return 0.3;
      },
      vLineWidth: function (i, node) {
        return 0.3;
      },
    };

    var dd = {
      watermark,
      ...stylePDF,
      content: [
        {
          fontSize: 6.5,
          headerRows: 1,
          table: {
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                {
                  colSpan: 7,
                  image: data.logo,
                  fit: [100, 100],
                  alignment: "center",
                  margin: [0, 2],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Cierre de Caja:  ", bold: true },
                    parseInt(data.nro_cua.trim()),
                  ],
                  style: "center",
                  margin: [0, 2],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 4,
                  text: [
                    { text: "Fecha Caja:  ", style: "center" },
                    data.fecha_cua,
                  ],
                },
                "", "", "",
                {
                  fontSize: 10,
                  colSpan: 3,
                  text: [
                    { text: "Turno:  ", style: "center" },
                    data.turno_cua
                  ],
                },
                "", "",
              ],
              [
                {
                  colSpan: 7,
                  text: [
                    "Despachador: ",
                    { text: data.taquillero_cua.trim(), bold: true },
                  ],
                  fontSize: 8,
                },
                "",
                "",
                "",
                "",
                "",
                "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Tiquete Inicial:  ", bold: true },
                    parseInt(data.tiqini_cua.trim()),
                  ],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Tiquete Final:  ", bold: true },
                    parseInt(data.tiqfin_cua.trim()),
                  ],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Ingresos Intermunicipales", fontSize: 10, bold: true, style: "center" },

                  ],
                },
                "", "", "", "", "", "",
              ],

              [
                {
                  fontSize: 8,
                  colSpan: 4,
                  text: [
                    { text: "CONCEPTO:  ", style: "center", bold: false },
                  ],
                },
                "", "", "",
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "VALOR", style: "center", bold: false },
                  ],
                },
                "", "",
              ],
              [
                { colSpan: 4, text: "Saldo Inicial", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.saldoini_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],
              [
                { colSpan: 4, text: "Ventas", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.ventas_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],

              [
                { colSpan: 4, text: "Seguro", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.seguro_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],
              [
                { colSpan: 4, text: "RPC", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.rpc_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],

              [
                { colSpan: 4, text: "Egresos", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.egresos_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],
              [
                { colSpan: 4, text: "Avances", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.avances_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],

              [
                { colSpan: 4, text: "Redbus", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.redbus_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],
              [
                { colSpan: 4, text: "Pinbus", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.pinbus_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],
              [
                { colSpan: 4, text: "TDebito/Qr", style: "left", fontSize: 8 },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero(data.tdebito_cua.trim() || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",
              ],
              [
                {
                  colSpan: 4,
                  text: "Total Cierre de Caja",
                  style: "right",
                  fontSize: 10,
                },
                "",
                "",
                "",
                {
                  colSpan: 3,
                  text: "$ " + formatNumero((totalcuadre) || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                "",

              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Efectivo Entregado", fontSize: 10, bold: true, style: "center" },

                  ],
                },
                "", "", "", "", "", "",
              ],

              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "Denominación", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  fontSize: 8,
                  colSpan: 2,
                  text: [
                    { text: "Cant", style: "center", bold: false },
                  ],
                },
                "",
                {
                  fontSize: 8,
                  colSpan: 2,
                  text: [
                    { text: "Total", style: "center", bold: false },
                  ],
                },
                "",
              ],

              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$100.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant100),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero(vlr100),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$50.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant50),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero(vlr50),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$20.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant20),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(vlr20),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],

              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$10.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant10),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(vlr10),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$5.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant5),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(vlr5),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$2.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant2),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero(vlr2),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "$1.000", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: formatNumero(cant1),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero(vlr1),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  fontSize: 8,
                  colSpan: 3,
                  text: [
                    { text: "Moneda", style: "center", bold: false },
                  ],
                },
                "", "",
                {
                  colSpan: 2,
                  text: " ",
                  fontSize: 8,
                  alignment: "center",
                },
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero(vlrmon),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],

              [
                {
                  colSpan: 5,
                  text: "Total Efectivo Entregado",
                  style: "right",
                  fontSize: 10,
                },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero((totalefectivo) || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],

              [
                {
                  colSpan: 5,
                  text: "Diferencia",
                  style: "right",
                  fontSize: 10,
                },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$ " + formatNumero((diferencia) || 0),
                  fontSize: 8,
                  alignment: "right",
                },
                "",
              ],
              [
                {
                  colSpan: 7,
                  text: [
                    { text: "Observaciones:\n  ", bold: true },
                    data.observacion_cua.trim(),
                  ],
                  fontSize: 8,
                },
                "",
                "",
                "",
                "",
                "",
                "",
              ],


            ],
          },
          layout,
        },
      ],
      styles: {
        center: {
          bold: true,
          alignment: "center",
        },
        right: {
          bold: true,
          alignment: "right",
        },
      },
      // pageSize: {
      //   width: 300,
      //   height: "auto",
      // },
      // pageMargins: [10, 10, 10, 10],
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};
const extracto_contrato = data => {
  return new Promise(res => {
    let array_fechaini = data.fechaini_rep.split("-")
    let array_fechafin = data.fechafin_rep.split("-")
    let ano = data.fecha_rep.substr(0, 4)
    let contrato = parseFloat(data.contrato_rep)
    contrato = contrato.toString().padStart(4, "0")
    let consec = parseFloat(data.consec_rep)
    consec = consec.toString().padStart(4, "0")

    data.direccionEmpresa = "CL 18 7 49 BARRIO CENTRO"
    data.telEmpresa = "3105260638 - 3153968892"
    data.correoEmpresa = "transportesllanoline@gmail.com"

    let numero = "5501379522" + ano + contrato + consec

    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageMargins: [margin.left, 150, margin.right, 20],

      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 20, margin.right, 0],
          stack: [
            {
              columns: [
                {
                  width: 500,
                  height: 70,
                  image: data.logo
                },
              ]
            },
            ...(currentPage === 1
              ? [{
                margin: [0, 10, 0, 0],
                style: "boldcenter",
                text: `FORMATO UNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PUBLICO DE\nTRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL\nNo. ${numero}`
              }]
              : [])
          ]
        };
      },
      content: [
        {
          fontSize: 10,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { margin: [0, 3, 0, 0], text: [{ text: "RAZON SOCIAL: TRANSPORTES LLANOLINE SAS", bold: true }] },
                    { margin: [0, 3, 0, 0], text: [{ text: "NIT: 901.496.778-8", bold: true },] },
                    { margin: [0, 3, 0, 0], text: [{ text: "CONTRATO No: ", bold: true }, (contrato)] },
                    { margin: [0, 3, 0, 0], text: [{ text: "CONTRATANTE: ", bold: true }, data.desccliente_rep] },
                    { margin: [0, 3, 0, 0], text: [{ text: "NIT/CC: ", bold: true }, data.idcliente_rep] },
                    { margin: [0, 3, 0, 0], text: [{ text: "OBJETO CONTRATO: ", bold: true }, data.objeto_rep.trim()] },
                    { margin: [0, 3, 0, 0], text: [{ text: "ORIGEN-DESTINO: ", bold: true }, data.origen_rep.trim()] },
                    { margin: [0, 3, 0, 0], text: [{ text: "CONVENIO DE COLABORACION: ", bold: true }, data.convenio_rep.trim()] },
                  ]
                }
              ]
            ]
          }
        },
        { text: "VIGENCIA DEL CONTRATO", style: "boldcenter", margin: [0, 10, 0, 0] },
        {
          margin: [0, 5, 0, 0],
          fontSize: 10,
          table: {
            widths: "*",
            body: [
              [
                "FECHA INICIAL",
                `DÍA   ${array_fechaini[2]}`,
                `MES   ${array_fechaini[1]}`,
                `AÑO   ${array_fechaini[0]}`
              ],
              [
                "FECHA VENCIMIENTO",
                `DÍA    ${array_fechafin[2]}`,
                `MES    ${array_fechafin[1]}`,
                `AÑO    ${array_fechafin[0]}`
              ]
            ]
          }
        },

        { text: "CARACTERÍSTICAS DEL VEHÍCULO", style: "boldcenter", margin: [0, 20, 0, 0] },
        {
          margin: [0, 5, 0, 0],
          fontSize: 10,
          alignment: "center",
          table: {
            headerRows: 1,
            widths: "*",
            body: [
              [
                "PLACA",
                "MODELO",
                "MARCA",
                "CLASE"
              ],
              [
                data.placa_rep,
                data.modelo_rep,
                data.marca_rep.trim(),
                data.clase_rep.trim(),
              ],
              [
                "NUMERO INTERNO",
                parseInt(data.interno_rep),
                "NUMERO TARJETA DE OPERACION",
                parseInt(data.toperacion_rep),
              ],
            ]
          }
        },
        {
          margin: [0, 15, 0, 0],
          fontSize: 10,
          alignment: "center",
          table: {
            widths: "*",
            body: [
              [
                { text: "DATOS DEL\nCONDUCTOR 1", rowSpan: 2, margin: [0, 10, 0, 0] },
                "NOMBRES Y APELLIDOS",
                "N° CÉDULA",
                "N° LICENCIA CONDUCCIÓN",
                "VIGENCIA"
              ],
              [
                " ",
                data.conductor1_rep.trim(),
                parseInt(data.idconduct1_rep),
                parseInt(data.liconduct1_rep),
                data.vencecond1_rep,
              ],
              [
                { text: "DATOS DEL\nCONDUCTOR 2", rowSpan: 2, margin: [0, 10, 0, 0] },
                "NOMBRES Y APELLIDOS",
                "N° CÉDULA",
                "N° LICENCIA CONDUCCIÓN",
                "VIGENCIA"
              ],
              [
                " ",
                data.conductor2_rep.trim(),
                data.idconduct2_rep,
                data.liconduct2_rep,
                data.vencecond2_rep,
              ],
              [
                { text: "DATOS DEL\nCONDUCTOR 3", rowSpan: 2, margin: [0, 10, 0, 0] },
                "NOMBRES Y APELLIDOS",
                "N° CÉDULA",
                "N° LICENCIA CONDUCCIÓN",
                "VIGENCIA"
              ],
              [
                " ",
                data.conductor3_rep.trim(),
                data.idconduct3_rep,
                data.liconduct3_rep,
                data.vencecond3_rep,
              ],
              [
                { text: "RESPONSABLE DEL\nCONTRATANTE", rowSpan: 2, margin: [0, 10, 0, 0] },
                "NOMBRES Y APELLIDOS",
                "N° CÉDULA",
                "TELÉFONO",
                "DIRECCIÓN"
              ],
              [
                " ",
                data.descrespons_rep.trim(),
                data.idresponsab_rep,
                data.telerespons_rep.trim(),
                data.direcrespons_rep.trim(),
              ],
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 10,
          alignment: "center",
          table: {
            widths: "*",
            body: [
              [
                {
                  margin: [0, 10, 0, 0],
                  stack: [
                    data.direccionEmpresa,
                    data.ciudadEmpresa,
                    `TEL: ${data.telEmpresa}`,
                    `EMAIL: ${data.correoEmpresa}`
                  ]
                },
                {
                  stack: [
                    {
                      width: 150,
                      height: 45,
                      image: data.firma
                    },
                    { text: "FIRMA GERENTE DE LA EMPRESA", bold: true, fontSize: 11 },
                    { text: "FIRMA ELECTRONICA LEY 527 DE 1999 / DECRETO 1074 DE 2015", bold: true, fontSize: 8, color: "#C10020" },
                  ]
                },
              ]
            ]
          }
        },
        { text: "ORIGINAL", style: "boldcenter", margin: [0, 20, 0, 0], fontSize: 10, color: "#C10020" },
        {
          pageBreak: "before",
          text: "INSTRUCTIVO PARA LA DETERMINACION DEL NUMERO CONSECUTIVO DEL FUEC",
          style: "boldcenter"
        },
        {
          margin: [0, 15, 0, 0],
          text: 'El formato único de extracto del contrato "FUEC" estará constituido por los siguientes números:'
        },
        {
          margin: [15, 20, 0, 0],
          type: 'lower-alpha',
          separator: ')',
          ol: [
            {
              margin: [0, 0, 0, 15],
              stack: [
                "Los tres primeros dígitos de la izquierda a derecha corresponderán al código de la dirección territorial que otorgo la habilitación de la empresa de transporte de servicio especial.",
                {
                  table: {
                    widths: ["30%", "15%", "30%", "15%"],
                    body: [
                      ["Antioquia choco", "305", "Huila-Caquetá", "441"],
                      ["Atlántico", "208", "Magdalena", "247"],
                      ["Bolívar-san Andres providencia", "213", "Meta-Vaupés-vichada", "550"],
                      ["Boyacá- Casanare", "415", "Nariño-putumayo", "352"],
                      ["Caldas", "317", "N/Santander-Arauca", "454"],
                      ["Cauca", "319", "Quindío", "363"],
                      ["Cesar", "220", "Risaralda", "366"],
                      ["Córdoba-sucre", "223", "Santander", "468"],
                      ["Cundinamarca", "425", "Tolima", "473"],
                      ["Guajira", "241", "Valle del cauca", "376"],
                    ]
                  }
                }
              ]
            },
            'Los cuatro dígitos siguientes señalarán el número de resolución mediante la cual se otorgo la habilitación de la empresa. En caso que la resolución no tenga estos dígitos, los faltantes serán completados con ceros a la izquierda.',
            { margin: [0, 5, 0, 0], text: 'Los dos siguientes dígitos, corresponderán a los dos últimos del año en que la empresa fue habilitada.' },
            { margin: [0, 5, 0, 0], text: 'A continuación cuatro dígitos que corresponderán al año que se expide el extracto del contrato.' },
            { margin: [0, 5, 0, 0], text: 'Posteriormente, cuatro dígitos que identifican el número del contrato.la numeración debe ser consecutiva, establecida por cada empresa e iniciará con los contratos de prestación de servicio celebrados para el transporte de estudiantes, asalariados, turistas o grupo de usuario, vigentes al momento de entrar en vigor la presente resolución.' },
            { margin: [0, 5, 0, 0], text: 'Finalmente, los cuatro últimos dígitos corresponderán al número consecutivo del extracto de contrato. Se debe expedir un nuevo extracto por vencimiento de plazo inicial del mismo o por cambio de vehículo.' }
          ]
        },
        { text: "EJEMPLO: ", bold: true, fontSize: 13, margin: [0, 25, 0, 12] },
        'Empresa habilitada por la Dirección Territorial Cundinamarca en el año 2012, con resolución de habilitación N° 0155, que expide el primer extracto de contrato en el año 2015, del contrato 255. El nuero del formato único de extracto del contrato "FUEC" será: 425015512201502550001.'

      ]
    }


    pdfMake.createPdf(dd).open();
    res();
  })
};

const recepcion_documentos = (data) => {
  return new Promise((res) => {
    let productos = [];
    data.productos.forEach((p, i) => {
      productos.push([
        i + 1,
        // p.codigo,

        { text: p.fecharemis_rep, alignment: "left", fontSize: 8 },
        { text: p.placa_rep, alignment: "left", fontSize: 8 },
        { text: p.producto_rep, alignment: "left", fontSize: 8 },
        { text: p.fecharemis_rep, alignment: "left", fontSize: 8 },
        {
          text: p.rcbomina_rep === "1" || p.rcbomina_rep === 1 ? "X" : "",
          alignment: "left",
          fontSize: 8
        },
        {
          text: p.rcbocliente_rep === "1" || p.rcbomina_rep === 1 ? "X" : "",
          alignment: "left",
          fontSize: 8
        },
        { text: p.m3despach_rep, alignment: "left", fontSize: 8 },
        { text: p.destino_rep, alignment: "left", fontSize: 8 },
        { text: p.kmrec_rep, alignment: "left", fontSize: 8 },
        { text: p.vlrtonelada_rep, alignment: "left", fontSize: 8 },
        { text: p.vlrcombustible_rep, alignment: "left", fontSize: 8 },

        // { text: p.umedida.trim(), alignment: "left" },
        // { text: p.cantidad.trim(), alignment: "right" },
        // { text: p.infoprod, alignment: "right" },
        // { text: p.vlr_unit.trim(), alignment: "right" },
        // { text: p.vlr_dcto, alignment: "right" },
        // { text: p.vlr_unitiva, alignment: "right" },
        // { text: p.vlr_unitimp, alignment: "right" },
        // { text: p.tot_producto.trim(), alignment: "right" },
      ])

    })
    const verdepastoclaro = "#cdeac0"

    const docDefinition = {

      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [20, 10, 20, 20],
      content: [
        {
          columns: [
            {
              image: data.logo,
              fit: [200, 250],
              alignment: 'left',
              margin: [0, 0, 0, 10]
            },
            { width: 110, text: "" },

            {
              margin: [100, 10, 50, 5],
              table: {
                widths: [25, 30],
                body: [
                  [{ text: "CODIGO:", style: "style2" }, { text: "FR-PO-ALV-27", style: "style3" }],
                  [{ text: "VERSION:", style: "style2" }, { text: "0.1", style: "style3" }],
                  [{ text: "FECHA:", style: "style2" }, { text: "06/04/2021", style: "style3" }]
                ]
              }
            },

            {
              margin: [10, 10, 0, 0],
              alignment: "right",
              fontSize: 12,
              stack: [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [{ text: "CONTROL DE REMISIONES PARA FACTURAR", style: "boldcenter", fillColor: verdepastoclaro, alignment: "center", bold: true }],
                      [{ text: `N° ${data.numero_fact}`, alignment: "center", fontSize: 11, color: "red" }]
                    ]
                  }
                },


              ],

            },
          ]
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                {
                  stack: [
                    { text: 'PROPIETARIO:', bold: true, margin: [0, 0, 0, -3], fontSize: 12 },
                    {
                      canvas: [
                        { type: 'line', x1: 82, y1: 0, x2: 310, y2: 0, lineWidth: 1 }
                      ]
                    },
                    { text: data.nombre_cliente || '_____', margin: [80, -14, 0, 0], fontSize: 11 }
                  ]
                },
                {
                  stack: [
                    { text: 'IDENTIFICACION: ', style: 'header', fontSize: 12 },

                    {
                      canvas: [
                        { type: 'line', x1: 70, y1: 0, x2: 180, y2: 0, lineWidth: 1 }
                      ]
                    },
                    { text: data.idpropi_cliente.trim() || '_____', margin: [70, -16, 0, 0], fontSize: 11 }
                  ]
                },
              ]
            ]
          },
          layout: 'noBorders'
        },

        {
          columns: [
            {
              width: '50%',
              text: [
                { text: 'NOMBRE QUIEN ENTREGA: ', style: 'header', fontSize: 12 },
                { text: data.entrega || '_________', decoration: 'underline', fontSize: 11 }
              ],
              margin: [0, 10, 5, 0]
            },
            {
              width: '30%',
              text: [
                { text: 'FECHA:', bold: true, margin: [25, 0, 0, 1], fontSize: 12 },
                { text: data.fecha_factura || '_________', decoration: 'underline', fontSize: 11 }
              ],
              margin: [28, 10, 10, 0]
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: 'Crédito',
                  style: 'style4',
                  margin: [-42, 10, 5, 0]
                },
                {
                  width: 20,
                  stack: [
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 20,
                          h: 20,
                          color: '#cdeac0',
                          lineColor: 'black'
                        },
                        // Si es CREDITO, dibuja una X
                        ...(data.productos[0].fpago_rep?.toUpperCase() === 'CREDITO'
                          ? [
                            {
                              type: 'line',
                              x1: 3,
                              y1: 3,
                              x2: 17,
                              y2: 17,
                              lineWidth: 2.5,
                              lineColor: 'black'
                            },
                            {
                              type: 'line',
                              x1: 17,
                              y1: 3,
                              x2: 3,
                              y2: 17,
                              lineWidth: 2.5,
                              lineColor: 'black'
                            }
                          ]
                          : [])
                      ]
                    }
                  ],
                  margin: [0, 5, 10, 0]
                },
                {
                  width: 'auto',
                  text: 'Contado',
                  style: 'style4',
                  margin: [25, 10, 5, 0]
                },
                {
                  width: 20,
                  stack: [
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 20,
                          h: 20,
                          color: '#cdeac0',
                          lineColor: 'black'
                        },
                        // Si es CONTADO, dibuja una X
                        ...(data.productos[0].fpago_rep?.toUpperCase() === 'CONTADO'
                          ? [
                            {
                              type: 'line',
                              x1: 3,
                              y1: 3,
                              x2: 17,
                              y2: 17,
                              lineWidth: 1.5,
                              lineColor: 'black'
                            },
                            {
                              type: 'line',
                              x1: 17,
                              y1: 3,
                              x2: 3,
                              y2: 17,
                              lineWidth: 1.5,
                              lineColor: 'black'
                            }
                          ]
                          : [])
                      ]
                    }
                  ],
                  margin: [5, 5, 10, 0]
                }
              ]
            }
            ,
          ]
        },

        {
          table: {
            headerRows: 2,
            widths: [20, 50, 50, '*', 60, 32, 32, '*', 60, 80, 50, 40],
            body: [
              // Fila principal del encabezado
              [
                { text: 'N°', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'FECHA', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'PLACA', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'MATERIAL', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'N° Remisión JAELFA', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'ENTREGA', colSpan: 2, alignment: 'center', style: 'tableHeader', fillColor: '#cdeac0' }, {},
                { text: 'CANT. M3', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'LUGAR DE DESCARGUE', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'KILOMETRAJE (KM)', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'VALOR M3KM', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] },
                { text: 'ACPM', rowSpan: 2, style: 'tableHeader', fillColor: '#cdeac0', alignment: 'center', margin: [0, 10, 0, 0] }
              ],

              // Fila de subcolumnas (sólo para ENTREGA)
              [
                '', '', '', '', '',
                { text: 'RECIBO MINA', style: 'tableHeader', fillColor: '#cdeac0' },
                { text: 'RECIBO CLIENTE', style: 'tableHeader', fillColor: '#cdeac0' },
                '', '', '', '', ''
              ],

              // 15 filas de datos vacíos
              // ...Array.from({ length: 15 }, (_, i) => ([
              //   { text: i + 1, style: 'tableCell' },
              //   '', '', '', '', '', '', '', '', '', '', ''
              // ])),
              ...productos
            ]


          },
          layout: 'grid',
          margin: [0, 5, 0, 0],

        },

        // Observaciones + recuadros de firma
        {
          stack: [
            // 3 líneas para observaciones
            {
              table: {
                widths: ['*'],
                body: [
                  [{ text: 'OBSERVACIONES:', bold: true, border: [true, true, true, true], fillColor: '#f9f9f9', height: 35 }],
                  [{ text: '', border: [true, true, true, true], fillColor: '#f9f9f9', height: 35 }],
                  [{ text: '', border: [true, true, true, true], fillColor: '#f9f9f9', height: 35 }]
                ]
              },
              layout: {
                defaultBorder: false,
                paddingTop: () => 10,
                paddingBottom: () => 10
              }
            },

            // Espacio entre observaciones y firmas
            { text: '', margin: [0, 0] },

            // Recuadros de firma lado a lado
            {
              columns: [
                // Columna 1: Texto libre
                {
                  width: '*',
                  text: 'NOTA: EL CONTROL DE RADICADOS SOLO ES VÁLIDO SI FUE ENTREGADO TODOS LOS CUMPLIDOS DEBIDAMENTE DILIGENCIADOS (REMISIÓN JAELFA, REMISIÓN MINA, REMISIÓN CLIENTE) CON ESTE SOPORTE SE PUEDE PROCEDER HACER LA FACTURA, SE DEBE TENER EN CUENTA LOS CIERRES CONTABLES (25 DE CADA MES) Y LAS POLÍTICAS DE FACTURACIÓN.',
                  margin: [0, -20, 0, 0],
                  fontSize: 10,
                  bold: false,
                  alignment: 'justify',
                },

                // Columna 2: Firma "APROBACIÓN"
                {
                  width: 'auto',
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          stack: [
                            {
                              text: data.elaboro || '_',
                              alignment: "center",
                              bold: true,
                              fontSize: 10,
                              margin: [0, 20, 0, 5]
                            },
                            {
                              canvas: [
                                { type: 'line', x1: 0, y1: 5, x2: 240, y2: 5, lineWidth: 1 }
                              ],
                              margin: [0, 5, 0, 0]
                            },
                            {
                              text: 'APROBACIÓN',
                              alignment: 'center',
                              margin: [0, 5, 0, 0]
                            }
                          ]
                        }
                      ]
                    ]
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => 'black',
                    vLineColor: () => 'black'
                  },
                  margin: [10, 0, 10, 0]
                }
                ,


                // Columna 3: Firma y sello del beneficiario
                {
                  width: 'auto',
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          stack: [
                            {
                              canvas: [
                                { type: 'line', x1: 0, y1: 30, x2: 240, y2: 30, lineWidth: 1 }
                              ],
                              margin: [0, 10, 0, 0]
                            },
                            {
                              text: 'FIRMA Y SELLO DEL BENEFICIARIO',
                              alignment: 'center',
                              margin: [0, 0, 0, 5],
                              fontSize: 9,
                              bold: true
                            },
                            {
                              text: 'C.C',
                              alignment: 'center',

                              fontSize: 9,
                              bold: true
                            }
                          ]
                        }
                      ]
                    ]
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => 'black',
                    vLineColor: () => 'black'
                  }
                }
              ],
              columnGap: 20,
              margin: [0, 30, 0, 0]
            }
          ]
        },


      ],




      styles: {
        header: {
          fontSize: 12,
          bold: true
        },
        style2: {
          bold: true,
          fontSize: 5,
          italics: true
        },
        style3: {
          bold: false,
          fontSize: 5,
          italics: true
        },
        style4: {
          bold: false,
          fontSize: 10
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          valign: 'middle'
        },
        tableCell: {
          fontSize: 7,
          alignment: 'center'
        },
      },
    }
    pdfMake.createPdf(docDefinition).open();
    res(); // Resolvemos la promesa
  });
};
function numeroALetras(num) {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertir(num) {
    let texto = '';
    if (num === 0) return '';
    if (num === 100) return 'CIEN';

    if (num > 99) {
      texto += centenas[Math.floor(num / 100)] + ' ';
      num %= 100;
    }

    if (num > 9 && num < 30) {
      const especiales = {
        10: 'DIEZ', 11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE',
        15: 'QUINCE', 16: 'DIECISÉIS', 17: 'DIECISIETE', 18: 'DIECIOCHO',
        19: 'DIECINUEVE', 20: 'VEINTE', 21: 'VEINTIUNO', 22: 'VEINTIDOS',
        23: 'VEINTITRES', 24: 'VEINTICUATRO', 25: 'VEINTICINCO',
        26: 'VEINTISÉIS', 27: 'VEINTISIETE', 28: 'VEINTIOCHO', 29: 'VEINTINUEVE'
      };
      return texto + especiales[num];
    }

    if (num > 0) {
      texto += decenas[Math.floor(num / 10)];
      if (num % 10 !== 0) {
        texto += ' Y ' + unidades[num % 10];
      }
    }

    return texto.trim();
  }

  function secciones(num) {
    const millones = Math.floor(num / 1000000);
    const miles = Math.floor((num % 1000000) / 1000);
    const resto = num % 1000;
    let resultado = '';

    if (millones > 0) {
      resultado += (millones === 1 ? 'UN MILLÓN ' : convertir(millones) + ' MILLONES ');
    }

    if (miles > 0) {
      resultado += (miles === 1 ? 'MIL ' : convertir(miles) + ' MIL ');
    }

    if (resto > 0 || (millones === 0 && miles === 0)) {
      resultado += convertir(resto);
    }

    return resultado.trim();
  }

  const partes = num.toString().split('.');
  const enteros = parseInt(partes[0]);
  const centavos = partes[1] ? partes[1].substring(0, 2) : '00';

  return `${secciones(enteros)} PESOS M/CTE${centavos !== '00' ? ` CON ${centavos}/100` : ''}`;
}

const proforma = (data) => {
  data.totales[0].subtotal = parseFloat(data.totales[0].subtotal.replace(/,/g, ''));
  data.totales[0].total = parseFloat(data.totales[0].total.replace(/,/g, ''));
  data.total_iva = parseFloat(data.total_iva.replace(/,/g, ''));

  data.productos.forEach((producto, index) => {
    try {
      const decoded = atob(producto.nombre_servicio);
      const decodedUtf8 = new TextDecoder().decode(
        Uint8Array.from(atob(producto.nombre_servicio), c => c.charCodeAt(0))
      );
      producto.descripcion_servicio = decodedUtf8;
    } catch (error) {
      console.error(`Error al decodificar producto ${index + 1}:`, error);
    }
  });
  let concepto = data.productos[0].descripcion_servicio || "Servicio no especificado";
  concepto = "SERVICIO TRANSPORTE DE " + concepto + " PARA " + (data.productos[0].destino_fact).trim();

  return new Promise((res) => {

    let informacionEmpresa = {

      text: [
        { text: 'IVA Régimen Común. No somos Agentes de Retención de IVA', bold: true, fontSize: 8 },
        { text: '\nRetención de IVA', bold: true, fontSize: 8 },
        { text: '\nNo somos Grandes Contribuyentes', bold: true, fontSize: 8 },
        { text: '\nActividad Económica ICA SERVI 10.00 x 1000', bold: true, fontSize: 8 }
      ],
      margin: [-20, 20, 0, 0],
      style: "small",
      alignment: "center",
    };

    let cuadroRemision = {
      columns: [
        {
          width: '60%',
          stack: [
            {
              table: {
                widths: ['160%'],
                body: [
                  [
                    { text: 'Factura Proforma No', fillColor: '#e0e0e0', bold: true, fontSize: 10, alignment: 'center' }
                  ],
                  [{ text: `JAELF N° ${data.numero_fact}`, alignment: 'center', color: 'red', fontSize: 11 }]
                ]
              },
              layout: 'grid',
              margin: [0, -1, 0, 0]
            }
          ]
        }
      ]
    };

    let informacionCliente = {
      columns: [
        {
          width: '50%',
          stack: [
            {
              table: {
                headerRows: 2,
                widths: ['14%', '89%'],
                body: [
                  [
                    { text: 'CLIENTE:', fillColor: '#e0e0e0', bold: true, fontSize: 8 },
                    { text: (data.nombre_cliente || '').substring(0, 50), fontSize: 8 }
                  ],
                  [
                    { text: 'NIT:', fillColor: '#e0e0e0', bold: true, fontSize: 8 },
                    { text: data.nit_cliente.replace(/,/g, '').trim(), fontSize: 8 }
                  ]
                ]
              },
              layout: 'grid'
            },
            {
              table: {
                widths: ['103%'],
                body: [
                  [
                    { text: 'DIRECCIÓN:', fillColor: '#e0e0e0', bold: true, fontSize: 8, alignment: 'center' }
                  ],
                  [
                    {
                      text: (`${data.direccion_cliente.toLowerCase()} ${data.ciudad_cliente.replace(/ /g, "").toLowerCase()}` || '').substring(0, 80),
                      fontSize: 8
                    }
                  ]
                ]
              },
              layout: 'grid',
              margin: [0, -1, 0, 0]
            },
            {
              table: {
                widths: ['51.5%', '51.5%'],
                body: [
                  [
                    { text: 'FECHA FACTURA:', fillColor: '#e0e0e0', bold: true, fontSize: 8, alignment: 'center' },
                    { text: 'FECHA VENCIMIENTO:', fillColor: '#e0e0e0', bold: true, fontSize: 8, alignment: 'center' }
                  ],
                  [
                    { text: data.fecha_factura || '', fontSize: 8, alignment: 'center' },
                    { text: data.fecha_factura || '', fontSize: 8, alignment: 'center' }
                  ]
                ]
              },
              layout: 'grid',
              margin: [0, 5, 0, 0]
            }
          ]
        },
        {
          width: '50%',
          stack: [
            {
              table: {
                widths: ['100%'],
                body: [
                  [
                    { text: 'POR CONCEPTO DE:', fillColor: '#e0e0e0', bold: true, fontSize: 8, alignment: 'center' }
                  ],
                  [
                    { text: concepto || '', fontSize: 8 }
                  ]
                ]
              },
              layout: 'grid'
            },
            {
              table: {
                widths: ['50%', '50%'],
                heights: [10, 11],
                body: [
                  [
                    { text: 'CIUDAD:', fillColor: '#e0e0e0', bold: true, alignment: 'center', fontSize: 8 },
                    { text: 'TELÉFONO:', fillColor: '#e0e0e0', bold: true, alignment: 'center', fontSize: 8 }
                  ],
                  [
                    { text: data.ciudad_cliente, fontSize: 8, alignment: 'center' },
                    { text: data.telefono_cliente.replace(/,/g, ' ').trim(), fontSize: 8, alignment: 'center' }
                  ]
                ]
              },
              layout: 'grid',
              margin: [0, -1, 0, 0]
            },
            {
              table: {
                widths: ['50%', '50%'],

                body: [
                  [
                    { text: 'VENDEDOR:', fillColor: '#e0e0e0', bold: true, fontSize: 8, alignment: 'center' },
                    { text: 'FORMA DE PAGO:', fillColor: '#e0e0e0', bold: true, fontSize: 8, alignment: 'center' }
                  ],
                  [
                    { text: data.elaboro.replace(/0/g, '').trim() || '', fontSize: 8, alignment: 'center' },
                    { text: data.forma_pago || '', fontSize: 8, alignment: 'center' }
                  ]
                ]
              },
              layout: 'grid',
              margin: [0, 3.4, 0, 0]
            }
          ]
        }
      ],
      columnGap: 10
    };

    let tablaDetalleProductos = {
      margin: [0, -75, 0, 0],
      layout: 'grid',
      table: {
        headerRows: 1,
        widths: [20, 160, 50, 32, 70, 32, 42, 70],
        body: [
          [
            { text: 'Item', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'Descripción', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'Cantidad', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'U Medida', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'Valor Unitario', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'IVA', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'Valor IVA', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
            { text: 'Total', style: 'tableHeader', fillColor: '#e0e0e0', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 8, bold: true },
          ],
          ...data.productos.map((prod, index) => {
            // const descripcion = window.atob(
            //   (prod.base1_pr || '') +
            //   (prod.base2_pr || '') +
            //   (prod.base3_pr || '') +
            //   (prod.base4_pr || '') +
            //   (prod.base5_pr || '')
            // ) || prod.nombre_servicio;

            const descripcion = "FECHA REMISION-" + prod.fecharem + "-TRANSPORTE-" + prod.descripcion_servicio + "-DESCARGUE-" + prod.destino_fact + "-PLACA-" + prod.placas + "-RAD.RNDC-" + parseFloat(prod.remmintr.trim()) + "-REMESA-" + prod.consecremmintr.trim() + "-VALE CLIENTE-" + prod.valecliente.trim() + "-VALE JAELFA-" + parseFloat(prod.valejaelfa.trim()) + "-VALE MINA-" + prod.valemina.trim();
            const cantidad = parseFloat(prod.cantidad || '0');
            const valorUnitario = parseFloat(prod.vlr_unit?.replace(/,/g, '') || '0');
            const valorIVA = parseFloat(prod.vlr_iva?.replace(/,/g, '') || '0');

            const total = (cantidad * valorUnitario) + valorIVA;
            granTotal += total;
            let granTotal = 0;


            return [
              { text: index + 1, alignment: 'center', fontSize: 8 },
              { text: descripcion, fontSize: 8 },
              { text: cantidad.toString(), alignment: 'center', fontSize: 8 },
              { text: prod.unidad || 'UND', alignment: 'center', fontSize: 8 },
              { text: `$${valorUnitario.toFixed(2)}`, alignment: 'right', fontSize: 8 },
              { text: `${prod.iva || '0'}%`, alignment: 'center', fontSize: 8 },
              { text: `$${valorIVA.toFixed(2)}`, alignment: 'right', fontSize: 8 },
              { text: `$${total.toFixed(2)}`, alignment: 'right', fontSize: 8 }
            ];
          })
        ]
      }
    };
    var margin = {
      left: 23,
      right: 23,
    };

    let tablanotas = {
      margin: [0, -1, 0, 0],
      layout: 'grid',
      table: {
        widths: ['60%', '20%', '20%'], // Ajusta según el espacio que desees
        body: [
          [
            {
              text: `Total Líneas o ítems: ${data.productos.length}`,
              bold: false,
              colSpan: 1,
              alignment: 'left',
              fontSize: 8
            },
            { text: 'SUBTOTAL', bold: true, fontSize: 8 },
            { text: `$${Number(data.totales[0].subtotal || 0).toLocaleString('es-CO')}`, alignment: 'right', fontSize: 8 }
          ],
          [
            { text: 'Valor en Letras:', bold: true, fontSize: 8 },
            { text: 'DESCUENTO', bold: true, fontSize: 8 },
            { text: `$0`, fontSize: 10, colSpan: 1, alignment: 'right' }

          ],
          [
            { text: `${data.TotalEnLetras}`, fontSize: 8, colSpan: 1 },
            { text: 'IVA', alignment: 'left', fontSize: 8, bold: true },
            { text: `$${Number(data.total_iva || 0).toLocaleString('es-CO')}`, alignment: 'right', fontSize: 8 }

          ],
          [
            {},
            { text: 'TOTAL DOCUMENTO', alignment: 'left', fontSize: 8, bold: true },
            { text: `$${Number(data.totales[0].total || 0).toLocaleString('es-CO')}`, alignment: 'right', bold: true, fontSize: 8 }

          ]
        ]
      }
    };

    let tablaobservaciones = {
      margin: [0, 30, 0, 0],
      layout: 'grid',
      table: {
        widths: ['100%'],
        heights: function (rowIndex) {
          return rowIndex === 4 ? 60 : 10;
        },
        body: [
          [
            {
              text: `CONSIGNACIÓN O TRANSFERENCIA CTA CORRIENTE BANCO DAVIVIENDA N 0969-6999-3201 A NOMBRE DE GRUPO EMPRESARIAL JAELFA SAS `,
              bold: true,
              colSpan: 1,
              alignment: 'center',
              fontSize: 8
            },
          ],
          // Fila 2
          [
            { text: 'CANCELA CON CHEQUE CRUZADO AL PRIMER BENEFICIARIO A FAVOR DE GRUPO EMPRESARIAL JAELFA SAS', bold: true, fontSize: 8, alignment: 'center' },

          ],
          [
            { text: `ESTA FACTURA SE ASIMILA EN TODOS SUS EFECTOS A UNA LETRA DE CAMBIO SEGÚN ARTÍCULO 774 DEL CÓDIGO DE COMERCIO`, fontSize: 8, bold: true, alignment: 'center' },

          ],
          [
            { text: 'VENCIDO EL PLAZO DE PAGO PACTADA LA PRESENTE FACTURA CAUSARÁ INTERESES DE MORA A LA TASA VIGENTE', alignment: 'center', fontSize: 8, bold: true },

          ],

          [
            {
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      text: `Representación Gráfica de la Factura de Venta Electrónica \n ${data.fecha_factura}`,
                      alignment: 'center',
                      fontSize: 8,
                      bold: true
                    }
                  ]
                ]
              },
              layout: {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
                paddingTop: () => 25,      // Empuja hacia el centro vertical
                paddingBottom: () => 25    // Ajusta según el alto definido (60)
              }
            }
          ],

          [
            {
              table: {
                widths: ['*'],
                body: [
                  [
                    { text: 'CL 16 A 46 BRR POPULAR PTO GAITAN META Teléfono 3203106537 \n Correo Electrónico: grupoempresarialjaelfa@gmail.com', alignment: 'center', fontSize: 8, bold: true },
                  ]
                ]
              },
              layout: {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
                paddingTop: () => 10,
                paddingBottom: () => 10
              }
            }
          ]
        ]
      }
    };

    var dd = {
      pageMargins: [margin.left, 280, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 40, margin.right, 0],
            columns: [
              {
                width: '50%',
                alignment: "left",
                stack: [
                  {
                    image: "logo",
                    fit: [250, 250],
                  }
                ]
              },
              {
                width: '50%',
                stack: [
                  cuadroRemision,
                  informacionEmpresa
                ],
                alignment: 'right'
              }
            ]
          },
          {
            columns: [informacionCliente],
            margin: [margin.left, 10, margin.left, 0]
          }
        ];
      },
      content: [
        { text: ' ', margin: [0, 10] },
        tablaDetalleProductos,
        tablanotas,
        tablaobservaciones
      ],


      styles: {
        header: {
          bold: true,
          fontSize: 12,
        },
        small: {
          fontSize: 9,
        },
        tableHeader: {
          bold: true,
          fontSize: 9
        }
      },

      images: {
        logo: data.logo,
      }
    };


    pdfMake.createPdf(dd).open();
    res();
  });
};
const doc_ordencompra = (data) => {
  return new Promise((res, rej) => {
    var detalle = [];
    let subtotal = 0;

    data.productos_prov.forEach((el) => {
      let vlr_unitario = parseFloat(el.vlrunit_prov.replace(/\,/g, ""));
      let vlr_subtotal = parseFloat(el.vlrsubtotal_prov.replace(/\,/g, ""));
      let nombre_servicio = `${el.nombreservicio_prov} ${el.nombreservicio2_prov} ${el.nombreservicio3_prov} ${el.nombreservicio4_prov}`
      subtotal += vlr_subtotal;
      let obj = [
        el.cantidad_prov,
        nombre_servicio,
        { text: formatNumero(vlr_unitario), alignment: "right" },
        { text: formatNumero(vlr_subtotal), alignment: "right" },
      ];

      detalle.push(obj);
    });

    const margin = {
      right: 40,
      left: 40,
    };

    var dd = {
      pageMargins: [margin.left, 180, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {
                width: "30%",
                stack: [
                  {
                    image: "logo",
                    fit: [120, 100],
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
                    text: `Tel:${data.telefonoEmpresa}`,
                    fontSize: 10,
                  },

                  {
                    alignment: "center",
                    text: data.ciudadEmpresa + `-` + data.dptoEmpresa,
                    fontSize: 10,
                  },
                ],
              },
              {
                width: "30%",
                alignment: "center",
                fontSize: 16,
                bold: true,
                stack: [
                  {
                    text: "Orden de Compra",
                  },
                  {
                    text: `No. ${data.consecutivo_prov.trim()}`,
                    color: "#ad190e",
                  },
                ],
              },
            ],
          },
          {
            margin: [margin.left, 0, margin.right, 0],
            alignment: "right",
            fontSize: 12,
            text: "\nFecha de Orden: " + data.fecha_prov,
          },
          {
            margin: [margin.left, 5, margin.right, 0],
            fontSize: 9,
            table: {
              widths: [350, 150],
              body: [
                ["Proveedor:", "Nit:"],
                [data.nombre_prov, data.nit_prov.trim()],
                ["Dirección:", "Telefonos:"],
                [data.direccion_prov, data.telefono_prov],
              ],
            },
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return rowIndex % 2 === 0 ? "#ddd" : null;
              },
            },
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
            widths: [50, 232, 100, 100],
            body: [
              [
                { text: "CANTIDAD", style: "header_tabla" },
                { text: "DETALLE", style: "header_tabla" },
                { text: "VR UNITARIO", style: "header_tabla" },
                { text: "VR TOTAL", style: "header_tabla" },
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
          margin: [300, 5, 0, 0],
          fontSize: 9,
          table: {
            widths: [100, 100],
            body: [
              [
                { text: "Subtotal", bold: true },
                { text: formatNumero(subtotal), alignment: "right" },
              ],
              [
                { text: "Total", bold: true },
                {
                  text: formatNumero(subtotal),
                  alignment: "right",
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 || rowIndex === 3 ? "#ddd" : null;
            },
          },
        },
        {
          margin: [0, 10, 0, 0],
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
                      text: data.observaciones_prov,
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
          alignment: "center",
          margin: [0, 50, 0, 0],
          columns: [
            {
              stack: [
                "_____________________________",
                { text: `Elaborado`, bold: true },
                { text: data.elaboro_prov, bold: true },
              ],
            },
            {
              stack: [
                "_____________________________",
                { text: "Autorizado", bold: true },
                { text: data.autoriza_prov, bold: true },
              ],
            },
            {
              stack: [
                "_____________________________",
                { text: "Recibido", bold: true },
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
// function generarPDF() {
//   const datos = {
//     nombre: "Juan Pérez",
//     fecha: "2025-05-12",
//     observaciones: "Todos los documentos fueron entregados en buen estado."
//   };



//   recepcion_documentos(datos).then(() => {
//     console.log("PDF generado con éxito.");
//   })
// }



export {
  tiquete_transporte,
  recibo_caja,
  cuadre_cajatr,
  remision,
  ordensal_sar,
  ordenCombustible,
  doc_ordencompra,
  CompEgreso,
  extracto_contrato,
  recepcion_documentos,
  proforma,
};

