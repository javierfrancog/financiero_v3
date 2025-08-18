import { castArray } from "lodash";

import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "pdfmake/build/vfs_fonts";
pdfMake.vfs = vfs;


import JsBarcode from 'jsbarcode/bin/JsBarcode'

var textToBase64Barcode = function (text) {
  var canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE128" });
  return canvas.toDataURL("image/png");
};

// import { cond, trim } from "lodash";
// import printJS from "print-js";
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



const prefactura_titan = async (data, getBase64) => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    let totales = data.totales[0]
    let productos = [];
    let impuestos = [];
    let retenciones = [];
    let observaciones = window.atob(data.Observaciones64.trim())


    let descripcion = "";
    let descripcion64 = "";
    data.productos.pop();
    data.productos.forEach((p, i) => {
      p.nro_servicio = parseFloat(p.nro_servicio.trim()),
        productos.push([
          i + 1,
          //  p.codigo,        
          { text: p.paciente.trim(), alignment: "left", fontSize: 6 },
          { text: p.edad.trim(), alignment: "left" },
          { text: p.fechaserv, alignment: "left" },
          { text: p.nombre_servicio.trim(), alignment: "left", fontSize: 6 },
          { text: p.cantidad.trim(), alignment: "right" },
          { text: p.vlr_unit.trim(), alignment: "right" },
          // { text: p.vlr_unitiva, alignment: "right" },
          // { text: p.porcimpto, alignment: "right" },
          // { text: p.vlr_dcto, alignment: "right" },
          { text: p.tot_producto.trim(), alignment: "right" },
          { text: p.copago.trim(), alignment: "right" },
          { text: p.autorizacion.trim(), alignment: "right" },

        ])

    })

    data.impuestos.pop();
    data.impuestos.forEach(i => {
      impuestos.push([
        i.tipo,
        i.base.trim(),
        { text: i.porcentaje.trim(), alignment: "right" },
        { text: i.valor.trim(), alignment: "right" },
      ])
    })

    data.retenciones.forEach(i => {
      retenciones.push([
        i.base.trim(),
        { text: i.porcentaje.trim(), alignment: "right" },
        { text: i.valor.trim(), alignment: "right" },
      ])
    })

    var dd = {
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldred: {
          color: "red",
          bold: true
        }
      },
      pageMargins: [margin.left, 110, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 10, margin.right, 0],
          columns: [
            {
              image: data.logo,
              width: 120,
              height: 60,
              margin: [6, 0, 0, 0]
            },
            {
              width: "50%",
              fontSize: 7,
              alignment: "center",
              stack: [
                { text: data.nombre_empresa, fontSize: 12 },
                { text: `NIT: ${data.nit_empresa.trim()} - ${data.dv_empresa}`, margin: [0, 2, 0, 0] },
                { text: `${data.regimen_empresa} - ${data.tipoemisor_empresa}` },
                `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia`,
                { text: `Teléfono${data.telefono_empresa}` },
                `E-mail: ${data.email_empresa}`,
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: "PRE FACTURA No", fontSize: 8.5 },
                { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] }, //
                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" }, // 
              ]
            },
          ]
        }
      },
      footer: function (currentPage, pageCount) {
        return {
          fontSize: 7,
          margin: [margin.left, 0, margin.right, 0],
          alignment: "center",
          stack: [
            `Software Propio Fabricado por Titan Soluciones Sas Nit:901289171`
          ]
        }

      },
      content: [
        {

          fillColor: "#dfe6f2",
          table: {
            widths: "*",
            body: [
              [
                {
                  fontSize: 9,

                  columns: [
                    {

                      width: "40%",
                      stack: [
                        { text: `CC O NIT:: ${data.nit_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        { text: `Cliente: ${data.nombre_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        // "",
                        // "",
                        { text: `Dirección: ${data.direccion_cliente}`, margin: [0, 12, 0, 0] },
                        { text: `Ciudad: ${data.ciudad_cliente}`, margin: [0, 2, 0, 0] },
                        { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        { text: `Email: ${data.email_cliente}`, margin: [0, 2, 0, 0] },
                      ]
                    },
                    {
                      width: "17%",
                      stack: [
                        { text: "Forma de Pago:", margin: [0, 2, 0, 0] },
                        { text: "Medio de Pago:", margin: [0, 2, 0, 0] },
                        { text: "Plazo Para Pagar:", margin: [0, 2, 0, 0] },
                        { text: "Fecha Vencimiento:", margin: [0, 2, 0, 0] },
                      ]
                    },
                    {
                      width: "*",
                      stack: [
                        { text: data.forma_pago, margin: [0, 2, 0, 0] },
                        { text: data.medio_pago, margin: [0, 2, 0, 0] },
                        { text: data.plazo_pago, margin: [0, 2, 0, 0] },
                        { text: data.vencecorta_factura, margin: [0, 2, 0, 0] },

                      ]
                    },
                    (data.iddian_fact) ? {
                      width: 110,
                      margin: [10, 0, 0, 0],
                      image: qr,
                    } : {},
                  ]
                },
              ]
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 7,
          table: {
            widths: ["2%", "*", "10%", "9%", "*", "7%", "10%", "10%", "10%", "10%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Paciente", style: "boldcenter" },
                { text: "Edad", style: "boldcenter" },
                { text: "Fecha Servicio", style: "boldcenter" },
                { text: "Servicio", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Val. Unit", style: "boldcenter" },
                // { text: "IVA/IC", style: "boldcenter" },
                { text: "Total", style: "boldcenter" },
                { text: "Copago/Cuota Moderadora", style: "boldcenter" },
                { text: "Autorización", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fillColor: "#dfe6f2",
          fontSize: 7,
          table: {
            widths: ["*", "*", "25%"],
            body: [
              [
                { text: "Impuestos", style: "boldcenter" },
                { text: "Retenciones", style: "boldcenter" },
                { text: "Totales", style: "boldcenter" },
              ],
              [
                {
                  table: {
                    widths: ["15%", "*", "15%", "*"],
                    body: [
                      [
                        { text: "Tipo", style: "boldcenter" },
                        { text: "Base", style: "boldcenter" },
                        { text: "%", style: "boldcenter" },
                        { text: "Valor", style: "boldcenter" },
                      ],
                      ...impuestos
                    ]
                  }
                },
                {

                  table: {
                    widths: ["*", "30%", "*"],
                    body: [
                      [
                        { text: "Base", style: "boldcenter" },
                        { text: "%", style: "boldcenter" },
                        { text: "Valor", style: "boldcenter" },
                      ],
                      ...retenciones
                    ]
                  }
                },
                {
                  table: {
                    widths: ["62%", "*"],
                    body: [
                      [
                        { text: "Concepto", style: "boldcenter" },
                        { text: "Valor", style: "boldcenter" },

                      ],
                      [
                        "Nro Lineas:",
                        { text: totales.lineas.trim(), alignment: "right" },
                      ],
                      [
                        "Base:",
                        { text: totales.base.trim(), alignment: "right" },
                      ],
                      [
                        "Impuestos:",
                        { text: totales.impuestos.trim(), alignment: "right" },
                      ],
                      [
                        "Retenciones:",
                        { text: totales.retenciones.trim(), alignment: "right" },
                      ],
                      [
                        "Copagos/Cuotas Moderadoras:",
                        { text: totales.copagos.trim(), alignment: "right" },
                      ],
                      [
                        "Neto Factura: ",
                        { text: totales.total.trim(), alignment: "right" },
                      ],
                    ]
                  }
                },
              ]
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 9,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: `NOTAS: ${observaciones}`, margin: [0, 10, 0, 0] },
                    { text: `SON: : ${data.TotalEnLetras}*********`, margin: [0, 20, 0, 0] }
                  ]
                }
              ]
            ]
          }
        },
      ]
    }

    if (getBase64) {
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBlob((blob) => {
        res(blob)
      });
    } else {
      pdfMake.createPdf(dd).open();
      res();
    }

  })
};



