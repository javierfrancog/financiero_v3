import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { before, cond, trim } from "lodash";
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

const solicitudCredito = (data) => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    // ESTRUCTURAR TABLA DE PRIMAS
    data.primas_rep.pop();
    let leftColumn = [];
    let rightColumn = [];

    data.primas_rep.forEach((prima, index) => {
      let row = ["PRIMA", "$", prima.vlrprima_rep.trim(), "Fecha", prima.fechaprima_rep];

      if (index % 2 === 0) {
        leftColumn.push(row);
      } else {
        rightColumn.push(row);
      }
    });

    // Rellenar la última fila de la columna derecha si es necesario para mantener el balance visual
    if (leftColumn.length > rightColumn.length) {
      rightColumn.push(["PRIMA", "$", " ", "Fecha", " "]);
    }

    const formatCaja = (string, height) => {
      return {
        table: {
          widths: "*",
          heights: height ? height : 5,
          body: [
            [string]
          ]
        }
      }

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

    const condicional = (dato, datoPdf) => {
      return (dato == datoPdf) ? "X" : " "
    };

    let fechaArray = data.fecha_rep.split("-");

    var dd = {
      pageMargins: [margin.left, 20, margin.right, 40],
      styles: {
        smallHeader: {
          fontSize: 6,
          alignment: "center"
        },
        header: {
          fontSize: 10,
          bold: true,
          alignment: "center"
        },
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      content: [
        {
          fontSize: 8,
          table: {
            widths: "*",
            headerRows: 1,
            body: [
              [
                {
                  columns: [
                    {
                      width: "12%",
                      stack: [
                        {
                          image: data.logo,
                          width: 80,
                          height: 55
                        },
                        { text: `${data.dpto_emp} - ${data.ciudad_emp}`, style: "smallHeader" },
                        { text: `Nit: ${data.id_emp}`, style: "smallHeader" }
                      ]
                    },
                    {
                      alignment: "right",
                      stack: [
                        { text: "\nSOLICITUD DE CREDITO", style: "header", alignment: "right" },
                        { text: `\nFO-GA-06        ${data.fecha_rep}`, }
                      ]
                    }
                  ]
                },
              ],
              [
                {
                  columns: [
                    {
                      width: "25%",
                      table: {
                        widths: "*",
                        body: [
                          [{ text: "No. SOLICITUD", alignment: "center" }],
                          [{ text: data.nro_rep.trim(), alignment: "center" }]

                        ]
                      }
                    },
                    {
                      width: "40%",
                      margin: [30, 0, 0, 0],
                      table: {
                        widths: "*",
                        body: [
                          [{ text: "CIUDAD", alignment: "center" }],
                          [{ text: data.ciudad_rep.trim() + "-" + data.dpto_rep.trim(), alignment: "center" }]
                        ]
                      }
                    },
                    {
                      width: "35%",
                      margin: [20, 0, 0, 0],
                      alignment: "center",
                      table: {
                        widths: "*",
                        body: [
                          [{ text: "FECHA", colSpan: 3 }, "", ""],
                          ["DD", "MM", "AA"],
                          [fechaArray[2], fechaArray[1], fechaArray[0]],
                        ]
                      }
                    },

                  ]
                }
              ],
              [{ text: "1. DATOS DEL SOLICITANTE", style: "header" }],
              [
                {
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: "*",
                    body: [
                      [{ text: "APELLIDOS", alignment: "center" }, { text: "NOMBRES", alignment: "center" }, { text: "CÉDULA CIUDADANÍA", alignment: "center" }],
                      [`${data.apellido1_rep.trim()} ${data.apellido2_rep.trim()}`, data.nombres_rep.trim(), { text: data.rut_rep.replace(/\,/g, " ").trim(), alignment: "center" }]
                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 0 : 1;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },
                  }
                },
              ],
              [
                {
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: ["30%", "20%", "20%", "15%", "15%"],
                    body: [
                      [{ text: "DIRECCION DEL TRABAJO", alignment: "center" }, { text: "BARRIO", alignment: "center" }, { text: "TELEFONO FIJO", alignment: "center" }, { text: "ACTIVO", alignment: "center" }, { text: "PENSIONADO", alignment: "center" }],
                      [data.direcclab_rep.trim(), data.barriolab_rep.trim(), data.telefijo_rep.trim(), data.pensionado_rep !== "1" ? "X" : "", condicional(data.pensionado_rep, "1")],

                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 0 : 1;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },
                  }
                }
              ],
              [
                {
                  columns: [
                    { text: "TIPO DE VIVIENDA", margin: [0, 2, 0, 0], width: "20%" },
                    { text: "PROPIA", margin: [0, 2, 0, 0], width: "15%" },
                    { ...formatCaja(condicional(data.tipovivienda_rep, "1")), width: "3.5%" },
                    { text: "FAMILIAR", margin: [30, 2, 0, 0], width: "25%" },
                    { ...formatCaja(condicional(data.tipovivienda_rep, "2")), width: "3.5%" },
                    { text: "ARRENDADA", margin: [30, 2, 0, 0], width: "25%" },
                    { ...formatCaja(condicional(data.tipovivienda_rep, "3")), width: "3.5%" },
                  ]
                }
              ],
              [
                {
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: ["29.5%", "19.5%", "20%", "31%"],
                    body: [
                      [{ text: "DIRECCION RESIDENCIA", alignment: "center" }, { text: "BARRIO", alignment: "center" }, { text: "CELULAR No.", alignment: "center" }, { text: "CORREO ELECTRONICO", alignment: "center" },],
                      [data.direccres_rep.trim(), data.barriores_rep.trim(), data.telemovil_rep.trim(), data.correo_rep.trim()],

                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 0 : 1;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },
                  }
                }
              ],
              [{ text: "2. INFORMACIÓN DEL CRÉDITO", style: "header" }],
              [
                {
                  border: [true, true, true, false],
                  stack: [
                    {

                      columns: [
                        { text: "MODALIDAD:", margin: [0, 2, 0, 0], width: "15%" },
                        { text: "Consumo", margin: [0, 2, 0, 0], width: "12%" },
                        { ...formatCaja(condicional(data.modalidad_rep, "01")), width: "3.5%" },
                        { text: "LINEA:", margin: [35, 2, 0, 0], width: "18%" },
                        { text: "Cred. Personal", margin: [0, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.lineacred_rep, "01")), width: "3.5%" },
                        { text: "Cred. Libranza", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.lineacred_rep, "02")), width: "3.5%" },
                      ]
                    },
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "CLASIFICACIÓN:", margin: [0, 2, 0, 0], width: "15%" },
                        { text: "Ordinario", margin: [0, 2, 0, 0], width: "12%" },
                        { ...formatCaja(condicional(data.clasifcred_rep, "01")), width: "3.5%" },
                        { text: "Extraordinario", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.clasifcred_rep, "02")), width: "3.5%" },
                        { text: "Convenio", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.clasifcred_rep, "03")), width: "3.5%" },
                      ]
                    },


                    data.clasifcred_rep == "1" ? {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "TIPO ORDINARIO:", margin: [0, 2, 0, 0], width: "15%" },
                        { text: "Ordinario", margin: [0, 2, 0, 0], width: "12%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "1")), width: "3.5%" },
                        { text: "Crédito Sobre Aportes", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "2")), width: "3.5%" },
                        { text: "Compra de Cartera", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "3")), width: "3.5%" },
                        { text: "Educativo", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "4")), width: "3.5%" },
                      ]
                    } : data.clasifcred_rep == "2" ? {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "TIPO EXTRAORDINARIO:", margin: [0, 2, 0, 0], width: "25%" },
                        { text: "Especial", margin: [0, 2, 0, 0], width: "12%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "1")), width: "3.5%" },
                        { text: "Rotativo", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "01")), width: "3.5%" },
                      ]
                    } : data.clasifcred_rep == "3" ? {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "TIPO CONVENIO:", margin: [0, 2, 0, 0], width: "15%" },
                        { text: "Mercadeo", margin: [0, 2, 0, 0], width: "12%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "1")), width: "3.5%" },
                        { text: "Seguros", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "2")), width: "3.5%" },
                        { text: "Electrodomesticos", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "3")), width: "3.5%" },
                        { text: "Turismo", margin: [5, 2, 0, 0], width: "18%" },
                        { ...formatCaja(condicional(data.tipocred_rep, "4")), width: "3.5%" },
                      ]
                    } : {}
                  ]
                }
              ],
              // [
              //   {
              //     border: [true, false, true, false],
              //     columns: [
              //       {
              //         width: "27%",
              //         table: {
              //           widths: ["auto", "45%"],
              //           body: [
              //             ["ORDINARIO", " "],
              //             ["SEGUROS VARIOS", " "]
              //           ]
              //         }
              //       },
              //       {
              //         width: "28%",
              //         table: {
              //           widths: ["auto", "48%"],
              //           body: [
              //             ["EXTRAORDINARIO", " "],
              //             ["MERCADO", " "]
              //           ]
              //         }
              //       },
              //       {
              //         table: {
              //           widths: ["auto", "50%"],
              //           body: [
              //             ["EXTRAOR.\nPRIMA", " "],
              //           ]
              //         }
              //       },
              //       {
              //         table: {
              //           widths: ["auto", "50%"],
              //           body: [
              //             ["ELECT. Y HOG", " "],
              //             ["OTROS", " "]
              //           ]
              //         }
              //       },
              //     ]
              //   }
              // ],
              [
                {
                  border: [true, false, true, true],
                  columns: [
                    {
                      width: "20%",
                      table: {
                        widths: "*",
                        body: [
                          [{ text: "VALOR DEL CREDITO", margin: [0, 6, 0, 6], alignment: "center" }]
                        ]
                      }
                    },
                    {
                      margin: [14, 0, 0, 0],
                      stack: [
                        {
                          columns: [
                            { ...formatCaja(formatNumero(data.valor_rep)), width: "35%" },
                            { ...formatCaja(data.descrcred_rep.trim()), margin: [14, 0, 0, 0] }
                          ]
                        },
                        {
                          margin: [0, 2, 0, 0],
                          columns: [

                            { text: "GARANTIA:", margin: [0, 2, 0, 0], width: "15%" },
                            { text: "Pagaré-Libranza", margin: [0, 2, 0, 0], width: "20%" },
                            { ...formatCaja(condicional(data.garantia_rep, "1")), width: "3.5%" },
                            { text: "Pagaré-Ventanilla", margin: [7, 2, 0, 0], width: "23%" },
                            { ...formatCaja(condicional(data.garantia_rep, "2")), width: "3.5%" },
                            { text: "Fianza", margin: [7, 2, 0, 0], width: "23%" },
                            { ...formatCaja(condicional(data.garantia_rep, "3")), width: "3.5%" },
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              [{ text: "3. FORMA DE PAGO", style: "header" }],
              [
                {
                  columns: [
                    { text: "No. DE CUOTAS", margin: [0, 2, 0, 0], width: "15%" },
                    { ...formatCaja(data.cuotas_rep.trim()), width: "3.5%" },
                    { text: "MENSUAL", margin: [30, 2, 0, 0], width: "20%" },
                    { ...formatCaja(condicional(data.fpago_rep, "1")), width: "3.5%" },
                    { text: "QUINCENAL", margin: [30, 2, 0, 0], width: "20%" },
                    { ...formatCaja(condicional(data.fpago_rep, "2")), width: "3.5%" },
                    { text: "SEMESTRAL", margin: [30, 2, 0, 0], width: "23%" },
                    { ...formatCaja(condicional(data.fpago_rep, "3")), width: "3.5%" },
                  ]
                }
              ],
              [
                {
                  border: [true, true, true, false],
                  columns: [
                    { text: "DESCUENTO POR NOMINA", margin: [0, 2, 0, 0], width: "30%" },
                    { ...formatCaja(condicional(data.tipoamortiza_rep, "1")), width: "3.5%" },
                    { text: "PAGO POR VENTANILLA", margin: [50, 2, 0, 0], width: "35%" },
                    { ...formatCaja(condicional(data.tipoamortiza_rep, "2")), width: "3.5%" },
                  ]
                }
              ],
              [
                {
                  border: [true, false, true, true],
                  columns: [
                    leftColumn.length > 0 ? {
                      alignment: "center",
                      table: {
                        widths: ["20%", "6%", "28%", "20%", "22%"],
                        body: leftColumn
                      }
                    } : "",
                    rightColumn.length > 0 ? {
                      alignment: "center",
                      table: {
                        widths: ["20%", "6%", "28%", "20%", "*"],
                        body: rightColumn
                      }
                    } : ""
                  ]
                }
              ],
              [{ text: "4. INFORMACION FINANCIERA", style: "header" }],
              [
                {
                  border: [true, true, true, false],
                  margin: [-4, 0, -4, 0],
                  table: {
                    widths: "*",
                    body: [
                      [
                        { text: "INGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                        { text: "EGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                        "Activos",
                        `$${formatNumero(data.activostitular_rep)}`
                      ],
                      ["Sueldo/Mesada", `$${formatNumero(data.sueldotitular_rep)}`, "Descuentos Cotrem", `$${formatNumero(data.dctocotremtitular_rep)}`, "Pasivos", `$${formatNumero(data.pasivostitular_rep)}`],
                      ["Otros Ingresos", `$${formatNumero(data.otrostitular_rep)}`, "Otros Descuentos", `$${formatNumero(data.otrosdctostitular_rep)}`, "Casa", { columns: ["SI", subrayado(condicional(data.casapropiatitular_rep, "1")), "NO", subrayado(condicional(data.casapropiatitular_rep, "2"))] }],
                      ["Total Ingresos", `$${formatNumero(parseFloat(data.sueldotitular_rep) + parseFloat(data.otrostitular_rep))}`, "Total Egresos", `$${formatNumero(parseFloat(data.dctocotremtitular_rep) + parseFloat(data.otrosdctostitular_rep))}`, "Vehículo", { columns: ["SI", subrayado(condicional(data.vehiculopropiotitular_rep, "1")), "NO", subrayado(condicional(data.vehiculopropiotitular_rep, "2"))] }]
                    ]
                  },
                  layout: {
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },
                  }
                }
              ],
              [
                {
                  border: [true, false, true, true],
                  margin: [-4, 0, -4, 0],
                  table: {
                    widths: ["25%", "7%", "*", "14%", "*", "8%", "*"],
                    body: [
                      [{ text: "OBLIGACIONES FINANCIERAS", rowSpan: 2, margin: [0, 5, 0, 0] }, "BANCOS", data.bancocredtitular_rep.trim(), "SALDO TOTAL", `$${formatNumero(data.saldotitular_rep)}`, "CUOTA", `$${formatNumero(data.cuotatitular_rep)}`],
                      [
                        "",
                        {
                          columns: [
                            { text: "OBLIGACIONES AL DÍA:", width: "26%" },
                            { text: "SI", width: "auto" },
                            { ...subrayado(condicional("", "1")), width: "3.5%" },
                            { text: "NO", width: "auto" },
                            { ...subrayado(condicional("", "2")), width: "3.5%" }
                          ],
                          colSpan: 6

                        }, "", "", "", "", ""],
                      [{ text: `OBSERVACIONES: ${data.observaciontitular_rep.trim()}`, colSpan: 7 }, "", "", "", "", "", ""]
                    ]
                  },
                  layout: {
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },
                  }

                }
              ],
              [{ text: "5. AUTORIZACION VERIFICACION Y APROBACION DE LA INFORMACION", style: "header" }],
              [
                {
                  stack: [
                    "1) Autorizo a COTREM para que consulte, procese, reporte y divulgue mi información en centrales de riesgo\n2) Autorizo el tratamiento de mis datos personales a la cooperativa según lo estipulado en la Ley 1582 del 2012\n3) Estoy informado de la obligación de actualizar anualmente mis datos o antes cada vez que haga uso de un servicio o producto que ofrezca de la cooperativa.\n4) Certifico que la información aqui suministrada es veridica y autorizo a COTREM para que la verifique.\n 5) Declaro que mis ingresos y bienes provienen del desarrollo de mi actividad económica principal.",
                    {
                      margin: [0, 20, 0, 0],
                      columns: [
                        {
                          width: "50%",
                          stack: [
                            subrayado(data.elaboro_rep),
                            { text: "Preparado por", alignment: "center" },
                          ],
                        },
                      ]
                    }
                  ]
                }
              ],
              [
                {
                  pageBreak: 'before',
                  stack: [
                    {
                      layout: {
                        hLineWidth: function (i, node) {
                          return (i === 0) ? 0 : 1;
                        },

                      },
                      margin: [0, -3, 0, 0],
                      table: {
                        widths: ["30%", "*"],
                        body: [
                          ["NOMBRE CODEUDOR SOLIDARIO:", data.nombrecod1_rep.trim()]
                        ]
                      }
                    },
                    {
                      margin: [0, 3, 0, 0],
                      columns: [
                        {
                          margin: [25, 55, 0, 0],
                          width: "40%",
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
                            { text: "FIRMA", alignment: "center" },
                          ],
                        },
                        {
                          margin: [30, 55, 0, 0],
                          width: "40%",
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
                            { text: "No. Documento de identificación (Lugar de expedición)", alignment: "center" },
                          ],
                        },
                        {
                          width: "*",
                          margin: [20, 0, 0, 0],
                          stack: [
                            {

                              table: {
                                widths: [70],
                                heights: 60,
                                body: [
                                  [" "]
                                ]
                              }
                            },
                            { text: "HUELLA", alignment: "center" }
                          ]
                        }
                      ]
                    },
                    {
                      border: [true, true, true, false],
                      margin: [-4, 0, -4, 0],
                      table: {
                        widths: "*",
                        body: [
                          [
                            { text: "INGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                            { text: "EGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                            "Activos",
                            `$${formatNumero(data.activoscod1_rep)}`
                          ],
                          ["Sueldo/Mesada", `$${formatNumero(data.sueldocod1_rep)}`, "Descuentos Cotrem", `$${formatNumero(data.dctocotremcod1_rep)}`, "Pasivos", `$${formatNumero(data.pasivoscod1_rep)}`],
                          ["Otros Ingresos", `$${formatNumero(data.otrosingrcod1_rep)}`, "Otros Descuentos", `$${formatNumero(data.otrosdctoscod1_rep)}`, "Casa", { columns: ["SI", subrayado(condicional(data.casapropiacod1_rep, "1")), "NO", subrayado(condicional(data.casapropiacod1_rep, "2"))] }],
                          ["Total Ingresos", `$`, "Total Egresos", `$`, "Vehículo", { columns: ["SI", subrayado(condicional(data.vehiculopropiocod1_rep, "1")), "NO", subrayado(condicional(data.vehiculopropiocod1_rep, "2"))] }]
                        ]
                      },
                      layout: {
                        vLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },
                      }
                    },
                    {
                      border: [true, false, true, true],
                      margin: [-4, 0, -4, 0],
                      table: {
                        widths: ["25%", "7%", "*", "14%", "*", "8%", "*"],
                        body: [
                          [{ text: "OBLIGACIONES FINANCIERAS", rowSpan: 2, margin: [0, 5, 0, 0] }, "BANCOS", data.bancocod1_rep.trim(), "SALDO TOTAL", `$${formatNumero(data.saldocod1_rep)}`, "CUOTA", `$${formatNumero(data.cuotacod1_rep)}`],
                          [
                            "",
                            {
                              columns: [
                                { text: "OBLIGACIONES AL DÍA:", width: "26%" },
                                { text: "SI", width: "auto" },
                                { ...subrayado(condicional(data.aldiacod1_rep, "1")), width: "3.5%" },
                                { text: "NO", width: "auto" },
                                { ...subrayado(condicional(data.aldiacod1_rep, "2")), width: "3.5%" }
                              ],
                              colSpan: 6

                            }, "", "", "", "", ""],
                        ]
                      },
                      layout: {
                        vLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },
                        hLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.body.length) ? 0 : 1;
                        },
                      }

                    }
                  ]
                }
              ],
              [
                {
                  stack: [
                    {
                      layout: {
                        hLineWidth: function (i, node) {
                          return (i === 0) ? 0 : 1;
                        },

                      },
                      margin: [0, -3, 0, 0],
                      table: {
                        widths: ["30%", "*"],
                        body: [
                          ["NOMBRE CODEUDOR SOLIDARIO:", data.nombrecod2_rep.trim()]
                        ]
                      }
                    },
                    {
                      margin: [0, 3, 0, 0],
                      columns: [
                        {
                          margin: [25, 55, 0, 0],
                          width: "40%",
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
                            { text: "FIRMA", alignment: "center" },
                          ],
                        },
                        {
                          margin: [30, 55, 0, 0],
                          width: "40%",
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
                            { text: "No. Documento de identificación (Lugar de expedición)", alignment: "center" },
                          ],
                        },
                        {
                          width: "*",
                          margin: [20, 0, 0, 0],
                          stack: [
                            {

                              table: {
                                widths: [70],
                                heights: 60,
                                body: [
                                  [" "]
                                ]
                              }
                            },
                            { text: "HUELLA", alignment: "center" }
                          ]
                        }
                      ]
                    },
                    {
                      border: [true, true, true, false],
                      margin: [-4, 0, -4, 0],
                      table: {
                        widths: "*",
                        body: [
                          [
                            { text: "INGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                            { text: "EGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                            "Activos",
                            `$${formatNumero(data.activoscod2_rep)}`
                          ],
                          ["Sueldo/Mesada", `$${formatNumero(data.sueldocod2_rep)}`, "Descuentos Cotrem", `$${formatNumero(data.dctocotremcod2_rep)}`, "Pasivos", `$${formatNumero(data.pasivoscod2_rep)}`],
                          ["Otros Ingresos", `$${formatNumero(data.otrosingrcod2_rep)}`, "Otros Descuentos", `$${formatNumero(data.otrosdctoscod2_rep)}`, "Casa", { columns: ["SI", subrayado(condicional(data.casapropiacod2_rep, "1")), "NO", subrayado(condicional(data.casapropiacod2_rep, "2"))] }],
                          ["Total Ingresos", `$`, "Total Egresos", `$`, "Vehículo", { columns: ["SI", subrayado(condicional(data.vehiculopropiocod2_rep, "1")), "NO", subrayado(condicional(data.vehiculopropiocod2_rep, "2"))] }]
                        ]
                      },
                      layout: {
                        vLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },
                      }
                    },
                    {
                      border: [true, false, true, true],
                      margin: [-4, 0, -4, 0],
                      table: {
                        widths: ["25%", "7%", "*", "14%", "*", "8%", "*"],
                        body: [
                          [{ text: "OBLIGACIONES FINANCIERAS", rowSpan: 2, margin: [0, 5, 0, 0] }, "BANCOS", data.bancocod2_rep.trim(), "SALDO TOTAL", `$${formatNumero(data.saldocod2_rep)}`, "CUOTA", `$${formatNumero(data.cuotacod2_rep)}`],
                          [
                            "",
                            {
                              columns: [
                                { text: "OBLIGACIONES AL DÍA:", width: "26%" },
                                { text: "SI", width: "auto" },
                                { ...subrayado(condicional(data.aldiacod2_rep, "1")), width: "3.5%" },
                                { text: "NO", width: "auto" },
                                { ...subrayado(condicional(data.aldiacod2_rep, "2")), width: "3.5%" }
                              ],
                              colSpan: 6

                            }, "", "", "", "", ""],
                        ]
                      },
                      layout: {
                        vLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },
                        hLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.body.length) ? 0 : 1;
                        },
                      }

                    }
                  ]
                }
              ],
              [
                {
                  stack: [
                    {
                      layout: {
                        hLineWidth: function (i, node) {
                          return (i === 0) ? 0 : 1;
                        },

                      },
                      margin: [0, -3, 0, 0],
                      table: {
                        widths: ["30%", "*"],
                        body: [
                          ["NOMBRE CODEUDOR SOLIDARIO:", data.nombrecod3_rep.trim()]
                        ]
                      }
                    },
                    {
                      margin: [0, 3, 0, 0],
                      columns: [
                        {
                          margin: [25, 55, 0, 0],
                          width: "40%",
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
                            { text: "FIRMA", alignment: "center" },
                          ],
                        },
                        {
                          margin: [30, 55, 0, 0],
                          width: "40%",
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
                            { text: "No. Documento de identificación (Lugar de expedición)", alignment: "center" },
                          ],
                        },
                        {
                          width: "*",
                          margin: [20, 0, 0, 0],
                          stack: [
                            {

                              table: {
                                widths: [70],
                                heights: 60,
                                body: [
                                  [" "]
                                ]
                              }
                            },
                            { text: "HUELLA", alignment: "center" }
                          ]
                        }
                      ]
                    },
                    {
                      border: [true, true, true, false],
                      margin: [-4, 0, -4, 0],
                      table: {
                        widths: "*",
                        body: [
                          [
                            { text: "INGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                            { text: "EGRESOS MENSUALES", alignment: "center", colSpan: 2 }, "",
                            "Activos",
                            `$${formatNumero(data.activoscod3_rep)}`
                          ],
                          ["Sueldo/Mesada", `$${formatNumero(data.sueldocod3_rep)}`, "Descuentos Cotrem", `$${formatNumero(data.dctocotremcod3_rep)}`, "Pasivos", `$${formatNumero(data.pasivoscod3_rep)}`],
                          ["Otros Ingresos", `$${formatNumero(data.otrosingrcod3_rep)}`, "Otros Descuentos", `$${formatNumero(data.otrosdctoscod3_rep)}`, "Casa", { columns: ["SI", subrayado(condicional(data.casapropiacod3_rep, "1")), "NO", subrayado(condicional(data.casapropiacod3_rep, "2"))] }],
                          ["Total Ingresos", `$`, "Total Egresos", `$`, "Vehículo", { columns: ["SI", subrayado(condicional(data.vehiculopropiocod3_rep, "1")), "NO", subrayado(condicional(data.vehiculopropiocod3_rep, "2"))] }]
                        ]
                      },
                      layout: {
                        vLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },
                      }
                    },
                    {
                      border: [true, false, true, true],
                      margin: [-4, 0, -4, 0],
                      table: {
                        widths: ["25%", "7%", "*", "14%", "*", "8%", "*"],
                        body: [
                          [{ text: "OBLIGACIONES FINANCIERAS", rowSpan: 2, margin: [0, 5, 0, 0] }, "BANCOS", data.bancocod3_rep.trim(), "SALDO TOTAL", `$${formatNumero(data.saldocod3_rep)}`, "CUOTA", `$${formatNumero(data.cuotacod3_rep)}`],
                          [
                            "",
                            {
                              columns: [
                                { text: "OBLIGACIONES AL DÍA:", width: "26%" },
                                { text: "SI", width: "auto" },
                                { ...subrayado(condicional(data.aldiacod3_rep, "1")), width: "3.5%" },
                                { text: "NO", width: "auto" },
                                { ...subrayado(condicional(data.aldiacod3_rep, "2")), width: "3.5%" }
                              ],
                              colSpan: 6

                            }, "", "", "", "", ""],
                        ]
                      },
                      layout: {
                        vLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },
                        hLineWidth: function (i, node) {
                          return (i === 0 || i === node.table.body.length) ? 0 : 1;
                        },
                      }

                    }
                  ]
                }
              ],
              [
                {
                  stack: [
                    { text: "Identificado con documento número\n\n Yo certifico que fui informado (a) de los terminos y condiciones del contrato de crédito en el momento de mostrar mi interes para solicitar este servicio con la cooperativa, la información fue amplia y suficiente por parte de COTREM acerca de: Monto del crédito que puedo solicitar de acuerdo a la modalidades y líneas de crédito que ofrece la cooperativa, la tasa de interés remuneratoria y moratoria expresada en efectiva anual, el sistema de amortización, el plazo de amortización, la modalidad de la cuota, la forma de pago, la periodicidad en el pago de capital y de intereses, el tipo y cobertura de la garantía que solicita Coovemeta, las condiciones para prepagar la obligación o para realizar pagos anticipados, Las comisiones, recargos y demás conceptos que se aplicarán en la estimación de la cuota, mis derechos como deudor, en particular, los que se refieren al acceso a la información sobre la calificación de riesgo de mis obligaciones con COTREM, igualmente la cooperativa puso en mi conocimiento el Reglamento de credito que rige en COTREM, donde se espefica los requisitos y procesos para el otorgamiento, seguimiento y cobranza de los créditos.", alignment: "center" },
                    {
                      margin: [0, 13, 0, 0],
                      text: [{ text: "NOMBRE COMPLETO: ", bold: true }, " "]
                    }
                  ]
                }
              ],
              [
                {
                  pageBreak: "before",
                  layout: {
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 0 : 1;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },
                  },
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: ["80%", "*"],
                    heights: [10, 40, 10],
                    body: [
                      [
                        "NOMBRE DEL SOLICITANTE: ", { text: "HUELLA", alignment: "center", rowSpan: 3 },
                      ],
                      [
                        data.nombres_rep.trim() + " " + data.apellido1_rep.trim() + data.apellido2_rep.trim(), "",

                      ],
                      [
                        `FIRMA Y CÉDULA: ${data.rut_rep.replace(/\,/g, " ").trim()}`,
                        "",
                      ],
                       [
                        {
                          colSpan: 2,
                          stack: [
                            { text: "OBSERVACIONES DEL GESTOR", bold: true, alignment: "center"},
                            data.observgestor
                          ]
                        }
                      ]
                    ]
                  }
                }
              ],
              
            ]
          }
        },
      ]
    };
    pdfMake.createPdf(dd).open();
    res();
  })
};
const estudio = (data) => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    data.creditosrespalda_rep.pop();
    let creditosRespalda = [];

    // Recorre `data.creditosrespalda_rep` de dos en dos
    for (let i = 0; i < data.creditosrespalda_rep.length; i += 2) {
      // Primer elemento del par
      let first = data.creditosrespalda_rep[i];

      // Segundo elemento del par (puede no existir si la cantidad es impar)
      let second = data.creditosrespalda_rep[i + 1] || {};

      // Agrega una nueva fila a `creditosRespalda`
      creditosRespalda.push([
        { text: first.beneficiario_rep?.trim() || "", fontSize: 7.3 },
        { text: parseInt(first.nrocredito_rep) || "", style: "smallright" },
        { text: "", style: "smallright" },
        { text: formatNumero(first.sdocred_rep) || "", style: "smallright" },

        { text: second.beneficiario_rep?.trim() || "", fontSize: 7.3 },
        { text: parseInt(second.nrocredito_rep) || "", style: "smallright" },
        { text: "", style: "smallright" },
        { text: formatNumero(second.sdocred_rep || "") || "", style: "smallright" },
      ]);
    }

    data.creditosunifica_rep.pop();
    let creditosUnifica = data.creditosunifica_rep.map((el) => [{ text: `(${parseInt(el.nrocredito_rep)}) CREDITO EXTRAORDINARIO`, fontSize: 7.3 }, { text: "Recoge saldo", style: "smallright" }, { text: formatNumero(el.sdocred_rep), style: "smallright" }]);

    let totalesDeuda = {
      sdocapital: 0,
      sdointereses: 0,
      sdototal: 0,
      vlrcuota: 0,
      sdomora: 0
    }
    data.deudaactual_rep.pop();
    let deudaActual = data.deudaactual_rep.map((el) => {
      totalesDeuda.sdocapital += parseFloat(el.sdocapital_rep) || 0;
      totalesDeuda.sdointereses += parseFloat(el.sdointeres_rep) || 0;
      totalesDeuda.sdototal += parseFloat(el.sdototal_rep) || 0;
      totalesDeuda.vlrcuota += parseFloat(el.vlrcuota_rep) || 0;
      totalesDeuda.sdomora += parseFloat(el.sdomora_rep) || 0;
      return [
        { text: el.tipocredito_rep, fontSize: 7.3 },
        { text: parseInt(el.nrocredito_rep), style: "smallright" },
        { text: el.porccredito_rep, style: "smallright" },
        { text: formatNumero(el.sdocapital_rep), style: "smallright" },
        { text: formatNumero(el.sdointeres_rep), style: "smallright" },
        { text: formatNumero(el.sdototal_rep), style: "smallright" },
        { text: formatNumero(el.vlrcuota_rep), style: "smallright" },
        { text: el.fechaabono_rep, style: "smallright" },
        { text: formatNumero(el.sdomora_rep), style: "smallright" },
      ]
    });

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
      pageMargins: [margin.left, 120, margin.right, 40],
      styles: {
        title: {
          fontSize: 9,
          bold: true,
          alignment: "center"
        },
        boldcenter: {
          bold: true,
          alignment: "center"
        },
        boldright: {
          bold: true,
          alignment: "right"
        },
        smallright: {
          fontSize: 7.5,
          alignment: "right"
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 25, margin.right, 5],
            columns: [
              {
                fontSize: 8,
                width: "20%",
                stack: [
                  {
                    image: data.logo,
                    width: 90,
                    height: 65
                  },
                  { text: `${data.dpto_emp} - ${data.ciudad_emp}`,alignment: "center" },
                  { text: `Nit: ${data.id_emp}`,alignment: "center"  }
                ]
              },
              {
                alignment: "right",
                stack: [
                  { text: "\nESTUDIO DE CREDITO", fontSize: 13, bold: true, alignment: "right" },
                  { text: `\nFO-GA-14 01-09-2024-01`, }
                ]
              }
            ]
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
          fontSize: 8,
          table: {
            widths: "*",
            body: [
              [{ text: "INFORMACION BÁSICA DEL ASOCIADO", style: "title" }],
              [
                {
                  layout: "noBorders",
                  table: {
                    widths: ["17%", "18%", "18%", "14%", "18%", "15%"],
                    body: [
                      ["ASOCIADO", data.idasociado_rep.trim(), { text: `${data.nombres_rep.trim()} ${data.apellido1_rep.trim()} ${data.apellido2_rep.trim()}`, colSpan: 4 }, "", "", ""],
                      [" ", "", "", "", "LÍMITE DE DESCTOS", { text: formatNumero(data.limitedctos_rep), alignment: "right" }],
                      ["INGRESO ENTIDAD", { text: data.fechaingremp_rep, alignment: "right" }, "SALARIO ACTUAL", { text: formatNumero(data.vlrsalario_rep), alignment: "right" }, "DISPONIBLE DE DESCTO", { text: formatNumero(data.vlrdisponible_rep), alignment: "right" }],
                      ["INGRESO CIA", { text: data.fechaingrafilia_rep, alignment: "right" }, "OTROS DESCUENTOS", { text: formatNumero(data.vlrotrosdctos_rep), alignment: "right" }, "ENDEUDAMIENTO", { text: formatNumero(data.vlrendeuda_rep), alignment: "right" }],
                      ["PROYECTO CONTRATO", { text: data.fechaultnomina_rep, alignment: "right" }, "DESCUENTOS ENTIDAD", { text: formatNumero(data.vlrdctosentidad_rep), alignment: "right" }, "ULT. NOMINA PAGADA", { text: " ", alignment: "right" }],
                    ]
                  }
                }
              ],
              [{ text: "SALDOS A FAVOR DEL ASOCIADO", style: "title" }],
              [
                {
                  layout: "noBorders",
                  table: {
                    widths: ["26%", "12%", "12%", "26%", "12%", "12%"],
                    body: [
                      ["MODALIDAD DE AHORRO/APORTE", "SALDO\nACTUAL", "DESCUENTO ACUMULADO", "MODALIDAD DE AHORRO/APORTE", "SALDO\nACTUAL", "DESCUENTO ACUMULADO"],
                      ["Aportes ordinarios", { text: formatNumero(data.vlrsdoaportes_rep), style: "smallright" }, { text: formatNumero(data.vlrdctoacumaportes_rep), style: "smallright" }, "", "", ""],
                      // [{ text: "Totales a favor", bold: true }, { text: "", style: "boldright" }, { text: "", style: "boldright" }, "", "", ""],
                    ]
                  }
                }
              ],
              [{ text: "CREDITOS QUE RESPALDA EL SOLICITANTE", style: "title" }],
              [
                {
                  layout: "noBorders",
                  table: {
                    widths: ["22%", "10%", "10%", "10%", "22%", "10%", "8%", "8%"],
                    body: [
                      ["BENEFICIARIO DEL CREDITO", "NUMERO\nCREDITO", "VALOR\nINICIAL", "SALDO\nACTUAL", "BENEFICIARIO DEL CREDITO", "NUMERO\nCREDITO", "VALOR\nINICIAL", "SALDO\nACTUAL"],
                      ...creditosRespalda,
                    ]
                  }
                }
              ],
              [{ text: "CREDITOS A UNIFICAR O RECOGER", style: "title" }],
              [
                {
                  layout: "noBorders",
                  table: {
                    widths: ["22%", "10%", "10%"],
                    body: [

                      ...creditosUnifica
                    ]
                  }
                }
              ],
              [{ text: "DEUDA ACTUAL DEL ASOCIADO CON LA ENTIDAD", style: "title" }],
              [
                {
                  margin: [-4, -2, -4, -2],
                  layout: {
                    hLineWidth: function (i, node) {
                      return (i === 1) ? 1 : 0;
                    },
                    vLineWidth: function (i, node) {
                      return 0;
                    },
                  },
                  table: {
                    widths: ["22.5%", "10%", "8%", "10%", "10%", "10%", "10%", "9.5%", "10%"],
                    body: [
                      ["MODALIDAD DE CREDITO", "NUMERO\nCREDITO", "PORCENT.\nPAGADO", "SALDO\nCAPITAL", "SALDO\nINTERESES", "SALDO\nTOTAL", "VALOR DE\nLA CUOTA", "ULTIMO\nABONO", "SALDO\nEN MORA"],
                      ...deudaActual,
                      [
                        { text: "Total Saldos en Contra", style: "boldcenter" },
                        "",
                        "",
                        { text: totalesDeuda.sdocapital, style: "smallright" },
                        { text: totalesDeuda.sdointereses, style: "smallright" },
                        { text: totalesDeuda.sdototal, style: "smallright" },
                        { text: totalesDeuda.vlrcuota, style: "smallright" },
                        "",
                        { text: totalesDeuda.sdomora, style: "smallright" },
                      ],
                    ]
                  }
                }
              ],
              [{ text: "ESTUDIO DEL CREDITO", style: "title" },
              ],
              [
                {
                  margin: [0, 3, 0, 0],
                  fontSize: 7.8,
                  columns: [
                    {
                      width: "36%",
                      columns: [
                        {
                          width: "40%",
                          stack: [
                            "NUMERO SOLICITUD",
                            "FECHA SOLICITUD",
                            "MODALIDAD",
                            "ABONO APORTES",
                            "DESCTO PAPELERIA",
                            "DESCTO PERMAN.",
                            { text: "CUPO DE CREDITO", bold: true }
                          ]
                        },
                        {
                          stack: [
                            data.nro_rep.trim(),
                            data.fecha_rep,
                            { text: data.modalida_rep, fontSize: 7.5 },
                            { text: formatNumero(data.vlrabonoaporte_rep), alignment: "right" },
                            { text: formatNumero(data.vlrdctopapel_rep), alignment: "right" },
                            { text: formatNumero(data.vlrdctoperman_rep), alignment: "right" },
                            { text: formatNumero(data.vlrcupo_rep), style: "boldright" }
                          ]
                        }
                      ]
                    },
                    {
                      width: "30.3%",
                      margin: [5, 0, 0, 0],
                      columns: [
                        {
                          stack: [
                            "VALOR SOLICITADO",
                            "VALOR CUOTA",
                            "GARANTÍA",
                            "INTERES ANTICIP.",
                            "INICIA DESCUENTOS",
                            { text: "VALOR APROBADO", bold: true }
                          ]
                        },
                        {
                          alignment: "right",
                          stack: [
                            formatNumero(data.vlrsolicitado_rep),
                            formatNumero(data.vlrcuota_rep),
                            { text: data.garantia_rep.trim(), fontSize: 7.5, alignment: "left" },
                            formatNumero(data.vlrinterant_rep),
                            data.fechainidcto_rep,
                            subrayado("data.vlraprob_rep"),
                          ]
                        }
                      ]
                    },
                    {
                      width: "33.7%",
                      margin: [5, 0, 0, 0],
                      columns: [
                        {
                          width: "49.8%",
                          stack: [
                            "FORMA DE PAGO",
                            "TASA MENSUAL",
                            "DESTINO",
                            "SEGURO DE CARTERA",
                            "PRESTAMOS A RECOGER",
                            { text: "VALOR A GIRAR", bold: true },
                            { text: "CUOTAS", bold: true },
                          ]
                        },
                        {
                          alignment: "right",
                          stack: [
                            data.fpago_rep,
                            data.tasa_rep.trim(),
                            data.destino_rep.trim() || " ",
                            data.segcartera_rep.trim(),
                            formatNumero(data.vlrtotrecoge_rep),
                            { text: formatNumero(data.vlrgirar_rep), bold: true },
                            "data.cuotas_rep"
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              [
                {
                  margin: [0, 35, 0, 0],
                  stack: [
                    {

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
                            { text: "Comite de Crédito", style: "boldcenter", margin: [0, 2, 0, 0] },
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
                            { text: "Firma Gerencia", style: "boldcenter", margin: [0, 2, 0, 0] },
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
                            { text: "Firma Responsable", style: "boldcenter", margin: [0, 2, 0, 0] },
                          ],
                        },
                      ]
                    },
                    {
                      margin: [0, 13, 0, 0],
                      bold: true,
                      columns: [
                        { text: "Firma solicitante", width: "auto" },
                        {
                          margin: [6, 8, 0, 0],
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
                        { text: "Codeudores", width: "auto" },
                        {
                          margin: [6, 8, 0, 0],
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
                      ]
                    }
                  ]
                }

              ]
            ]
          }
        }
      ]

    }
    pdfMake.createPdf(dd).open();
    res();
  })
};
const aprobacionCred = data => {
  return new Promise(res => {
    console.log(data);
    var margin = {
      left: 20,
      right: 20,
    };

    const subrayado = (string) => {
      return {
        margin: [0, -4.5, 5, 0],
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
      pageMargins: [margin.left, 80, margin.right, 50],
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            fontSize: 11,
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {
                width: "20%",
                margin: [0, 0, 0, 0],
                alignment: "center",
                stack: [
                  {
                    image: data.logo,
                    fit: [70, 70],
                  },
                ],
              },
              {
                alignment: "center",
                stack: [
                  "Cooperativa de Trabajadores Y Pensionados De la Electrificadora del Meta",
                  "Personería Jurídica No. 1652 -Septiembre 27/84",
                  "Nit. 892.099.339-3"
                ]
              }
            ],
          },
        ];
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 10,
          columns: [
            {
              stack: [
                "Oficina Calle 25 No. 15ª 27 Tercer Piso Barrio Olímpico",
                "Tel. (8) 6 65 44 75 Cel. 313 4948150 - 321 4746448",
                "Villavicencio (Meta)",
                "www.cotrem.com"
              ]
            },
            {
              width: "20%",
              margin: [0, 0, 0, 0],
              alignment: "center",
              stack: [
                {
                  image: data.logo,
                  height: 60,
                  width: 130,
                },
              ],
            },

          ]
        }
      },

      content: [
        { text: "PAGARE", style: "boldcenter" },
        {
          margin: [0, 10, 0, 0],
          fontSize: 10.5,
          stack: [
            `LUGAR Y FECHA DE LA FIRMA:`,
            { margin: [0, 2, 0, 0], text: `PAGARE NUMERO: ${data.nro_rep.trim()}` },
            { margin: [0, 2, 0, 0], text: `VALOR: ${formatNumero(data.valor_rep)}` },
            { margin: [0, 2, 0, 0], text: `INTERESES DURANTE EL PLAZO: ${data.intercte_rep.trim()}` },
            { margin: [0, 2, 0, 0], text: `INTERESES DE MORA: ${data.intermora_re}` },
            { margin: [0, 2, 0, 0], text: `PERSONA A QUIEN DEBE HACERSE EL PAGO:` },
            { margin: [0, 2, 0, 0], text: `LUGAR DONDE SE EFECTUARÁ EL PAGO: Villavicencio (Meta)` },
            { margin: [0, 2, 0, 0], text: `FECHA DE VENCIMIENTO DE LA OBLIGACION:` },
            { margin: [0, 4, 0, 0], text: `DEUDORES:` },
            { margin: [0, 2, 0, 0], text: `Nombre e Identificación:` },
            { margin: [0, 2, 0, 0], text: `Nombre e Identificación:` },
            { margin: [0, 2, 0, 0], text: `Nombre e Identificación:` }
          ]
        },
        {
          fontSize: 10.5,
          margin: [0, 10, 0, 0],
          text: [
            { text: "Declaramos: PRIMERA. OBJETO", bold: true },
            " Que en virtud del presente título valor pagare (mos) incondicionalmente, a la orden de la Cooperativa de Trabajadores y Pensionados de la Electrificadora del Meta,",
            { text: " COTREM", bold: true },
            ` o a quien represente sus derechos, en la dirección y dirección indicados, en las fechas de amortización por cuotas señaladas en la cláusula tercera de este pagaré la suma de {data.pagare_rep} más los intereses señalados en la cláusula segunda de este documento.`,

            { text: " SEGUNDA. INTERESES: ", bold: true },
            `Que sobre la suma debida reconoceré (mos) intereses equivalentes al ${data.intercte_rep.trim()} mensual, sobre el capital o sobre su saldo insoluto. En caso de mora reconoceré (mos) a la tasa máxima legal autorizada.`,

            { text: " TERCERA. PLAZO: ", bold: true },
            `Que pagaré (mos) el capital indicado en la cláusula primera y sus intereses mediante cuotas Mensual y sucesivas correspondientes cada una a la cantidad de {data.pagarePlazoLetras_rep} M/CTE. ($data.pagarePlazo_rep), el primer pago lo efectuaré (mos) el día ${data.fecha_rep} y así sucesivamente en ese mismo día de cada mes.`,

            { text: " CUARTA. COBRO JUDICIAL: ", bold: true },
            `En el evento de que el deudor o cualquiera de los codeudores fuere embargado de bienes o fuere sometido a concordato, o declarado en quiebra.  En caso de cobro judicial o extrajudicial será de mi (nuestra) cuenta los costos y gastos de cobranza, desde ahora renuncio (amos) a favor del acreedor al derecho de asignar secuestre o depositario de bienes.  Me (nos) someto (mos) a la jurisdicción del juez o tribunal competente.  Para constancia se firma en la ciudad de Villavicencio hoy {data.fechaCobro_rep}.`,

            { text: " QUINTA. CLÁUSULA ACELERATORIA: ", bold: true },
            "El tenedor podrá declarar vencidos la totalidad de los plazos de esta obligación de los plazos o de las cuotas que constituyan el saldo de lo debido y exigir su pago inmediato ya sea judicial o extrajudicialmente, cuando él (los) deudor (es) entre (n) en mora o incumpla (n) una cualquiera de las obligaciones derivadas del presente documento.",

            { text: " QUINTA. IMPUESTO DE TIMBRE:  ", bold: true },
            "El impuesto de timbre de este documento si se causare será de cargo única y exclusivamente de él (los) deudor (es)."
          ]
        },
        { text: "OTORGANTES:", bold: true, margin: [0, 10, 0, 0] },
        {
          stack: [
            {
              columns: [
                {
                  stack: [
                    { text: "Deudor", margin: [0, 0, 0, 20] },
                    subrayado(data.solicitante_rep.trim()),                    
                    `C.C. No. ${data.rut_rep}`
                  ]
                },
                {
                  stack: [
                    { text: "Codeudor", margin: [0, 0, 0, 20] },
                    subrayado(data.codeudor_rep),
                    `C.C. No. ${data.idcodeudor_rep}`
                  ]
                }
              ]
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                {
                  stack: [
                    { text: "Codeudor", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    `C.C. No.`
                  ]
                },
                {
                  stack: [
                    { text: "Codeudor", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    `C.C. No.`
                  ]
                }
              ]
            }
          ]
        },



        { text: "AUTORIZACION PARA LLENAR ESPACIOS EN BLANCO DEL PAGARE No.", style: "boldcenter", pageBreak: 'before' },
        {
          fontSize: 10.5,
          margin: [0, 10, 0, 0],
          text: [
            `Yo, (nosotros,) ${data.solicitante_rep.trim()}  mayor (es) de edad, identificado(s) con cédula de ciudadanía número(s) {data.idsolicitante_rep} de respectivamente, actuando en mi (nuestro) propio nombre, por medio del presente escrito y de conformidad con el Artículo 622 del Código de Comercio, `,
            { text: " AUTORIZO(AMOS) ", bold: true },
            "de manera irrevocable, sin previo aviso y expresa a",
            { text: " LA COOPERATIVA DE TRABAJADORES DE LA ELECTIFICADORA DEL META, COTREM ", bold: true },
            `y a cualquier endosatario o tenedor legítimo, para que proceda a diligenciar los espacios en blanco del pagaré a la orden número ${data.nro_rep.trim()}, que he(mos) suscrito a su favor, en el evento que no cancele(mos) a`,
            { text: "COTREM ", bold: true },
            "o a el tenedor legítimo el valor total correspondiente al monto a pagar por intereses, gastos judiciales y capital. "
          ]
        },
        {
          fontSize: 10.5,
          margin: [0, 10, 0, 0],
          stack: [
            { text: "Las instrucciones son las siguientes:", margin: [0, 0, 0, 10] },
            "1. El espacio reservado para la cuantía, será el valor adeudado al momento de diligenciar el pagaré, correspondiente al saldo de las obligaciones insolutas, tomado del saldo de la obligación, diligenciado en letras y números, determinando el valor adeudado directa o indirectamente por los suscriptores a COTREM, igual al monto que no haya sido cancelado incluidos los gastos.",
            "2. Los espacios en blanco para el número de cuotas tanto mensuales, como semestrales o anuales, se podrán diligenciar conforme al plan de pagos para la línea de crédito aprobada.",
            "3. Los intereses corrientes se diligenciarán con los pactados.",
            "4. los intereses de mora serán los máximos que las autoridades permitan cobrar a los bancos para las operaciones de cartera ordinaria, de acuerdo con el Artículo 884 del Código de Comercio.",
            "5. El espacio para la fecha de vencimiento corresponderá a la del día en que COTREM haga exigible la obligación.",
            "6. El lugar de pago será en la ciudad de Villavicencio.",
            "7. Modificar la tasa de interés pactada conforme al art. 844 como tope máximo.",
            "8. El pagaré así diligenciado será exigible inmediatamente y prestará merito ejecutivo sin más requisito ni requerimiento.",
            "9. Hago (mos) constar que conozco (emos) entiendo (emos) y autorizo (amos) las instrucciones aquí consignadas.",
            "De igual manera autorizamos a COTREM a Consultar en las centrales de riesgo la información crediticia a mi nombre para conocer la cultura de pago y reportar a las centrales en caso de no pago de la obligación, conforme a la Ley 1116 de 2008.",
            { text: "Por lo anterior y de conformidad con lo dispuesto en el Artículo 622 del Código de Comercio, esta comunicación hace las veces de carta de instrucciones y por lo tanto el pagaré así llenado será exigible inmediatamente.", margin: [0, 10, 0, 0] },
            { text: "La presente autorización tendrá vigencia de diez (10) años contados a partir de la fecha de la firma de la presente carta de instrucciones.", margin: [0, 10, 0, 0] },
            { text: `Para constancia de lo anterior, se suscribe a los ${data.fechaActual_rep}.`, margin: [0, 10, 0, 0] }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          bold: true,
          fontSize: 10,
          stack: [
            {
              columns: [
                {
                  stack: [
                    { text: "DEUDOR", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    `FIRMA`
                  ]
                },
                {
                  stack: [
                    " ",
                    " ",
                    { text: "HUELLA", margin: [0, 20, 0, 0], alignment: "center" }
                  ]
                },
                {
                  stack: [
                    { text: "CODEUDOR", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    `FIRMA`
                  ]
                },
                {
                  stack: [
                    " ",
                    " ",
                    { text: "HUELLA", margin: [0, 20, 0, 0], alignment: "center" }
                  ]
                },
              ]
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                {
                  stack: [
                    { text: "CODEUDOR", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    `FIRMA`
                  ]
                },
                {
                  stack: [
                    " ",
                    " ",
                    { text: "HUELLA", margin: [0, 20, 0, 0], alignment: "center" }
                  ]
                },
                {
                  stack: [
                    { text: "CODEUDOR", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    `FIRMA`
                  ]
                },
                {
                  stack: [
                    " ",
                    " ",
                    { text: "HUELLA", margin: [0, 20, 0, 0], alignment: "center" }
                  ]
                },
              ]
            },
          ]
        },


        { text: `ORDEN DE DESCUENTO DE SALARIOS No ${data.nro_rep.trim()}`, style: "boldcenter", pageBreak: 'before' },
        {
          margin: [0, 10, 0, 0],
          fontSize: 10.5,
          stack: [
            `Fecha , ${data.fechaActual_rep}`,
            { margin: [0, 2, 0, 0], text: `Capital $ {data.capital_rep} Tasa de interés {data.tasaInteres_rep}` },
            { margin: [0, 2, 0, 0], text: `Modalidad {data.modalidad}` },
          ]
        },
        {
          fontSize: 10.5,
          margin: [0, 10, 0, 0],
          stack: [
            { text: ["Con el propósito de Garantizar a", { text: " COTREM ", bold: true }, "la oportuna cancelación del crédito, que bajo la modalidad de libranza me ha otorgado, autorizo."], margin: [0, 0, 0, 10] },
            {
              type: 'lower-alpha',
              separator: ')',
              ol: [
                'Descontar de mi salario devengado relacionadas en el plan de pagos anexo al presente documento.',
                'Descontar por anticipado las cuotas a que haya lugar durante el tiempo que permanezca en vacaciones, permisos o licencias.',
                'En caso de cobro judicial de la deuda me comprometo a pagar los honorarios de abogado y los intereses que se causen hasta la cancelación total de la misma.',
                { text: ["En caso de terminación de contrato de trabajo autorizo que se descuente la totalidad de los créditos pendientes de pago, de los dineros que me adeude", { text: " ELECTRIFICADORA DEL META - PEN.", bold: true }, " por concepto de aportes sociales, cesantías, intereses sobre las cesantías y otros conceptos a que tenga derecho el trabajador.  Si quedare algún saldo pendiente de pago continuare pagando las cuotas de conformidad con los reglamentos que COTREM establezca."] },
                { text: ["Los abajo firmantes como deudores solidarios asumimos toda la responsabilidad contenida en las cláusulas del presente documento, así como de las que establezca la ley en caso de incumplimiento del deudor.", { text: " ELECTRIFICADORA DEL META - PEN.", bold: true }, " deberá tener copia del presente documento y se compromete a:"] }
              ]
            },
            {
              margin: [0, 10, 0, 0],
              ol: [
                'Reconocer Personería Jurídica a COTREM, para los efectos de rigor de conformidad con la Ley.',
                'Hacer efectivas a favor de COTREM, todas las cláusulas del presente documento.',
                'Girar a la Tesorería de COTREM, los recaudos por los diferentes conceptos en este documento estipulados dentro de los (5) cinco días siguientes a la realización del descuento.',

              ]
            }
          ]
        },
        {
          margin: [0, 30, 0, 0],
          fontSize: 10.5,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    { text: "Deudor", margin: [0, 0, 0, 5] },
                    data.solicitante_rep.trim(),
                    { text: `C.C: ${data.rut_rep}`, margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    { text: `Firma`, alignment: "center" }
                  ]
                },
                {
                  stack: [
                    { text: "Deudor Solidario", margin: [0, 0, 0, 5] },
                     data.codeudor_rep,
                    { text: `C.C: ${data.idcodeudor_rep}`, margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    { text: `Firma`, alignment: "center" }
                  ]
                },
              ],
              [
                {
                  stack: [
                    { text: "Deudor Solidario", margin: [0, 0, 0, 5] },
                    { text: "C.C", margin: [0, 0, 0, 20] },
                    " ",
                    subrayado(" "),
                    { text: `Firma`, alignment: "center" }
                  ]
                },
                {
                  stack: [
                    { text: "Vo. Bo. Gerente COTREM", margin: [0, 0, 0, 5] },
                    " ",
                    { text: "C.C", margin: [0, 0, 0, 20] },
                    subrayado(" "),
                    { text: `Firma`, alignment: "center" }
                  ]
                },
              ]
            ]
          }
        },

        { text: "EMISION DE CREDITO No", style: "boldcenter", pageBreak: 'before' },

        {
          margin: [0, 2, 0, 0],
          fontSize: 9,
          table: {
            widths: ["10%", "30%", "30%", "15%", "*"],
            body: [
              [
                { text: "Solicitante:", bold: true },
                { text: data.solicitante_rep.trim(), bold: false },

                { text: "Identificación", bold: true },
                { text: "  ", bold: false },

              ],
            ]
          }
        },
        {
          margin: [0, 2, 0, 0],
          fontSize: 9,
          table: {
            widths: ["20%", "20%", "20%", "20%", "*"],
            body: [
              [
                { text: "CONCEPTOS", bold: true },
                { text: "Valor Crédito", bold: true },
                { text: "Papeleria", bold: true },
                { text: "Iva", bold: true },
                { text: "NETO A GIRAR", bold: true },
              ],
              ["{data.concepto_rep}", formatNumero(data.valor_rep), formatNumero(data.papeleria_rep.trim()), data.ivaestudio_rep.trim(), formatNumero(data.neto_rep)]
              //["1111111", "PAPELERIA Y DATACREDITO", "GASTOS DE PAPELERIA PM", { text: "00", alignment: "right" }, { text: "1,500.00", alignment: "right" }]
            ]
          }
        },

        {
          margin: [0, 10, 0, 0],
          fontSize: 9,
          stack: [
            {
              columns: [
                { text: "CUENTA BANCARIA BENEFICIARIO", bold: true, width: "40%" },
                "48888888888",
                "051",
                "Aho"
              ]
            },
          ]
        },

        {
          fontSize: 9,
          margin: [0, 70, 0, 0],
          columns: [
            {

              margin: [0, 0, 0, 0],
              width: "25%",
              style: "boldcenter",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 120,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                "Preparado"
              ],
            },
            {
              margin: [0, 0, 0, 0],
              width: "25%",
              style: "boldcenter",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 120,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                "Revisado",
              ],
            },
            {
              margin: [0, 0, 0, 0],
              width: "25%",
              style: "boldcenter",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 120,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                "Autorizado",
              ],
            },
            {
              margin: [0, 0, 0, 0],
              width: "25%",
              style: "boldcenter",
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 120,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
                "Firma cédula y Sello de recibido",
              ],
            }
          ]

        },

        { text: "PLAN DE PAGOS CREDITO No", style: "boldcenter", pageBreak: 'before' },
        {
          margin: [0, 2, 0, 0],
          fontSize: 9,
          table: {
            widths: ["10%", "15%", "20%", "20%", "20%", "*"],
            body: [
              [
                { text: "Nro Cuota", bold: true },
                { text: "Fecha Cuota", bold: true },
                { text: "Saldo Capital", bold: true },
                { text: "Pago Capital", bold: true },
                { text: "Pago Intereses", bold: true },
                { text: "Total Cuota", bold: true },
              ],
            ]
          }
        },



      ],

    }


    pdfMake.createPdf(dd).open();
    res();
  })
};


