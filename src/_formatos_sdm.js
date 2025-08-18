
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;





import { cond, trim } from "lodash";
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

const suspension = (data) => {
  return new Promise((res) => {
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
      pageMargins: [margin.left, 110, margin.right, 20],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 20, margin.right, 0],
          table: {
            widths: ["70%", "*"],
            body: [
              [
                {
                  image: data.logo,
                  width: 310,
                  height: 65,
                  alignment: "center"
                },
                {
                  margin: [0, 12, 0, 0],
                  style: "boldcenter",
                  fontSize: 13,
                  text: `LINEA DE ATENCION AL USUARIO 310 7356292`
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
              width: "20%",
              text: "FECHA DE",
              margin: [0, 5, 0, 0]
            },
            {
              width: "50%",
              stack: [
                {
                  columns: [
                    { text: "SUSPENSION", width: "auto", margin: [0, 0, 3, 0] },
                    { ...formatCaja(data.tipo_rep === "1" ? "X" : " "), width: "10%", margin: [0, 0, 5, 0] },
                    { ...subrayado(data.fecha_rep || " "), width: "50%", margin: [0, 3, 0, 0] }
                  ]
                },
                {
                  margin: [0, 3, 0, 0],
                  columns: [
                    { text: "CORTE", width: "auto", margin: [0, 0, 3, 0] },
                    { ...formatCaja(data.tipo_rep !== "1" ? "X" : " "), width: "10%" },
                  ]
                },
              ]
            },
            {
              columns: [
                { text: "HORA", width: "auto" },
                subrayado(data.hora_rep.trim() || " "),
              ]
            }
          ]
        },
        {
          margin: [0, 30, 0, 0],
          stack: [
            {
              columns: [
                { text: "CÓDIGO", width: "auto" },
                subrayado(data.usuario_rep.trim() || " "),
                { text: "Nº DE MEDIDOR", width: "auto", margin: [6, 0, 0, 0] },
                subrayado(data.medidor_rep.trim() || " "),
              ]
            },
            {

              margin: [0, 7, 0, 0],
              columns: [
                { text: "USUARIO", width: "auto" },
                subrayado(data.nombreusuario_rep.trim() || " "),
                { text: "MOROSIDAD", width: "auto", margin: [6, 0, 0, 0] },
                subrayado(data.morosidad_rep.trim() || " "),
              ]
            },
            {
              margin: [0, 7, 0, 0],
              columns: [
                { text: "DIRECCION", width: "auto" },
                subrayado(data.direccion_rep.trim() || " "),
                { text: "LECTURA", width: "auto", margin: [6, 0, 0, 0] },
                subrayado(data.lectura_rep.trim() || " "),
              ]
            },
            {
              margin: [0, 7, 0, 0],
              columns: [
                { text: "BARRIO", width: "auto" },
                subrayado((data.codbarrio_rep || " ") + " " + data.descripbarrio_rep.trim()),
                { text: "CIUDAD", width: "auto", margin: [6, 0, 0, 0] },
                subrayado(data.ciudad_rep + " " + data.nombreciudad_rep.trim() || " "),
              ]
            }
          ]
        },
        {
          margin: [0, 50, 0, 0],
          columns: [
            { text: "FIRMA FUNCIONARIO", width: "auto" },
            subrayado(" "),
            { text: "FIRMA USUARIO", width: "auto", margin: [6, 0, 0, 0] },
            subrayado(" "),
          ]
        },
        {
          margin: [0, 40, 0, 0],
          table: {
            widths: "*",
            body: [
              ["SEÑOR USUARIO: Por su seguridad no manipular centro de medición sin previa autorización, solo personal autorizado de COINGASCO SAS ESP realizará la reconexión del servicio."]
            ]
          }
        }
      ]
    }

    pdfMake.createPdf(dd).open();
    res();

  });
};