const rotulodesp = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    const formatCaja = (string, height) => {
      return {
        table: {
          widths: "*",
          heights: height ? height : 5,
          body: [[string]]
        }
      }

    };

    let cajas = [];
    for (let i = 1; i <= (parseFloat(data.tcajas) || 1); i++) {
      cajas.push({
        pageBreak: i % 2 === 0 ? 'after' : "",
        margin: [0, 0, 0, 20],
        table: {
          widths: "*",
          body: [
            [
              {
                stack: [
                  {
                    columns: [
                      { image: data.logo, fit: [110, 110] },
                      { text: "Rotulo de Traslado No.", bold: true, fontSize: 11 },
                      { text: data.consecutivo.trim(), fontSize: 13 },
                      {
                        width: "35%",
                        ...formatCaja({
                          columns: [
                            {
                              bold: true,
                              stack: [
                                "Total Cajas",
                                "Fecha:",
                                "Elaboro:"
                              ]
                            },
                            {
                              stack: [
                                data.tcajas.trim(),
                                { text: data.fechadesp.trim(), fontSize: 8 },
                                { text: data.elabora.trim(), bold: true, fontSize: 8 }
                              ]
                            }
                          ]
                        })
                      }
                    ]
                  },
                  { text: "DESTINO", style: "subtitle", margin: [0, 5, 0, 5] },
                  formatCaja({
                    alignment: "center",
                    stack: [
                      { text: data.destino_rep.trim(), bold: true, fontSize: 15, },
                      { text: [{ text: "Direccion: ", bold: true }, data.direccion_empresa.trim()], margin: [0, 10, 0, 0] },
                      { text: `Recibe: ${data.recibe.trim()}`, bold: true, margin: [0, 10, 0, 0], fontSize: 12 },
                      { text: [{ text: "Teléfono: ", bold: true }, data.telefono_empresa] },
                    ]
                  }),
                  { text: "ORIGEN DEL ENVÍO", style: "subtitle", margin: [0, 10, 0, 0] },
                  { text: data.origen_rep.trim(), style: "boldcenter" },
                  {
                    margin: [0, 10, 0, 0],
                    bold: true,
                    table: {
                      widths: "*",
                      body: [
                        [
                          { text: `CAJA ${i} DE ${data.tcajas.trim()}`, alignment: "center", fontSize: 13 }
                        ],
                        [`CONTENIDO: `]
                      ]
                    }
                  },
                  { text: "SE RUEGA A LAS AUTORIDADES CIVILES Y MILITARES PRESTAR TODA LA AYUDA Y COLABORACION AL TRANSPORTADOR Y/O PERSONA RESPONSABLE DE ESTOS ELEMENTOS", alignment: "center", margin: [0, 2, 0, 0] }
                ]
              },

            ]
          ]
        }
      })
    }

    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        subtitle: {
          alignment: "center", fontSize: 12
        }
      },
      pageMargins: [margin.left, 120, margin.right, 20],
      content: [
        ...cajas
      ]
    }

    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};

const guia = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    let margin = {
      left: 20,
      right: 20
    };


    const subrayado = (string) => {
      return {
        margin: [
          0, -4.5, 0, 0
        ],
        table: {
          widths: "*",
          heights: 5,
          body: [
            [
              {
                text: string,
                border: [false, false, false, true]
              }
            ]
          ]
        }
      }
    };
    const formatCaja = (string, height) => {
      return {
        table: {
          widths: "*",
          heights: height ? height : 5,
          body: [[string]]
        }
      }

    };

    var dd = {
      watermark,
      defaultStyle: {
        fontSize: 11,
      },
      pageMargins: [margin.left, 120, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        marginCaja: {
          alignment: "right",
          margin: [0, 0, 3, 0]
        }
      },

      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 20, margin.right, 20],
          table: {
            widths: "*",
            body: [
              [
                {

                  columns: [
                    { image: data.logo, fit: [150, 150], width: "20%" },
                    {
                      alignment: "right",
                      fontSize: 11,
                      stack: [
                        data.nombre_empresa.trim(),
                        { text: "FORMATO DE CONSTANCIA DE ENTREGA Y RECEPCION DE PEDIDOS", bold: true },
                        "SERVICIOS FARMACEUTICOS - DISTRIBUCION",
                        {
                          margin: [0, 5, 0, 0],
                          fontSize: 9,
                          text: [
                            "Cod: SFDT-FO-03",
                            "V.02",
                            `FECHA DE APROBACION: ${data.fecha.trim()}`
                          ]
                        }

                      ]

                    },
                  ]
                }
              ]
            ]
          }
        }
      },
      content: [
        {
          columns: [
            {
              text: "REMITENTE:",
              width: "18%",
              style: "marginCaja"
            },
            subrayado(data.origen_rep.trim()),
            {
              text: "Nº TRASLADO:",
              width: "15%",
              margin: [6, 0, 0, 0]
            },
            { ...subrayado(data.consecutivo.trim()), width: "8%" },
            {
              text: "FECHA:",
              width: "auto",
              margin: [6, 0, 6, 0]
            },
            formatCaja(data.fecha.trim())
          ]
        },
        {
          margin: [0, 20, 0, 25],
          columns: [
            {
              stack: [
                { columns: [{ text: "DESTINO:", width: "35%", style: "marginCaja" }, subrayado(data.destino_rep.trim())] },
                { columns: [{ text: "ENTREGADO POR:", width: "35%", style: "marginCaja" }, subrayado(data.generaguia.trim())], margin: [0, 20, 0, 0] },
                { columns: [{ text: "RECIBIDO POR:", width: "35%", style: "marginCaja" }, subrayado(data.recibe.trim())], margin: [0, 20, 0, 0] }
              ]
            },
            {
              margin: [10, 0, 0, 0],
              stack: [
                { columns: [{ text: "Nº CAJAS:", style: "marginCaja" }, formatCaja(data.tcajas.trim())] },
                { columns: [{ text: "Nº CADENA DE FRÍO:", style: "marginCaja" }, formatCaja(data.frioguia)], margin: [0, 7, 0, 0] },
                { columns: [{ text: "Nº PACAS PAÑALES:", style: "marginCaja" }, formatCaja(data.panalguia)], margin: [0, 7, 0, 0] },
                { columns: [{ text: "Nº PAQUETES:", style: "marginCaja" }, formatCaja(data.paqueteguia)], margin: [0, 7, 0, 0] }
              ]
            }
          ]
        },
        `OBSERVACION: `,
        { text: data.detalleguia.trim(), margin: [0, 2, 0, 0] },
        subrayado(" ")
      ]



    }

    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};