const formato_amortiza = (data) => {
  return new Promise((res) => {
    let cuotas = [];
    let totalpagc = 0;
    let totalpagi = 0;
    let totalcuotas = 0;
    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";


    data.cuotas_rep.forEach(el => {
      cuotas.push([
        { text: el.nrocuota_rep.trim(), alignment: "center" },
        { text: el.fechacuota_rep, alignment: "right" },
        { text: formatNumero(el.sdocapital_rep), alignment: "right" },
        { text: formatNumero(el.pagocapital_rep), alignment: "right" },
        { text: formatNumero(el.pagointer_rep), alignment: "right" },
        // { text: formatNumero(el.saldocuota_rep), alignment: "right" },
        { text: formatNumero(el.segurodeud_rep), alignment: "right" },
        { text: formatNumero(el.totalcuota_rep), alignment: "right" },

      ]);

      totalpagc += parseFloat(el.pagocapital_rep);
      totalpagi += parseFloat(el.pagointer_rep);
      totalcuotas += parseFloat(el.totalcuota_rep);
    })

    var margin = {
      left: 40,
      right: 40,
    };


    var dd = {
      watermark,
      pageMargins: [margin.left, 115, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.right, 0],
            columns: [
              {
                width: "auto",
                image: 'logo',
                fit: [80, 80]
              },
              {
                width: "70%",
                alignment: "center",
                stack: [
                  {
                    text: data.desripEmpresa,
                    style: "header"
                  },
                  {
                    text: `Nit: ${data.idEmpresa}`,
                    style: "header2"
                  },
                  {
                    text: data.direccionEmpresa,
                    style: "header2"
                  },
                  {
                    text: `${data.ciudadEmpresa} ${data.dptoEmpresa}`,
                    style: "header2"
                  },
                ],
              },
            ]
          }
        ]
      },
      footer: function (currentPage, pageCount) {
        return [
          {
            text: "Página " + currentPage.toString() + "de " + pageCount,
            fontSize: 7,
            margin: [margin.left, 0, margin.right, 0],
          }
        ]
      },
      content: [
        {
          text: "FINANCIACION CREDITOS",
          style: "title"
        },
        {
          fontSize: 9.4,
          alignment: "right",
          columns: [
            {
              width: "85%",
              stack: [
                { text: "Número:", bold: true },
                { text: "Fecha:", bold: true },
              ]
            },
            {
              stack: [
                { text: data.consec_rep.trim(), bold: true },
                data.fecha_rep,
              ]
            }
          ]
        },
        {
          fontSize: 9,
          table: {
            widths: "*",
            body: [
              [
                {
                  columns: [
                    {
                      stack: [
                        { text: "Nombre y apellidos:", bold: true },
                        { text: "C.C", bold: true },
                        { text: "Concepto:", bold: true },
                        { text: "Valor Financiado:", bold: true },
                        { text: "Total Cuotas:", bold: true },
                      ]
                    },
                    {
                      width: "40%",
                      stack: [
                        data.nombrecliente_rep.trim() ? { text: data.nombrecliente_rep.trim(), fontSize: 8 } : " ",
                        parseFloat(data.rut_rep),
                        data.descrbase_rep,
                        { text: formatNumero(data.valor_rep), alignment: "center" },
                        data.cuotas_rep.length,
                      ]
                    },
                    {
                      stack: [
                        { text: "", margin: [0, 11, 0, 0] },
                        { text: "Código:", bold: true },
                        { text: "", margin: [0, 11, 0, 0] },
                        { text: "Tasa Mensual:", bold: true },
                        { text: "Amortización:", bold: true },
                      ]
                    },
                    {
                      stack: [
                        { text: "", margin: [0, 11, 0, 0] },
                        parseInt(data.rut_rep),
                        { text: "", margin: [0, 11, 0, 0] },
                        data.tasacte_rep.trim() ? data.tasacte_rep.trim() : " ",
                        "Mensual",
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        },
        {
          margin: [0, 35, 0, 0],
          fontSize: 9,
          layout: "lightHorizontalLines",
          table: {
            widths: ["10%", "12%", "14.4%", "15%", "15%", "14%", "14%",],
            headerRows: 1,
            body: [
              [
                { text: "Cuota", style: "boldcenter" },
                { text: "Fecha Cuota", style: "boldcenter" },
                { text: "Saldo Capital", style: "boldcenter" },
                { text: "Pago Capital", style: "boldcenter" },
                { text: "Pago Intereses", style: "boldcenter" },
                { text: "Seguro", style: "boldcenter" },
                { text: "Total Cuota", style: "boldcenter" },
              ],
              ...cuotas
            ]
          }
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              width: "20%",
              text: ""
            },
            {
              alignment: "right",
              fontSize: 8.5,
              table: {
                widths: "21%",
                body: [
                  [
                    { text: "TOTALES", style: "boldcenter" },
                    { text: formatNumero(totalpagc), bold: true },
                    { text: formatNumero(totalpagi), bold: true },
                    { text: formatNumero(totalcuotas), bold: true },
                  ],
                ]
              }
            }
          ]
        },
        {
          fontSize: 9,
          margin: [0, 70, 0, 0],
          columns: [
            { text: "Elaborado:", width: "auto" },
            {
              margin: [7, 0, 0, 0],
              width: "auto",
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 10,
                  x2: 230,
                  y2: 10,
                  lineWidth: 1,
                },
              ],
              alignment: "center",
            },

          ],
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true
        },
        header2: {
          fontSize: 10.5,
          bold: true
        },
        title: {
          fontSize: 13.5,
          bold: true,
          alignment: "center"
        },
        boldcenter: {
          alignment: "center",
          bold: true
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

export {

  aprobacionCred,
  estudio,
  formato_amortiza,
  solicitudCredito,
};