const factura_coingasco = async (data, logo, masiva) => {
  console.log("Generando factura de servicio público...", data);

  let url = " ";
  url = "https://www.coingasco.com/documentos/CCU-COINGASCO-SAS-ESP-ACTUALIZACION-2024.pdf"
  let qr = await QRCode.toDataURL(url);

  return new Promise((res) => {

    const margin = {
      left: 20,
      right: 20,
      top: 15,
      bottom: 20,
    };

    const columns = {
      left: 420,
      right: 130,
    };

    const colors = {
      // green: "#9CCC65",  // COLORES EMPRESA
      // green2: "#d5e8be",
      blue: "#12558a",
      blue2: "#42A5F5",
    };

    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";
    let total_pagar = data.gtotal_rep.trim().replace(/\,/g, "")
    let vlr_ajuste = parseFloat(data.ajuste_rep.trim());
    let descuento = data.descuento_rep.trim().replace(/\,/g, "")
    let tit1_consumo = "";
    let tit2_consumo = "";
    let tit3_consumo = "";
    data.factvencidas_rep = 0;

    if (data.uso_rep == "Comercial" || data.uso_rep == "Oficial") {
      tit1_consumo = "CONSUMO:"
      tit2_consumo = ""
      tit3_consumo = "CONTRIBUCION:"
    } else {
      tit1_consumo = "CONSUMO 7,26 m3:"
      tit2_consumo = "CONSUMO > 7,26 m3:"
      tit3_consumo = "SUBSIDIO:"
    }


    let id_empr = data.nitemp_rep.trim().replace(/\,/g, "");
    let pref_fact = data.prefijo_rep.trim().toUpperCase();
    let nro_fact = data.consecutivo_rep;
    let valorpagar = parseInt(data.gtotal_rep.replace(/\,/g, "")).toString();
    let vence = data.fechaoport_rep.trim().replace(/\-/g, "");


    var data_suscriptor = {
      left: {
        "nombre:": data.nombrecliente_rep.trim(),
        "codigo usuario:": data.codcliente_rep.trim(),
        "direccion:": data.direccliente_rep.trim(),
        "barrio:": data.barrio_rep.trim(),
      },
      right: {
        "estrato:": data.estrato_rep,
        "clase de uso:": data.uso_rep.trim(),
        "municipio:": data.ciudadcliente_rep.trim().substr(0, 15),
        "ruta:": data.rutacliente_rep.trim(),
      },
    };
    var data_componentes = {
      Gm: data.compgm_rep.trim(),
      Tm: data.comptm_rep.trim(),
      Dm: data.compdm_rep.trim(),
      DmNr: data.compdmnr_rep.trim(),
      Fpc: data.compfpc_rep.trim(),
      Cvm: data.compcvm_rep.trim(),
      Ccm: data.compccm_rep.trim(),
      "Cuvr ($/M3)": data.compcuvm_rep.trim(),
      "CuvNr ($/M3)": data.compcuvrn_rep.trim(),

      "Cuf $/factura": data.compcuf_rep.trim(),

      // P: data.compp_rep.trim(),
    };

    var data_detalle = [
    ];

    let cobros_conceptos = 0
    data.basesfactura_rep.pop()
    let vlr_base = data.basesfactura_rep[0].vlrbase_rep;
    let vlr_exceso = data.basesfactura_rep[0].vlrexceso_rep;

    data.basesfactura_rep.forEach((item) => {
      let vlr_cuota = item.valor_rep

      let iva = item.iva_rep ? parseFloat(item.iva_rep) : "0";
      if (iva > 0) {
        item.descripcion_rep = item.descripcion_rep.trim() + " *** ";

      }

      if (item.codigo_rep == '1100') {
        data.fechaoport_rep = "PAGO INMEDIATO"
        data.factvencidas_rep = 1
      }

      if (item.codigo_rep != '1001') {
        cobros_conceptos += parseFloat(vlr_cuota.replace(/\,/g, "")) || 0

        data_detalle.push({
          nrocredito: parseFloat(item.nrocred_rep.trim()),
          concepto: item.descripcion_rep.trim(),
          vlr_inicial: item.vlrini_rep ? item.vlrini_rep.trim() : '',
          abono_capital: item.vlrcap_rep ? item.vlrcap_rep.trim() : '',
          int_financiacion: item.vlrint_rep ? item.vlrint_rep.trim() : '',
          vlr_cuota: item.valor_rep ? item.valor_rep.trim() : '',
          nuevo_saldo: item.vlrsdo_rep ? item.vlrsdo_rep.trim() : '',
          cuota: item.cuota_rep ? item.cuota_rep.trim() : '',
        })
      }
    })


    var data_cobros = [
      {
        concepto: "Cargo fijo",
        saldo: data.cargofijo_rep.trim(),
      },
      {
        concepto: tit1_consumo,
        saldo: "$" + data.basesfactura_rep[0].vlrbase_rep.trim(),
      },
      {
        concepto: tit2_consumo,
        saldo: "$" + data.basesfactura_rep[0].vlrexceso_rep.trim(),
      },
      {
        concepto: tit3_consumo,
        saldo: `$ ${data.subsidio_rep.trim()}`,
      },
      {
        concepto: "SUBTOTAL:",
        saldo: `$ ${data.subtotal_rep.trim()}`,
      },
      {
        concepto: "COBROS OTROS CONCEPTOS:",
        saldo: `$ ${formatNumero(data.otrosconcep_rep.trim())}`,

      },
      {
        concepto: "AJUSTE A CENTENA",
        saldo: `$ ${data.ajuste_rep.trim()}`,
      },
      {
        concepto: "DESCUENTO",
        saldo: `- $ ${data.descuento_rep.trim()}`,
      },

      {
        concepto: "Total a pagar: ",
        saldo: `$ ${formatNumero(parseFloat(total_pagar))}`,
      },
    ];

    var template_cobro = (data = []) => {
      let arr = [];

      data.forEach((el, index) => {
        let bold = index == 4 || index == 6 || index == 7 || index == 8;
        let margin = [];

        if (index == data.length - 2) margin = [0, 0, 0, 6];
        else if (index == data.length - 1) margin = [0, 5, 0, 5];
        else margin = [];

        let obj = [
          {
            text: el.concepto.toUpperCase(),
            colSpan: index == data.length - 1 ? 1 : 2,
            alignment: "left",
            bold,
            margin,
          },
          index == data.length - 1 ? {
            colSpan: 2,
            text: el.saldo,
            alignment: "right",
            bold,
            margin,
          } : {},
          index == data.length - 1 ? {} :
            {
              text: el.saldo,
              alignment: "right",
              bold,
              margin,
            },
        ];

        arr.push(obj);
      });

      return arr;
    };

    var template_detalle = (data = []) => {
      let arr = [];

      data.forEach((el) => {

        let obj = [
          el.concepto.toUpperCase() + "(NF-" + el.nrocredito + ")",
          el.vlr_inicial,
          el.abono_capital,
          el.int_financiacion,
          el.vlr_cuota,
          el.nuevo_saldo,
          el.cuota,
        ];
        arr.push(obj);
      });

      if (arr.length < 7)
        for (let i = 0; i < 7; i++) arr.push([" ", "", "", "", "", "", ""]);

      return arr;
    };

    var template_suscriptor = (info, position = "right") => {
      let stack = [];
      let data = info;
      let names = Object.getOwnPropertyNames(data);
      names.forEach((el) => {
        stack.push({

          columns: [
            {
              text: el.toUpperCase(),
              fontSize: 8,
              width: position == "left" ? "35%" : "50%",
              bold: true,
            },
            {
              text: data[el],
              fontSize: 8,
            },
          ],
        });
      });

      return stack;
    };
    var template_componentes = (data) => {
      let body = [];
      let names = Object.getOwnPropertyNames(data);

      body.push([
        {
          text: "Res. CREG 137/2013",
          alignment: "center",
          bold: true,
          colSpan: 2,
        },
        "",
      ]);

      names.forEach((el) => {
        let value = data[el];
        let arr = [
          { text: el, bold: true },
          { text: value, alignment: "center" },
        ];
        body.push(arr);
      });

      return {
        headerRows: 1,
        widths: ["*", "*"],
        body,
      };
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, margin.top, margin.right, margin.bottom],
      content: [
        {
          columns: [
            {
              width: "75%",
              columns: [
                {
                  width: "25%",
                  margin: [5, -5, 0, 0],
                  stack: [
                    {
                      image: "logo",
                      width: 95,
                      height: 40,
                    },
                    {
                      text: "¡ENERGIA AMBIENTALMENTE AMIGABLE!".toUpperCase(),
                      fontSize: 7,
                      color: colors.blue2,
                    },
                    // {
                    //   margin: [0, 10, 0, 10],
                    //   text: `${data.lineaemergempr_rep.trim()}`,
                    // },


                  ],
                },
                {
                  width: "50%",
                  stack: [
                    {
                      alignment: "center",
                      stack: [
                        // `${data.empresa_rep.trim()}\n\n\n`,
                        {
                          text: data.empresa_rep.trim(),
                          style: "h5",
                        },
                        {
                          text: `NIT: ${data.nitemp_rep.trim()} - ${data.regimenemp_rep.trim()}`,
                          style: "h5",
                        },
                        {
                          text:
                            "ESTE DOCUMENTO PRESTA MERITOS EJECUTIVOS ART. 130 LEY 142/9444",
                          style: "h5",
                          margin: [0, 5, 0, 5],
                        },
                        {
                          text: [
                            `${data.direccempr_rep.trim()} - ${data.ciudemp_rep.trim()}\n`,
                            `${data.correoempr_rep.trim()}\n`,
                            `${data.paginaempr_rep.trim()}\n`,
                          ],
                          style: "h5",
                          color: "#12558a",
                        },
                      ],
                    },
                  ],
                },
                {
                  alignment: "center",
                  bold: true,
                  stack: [
                    {
                      canvas: [
                        {
                          type: "rect",
                          x: 1,
                          y: 40,
                          w: 108,
                          h: 45,
                          r: 0,
                          lineColor: "#fff",
                          color: data.color3,
                          lineWidth: 1,
                        },
                      ],
                    },
                    {
                      margin: [0, -85, 0, 10],
                      stack: [
                        {
                          margin: [0, 5, 0, 10],
                          text: "Linea de emergencia:".toUpperCase(),
                          color: "#C62828",
                        },
                        {
                          margin: [0, 12, 0, 10],
                          color: "#FFF",
                          text: `${data.lineaemergempr_rep.trim()}`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              alignment: "center",
              bold: true,
              stack: [
                // {
                //   canvas: [
                //     {
                //       type: "rect",
                //       x: 8,
                //       y: 40,
                //       w: columns.right,
                //       h: 45,
                //       r: 0,
                //       lineColor: "#FFF",
                //       color: colors.blue2,
                //     },
                //   ],
                // },
                {
                  margin: [25, -140, 0, 10],
                  stack: [
                    {
                      width: 80,
                      margin: [10, 130, 10, 10],
                      image: qr,
                    },

                    {
                      width: 80,
                      margin: [0, -10, 0, -10],
                      image: qr,
                      text: "DESCARGUE AQUI CONTRATO DE CONDICIONES UNIFORMES".toUpperCase(),
                      fontSize: 7,
                    },

                    // {
                    //   margin: [0, 20, 0, 10],
                    //   color: "#FFF",
                    //   text: `${data.lineaemergempr_rep.trim()}`,
                    // },
                  ],
                },
              ],
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              width: "45%",
              stack: [
                {
                  margin: [margin.left + 5, 0, 0, 0],
                  columns: [
                    {
                      width: "80%",
                      alignment: "center",
                      text: "CODIGO USUARIO O REFERENCIA DE PAGO ELECTRONICO:",
                      style: "h4",
                    },
                    {
                      margin: [0, 3, 0, 0],
                      alignment: "center",
                      text: data.codcliente_rep.trim(),
                      bold: true,
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "ellipse",
                      x: margin.left + 115,
                      y: -13,
                      lineColor: "#FFC107",
                      lineWidth: 1,
                      r1: 130,
                      r2: 18,
                    },
                  ],
                },
              ],
            },
            {
              width: "30%",
              margin: [35, 5, 0, 0],
              style: "h4",
              alignment: "center",
              text: ["DOCUMENTO EQUIVALENTE N°: ", data.nrofact_rep.replace(/\s\s+/g, " ")],
            },
            {
              margin: [14, -2, 0, 0],
              stack: [
                {
                  alignment: "center",
                  text: [
                    "TOTAL A PAGAR:\n",
                    `$ ${formatNumero(parseFloat(total_pagar))}`,
                  ],
                  style: "h4",
                },
                {
                  canvas: [
                    {
                      type: "ellipse",
                      x: 60,
                      y: -12,
                      lineColor: "#FFC107",
                      lineWidth: 1,
                      r1: 60,
                      r2: 18,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          stack: [
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: -135,
                  w: columns.left,
                  h: 140,
                  lineColor: "black",
                },
              ],
            },
            {
              canvas: [
                {
                  type: "rect",
                  x: columns.left + 5,
                  y: -140,
                  w: columns.right,
                  h: 140,
                  lineColor: "black",
                },
              ],
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "75%",
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.left,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -15, 0, 0],
                  alignment: "center",
                  text: "Datos del suscriptor".toUpperCase(),
                  style: "h4",
                },
                {
                  fontSize: 10,
                  margin: [10, 12, 0, 0],
                  columns: [
                    {
                      width: "60%",
                      stack: template_suscriptor(data_suscriptor.left, "left"),
                    },
                    {
                      stack: template_suscriptor(data_suscriptor.right),
                    },
                  ],
                },
              ],
            },
            {
              margin: [9, 0, 0, 0],
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -19, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Pago oportuno hasta:".toUpperCase(),
                    },
                    {
                      margin: [0, 5, 0, 0],
                      text: data.fechaoport_rep.trim(),
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 2,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -19, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Fecha de suspensión:".toUpperCase(),
                    },
                    {
                      margin: [0, 5, 0, 0],
                      text: data.fechasusp_rep.trim(),
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 2,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Fecha de emisión:".toUpperCase(),
                    },
                    {
                      margin: [0, 0, 0, 0],
                      // text: data.fechafact_rep.trim().replace(/\s\s+/g, " "),
                      text: data.fechaemis_rep.trim(),
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 6.5,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -19, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Período facturado:".toUpperCase(),
                    },
                    {
                      margin: [0, 0, 0, 0],
                      text: `${data.perini_rep.trim()} al ${data.perfin_rep.trim()}`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          stack: [
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: -85,
                  w: columns.left,
                  h: 85,
                  lineColor: "black",
                },
              ],
            },
            {
              canvas: [
                {
                  type: "rect",
                  x: columns.left + 5,
                  y: -85,
                  w: columns.right,
                  h: 85,
                  lineColor: "black",
                },
              ],
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.right - 19.5,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  text: "Componentes tarifarios".toUpperCase(),
                  style: "h5",
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: -15,
                      w: columns.right - 19.5,
                      h: 20,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  fontSize: 7,
                  margin: [-0.5, -0.5, 0, 0],
                  table: template_componentes(data_componentes),
                },
              ],
            },
            {
              width: "55.75%",
              margin: [5, 0, 0, 0],
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.left - 116,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  text: "Consumo".toUpperCase(),
                  style: "h5",
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: -15,
                      w: columns.left - 116,
                      h: 20,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  fontSize: 7,
                  margin: [-0.5, -0.5, 0, 0],
                  table: {
                    widths: ["*", "auto", "*", "auto"],
                    body: [
                      [
                        {
                          text: "N° MEDIDOR:",
                          bold: true,
                        },
                        {
                          text: data.medidor_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "% SUBSIDIO ESTRATO 1:",
                          bold: true,
                        },
                        {
                          text: `${data.subse1_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "CONSUMO (M3):",
                          bold: true,
                        },
                        {
                          text: data.consumo_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "% SUBSIDIO ESTRATO 2:",
                          bold: true,
                        },
                        {
                          text: `${data.subse2_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "LECTURA ACTUAL:",
                          bold: true,
                        },
                        {
                          text: data.lectact_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "CONTRIBUCION RES EST 5 Y 6:",
                          bold: true,
                        },
                        {
                          text: `${data.contre5_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "LECTURA ANTERIOR:",
                          bold: true,
                        },
                        {
                          text: data.lectant_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "CONTRIBUCION:",
                          bold: true,
                        },
                        {
                          text: `${data.contrcom_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "FACTOR DE CORRECCION:",
                          bold: true,
                        },
                        {
                          text: data.factorcorr_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "TARIFA DE CONSUMO POR RANGOS",
                          bold: true,
                          colSpan: 2,
                          color: colors.blue,
                        },
                        null,
                      ],
                      [
                        {
                          text: "CONSUMO CORREGIDO (M3):",
                          bold: true,
                        },
                        {
                          text: data.consumocorr_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "TARIFA EQ. 0 A 7,26 M3 EST 1:",
                          bold: true,
                        },
                        {
                          text: "$" + data.est1resd_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "CONSUMO M3 EQ. KW/H:",
                          bold: true,
                        },
                        {
                          text: data.consumom3eq_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "TARIFA EQ. 0 A 7,26 M3 EST 2:",
                          bold: true,
                        },
                        {
                          text: "$" + data.est2resd_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "VALOR KW/H:",
                          bold: true,
                        },
                        {
                          text: `$ ${data.valorkw_rep.trim()}`,
                          alignment: "right",
                        },
                        {
                          text: "CONSUMO > 7,26 M3:",
                          bold: true,
                        },
                        {
                          text: `$ ${data.consmayorr_rep.trim()}`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "MOTIVO NO LECTURA:",
                          bold: true,
                        },
                        {
                          text: data.motivo_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text:
                            "TARIFA CONSUMO COMERCIAL - INDUSTRIAL - OFICIAL",
                          bold: true,
                          colSpan: 2,
                          color: colors.blue,
                          fontSize: 5.7,
                        },
                        null,
                      ],
                      [
                        {
                          text: "FECHA ULTIMO PAGO:",
                          bold: true,
                        },
                        {
                          text: data.ultpago_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "Consumo Comercial:",
                          bold: true,
                        },
                        {
                          text: "$" + data.compcuvrn_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "FACTURAS VENCIDAS:",
                          bold: true,
                        },
                        {
                          text: data.factvencidas_rep,
                          alignment: "right",
                        },
                        {
                          text: "",
                          bold: true,
                        },
                        {
                          text: "",
                          alignment: "right",
                        },

                        // {
                        //   text: "> 100 M3:",
                        //   bold: true,
                        // },
                        // {
                        //   text: `$ ${data.consmayorc_rep.trim()}`,
                        //   alignment: "right",
                        // },
                      ],
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                  },
                },
              ],
            },
            {
              margin: [5, 0, 0, 0],
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.right,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  text: "Historico de consumo".toUpperCase(),
                  style: "h5",
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: -15,
                      w: columns.right,
                      h: 20,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.right,
                      h: 145,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  margin: [0, -100, 0, 0],
                  image: data.grafico,
                  width: 130,
                  height: 90
                },
              ],
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "75.80%",
              stack: [
                {
                  fontSize: 6.4,
                  bold: true,
                  alignment: "center",
                  table: {
                    widths: ["30%", "10%", "*", "auto", "*", "*", "*"],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: "Estado creditos vigentes".toUpperCase(),
                          fontSize: 8,
                          colSpan: 2,
                        },
                        null,
                        {
                          text: "DESCRIPCION CUOTA FACTURADA",
                          fontSize: 8,
                          colSpan: 3,
                        },
                        null,
                        null,
                        {
                          text: "NUEVO SALDO CAPITAL",
                          rowSpan: 2,
                          margin: [0, 10, 0, 0],
                        },
                        {
                          text: "CUOTA N°",
                          rowSpan: 2,
                          margin: [0, 13, 0, 0],
                        },
                      ],
                      [
                        { text: "CONCEPTO" },
                        {
                          text: "INICIAL CREDITO",
                        },
                        { text: "ABONO CAPITAL" },
                        { text: "INT. FINANCIACION" },
                        { text: "VR. CUOTA" },
                        null,
                        null,
                      ],
                      ...template_detalle(data_detalle),
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                    paddingTop: function (i, node) {
                      if (i === 0 || i === 1) return 4;
                      else return 1;
                    },
                    paddingBottom: function (i, node) {
                      if (i === 0 || i === 1) return 4;
                      else return 1;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      if (
                        rowIndex === 0 &&
                        (columnIndex === 0 || columnIndex === 2)
                      )
                        return data.color3;
                      else if (rowIndex === 1 || rowIndex === 0)
                        return data.color4;
                      else return "white";
                    },
                    hLineWidth: function (i, node) {
                      if (i === 0 || i === 1 || i === 2) return 1;
                      else if (i === 0 || i === node.table.body.length) return 1;
                      else return 0;
                    },
                    vLineWidth: function (i, node, test) {
                      if (i === 0 || i === node.table.widths.length) return 1;
                      else return 1;
                    },
                  },
                },

              ]
            },
            {
              margin: [5, 0, 0, 0],
              bold: true,
              alignment: "center",
              fontSize: 7,
              table: {
                widths: ["33.33%", "33.33%", "33.33%"],
                body: [
                  [
                    {
                      text: "DESCRIPCION DEL COBRO",
                      fontSize: 7,
                      colSpan: 3,
                    },
                    null,
                    null,
                  ],
                  [
                    {
                      text: "CONCEPTO",
                      fontSize: 7,
                    },
                    { text: "VALOR", fontSize: 7 },
                    { text: "SALDO", fontSize: 7 },
                  ],
                  ...template_cobro(data_cobros),
                ],
              },
              layout: {
                paddingLeft: function (i, node) {
                  return 1;
                },
                paddingRight: function (i, node) {
                  return 1;
                },
                paddingTop: function (i, node) {
                  if (i === 0) return 5;
                  else if (i === 1) return 8;
                  else return 2;
                },
                paddingBottom: function (i, node) {
                  if (i === 0) return 5;
                  else if (i === 1) return 7.5;
                  else return 2;
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  if (rowIndex === 0) return data.color3;
                  else if (rowIndex === 1) return data.color4;
                  else if (
                    rowIndex === node.table.body.length - 1 &&
                    columnIndex === 0
                  )
                    return data.color3;
                  else return "white";
                },
                hLineWidth: function (i, node) {
                  if (i === 0 || i === 1 || i === 2) return 1;
                  else if (i === 0 || i === node.table.body.length) return 1;
                  else return 0;
                },
                vLineWidth: function (i, node, test) {
                  if (i === 0 || i === node.table.widths.length) return 1;
                  else return 0;
                },
              },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: columns.left,
              columns: [
                {
                  width: "60%",
                  alignment: "center",
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text:
                            "NO PAGAR SU FACTURA A TIEMPO DARÁ LUGAR A LA SUSPENSION DEL SERVICIO EN LA FECHA INDICADA.",
                          fontSize: 6,
                          color: "white",
                          bold: true,
                        },
                      ],
                      [
                        {
                          text:
                            "Punto de recaudo autorizado  oficina principal de COINGASCO SAS ESP, " + data.texto_pie,
                          fontSize: 6,
                          bold: true,
                        },
                      ],
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                    paddingTop: function (i, node) {
                      return 3.7;
                    },
                    paddingBottom: function (i, node) {
                      return 3;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex === 0 ? colors.blue2 : data.color4;
                    },
                    vLineWidth: function (i, node, test) {
                      return i === node.table.widths.length ? 0 : 1;
                    },
                  },
                },
                {
                  fontSize: 6.5,
                  table: {
                    widths: ["*", "auto"],
                    body: [
                      [
                        {
                          text: "Para tener en cuenta".toUpperCase(),
                          alignment: "center",
                          fontSize: 8,
                          colSpan: 2,
                          bold: true,
                        },
                        null,
                      ],
                      [
                        {
                          text: "VENCIMIENTO REVISION PERIODICA:",
                        },
                        {
                          text: "00/00/00",
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "VALOR RECONEXION POR SUSPENSION:",
                        },
                        {
                          text: "$" + data.recsuspens_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text:
                            "VALOR DE RECONEXION POR REINSTALACION POR CORTE:",
                        },
                        {
                          text: "$" + data.reccorte_rep.trim(),
                          alignment: "right",
                        },
                      ],
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                    paddingTop: function (i, node) {
                      return 2;
                    },
                    paddingBottom: function (i, node) {
                      return 2;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex === 0 ? data.color3 : "white";
                    },
                  },
                },
              ],
            },
            {
              margin: [5, 0, 0, 0],
              fontSize: 5,
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: "CARGOS APROBADOS CREG.",
                      fontSize: 8,
                      alignment: "center",
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: data.res_creg.replace(/\s\s+/g, " "),
                      fontSize: 10,
                      alignment: "center",
                    },
                  ],
                ],
              },
              layout: {
                paddingLeft: function (i, node) {
                  return 1;
                },
                paddingRight: function (i, node) {
                  return 1;
                },
                paddingTop: function (i, node) {
                  return i == 0 ? 2 : 12;
                },
                paddingBottom: function (i, node) {
                  return i == 0 ? 2 : 11;
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return rowIndex === 0 ? data.color3 : data.color4;
                },
              },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: columns.left,
              columns: [
                {
                  width: "60%",
                  alignment: "center",
                  fontSize: 6,
                  bold: true,
                  text:
                    "¡EL FRAUDE ES CONSIDERADO UN DELITO, ADEMÁS PONE EN RIESGO SU VIDA Y LA DE SU FAMILIA, DENUNCIELO!",
                },

                {
                  width: "20%",
                  stack:
                    [
                      {
                        image: data.superservicios,
                        fit: [80, 100]
                      }
                    ],
                  alignment: "center",
                  fontSize: 7,
                },

                {
                  width: "20%",
                  stack:
                    [
                      {
                        image: data.firma,
                        fit: [40, 70]
                      }
                    ],
                  alignment: "center",
                  fontSize: 6,
                },
              ],
            },
            {
              margin: [5, 0, 0, 0],
              fontSize: 8,
              table: {
                widths: ["*", "auto"],
                body: [
                  [
                    {
                      text: "TOTAL A PAGAR:",
                      bold: true,
                    },
                    {
                      text: `$ ${formatNumero(parseFloat(total_pagar))}`,
                      alignment: "right",
                      fontSize: 7,
                      bold: true,
                    },
                  ]
                ],
              },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 1,
              dash: { length: 3 },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "50%",
              stack:
                [

                  {
                    image: textToBase64Barcode(`415${id_empr.padStart(13, '0')}8020${pref_fact}${nro_fact}3900${valorpagar.padStart(10, '0')}96${vence}`),
                    fit: [250, 230]
                  },
                  {
                    margin: [0, 5, 0, 0],
                    fontSize: 8,
                    table: {
                      widths: ["27%", "auto", "35%", "auto"],
                      body: [
                        [
                          {
                            fontSize: 7.5,
                            text: "PAGO OPORTUNO:",
                            bold: true,
                          },
                          {
                            text: `${data.fechaoport_rep.trim()}`,
                            alignment: "right",
                          },
                          {
                            fontSize: 7.5,
                            text: "FECHA DE SUSPENSION:",
                            bold: true,
                          },
                          {
                            text: data.fechasusp_rep.trim(),
                            alignment: "right",
                          },
                        ]
                      ]
                    }
                  },
                ],
            },
            {
              fontSize: 8,
              table: {
                widths: ["*", "auto", "*", "auto"],
                body: [
                  [
                    { text: "Nombre:", bold: true },
                    { text: data.nombrecliente_rep.trim() },
                    {
                      text: "Factura:",
                      bold: true,
                      color: "white",
                    },
                    {
                      text: data.nrofact_rep.replace(/\s\s+/g, " "),
                      bold: true,
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: "Codigo usuario:",
                      bold: true,
                    },
                    {
                      text: data.codcliente_rep.trim(),
                      alignment: "center",
                    },
                    {
                      text: "Referencia de pago",
                      alignment: "center",
                      bold: true,
                      colSpan: 2,
                    },
                    null,
                  ],
                  [
                    {
                      text: "Dirección:",
                      bold: true,
                    },
                    {
                      text: data.direccliente_rep.trim(),
                      alignment: "center",
                    },
                    {
                      text: data.codcliente_rep.trim(),
                      fontSize: 12,
                      margin: [0, 10, 0, 0],
                      alignment: "center",
                      bold: true,
                      colSpan: 2,
                      rowSpan: 2,
                    },
                    null,
                  ],
                  [
                    {
                      text: "Periodo facturado:",
                      bold: true,
                    },
                    {
                      text: `${data.perini_rep.trim()} AL ${data.perfin_rep.trim()}`,
                      alignment: "center",
                    },
                    null,
                    null,
                  ],
                  [
                    {
                      text: "Total a pagar:".toUpperCase(),
                      bold: true,
                      alignment: "center",
                      colSpan: 2,
                      fontSize: 12,
                    },
                    null,
                    {
                      text: `$ ${formatNumero(parseFloat(total_pagar))}`,
                      bold: true,
                      alignment: "center",
                      colSpan: 2,
                      fontSize: 12,
                    },
                    null,
                  ],
                ],
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  if (rowIndex === 0 && columnIndex == 2) return colors.blue;
                  else if (rowIndex === 0 && columnIndex == 3)
                    return data.color4;
                },
              },
            },
          ],
        },
      ],
      styles: {
        h1: {
          bold: true,
          fontSize: 16,
        },
        h2: {
          bold: true,
          fontSize: 14,
        },
        h3: {
          bold: true,
          fontSize: 12,
        },
        h4: {
          bold: true,
          fontSize: 10,
        },
        h5: {
          bold: true,
          fontSize: 8,
        },
      },
      images: {
        logo,
      },
    };

    if (masiva) {
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBuffer(res);
    } else {
      pdfMake.createPdf(dd).open();
      res();
    }
  });
};
const factura_logigas = async (data, logo, masiva) => {
  console.log("Generando factura de servicio público...", data);
  let url = " ";
  url = "https://logigassaesp.com/"
  let qr = await QRCode.toDataURL(url);

  return new Promise((res) => {

    const margin = {
      left: 20,
      right: 20,
      top: 15,
      bottom: 20,
    };

    const columns = {
      left: 420,
      right: 130,
    };

    const colors = {
      // green: "#9CCC65",  // COLORES EMPRESA
      // green2: "#d5e8be",
      blue: "#12558a",
      blue2: "#42A5F5",
    };

    let watermark =
      data.estado_rep === "1" ?
        {
          text: "Anulado",
          angle: 20,
          color: "black",
          opacity: 0.2,
          fontSize: 100,
        } : " ";
    let total_pagar = data.gtotal_rep.trim().replace(/\,/g, "")
    let vlr_ajuste = parseFloat(data.ajuste_rep.trim());
    let descuento = data.descuento_rep.trim().replace(/\,/g, "")
    let tit1_consumo = "";
    let tit2_consumo = "";
    let tit3_consumo = "";
    data.factvencidas_rep = 0;

    if (data.uso_rep == "Comercial") {
      tit1_consumo = "CONSUMO:"
      tit2_consumo = ""
      tit3_consumo = "CONTRIBUCION:"
    } else {
      tit1_consumo = "CONSUMO 7,26 m3:"
      tit2_consumo = "CONSUMO > 7,26 m3:"
      tit3_consumo = "SUBSIDIO:"
    }


    let id_empr = data.nitemp_rep.trim().replace(/\,/g, "");
    let pref_fact = data.prefijo_rep.trim().toUpperCase();
    let nro_fact = data.consecutivo_rep;
    let valorpagar = parseInt(data.gtotal_rep.replace(/\,/g, "")).toString();
    let vence = data.fechaoport_rep.trim().replace(/\-/g, "");


    var data_suscriptor = {
      left: {
        "nombre:": data.nombrecliente_rep.trim(),
        "codigo usuario:": data.codcliente_rep.trim(),
        "direccion:": data.direccliente_rep.trim(),
        "barrio:": data.barrio_rep.trim(),
      },
      right: {
        "estrato:": data.estrato_rep,
        "clase de uso:": data.uso_rep.trim(),
        "municipio:": data.ciudadcliente_rep.trim().substr(0, 15),
        "ruta:": data.rutacliente_rep.trim(),
      },
    };
    var data_componentes = {
      Gm: data.compgm_rep.trim(),
      Tm: data.comptm_rep.trim(),
      Dm: data.compdm_rep.trim(),
      DmNr: data.compdmnr_rep.trim(),
      Fpc: data.compfpc_rep.trim(),
      Cvm: data.compcvm_rep.trim(),
      Ccm: data.compccm_rep.trim(),
      "Cuvr ($/M3)": data.compcuvm_rep.trim(),
      "CuvNr ($/M3)": data.compcuvrn_rep.trim(),

      "Cuf $/factura": data.compcuf_rep.trim(),

      // P: data.compp_rep.trim(),
    };

    var data_detalle = [
    ];

    let cobros_conceptos = 0
    data.basesfactura_rep.pop()
    let vlr_base = data.basesfactura_rep[0].vlrbase_rep;
    let vlr_exceso = data.basesfactura_rep[0].vlrexceso_rep;

    data.basesfactura_rep.forEach((item) => {
      let vlr_cuota = item.valor_rep
      if (item.codigo_rep == '1100') {
        data.fechaoport_rep = "PAGO INMEDIATO"
        data.factvencidas_rep = 1
      }

      if (item.codigo_rep != '1001') {
        cobros_conceptos += parseFloat(vlr_cuota.replace(/\,/g, "")) || 0

        data_detalle.push({
          nrocredito: parseFloat(item.nrocred_rep.trim()),
          concepto: item.descripcion_rep.trim(),
          vlr_inicial: item.vlrini_rep ? item.vlrini_rep.trim() : '',
          abono_capital: item.vlrcap_rep ? item.vlrcap_rep.trim() : '',
          int_financiacion: item.vlrint_rep ? item.vlrint_rep.trim() : '',
          vlr_cuota: item.valor_rep ? item.valor_rep.trim() : '',
          nuevo_saldo: item.vlrsdo_rep ? item.vlrsdo_rep.trim() : '',
          cuota: item.cuota_rep ? item.cuota_rep.trim() : '',
        })
      }
    })


    var data_cobros = [
      {
        concepto: "Cargo fijo",
        saldo: data.cargofijo_rep.trim(),
      },
      {
        concepto: tit1_consumo,
        saldo: "$" + data.basesfactura_rep[0].vlrbase_rep.trim(),
      },
      {
        concepto: tit2_consumo,
        saldo: "$" + data.basesfactura_rep[0].vlrexceso_rep.trim(),
      },
      {
        concepto: tit3_consumo,
        saldo: `$ ${data.subsidio_rep.trim()}`,
      },
      {
        concepto: "SUBTOTAL:",
        saldo: `$ ${data.subtotal_rep.trim()}`,
      },
      {
        concepto: "COBROS OTROS CONCEPTOS:",
        saldo: `$ ${formatNumero(data.otrosconcep_rep.trim())}`,

      },
      {
        concepto: "AJUSTE A CENTENA",
        saldo: `$ ${data.ajuste_rep.trim()}`,
      },
      {
        concepto: "DESCUENTO",
        saldo: `- $ ${data.descuento_rep.trim()}`,
      },

      {
        concepto: "Total a pagar: ",
        saldo: `$ ${formatNumero(parseFloat(total_pagar))}`,
      },
    ];

    var template_cobro = (data = []) => {
      let arr = [];

      data.forEach((el, index) => {
        let bold = index == 4 || index == 6 || index == 7 || index == 8;
        let margin = [];

        if (index == data.length - 2) margin = [0, 0, 0, 6];
        else if (index == data.length - 1) margin = [0, 5, 0, 5];
        else margin = [];

        let obj = [
          {
            text: el.concepto.toUpperCase(),
            colSpan: index == data.length - 1 ? 1 : 2,
            alignment: "left",
            bold,
            margin,
          },
          index == data.length - 1 ? {
            colSpan: 2,
            text: el.saldo,
            alignment: "right",
            bold,
            margin,
          } : {},
          index == data.length - 1 ? {} :
            {
              text: el.saldo,
              alignment: "right",
              bold,
              margin,
            },
        ];

        arr.push(obj);
      });

      return arr;
    };

    var template_detalle = (data = []) => {
      let arr = [];

      data.forEach((el) => {
        let obj = [
          el.concepto.toUpperCase() + "(NF-" + el.nrocredito + ")",
          el.vlr_inicial,
          el.abono_capital,
          el.int_financiacion,
          el.vlr_cuota,
          el.nuevo_saldo,
          el.cuota,
        ];
        arr.push(obj);
      });

      if (arr.length < 7)
        for (let i = 0; i < 7; i++) arr.push([" ", "", "", "", "", "", ""]);

      return arr;
    };

    var template_suscriptor = (info, position = "right") => {
      let stack = [];
      let data = info;
      let names = Object.getOwnPropertyNames(data);
      names.forEach((el) => {
        stack.push({

          columns: [
            {
              text: el.toUpperCase(),
              fontSize: 8,
              width: position == "left" ? "35%" : "50%",
              bold: true,
            },
            {
              text: data[el],
              fontSize: 8,
            },
          ],
        });
      });

      return stack;
    };
    var template_componentes = (data) => {
      let body = [];
      let names = Object.getOwnPropertyNames(data);

      body.push([
        {
          text: "Res. CREG 137/2013",
          alignment: "center",
          bold: true,
          colSpan: 2,
        },
        "",
      ]);

      names.forEach((el) => {
        let value = data[el];
        let arr = [
          { text: el, bold: true },
          { text: value, alignment: "center" },
        ];
        body.push(arr);
      });

      return {
        headerRows: 1,
        widths: ["*", "*"],
        body,
      };
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, margin.top, margin.right, margin.bottom],
      content: [
        {
          columns: [
            {
              width: "75%",
              columns: [
                {
                  width: "25%",
                  margin: [5, -5, 0, 0],
                  stack: [
                    {
                      image: "logo",
                      width: 95,
                      height: 40,
                    },
                    {
                      text: "¡ENERGIA AMBIENTALMENTE AMIGABLE!".toUpperCase(),
                      fontSize: 7,
                      color: colors.blue2,
                    },
                    // {
                    //   margin: [0, 10, 0, 10],
                    //   text: `${data.lineaemergempr_rep.trim()}`,
                    // },


                  ],
                },
                {
                  width: "50%",
                  stack: [
                    {
                      alignment: "center",
                      stack: [
                        // `${data.empresa_rep.trim()}\n\n\n`,
                        {
                          text: data.empresa_rep.trim(),
                          style: "h5",
                        },
                        {
                          text: `NIT: ${data.nitemp_rep.trim()} - ${data.regimenemp_rep.trim()}`,
                          style: "h5",
                        },
                        {
                          text:
                            "ESTE DOCUMENTO PRESTA MERITOS EJECUTIVOS ART. 130 LEY 142/9444",
                          style: "h5",
                          margin: [0, 5, 0, 5],
                        },
                        {
                          text: [
                            `${data.direccempr_rep.trim()} - ${data.ciudemp_rep.trim()}\n`,
                            `${data.correoempr_rep.trim()}\n`,
                            `${data.paginaempr_rep.trim()}\n`,
                          ],
                          style: "h5",
                          color: "#12558a",
                        },
                      ],
                    },
                  ],
                },
                {
                  alignment: "center",
                  bold: true,
                  stack: [
                    {
                      canvas: [
                        {
                          type: "rect",
                          x: 1,
                          y: 40,
                          w: 108,
                          h: 45,
                          r: 0,
                          lineColor: "#fff",
                          color: data.color3,
                          lineWidth: 1,
                        },
                      ],
                    },
                    {
                      margin: [0, -85, 0, 10],
                      stack: [
                        {
                          margin: [0, 5, 0, 10],
                          text: "Linea de emergencia:".toUpperCase(),
                          color: "#C62828",
                        },
                        {
                          margin: [0, 12, 0, 10],
                          color: "#FFF",
                          text: `${data.lineaemergempr_rep.trim()}`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              alignment: "center",
              bold: true,
              stack: [
                // {
                //   canvas: [
                //     {
                //       type: "rect",
                //       x: 8,
                //       y: 40,
                //       w: columns.right,
                //       h: 45,
                //       r: 0,
                //       lineColor: "#FFF",
                //       color: colors.blue2,
                //     },
                //   ],
                // },
                {
                  margin: [25, -140, 0, 10],
                  stack: [
                    {
                      width: 80,
                      margin: [10, 130, 10, 10],
                      image: qr,
                    },

                    {
                      width: 80,
                      margin: [0, -10, 0, -10],
                      image: qr,
                      text: "",
                      fontSize: 7,
                    },

                    // {
                    //   margin: [0, 20, 0, 10],
                    //   color: "#FFF",
                    //   text: `${data.lineaemergempr_rep.trim()}`,
                    // },
                  ],
                },
              ],
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              width: "45%",
              stack: [
                {
                  margin: [margin.left + 5, 0, 0, 0],
                  columns: [
                    {
                      width: "80%",
                      alignment: "center",
                      text: "CODIGO USUARIO O REFERENCIA DE PAGO ELECTRONICO:",
                      style: "h4",
                    },
                    {
                      margin: [0, 3, 0, 0],
                      alignment: "center",
                      text: data.codcliente_rep.trim(),
                      bold: true,
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "ellipse",
                      x: margin.left + 115,
                      y: -13,
                      lineColor: "#FFC107",
                      lineWidth: 1,
                      r1: 130,
                      r2: 18,
                    },
                  ],
                },
              ],
            },
            {
              width: "30%",
              margin: [35, 5, 0, 0],
              style: "h4",
              alignment: "center",
              text: ["DOCUMENTO EQUIVALENTE N°: ", data.nrofact_rep.replace(/\s\s+/g, " ")],
            },
            {
              margin: [14, -2, 0, 0],
              stack: [
                {
                  alignment: "center",
                  text: [
                    "TOTAL A PAGAR:\n",
                    `$ ${formatNumero(parseFloat(total_pagar))}`,
                  ],
                  style: "h4",
                },
                {
                  canvas: [
                    {
                      type: "ellipse",
                      x: 60,
                      y: -12,
                      lineColor: "#FFC107",
                      lineWidth: 1,
                      r1: 60,
                      r2: 18,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          stack: [
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: -135,
                  w: columns.left,
                  h: 140,
                  lineColor: "black",
                },
              ],
            },
            {
              canvas: [
                {
                  type: "rect",
                  x: columns.left + 5,
                  y: -140,
                  w: columns.right,
                  h: 140,
                  lineColor: "black",
                },
              ],
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "75%",
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.left,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -15, 0, 0],
                  alignment: "center",
                  text: "Datos del suscriptor".toUpperCase(),
                  style: "h4",
                },
                {
                  fontSize: 10,
                  margin: [10, 12, 0, 0],
                  columns: [
                    {
                      width: "60%",
                      stack: template_suscriptor(data_suscriptor.left, "left"),
                    },
                    {
                      stack: template_suscriptor(data_suscriptor.right),
                    },
                  ],
                },
              ],
            },
            {
              margin: [9, 0, 0, 0],
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -19, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Pago oportuno hasta:".toUpperCase(),
                    },
                    {
                      margin: [0, 5, 0, 0],
                      text: data.fechaoport_rep.trim(),
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 2,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -19, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Fecha de suspensión:".toUpperCase(),
                    },
                    {
                      margin: [0, 5, 0, 0],
                      text: data.fechasusp_rep.trim(),
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 2,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Fecha de emisión:".toUpperCase(),
                    },
                    {
                      margin: [0, 0, 0, 0],
                      // text: data.fechafact_rep.trim().replace(/\s\s+/g, " "),
                      text: data.fechaemis_rep.trim(),
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 6.5,
                      w: (columns.right * 60) / 100,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -19, 0, 0],
                  alignment: "center",
                  style: "h5",
                  columns: [
                    {
                      width: "60%",
                      text: "Período facturado:".toUpperCase(),
                    },
                    {
                      margin: [0, 0, 0, 0],
                      text: `${data.perini_rep.trim()} al ${data.perfin_rep.trim()}`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          stack: [
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: -85,
                  w: columns.left,
                  h: 85,
                  lineColor: "black",
                },
              ],
            },
            {
              canvas: [
                {
                  type: "rect",
                  x: columns.left + 5,
                  y: -85,
                  w: columns.right,
                  h: 85,
                  lineColor: "black",
                },
              ],
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "20%",
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.right - 19.5,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  text: "Componentes tarifarios".toUpperCase(),
                  style: "h5",
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: -15,
                      w: columns.right - 19.5,
                      h: 20,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  fontSize: 7,
                  margin: [-0.5, -0.5, 0, 0],
                  table: template_componentes(data_componentes),
                },
              ],
            },
            {
              width: "55.75%",
              margin: [5, 0, 0, 0],
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.left - 116,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  text: "Consumo".toUpperCase(),
                  style: "h5",
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: -15,
                      w: columns.left - 116,
                      h: 20,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  fontSize: 7,
                  margin: [-0.5, -0.5, 0, 0],
                  table: {
                    widths: ["*", "auto", "*", "auto"],
                    body: [
                      [
                        {
                          text: "N° MEDIDOR:",
                          bold: true,
                        },
                        {
                          text: data.medidor_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "% SUBSIDIO ESTRATO 1:",
                          bold: true,
                        },
                        {
                          text: `${data.subse1_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "CONSUMO (M3):",
                          bold: true,
                        },
                        {
                          text: data.consumo_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "% SUBSIDIO ESTRATO 2:",
                          bold: true,
                        },
                        {
                          text: `${data.subse2_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "LECTURA ACTUAL:",
                          bold: true,
                        },
                        {
                          text: data.lectact_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "CONTRIBUCION RES EST 5 Y 6:",
                          bold: true,
                        },
                        {
                          text: `${data.contre5_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "LECTURA ANTERIOR:",
                          bold: true,
                        },
                        {
                          text: data.lectant_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "CONTRIBUCION:",
                          bold: true,
                        },
                        {
                          text: `${data.contrcom_rep.trim()}%`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "FACTOR DE CORRECCION:",
                          bold: true,
                        },
                        {
                          text: data.factorcorr_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "TARIFA DE CONSUMO POR RANGOS",
                          bold: true,
                          colSpan: 2,
                          color: colors.blue,
                        },
                        null,
                      ],
                      [
                        {
                          text: "CONSUMO CORREGIDO (M3):",
                          bold: true,
                        },
                        {
                          text: data.consumocorr_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "TARIFA EQ. 0 A 7,26 M3 EST 1:",
                          bold: true,
                        },
                        {
                          text: "$" + data.est1resd_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "CONSUMO M3 EQ. KW/H:",
                          bold: true,
                        },
                        {
                          text: data.consumom3eq_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "TARIFA EQ. 0 A 7,26 M3 EST 2:",
                          bold: true,
                        },
                        {
                          text: "$" + data.est2resd_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "VALOR KW/H:",
                          bold: true,
                        },
                        {
                          text: `$ ${data.valorkw_rep.trim()}`,
                          alignment: "right",
                        },
                        {
                          text: "CONSUMO > 7,26 M3:",
                          bold: true,
                        },
                        {
                          text: `$ ${data.consmayorr_rep.trim()}`,
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "MOTIVO NO LECTURA:",
                          bold: true,
                        },
                        {
                          text: data.motivo_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text:
                            "TARIFA CONSUMO COMERCIAL - INDUSTRIAL - OFICIAL",
                          bold: true,
                          colSpan: 2,
                          color: colors.blue,
                          fontSize: 5.7,
                        },
                        null,
                      ],
                      [
                        {
                          text: "FECHA ULTIMO PAGO:",
                          bold: true,
                        },
                        {
                          text: data.ultpago_rep.trim(),
                          alignment: "right",
                        },
                        {
                          text: "Consumo Comercial:",
                          bold: true,
                        },
                        {
                          text: "$" + data.compcuvrn_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "FACTURAS VENCIDAS:",
                          bold: true,
                        },
                        {
                          text: data.factvencidas_rep,
                          alignment: "right",
                        },
                        {
                          text: "",
                          bold: true,
                        },
                        {
                          text: "",
                          alignment: "right",
                        },

                        // {
                        //   text: "> 100 M3:",
                        //   bold: true,
                        // },
                        // {
                        //   text: `$ ${data.consmayorc_rep.trim()}`,
                        //   alignment: "right",
                        // },
                      ],
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                  },
                },
              ],
            },
            {
              margin: [5, 0, 0, 0],
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.right,
                      h: 20,
                      color: data.color3,
                    },
                  ],
                },
                {
                  margin: [0, -14, 0, 0],
                  alignment: "center",
                  text: "Historico de consumo".toUpperCase(),
                  style: "h5",
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: -15,
                      w: columns.right,
                      h: 20,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 0,
                      w: columns.right,
                      h: 145,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  margin: [0, -100, 0, 0],
                  image: data.grafico,
                  width: 130,
                  height: 90
                },
              ],
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "75.80%",
              stack: [
                {
                  fontSize: 6.4,
                  bold: true,
                  alignment: "center",
                  table: {
                    widths: ["30%", "10%", "*", "auto", "*", "*", "*"],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: "Estado creditos vigentes".toUpperCase(),
                          fontSize: 8,
                          colSpan: 2,
                        },
                        null,
                        {
                          text: "DESCRIPCION CUOTA FACTURADA",
                          fontSize: 8,
                          colSpan: 3,
                        },
                        null,
                        null,
                        {
                          text: "NUEVO SALDO CAPITAL",
                          rowSpan: 2,
                          margin: [0, 10, 0, 0],
                        },
                        {
                          text: "CUOTA N°",
                          rowSpan: 2,
                          margin: [0, 13, 0, 0],
                        },
                      ],
                      [
                        { text: "CONCEPTO" },
                        {
                          text: "INICIAL CREDITO",
                        },
                        { text: "ABONO CAPITAL" },
                        { text: "INT. FINANCIACION" },
                        { text: "VR. CUOTA" },
                        null,
                        null,
                      ],
                      ...template_detalle(data_detalle),
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                    paddingTop: function (i, node) {
                      if (i === 0 || i === 1) return 4;
                      else return 1;
                    },
                    paddingBottom: function (i, node) {
                      if (i === 0 || i === 1) return 4;
                      else return 1;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      if (
                        rowIndex === 0 &&
                        (columnIndex === 0 || columnIndex === 2)
                      )
                        return data.color3;
                      else if (rowIndex === 1 || rowIndex === 0)
                        return data.color4;
                      else return "white";
                    },
                    hLineWidth: function (i, node) {
                      if (i === 0 || i === 1 || i === 2) return 1;
                      else if (i === 0 || i === node.table.body.length) return 1;
                      else return 0;
                    },
                    vLineWidth: function (i, node, test) {
                      if (i === 0 || i === node.table.widths.length) return 1;
                      else return 1;
                    },
                  },
                },

              ]
            },
            {
              margin: [5, 0, 0, 0],
              bold: true,
              alignment: "center",
              fontSize: 7,
              table: {
                widths: ["33.33%", "33.33%", "33.33%"],
                body: [
                  [
                    {
                      text: "DESCRIPCION DEL COBRO",
                      fontSize: 7,
                      colSpan: 3,
                    },
                    null,
                    null,
                  ],
                  [
                    {
                      text: "CONCEPTO",
                      fontSize: 7,
                    },
                    { text: "VALOR", fontSize: 7 },
                    { text: "SALDO", fontSize: 7 },
                  ],
                  ...template_cobro(data_cobros),
                ],
              },
              layout: {
                paddingLeft: function (i, node) {
                  return 1;
                },
                paddingRight: function (i, node) {
                  return 1;
                },
                paddingTop: function (i, node) {
                  if (i === 0) return 5;
                  else if (i === 1) return 8;
                  else return 2;
                },
                paddingBottom: function (i, node) {
                  if (i === 0) return 5;
                  else if (i === 1) return 7.5;
                  else return 2;
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  if (rowIndex === 0) return data.color3;
                  else if (rowIndex === 1) return data.color4;
                  else if (
                    rowIndex === node.table.body.length - 1 &&
                    columnIndex === 0
                  )
                    return data.color3;
                  else return "white";
                },
                hLineWidth: function (i, node) {
                  if (i === 0 || i === 1 || i === 2) return 1;
                  else if (i === 0 || i === node.table.body.length) return 1;
                  else return 0;
                },
                vLineWidth: function (i, node, test) {
                  if (i === 0 || i === node.table.widths.length) return 1;
                  else return 0;
                },
              },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: columns.left,
              columns: [
                {
                  width: "60%",
                  alignment: "center",
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text:
                            "NO PAGAR SU FACTURA A TIEMPO DARÁ LUGAR A LA SUSPENSIÓN DEL SERVICIO EN LA FECHA INDICADA.",
                          fontSize: 6,
                          color: "white",
                          bold: true,
                        },
                      ],
                      [
                        {
                          text:
                            "Punto de recaudo autorizado  oficina principal de LOGIGAS SA ESP, " + data.texto_pie,
                          fontSize: 6,
                          bold: true,
                        },
                      ],
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                    paddingTop: function (i, node) {
                      return 3.7;
                    },
                    paddingBottom: function (i, node) {
                      return 3;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex === 0 ? colors.blue2 : data.color4;
                    },
                    vLineWidth: function (i, node, test) {
                      return i === node.table.widths.length ? 0 : 1;
                    },
                  },
                },
                {
                  fontSize: 6.5,
                  table: {
                    widths: ["*", "auto"],
                    body: [
                      [
                        {
                          text: "Para tener en cuenta".toUpperCase(),
                          alignment: "center",
                          fontSize: 8,
                          colSpan: 2,
                          bold: true,
                        },
                        null,
                      ],
                      [
                        {
                          text: "VENCIMIENTO REVISION PERIODICA:",
                        },
                        {
                          text: "00/00/00",
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text: "VALOR RECONEXION POR SUSPENSION:",
                        },
                        {
                          text: "$" + data.recsuspens_rep.trim(),
                          alignment: "right",
                        },
                      ],
                      [
                        {
                          text:
                            "VALOR DE RECONEXION POR REINSTALACION POR CORTE:",
                        },
                        {
                          text: "$" + data.reccorte_rep.trim(),
                          alignment: "right",
                        },
                      ],
                    ],
                  },
                  layout: {
                    paddingLeft: function (i, node) {
                      return 1;
                    },
                    paddingRight: function (i, node) {
                      return 1;
                    },
                    paddingTop: function (i, node) {
                      return 2;
                    },
                    paddingBottom: function (i, node) {
                      return 2;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex === 0 ? data.color3 : "white";
                    },
                  },
                },
              ],
            },
            {
              margin: [5, 0, 0, 0],
              fontSize: 5,
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: "CARGOS APROBADOS CREG.",
                      fontSize: 8,
                      alignment: "center",
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: data.res_creg.replace(/\s\s+/g, " "),
                      fontSize: 10,
                      alignment: "center",
                    },
                  ],
                ],
              },
              layout: {
                paddingLeft: function (i, node) {
                  return 1;
                },
                paddingRight: function (i, node) {
                  return 1;
                },
                paddingTop: function (i, node) {
                  return i == 0 ? 2 : 12;
                },
                paddingBottom: function (i, node) {
                  return i == 0 ? 2 : 11;
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return rowIndex === 0 ? data.color3 : data.color4;
                },
              },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: columns.left,
              columns: [
                {
                  width: "60%",
                  alignment: "center",
                  fontSize: 6,
                  bold: true,
                  text:
                    "¡EL FRAUDE ES CONSIDERADO UN DELITO, ADEMÁS PONE EN RIESGO SU VIDA Y LA DE SU FAMILIA, DENUNCIELO!",
                },

                {
                  width: "20%",
                  stack:
                    [
                      {
                        image: data.superservicios,
                        fit: [80, 100]
                      }
                    ],
                  alignment: "center",
                  fontSize: 7,
                },

                {
                  width: "20%",
                  stack:
                    [
                      {
                        image: data.firma,
                        fit: [40, 70]
                      }
                    ],
                  alignment: "center",
                  fontSize: 6,
                },
              ],
            },
            {
              margin: [5, 0, 0, 0],
              fontSize: 8,
              table: {
                widths: ["*", "auto"],
                body: [
                  [
                    {
                      text: "TOTAL A PAGAR:",
                      bold: true,
                    },
                    {
                      text: `$ ${formatNumero(parseFloat(total_pagar))}`,
                      alignment: "right",
                      fontSize: 7,
                      bold: true,
                    },
                  ]
                ],
              },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 1,
              dash: { length: 3 },
            },
          ],
        },
        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              width: "50%",
              stack:
                [

                  {
                    image: textToBase64Barcode(`415${id_empr.padStart(13, '0')}8020${pref_fact}${nro_fact}3900${valorpagar.padStart(10, '0')}96${vence}`),
                    fit: [250, 230]
                  },
                  {
                    margin: [0, 5, 0, 0],
                    fontSize: 8,
                    table: {
                      widths: ["27%", "auto", "35%", "auto"],
                      body: [
                        [
                          {
                            fontSize: 7.5,
                            text: "PAGO OPORTUNO:",
                            bold: true,
                          },
                          {
                            text: `${data.fechaoport_rep.trim()}`,
                            alignment: "right",
                          },
                          {
                            fontSize: 7.5,
                            text: "FECHA DE SUSPENSIÓN:",
                            bold: true,
                          },
                          {
                            text: data.fechasusp_rep.trim(),
                            alignment: "right",
                          },
                        ]
                      ]
                    }
                  },
                ],
            },
            {
              fontSize: 8,
              table: {
                widths: ["*", "auto", "*", "auto"],
                body: [
                  [
                    { text: "Nombre:", bold: true },
                    { text: data.nombrecliente_rep.trim() },
                    {
                      text: "Factura:",
                      bold: true,
                      color: "white",
                    },
                    {
                      text: data.nrofact_rep.replace(/\s\s+/g, " "),
                      bold: true,
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: "Codigo usuario:",
                      bold: true,
                    },
                    {
                      text: data.codcliente_rep.trim(),
                      alignment: "center",
                    },
                    {
                      text: "Referencia de pago",
                      alignment: "center",
                      bold: true,
                      colSpan: 2,
                    },
                    null,
                  ],
                  [
                    {
                      text: "Dirección:",
                      bold: true,
                    },
                    {
                      text: data.direccliente_rep.trim(),
                      alignment: "center",
                    },
                    {
                      text: data.codcliente_rep.trim(),
                      fontSize: 12,
                      margin: [0, 10, 0, 0],
                      alignment: "center",
                      bold: true,
                      colSpan: 2,
                      rowSpan: 2,
                    },
                    null,
                  ],
                  [
                    {
                      text: "Periodo facturado:",
                      bold: true,
                    },
                    {
                      text: `${data.perini_rep.trim()} AL ${data.perfin_rep.trim()}`,
                      alignment: "center",
                    },
                    null,
                    null,
                  ],
                  [
                    {
                      text: "Total a pagar:".toUpperCase(),
                      bold: true,
                      alignment: "center",
                      colSpan: 2,
                      fontSize: 12,
                    },
                    null,
                    {
                      text: `$ ${formatNumero(parseFloat(total_pagar))}`,
                      bold: true,
                      alignment: "center",
                      colSpan: 2,
                      fontSize: 12,
                    },
                    null,
                  ],
                ],
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  if (rowIndex === 0 && columnIndex == 2) return colors.blue;
                  else if (rowIndex === 0 && columnIndex == 3)
                    return data.color4;
                },
              },
            },
          ],
        },
      ],
      styles: {
        h1: {
          bold: true,
          fontSize: 16,
        },
        h2: {
          bold: true,
          fontSize: 14,
        },
        h3: {
          bold: true,
          fontSize: 12,
        },
        h4: {
          bold: true,
          fontSize: 10,
        },
        h5: {
          bold: true,
          fontSize: 8,
        },
      },
      images: {
        logo,
      },
    };

    if (masiva) {
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBuffer(res);
    } else {
      pdfMake.createPdf(dd).open();
      res();
    }
  });
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
        { text: formatNumero(el.totalcuota_rep), alignment: "right" },
        { text: formatNumero(el.saldocuota_rep), alignment: "right" },
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
          text: "FINANCIACIÓN CRÉDITOS",
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
                      stack: [
                        data.nombrecliente_rep.trim() ? data.nombrecliente_rep.trim() : " ",
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
                        data.codcliente_rep,
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
            widths: ["13%", "14%", "14.4%", "15%", "15%", "14%", "14%",],
            headerRows: 1,
            body: [
              [
                { text: "Nro Cuota", style: "boldcenter" },
                { text: "Fecha Cuota", style: "boldcenter" },
                { text: "Saldo Capital", style: "boldcenter" },
                { text: "Pago Capital", style: "boldcenter" },
                { text: "Pago Intereses", style: "boldcenter" },
                { text: "Total Cuota", style: "boldcenter" },
                { text: "Saldo Cuota", style: "boldcenter" },
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
  factura_coingasco,
  factura_logigas,
  formato_amortiza,
  suspension
};