const dispensacion = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    const productos = data.productos.slice(0, -1).map(p =>
      [
        p.cumcto_rep.trim(),
        p.cumeps_rep.trim(),
        p.descripcion_rep.trim() + " Invima:" + p.invima_rep.trim() + " ATC:" + p.atc_rep.trim(),
        p.descriplaboratorio_rep.trim(),
        p.lote_rep,
        p.vencelote_rep.trim(),
        p.descripresent_rep.trim(),
        p.cantidad_rep.trim(),
        p.cantform_rep.trim(),
      ]
    )
    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 11,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageMargins: [
        margin.left, 110, margin.right, 20
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          fontSize: 10,
          alignment: "center",
          margin: [
            margin.left, 20, margin.right, 20
          ],
          columns: [
            {
              image: data.logo,
              width: 100,
              height: 65
            }, {
              width: "60%",
              margin: [
                5, 0, 0, 0
              ],
              stack: [
                {
                  text: data.nombre_empresa.trim(),
                  bold: true
                },
                data.nit_empresa.trim(),
                data.direccion_empresa.trim(),
                `Tel - ${data.telefono_empresa.trim()} - ${data.ciudad_empresa.trim()}`, {
                },
                {
                  image: textToBase64Barcode(`${data.sede}`),
                  fit: [5000, 40]
                },

              ]
            }, {

              width: "20%",
              stack: [
                `Página ${currentPage} de ${pageCount}`, {
                  text: "ORIGINAL",
                  bold: true,
                  margin: [0, 5, 0, 0]
                }, {
                  margin: [
                    0, 5, 0, 0
                  ],
                  bold: true,
                  table: {
                    widths: ["*",],
                    body: [["Acta de entrega " + data.consecutivo], [data.agencia_rep.trim()],]
                  },
                }
              ]
            }
          ]
        }
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [
            margin.left, 0, margin.right, 20
          ],
          fontSize: 10,
          columns: ["Impreso: " + data.impreso_rep.trim() + " Software Titan Soluciones S.A.S"]
        }
      },
      content: [
        {
          table: {
            widths: ["90%"],
            body: [
              [
                {
                  columns: [
                    {
                      width: "18%",
                      bold: true,
                      stack: [
                        "Cliente:",
                        "Dirección:",
                        "Ciudad:",
                        "Paciente:",
                        "Regimen:",
                        "Autorización:",
                        "Municipio:",
                        "Dirección:",
                        "Teléfono:"
                      ]
                    }, {
                      width: "50%",
                      stack: [
                        data.descrip_cliente.trim(),
                        data.direcc_cliente.trim(),
                        data.ciudad_cliente.trim(),
                        data.descrip_paciente_rep.trim() + " " + data.tipoid_paciente + " " + data.id_paciente,
                        data.nomregimen.trim(),
                        data.autorizacion.trim(),
                        data.ciudad_paciente.trim(),
                        data.direcc_paciente.trim(),

                        {
                          columns: [
                            data.telepaciente.trim(), {
                              text: " Celular: ",
                              bold: true
                            },
                            data.telepaciente.trim(),
                          ]
                        }
                      ]
                    }, {
                      width: "16%",
                      bold: true,
                      stack: [
                        "Nit ó C.C:",
                        "Tel:",
                        "Tipo Servicio:",
                        "",
                        "Feha autorización:",
                        "CIE10:",
                        "",
                        "",
                        "Consecutivo Entrega:",
                        "MIPRES:"
                      ]
                    }, {
                      stack: [
                        data.idcliente,
                        data.tele_cliente,
                        data.tipoorden.trim(),
                        data.fechaautoriza.trim(),
                        data.dx.trim(),
                        " ",
                        parseFloat(data.nroentrega),
                        data.mipres,
                      ]
                    },
                  ]
                }
              ]
            ]
          }
        }, {
          margin: [
            0, 15, 0, 0
          ],
          table: {
            widths: [
              "10%",
              "12%",
              "24%",
              "8%",
              "8%",
              "8%",
              "10%",
              "6%",
              "5%"
            ],
            body: [
              [
                {
                  text: "CUM Contratado",
                  style: "boldcenter"
                },
                {
                  text: "Cod. Eps",
                  style: "boldcenter"
                },
                {
                  text: "Descripción",
                  style: "boldcenter"
                },
                {
                  text: "Laboratorio",
                  style: "boldcenter"
                }, {
                  text: "Lote",
                  style: "boldcenter"
                }, {
                  text: "Fecha Venc.",
                  style: "boldcenter"
                }, {
                  text: "Presentación",
                  style: "boldcenter"
                }, {
                  text: "Cant. Entr",
                  style: "boldcenter"
                }, {
                  text: "Cant. Presc",
                  style: "boldcenter"
                },
              ],
              ...productos
            ]
          }
        }, {
          margin: [
            0, 15, 0, 0
          ],
          fontSize: 8,
          table: {
            heights: [70, "auto"],
            widths: [
              "63%", "30%"
            ],
            body: [
              [
                {
                  stack: [
                    {
                      margin: [0, 50, 0, 0],
                      alignment: "center",
                      columns: [
                        {
                          margin: [15, 0, 0, 0],
                          width: "33.3%",
                          bold: true,
                          stack: [
                            {
                              canvas: [
                                {
                                  type: "line",
                                  x1: 0,
                                  y1: 0,
                                  x2: 180,
                                  y2: 0,
                                  lineWidth: 1,
                                },
                              ],
                            },
                            { text: "Firma", margin: [0, 2, 0, 0] },
                          ],
                        },
                        {
                          margin: [30, 0, 0, 0],
                          width: "30.3%",

                          stack: [
                            { text: "No Identificación", bold: true },
                            { text: " ", margin: [0, 2, 0, 0] },
                          ],
                        },
                        {
                          margin: [40, 0, 0, 0],
                          width: "*",
                          stack: [
                            { text: "Fecha Dispensación", bold: true },
                            { text: data.fecha.trim(), margin: [0, 2, 0, 0] },
                          ],
                        }
                      ]
                    },

                    {
                      columns: [
                        {
                          stack: ["Recibe:", "Cédula Recibe:", "Parentesco", "Teléfono"]
                        }, {
                          stack: [data.retira_rep.trim(), parseFloat(data.idretira_rep), data.parentezco_rep.trim(), data.teleretira_rep]
                        },
                      ]
                    }
                  ]

                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: "Firma Dispensador",
                          alignment: "center",
                          margin: [0, 10, 0, 0]
                        }, {
                          image: data.firma,
                          width: 110,
                          height: 35
                        },
                      ]
                    },
                    data.elabora.trim(),
                  ]
                },
              ],
              [
                {
                  text: `Observaciones: ` + data.observaciones_rep.trim()
                },
                {
                  text: `Valor Copago: $ ` + parseFloat(data.vlr_recibido),
                },
              ]
            ]
          }
        },

      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};
const dispensacion_pos = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 30,
          color: "black",
          opacity: 0.2,
          fontSize: 60,
        } : " ";



    const productos = data.productos.slice(0, -1).map(p =>
      [
        p.descripcion_rep.trim(),
        p.cantidad_rep.trim(),
      ]
    )

    let width = 210;

    let margin = {
      left: 10,
      right: 10
    };

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


    var dd = {
      watermark,
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [
        margin.left, 10, margin.right, 10
      ],


      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          alignment: "center",
          stack: [
            { text: "SIKUANY S.A.S", bold: true, fontSize: 11 },
            data.nit_empresa,
            data.direccion_empresa,
            { text: data.ciudad_empresa, margin: [0, 3, 0, 0] }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          columns: [
            `FECHA:` + data.fecha,
            { text: data.elabora.trim(), alignment: "right" }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 10],
        },
        { text: "ENTREGA DE MEDICAMENTOS", style: "boldcenter", fontSize: 9 },
        { text: `Nro:` + data.consecutivo.trim(), style: "boldcenter", fontSize: 8 },
        { text: data.agencia_rep.trim(), style: "boldcenter", fontSize: 8 },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        { text: data.descrip_paciente_rep.trim(), style: "boldcenter", fontSize: 10 },
        {
          columns: [
            {
              stack: [
                "Id Paciente:",
                "Dirección:",
                "Barrio:",
                "Teléfono:",
                "Régimen:",
                "Observacion:"
              ]
            },
            {
              stack: [
                data.id_paciente,
                data.direcc_paciente,
                data.barriopaciente,
                data.telepaciente,
                data.nomregimen,
                data.observaciones_rep,
              ]
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                "DISPENSACION",
                "AUTORIZACION:",
                "Cliente:",
                { text: "Nit:", margin: [0, 5, 0, 0] }
              ]
            },
            {
              stack: [
                data.consecutivo,
                " ",
                data.descrip_cliente,
                { text: data.idcliente, margin: [0, 5, 0, 0] }
              ]
            },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        {
          layout: "lightHorizontalLines",
          table: {
            widths: [
              "*",
              "10%"
            ],
            body: [
              [
                {
                  text: "Descripción",
                  style: "boldcenter"
                },
                {
                  text: "Cant",
                  style: "boldcenter"
                },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 6, 0, 10],
          columns: [
            { text: "Recibí: ", width: "20%" },
            { ...subrayado(" ") }
          ]
        },
      ]
    }

    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};
const pendientes_pos = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";



    const productos = data.productos.slice(0, -1).map(p =>
      [
        p.descripcion_rep.trim(),
        p.cantidad_rep.trim(),
      ]
    )
    let msg_domicilio = "";
    if (data.domicilio == 1) {
      msg_domicilio = "Entrega a Domicilio"
    } else {
      msg_domicilio = "Entrega en Sede"
    }

    let text_autoriza = "";
    if (!data.autorizacion.trim() == "") {
      text_autoriza = "AUTORIZACION " + data.autorizacion.trim()
    }

    let width = 210;

    let margin = {
      left: 10,
      right: 10
    };

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


    var dd = {
      watermark,
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [
        margin.left, 10, margin.right, 10
      ],


      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          alignment: "center",
          stack: [
            { text: "SIKUANY S.A.S", bold: true, fontSize: 11 },
            data.nit_empresa,
            data.direccion_empresa,
            { text: data.ciudad_empresa, margin: [0, 3, 0, 0] }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          columns: [

            { text: `Fecha: ` },
            `${data.fecha.trim()}\n${data.elabora}`,

            // { text: `FECHA:` + data.fecha \n},
            // { text: data.elabora.trim(), alignment: "right" }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 10],
        },
        { text: "MEDICAMENTOS PENDIENTES DE ENTREGA", style: "boldcenter", fontSize: 9 },
        { text: `Dispensación Nro:` + data.consec_dsp.trim(), style: "boldcenter", fontSize: 8 },
        { text: data.agencia_rep.trim(), style: "boldcenter", fontSize: 8 },
        { text: msg_domicilio, style: "boldcenter", fontSize: 12 },

        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        { text: data.descrip_paciente_rep.trim(), style: "boldcenter", fontSize: 10 },
        {
          columns: [
            {
              stack: [
                "Id Paciente:",
                "Dirección:",
                "Barrio:",
                "Teléfono:",
                "Régimen:",
                "Observacion:"
              ]
            },
            {
              stack: [
                data.id_paciente,
                data.direcc_paciente,
                data.barriopaciente,
                data.telepaciente,
                data.nomregimen,
                data.observacion,
              ]
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                "Cliente:" + data.descrip_cliente,
              ]
            },
            // {
            //   stack: [
            //     // data.consec_dsp,
            //     // " ",
            //     data.descrip_cliente,
            //     // { text: "9000939393", margin: [0, 5, 0, 0] }
            //   ]  
            // },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        {
          layout: "lightHorizontalLines",
          table: {
            widths: [
              "*",
              "10%"
            ],
            body: [
              [
                {
                  text: "Descripción",
                  style: "boldcenter"
                },
                {
                  text: "Cant",
                  style: "boldcenter"
                },
              ],
              ...productos
            ]
          }
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },

        {
          alignment: "center",
          stack: [
            { text: "Declaro que he recibido la informacion del", bold: false, fontSize: 8 },
            { text: "proceso de entrega de Medicamentos pendientes", bold: false, fontSize: 8 },
            { text: "en cumplimiento del decreto 019 de 2012  ", bold: false, fontSize: 8 },
            { text: "y la resolucion 1604 de 2013", bold: false, fontSize: 8 },
          ]
        },

        {
          margin: [0, 10, 0, 10],
          columns: [
            { text: "Recibí: ", width: "20%" },
            { ...subrayado(" ") }
          ]
        },
        // { text: "Titán Soluciones Sas", style: "boldcenter", fontSize: 7 },
      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};
const copago_pos = (data) => {
  return new Promise((res) => {
    let recibido = parseFloat(data.vlr_recibido)

    let width = 210;

    let margin = {
      left: 10,
      right: 10
    };

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


    var dd = {
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [
        margin.left, 10, margin.right, 10
      ],


      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          alignment: "center",
          stack: [
            { text: "SIKUANY S.A.S", bold: true, fontSize: 11 },
            data.nit_empresa,
            data.direccion_empresa,
            { text: data.ciudad_empresa, margin: [0, 3, 0, 0] }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          columns: [

            { text: `Fecha: ` },
            `${data.fecha.trim()}\n${data.elabora}`,

            // { text: `FECHA:` + data.fecha \n},
            // { text: data.elabora.trim(), alignment: "right" }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 10],
        },
        { text: "RECIBO DE CAJA", style: "boldcenter", fontSize: 9 },
        { text: `Nro:` + data.consecutivo.trim(), style: "boldcenter", fontSize: 8 },
        { text: data.agencia_rep.trim(), style: "boldcenter", fontSize: 8 },

        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        data.descrip_paciente_rep.trim(),
        {
          columns: [
            {
              stack: [
                "ID PACIENTE:",
                "REGIMEN:",
                "Observacion:"
              ]
            },
            {
              stack: [
                data.id_paciente,
                data.regimen,
                " "
              ]
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                "",
                "Cliente:",
                { text: "Nit:", margin: [0, 5, 0, 0] }
              ]
            },
            {
              stack: [
                " ",
                data.descrip_cliente,
                { text: "9000939393", margin: [0, 5, 0, 0] }
              ]
            },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        {
          margin: [0, 5, 0, 0],
          columns: [
            {
              stack: [
                { text: "Valor: $" + recibido, style: "boldcenter", fontSize: 12 }
              ]
            },
            {
              stack: [
                ""
              ]
            },
          ]
        },

        {
          margin: [0, 6, 0, 10],
          columns: [
            { text: "Recibí: ", width: "20%" },
            { ...subrayado(" ") }
          ]
        },
        {
          margin: [0, 6, 0, 10],
          columns: [
            {
              width: "20%",
              stack: [
                "Tel:",
                "Cel:"
              ]
            },
            {
              stack: [
                data.telepaciente,
                data.telepaciente,
              ]
            },
          ]
        },
        "TITAN SOLUCIONES S.A.S"
      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};
const cierrecaja_pos = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    let recibido = data.trecaudo_rep.trim();

    let width = 210;

    let margin = {
      left: 10,
      right: 10
    };

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


    var dd = {
      watermark,
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [
        margin.left, 10, margin.right, 10
      ],


      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          alignment: "center",
          stack: [
            { text: "SIKUANY S.A.S", bold: true, fontSize: 11 },
            data.nit_empresa,
            data.direccion_empresa,
            { text: data.ciudad_empresa, margin: [0, 3, 0, 0] }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          columns: [

            { text: `Fecha: ` },
            `${data.fecha_rep.trim()}`,
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 10],
        },
        { text: "CIERRE DE CAJA", style: "boldcenter", fontSize: 9 },
        { text: data.desccajero_rep.trim(), style: "boldcenter", fontSize: 7 },
        { text: data.punto_rep.trim(), style: "boldcenter", fontSize: 8 },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        {
          margin: [0, 5, 0, 0],
          columns: [
            {
              stack: [
                { text: "Valor: $" + recibido, style: "boldcenter", fontSize: 12 }
              ]
            },
            {
              stack: [
                ""
              ]
            },
          ]
        },

        {
          margin: [0, 6, 0, 10],
          columns: [
            { text: "Recibí: ", width: "20%" },
            { ...subrayado(" ") }
          ]
        },
        "TITAN SOLUCIONES S.A.S"
      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};
const novedad_pos = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    let width = 210;

    let margin = {
      left: 10,
      right: 10
    };

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


    var dd = {
      watermark,
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [
        margin.left, 10, margin.right, 10
      ],


      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          alignment: "center",
          stack: [
            { text: "SIKUANY S.A.S", bold: true, fontSize: 11 },
            data.nit_empresa,
            data.direccion_empresa,
            { text: data.ciudad_empresa, margin: [0, 3, 0, 0] }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          columns: [
            `FECHA: ` + data.fecha,
            { text: data.elabora.trim(), alignment: "right" }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 10],
        },
        { text: "NOVEDAD DE ATENCION", style: "boldcenter", fontSize: 9 },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        data.descrip_paciente_rep.trim(),
        {
          columns: [
            {
              stack: [
                "ID PACIENTE: ",
                "REGIMEN: ",
                "NOVEDAD: ",
                "Observación: "
              ]
            },
            {
              stack: [
                data.id_paciente,
                data.regimenpaciente,
                data.descrip_novedad_rep.trim(),
                data.observ1_rep.trim(),
              ]
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                "EPS:",
              ]
            },
            {
              stack: [
                data.descrip_eps,
              ]
            },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 2, 0, 5],
        },
        {
          margin: [0, 6, 0, 10],
          columns: [
            { text: "Recibí: ", width: "20%" },
            { ...subrayado(" ") }
          ]
        },
        {
          margin: [0, 6, 0, 10],
          columns: [
            {
              width: "20%",
              stack: [
                "Tel:",
              ]
            },
            {
              stack: [
                data.telepaciente,
              ]
            },
          ]
        },
        "TITAN SOLUCIONES S.A.S"
      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

    // pdfMake.createPdf(dd).open();
    // res();

  });
};
const solicita_traslado = async (data) => {
  let watermark =
    data.estado_rep === "1" ?
      {
        text: "Anulado",
        angle: 20,
        color: "black",
        opacity: 0.2,
        fontSize: 100,
      } : " ";


  return new Promise(res => {
    const productos = data.productos.slice(0, -1).map((el, i) => [
      i + 1,
      el.cum_rep.trim(),
      el.descripcion_rep.trim(),
      "UNIDAD",
      el.cantidad_rep.trim(),
      el.lote_rep.trim(),
      el.vence_rep.trim(),
    ]);
    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 100, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 20],
            columns: [
              { image: data.logo, fit: [120, 150], width: "25%" },
              {
                alignment: "center",
                fontSize: 10,
                stack: [
                  { text: data.nombre_empresa.trim(), bold: true, fontSize: 14 },
                  `NIT: ${data.nit_empresa.trim()}`,
                  `Responsable de IVA -`,
                  `${data.direccion_empresa.trim()} - ${data.ciudad_empresa.trim()} - Colombia`,
                  `Telefóno: ${data.telefono_empresa.trim()}`,
                  `Correo: ${data.email_empresa.trim()}`

                ]

              },
              {
                style: "boldcenter",
                fontSize: 13,
                stack: [
                  "Traslado de Mercancias",
                  `Nro: ${data.consecutivo.trim()}`,
                  { text: `Fecha: ${data.fecha.trim()}`, margin: [0, 10, 0, 0] },
                ]

              },
            ]
          }
        ]
      },
      content: [
        {
          margin: [0, 10, 0, 0],
          fontSize: 14,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: [{ text: "Origen: ", bold: true }, data.origen_rep.trim()] },
                    { text: [{ text: "Destino: ", bold: true }, data.destino_rep], margin: [0, 5, 0, 0] },
                    { text: [{ text: "Observaciones: ", bold: true }, data.observacion_rep], margin: [0, 5, 0, 0] },
                  ]
                }
              ],

            ]
          }
        },
        {
          margin: [0, 50, 0, 0],
          fontSize: 9.2,
          table: {
            widths: ["auto", "14%", "*", "10%", "10%", "16%", "13%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Cum", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "U. Medida", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Lote", style: "boldcenter" },
                { text: "Vence", style: "boldcenter" },
              ],
              ...productos

            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          columns: [
            {
              margin: [15, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Solicita:", style: "bold", margin: [0, 2, 0, 0] },
                { text: data.elabora.trim(), fontSize: 9 }
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Registra:", style: "boldleft", margin: [0, 2, 0, 0] },
                { text: data.alista.trim(), fontSize: 9 }
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Alista Físico:", style: "boldleft", margin: [0, 2, 0, 0] },
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Despacha:", style: "boldleft", margin: [0, 2, 0, 0] },
              ],
            },

          ]
        },
      ]



    }

    // pdfDocGenerator.getBlob((blob) => {
    //   printJS({
    //     printable: URL.createObjectURL(blob),
    //     onPrintDialogClose: () => {
    //       res();
    //     },
    //   });
    // });

    pdfMake.createPdf(dd).open();
    res();


  });
};
const precargue = async (data) => {
  return new Promise(res => {
    let watermark =
      data.estado === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";

    const productos = data.productos.slice(0, -1).map((el, i) => [
      i + 1,
      el.descripcion_rep.trim(),
      el.cantidad_rep.trim(),
      el.detalleitem_rep.trim(),
    ]);
    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 100, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 20],
            columns: [
              { image: data.logo, fit: [120, 150], width: "25%" },
              {
                alignment: "center",
                fontSize: 10,
                stack: [
                  { text: data.nombre_empresa.trim(), bold: true, fontSize: 14 },
                  `NIT: ${data.nit_empresa.trim()}`,
                  `Responsable de IVA -`,
                  `${data.direccion_empresa.trim()} - ${data.ciudad_empresa.trim()} - Colombia`,
                  `Telefóno: ${data.telefono_empresa.trim()}`,
                  `Correo: ${data.email_empresa.trim()}`

                ]

              },
              {
                style: "boldcenter",
                fontSize: 13,
                stack: [
                  "PRE_CARGUE DE PEDIDO",
                  `Nro: ${data.consecutivo.trim()}`,
                  { text: `Fecha: ${data.fecha.trim()}`, margin: [0, 10, 0, 0] }

                ]

              },
            ]
          }
        ]
      },
      content: [
        {
          margin: [0, 10, 0, 0],
          fontSize: 14,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: [{ text: "Origen: ", bold: true }, data.origen_rep.trim()] },
                    { text: [{ text: "Destino: ", bold: true }, data.destino_rep], margin: [0, 5, 0, 0] },
                  ]
                }
              ],

            ]
          }
        },
        {
          margin: [0, 50, 0, 0],
          fontSize: 9.2,
          table: {
            widths: ["2%", "*", "10%", "*"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Observación", style: "boldcenter" },
              ],
              ...productos

            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          columns: [
            {
              margin: [15, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Elabora:", style: "bold", margin: [0, 2, 0, 0] },
                { text: data.elabora.trim(), fontSize: 9 }
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Registra:", style: "boldleft", margin: [0, 2, 0, 0] },
                { text: data.alista.trim(), fontSize: 9 }
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Alista Físico:", style: "boldleft", margin: [0, 2, 0, 0] },
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "25%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Despacha:", style: "boldleft", margin: [0, 2, 0, 0] },
              ],
            },

          ]
        },
      ]



    }

    // pdfDocGenerator.getBlob((blob) => {
    //   printJS({
    //     printable: URL.createObjectURL(blob),
    //     onPrintDialogClose: () => {
    //       res();
    //     },
    //   });
    // });

    pdfMake.createPdf(dd).open();
    res();


  });
};
const alistamiento = async (data) => {
  return new Promise(res => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";
    const productos = data.productos.slice(0, -1).map((el, i) => [
      i + 1,
      el.codigo_rep.trim(),
      el.descripcion_rep.trim(),
      "UNIDAD",
      el.cantidad_rep.trim(),
      el.lote_rep.trim(),
      el.vence_rep.trim(),
    ]);
    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 100, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 20],
            columns: [
              { image: data.logo, fit: [120, 150], width: "25%" },
              {
                alignment: "center",
                fontSize: 10,
                stack: [
                  { text: data.nombre_empresa.trim(), bold: true, fontSize: 14 },
                  `NIT: ${data.nit_empresa.trim()}`,
                  `Responsable de IVA -`,
                  `${data.direccion_empresa.trim()} - ${data.ciudad_empresa.trim()} - Colombia`,
                  `Telefóno: ${data.telefono_empresa.trim()}`,
                  `Correo: ${data.email_empresa.trim()}`

                ]

              },
              {
                style: "boldcenter",
                fontSize: 13,
                stack: [
                  "Alistamiento de Mercancias",
                  `Nro: ${data.consecutivo.trim()}`,
                  { text: `Fecha: ${data.fecha.trim()}`, margin: [0, 10, 0, 0] }

                ]

              },
            ]
          }
        ]
      },
      content: [
        {
          margin: [0, 10, 0, 0],
          fontSize: 14,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: [{ text: "Origen: ", bold: true }, data.origen_rep.trim()] },
                    { text: [{ text: "Destino: ", bold: true }, data.destino_rep], margin: [0, 5, 0, 0] },
                  ]
                }
              ],

            ]
          }
        },
        {
          margin: [0, 50, 0, 0],
          fontSize: 9.2,
          table: {
            widths: ["auto", "14%", "*", "10%", "10%", "16%", "13%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Cum", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "U. Medida", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Lote", style: "boldcenter" },
                { text: "Vence", style: "boldcenter" },
              ],
              ...productos

            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          columns: [
            {
              margin: [15, 0, 0, 0],
              width: "33.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "ELABORADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
                { text: data.elabora.trim(), alignment: "center", fontSize: 9 }
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "30.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "APROBADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "28.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "REVISADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
          ]
        },
      ]



    }

    // pdfDocGenerator.getBlob((blob) => {
    //   printJS({
    //     printable: URL.createObjectURL(blob),
    //     onPrintDialogClose: () => {
    //       res();
    //     },
    //   });
    // });

    pdfMake.createPdf(dd).open();
    res();


  });
};
const pedido = async (data) => {
  return new Promise(res => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";



    const productos = data.productos.slice(0, -1).map((el, i) => [
      i + 1,
      el.cum_rep.trim(),
      el.descripcion_rep.trim(),
      el.cantidad_rep.trim(),
      el.cantempaca_rep.trim(),
      el.cantrecibe_rep.trim(),
      el.lote_rep.trim(),
      el.vence_rep.trim(),
    ]);
    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 100, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 20],
            columns: [
              { image: data.logo, fit: [120, 150], width: "25%" },
              {
                alignment: "center",
                fontSize: 10,
                stack: [
                  { text: data.nombre_empresa.trim(), bold: true, fontSize: 14 },
                  `NIT: ${data.nit_empresa.trim()}`,
                  `Responsable de IVA -`,
                  `${data.direccion_empresa.trim()} - ${data.ciudad_empresa.trim()} - Colombia`,
                  `Telefóno: ${data.telefono_empresa.trim()}`,
                  `Correo: ${data.email_empresa.trim()}`

                ]

              },
              {
                style: "boldcenter",
                fontSize: 13,
                stack: [
                  "Alistamiento de Mercancias",
                  `Nro: ${data.consecutivo.trim()}`,
                  { text: `Fecha: ${data.fecha.trim()}`, margin: [0, 10, 0, 0] }

                ]

              },
            ]
          }
        ]
      },
      content: [
        {
          margin: [0, 10, 0, 0],
          fontSize: 14,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: [{ text: "Origen: ", bold: true }, data.origen_rep.trim()] },
                    { text: [{ text: "Destino: ", bold: true }, data.destino_rep], margin: [0, 5, 0, 0] },
                  ]
                }
              ],

            ]
          }
        },
        {
          margin: [0, 50, 0, 0],
          fontSize: 9.2,
          table: {
            widths: ["auto", "14%", "*", "10%", "10%", "10%", "16%", "13%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Cum", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Alistado", style: "boldcenter" },
                { text: "Empacado", style: "boldcenter" },
                { text: "Recibido", style: "boldcenter" },
                { text: "Lote", style: "boldcenter" },
                { text: "Vence", style: "boldcenter" },
              ],
              ...productos

            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          columns: [
            {
              margin: [10, 0, 0, 0],
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Solicita:", style: "bold", fontSize: 7, margin: [0, 2, 0, 0] },
                { text: data.elabora.trim(), fontSize: 7 }
              ],
            },
            {
              margin: [50, 0, 0, 0],
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Alista:", style: "boldleft", fontSize: 7, margin: [0, 2, 0, 0] },
                { text: data.alista.trim(), fontSize: 7 }

              ],
            },
            {
              margin: [20, 0, 0, 0],
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Empaca:", style: "boldleft", fontSize: 7, margin: [0, 2, 0, 0] },
                { text: data.empaca.trim(), fontSize: 7 }
              ],
            },
            {
              margin: [40, 0, 0, 0],
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Despacha:", style: "boldleft", fontSize: 7, margin: [0, 2, 0, 0] },
                { text: data.generaguia.trim(), fontSize: 7 }
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "Recibe:", style: "boldleft", fontSize: 7, margin: [0, 2, 0, 0] },
                { text: data.recepciona.trim(), fontSize: 7 }
              ],
            },


          ]
        },
      ]



    }

    // pdfDocGenerator.getBlob((blob) => {
    //   printJS({
    //     printable: URL.createObjectURL(blob),
    //     onPrintDialogClose: () => {
    //       res();
    //     },
    //   });
    // });

    pdfMake.createPdf(dd).open();
    res();


  });
};
const turnos_pos = async (data) => {
  let watermark =
    data.estado_rep === "1" ?
      {
        text: "Anulado",
        angle: 20,
        color: "black",
        opacity: 0.2,
        fontSize: 100,
      } : " ";

  return new Promise(res => {
    const nombreCompleto_pac = data.paciente.identificacion ? `${data.paciente.nombres.trim()} ${data.paciente.primerApellido.trim()} ${data.paciente.segundoApellido.trim()}` : ''
    let width = 200;

    let margin = {
      left: 10,
      right: 10
    };


    var dd = {
      watermark,
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 9,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageSize: {
        width: 200,
        height: 300,
      },
      pageMargins: [
        margin.left, 10, margin.right, 20
      ],


      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          style: "boldcenter",
          fontSize: 22,
          stack: [
            {
              image: data.logo,
              width: 130,
              height: 50,
              margin: [0, 2, 0, 6]
            },
            "TURNO:",
            `${data.idturno_rep.trim()} ${data.turnonro}`,
            { text: [data.punto_turno.trim()], fontSize: 10 },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          stack: [
            { text: [{ text: "Descripción: ", bold: true }, data.descrip_rep.trim()], fontSize: 15 },
            { text: [{ text: "Paciente: ", bold: true }, parseFloat(data.cod_rep) == 3 ? "EVENTO" : nombreCompleto_pac] },

            { text: [{ text: "Fecha y Hora: ", bold: true }, data.fecha] },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - margin.right * 2,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
          margin: [0, 5, 0, 5],
        },
        // { text: "TITAN SOLUCIONES S.A.S", alignment: "right"}
      ]
    }

    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

    // pdfMake.createPdf(dd).open();
    // res();


  });
};
const doc_invent_fisico = async (data) => {
  return new Promise(res => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";
    let productos = [];

    data.registros.forEach((el, i) => {
      productos.push([
        i + 1,
        el.cum.trim(),
        el.producto.trim(),
        el.lote.trim(),
        el.vence.trim(),
        el.cantidad.trim(),
      ]);
    })

    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 100, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 20],
            columns: [
              { image: data.logo, fit: [120, 150], width: "25%" },
              {
                alignment: "center",
                fontSize: 10,
                stack: [
                  { text: data.nombre_empresa, bold: true, fontSize: 14 },
                  `NIT: ${data.nit_empresa}`,
                  `Responsable de IVA -`,
                  `${data.direccion_empresa} - ${data.ciudad_empresa.trim()} - Colombia`,
                  `Telefóno: ${data.telefono_empresa}`,
                  `Correo: ${data.email_empresa}`

                ]

              },
              {
                style: "boldcenter",
                fontSize: 13,
                stack: [
                  `${data.nombredoc.trim()}`,
                  `Nro: ${data.consecutivo.trim()}`,
                  { text: `Fecha: ${data.fecha.trim()}`, margin: [0, 10, 0, 0] }

                ]

              },
            ]
          }
        ]
      },
      content: [
        {
          margin: [0, 10, 0, 0],
          fontSize: 14,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: [{ text: "Nombre: ", bold: true }, data.nombre.trim()] },
                    { text: [{ text: "Conteo: ", bold: true }, data.conteo.trim()] },
                  ]
                }
              ],

            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 9.2,
          table: {
            widths: ["auto", "14%", "*", "10%", "10%", "16%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Cum", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Lote", style: "boldcenter" },
                { text: "Vence", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },

              ],
              ...productos

            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          columns: [
            {
              margin: [15, 0, 0, 0],
              width: "33.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "ELABORADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
                { text: data.elabora.trim(), alignment: "center", fontSize: 9 }
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "30.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "APROBADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "28.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "REVISADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
          ]
        },
      ]



    }

    // pdfDocGenerator.getBlob((blob) => {
    //   printJS({
    //     printable: URL.createObjectURL(blob),
    //     onPrintDialogClose: () => {
    //       res();
    //     },
    //   });
    // });

    pdfMake.createPdf(dd).open();
    res();


  });
};
const doc_inventario = async (data) => {
  return new Promise(res => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";
    let productos = [];

    data.registros.forEach((el, i) => {
      productos.push([
        i + 1,
        el.cum_rep.trim(),
        el.producto.trim(),
        el.lote_rep.trim(),
        el.vence_rep.trim(),
        el.cantidad.trim(),
      ]);
    })

    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 100, margin.right, 20],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },

      

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 20],
            columns: [
              { image: data.logo, fit: [120, 150], width: "25%" },
              {
                alignment: "center",
                fontSize: 10,
                stack: [
                  { text: data.nombre_empresa, bold: true, fontSize: 14 },
                  `NIT: ${data.nit_empresa}`,
                  `Responsable de IVA -`,
                  `${data.direccion_empresa} - ${data.ciudad_empresa.trim()} - Colombia`,
                  `Telefóno: ${data.telefono_empresa}`,
                  `Correo: ${data.email_empresa}`

                ]

              },
              {
                style: "boldcenter",
                fontSize: 13,
                stack: [
                  `${data.nombredoc.trim()}`,
                  `Nro: ${data.consecutivo.trim()}`,
                  { text: `Fecha: ${data.fecha.trim()}`, margin: [0, 10, 0, 0] }

                ]

              },
            ]
          }
        ]
      },
      content: [
        {
          margin: [0, 10, 0, 0],
          fontSize: 14,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: [{ text: "Proveedor: ", bold: true }] },
                    { text: [{ text: " ", bold: true }] },
                  ]
                }
              ],

            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 9.2,
          table: {
            widths: ["auto", "14%", "*", "10%", "10%", "16%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Cum", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Lote", style: "boldcenter" },
                { text: "Vence", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },

              ],
              ...productos

            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          columns: [
            {
              margin: [15, 0, 0, 0],
              width: "33.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "ELABORADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
                { text: data.elabora.trim(), alignment: "center", fontSize: 9 }
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "30.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 150,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "APROBADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
            {
              margin: [60, 0, 0, 0],
              width: "28.3%",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 180,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                { text: "REVISADO:", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
          ]
        },
      ]



    }

    // pdfDocGenerator.getBlob((blob) => {
    //   printJS({
    //     printable: URL.createObjectURL(blob),
    //     onPrintDialogClose: () => {
    //       res();
    //     },
    //   });
    // });

    pdfMake.createPdf(dd).open();
    res();


  });
};
const factura_titan = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian
  let qr = await QRCode.toDataURL(url);

  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    console.log("imprime", data)
    let totales = data.totales[0]
    let paciente = data.productos[0].paciente.trim();
    let productos = [];
    let impuestos = [];
    let retenciones = [];
    let observaciones = window.atob(data.Observaciones64.trim())


    let descripcion = "";
    let descripcion64 = "";
    data.productos.pop();
    data.productos.forEach((p, i) => {
      p.nro_servicio = parseFloat(p.nro_servicio.trim()),
        productos.push([
          i + 1,
          //  p.codigo,        
          { text: p.codigo.trim(), alignment: "left", fontSize: 6 },
          { text: p.nombre_servicio.trim(), alignment: "left", fontSize: 6 },
          { text: p.autorizacion.trim(), alignment: "right" },
          { text: p.lote.trim(), alignment: "right" },
          { text: p.vencelote.trim(), alignment: "right" },
          { text: p.cantidad.trim(), alignment: "right" },
          { text: p.vlr_unit.trim(), alignment: "right" },
          { text: p.tot_producto.trim(), alignment: "right" },
          { text: p.copago.trim(), alignment: "right" },

        ])

    })

    data.impuestos.pop();
    data.impuestos.forEach(i => {
      impuestos.push([
        i.tipo,
        i.base.trim(),
        { text: i.porcentaje.trim(), alignment: "right" },
        { text: i.valor.trim(), alignment: "right" },
      ])
    })

    data.retenciones.forEach(i => {
      retenciones.push([
        i.base.trim(),
        { text: i.porcentaje.trim(), alignment: "right" },
        { text: i.valor.trim(), alignment: "right" },
      ])
    })

    var dd = {
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldred: {
          color: "red",
          bold: true
        }
      },
      pageMargins: [margin.left, 110, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 10, margin.right, 0],
          columns: [
            {
              image: data.logo,
              width: 120,
              height: 60,
              margin: [6, 0, 0, 0]
            },
            {
              width: "50%",
              fontSize: 7,
              alignment: "center",
              stack: [
                { text: data.nombre_empresa, fontSize: 12 },
                { text: `NIT: ${data.nit_empresa.trim()} - ${data.dv_empresa}`, margin: [0, 2, 0, 0] },
                { text: `${data.regimen_empresa} - ${data.tipoemisor_empresa}` },
                `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia`,
                { text: `Teléfono${data.telefono_empresa}` },
                `E-mail: ${data.email_empresa}`,
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
                `REPRESENTACION GRAFICA DE FACTURA ELECTRONICA`,
                { text: `Resolución  Facturación Dian   ${data.nrores_dian.trim()}`, fontSize: 7, },
                { text: `${data.rango_dian} - ${data.vigencia_dian}` },

              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: "FACTURA ELECTRONICA DE VENTA No", fontSize: 8.5 },
                { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] }, //
                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" }, // 
                { text: `Fecha Validación DIAN: ${data.fechadian_factura}`, fontSize: 8, margin: [0, 5, 0, 0] }, //
              ]
            },
          ]
        }
      },
      footer: function (currentPage, pageCount) {
        return {
          fontSize: 7,
          margin: [margin.left, 0, margin.right, 0],
          alignment: "center",
          stack: [
            `Software Propio Fabricado por Titan Soluciones Sas Nit:901289171`
          ]
        }

      },
      content: [
        {

          fillColor: "#dfe6f2",
          table: {
            widths: "*",
            body: [
              [
                {
                  fontSize: 9,

                  columns: [
                    {

                      width: "40%",
                      stack: [
                        { text: `CC O NIT:: ${data.nit_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        { text: `Cliente: ${data.nombre_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        // "",
                        // "",
                        { text: `Dirección: ${data.direccion_cliente}`, margin: [0, 12, 0, 0] },
                        { text: `Ciudad: ${data.ciudad_cliente}`, margin: [0, 2, 0, 0] },
                        { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        { text: `Email: ${data.email_cliente}`, margin: [0, 2, 0, 0] },
                      ]
                    },
                    {
                      width: "17%",
                      stack: [
                        { text: "Forma de Pago:", margin: [0, 2, 0, 0] },
                        { text: "Medio de Pago:", margin: [0, 2, 0, 0] },
                        { text: "Plazo Para Pagar:", margin: [0, 2, 0, 0] },
                        { text: "Fecha Vencimiento:", margin: [0, 2, 0, 0] },
                        { text: "Contrato:", margin: [0, 2, 0, 0] },
                        { text: "Paciente:", margin: [0, 2, 0, 0] },
                      ]
                    },
                    {
                      width: "*",
                      stack: [
                        { text: data.forma_pago, margin: [0, 2, 0, 0] },
                        { text: data.medio_pago, margin: [0, 2, 0, 0] },
                        { text: data.plazo_pago, margin: [0, 2, 0, 0] },
                        { text: data.vencecorta_factura, margin: [0, 2, 0, 0] },
                        { text: data.contrato_rep, margin: [0, 2, 0, 0] },
                        { text: paciente, margin: [0, 2, 0, 0] },


                      ]
                    },
                    (data.iddian_fact) ? {
                      width: 110,
                      margin: [10, 0, 0, 0],
                      image: qr,
                    } : {},
                  ]
                },
              ]
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 7,
          table: {
            widths: ["2%", "7%", "*", "7%", "9%", "7%", "10%", "10%", "10%", "10%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Codigo", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Autorización", style: "boldcenter" },
                { text: "Lote", style: "boldcenter" },
                { text: "Vence Lote", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Vlr. Unit", style: "boldcenter" },
                { text: "Total", style: "boldcenter" },
                { text: "Copago/Cuota Moderadora", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fillColor: "#dfe6f2",
          fontSize: 7,
          table: {
            widths: ["*", "*", "25%"],
            body: [
              [
                { text: "Impuestos", style: "boldcenter" },
                { text: "Retenciones", style: "boldcenter" },
                { text: "Totales", style: "boldcenter" },
              ],
              [
                {
                  table: {
                    widths: ["15%", "*", "15%", "*"],
                    body: [
                      [
                        { text: "Tipo", style: "boldcenter" },
                        { text: "Base", style: "boldcenter" },
                        { text: "%", style: "boldcenter" },
                        { text: "Valor", style: "boldcenter" },
                      ],
                      ...impuestos
                    ]
                  }
                },
                {

                  table: {
                    widths: ["*", "30%", "*"],
                    body: [
                      [
                        { text: "Base", style: "boldcenter" },
                        { text: "%", style: "boldcenter" },
                        { text: "Valor", style: "boldcenter" },
                      ],
                      ...retenciones
                    ]
                  }
                },
                {
                  table: {
                    widths: ["62%", "*"],
                    body: [
                      [
                        { text: "Concepto", style: "boldcenter" },
                        { text: "Valor", style: "boldcenter" },

                      ],
                      [
                        "Nro Lineas:",
                        { text: totales.lineas.trim(), alignment: "right" },
                      ],
                      [
                        "Base:",
                        { text: totales.base.trim(), alignment: "right" },
                      ],
                      [
                        "Impuestos:",
                        { text: totales.impuestos.trim(), alignment: "right" },
                      ],
                      [
                        "Retenciones:",
                        { text: totales.retenciones.trim(), alignment: "right" },
                      ],
                      [
                        "Copagos/Cuotas Moderadoras:",
                        { text: totales.copagos.trim(), alignment: "right" },
                      ],
                      [
                        "Neto Factura: ",
                        { text: totales.total.trim(), alignment: "right" },
                      ],
                    ]
                  }
                },
              ]
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 9,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: `NOTAS: ${observaciones}`, margin: [0, 10, 0, 0] },
                    { text: `SON: : ${data.TotalEnLetras}*********`, margin: [0, 20, 0, 0] }
                  ]
                }
              ]
            ]
          }
        },
        { text: `CUFE: : ${data.iddian_fact}`, margin: [0, 20, 0, 0], fontSize: 9, }
      ]
    }
    if (getBase64) {
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBlob((blob) => {
        res(blob)
      });
    } else {
      pdfMake.createPdf(dd).download(data.numero_fact.trim());
      res();
    }
  })
};
const orden_compra = (data) => {
  return new Promise((res, rej) => {
    var detalle = [];
    let subtotal = 0;

    data.productos.forEach((el) => {
      let vlr_unitario = parseFloat(el.vlrunit.replace(/\,/g, ""));
      let vlr_subtotal = parseFloat(el.vlrsubtotal.replace(/\,/g, ""));
      let nombre_servicio = `${el.nombreservicio} ${el.nombreservicio2} ${el.nombreservicio3} ${el.nombreservicio4}`
      subtotal += vlr_subtotal;
      let obj = [
        el.barras,
        el.cantidad,
        nombre_servicio,
        { text: formatNumero(vlr_unitario), alignment: "right" },
        { text: formatNumero(vlr_subtotal), alignment: "right" },
      ];

      detalle.push(obj);
    });

    console.log("detalle", detalle)

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

                  // {
                  //   alignment: "center",
                  //   text: data.ciudadEmpresa + `-` + data.dptoEmpresa,
                  //   fontSize: 10,
                  // },
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
            widths: ["15%", "12%", "*", "15%", "15%"],
            body: [
              [
                { text: "CODIGO", style: "header_tabla" },
                { text: "CANTIDAD", style: "header_tabla" },
                { text: "DETALLE", style: "header_tabla" },
                { text: "VLR UNITARIO", style: "header_tabla" },
                { text: "VLR TOTAL", style: "header_tabla" },
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
              [
                {
                  text: [
                    {
                      text: "Fecha entrega:",
                      bold: true,
                    },
                    {
                      text: data.fechaentrega_prov,
                    },
                  ],
                },
                {
                },

              ],
              [
                {
                  text: [
                    {
                      text: "Dirección entrega: ",
                      bold: true,
                    },
                    {
                      text: data.direccentrega_prov,
                    },
                  ],
                  colSpan: 2,
                },
                null,
              ],
              [
                {
                },
                {
                },
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
const acta_entrega = (data) => {
  console.log(data)
  return new Promise((res) => {
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    const productos = data.productos.slice(0, -1).map(p =>
      [
        p.cum_rep.trim(),
        p.descripcion_rep.trim(),
        // p.descriplaboratorio_rep.trim(),
        p.invima_rep,
        p.lote_rep,
        p.vence_rep,
        p.cantidad_rep.trim(),
      ]
    )
    let margin = {
      left: 20,
      right: 20
    };

    var dd = {
      watermark,
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 11,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      pageMargins: [
        margin.left, 110, margin.right, 20
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          fontSize: 10,
          alignment: "center",
          margin: [
            margin.left, 20, margin.right, 20
          ],
          columns: [
            {
              image: data.logo,
              width: 100,
              height: 65
            }, {
              width: "60%",
              margin: [
                5, 0, 0, 0
              ],
              stack: [
                {
                  text: data.nombre_empresa.trim(),
                  bold: true
                },
                data.nit_empresa.trim(),
                data.direccion_empresa.trim(),
                `Tel - ${data.telefono_empresa.trim()} - ${data.ciudad_empresa.trim()}`, {
                },
              ]
            }, {

              width: "20%",
              stack: [
                `Página ${currentPage} de ${pageCount}`, {
                  text: "ORIGINAL",
                  bold: true,
                  margin: [0, 5, 0, 0]
                }, {
                  margin: [
                    0, 5, 0, 0
                  ],
                  bold: true,
                  table: {
                    widths: ["*",],
                    body: [["Traslado Mercancías Express" + data.consecutivo], [data.origen_rep.trim()],]
                  },
                }
              ]
            }
          ]
        }
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [
            margin.left, 0, margin.right, 20
          ],
          fontSize: 10,
          columns: ["Genera: " + data.elabora.trim() + " Software Titan Soluciones S.A.S"]
        }
      },
      content: [
        {
          table: {
            widths: ["90%"],
            body: [
              [
                {
                  columns: [
                    {
                      width: "18%",
                      bold: true,
                      stack: [
                        "Destino:",
                        "Origen:",
                        "Ciudad:",
                      ]
                    }, {
                      width: "50%",
                      stack: [
                        data.destino_rep.trim(),
                        data.origen_rep.trim(),
                        data.ciudad_empresa.trim(),
                      ]
                    },
                  ]
                }
              ]
            ]
          }
        }, {
          margin: [
            0, 15, 0, 0
          ],
          table: {
            widths: [
              "8%",
              "43%",
              "12%",
              "10%",
              "8%",
              "8%",
            ],
            body: [
              [
                {
                  text: "Cum",
                  style: "boldcenter"
                },
                {
                  text: "Descripción",
                  style: "boldcenter"
                },
                {
                  text: "Invima",
                  style: "boldcenter"
                },
                {
                  text: "Lote",
                  style: "boldcenter"
                }, {
                  text: "Fecha Venc.",
                  style: "boldcenter"
                },
                {
                  text: "Cantidad",
                  style: "boldcenter",
                  alignment: "center",
                },
              ],
              ...productos
            ],
          }
        }, {
          margin: [
            0, 15, 0, 0
          ],
          fontSize: 8,
          table: {
            heights: [70, "auto"],
            widths: [
              "91%", "20%"
            ],
            body: [
              [
                {
                  stack: [
                    {
                      fontSize: 9,
                      margin: [0, 40, 0, 0],
                      columns: [
                        { text: `Despachador: ` + data.elabora.trim(), width: "45%", bold: true },
                        { text: `Recepciona: ` + data.recibe.trim(), width: "45%", bold: true },
                      ]
                    },

                    {
                      fontSize: 9,
                      margin: [0, 5, 0, 0],
                      columns: [
                        { text: `Observacion: ` + data.observacion_rep.trim(), width: "45%", bold: true },
                        { text: `Observacion: ` + data.detallerec_rep.trim(), width: "45%", bold: true },
                      ]
                    },

      
                  ]
                },
              ],

            ]

          }
        },

      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(dd);

    pdfDocGenerator.getBlob((blob) => {
      printJS({
        printable: URL.createObjectURL(blob),
        onPrintDialogClose: () => {
          res();
        },
      });
    });

  });
};

export {
  acta_entrega,
  alistamiento,
  cierrecaja_pos,
  copago_pos,
  doc_invent_fisico,
  dispensacion,
  dispensacion_pos,
  doc_inventario,
  factura_titan,
  prefactura_titan,
  pendientes_pos,
  novedad_pos,
  solicita_traslado,
  turnos_pos,
  guia,
  pedido,
  precargue,
  rotulodesp,
  orden_compra,


};
