
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "pdfmake/build/vfs_fonts";
pdfMake.vfs = vfs;

import { cond, trim } from "lodash";
import printJS from "print-js";
import QRCode from 'qrcode'
import IMask from 'imask';


var formatNumero = function (val) {
  var mask = IMask.createMask({
    mask: Number,
    scale: 2,
    thousandsSeparator: ",",
    radix: ".",
    signed: true,
    min: null
  });

  mask.resolve(val.toString());
  return mask.value;
};

const reporte_aux = async (data) => {
  return new Promise((res) => {
    var data_parse = [];
    let vlrCredito = 0;
    let vlrDebito = 0;
    let vlrSaldo = 0;

    data.infoReportes.pop();

    let saldoAnterior = 0;

    // Recorremos el array de datos
    data.infoReportes.forEach((el, i) => {
      if (el.codcta_rep != undefined) {
        const debitoNum = parseFloat(el.debito_rep.replace(/,/g, "")) || 0;
        const creditoNum =
          parseFloat(
            el.credito_rep.replace(/,/g, "").replace(/\s\s+/g, "")
          ) || 0;

        const codigo = el.codcta_rep || "";
        const is2or3or4 =
          codigo.startsWith("2") ||
          codigo.startsWith("3") ||
          codigo.startsWith("4");

        // Cálculo manual de saldo para esta fila
        // let saldoNum;
        // if (el.docabrev_rep == "Saldo Inicial" || i === 0) {
        //   saldoNum = parseFloat(
        //     el.saldo_rep.replace(/,/g, "").replace(/\s+/g, "")
        //   ) || 0;
        // } else {
        //   // Acumulamos sobre el saldo anterior
        //   saldoNum = saldoAnterior +
        //     (is2or3or4
        //       ? creditoNum - debitoNum
        //       : debitoNum - creditoNum);
        // }

        let saldoNum = parseFloat(
          el.saldo_rep.replace(/,/g, "").replace(/\s+/g, "")
        ) || 0;
        saldoAnterior = saldoNum;

        let item = [
          el.codcta_rep.trim() + " - " + el.descripcta_rep.trim(),
          el.fecha_rep.trim(),
          el.descriprut_rep.trim(),
          el.descripcosto_rep.trim(),
          el.docabrev_rep.trim(),
          el.docextr_rep.trim(),
          { text: formatNumero(debitoNum), alignment: "right" },
          { text: formatNumero(creditoNum), alignment: "right" },
          { text: formatNumero(saldoNum), alignment: "right", color: saldoNum < 0 ? "red" : "black" },
          el.detalle_rep.trim(),
        ];
        data_parse.push(item);

        // Acumular totales parciales
        vlrDebito += debitoNum;
        vlrCredito += creditoNum;
        if (el.docabrev_rep === "Saldo Inicial") {
          vlrSaldo += saldoNum;
        }

        // Chequear fin de grupo (cambio de cuenta) o fin de lista
        if (
          i === data.infoReportes.length - 1 ||
          data.infoReportes[i + 1].codcta_rep !== el.codcta_rep
        ) {
          // Generamos la fila de totales para este grupo
          const totalSaldo = (
            (is2or3or4
              ? vlrCredito - vlrDebito
              : vlrDebito - vlrCredito) + vlrSaldo
          ).toFixed(2);
          data_parse.push([
            "\n\n", "", "", "", "",
            { text: "TOTALES", bold: true },
            { text: formatNumero(vlrDebito.toFixed(2)), bold: true, alignment: "right" },
            { text: formatNumero(vlrCredito.toFixed(2)), bold: true, alignment: "right" },
            {
              text: formatNumero(totalSaldo),
              bold: true,
              alignment: "right",
              color: totalSaldo < 0 ? "red" : "black"
            },
            ""
          ]);
          vlrDebito = 0;
          vlrCredito = 0;
          vlrSaldo = 0;
          saldoAnterior = 0;
        }
      }
    });
    //if (data.ordrut) data_parse.pop();

    data_parse.unshift([
      { text: "Cuenta", style: "header_table" },
      { text: "Fecha", style: "header_table" },
      { text: "Descripcion", style: "header_table" },
      { text: "Centro Costo", style: "header_table" },
      { text: "Doc. interno", style: "header_table" },
      { text: "Doc. Externo", style: "header_table" },
      { text: "Vlr débito", style: "header_table" },
      { text: "Vlr crédito", style: "header_table" },
      { text: "Saldo", style: "header_table" },
      { text: "Detalle", style: "header_table" },
    ]);

    // Obtener los índices de las filas de totales
    const totalIndices = data_parse.reduce((indices, row, index) => {
      if (row[5] && row[5].text === "TOTALES") {
        indices.push(index);
        indices.push(index + 1);
      }
      return indices;
    }, []);

    var dd = {
      styles: {
        header_table: {
          bold: true,
        },
      },
      pageOrientation: "landscape",
      pageMargins: [60, 110, 40, 40],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [60, 20, 40, 20],
            columns: [
              {
                width: "70%",
                stack: [
                  {
                    text: "Reporte auxiliares",
                    bold: true,
                    fontSize: 14,
                  },
                  {
                    stack: [
                      {
                        text: [
                          { text: "Fecha inicial: ", bold: true },
                          data.fecha_inicial,
                          { text: " - Fecha final: ", bold: true },
                          data.fecha_final,
                        ],
                      },
                      {
                        text: [
                          { text: "Cuenta a procesar: ", bold: true },
                          data.cuenta_contable,
                        ],
                      },
                      {
                        text: [{ text: "Rut procesado: ", bold: true }, data.rut_procesado],
                      },
                    ],
                  },
                ],
              },
              {
                width: "30%",
                stack: [
                  {
                    image: data.logo,
                    fit: [150, 150],
                    alignment: "right",
                  },
                ],
              },
            ],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: pageSize.width - 100,
                y2: 0,
                lineWidth: 0.5,
              },
            ],
            margin: [60, 0, 40, 0],
          },
        ];
      },
      footer: function (currentPage, pageCount) {
        return [
          {
            fontSize: 10,
            margin: [60, 0, 40, 0],
            columns: [
              {
                text: "Impreso por: " + sessionStorage.User,
                alignment: "left",
                width: "33%",
              },
              {
                text: currentPage.toString() + " de " + pageCount,
                alignment: "center",
                width: "33%",
              },
              {
                text: new Date().toJSON(),
                alignment: "right",
                width: "33%",
              },
            ],
          },
        ];
      },
      content: [
        {
          fontSize: 8,
          layout: {
            hLineWidth: function (i, node) {
              // Dibujar líneas para las filas de totales
              return totalIndices.includes(i) || i == 1 ? 1 : 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
          },
          table: {
            widths: "auto",
            headerRows: 1,
            body: data_parse,
          },
        },
      ],
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};
const ndebito_titan = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

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

    data.productos.forEach((p, i) => {
      descripcion64 = window.atob(
        p.base1_pr.trim() +
        p.base2_pr.trim() +
        p.base3_pr.trim() +
        p.base4_pr.trim() +
        p.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = p.nombre_servicio;
      }
      p.nombre_servicio = descripcion + "  " + p.detprod.trim();

      productos.push([
        i + 1,
        p.codigo,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.infoprod, alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
        { text: p.vlr_iva, alignment: "right" },
        { text: p.porcimpto, alignment: "right" },
        { text: p.vlr_dcto, alignment: "right" },
        { text: p.tot_producto.trim(), alignment: "right" },
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
                { text: `NIT: ${data.nit_empresa.trim()} - Responsable de IVA - Obligación: No responsable`, margin: [0, 2, 0, 0] },
                { text: `Resolución  Facturación Dian   ${data.nrores_dian.trim()}`, fontSize: 7, },
                { text: `${data.rango_dian}` },
                `REPRESENTACION GRAFICA NOTA DEBITO`,
                `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia Teléfono - ${data.telefono_empresa}`,
                `E-mail: ${data.email_empresa}`,
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: `NOTA DEBITO No: ${data.numero_fact}`, style: "boldred", fontSize: 12, margin: [0, 5, 0, 0] },
                // { text: "NOTA CREDITO No", fontSize: 12 },
                // { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
                { text: `Factura: ${data.nrofact_fact}`, style: "boldred" },

                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },
                { text: `Fecha Validación DIAN: ${data.fechadian_factura}`, fontSize: 8, margin: [0, 5, 0, 0] },
                { text: `Causal: ${data.causal.trim()}`, fontSize: 8, margin: [0, 5, 0, 0] },
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

          fillColor: "#f0f9eb",
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
                        { text: `Pais: ${data.pais_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        { text: `Email: ${data.email_cliente}`, margin: [0, 2, 0, 0] },
                      ]
                    },
                    {},

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
            widths: ["3%", "8%", "20%", "*", "*", "*", "*", "8%", "10%", "*"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Código", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Info.Prod", style: "boldcenter" },
                { text: "Val. Unit", style: "boldcenter" },
                { text: "IVA/IC", style: "boldcenter" },
                { text: "% Iva/Ic", style: "boldcenter" },
                { text: "Dcto", style: "boldcenter" },
                { text: "Val. Item", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fillColor: "#f0f9eb",
          fontSize: 7,
          table: {
            widths: ["*", "30%"],
            body: [
              [
                { text: "Impuestos", style: "boldcenter" },
                // { text: "", style: "boldcenter" },
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
                // {

                //   table: {
                //     widths: [ "*", "30%", "*"],
                //     body: [
                //       [
                //         { text: "Base", style: "boldcenter" },
                //         { text: "%", style: "boldcenter" },
                //         { text: "Valor", style: "boldcenter" },
                //       ],
                //       ...retenciones
                //     ]
                //   }
                // },
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
                        "Subtotal:",
                        { text: totales.subtotal.trim(), alignment: "right" },
                      ],
                      [
                        "Descuentos:",
                        { text: totales.descuentos.trim(), alignment: "right" },
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
                        "Total Factura: ",
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
      pdfMake.createPdf(dd).open();
      res();
    }
  })
};
const ncredito_titan = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

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

    data.productos.forEach((p, i) => {
      descripcion64 = window.atob(
        p.base1_pr.trim() +
        p.base2_pr.trim() +
        p.base3_pr.trim() +
        p.base4_pr.trim() +
        p.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = p.nombre_servicio;
      }
      p.nombre_servicio = descripcion + "  " + p.detprod.trim();

      productos.push([
        i + 1,
        p.codigo,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.infoprod, alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
        { text: p.vlr_iva, alignment: "right" },
        { text: p.porcimpto, alignment: "right" },
        { text: p.vlr_dcto, alignment: "right" },
        { text: p.tot_producto.trim(), alignment: "right" },
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
                { text: `NIT: ${data.nit_empresa.trim()} - Responsable de IVA - Obligación: No responsable`, margin: [0, 2, 0, 0] },
                { text: `Resolución  Facturación Dian   ${data.nrores_dian.trim()}`, fontSize: 7, },
                { text: `${data.rango_dian}` },
                `REPRESENTACION GRAFICA NOTA CREDITO`,
                `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia Teléfono - ${data.telefono_empresa}`,
                `E-mail: ${data.email_empresa}`,
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: `NOTA CREDITO No: ${data.numero_fact}`, style: "boldred", fontSize: 12, margin: [0, 5, 0, 0] },
                // { text: "NOTA CREDITO No", fontSize: 12 },
                // { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
                { text: `Factura: ${data.nrofact_fact}`, style: "boldred" },

                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },
                { text: `Fecha Validación DIAN: ${data.fechadian_factura}`, fontSize: 8, margin: [0, 5, 0, 0] },
                { text: `Causal: ${data.causal.trim()}`, fontSize: 8, margin: [0, 5, 0, 0] },
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

          fillColor: "#f0f9eb",
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
                        { text: `Pais: ${data.pais_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        { text: `Email: ${data.email_cliente}`, margin: [0, 2, 0, 0] },
                      ]
                    },
                    {},

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
            widths: ["3%", "8%", "20%", "*", "*", "*", "*", "8%", "10%", "*"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Código", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Info.Prod", style: "boldcenter" },
                { text: "Val. Unit", style: "boldcenter" },
                { text: "IVA/IC", style: "boldcenter" },
                { text: "% Iva/Ic", style: "boldcenter" },
                { text: "Dcto", style: "boldcenter" },
                { text: "Val. Item", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fillColor: "#f0f9eb",
          fontSize: 7,
          table: {
            widths: ["*", "30%"],
            body: [
              [
                { text: "Impuestos", style: "boldcenter" },
                // { text: "", style: "boldcenter" },
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
                // {

                //   table: {
                //     widths: [ "*", "30%", "*"],
                //     body: [
                //       [
                //         { text: "Base", style: "boldcenter" },
                //         { text: "%", style: "boldcenter" },
                //         { text: "Valor", style: "boldcenter" },
                //       ],
                //       ...retenciones
                //     ]
                //   }
                // },
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
                        "Subtotal:",
                        { text: totales.subtotal.trim(), alignment: "right" },
                      ],
                      [
                        "Descuentos:",
                        { text: totales.descuentos.trim(), alignment: "right" },
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
                        "Total Factura: ",
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
      pdfMake.createPdf(dd).open();
      res();
    }
  })
};
const contrato_titan = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };
    let watermark =
      data.estado_fact === "0"
        ? ""
        : {
          text: "Anulado",
          angle: 60,
          color: "black",
          opacity: 0.2,
          fontSize: 90,
        };

    let totales = data.totales[0]
    let productos = [];
    let cuotas = [];
    let impuestos = [];
    let retenciones = [];
    let observaciones = window.atob(data.Observaciones64.trim())


    let descripcion = "";
    let descripcion64 = "";

    data.productos.forEach((p, i) => {
      descripcion64 = window.atob(
        p.base1_pr.trim() +
        p.base2_pr.trim() +
        p.base3_pr.trim() +
        p.base4_pr.trim() +
        p.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = p.nombre_servicio;
      }
      p.nombre_servicio = descripcion + "  " + p.detprod.trim();

      productos.push([
        i + 1,
        // p.codigo,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.umedida.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.infoprod, alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
        { text: p.vlr_dcto, alignment: "right" },
        { text: p.vlr_unitiva, alignment: "right" },
        { text: p.vlr_unitimp, alignment: "right" },
        { text: p.tot_producto.trim(), alignment: "right" },
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

    data.plazos.pop()

    data.plazos.forEach(p => {
      cuotas.push([
        { text: p.cuota },
        { text: p.valor_plazo.trim(), alignment: "center" },
        { text: p.fecha_plazo, alignment: "center" },
      ])
    })

    var dd = {
      watermark,
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
                { text: `${data.direccion_empresa} - ${data.ciudad_empresa.trim()} - Colombia` },
                { text: `Teléfono: ${data.telefono_empresa}` },
                { text: `Correo: ${data.email_empresa}` },
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
                { text: data.tipofacturador_fact == 1 ? `REPRESENTACION GRAFICA DE FACTURA ELECTRONICA` : "", margin: [0, 2, 0, 0] },
                { text: data.tipofacturador_fact == 1 ? `Resolución  Facturación Dian   ${data.nrores_dian.trim()}` : " ", fontSize: 7, },
                { text: data.tipofacturador_fact == 1 ? `${data.rango_dian} ${data.vigencia_dian}` : "" },

              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: data.tipofacturador_fact == 1 ? `${data.titulo_fact}` + " No" : "CONTRATO:", fontSize: 12 },
                { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },
                { text: data.tipofacturador_fact == 1 ? `Fecha Validación DIAN: ${data.fechadian_factura}` : "", fontSize: 8, margin: [0, 5, 0, 0] },
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

          fillColor: "#DFF6E9",
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
                        { text: `CC O NIT:: ${data.nit_cliente.trim()} - ${data.dv_cliente}  `, margin: [0, 2, 0, 0] },
                        { text: `Cliente: ${data.nombre_cliente.trim()}`, margin: [0, 2, 0, 0] },
                        // "",
                        // "",
                        { text: `Dirección: ${data.direccion_cliente}`, margin: [0, 12, 0, 0] },
                        { text: `Ciudad: ${data.ciudad_cliente}`, margin: [0, 2, 0, 0] },
                        { text: `Pais: ${data.pais_cliente.trim()}`, margin: [0, 2, 0, 0] },
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
                        { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
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
            widths: ["3%", "20%", "7%", "8%", "6%", "*", "10%", "*", "10%", "*"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "U.Medida", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Inf.Prod", style: "boldcenter" },
                { text: "Unitario", style: "boldcenter" },
                { text: "Dcto", style: "boldcenter" },
                { text: "Unit.Iva", style: "boldcenter" },
                { text: "Unit.Impoc", style: "boldcenter" },
                { text: "Total Producto", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fillColor: "#DFF6E9",
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
                    widths: ["55%", "*"],
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
                        "Subtotal:",
                        { text: totales.subtotal.trim(), alignment: "right" },
                      ],
                      [
                        "Descuentos:",
                        { text: totales.descuentos.trim(), alignment: "right" },
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
                        "Total Factura: ",
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
        {},
        {},
        data.plazos.length > 0 ? {
          stack: [
            { text: "DETALLE PLAZOS", style: "boldcenter" },
            {
              margin: [130, 10, 0, 0],
              fontSize: 7,
              table: {
                headerRows: 1,
                widths: ["20%", "20%", "20%"],
                body: [
                  [
                    { text: "Cuota", style: "boldcenter" },
                    { text: "Valor", style: "boldcenter" },
                    { text: "Vencimiento", style: "boldcenter" },
                  ],
                  ...cuotas
                ]
              }
            },
          ]
        } : {}
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
const factura_titan = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    let totales = data.totales[0]
    let productos = [];
    let cuotas = [];
    let impuestos = [];
    let retenciones = [];
    let observaciones = window.atob(data.Observaciones64.trim())
    if (observaciones == "undefined") {
      observaciones = ""

    }


    let descripcion = "";
    let descripcion64 = "";

    data.productos.forEach((p, i) => {

      try {
        descripcion64 = decodeURIComponent(escape(window.atob(
          p.base1_pr.trim() +
          p.base2_pr.trim() +
          p.base3_pr.trim() +
          p.base4_pr.trim() +
          p.base5_pr.trim() +
          p.base6_pr.trim() +
          p.base7_pr.trim() +
          p.base8_pr.trim() +
          p.base9_pr.trim() +
          p.base10_pr.trim()
        )));
      } catch (err) {
        descripcion64 = window.atob(
          p.base1_pr.trim() +
          p.base2_pr.trim() +
          p.base3_pr.trim() +
          p.base4_pr.trim() +
          p.base5_pr.trim() +
          p.base6_pr.trim() +
          p.base7_pr.trim() +
          p.base8_pr.trim() +
          p.base9_pr.trim() +
          p.base10_pr.trim()
        );
      }
      if (data.nrores_dian == "18764056778244" && data.numero_fact ==
        "FE       10") {

        descripcion64 = "SERVICIO DE TRANSPORTE ESCOLAR PARA LOS ESTUDIANTES MATRICULADOS EN ESTABLECIMIENTOS EDUCATIVOS OFICIALES DE LOS MUNICIPIOS DE "
          + "ACACIAS, BARRANCA DE UPIA, CABUYARO, CASTILLA LA NUEVA, CUBARRAL, CUMARAL, EL CASTILLO, EL DORADO, FUENTEDEORO, GRANADA, GUAMAL, LA MACARENA, "
          + "LEJANIAS, MAPIRIPAN, MESETAS, PUERTO CONCORDIA, PUERTO GAITAN, PUERTO LLERAS, PUERTO LOPEZ, PUERTO RICO, RESTREPO, SAN JUAN DE ARAMA, "
          + "SAN JUANITO, SAN MARTIN, URIBE Y VISTAHERMOSA Y OPERACION DE VEHICULOS ESCOLARES MEDIANTE EL CUMPLIMIENTO DE RUTAS ESCOLARES"
          + "(INCLUYE SUMINISTRO DE COMPONENTES COMPLEMENTARIOS PARA OPERACION) COMO ESTRATEGIA PARA INCREMENTAR LOS NIVELES DE PERMANENCIA ESCOLAR EN EL DEPARTAMENTO DEL META."
      }

      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = p.nombre_servicio;
      }
      p.nombre_servicio = descripcion + "  " + p.detprod.trim();

      productos.push([
        i + 1,
        // p.codigo,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.umedida.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.infoprod, alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
        { text: p.vlr_dcto, alignment: "right" },
        { text: p.vlr_unitiva, alignment: "right" },
        { text: p.vlr_unitimp, alignment: "right" },
        { text: p.tot_producto.trim(), alignment: "right" },
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

    data.plazos.pop()

    data.plazos.forEach(p => {
      cuotas.push([
        { text: p.cuota },
        { text: p.valor_plazo.trim(), alignment: "center" },
        { text: p.fecha_plazo, alignment: "center" },
      ])
    })

    data.socios.pop();

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
      pageMargins: [margin.left, 250, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 10, margin.right, 0], stack: [
            {
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
                    { text: `${data.direccion_empresa} - ${data.ciudad_empresa.trim()} - Colombia` },
                    { text: `Teléfono: ${data.telefono_empresa}` },
                    { text: `Correo: ${data.email_empresa}` },
                    { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
                    { text: data.tipofacturador_fact == 1 ? `REPRESENTACION GRAFICA DE FACTURA ELECTRONICA` : "", margin: [0, 2, 0, 0] },
                    { text: data.tipofacturador_fact == 1 ? `Resolución  Facturación Dian   ${data.nrores_dian.trim()}` : " ", fontSize: 7, },
                    { text: data.tipofacturador_fact == 1 ? `${data.rango_dian} ${data.vigencia_dian}` : "" },

                  ]
                },
                {
                  fontSize: 10,
                  width: "28%",
                  alignment: "center",
                  stack: [
                    { text: data.tipofacturador_fact == 1 ? `${data.titulo_fact}` + " No" : "DOCUMENTO EQUIVALENTE:", fontSize: 8.5 },
                    { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
                    { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },
                    { text: data.tipofacturador_fact == 1 ? `Fecha Validación DIAN: ${data.fechadian_factura}` : "", fontSize: 8, margin: [0, 5, 0, 0] },
                  ]
                },

              ]
            },
            {
              margin: [0, 10, 0, 0],
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
                            { text: `CC O NIT:: ${data.nit_cliente.trim()} - ${data.dv_cliente}  `, margin: [0, 2, 0, 0] },
                            { text: `Cliente: ${data.nombre_cliente.trim()}`, margin: [0, 2, 0, 0] },
                            // "",
                            // "",
                            { text: `Dirección: ${data.direccion_cliente}`, margin: [0, 12, 0, 0] },
                            { text: `Ciudad: ${data.ciudad_cliente}`, margin: [0, 2, 0, 0] },
                            { text: `Pais: ${data.pais_cliente.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `Email: ${data.email_cliente}`, margin: [0, 2, 0, 0] },
                            { text: `Asesor: ${data.asesor.trim()}`, margin: [0, 2, 0, 0] },
                          ]
                        },
                        {

                          width: "25%",
                          stack: [
                            { text: `Forma de Pago:${data.forma_pago.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `Medio de Pago:${data.medio_pago.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `Plazo Para Pagar:${data.plazo_pago.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `Fecha Vencimiento:${data.vencecorta_factura.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `O.Compra: ${data.ordcompra.trim()}`, margin: [0, 2, 0, 0] },
                            { text: `Fecha Orden:${data.fechaorden_rep.trim()}`, margin: [0, 2, 0, 0] },
                          ]
                        },
                        // {

                        //   width: "*",
                        //   stack: [
                        //     { text: data.forma_pago, margin: [0, 2, 0, 0] },
                        //     { text: data.medio_pago, margin: [0, 2, 0, 0] },
                        //     { text: data.plazo_pago, margin: [0, 2, 0, 0] },
                        //     { text: data.vencecorta_factura, margin: [0, 2, 0, 0] },

                        //   ]
                        // },

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
          fontSize: 7,
          table: {
            widths: ["3%", "20%", "7%", "8%", "6%", "*", "10%", "*", "10%", "*"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "U.Medida", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Inf.Prod", style: "boldcenter" },
                { text: "Unitario", style: "boldcenter" },
                { text: "Dcto", style: "boldcenter" },
                { text: "Unit.Iva", style: "boldcenter" },
                { text: "Unit.Impoc", style: "boldcenter" },
                { text: "Total Producto", style: "boldcenter" },
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
                    widths: ["55%", "*"],
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
                        "Subtotal:",
                        { text: totales.subtotal.trim(), alignment: "right" },
                      ],
                      [
                        "Descuentos:",
                        { text: totales.descuentos.trim(), alignment: "right" },
                      ],
                      [
                        "Impuestos:",
                        { text: totales.impuestos.trim(), alignment: "right" },
                      ],
                      [
                        "ReteFte:",
                        { text: totales.retenciones.trim(), alignment: "right" },
                      ],
                      [
                        "ReteIca:",
                        { text: totales.reteica.trim(), alignment: "right" },
                      ],
                      [
                        "ReteAvisos y Tableros:",
                        { text: totales.reteavisos.trim(), alignment: "right" },
                      ],

                      [
                        "Anticipos:",
                        { text: totales.anticipos.trim(), alignment: "right" },
                      ],

                      [
                        "Total Factura: ",
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
        { text: `CUFE: ${data.iddian_fact}`, margin: [0, 10, 0, 0], fontSize: 9, },
        { text: `Genera: ${data.elaboro}` + ` Fecha: ${data.fecha_elabora}`, margin: [0, 10, 0, 0], fontSize: 9, },

        data.consorcio_fact == 1 ? {
          margin: [0, 10, 0, 0],
          fontSize: 10,
          table: {
            widths: ["55%", "25%", "*"],
            body: [
              [
                {
                  colSpan: 3,
                  text: "UNION TEMPORAL INTEGRADA POR",
                  style: "boldcenter"
                }, "", ""
              ],
              ...data.socios.map(s => [
                s.descr_socio.trim(), "Nit " + s.nit_socio.trim(), s.porc_socio.trim()]
              )
            ]
          }
        } : {},
        data.plazos.length > 0 ? {
          stack: [
            { text: "DETALLE PLAZOS", style: "boldcenter" },
            {
              margin: [130, 10, 0, 0],
              fontSize: 7,
              table: {
                headerRows: 1,
                widths: ["20%", "20%", "20%"],
                body: [
                  [
                    { text: "Cuota", style: "boldcenter" },
                    { text: "Valor", style: "boldcenter" },
                    { text: "Vencimiento", style: "boldcenter" },
                  ],
                  ...cuotas
                ]
              }
            },
          ]
        } : {}
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
const proforma_titan = async (data, getBase64) => {

  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/ShowDocumentToPublic/" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

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

    data.productos.forEach((p, i) => {
      descripcion64 = window.atob(
        p.base1_pr.trim() +
        p.base2_pr.trim() +
        p.base3_pr.trim() +
        p.base4_pr.trim() +
        p.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = p.nombre_servicio;
      }
      p.nombre_servicio = descripcion + "  " + p.detprod.trim();

      productos.push([
        i + 1,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.umedida.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.infoprod, alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
        { text: p.vlr_unitiva, alignment: "right" },
        { text: p.porcimpto, alignment: "right" },
        { text: p.vlr_dcto, alignment: "right" },
        { text: p.tot_producto.trim(), alignment: "right" },
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
                { text: `NIT: ${data.nit_empresa.trim()} - Responsable de IVA - Obligación: No responsable`, margin: [0, 2, 0, 0] },
                `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia Teléfono - ${data.telefono_empresa}`,
                `E-mail: ${data.email_empresa}`,
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: "CODIGO: PGC-FO-04", fontSize: 8 },
                { text: `VERSION: 02 \n\n`, fontSize: 8 },

                { text: "PROFORMA No", fontSize: 10 },
                { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },

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

          fillColor: "#e2f3d9",
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
                    // {

                    //   width: "17%",
                    //   stack: [
                    //     { text: "Forma de Pago:", margin: [0, 2, 0, 0] },
                    //     { text: "Medio de Pago:", margin: [0, 2, 0, 0] },
                    //     { text: "Plazo Para Pagar:", margin: [0, 2, 0, 0] },
                    //     { text: "Fecha Vencimiento:", margin: [0, 2, 0, 0] },
                    //   ]
                    // },
                    // {

                    //   width: "*",
                    //   stack: [
                    //     { text: data.forma_pago, margin: [0, 2, 0, 0] },
                    //     { text: data.medio_pago, margin: [0, 2, 0, 0] },
                    //     { text: data.plazo_pago, margin: [0, 2, 0, 0] },
                    //     { text: data.vencecorta_factura, margin: [0, 2, 0, 0] },

                    //   ]
                    // },

                    // (data.iddian_fact) ? {
                    //   width: 110,
                    //   margin: [10, 0, 0, 0],
                    //   image: qr,
                    // } : {},
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
            widths: ["3%", "20%", "10%", "10%", "*", "*", "*", "8%", "10%", "*"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "U.Medida", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Inf.Prod", style: "boldcenter" },
                { text: "Val. Unit", style: "boldcenter" },
                { text: "IVA/IC", style: "boldcenter" },
                { text: "% Iva/Ic", style: "boldcenter" },
                { text: "Dcto", style: "boldcenter" },
                { text: "Val. Item", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          margin: [0, 40, 0, 0],
          fillColor: "#e2f3d9",
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
                        "Subtotal:",
                        { text: totales.subtotal.trim(), alignment: "right" },
                      ],
                      [
                        "Descuentos:",
                        { text: totales.descuentos.trim(), alignment: "right" },
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
                        "Total Proforma: ",
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
                    { text: `SON: : ${data.TotalEnLetras}*********`, margin: [0, 20, 0, 0] },
                    { text: `\n Aceptación: ${data.nombre_cliente.trim()} \n\n\n\n` },

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
                      alignment: "left",
                    },

                    { text: `NOMBRE:` },
                    { text: `CC:` },
                    { text: `ODI:` },
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
const factura_gyro = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

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

    data.productos.forEach((p, i) => {
      descripcion64 = window.atob(
        p.base1_pr.trim() +
        p.base2_pr.trim() +
        p.base3_pr.trim() +
        p.base4_pr.trim() +
        p.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = p.nombre_servicio;
      }
      p.nombre_servicio = descripcion + "  " + p.detprod.trim();

      productos.push([
        i + 1,
        // p.codigo,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
        { text: p.vlr_unitiva, alignment: "right" },
        { text: p.tot_producto.trim(), alignment: "right" },
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
                { text: `${data.direccion_empresa} - ${data.ciudad_empresa.trim()} - Colombia` },
                { text: `Teléfono: ${data.telefono_empresa}` },
                { text: `Correo: ${data.email_empresa}` },
                { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
                { text: data.tipofacturador_fact == 1 ? `REPRESENTACION GRAFICA DE FACTURA ELECTRONICA` : "", margin: [0, 2, 0, 0] },
                { text: data.tipofacturador_fact == 1 ? `Resolución  Facturación Dian   ${data.nrores_dian.trim()}` : " ", fontSize: 7, },
                { text: data.tipofacturador_fact == 1 ? `${data.rango_dian} ${data.vigencia_dian}` : "" },

              ]
            },
            {
              fontSize: 10,
              width: "28%",
              alignment: "center",
              stack: [
                { text: data.tipofacturador_fact == 1 ? `${data.titulo_fact}` + " No" : "DOCUMENTO EQUIVALENTE:", fontSize: 8.5 },
                { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
                { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },
                { text: data.tipofacturador_fact == 1 ? `Fecha Validación DIAN: ${data.fechadian_factura}` : "", fontSize: 8, margin: [0, 5, 0, 0] },
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
                        { text: `Pais: ${data.pais_cliente.trim()}`, margin: [0, 2, 0, 0] },
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
                        { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
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
            headerRows: 1,
            widths: ["3%", "*", "8%", "10%", "10%", "10%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Unitario", style: "boldcenter" },
                { text: "Iva", style: "boldcenter" },
                { text: "Total Producto", style: "boldcenter" },
              ],
              ...productos
            ]
          },
          // layout: 'headerLineOnly'
        },
        {
          margin: [0, 40, 0, 0],
          fontSize: 7,
          table: {
            headerRows: 1,
            widths: ["*", "*", "25%"],
            body: [
              [
                { text: "Impuestos", style: "boldcenter" },
                {},
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
                        "Subtotal:",
                        { text: totales.subtotal.trim(), alignment: "right" },
                      ],
                      [
                        "Descuentos:",
                        { text: totales.descuentos.trim(), alignment: "right" },
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
                        "Total Factura: ",
                        { text: totales.total.trim(), alignment: "right" },
                      ],
                    ]
                  }
                },
              ]
            ]
          },
          layout: 'headerLineOnly'
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
      pdfMake.createPdf(dd).open();
      res();
    }
  })
};

const proforma = data => {
  return new Promise(res => {
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
            widths: ["40%", "*"],
            body: [
              [
                {
                  image: data.logo,
                  width: 210,
                  height: 65
                },
                {
                  margin: [0, 12, 0, 0],
                  style: "boldcenter",
                  fontSize: 13,
                  text: `TRANSPORTES LLANO LINE SAS\nNIT. 901.496.778-8`
                }
              ]
            ]
          }
        }
      },
      content: [
        {
          fontSize: 9,
          bold: true,
          table: {
            widths: "*",
            body: [
              [
                {
                  margin: [0, 10, 0, 10],
                  columns: [
                    {
                      width: "60%",
                      columns: [
                        {
                          width: "17%",
                          stack: [
                            "CLIENTE:",
                            { text: "NIT:", margin: [0, 6, 0, 0] },
                            { text: "DIRECCION:", margin: [0, 8, 0, 0] },
                            { text: "CIUDAD:", margin: [0, 8, 0, 0] },
                          ]
                        },
                        {
                          fontSize: 8,
                          stack: [
                            { ...subrayado("MCSxxx CONSULTORIA") },
                            { ...subrayado("830073450-5"), margin: [0, 3, 0, 0] },
                            { ...subrayado("CARRERA 17 # 166 - 72"), margin: [0, 3, 0, 0] },
                            { ...subrayado("BOGOTA D.C"), margin: [0, 3, 0, 0] },
                          ]
                        }
                      ]

                    },
                    {
                      margin: [5, 0, 0, 0],
                      columns: [
                        "PROFORMA No.",
                        { ...formatCaja("0040"), alignment: "center" }
                      ]
                    }
                  ]
                }

              ]
            ]
          }
        },
        {
          fontSize: 8,
          margin: [0, 10, 0, 0],
          table: {
            headerRows: 1,
            widths: ["5%", "32%", "12%", "12%", "10%", "*", "*"],
            body: [
              [
                { text: "ITEM", style: "boldcenter" },
                { text: "DESCRIPCION DEL SERVICIO", style: "boldcenter" },
                { text: "FECHA INICIO", style: "boldcenter" },
                { text: "UNIDAD", style: "boldcenter" },
                { text: "CANTIDAD", style: "boldcenter" },
                { text: "VALOR UNITARIO", style: "boldcenter" },
                { text: "VALOR TOTAL", style: "boldcenter" },
              ],
              [
                { text: "1", style: "boldcenter" },
                "SERVICIO DE TRANSPORTE DE PERSONAL A TODO COSTO ( INCLUYE CONDUCTOR Y COMBUSTIBLE ) PARA DESPLAZAMIENTOS DESDE MONTERREY HACIA LA ESTACION EL PORVENIR EN CAMIONETA TSS 614",
                { text: "01-may-23", alignment: "center" },
                { text: "DIA", alignment: "center" },
                { text: "31", alignment: "center" },
                { text: `$ 370.000`, alignment: "center" },
                { text: `$ 11.470.000`, alignment: "center" },
              ],
              [{ colSpan: 5, rowSpan: 3, text: " " }, "", "", "", "", { text: "SUB TOTAL", style: "boldcenter" }, { text: "$ 11.470.000", style: "boldcenter" }],
              [{ colSpan: 5, text: " " }, "", "", "", "", { text: "IVA", style: "boldcenter" }, { text: "$ 11.470.000", style: "boldcenter" }],
              [{ colSpan: 5, text: " " }, "", "", "", "", { text: "TOTAL", style: "boldcenter" }, { text: "$ 11.470.000", style: "boldcenter" }],
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 9,
          bold: true,
          table: {
            widths: ["20%", "*"],
            body: [
              [
                {
                  text: "Notas Comentarios:",
                  alignment: "center"
                },
                "RECUERDE: Tenga presente que así como queda esta proforma, de igual manera quedara la FACTURA ELECTRONICA"
              ]
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 8,
          table: {
            widths: "*",
            body: [
              [
                {
                  columns: [
                    {
                      margin: [5, 0, 0, 0],
                      stack: [
                        { text: "FIRMA DEL REPRESENTANTE\nDEL PROVEEDOR", style: "boldcenter" },
                        {
                          margin: [0, 10, 0, 0],
                          columns: [
                            {
                              bold: true,
                              width: "18%",
                              stack: [
                                "Nombre:",
                                { text: "Cargo:", margin: [0, 6, 0, 0] },
                                { text: "Fecha:", margin: [0, 8, 0, 0] },
                              ]
                            },
                            {
                              fontSize: 8,
                              stack: [
                                { ...subrayado("MCS CONSULTORIA") },
                                { ...subrayado("830073450-5"), margin: [0, 3, 0, 0] },
                                { ...subrayado("CARRERA 17 # 166 - 72"), margin: [0, 3, 0, 0] },
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      margin: [5, 0, 0, 0],
                      stack: [
                        { text: "FIRMA DEL REPRESENTANTE\nEMPRESA CONTRATISTA", style: "boldcenter" },
                        {
                          margin: [0, 10, 0, 0],
                          columns: [
                            {
                              bold: true,
                              width: "18%",
                              stack: [
                                "Nombre:",
                                { text: "Cargo:", margin: [0, 6, 0, 0] },
                                { text: "Fecha:", margin: [0, 8, 0, 0] },
                              ]
                            },
                            {
                              fontSize: 8,
                              stack: [
                                { ...subrayado("MCS CONSULTORIA") },
                                { ...subrayado("830073450-5"), margin: [0, 3, 0, 0] },
                                { ...subrayado("CARRERA 17 # 166 - 72"), margin: [0, 3, 0, 0] },
                              ]
                            }
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
      ]
    }


    pdfMake.createPdf(dd).open();
    res();
  })
};
const escala_2years = data => {
  return new Promise(res => {
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
      right: 20,
    };

    let dd = {
      pageMargins: [margin.left, 20, margin.right, 0],
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Página " + currentPage.toString() + " de " + pageCount,
          ],
        };
      },
      // header: function (currentPage, pageCount, pageSize) {
      //   return [
      //     {
      //       margin: [margin.left, 20, margin.right, 0],
      //       columns: [
      //         {
      //           image: data.logo,
      //           width: 105,
      //           height: 80,
      //         },
      //         "Hi",
      //       ],
      //     },
      //   ];
      // },
      content: [
        {
          fontSize: 11,
          table: {
            widths: "*",
            body: [
              [
                {
                  margin: [4, 4, 4, 4],
                  stack: [
                    "Datos al nacimiento",
                    {
                      margin: [0, 3, 0, 0],
                      columns: [
                        { text: "Nombre", width: "auto", margin: [0, 2, 3, 0] },
                        formatCaja(" "),
                        { text: "Fecha de Nacimiento", width: "auto", margin: [4, 2, 3, 0] },
                        { ...formatCaja(" "), width: "20%" },
                      ]
                    },
                    {
                      margin: [0, 3, 0, 0],
                      columns: [
                        { text: "Peso", width: "auto", margin: [0, 2, 3, 0] },
                        formatCaja(" "),
                        { text: "Talla", width: "auto", margin: [4, 2, 3, 0] },
                        formatCaja(" "),
                        { text: "PC", width: "auto", margin: [4, 2, 3, 0] },
                        formatCaja(" "),
                        { text: "RH", width: "auto", margin: [4, 2, 3, 0] },
                        formatCaja(" ")
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        },

        {
          margin: [0, 20, 0, 0],
          image: data.grafico1,
          width: 550,
          height: 300,
        },
        {
          margin: [0, 20, 0, 0],
          image: data.grafico2,
          width: 550,
          height: 300,
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
      },

    };


    pdfMake.createPdf(dd).open();
    res();
  })
};
const conciliacion = data => {
  return new Promise(res => {
    data.pendientes_rep.pop();
    data.periodo_rep = data.periodo_rep.replace(/(\d{4})(\d{2})/, '$1-$2');

    var datosTabla = [];
    var valoresTabla = [];
    var pieTabla = [];
    var totalValor = 0;

    valoresTabla.push([
      {
        fontSize: 9,
        alignment: "center",
        bold: true,
        text: "Fecha",
      },
      {
        fontSize: 9,
        alignment: "center",
        bold: true,
        text: "Descripción",
      },
      {
        fontSize: 9,
        alignment: "center",
        bold: true,
        text: "Documento",
      },
      {
        fontSize: 9,
        alignment: "center",
        bold: true,
        text: "Valor",
      },
    ]);

    data.pendientes_rep.forEach((el) => {
      totalValor += parseFloat(
        el.valorpte_rep.replace(/\ /g, "").replace(/\,/g, "")
      );

      el.fechapte_rep = el.fechapte_rep.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      valoresTabla.push([
        {
          fontSize: 9,
          alignment: "left",
          text: el.fechapte_rep,
        },
        {
          fontSize: 9,
          alignment: "left",
          text: el.descrippte_rep.trim(),
        },
        {
          fontSize: 9,
          alignment: "left",
          text: el.registropte_rep.trim()   //  el.docabrev_rep,
        },
        {
          fontSize: 9,
          alignment: "right",
          text: el.valorpte_rep.trim(),
        },
      ]);
    });

    valoresTabla.push([
      {},
      {},
      {
        alignment: "center",
        bold: true,
        fontSize: 9,
        text: "Total:",
      },
      {
        alignment: "right",
        bold: true,
        fontSize: 10,
        text: formatNumero(totalValor),
      },
    ]);

    datosTabla.push(
      [
        {
          fontSize: 10,
          bold: true,
          alignment: "center",
          text: "Pendientes por registro en Bancos",
          colSpan: 6,
        },
        {},
        {},
        {},
      ],
      [
        {
          colSpan: 6,
          alignment: "center",
          table: {
            headerRows: 1,
            widths: [50, 250, 90, 90],
            body: valoresTabla,
          },
          layout: "lightHorizontalLines",
        },
        {},
        {},
        {},
        {},
        {},
      ]
    );

    datosTabla.unshift([
      {
        fontSize: 10,
        alignment: "left",
        bold: true,
        text: "Saldo en Bancos:",
      },
      {
        fontSize: 10,
        alignment: "left",
        text: data.sdobancos_rep.trim(),
      },
      {
        fontSize: 10,
        alignment: "center",
        bold: true,
        text: "Saldo Contable:",
      },
      {
        fontSize: 10,
        alignment: "center",
        text: data.sdoauxiliar_rep.trim(),
      },
      {
        fontSize: 10,
        alignment: "center",
        bold: true,
        text: "Valor por conciliar:",
      },
      {
        fontSize: 10,
        alignment: "center",
        text: data.diferencia_rep.trim(),
      },
    ]);

    var margin = {
      left: 40,
      right: 40,
    };

    var dd = {
      //pageOrientation: "landscape",
      pageMargins: [margin.left, 100, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 20, margin.right, 0],
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
                fontSize: 11,
                stack: [
                  data.empresa.descrip_empr,
                  `NIT. ${formatNumero(
                    parseInt(data.empresa.id_empr.replace(/\,/g, ""))
                  )}`,
                  `Dir. ${data.empresa.direccion_empr}`,
                  `Tel. ${parseInt(data.empresa.telefono_empr)}`,
                  `${data.empresa.Ciudad} - ${data.empresa.Departamento}`,
                ],
              },
              {
                width: "35%",
                bold: true,
                fontSize: 11,
                alignment: "left",
                stack: [
                  "Conciliacion Bancaria".toUpperCase(),
                  `Cuenta: ${data.cuenta_rep} - ${data.descripcta_rep.trim()}`,
                  `Periodo: ${data.periodo_rep}`,
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
            widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
            body: datosTabla,
          },
          layout: "lightHorizontalLines",
        },
        {
          fontSize: 9,
          columns: [
            {
              alignment: "left",
              width: "80%",
              bold: true,
              text: ["Generó: ", parseFloat(data.genero_rep)],
            },
            {
              alignment: "left",
              width: "20%",
              bold: true,
              text: ["Revisó: "],
            },
          ],
        },
        {
          alignment: "left",
          fontSize: 9,
          bold: true,
          text: ["Fecha: ", data.fechagen_rep],
        },
      ],
      footer: {
        margin: [margin.left, 0, 0, 0],
        alignment: "left",
        fontSize: 9,
        bold: true,
        text: "www.titansoluciones.com",
      },
      styles: {},
      images: {
        logo: data.logo,
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const esfc = data => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    delete data.info["" || 0];

    let contenido = [];

    let put_row = (el, total) => {
      return [
        {
          text: !total ? el.DESCRIPCION.trim() : `TOTAL ${el.DESCRIPCION.trim()}`,
          bold: el.NEGRILLA.trim() == "S" || total ? true : false,
          margin: el.CTAPUC.trim().length == 4 ? [15, 0, 0, 0] : [0, 0, 0, 0],
          alignment: total ? "right" : "left",
          color: total ? data.cierre.COLOR2 : "black"
        },
        { text: el.VALOR1.trim(), alignment: "right", bold: el.NEGRILLA.trim() == "S" || total ? true : false },
        { text: el.VALOR2.trim(), alignment: "right", bold: el.NEGRILLA.trim() == "S" || total ? true : false }
      ]
    };


    let suma_totales = (t1, t2) => {
      return formatNumero(
        parseFloat(t1.replace(/\,/g, "")) +
        parseFloat(t2.replace(/\,/g, ""))
      )
    }

    Object.keys(data.info).forEach((k, index) => {
      var elemento = data.info[k];

      if ((k <= 4) && !((data.nivel.value == 1 || data.nivel.value == 2) && k == 3)) {
        contenido.push({
          pageBreak: k != 1 ? "before" : "",
          margin: [margin.left, 0, margin.right, 10],
          columns: [
            {
              image: data.logo,
              width: 110,
              height: 60
            },
            {
              fontSize: 12,
              margin: [20, 0, 0, 0],
              bold: true,
              stack: [
                { text: data.titulo_empr, fontSize: 15 },
                `Nit: ${parseInt(data.nit_empr)}`,
                { text: `${k == 4 ? "ESTADO DE RESULTADOS INTEGRALES" : "ESTADO DE SITUACION FINANCIERA"} ${data.mesText.toUpperCase()} `, margin: [0, 2, 0, 0], color: data.cierre.COLOR1.trim() },
              ]
            }

          ]
        });
      }

      contenido.push({
        margin: [0, 10, 0, 20],

        canvas: [
          {
            type: "line",
            x1: 0,
            x2: 604 - (margin.left * 3),
            y1: 0,
            y2: 0,
            lineWidth: 1,
            lineColor: data.cierre.COLOR1.trim(),
          },
        ],
      })

      let subelementos = [];

      elemento.forEach((el, i) => {
        if (i != 0) {
          subelementos.push(put_row(el))
        }
      });
      subelementos.push(put_row(elemento[0], true));
      if (k == 3) {
        var elementoAnterior = data.info[k - 1];
        subelementos.push(put_row({
          CTAPUC: "",
          DESCRIPCION: "PASIVOS + PATRIMONIO",
          VALOR1: suma_totales(elemento[0].VALOR1, elementoAnterior[0].VALOR1),
          VALOR2: suma_totales(elemento[0].VALOR2, elementoAnterior[0].VALOR2),
          NEGRILLA: "S"
        }, true))
      }

      if (k != 8) {
        contenido.push({
          layout: {
            hLineWidth: function (i, node) {
              return (i === 1 || i === node.table.body.length) ? 1.5 : 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return (i === 1) ? 'black' : (i === node.table.body.length) ? data.cierre.COLOR1.trim() : 'white';
            },
            paddingLeft: function (i, node) { return 2; },
            paddingRight: function (i, node) { return 2; },
            paddingTop: function (i, node) { return 2; },
            paddingBottom: function (i, node) { return 2; }
          },
          margin: [0, 0, 0, k >= 4 ? 15 : 0],
          fontSize: 8,
          table: {
            headerRows: 1,
            widths: ["50%", "25%", "*"],
            body: [
              [
                { text: elemento[0].DESCRIPCION, style: "tableTitle" },
                { text: data.añoActual, style: "tableTitle", margin: [0, 0, 15, 0], alignment: "right" },
                { text: data.añoActual - 1, style: "tableTitle", margin: [0, 0, 15, 0], alignment: "right" },
              ],
              ...subelementos
            ]
          },
        })
      } else {
        contenido.push({
          alignment: "right",
          bold: true,
          fontSize: 8,
          columns: [
            { text: elemento[0].DESCRIPCION.trim(), alignment: "left", color: data.cierre.COLOR2, width: "48%" },
            { text: elemento[0].VALOR1.trim(), width: "25%" },
            { text: elemento[0].VALOR2.trim(), width: "*" },
          ]
        })
      }

      if (k == 1 || k == 3 || k == 8) {
        contenido.push({
          fontSize: 7,
          margin: [0, 70, 0, 0],
          columns: [
            data.cierre.FIRMA1.trim().length !== 0 ? {

              margin: [15, 0, 0, 0],
              width: "33.3%",
              style: "boldcenter",
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
                { text: data.cierre.FIRMA1.trim(), margin: [0, 2, 0, 0] },
                { text: data.cierre.CARGO1.trim(), margin: [0, 2, 0, 0] },
              ],
            } : { width: "0%", text: " " },
            data.cierre.FIRMA2.trim().length !== 0 ? {
              margin: [30, 0, 0, 0],
              width: "30.3%",
              style: "boldcenter",
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
                { text: data.cierre.FIRMA2.trim(), margin: [0, 2, 0, 0] },
                { text: data.cierre.CARGO2.trim(), margin: [0, 2, 0, 0] },
              ],
            } :
              {
                margin: [30, 0, 0, 0],
                width: "30.3%",
                style: "boldcenter",
                text: " "
              },
            data.cierre.FIRMA3.trim().length !== 0 ? {
              margin: [60, 0, 0, 0],
              width: "28.3%",
              style: "boldcenter",
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
                { text: data.cierre.FIRMA3.trim(), margin: [0, 2, 0, 0] },
                { text: data.cierre.CARGO3.trim(), margin: [0, 2, 0, 0] },
              ],
            } : { width: "0%", text: " " },
          ]
        },)
      }
    });


    var dd = {
      pageMargins: [margin.left, 30, margin.right, 10],
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      styles: {
        "title": {
          fontSize: 15,
          bold: true
        },
        "tableTitle": {
          fontSize: 8,
          bold: true,
          color: data.cierre.COLOR2.trim(),
          alignment: "center"
        },
        "boldcenter": {
          bold: true,
          alignment: "center"
        }
      },
      content: contenido
    }

    pdfMake.createPdf(dd).open();
    res();
  })
};
const esfm = data => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    let contenido = [];

    delete data.info["" || 0];


    let put_row = (el, total) => {
      return [
        { text: el.CTAPUC.trim(), },
        !total ? {
          text: el.DESCRIPCION.trim(), margin: el.CTAPUC.trim().length == 4 ? [15, 0, 0, 0] : [0, 0, 0, 0],
          bold: el.NEGRILLA.trim() == "S" ? true : false
        } :
          { text: `TOTAL ${el.DESCRIPCION.trim()}`, alignment: "right", color: data.cierre.COLOR2.trim() },
        { text: el.SDO_ANTER.trim(), alignment: "right", bold: total || el.NEGRILLA.trim() == "S" ? true : false },
        { text: el.DEBITOS.trim(), alignment: "right", bold: total || el.NEGRILLA.trim() == "S" ? true : false },
        { text: el.CREDITOS.trim(), alignment: "right", bold: total || el.NEGRILLA.trim() == "S" ? true : false },
        { text: el.SALDO.trim(), alignment: "right", bold: total || el.NEGRILLA.trim() == "S" ? true : false }
      ]
    };

    let suma_totales = (t1, t2) => {
      return formatNumero(
        parseFloat(t1.replace(/\,/g, "")) +
        parseFloat(t2.replace(/\,/g, ""))
      )
    }

    Object.keys(data.info).forEach((k, index) => {
      var elemento = data.info[k];

      if ((k <= 4) && !((data.nivel.value == 1 || data.nivel.value == 2) && k == 3)) {
        contenido.push({
          pageBreak: k != 1 ? "before" : "",
          margin: [margin.left, 0, margin.right, 10],
          columns: [
            {
              image: data.logo,
              width: 110,
              height: 60
            },
            {
              fontSize: 12,
              margin: [20, 0, 0, 0],
              bold: true,
              stack: [
                { text: data.titulo_empr, fontSize: 15 },
                `Nit: ${parseInt(data.nit_empr)}`,
                { text: `${k == 4 ? "ESTADO DE RESULTADOS INTEGRALES" : "ESTADO DE SITUACION FINANCIERA"} ${data.mesText.toUpperCase()} ${data.añoActual}`, margin: [0, 2, 0, 0], color: data.cierre.COLOR1.trim() },
              ]
            }

          ]
        });
      }

      contenido.push({
        margin: [0, 10, 0, 20],

        canvas: [
          {
            type: "line",
            x1: 0,
            x2: 604 - (margin.left * 3),
            y1: 0,
            y2: 0,
            lineWidth: 1,
            lineColor: data.cierre.COLOR1.trim(),
          },
        ],
      })

      let subelementos = [];

      elemento.forEach((el, i) => {
        if (i != 0) {
          subelementos.push(put_row(el))
        }
      });

      subelementos.push(put_row(elemento[0], true));
      if (k == 3) {
        var elementoAnterior = data.info[k - 1];
        subelementos.push(put_row({
          CTAPUC: "",
          DESCRIPCION: "PASIVOS + PATRIMONIO",
          SDO_ANTER: suma_totales(elemento[0].SDO_ANTER, elementoAnterior[0].SDO_ANTER),
          DEBITOS: suma_totales(elemento[0].DEBITOS, elementoAnterior[0].DEBITOS),
          CREDITOS: suma_totales(elemento[0].CREDITOS, elementoAnterior[0].CREDITOS),
          SALDO: suma_totales(elemento[0].SALDO, elementoAnterior[0].SALDO),
        }, true))
      }

      if (k != 8) {
        contenido.push({
          layout: {
            hLineWidth: function (i, node) {
              return (i === 1 || i === node.table.body.length) ? 1.5 : 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return (i === 1) ? 'black' : (i === node.table.body.length) ? data.cierre.COLOR1.trim() : 'white';
            },
            paddingLeft: function (i, node) { return 2; },
            paddingRight: function (i, node) { return 2; },
            paddingTop: function (i, node) { return 2; },
            paddingBottom: function (i, node) { return 2; }
          },
          margin: [0, 0, 0, k >= 4 ? 15 : 0],
          fontSize: 7,
          table: {
            headerRows: 1,
            widths: ["8%", "40%", "14%", "12%", "12%", "*"],
            body: [
              [
                { text: elemento[0].DESCRIPCION, style: "tableTitle", colSpan: 2 }, "",
                { text: 'SALDO INICIAL', style: "tableTitle" },
                { text: 'DEBITOS', style: "tableTitle" },
                { text: "CREDITO", style: "tableTitle" },
                { text: "SALDO FINAL", style: "tableTitle" }
              ],
              ...subelementos
            ]
          },
        })
      } else {
        contenido.push({
          alignment: "right",
          bold: true,
          fontSize: 7,
          columns: [
            { text: elemento[0].DESCRIPCION.trim(), alignment: "left", color: data.cierre.COLOR2, width: "44%" },
            { text: elemento[0].SDO_ANTER.trim(), width: "14%" },
            { text: elemento[0].DEBITOS.trim(), width: "12%" },
            { text: elemento[0].CREDITOS.trim(), width: "12%" },
            { text: elemento[0].SALDO.trim(), width: "*" }
          ]
        })
      }

      if (k == 1 || k == 3 || k == 8) {
        contenido.push({
          fontSize: 7,
          margin: [0, 70, 0, 0],
          columns: [
            data.cierre.FIRMA1.trim().length !== 0 ? {

              margin: [15, 0, 0, 0],
              width: "33.3%",
              style: "boldcenter",
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
                { text: data.cierre.FIRMA1.trim(), margin: [0, 2, 0, 0] },
                { text: data.cierre.CARGO1.trim(), margin: [0, 2, 0, 0] },
              ],
            } : { width: "0%", text: " " },
            data.cierre.FIRMA2.trim().length !== 0 ? {
              margin: [30, 0, 0, 0],
              width: "30.3%",
              style: "boldcenter",
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
                { text: data.cierre.FIRMA2.trim(), margin: [0, 2, 0, 0], },
                { text: data.cierre.CARGO2.trim(), margin: [0, 2, 0, 0] },
              ],
            } : {
              margin: [30, 0, 0, 0],
              width: "30.3%",
              style: "boldcenter",
              text: " "
            },
            data.cierre.FIRMA3.trim().length !== 0 ? {
              margin: [60, 0, 0, 0],
              width: "28.3%",
              style: "boldcenter",
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
                { text: data.cierre.FIRMA3.trim(), margin: [0, 2, 0, 0] },
                { text: data.cierre.CARGO3.trim(), margin: [0, 2, 0, 0] },
              ],
            } : { width: "0%", text: " " },
          ]
        },)
      }

    });


    var dd = {
      pageMargins: [margin.left, 30, margin.right, 10],
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 9,
          columns: [
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      styles: {
        "title": {
          fontSize: 15,
          bold: true
        },
        "tableTitle": {
          fontSize: 8,
          bold: true,
          alignment: "center",
          color: data.cierre.COLOR2.trim()
        },
        "boldcenter": {
          bold: true,
          alignment: "center"
        }
      },
      content: contenido
    }

    pdfMake.createPdf(dd).open();
    res();
  })
};
const declaracion_impuesto = data => {
  return new Promise(res => {
    let basegravable = {
      b8: parseFloat(data.registros[0].totingre_for.replace(/\,/g, "")) || 0,
      b9: parseFloat(data.registros[1].totingre_for.replace(/\,/g, "")) || 0,
    };

    basegravable.b10 = basegravable.b8 - basegravable.b9



    let margin = {
      left: 20,
      right: 20
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

    var dd = {
      pageMargins: [margin.left, 20, margin.right, 20],
      styles: {
        smallHeader: {
          fontSize: 6,
          alignment: "center"
        },
        header: {
          fontSize: 9.5,
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
          fontSize: 6.6,
          table: {
            widths: "*",
            headerRows: 1,
            body: [
              [
                {
                  text: "FORMULARIO UNICO Y NACIONAL DE DECLARACION Y PAGO DEl IMPUESTO DE INDUSTRIA Y COMERCIO",
                  style: "header"
                }
              ],
              [
                {
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: ["75%", "25%"],
                    body: [
                      [
                        { text: `MUNICIPIO O DISTRITO: ${data.municipio.trim()}`, fontSize: 6 },
                        {
                          rowSpan: 2,
                          style: "boldcenter",
                          stack: [
                            "Fecha Máxima Presentación",
                            { text: data.fecha_maxima, fontSize: 10, margin: [0, 3, 0, 0] }
                          ]
                        }
                      ],
                      [
                        `DEPARTAMENTO: ${data.departamento.trim()}`,
                        ""
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
                  }
                },
              ],

              [
                {
                  columns: [
                    { text: "AÑO GRAVABLE", bold: true, width: "15%" },
                    { text: data.fecha_ini, width: "10%" },
                    { text: "SOLAMENTE PARA BOGOTÁ, marque el Bimestre o período anual", width: "40%" },
                    {
                      stack: [
                        {
                          fontSize: 6,
                          columns: [
                            { text: "ene-feb" },
                            { text: "mar-abr" },
                            { text: "may-jun" },
                            { text: "jul-ago" },
                            { text: "sep-oct" },
                            { text: "nov-dic" },
                            { text: "anual" }
                          ]
                        },
                        {
                          columns: [
                            { ...formatCaja(" "), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                            { ...formatCaja(" "), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                            { ...formatCaja(" "), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                            { ...formatCaja(" "), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                            { ...formatCaja(" "), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                            { ...formatCaja(" "), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                            { ...formatCaja("X"), width: "14.2%", margin: [0, 0, 12, 0, 0] },
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],


              [
                {
                  columns: [
                    { text: "OPCION DE USO", width: "13%" },
                    {
                      width: "45%",
                      columns: [
                        { text: "Declaración", margin: [0, 2, 0, 0], width: "15%", bold: true },
                        { ...formatCaja(" "), width: "3.5%" },
                        { text: "Solo pago", margin: [30, 2, 0, 0], width: "30%", bold: true },
                        { ...formatCaja(" "), width: "3.5%" },
                        { text: "Correción", margin: [30, 2, 0, 0], width: "30%", bold: true },
                        { ...formatCaja(" "), width: "3.5%" },
                      ]
                    },
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "Declaración que corrige N", width: "auto" },
                        subrayado(" "),
                        { text: "Fecha", width: "auto" },
                        subrayado(" ")
                      ]
                    }
                  ]
                }
              ],
              [
                {
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: ["10%", "1.5%", "*"],
                    body: [
                      [
                        {
                          text: "A. INFORMACION\nDEL\nCONTRIBUYENTE",
                          margin: [0, 20, 0, 0],
                          style: "boldcenter",
                          rowSpan: 5
                        },
                        { text: "1", style: "boldcenter" },
                        {
                          columns: [
                            "NOMBRES Y APELLIDOS O RAZON SOCIAL:",
                            data.nombre_cont
                          ]
                        }
                      ],
                      [
                        "",
                        { text: "2", style: "boldcenter" },
                        {

                          columns: [
                            { text: "CC", margin: [0, 2, 2, 0], width: "auto", },
                            { ...formatCaja(condicional(data.tipoid_cont, "CC")), width: "auto" },
                            { text: "NIT", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(condicional(data.tipoid_cont, "Nit")), width: "auto" },
                            { text: "TI", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(condicional(data.tipoid_cont, "TI")), width: "auto" },
                            { text: `${data.id_cont} - DV`, width: "auto", margin: [20, 0, 10, 0] },
                            { text: "Es consorcio o Unión Temporal", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "Realiza actividades a través de Patrímonio Autónomo", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                          ]
                        },
                      ],
                      [
                        "",
                        { text: "3", style: "boldcenter", rowSpan: 2 },
                        {
                          columns: [
                            "DIRECCION DE NOTIFICACION :",
                            data.direccion_cont
                          ]
                        }
                      ],
                      [
                        "",
                        "",
                        {
                          margin: [-4, -2, -4, -2],
                          table: {
                            body: [
                              [
                                {
                                  columns: [
                                    `MUNICIPIO O DISTRITO DE LA DIRECCION: ${data.ciudad_cont[0]}`,
                                    { text: data.ciudad_cont[1], margin: [10, 0, 0, 0] }
                                  ]
                                },
                                `DEPARTAMENTO: ${data.departamento_cont}`
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
                          }
                        }
                      ],
                      [
                        "",
                        { text: "4", style: "boldcenter" },
                        {
                          margin: [-4, -2, -4, -2],
                          table: {
                            body: [
                              [
                                `TELEFONO: ${data.telefono_cont.trim()}`,
                                `5. CORREO ELECTRONICO ${data.email_cont}`,
                                `6. No DE ESTABLECIMIENTOS `,
                                `7. CLASIFICACION Común`,
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
                          }
                        }
                      ],

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
                    widths: ["10%", "1.5%", "70%", "*"],
                    body: [
                      [
                        {
                          text: "B. BASE\nGRAVABLE",
                          margin: [0, 40, 0, 0],
                          style: "boldcenter",
                          rowSpan: 9
                        },
                        { text: "8", style: "boldcenter" },
                        {
                          text: "TOTAL INGRESOS ORDINARIOS Y EXTRAORDINARIOS DEL PERIODO EN TODO EL PAIS",
                          bold: true
                        },
                        { text: formatNumero(basegravable.b8), style: "boldright" }
                      ],
                      [
                        "",
                        { text: "9", style: "boldcenter" },
                        {
                          text: "MENOS INGRESOS FUERA DE ESTE MUNICIPIO O DISTRITO",
                          alignment: "center",
                        },
                        { text: formatNumero(basegravable.b9), alignment: "right" }
                      ],
                      [
                        "",
                        { text: "10", style: "boldcenter" },
                        {
                          text: "TOTAL INGRESOS ORDINARIOS Y EXTRAORDINARIOS EN ESTE MUNICIPIO (RENGLÓN 8 MENOS 9)",
                          bold: true
                        },
                        { text: formatNumero(basegravable.b10), style: "boldright" }
                      ],
                      [
                        "",
                        { text: "11", style: "boldcenter" },
                        {
                          text: "MENOS INGRESOS POR DEVOLUCIONES, REBAJAS, DESCUENTOS",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "12", style: "boldcenter" },
                        {
                          text: "MENOS INGRESOS POR EXPORTACIONES",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "13", style: "boldcenter" },
                        {
                          text: "MENOS INGRESOS POR VENTA DE ACTIVOS FIJOS",
                          style: "boldcenter"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "14", style: "boldcenter" },
                        {
                          text: "MENOS INGRESOS POR ACTIVIDADES EXCLUIDAS O NO SUJETAS Y OTROS INGRESOS NO GRAVADOS",
                          style: "boldcenter"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "15", style: "boldcenter" },
                        {
                          text: "MENOS INGRESOS POR OTRAS ACTIVIDADES EXENTAS EN ESTE MUNICIPIO O DISTRITO (POR ACUERDO)",
                          style: "boldcenter"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "16", style: "boldcenter" },
                        {
                          text: "TOTAL INGRESOS GRAVABLES (RENGLÓN 10 MENOS 11,12,13,14 Y 15)",
                          bold: true
                        },
                        { text: formatNumero(basegravable.b10), style: "boldright" }
                      ],
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
                    widths: ["10.4%", "*", "*", "*", "*", "*"],
                    body: [
                      [
                        {
                          text: "C. DISCRIMINACION\nDE\nACTIVIDADES\nGRAVADAS",
                          fontSize: 6.4,
                          margin: [0, 20, 0, 0],
                          style: "boldcenter",
                          rowSpan: 7
                        },
                        { text: "ACTIVIDADES GRAVADAS", alignment: "center" },
                        { text: "CÓDIGO", alignment: "center" },
                        { text: "INGRESOS GRAVADOS", alignment: "center" },
                        { text: "TARIFA (Por mil)", alignment: "center" },
                        { text: "IMPUESTO", alignment: "center" },
                      ],
                      [
                        "",
                        { text: "Actividad Principal", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 2", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 3", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "OTRAS ACTIVIDADES", style: "boldcenter" },
                        { text: "VER DESAGREGACION", style: "boldcenter" },
                        { text: "", alignment: "center" },
                        { text: "", style: "boldcenter" },
                        { text: "", alignment: "center" },
                      ],
                      [
                        "",
                        { text: "TOTAL INGRESOS GRAVADOS", bold: true, colSpan: 2 },
                        "",
                        { text: "", alignment: "center" },
                        { text: "17. TOTAL IMPUESTOS", style: "boldcenter" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: [{ text: "18. ", bold: true }, "GENERACION DE ENERGÍA CAPACIDAD INSTALADA Kw"], colSpan: 3 },
                        "",
                        "",
                        { text: "19. IMPUESTO LEY 56 DE 1981", alignment: "center", fontSize: 6 },
                        { text: "0", alignment: "right" },
                      ],
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
                    widths: ["10%", "1.5%", "70%", "*"],
                    body: [
                      [
                        {
                          text: "D. LIQUIDACION PRIVADA",
                          margin: [0, 80, 0, 0],
                          style: "boldcenter",
                          rowSpan: 15
                        },
                        { text: "20", style: "boldcenter" },
                        "TOTAL IMPUESTO DE INDUSTRIA Y COMERCIO (RENGLÓN 17+19)",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "21", style: "boldcenter" },
                        "IMPUESTO DE AVISOS Y TABLEROS (15% DEL RENGLÓN 20)",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "22", style: "boldcenter" },
                        "PAGO POR UNIDADES COMERCIALES ADICIONALES DEL SECTOR FINANCIERO",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "23", style: "boldcenter" },
                        "SOBRETASA BOMBERIL (Ley 1575 de 2012) (Si la hay, liquídela según el acuerdo municipal o distrital))",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "24", style: "boldcenter" },
                        "SOBRETASA DE SEGURIDAD (LEY 1421 de 2011) (Si la hay, liquídela según el acuerdo municipal o distrital)",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "25", style: "boldcenter" },
                        {
                          text: "TOTAL IMPUESTO A CARGO (RENGLONES 20+21+22+23+24)",
                          bold: true
                        },
                        { text: "0", style: "boldright" }
                      ],
                      [
                        "",
                        { text: "26", style: "boldcenter" },
                        {
                          text: "MENOS VALOR DE EXENCION O EXONERACION SOBRE EL IMPUESTO Y NO SOBRE LOS INGRESOS",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "27", style: "boldcenter" },
                        {
                          text: "MENOS RETENCIONES que le practicaron a favor de este municipio o distrito en este período",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "28", style: "boldcenter" },
                        {
                          text: "MENOS AUTORRETENCIONES practicadas a favor de este municipio o distrito en este período",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "29", style: "boldcenter" },
                        {
                          text: "MENOS ANTICIPO LIQUIDADO EN EL AÑO ANTERIOR",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "30", style: "boldcenter" },
                        "ANTICIPO DEL AÑO SIGUIENTE (Si existe, liquide porcentaje según Acuerdo Municipal o distrital)",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "31", style: "boldcenter" },
                        {
                          columns: [
                            { text: "SANCIONES.", bold: true },
                            { text: "EXTEMPORANEIDAD", margin: [0, 2, 2, 0], width: "auto", },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "CORRECCION", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "INEXACTITUD", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "OTRA", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "Cuál", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                          ]
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "32", style: "boldcenter" },
                        {
                          text: "MENOS SALDO A FAVOR DEL PERIODO ANTERIOR SIN SOLICITUD DE DEVOLUCION O COMPENSACION",
                          alignment: "center"
                        },
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "33", style: "boldcenter" },
                        "TOTAL SALDO A CARGO (REGLON 25-26-27-28-29+30+31-32)",
                        { text: "0", style: "boldright" }
                      ],
                      [
                        "",
                        { text: "34", style: "boldcenter" },
                        "TOTAL SALDO A FAVOR (REGLON 25-26-27-28-29+30+31-32) si el resultado es menor a cero",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        {
                          text: "E.PAGO",
                          margin: [0, 15, 0, 0],
                          style: "boldcenter",
                          rowSpan: 4
                        },
                        { text: "35", style: "boldcenter" },
                        "VALOR A PAGAR",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "36", style: "boldcenter" },
                        "DESCUENTO POR PRONTO PAGO (Si existe, liquídelo según el Acuerdo Municipal o distrital)",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "37", style: "boldcenter" },
                        "INTERESES DE MORA",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        { text: "38", style: "boldcenter" },
                        "TOTAL A PAGAR (RENGLON 35 - 36 +37)",
                        { text: "0", style: "boldright" }
                      ],
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
                    widths: ["17%", "64.9%", "*"],
                    body: [
                      [
                        {
                          text: "SECCION PAGO VOLUNTARIO (Solamente donde exista esta opción)",
                          margin: [0, 1, 0, 0],
                          rowSpan: 3
                        },
                        "39. LIQUIDE EL VALOR DEL PAGO VOLUNTARIO (Según instrucciones del municipio/distrito)",
                        { text: "0", alignment: "right" }
                      ],
                      [
                        "",
                        "40. TOTAL A PAGAR CON PAGO VOLUNTARIO (Reglón 38 + 39)",
                        { text: "0", style: "boldright" }
                      ],
                      [
                        "",
                        { text: "Destino de mi aporte voluntario  0%", colSpan: 2 },
                        ""
                      ],
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
                    widths: ["10%", "40%", "*"],
                    body: [
                      [
                        {
                          text: "F. FIRMAS",
                          margin: [0, 15, 0, 0],
                          style: "boldcenter",
                          rowSpan: 3
                        },
                        {
                          stack: [
                            "FIRMA DEL DECLARANTE",
                            " "
                          ]
                        },
                        {
                          stack: [
                            {
                              columns: [
                                { text: "FIRMA DEL CONTADOR", margin: [0, 2, 2, 0], width: "auto", },
                                { ...formatCaja(" "), width: "auto" },
                                { text: "REVISOR FISCAL", margin: [10, 2, 2, 0], width: "auto" },
                                { ...formatCaja(" "), width: "auto" },
                              ]
                            },
                            "x"
                          ]
                        }
                      ],
                      [
                        "",
                        `NOMBRE `,
                        `NOMBRE `,
                      ],
                      [
                        "",
                        {
                          columns: [
                            { text: "CC", margin: [0, 2, 2, 0], width: "auto", },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "CE", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "TI", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "79546081", margin: [20, 2, 2, 0], width: "*" },
                          ]
                        },
                        {
                          columns: [
                            { text: "CC", margin: [0, 2, 2, 0], width: "auto", },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "CE", margin: [10, 2, 2, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "T.P.", margin: [20, 2, 2, 0], width: "*" },
                          ]
                        },
                      ],
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
                  style: "boldcenter",
                  fontSize: 8,
                  margin: [0, 20, 0, 20],
                  columns: [
                    {
                      stack: [
                        "No Referencia",
                        "23020123215"
                      ]
                    },
                    {
                      stack: [
                        "Formulario No",
                        "2023302010101970590"
                      ]
                    }
                  ]
                }
              ],
              [
                {
                  pageBreak: 'before',
                  margin: [-4, -2, -4, -2],
                  table: {
                    widths: ["20%", "*"],
                    body: [
                      [
                        {
                          image: data.logo,
                          width: 60,
                          height: 50,
                          alignment: "center"
                        },
                        {
                          text: "Este formulario es válido únicamente para presentación virtual",
                          fontSize: 13,
                          alignment: "center",
                          color: "grey",
                          margin: [0, 20, 0, 0]
                        }

                      ],
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
                    widths: ["10.4%", "*", "*", "*", "*", "*"],
                    body: [
                      [
                        {
                          text: "C.\nDISCRIMINACION\nDE\nACTIVIDADES\nGRAVADAS\n(OTRAS\nACTIVIDADES)",
                          fontSize: 6.4,
                          margin: [0, 50, 0, 0],
                          style: "boldcenter",
                          rowSpan: 14
                        },
                        { text: "ACTIVIDADES GRAVADAS", alignment: "center" },
                        { text: "CÓDIGO", alignment: "center" },
                        { text: "INGRESOS GRAVADOS", alignment: "center" },
                        { text: "TARIFA (Por mil)", alignment: "center" },
                        { text: "IMPUESTO", alignment: "center" },
                      ],
                      [
                        "",
                        { text: "Actividad 4", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 5", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 6", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 7", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 8", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 9", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 10", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 11", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 12", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 13", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 14", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "Actividad 15", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "center" },
                        { text: "", alignment: "right" },
                        { text: "", alignment: "right" },
                      ],
                      [
                        "",
                        { text: "TOTAL INGRESOS", bold: true, colSpan: 2 },
                        "",
                        { text: "", alignment: "center" },
                        { text: "17. TOTAL IMPUESTOS", style: "boldcenter" },
                        { text: "", alignment: "right" },
                      ],
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
            ]
          }
        },

      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};
const coingasco = (data) => {
  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    const formatCaja = (string, height) => {
      return {
        layout: {
          hLineColor: function () {
            return color;
          },
          vLineColor: function () {
            return color;
          },
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

    const condicional = (dato, datoPdf) => {
      return (dato == datoPdf) ? "X" : " "
    };

    const color = "#002378";

    const subrayado = (string) => {
      return {
        margin: [0, -4.5, 0, 0],
        table: {
          widths: "*",
          heights: 5,
          body: [
            [{ text: string, border: [false, false, false, true] }]
          ]
        },
        layout: {
          hLineColor: function () {
            return color;
          },
          vLineColor: function () {
            return color;
          },
        },
      }
    };

    var dd = {
      pageMargins: [margin.left, 20, margin.right, 20],
      styles: {
        boldblue: {
          color,
          bold: true
        },
        header: {
          fontSize: 25,
          bold: true,
          alignment: "center"
        },
        title: {
          fontSize: 14,
          color,
          bold: true,
        }
      },
      footer: function (currentPage, pageCount) {
        return [
          { text: "Página " + currentPage.toString() + ' de ' + pageCount, margin: [margin.left, 0, margin.right, 0], alignment: "center", fontSize: 7 },
        ]
      },
      content: [
        {
          columns: [
            {
              image: data.logo,
              width: 280,
              height: 90
            },
            // {
            //   margin: [10, 0, 0, 0],
            //   style: "boldblue",
            //   alignment: "center",
            //   stack: [
            //     { text: "COINGASCO", style: "header" },
            //     { fontSize: 8, text: `CONSTRUCCION E INGENIERÍA DE GAS COLOMBIA   S.A.S. - E.S.P.`, },
            //     { fontSize: 8, text: `Vigilado por la superintendencia de servicios público domiciliario - SSPD` },
            //     { fontSize: 7, text: `Vigilado por la comisión de regulación de energía y gas - CREG` }
            //   ]
            // },
            {
              alignment: "center",
              width: "30%",
              stack: [
                {
                  text: "SOLICITUD DE SERVICIO",
                  style: "boldblue",
                  alignment: "center",
                  fontSize: 10,
                },
                formatCaja(data.codigo),
                {
                  margin: [0, 5, 0, 0],
                  fontSize: 9,
                  columns: [
                    { text: "Gas Natural", color, margin: [0, 2, 0, 0] },
                    { ...formatCaja(" "), width: "10%" },
                    { text: "Gas Propano", color, margin: [3, 2, 0, 0] },
                    { ...formatCaja(" "), width: "10%" }
                  ]
                }
              ]
            },
          ]
        },
        {
          fontSize: 9,
          margin: [0, 3, 0, 0],
          stack: [
            {
              color,
              columns: [
                { text: "Fecha" },
                { text: "Ciudad / Municipio", margin: [5, 0, 0, 0] },
                { text: "Código NUI", margin: [5, 0, 0, 0] }
              ]
            },
            {
              columns: [
                formatCaja(data.fecha_solic),
                { ...formatCaja(data.ciudad.text.trim()), margin: [5, 0, 0, 0] },
                { ...formatCaja(" "), margin: [5, 0, 0, 0] },
              ]
            }
          ]
        },

        { text: "DATOS DEL CLIENTE", style: "boldblue", fontSize: 10, margin: [0, 3, 0, 0] },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
          },
          fontSize: 9,
          table: {
            widths: ["33%", "33%", "34%"],
            body: [
              [
                {
                  stack: [
                    { text: "Nombres", color },
                    data.nombres
                  ]
                },
                {
                  stack: [
                    { text: "1er. Apellido", color },
                    data.apellido1
                  ]
                },
                {
                  stack: [
                    { text: "2do. Apellido", color },
                    data.apellido2
                  ]
                }
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: ["20%", "35%", "23%", "12%", "10%"],
            body: [
              [
                {
                  stack: [
                    { text: "Fecha de Nacimiento", color },
                    " "
                  ]
                },
                {
                  stack: [
                    {
                      columns: [
                        { text: "Tipo de documento:", color, width: "auto" },
                        {
                          margin: [4, 0, 0, 0],
                          fontSize: 7,
                          columns: [
                            { text: "CC", color, margin: [0, 2, 3, 0], width: "auto" },
                            { ...formatCaja("X"), width: "auto" },
                            { text: "NIT", color, margin: [5, 2, 3, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" },
                            { text: "Otro", color, margin: [5, 2, 3, 0], width: "auto" },
                            { ...formatCaja(" "), width: "auto" }
                          ]
                        }
                      ]
                    },
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "No.", color },
                        parseFloat(data.idcontab)
                      ]
                    }
                  ]
                },
                {
                  stack: [
                    { text: "Tipo de Persona", color },
                    {
                      margin: [4, 0, 0, 0],
                      columns: [
                        { text: "Natural", color, margin: [0, 2, 3, 0], width: "auto" },
                        { ...formatCaja("X"), width: "10%" },
                        { text: "Jurídica", color, margin: [5, 2, 3, 0], width: "auto" },
                        { ...formatCaja(" "), width: "10%" },
                      ]
                    }
                  ]
                },
                {
                  stack: [
                    { text: "Apto. /Piso", color },
                    data.apto
                  ]
                },
                {
                  stack: [
                    { text: "Estrato", color },
                    data.estrato.text
                  ]
                },
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                {
                  stack: [
                    { text: "Dirección del Inmueble", color },
                    data.direccion
                  ]
                },
                {
                  stack: [
                    { text: "Barrio", color },
                    data.barrio.descrip_rep.trim()
                  ]
                },
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: ["33%", "33%", "34%"],
            body: [
              [
                {
                  stack: [
                    { text: "Matrícula Inmobiliaria", color },
                    data.nrocatastral ? data.nrocatastral : data.nropredial
                  ]
                },
                {
                  stack: [
                    { text: "Correo Electrónico", color },
                    data.correo
                  ]
                },
                {
                  stack: [
                    { text: "Teléfono Fijo/Celular", color },
                    parseFloat(data.telefono)
                  ]
                },
              ],
            ]
          }
        },

        { text: "DATOS DEL SERVICIO", style: "boldblue", fontSize: 10, margin: [0, 3, 0, 0] },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
          },
          fontSize: 9,
          table: {
            widths: ["75%", "25%"],
            body: [
              [
                {
                  margin: [0, 15, 0, 0],
                  columns: [
                    { text: "Actividad Económica:", color, width: "auto", margin: [0, 0, 3, 0], fontSize: 10, },
                    subrayado(" ")
                  ]
                },
                {
                  stack: [
                    {
                      columns: [
                        { text: "Comercial", color, margin: [0, 2, 0, 0], width: "88%" },
                        { ...formatCaja(condicional(data.uso.value, 2)), width: "12%" }
                      ]
                    },
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { text: "Residencial", color, margin: [0, 2, 0, 0], width: "88%" },
                        { ...formatCaja(condicional(data.uso.value, 1)), width: "12%" }
                      ]
                    }
                  ]
                }
              ],
            ]
          }
        },

        { text: "LIQUIDACION DEL DERECHO DE CONEXION", style: "boldblue", fontSize: 10, margin: [0, 3, 0, 0], alignment: "center" },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
          },
          fontSize: 9,
          table: {
            widths: ["*", "30%", "*", "*"],
            body: [
              [
                {
                  stack: [
                    { text: "Valor Derechos de Conexión", color },
                    `$${data.vlr_conex}`
                  ]
                },
                {
                  stack: [
                    { text: "Forma de Pago", color },
                    {
                      margin: [4, 0, 0, 0],
                      columns: [
                        { text: "Contado", color, margin: [0, 2, 3, 0], width: "auto" },
                        { ...formatCaja(" "), width: "10%" },
                        { text: "Crédito", color, margin: [5, 2, 3, 0], width: "auto" },
                        { ...formatCaja(" "), width: "10%" },
                      ]
                    }
                  ]
                },
                {
                  stack: [
                    { text: "Cuota Inicial", color },
                    `$ `
                  ]
                },
                {
                  stack: [
                    { text: "N° Cuotas", color },
                    " "
                  ]
                },
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: ["33%", "33%", "34%"],
            body: [
              [
                {
                  stack: [
                    { text: "Valor Cuota Mensual", color },
                    `$ `
                  ]
                },
                {
                  stack: [
                    { text: "Saldo a Financiar", color },
                    `$${data.saldo_conex}`
                  ]
                },
                {
                  stack: [
                    { text: "Total a Pagar", color, alignment: "center" },
                    `$ `
                  ]
                },
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: "*",
            body: [
              [
                {
                  columns: [
                    { text: "Observaciones:", color, margin: [0, 0, 4, 0], width: "auto" },
                    subrayado(" ")
                  ]
                }
              ],
            ]
          }
        },

        { text: "LIQUIDACION INSTALACION INTERNA", style: "boldblue", fontSize: 10, margin: [0, 3, 0, 0], alignment: "center" },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
          },
          fontSize: 9,
          table: {
            widths: ["*", "30%", "*", "*"],
            body: [
              [
                {
                  stack: [
                    { text: "Valor de la Instalación Interna", color },
                    `$${data.vlr_inst}`
                  ]
                },
                {
                  stack: [
                    { text: "Forma de Pago", color },
                    {
                      margin: [4, 0, 0, 0],
                      columns: [
                        { text: "Contado", color, margin: [0, 2, 3, 0], width: "auto" },
                        { ...formatCaja(" "), width: "10%" },
                        { text: "Crédito", color, margin: [5, 2, 3, 0], width: "auto" },
                        { ...formatCaja(" "), width: "10%" },
                      ]
                    }
                  ]
                },
                {
                  stack: [
                    { text: "Cuota Inicial", color },
                    `$ `
                  ]
                },
                {
                  stack: [
                    { text: "N° Cuotas", color },
                    " "
                  ]
                },
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: ["33%", "33%", "34%"],
            body: [
              [
                {
                  stack: [
                    { text: "Valor Cuota Mensual", color },
                    `$ `
                  ]
                },
                {
                  stack: [
                    { text: "Saldo a Financiar", color },
                    `$${data.saldo_inst}`
                  ]
                },
                {
                  stack: [
                    { text: "Total a Pagar", color, alignment: "center" },
                    `$ `
                  ]
                },
              ],
            ]
          }
        },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            },
          },
          fontSize: 9,
          table: {
            widths: "*",
            body: [
              [
                {
                  columns: [
                    { text: "Observaciones:", color, margin: [0, 0, 4, 0], width: "auto" },
                    subrayado(" ")
                  ]
                }
              ],
            ]
          }
        },


        { text: "ATENCION", style: "boldblue", fontSize: 10, margin: [0, 3, 0, 0], alignment: "center" },
        {
          layout: {
            hLineColor: function () {
              return color;
            },
            vLineColor: function () {
              return color;
            },
          },
          fontSize: 8,
          color,
          table: {
            widths: "*",
            body: [
              [
                {
                  ul: [
                    'Como Cliente fui informado que la instalación cubre de O hasta 15 mts de Pealpe l la Conexión de un (1) Gasodomestico',
                    'La firma del presente documento lo habilita como cliente del servicio de Gas Combustible a partir de la puesta en servicio de la instalación entrando en el proceso de la facturacion y se cobrara el cargo fijo correspondiente, este o no haciendo uso del servicio (Art, 90 Numeral 25, Ley 142 de 1994)',
                    'El valor de la matricula estan sujetos a las actualizaciones tarifarias de la empresa (Art, 108-.2 de la Resolucion CREG 057 de 1996)',
                    'La relacion contratual entre el cliente y la empresa se a por el "Contrato de Condiciones Uniformes” para la prestacion del servicio Publico de Gas Natural. De acuerdo con el numeral 2.25 del Codigo de Distribucion de Gas Combustible para Redes (Res. CREG 067 de 1996)',
                    'Cuando el cliente realice modificaciones en sus instalaciones y aparatos de gas debera notificar dichos cambios a la empresa distribuidora',
                    'Autorizo a COINGASCO CONSTRUCCIÓN E INGENIERÍA DE GAS COLOMBIA S.A.S, E.S.P. reportar a las centrales riesgo la mora correspondiente por NO pago de los servicios prestados y a realizar actualizaciones de datos basicos sin previa consulta, siempre y cuando provengan de fuentes fidedignas .',
                    'SEÑOR USUARIO: POR NINGÚN MOTIVO ENTREGUE DINERO A FUNCIONARIOS. SOLO SE RECIBEN PAGOS EN BANCOS O CAJAS DE LAS OFICINAS DE LA EMPRESA',
                    'Por medio del presente escrito manifiesto que suscribo CONTRATO DE CONDICIONES UNIFORMES con la Empresa COINGASCO CONSTRUCCIÓN E INGENIERÍA DE GAS COLOMBIA S.A.S. E.S.P. Y como consecuencia de ello me acojo a todas las disposiciones contenidas en él. Así como también he recibido copía del CONTRATO DE CONDICIONES UNIFORMES. En constancia se firma:',
                    'No están incluidas obras civiles adicionales necesarias para la construcción de la instalación*'
                  ]
                },
              ],
            ]
          }
        },

        {
          fontSize: 10,
          margin: [0, 10, 0, 0],
          columns: [
            {
              margin: [0, 60, 0, 0],
              columns: [
                { text: "Firma del Suscriptor: ", style: "boldblue", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" ")
              ]
            },
            {
              layout: {
                hLineColor: function () {
                  return color;
                },
                vLineColor: function () {
                  return color;
                },
              },
              fontSize: 9,
              margin: [20, 0, 0, 0],
              table: {
                widths: [70],
                heights: 70,
                body: [
                  [
                    {
                      stack: [
                        { text: "HUELLA", color, alignment: "center" },
                        " "
                      ]
                    },
                  ]
                ]
              }

            }
          ]
        }
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};
const comprobante_tes = (data) => {
  return new Promise((res) => {
    let margin = {
      left: 20,
      right: 20
    };
    let watermark =
      data.estado_rep === "0"
        ? ""
        : {
          text: "Anulado",
          angle: 60,
          color: "black",
          opacity: 0.2,
          fontSize: 90,
        };


    let width = 600;

    var dd = {
      watermark,
      // pageMargins: [margin.left, 120, margin.right, 30],
      pageMargins: [margin.left, 140, margin.right, 60],
      styles: {
        header: {
          fontSize: 11,
          bold: true
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
                  data.desripEmpresa,
                  `NIT. ${parseFloat(data.idEmpresa)}`,
                  `DIR. ${data.direccionEmpresa}`,
                  `TEL. ${data.telefonoEmpresa}`,
                  `${data.ciudadEmpresa} - ${data.deparEmpresa}`
                ]
              },

              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "COMPROBANTE DE EGRESO SALUD" },
                  { text: `Número:  ${parseFloat(data.nro_rep)}`, margin: [0, 10, 0, 0] },
                  { text: `Fecha: ${data.fecha_rep}`, margin: [0, 10, 0, 0] }
                ]
              }
            ]
          },
        ]
      },
      // footer: function (currentPage, pageCount) {
      //   return {
      //     margin: [margin.left, 0, margin.right, 0],
      //     bold: true,
      //     text: "Plataforma: Titan Soluciones S.A.S."
      //   };
      // },
      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: width - (margin.left * 3),
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
        },
        {
          margin: [0, 10, 0, 10],
          columns: [
            { text: "RUT: ", bold: true, width: "10%" },
            `${parseFloat(data.idrut_rep)} ${data.beneficiario_rep}`
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: width - (margin.left * 3),
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
            },
          ],
        },

        {
          margin: [0, 35, 0, 0],
          layout: 'lightHorizontalLines',
          fontSize: "11",
          table: {
            widths: ["25%", "25%", "50%"],
            headerRows: 1,
            body: [
              [
                { text: "Concepto", bold: true, fontSize: 12 },
                { text: "Valor", bold: true, fontSize: 12 },
                { text: "Detalle", bold: true, fontSize: 12 },
              ],
              [
                data.concepto_rep.trim(),
                data.valor_rep.trim(),
                data.detalle_rep.trim(),
              ]
            ]
          }
        },

        {
          margin: [0, 50, 0, 0],
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: width - (margin.left * 3),
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "gray",
            },
          ],
        },

        {
          fontSize: 8,
          margin: [0, 10, 0, 0],
          columns: [
            {
              bold: true,
              width: "33%",
              stack: [
                `Generó: ${data.elaboro_rep}`,
                data.fecha_rep
              ]
            },
            {
              width: "33%",
              text: [
                { text: "Revisó: ", bold: true },
                "   ",
              ]
            },
            {
              bold: true,
              width: "33%",
              stack: [
                `Anuló: ${data.anula_rep}`,
                data.fecha_anula_rep
              ]
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 620 - (margin.left * 3),
              y1: 0,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "gray",
            },
          ],
        },


      ],

    }

    pdfMake.createPdf(dd).open();
    res();
  });
};

const solicitudDescuento = (data) => {
  return new Promise(res => {
    let margin = {
      left: 40,
      right: 40
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
      pageMargins: [margin.left, 150, margin.right, 60],
      styles: {
        smallHeader: {
          fontSize: 7,
          alignment: "center"
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center"
        },
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 11,
          columns: [
            "Aprobado por Gerente.",
            "Página " + currentPage.toString() + ' de ' + pageCount,
          ]
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {
                width: "19%",
                stack: [
                  {
                    image: data.logo,
                    width: 85,
                    height: 60
                  },
                  { text: `${data.dpto_emp} - ${data.ciudad_emp}`, style: "smallHeader" },
                  { text: `Nit: ${data.id_emp}`, style: "smallHeader" }
                ]
              },
              {
                alignment: "right",
                stack: [
                  { text: "\nSOLICITUD DE DESCUENTOS", style: "header", alignment: "right" },
                  { text: `\nFO-GA-03         ${data.fecha_rep}`, }
                ]
              }
            ]
          },
        ]
      },
      content: [
        {
          fontSize: 12.6,
          stack: [
            {
              columns: [
                { text: "Ciudad y Fecha, ", width: "auto" },
                { ...subrayado(` ${data.fecha_rep}`), width: "50%" }
              ]
            },
            "\n\nSeñores",
            { text: "Cooperativa de Trabajadores y Pensionados de la Electrificadora del Meta", bold: true },
            { text: "COTREM", bold: true },
            "Ciudad",
            {
              margin: [0, 60, 0, 0],
              columns: [
                { text: "Comedidamente autorizo descontar de mi Sueldo", width: "auto" },
                { ...subrayado(" "), width: "5%", margin: [0, -4.5, 5, 0] },
                { text: "Mesada", width: "auto" },
                { ...subrayado(" "), width: "5%", margin: [0, -4.5, 5, 0] },
                "con destino a",
              ]
            },
            {
              margin: [0, 2, 0, 0],
              columns: [
                { text: "COTREM, la suma de $", width: "auto" },
                { ...subrayado(" "), width: "24%", margin: [0, -4.5, 5, 0] },
                { text: ", por concepto de:", width: "auto" },
                { ...subrayado(" "), margin: [0, -4.5, 1, 0] },
                { text: ",", width: "auto" }
              ]
            },
            {
              margin: [0, 2, 0, 0],
              columns: [
                { text: "Quincenales $", width: "auto" },
                { ...subrayado(" "), width: "30%", margin: [0, -4.5, 5, 0] },
                { text: "o Mensuales $", width: "auto" },
                { ...subrayado(" "), margin: [0, -4.5, 1, 0] },
                { text: ", hasta", width: "auto" }
              ]
            },
            { text: "nueva orden.", margin: [0, 3, 0, 0] },
            {
              margin: [0, 40, 0, 0],
              columns: [
                { text: "Nombres y Apellidos ", width: "auto" },
                subrayado(data.solicitante_rep.trim() || " "),
              ]
            },
            { text: "Cordialmente, ", margin: [0, 38, 0, 0] },
            {
              margin: [0, 50, 0, 0],
              columns: [
                { text: "Firma:", width: "auto" },
                { ...subrayado(" "), width: "50%" }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "C. C. N°", width: "auto" },
                { ...subrayado(data.rut_rep.trim()), width: "50%" }
              ]
            },

          ]
        },

      ]

    }
    pdfMake.createPdf(dd).open();
    res();
  })
};



const vincAsociados = (data) => {
  return new Promise(res => {
    const condicional = (dato, datoPdf) => {
      return (dato == datoPdf) ? "X" : " "
    };

    var margin = {
      left: 20,
      right: 20,
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
      pageMargins: [margin.left, 40, margin.right, 40],
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
      images: {
        logo: data.logo
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 0],
          fontSize: 10,
          columns: [
            "Aprobado por Gerencia.",
            "Página " + currentPage.toString() + ' de ' + pageCount,
            {
              margin: [0, -32, 0, 0],
              image: 'logo',
              width: 42,
              height: 42
            },
          ]
        }
      },
      content: [
        {
          fontSize: 9,
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
                          image: 'logo',
                          width: 60,
                          height: 50
                        },
                        { text: `${data.dptoEmpresa} ${data.ciudadEmpresa}`, style: "smallHeader" },
                        { text: `Nit: ${data.idEmpresa}`, style: "smallHeader" }
                      ]
                    },
                    {
                      alignment: "right",
                      stack: [
                        { text: "\n\nVINCULACION DE ASOCIADO", style: "header", alignment: "right" },
                        { text: `\nFO-GA-02         ${data.fechaing_rut}`, }
                      ]
                    }
                  ]
                },
              ],
              [
                {
                  columns: [
                    { text: "Persona natural", width: "15%", margin: [0, 2, 0, 0], bold: true },
                    { width: "3.5%", ...formatCaja("x") },
                    { text: "Persona jurídica", width: "34%", margin: [80, 2, 0, 0], bold: true },
                    { width: "3.5%", ...formatCaja(" ") }
                  ]
                }
              ],
              [
                { text: "A. PERSONAS NATURALES", style: "header" }
              ],
              [
                { text: "INFORMACION PERSONAL", style: "header" }
              ],
              [
                {
                  margin: [0, 0, 0, 5],
                  columns: [
                    {
                      width: "24%",
                      stack: [
                        "Nombres",
                        { text: "Apellidos", margin: [0, 3, 0, 0] },
                        { text: "N° Identificación", margin: [0, 6, 0, 0] },
                        { text: "Estado Civil", margin: [0, 14, 0, 0] },
                        {
                          margin: [0, 15, 0, 0],
                          columns: [
                            { text: "Sexo", margin: [0, 3, 0, 0] },
                            {
                              table: {
                                widths: "34%",
                                body: [
                                  [`M:${condicional("1", data.genero_rut)}`, `F:${condicional("2", data.genero_rut)}`]
                                ]
                              }
                            }
                          ]
                        },
                        { text: "Fecha de Nacimiento", margin: [0, 6, 0, 0] },
                        { text: "Dirección domicilio", margin: [0, 6, 0, 0] },
                        { text: "Municipio", margin: [0, 6, 0, 0] },
                        { text: "Teléfono (s)", margin: [0, 6, 0, 0] },
                        { text: "Nivel Escolaridad", margin: [0, 14, 0, 0] },
                        { text: "Empresa donde labora", margin: [0, 15, 0, 0] },
                        { text: "Dirección trabajo", margin: [0, 5, 0, 0] },
                        { text: "Teléfono (s)", margin: [0, 4, 0, 0] },
                        { text: "Ocupación, oficio o profesión", margin: [0, 4, 0, 0] },
                        { text: "Administra recursos públicos", margin: [0, 10, 0, 0] },
                        { text: "Actividad Económica", margin: [0, 6, 0, 0] },
                        { text: "Otros:", margin: [0, 10, 0, 0] },
                        { text: "Cuenta Bancaria No.", margin: [0, 18, 0, 0] },
                      ]
                    },
                    {
                      stack: [
                        subrayado(data.nombres_rut),
                        { ...subrayado(`${data.primerApellido_rut.trim()} ${data.segundoApellido_rut.trim()}`), margin: [0, 0.3, 0, 0] },
                        {
                          margin: [0, 2, 0, 0],
                          columns: [
                            { ...subrayado(parseFloat(data.identificacion_rut)), width: "34%" },
                            { text: "DE", width: "auto", margin: [4, 0, 4, 0] },
                            { ...subrayado(" "), width: "34%" },
                            {
                              margin: [5, 0, 0, 0],
                              fontSize: 7,
                              width: "45%",
                              table: {
                                widths: "12%",
                                body: [
                                  [`CC: ${condicional("13", data.tipoid_rut)}`,
                                    `TI: `,
                                    `CE: `,
                                    `PAS: `,
                                  ]
                                ]
                              }
                            },
                          ]
                        },
                        {
                          stack: [
                            {
                              columns: [
                                { text: "Soltero (a)", width: "13%", margin: [0, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("1", data.estcivil_rut)) },
                                { text: "Unión Libre", width: "25%", margin: [50, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("3", data.estcivil_rut)) },
                                { text: "Divorciado (a)", width: "23%", margin: [30, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("5", data.estcivil_rut)) },
                              ]
                            },
                            {
                              columns: [
                                { text: "Casado (a)", width: "13%", margin: [0, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("2", data.estcivil_rut)) },
                                { text: "Separado (a)", width: "25%", margin: [50, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("4", data.estcivil_rut)) },
                                { text: "Viudo (a)", width: "23%", margin: [30, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("6", data.estcivil_rut)) },
                              ]
                            }
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            { text: "N. de hijos", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja(" ") },
                            { text: "PERSONAS A CARGO", width: "35%", margin: [46, 2, 0, 0] },
                            {
                              table: {
                                widths: "42%",
                                body: [
                                  [`SI:${condicional(true, data.perscargo_rut)}`, `NO:${condicional(false, data.perscargo_rut)}`]
                                ]
                              }
                            },
                            { text: "¿Cuántas?", width: "27%", margin: [26, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja(data.perscargo_rut) },
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            { ...formatCaja(data.fechanac_rut), width: "auto" },
                            { text: "Lugar de Nacimiento", margin: [3, 0, 0, 0] },
                            { text: "Mpio", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.ciudadnac_rut),
                            { text: "Dpto", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            subrayado(data.direccion_rut),
                            { text: "Barrio", margin: [3, 0, 5, 0], width: "auto" },
                            { ...subrayado(data.barrio_rut), width: "40%" },
                            { text: "Estrato", margin: [3, 0, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            subrayado(data.ciudad_rut),
                            { text: "Departamento", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            subrayado(data.telefono_rut),
                            { text: "E-mail", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.correo_rut),
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          stack: [
                            {
                              columns: [
                                { text: "Primaria", width: "13%", margin: [0, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("1", data.escolaridad_rut)) },
                                { text: "Técnico", width: "25%", margin: [50, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("3", data.escolaridad_rut)) },
                                { text: "Profesional", width: "23%", margin: [30, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("5", data.escolaridad_rut)) },
                              ]
                            },
                            {
                              columns: [
                                { text: "Bachillerato", width: "13%", margin: [0, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("2", data.escolaridad_rut)) },
                                { text: "Tecnológico", width: "25%", margin: [50, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("4", data.escolaridad_rut)) },
                                { text: "Especialización", width: "23%", margin: [30, 2, 0, 0] },
                                { width: "3.5%", ...formatCaja(condicional("6", data.escolaridad_rut)) },
                              ]
                            }
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            subrayado(data.empresa_rut),
                            { text: "Cargo", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.cargo_rut),
                            { text: "Fecha Ingreso", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.fechaing_rut),
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            subrayado(data.dirlabora_rut),
                            { text: "Mpio", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.ciudadlab_rut),
                            { text: "Dpto", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 3, 0, 3],
                          columns: [
                            subrayado(data.telelabora_rut),
                            { text: "N° de Fax", margin: [5, 0, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        subrayado(data.ocupacion_rut),
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            {
                              width: 55,
                              table: {
                                body: [
                                  ["NO:", "SI:"]
                                ]
                              }
                            },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 4, 0, 3],
                          columns: [
                            subrayado(data.actividad_rut),
                            { text: "CIIU", margin: [5, 0, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          stack: [
                            {
                              columns: [
                                { text: "E.P.S", margin: [0, 0, 5, 0], width: "auto" },
                                subrayado(data.eps_rut),
                                { text: "A.F.P", margin: [5, 0, 5, 0], width: "auto" },
                                subrayado(" "),
                              ]
                            },
                            {
                              margin: [0, 2, 0, 0],
                              columns: [
                                { text: "Fondo de Cesantías", margin: [0, 0, 5, 0], width: "auto" },
                                subrayado(data.cesantias_rut),
                                { text: "Pensión", margin: [5, 0, 5, 0], width: "auto" },
                                subrayado(data.pension_rut),
                              ]
                            }
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            subrayado(data.nrocta_rut),
                            { text: "Ahorro", width: "auto", margin: [5, 2, 5, 0] },
                            { width: "3.5%", ...formatCaja(condicional("ahorro", data.tipocta_rut)) },
                            { text: "Corriente", width: "auto", margin: [5, 2, 5, 0] },
                            { width: "3.5%", ...formatCaja(condicional("corriente", data.tipocta_rut)) },
                            { text: "Banco", width: "auto", margin: [5, 2, 5, 0] },
                            subrayado(data.banco_rut),
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              [
                { text: "B. PERSONAS JURIDICAS", style: "header" }
              ],
              [
                { text: "INFORMACION EMPRESA", style: "header" }
              ],
              [
                {
                  columns: [
                    {
                      width: "24%",
                      stack: [
                        "Razón social",
                        { text: "Nit", margin: [0, 3, 0, 0] },
                        { text: "Dirección domicilio", margin: [0, 4, 0, 0] },
                        { text: "Teléfono (s)", margin: [0, 5, 0, 0] },
                        { text: "Nombre completo Representante Legal", margin: [0, 4, 0, 0], alignment: "center" },
                        { text: "No. De identificación", margin: [0, 5, 0, 0] },
                        { text: "Tipo de empresa", margin: [0, 5, 0, 0] },
                        { text: "Actividad Económica", margin: [0, 5, 0, 0] },
                      ]
                    },
                    {
                      stack: [
                        subrayado(" "),
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            subrayado("8600"),
                            { text: "Doc. Legal", margin: [5, 0, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 3, 0, 3],
                          columns: [
                            subrayado("Cr 38 n24"),
                            { text: "Mpio", margin: [3, 0, 5, 0], width: "auto" },
                            { ...subrayado("Rernancio"), width: "40%" },
                            { text: "Dpto", margin: [3, 0, 5, 0], width: "auto" },
                            subrayado("3"),
                          ]
                        },
                        subrayado(" d"),
                        { ...subrayado(" "), margin: [0, -1, 0, 4] },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { ...subrayado("x"), width: "34%" },
                            { text: "DE", width: "auto", margin: [4, 0, 4, 0] },
                            { ...subrayado("x"), width: "34%" },
                            {
                              margin: [5, 0, 0, 0],
                              fontSize: 7,
                              width: "45%",
                              table: {
                                widths: "11%",
                                body: [
                                  [`CC: `,
                                    `TI: `,
                                    `CE: `,
                                    `PAS: `,
                                  ]
                                ]
                              }
                            },
                          ]
                        },
                        {
                          columns: [
                            { text: "Privada", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja("x") },
                            { text: "Pública", width: "25%", margin: [50, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja(" ") },
                            { text: "Mixta", width: "23%", margin: [30, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja(" ") },
                          ]
                        },
                        {
                          margin: [0, 2, 0, 3],
                          columns: [
                            subrayado("Empleada"),
                            { text: "CIIU", margin: [5, 0, 5, 0], width: "auto" },
                            { ...subrayado(" ") },
                          ]
                        },
                      ]
                    }
                  ]
                }
              ],
              [
                { text: "C. INFORMACION FINANCIERA", style: "header", pageBreak: 'before' }
              ],
              [
                {
                  margin: [0, 10, 0, 5],
                  columns: [
                    {
                      width: "50%",
                      stack: [
                        { text: "Ingresos mensuales derivados de su actividad principal", margin: [0, 2, 0, 0] },
                        { text: "Otros ingresos (especificar)", margin: [0, 6, 0, 0] },
                        { text: "Egresos mensuales", margin: [0, 6, 0, 0] },
                        { text: "Ingresos (P. Juridica)", margin: [0, 10, 0, 0] },
                        { text: "Egresos (P. Juridica)", margin: [0, 6, 0, 0] },
                        { text: "Total activos", margin: [0, 10, 0, 0] },
                        { text: "Total pasivos", margin: [0, 6, 0, 0] },
                      ]
                    },
                    {
                      stack: [
                        {
                          columns: [
                            { text: "De:   1 a 3 SMMLV", width: "43%", margin: [0, 3, 5, 0] },
                            { width: "6%", ...formatCaja(condicional("1", data.rangoing_rut)) },
                            { text: "De:   4 a 6 SMMLV", width: "43%", margin: [30, 3, 5, 0] },
                            { width: "6%", ...formatCaja(condicional("2", data.rangoing_rut)) },
                          ]
                        },
                        {
                          columns: [
                            { text: "De:   1 a 3 SMMLV", width: "43%", margin: [0, 3, 5, 0] },
                            { width: "6%", ...formatCaja(condicional("1", data.rangootro_rut)) },
                            { text: "De:   4 a 6 SMMLV", width: "43%", margin: [30, 3, 5, 0] },
                            { width: "6%", ...formatCaja(condicional("2", data.rangootro_rut)) },
                          ]
                        },
                        {
                          columns: [
                            { text: "De:   1 a 3 SMMLV", width: "43%", margin: [0, 3, 5, 0] },
                            { width: "6%", ...formatCaja(" ") },
                            { text: "De:   4 a 6 SMMLV", width: "43%", margin: [30, 3, 5, 0] },
                            { width: "6%", ...formatCaja(" ") },
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { text: "$", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "40%", ...formatCaja(data.toting_rut) },
                          ]
                        },
                        {
                          columns: [
                            { text: "$", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "40%", ...formatCaja(data.totegr_rut) },
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { text: "$", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "40%", ...formatCaja(data.totact_rut) },
                          ]
                        },
                        {
                          columns: [
                            { text: "$", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "40%", ...formatCaja(data.totpas_rut) },
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              [
                { text: "OPERACIONES EN MONEDA EXTRANJERA", style: "header" }
              ],
              [
                {
                  margin: [0, 5, 0, 10],
                  columns: [
                    {
                      width: "24%",
                      stack: [
                        "Realiza operaciones en\n moneda extranjera",
                        { text: "Posee cuentas en\n moneda extranjera", margin: [0, 6, 0, 0] }
                      ]
                    },
                    {
                      stack: [
                        {
                          columns: [
                            { text: "No", width: "13%", margin: [0, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja(condicional("2", data.opext_rut)) },
                            { text: "Si", width: "25%", margin: [50, 2, 0, 0] },
                            { width: "3.5%", ...formatCaja(condicional("1", data.opext_rut)) },
                            { text: "¿Cuáles?", width: "auto", margin: [10, 1, 4, 0] },
                            subrayado(data.descripopext_rut),
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          stack: [
                            {
                              columns: [
                                { text: "Si", width: "auto", margin: [0, 2, 5, 0] },
                                { width: "3.5%", ...formatCaja(condicional("1", data.ctaext_rut)) },
                                { text: "No", width: "auto", margin: [30, 2, 5, 0] },
                                { width: "3.5%", ...formatCaja(condicional("1", data.ctaext_rut)) },
                                { text: "Banco", width: "auto", margin: [45, 2, 5, 0] },
                                { width: "25%", ...formatCaja(data.bancoext_rut) },
                                { text: "Moneda", width: "auto", margin: [6, 2, 5, 0] },
                                { width: "25%", ...formatCaja(data.monedaext_rut) },
                              ]
                            },
                            {
                              margin: [0, 1, 0, 0],
                              columns: [
                                { text: "N° cuenta", width: "auto", margin: [0, 2, 5, 0] },
                                { ...subrayado(" "), width: "20%" },
                                { text: "Ciudad", width: "auto", margin: [4, 2, 5, 0] },
                                { width: "25%", ...formatCaja(data.ciudadext_rut) },
                                { text: "País", width: "auto", margin: [6, 2, 5, 0] },
                                { width: "25%", ...formatCaja(data.paisext_rut) },
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              [
                { text: "D. INFORMACION ADICIONAL - REFERENCIAS", style: "header" },
              ],
              [
                {
                  columns: [
                    {
                      width: "24%",
                      stack: [
                        "Nombres y Apellidos",
                        { text: "Tipo de identificación", margin: [0, 6, 0, 0] },
                        { text: "Fecha de Nacimiento", margin: [0, 8, 0, 0] },
                        { text: "Nombres y Apellidos", margin: [0, 8, 0, 0] },
                        { text: "Tipo de identificación", margin: [0, 6, 0, 0] },
                        { text: "Fecha de Nacimiento", margin: [0, 8, 0, 0] },
                      ]
                    },
                    {
                      stack: [
                        {
                          columns: [
                            subrayado(data.nombreref1_rut),
                            { text: "No. Tel. ", margin: [5, 0, 5, 0], width: "auto" },
                            { ...subrayado(data.teleref1_rut) },
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            {
                              fontSize: 7,
                              width: "45%",
                              table: {
                                widths: "13%",
                                body: [
                                  [`C.C.: `,
                                    `C.E.: `,
                                    `T.I.: `,
                                    `R.C.: `,
                                  ]
                                ]
                              }
                            },
                            { text: "No. ", margin: [0, 0, 5, 0], width: "auto" },
                            { ...subrayado(data.idref1_rut) },
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { ...formatCaja(data.fecharef1_rut), width: "auto" },
                            { text: "Parentesco", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.parentref1_rut),
                            { text: "Sexo", margin: [3, 3, 5, 0], width: "auto" },
                            { ...formatCaja(data.sexoref1_rut), width: "3.5%" },
                            { text: "Dependiente", margin: [3, 3, 5, 0], width: "auto" },
                            {
                              table: {

                                body: [
                                  ["S: ", "N: "]
                                ]
                              }
                            }
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            subrayado(data.nombreref2_rut),
                            { text: "No. Tel. ", margin: [5, 0, 5, 0], width: "auto" },
                            { ...subrayado(data.teleref2_rut) },
                          ]
                        },
                        {
                          margin: [0, 3, 0, 0],
                          columns: [
                            {
                              fontSize: 7,
                              width: "45%",
                              table: {
                                widths: "13%",
                                body: [
                                  [`C.C.: `,
                                    `C.E.: `,
                                    `T.I.: `,
                                    `R.C.: `,
                                  ]
                                ]
                              }
                            },
                            { text: "No. ", margin: [0, 0, 5, 0], width: "auto" },
                            { ...subrayado(data.idref2_rut) },
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { ...formatCaja(data.fecharef2_rut), width: "auto" },
                            { text: "Parentesco", margin: [3, 0, 0, 0], width: "auto" },
                            subrayado(data.parentref2_rut),
                            { text: "Sexo", margin: [3, 3, 5, 0], width: "auto" },
                            { ...formatCaja(data.sexoref2_rut), width: "3.5%" },
                            { text: "Dependiente", margin: [3, 3, 5, 0], width: "auto" },
                            {
                              table: {

                                body: [
                                  ["S: ", "N: "]
                                ]
                              }
                            }
                          ]
                        },
                      ]
                    }
                  ]
                },

              ],
              [
                { text: "Para mayor información y conocimiento de los Estatutos, servicios, beneficios, derechos y deberes como asociado lo invitamos a visitar y consultar la página WEB www.cotrem.com", style: "header" },
              ],
              [
                {
                  stack: [
                    {
                      ul: [
                        'Certifico que la información suministrada es verídica y autorizo la cooperativa para que la verifique.',
                        'Estoy informado de mi obligación de actualizar la información registrada cuando se presenten cambios.',
                        'Autorizo la cooperativa para que consulte y reporte información a las centrales de riesgo.',
                        'Declaro que mis ingresos y bienes provienen de actividades lícitas.'
                      ]
                    },
                    {
                      columns: [
                        {
                          width: "40%",
                          margin: [0, 34, 0, 0],
                          stack: [
                            subrayado(" "),
                            { text: "FIRMA", alignment: "center", bold: true }
                          ]
                        },
                        {
                          width: "auto",
                          margin: [74, 0, 0, 0],
                          stack: [
                            {

                              table: {
                                widths: [60],
                                heights: 50,
                                body: [
                                  [" "]
                                ]
                              }
                            },
                            { text: "HUELLA", alignment: "center" }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              [
                { text: "E. ESPACIO PARA USO DE LA COOPERATIVA", style: "header" },
              ],
              [
                `OBSERVACIONES: `
              ],
              [
                `FECHA ENTREVISTA: `
              ],
              [
                `NOMBRE FUNCIONARIO QUE REALIZO LA ENTREVISTA: `
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
const cierreCajaPto = (data, fecha) => {
  return new Promise((res) => {
    let concepEgr = [];
    let vlrEgr = [];
    data.egresos.forEach(eg => {
      concepEgr.push(eg.egr_concep_rep);
      vlrEgr.push(eg.egr_valor_rep);
    });


    let margin = {
      left: 20,
      right: 20,
    };

    const subheader = (str) => {
      return {
        style: "subheader",
        margin: [0, 10, 0, 0],
        table: {
          widths: ["*"],
          body: [
            [{ text: str, alignment: "center" }]
          ]
        },
        layout: 'noBorders'
      }
    };

    const total = (strTotal, vlrTotal) => {
      return {
        style: "subheader",
        margin: [0, 2, 0, 0],
        table: {
          widths: ["70%", "30%"],
          body: [
            [
              { text: strTotal, margin: [3, 0, 0, 0] },
              { text: vlrTotal, alignment: "right" }
            ]
          ]
        },
        layout: "noBorders"
      }
    };

    var dd = {
      pageSize: {
        width: 200,
        height: "auto",
      },
      pageMargins: [margin.left, 145, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [0, 20, 0, 2],
            image: 'logo',
            fit: [80, 80],
            alignment: "center",
          },
          {
            fontSize: 6,
            alignment: "center",
            stack: [
              `Nit. ${data.idEmpresa}`,
              data.direccionEmpresa,
              `${data.ciudadEmpresa} - ${data.dptoEmpresa}`,
              `Teléfono: ${data.telfEmpresa}`,
              `Ruta1:  322.248.9847`,
              `Ruta2:  314.605.1977`
            ]
          }
        ]
      },
      content: [
        { text: "CIERRE DE CAJA", alignment: "center" },
        {
          fontSize: 6.5,
          margin: [10, 4, 0, 0],
          columns: [
            {
              stack: [
                "Fecha:",
                "Responsable:",
                "\nPunto:"
              ]
            },
            {
              stack: [
                { text: data.fecha_rep, alignment: "left" },
                { text: data.resp_rep, alignment: "left", fontSize: 6 },
                { text: data.agencia_rep, alignment: "left" }
              ]
            }
          ]
        },
        {
          margin: [0, 3, 0, 0],
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 180 - margin.right,
              y1: 0,
              y2: 0,
              lineWidth: 1,
            },
          ],
        },

        subheader("VENTAS"),
        {
          fontSize: 6.5,
          margin: [10, 2, 0, 0],
          columns: [
            {
              stack: [
                "Efectivo",
                "Transferencia",
                "Crédito"
              ]
            },
            {
              alignment: "right",
              stack: [
                data.vta_efectivo_rep.trim(),
                data.vta_transf_rep.trim(),
                data.vta_credito_rep.trim()
              ]
            }
          ]
        },
        total("TOTAL VENTAS", data.tventas_rep + ".00"),


        subheader("RECAUDOS"),
        {
          fontSize: 6.5,
          margin: [10, 2, 0, 0],
          columns: [
            {
              stack: [
                "Efectivo",
                "Transferencia",
              ]
            },
            {
              alignment: "right",
              stack: [
                data.rec_efectivo_rep.trim(),
                data.rec_transf_rep.trim(),
              ]
            }
          ]
        },
        total("TOTAL RECAUDOS", data.trecaudo_rep + ".00"),


        subheader("PAGOS ANTICIPADO"),
        {
          fontSize: 6.5,
          margin: [10, 2, 0, 0],
          columns: [
            {
              stack: [
                "Efectivo",
                "Transferencia",
              ]
            },
            {
              alignment: "right",
              stack: [
                data.ant_efectivo_rep.trim(),
                data.ant_transf_rep.trim(),
              ]
            }
          ]
        },
        total("TOTAL ANTICIPADO", data.tpagoant_rep + ".00"),


        subheader("RESUMEN INGRESOS"),
        {
          fontSize: 6.5,
          margin: [10, 2, 0, 0],
          columns: [
            {
              stack: [
                "Total Efectivo",
                "Total Transferencia",
              ]
            },
            {
              alignment: "right",
              stack: [
                data.efectivo_rep + ".00",
                data.transferencia_rep + ".00",
              ]
            }
          ]
        },
        { ...total("TOTAL EFECTIVO RECIBIDO", data.efectivo_rep + ".00"), margin: [0, 7, 0, 0] },


        subheader("EGRESOS"),
        {
          fontSize: 6.5,
          margin: [10, 2, 0, 0],
          columns: [
            {
              stack: concepEgr
            },
            {
              alignment: "right",
              stack: vlrEgr
            }
          ]
        },
        { ...total("TOTAL EGRESOS", data.tegresos_rep + ".00"), margin: [0, 7, 0, 0] },
        { ...total("Saldo Inicial Caja", data.sdo_caja_rep), margin: [0, 7, 0, 0] },


        { ...total("TOTAL ENTREGADO", data.tentregado_rep + ".00"), margin: [0, 10, 0, 0], fontSize: 7.5 },
        {
          fontSize: 6.5,
          margin: [10, 2, 0, 0],
          columns: [
            {
              stack: [
                "",
                "",
              ]
            },
            {
              alignment: "right",
              stack: [
                " ",
                " ",
              ]
            }
          ]
        },
        {
          margin: [0, 10, 0, 3],
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 180 - margin.right,
              y1: 0,
              y2: 0,
              lineWidth: 1,
            },
          ],
        },
        { text: "Impreso: ", fontSize: 6.5 },
        { text: fecha, fontSize: 6.5 }

      ],
      styles: {
        subheader: {
          bold: true,
          fontSize: 7,
          fillColor: "#cccccc",
        },
      },
      images: {
        logo: data.logo
      }
    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const reteica = (data) => {
  return new Promise((res) => {
    const condicional = (dato, datoPdf) => {
      return (dato == datoPdf) ? " X" : ""
    };

    let totalrte = 0;
    let renglones_parse = [
      [
        "",
        "",
        { text: "2 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "3 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "4 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "5 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "6 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "7 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "8 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "9 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
      [
        "",
        "",
        { text: "10 X 1000", alignment: "center" },
        { text: "", alignment: "right" },
        { text: "0", alignment: "right" },
      ],
    ];
    data.renglones.forEach((el) => {
      for (let el_parse of renglones_parse) {
        if (parseInt(el.renglon_for) == parseInt(el_parse[2].text.substr(0, 2))) {
          el_parse[3] = { text: el.base_for.trim(), alignment: "right" };
          el_parse[4] = { text: el.rte_for.trim(), alignment: "right" };

          totalrte += parseFloat(el.rte_for.replace(/\,/g, ""))
          break;
        }
      }
    });

    var margin = {
      left: 30,
      right: 30,
    };

    var dd = {
      pageMargins: [margin.left, 105, margin.right, 40],
      images: {
        logo: data.logo,
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {
                width: "auto",
                stack: [
                  {
                    image: 'logo',
                    width: 110,
                    height: 70
                  },
                  { text: `NIT: 892.099.324-3`, fontSize: 6.5, alignment: "center" }
                ]

              },
              {
                alignment: "center",
                stack: [
                  {
                    text: "ALCALDÍA MUNICIPAL DE VILLAVICENCIO",
                    style: "title"
                  },
                  {
                    text: "SECRETARIA DE HACIENDA MUNICIPAL",
                    style: "title2"
                  },
                  {
                    text: "Con tu apoyo Villavicencio CAMBIA CONTIGO",
                    fontSize: 8
                  },
                  {
                    margin: [0, 2, 0, 0],
                    text: "DECLARACION DE RETENCION EN LA FUENTE A TITULO DEL",
                    style: "title3"
                  },
                  {
                    text: "IMPUESTO DE INDUSTRIA Y COMERCIO",
                    style: "title3"
                  }
                ],
              },
              {
                image: 'logo',
                width: 80,
                height: 70
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
          fontSize: 6.5,
          table: {
            widths: ["*", "*", "auto", "auto", "*", "auto", "auto"],
            body: [
              [
                { stack: ['DEPARTAMENTO', { text: data.Departamento, bold: true }], alignment: "center" },
                { stack: ['MUNICIPIO', { text: data.Ciudad, bold: true }], alignment: "center" },
                { stack: ['AÑO GRAVABLE', { text: data.añogravable, bold: true }], alignment: "center" },
                { stack: ['PERIODO', { text: data.periodo, bold: true }], alignment: "center" },
                { stack: ['FECHA DECLARACION', { text: data.fecha_impr, bold: true }], alignment: "center" },
                { text: "N�sMERO DE FORMULARIO", alignment: "center", fontSize: 8 },
                { text: "", alignment: "center", fontSize: 8.5, color: "#DC0000" }
              ],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === node.table.body.length) ? 0 : 1.2;
            },
            vLineColor: "#add3f3",
            hLineColor: "#add3f3",
          }
        },
        {
          fontSize: 6.5,
          table: {
            widths: ["11.6%", "1.6%", "auto", "5%", "auto", "*", "auto", "1%", "*"],
            body: [
              [
                { text: "A.\nINFORMACION\nDEL\nCONTRIBUYENTE", style: "boldcenter", rowSpan: 5, margin: [0, 30, 0, 0], fillColor: "#add3f3", },
                { text: "1", alignment: "center" },
                { stack: ['APELLIDOS Y NOMBRES DEL CONTRIBUYENTE O RAZON SOCIAL', { text: data.descrip_empr, bold: true }], colSpan: 7 },
                "", "", "", "", "", ""
              ],
              [
                "",
                { text: "2", alignment: "center" },
                { text: ["C.C:", { text: condicional(data.tipo_id, "cc"), bold: true }], alignment: "center" },
                { text: ["NIT:", { text: condicional(data.tipo_id, "Nit"), bold: true }], alignment: "center" },
                { text: ["C.E:", { text: condicional(data.tipo_id, "ce"), bold: true }], alignment: "center" },
                { stack: ['No. DOCUMENTO', { text: parseInt(data.id_empr), bold: true }], alignment: "center" },
                { stack: ['D.V', { text: data.dv_empr, bold: true }], alignment: "center" },
                { text: "7", alignment: "center" },
                { stack: ['TIPO DE PERSONA', { text: data.tipo_id == "Nit" ? "JURÍDICA" : "NATURAL", bold: true }] },
              ],
              [
                "",
                { text: "3", alignment: "center", rowSpan: 2, margin: [0, 15, 0, 0] },
                { stack: ['DIRECCION DE NOTIFICACION', { text: data.direccion_empr, bold: true }], colSpan: 7 },
                "", "", "", "", "", ""
              ],
              [
                "",
                "",
                { stack: ['DEPARTAMENTO DE DIRECCION DE NOTIFICACION', { text: data.Departamento, bold: true }], colSpan: 5 },
                "", "", "", "",
                { stack: ['MUNICIPIO O DISTRITO DE DIRECCION DE NOTIFICACION', { text: data.Ciudad, bold: true }], colSpan: 2 },
                ""
              ],
              [
                "",
                { text: "4", alignment: "center" },
                { stack: ['TEL�?FONO', { text: data.telefono_empr.replace(/\,/g, " ").trim(), bold: true }] },
                { text: "5", alignment: "center" },
                { stack: ['CORREO ELECTRONICO', { text: data.email_empr, bold: true }], colSpan: 3 }, "", "",
                { text: "6", alignment: "center" },
                { stack: ['No. ESTABLECIMIENTOS', { text: "1", bold: true }], alignment: "center" },

              ],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === node.table.body.length) ? 0 : 1.2;
            },
            vLineColor: "#add3f3",
            hLineColor: "#add3f3",
          }
        },
        {
          fontSize: 6.5,
          table: {
            widths: ["10.8%", "1.5%", "30%", "43%", "*"],
            body: [
              [
                { text: "B.\nRETENCIONES", style: "boldcenter", fillColor: "#add3f3", rowSpan: 15, margin: [0, 80, 0, 0] },
                { text: "8", alignment: "center", rowSpan: 10, margin: [0, 60, 0, 0] },
                { text: "TARIFA X MIL", alignment: "center", fillColor: "#add3f3" },
                { text: "BASE GRAVABLE", alignment: "center", fillColor: "#add3f3" },
                { text: "IMPUESTO RETENIDO", alignment: "center", fillColor: "#add3f3" },
              ],
              ...renglones_parse,
              [
                "",
                { text: "9", alignment: "center" },
                { text: "RETENCIONES PRACTICADAS EN EL PERIODO (Sume los valor del impuesto retenido R.8)", colSpan: 2 },
                "",
                { text: formatNumero(totalrte), style: "boldright" },
              ],
              [
                "",
                { text: "10", alignment: "center" },
                { text: "MENOS RETENCIONES PRACTICADAS EN EXCESO, INDEBIDAS, POR OPERACIONES ANULADAS, RESCINDIDAS O RESUELTAS)", colSpan: 2 },
                "",
                { text: "0", alignment: "right" },
              ],
              [
                "",
                { text: "11", alignment: "center" },
                { text: "TOTAL RETENCIONES A DECLARAR (R.9 - R.10)", colSpan: 2 },
                "",
                { text: formatNumero(totalrte), style: "boldright" },
              ],
              [
                "",
                { text: "12", alignment: "center" },
                { text: "MAS SANCIONES", colSpan: 2 },
                "",
                { text: "0", alignment: "right" },
              ],
              [
                "",
                { text: "13", alignment: "center" },
                { text: "TOTAL A PAGAR (R.11 + R.12)", colSpan: 2 },
                "",
                { text: formatNumero(totalrte), style: "boldright" },
              ],
              [
                { text: "C.\nPAGOS", style: "boldcenter", fillColor: "#add3f3", rowSpan: 5, margin: [0, 20, 0, 0] },
                { text: "14", alignment: "center" },
                { text: "VALOR A PAGAR", colSpan: 2 },
                "",
                { text: formatNumero(totalrte), alignment: "right" },
              ],
              [
                "",
                { text: "15", alignment: "center" },
                { text: "TOTAL INTERESES DE MORA", colSpan: 2 },
                "",
                { text: "0", alignment: "right" },
              ],
              [
                "",
                { text: "16", alignment: "center" },
                { text: "MENOS DESCUENTO (Si existe, liquídelo según el acuerdo municipal o distrital)", colSpan: 2 },
                "",
                { text: "0", alignment: "right" },
              ],
              [
                "",
                { text: "17", alignment: "center" },
                { text: "VALOR NETO A PAGAR (R.14 + R.15 - R.16)", colSpan: 2 },
                "",
                { text: formatNumero(totalrte), style: "boldright" },
              ],
              [
                "",
                { text: "18", alignment: "center" },
                { text: "PAGO OPORTUNO HASTA", colSpan: 2 },
                "",
                { text: "", style: "boldright" },
              ],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === node.table.body.length) ? 0 : 1.2;
            },
            vLineColor: "#add3f3",
            hLineColor: "#add3f3",
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 10 || rowIndex === 12 || rowIndex === 14 || rowIndex === 18) ? '#add3f3' : null;
            }
          }
        },
        {
          fontSize: 6.5,
          table: {
            widths: ["11.5%", "*", "*", "20%", "auto", "*", "auto", "*"],
            heights: ["auto", 60, "auto", "auto"],
            body: [
              [
                { text: "D.\nFIRMAS", style: "boldcenter", rowSpan: 4, margin: [0, 40, 0, 0], fillColor: "#add3f3", },
                { text: "FIRMA DEL DECLARANTE", alignment: "center" },
                { text: ["Representante Legal :", { text: " ", bold: true }] },
                { text: ["Propietario:", { text: " ", bold: true }] },
                { text: ["FIRMA DEL CONTADOR", { text: " ", bold: true }], colSpan: 2 }, "",
                { text: ["FIRMA DEL REVISOR FISCAL", { text: " ", bold: true }], colSpan: 2 }, ""
              ],
              [
                "",
                {
                  colSpan: 3,
                  text: "",
                  // image: 'logo',
                  // width: 170,
                  // height: 50,
                  margin: [0, 4, 0, 4]
                },
                "", "",
                {
                  colSpan: 4,
                  text: "",
                  // image: 'logo',
                  // width: 170,
                  // height: 50,
                  margin: [0, 4, 0, 4]
                },
                "", "", "",
              ],
              [
                "",
                { text: ["NOMBRE:", { text: " ", bold: true }], colSpan: 3 },
                "", "",
                { text: ["NOMBRE:", { text: "", bold: true }], colSpan: 4 },
                "", "", ""
              ],
              [
                "",
                { text: ["C.C:", { text: " ", bold: true }], alignment: "center" },
                { text: ["C.E.", { text: " ", bold: true }], alignment: "center" },
                { stack: ['No.', { text: "", bold: true }] },
                { text: ["C.C:", { text: " ", bold: true }] },
                { text: ["C.E.", { text: " ", bold: true }] },
                { stack: ['No.', { text: "", bold: true }] },
                { stack: ['No. T.P.', { text: "", bold: true }] },
              ],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === node.table.body.length) ? 0 : 1.2;
            },
            vLineColor: "#add3f3",
            hLineColor: "#add3f3",
          }
        },
        {
          fontSize: 6.5,
          table: {
            widths: ["40.5%", "40%", "*"],
            heights: [80, "auto", "auto"],
            body: [
              [
                { text: "Recuerde que para realizar el PAGO debe emitir un\nRECIBO OFICIAL DE PAGO y presentarlos en la\nENTIDADES AUTORIZADAS o por medio del pago\nelectrónico PSE o Tarjeta Crédito", style: "boldcenter", fontSize: 9, margin: [0, 20, 0, 0] },
                "",
                // {
                //   image: 'logo',
                //   width: 140,
                //   height: 65,
                //   margin: [0, 4, 0, 4],
                //   alignment: "center"
                // },
                {
                  alignment: "center",
                  stack: [
                    "",
                    // {
                    //   image: 'logo',
                    //   width: 70,
                    //   height: 70,
                    //   margin: [0, 4, 0, 4]
                    // },
                    { text: "", fontSize: 6.5 }
                  ],
                  rowSpan: 2
                },
              ],
              [
                {
                  fontSize: 6,
                  text: [
                    "Para verificar esta declaración por favor escaneé el Código QR o consulte el código CUID en",
                    { text: ' https://digisign.softwaretributario.com/consultar-documento', link: ' https://digisign.softwaretributario.com/consultar-documento' },
                    " =>"
                  ],
                  colSpan: 2
                },
                ""
              ],
              [
                {
                  fontSize: 6,
                  colSpan: 3,
                  text: `Señor Contribuyente la declaración privada Bimestral de RETENCION A TITULO DEL IMPUESTO DE INDUSTRIA Y COMERCIO debe ser Presentada con pago inmediato o se entiende por no presentada.\n\nUsted puede diligenciar este formulario en www.villavicencio.gov.co Asistido, sin errores y de manera gratuita\n***** IMPRIMIR EN IMPRESORA LASER �?" GENERADA POR INTERNET �?" FECHA DILIGENCIAMIENTO: 10/01/2022 FECHA GENERACION: ${data.fecha_impr} - ${data.hora_impr} *****`,
                  alignment: "center"
                }
              ]
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return 1.2;
            },
            vLineColor: "##add3f3",
            hLineColor: "##add3f3",
          }
        },
      ],
      styles: {
        title: {
          fontSize: 15,
          bold: true
        },
        title2: {
          fontSize: 8.4,
          bold: true
        },
        title3: {
          fontSize: 9.3,
          bold: true
        },
        boldcenter: {
          alignment: "center",
          bold: true
        },
        boldright: {
          alignment: "right",
          bold: true
        }
      },

    };

    pdfMake.createPdf(dd).open();
    res();
  })
};

const comprobantes_inv = (data) => {
  return new Promise((res) => {
    let registros = [];
    let totalMercancias = 0;
    let contabilidad = [];
    let totalDeb = 0;
    let totalCred = 0
    data.registros.forEach((el) => {
      registros.push([
        { text: el.item.trim(), alignment: 'center' },
        el.producto,
        el.ubicacion.trim(),
        { text: el.rut.trim(), alignment: 'center' },
        { text: el.nroext.trim(), alignment: 'center' },
        { text: el.cantidad.trim(), alignment: 'right' },
        { text: data.impvlr == "0" ? "" : el.valor.trim(), alignment: 'right' },
        { text: data.detalle.trim(), alignment: 'center' },
      ]);
      totalMercancias += parseFloat(el.valor.replace(/\,/g, "")) || 0
    });

    data.contabilidad.forEach((el) => {
      contabilidad.push([
        { text: el.cuenta, alignment: 'center' },
        { text: el.nombrecta ? el.nombrecta.trim() : '', alignment: 'center' },
        { text: (el.tipocta == 'D') ? el.valor.trim() : '', alignment: 'right' },
        { text: (el.tipocta == 'C') ? el.valor.trim() : '', alignment: 'right' },
      ]);
      totalDeb += (el.tipocta == 'D') ? parseFloat(el.valor.replace(/\,/g, "")) || 0 : 0;
      totalCred += (el.tipocta == 'C') ? parseFloat(el.valor.replace(/\,/g, "")) || 0 : 0;
    });

    var margin = {
      left: 30,
      right: 30,
    };

    var dd = {
      pageMargins: [margin.left, 150, margin.right, 40],
      styles: {
        title: {
          bold: true,
          fontSize: 9
        },
        centerbold: {
          bold: true,
          alignment: 'center'
        },
        rightbold: {
          bold: true,
          alignment: 'right'
        },
        totales: {
          bold: true,
          fontSize: 8
        }
      },
      images: {
        logo: data.logo
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 30, margin.left, 0],
            text: `${data.fecha_impr} ${data.hora_impr}`,
            fontSize: 7.4
          },
          {
            margin: [margin.left, 3, margin.left, 0],
            columns: [
              {
                width: "20%",
                alignment: "center",
                stack: [
                  {
                    image: 'logo',
                    fit: [80, 80],
                  },
                ],
              },
              {
                width: "20%",
                margin: [0, 10, 0, 0],
                style: 'title',
                text: `${data.nombre.trim()}\nNIT: ${data.nit}`
              },
              {
                style: 'title',
                margin: [0, 13, 0, 0],
                alignment: 'center',
                text: [`${data.nombredoc.trim()}\nNúmero: ${data.consecutivo.trim()}\nFecha: `, { text: data.fecha, bold: false }, `\nVence: ${data.fechavence.trim()}`]
              },
            ],
          },
        ]
      },
      content: [
        {
          fontSize: 8,
          margin: [0, 0, 0, 15],
          layout: "lightHorizontalLines",
          table: {
            headerRows: 1,
            widths: [20, '*', '*', '*', '*', '*', '*', '*'],
            heights: 10,
            body: [
              [
                { text: "ITEM", style: 'centerbold' },
                { text: "PRODUCTO", style: 'centerbold' },
                { text: "UBICACION", style: 'centerbold' },
                { text: "RUT", style: 'centerbold' },
                { text: "DOCUMENTO", style: 'centerbold' },
                { text: "CANTIDAD", style: 'centerbold' },
                { text: data.impvlr == "0" ? "" : "VALOR", style: 'centerbold' },
                { text: "DETALLE", style: 'centerbold' },
              ],
              ...registros
            ],
          },
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 595.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 1,
            },
          ],
        },
        {
          style: 'totales',
          margin: [0, 2, 0, 3],
          columns: [
            { text: 'Total Mercancias', width: '63.5%', alignment: 'right' },
            { text: data.impvlr == "0" ? "" : formatNumero(totalMercancias), width: '23.7%', alignment: 'right' },
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 595.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 1,
            },
          ],
        },
        data.impcont == "0" ? {} : {
          columns: [
            {
              width: '75%',
              fontSize: 8,
              margin: [60, 25, 0, 30],
              table: {
                headerRows: 1,
                widths: '*',
                heights: 10,
                body: [
                  [
                    { text: "Cuenta", style: 'centerbold' },
                    { text: "Nombre Cta", style: 'centerbold' },
                    { text: "Débitos", style: 'centerbold' },
                    { text: "Créditos", style: 'centerbold' },
                  ],
                  ...contabilidad,
                  [
                    '',
                    { text: 'Totales', style: 'centerbold', margin: [0, 8, 0, 0] },
                    { text: `$${formatNumero(totalDeb)}`, style: 'rightbold', margin: [0, 12, 0, 0] },
                    { text: `$${formatNumero(totalCred)}`, style: 'rightbold', margin: [0, 12, 0, 0] },
                  ]
                ],
              },
            }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 595.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 1,
            },
          ],
        },
        {
          fontSize: 8,
          columns: [
            { text: 'Revisó:', bold: true, margin: [10, 15, 0, 0], width: '69%' },
            { text: [{ text: 'Impreso por:\n', bold: true }, `${data.impreso.trim()}\n`, data.fechagen], margin: [0, 7, 0, 0] },
          ]
        },
        {
          fontSize: 8,
          margin: [0, 15, 0, 0],
          columns: [
            { text: 'Entregado:_________________________', bold: true, margin: [10, 15, 0, 0], width: '69%' },
            { text: 'Recibido:__________________________', bold: true, margin: [10, 15, 0, 0], width: '69%' },
          ]
        }
      ]
    };

    pdfMake.createPdf(dd).open();
    res();
  })
};
const comprobantes_inv_pos = (data) => {
  return new Promise(res => {
    let width = 210;
    let registros = [];
    let totalMercancias = 0;
    let contabilidad = [];
    let totalDeb = 0;
    let totalCred = 0

    data.registros.forEach((el) => {
      registros.push({
        stack: [
          { text: el.producto, fontSize: 7 },
          {
            columns: [
              {
                text: "",
                width: "35%",
              },
              {
                text: parseFloat(el.nroext),
                width: "15%",
                alignment: "center",
              },
              {
                text: el.cantidad.trim(),
                width: data.impvlr == "0" ? "50%" : "20%",
                alignment: "center",
              },
              data.impvlr == "0" ? { width: "0%", text: "" } : {
                text: el.valor.trim(),
                width: "30%",
                alignment: "center",
                margin: [10, 0, 0, 0],
              },
            ],
          },
        ],
      });
      totalMercancias += parseFloat(el.valor.replace(/\,/g, "")) || 0
    });

    data.contabilidad.forEach((el) => {
      contabilidad.push({
        columns: [
          {
            width: "20%",
            text: el.cuenta,
          },
          {
            width: "30%",
            text: el.nombrecta ? el.nombrecta.trim() : "",
          },
          {
            width: "30%",
            text: (el.tipocta == 'D') ? el.valor.trim() : "",
          },
          {
            width: "20%",
            text: (el.tipocta == 'C') ? el.valor.trim() : "",
          },
        ],
      });
      totalDeb += (el.tipocta == 'D') ? parseFloat(el.valor.replace(/\,/g, "")) || 0 : 0;
      totalCred += (el.tipocta == 'C') ? parseFloat(el.valor.replace(/\,/g, "")) || 0 : 0;
    });

    var dd = {
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [3, 10, 10, 7],
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        headers: {
          margin: [0, 3, 0, 0],
          alignment: "center",
          fontSize: 11,
          bold: true,
        },
      },

      content: [
        { text: `${data.fecha_impr} ${data.hora_impr}`, fontSize: 7.5 },
        {
          margin: [0, 3, 0, 0],
          stack: [
            {
              width: 90,
              image: data.logo,
              alignment: "center",
              bold: true,
            },
          ],
        },
        {
          margin: [0, 3, 0, 0],
          text: [
            { text: `${data.nombre.trim()}\n`, bold: true },
            `Nit. ${data.nit}\n`,
            `${data.nombredoc.trim()}\n`,
            { text: `Número: ${data.consecutivo.trim()}\n`, style: "headers" },
            `Fecha: ${data.fecha}\n\n`,
            `Ubicación: ${data.descrubicacion}`

          ],
          alignment: "center",
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 10,
              // x2: pageSize.width - 20,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 15, 0, 10],
        },
        {
          columns: [
            {
              width: "35%",
              text: "Producto",
              bold: true,
            },
            {
              width: "15%",
              text: "Doc.",
              alignment: "left",
              bold: true,
            },
            {
              width: data.impvlr == "0" ? "50%" : "20%",
              text: "Cantidad",
              alignment: "left",
              bold: true,
            },
            data.impvlr == "0" ? { width: "0%", text: "" } : {
              width: "30%",
              text: "Valor",
              alignment: "center",
              bold: true,
            },
          ],
          margin: [0, 0, 0, 5],
        },
        registros,
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 10,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            {
              width: "60%",
              text: "Total".toUpperCase(),
              bold: true,
              fontSize: 10,
            },
            {
              width: "40%",
              text: data.impvlr == "0" ? "" : `$${formatNumero(totalMercancias)}`,
              alignment: "center",
              bold: true,
              fontSize: 10,
            },
          ],
        },
        data.impcont == "0" ? {} : {
          bold: true,
          columns: [
            {
              width: "20%",
              text: "Cuenta",
            },
            {
              width: "30%",
              text: "Nombre Cta",
            },
            {
              width: "30%",
              text: "Débitos",
            },
            {
              width: "20%",
              text: "Créditos",
            },
          ],
          margin: [0, 20, 0, 0],
        },
        data.impcont == "0" ? {} : contabilidad,
        data.impcont == "0" ? {} : {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 10,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 6, 0, 5],
        },
        data.impcont == "0" ? {} : {
          columns: [
            {
              width: "20%",
              text: "",
            },
            {
              width: "30%",
              text: "Totales",
              bold: true
            },
            {
              width: "30%",
              text: `$${formatNumero(totalDeb)}`,
            },
            {
              width: "20%",
              text: `$${formatNumero(totalCred)}`,
            },
          ],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 10,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 4, 0, 23],
        },
        `Revisó:  \n\n`,
        { text: "Impreso por: ", bold: true },
        data.impreso.trim(),
        `${data.fechagen}\n\n\n\n\n`,

        `Entregado: ________________________________\n\n\n\n`,
        `Recibido: ________________________________ \n\n\n\n`,

        {
          text: `Software: Titán Soluciones Sas \n\n.`,
          alignment: "center",
        },
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};

const nomina_elect = async (data, sendEmail) => {

  let url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.cune_rep
  let qr = await QRCode.toDataURL(url)

  return new Promise(res => {
    var filtro_devengos = data.basesnomina_rep.filter(
      (el) => el.codigo_rep.slice(0, 1) == "1"
    );
    var filtro_deducciones = data.basesnomina_rep.filter(
      (el) => el.codigo_rep.slice(0, 1) == "2"
    );

    var devengos = [];
    var totalDevengos = 0;
    filtro_devengos.forEach((el) => {
      totalDevengos += parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
      devengos.push([
        { text: el.descripcion_rep.trim(), alignment: "left" },
        { text: el.cantidad_rep.trim(), alignment: "right" },
        { text: el.valor_rep.trim(), alignment: "right" },
      ]);
    });

    devengos.push([
      {
        text: "Total devengos".toUpperCase(),
        style: "headerTabla",
        alignment: "right",
        colSpan: 2,
      },
      {},
      formatNumero(totalDevengos),
    ]);

    devengos.unshift([
      { text: "Devengado".toUpperCase(), style: "headerTabla" },
      {
        text: "Cantidad".toUpperCase(),
        style: "headerTabla",
        alignment: "center",
      },
      {
        text: "Valor".toUpperCase(),
        style: "headerTabla",
        alignment: "center",
      },
    ]);

    var deducciones = [];
    var totalDeducciones = 0;
    filtro_deducciones.forEach((el) => {
      totalDeducciones +=
        parseFloat(el.valor_rep.replace(/\ /g, "").replace(/\,/g, "")) || 0;
      deducciones.push([
        { text: el.descripcion_rep.trim(), alignment: "left" },
        { text: el.cantidad_rep.trim(), alignment: "right" },
        { text: el.valor_rep.trim(), alignment: "right" },
      ]);
    });

    deducciones.push([
      {
        text: "Total deducciones".toUpperCase(),
        style: "headerTabla",
        alignment: "right",
        colSpan: 2,
      },
      {},
      formatNumero(totalDeducciones),
    ]);

    deducciones.unshift([
      {
        text: "Deducciones".toUpperCase(),
        style: "headerTabla",
      },
      {
        text: "Cantidad".toUpperCase(),
        style: "headerTabla",
        alignment: "center",
      },
      {
        text: "Valor".toUpperCase(),
        style: "headerTabla",
        alignment: "center",
      },
    ]);

    var margin = {
      left: 40,
      right: 40,
    };

    var dd = {
      pageMargins: [margin.left, 210, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 40, margin.left, 0],
            columns: [
              {
                width: "20%",
                margin: [0, -15, 0, 0],
                alignment: "center",
                stack: [
                  {
                    image: "logo",
                    fit: [80, 80],
                  },
                ],
              },
              {
                width: "60%",
                bold: true,
                fontSize: 12,
                alignment: "center",
                stack: [
                  `${data.empresa.descrip_empr}`,
                  `NIT. ${formatNumero(
                    parseInt(data.empresa.id_empr)
                  )}\n`,
                  "Comprobante de NOMINA ELECTRONICA".toUpperCase(),
                  data.periodo_rep == "06" ||
                    data.periodo_rep == "07"
                    ? "Prima de servicios " + data.fechanomina_rep.trim()
                    : "Nómina " + data.fechanomina_rep.trim(),
                  `${data.prefijo_rep.trim()} ${data.consec_rep.trim()}`,
                ],
              },
              {
                width: "20%",
                margin: [0, -15, 0, 0],
                alignment: "center",
                stack: [
                  {
                    image: "qr",
                    fit: [80, 80],
                  },
                ],
              },
            ],
          },
          {
            margin: [margin.left, 10, margin.left, 0],
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    x2: pageSize.width - margin.right - margin.left,
                    y1: 0,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
              },
              {
                margin: [0, 10, 0, 10],
                text: [
                  { text: `Cune: `, bold: true, fontSize: 12 },
                  { text: data.cune_rep, fontSize: 9 }]
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    x2: pageSize.width - margin.right - margin.left,
                    y1: 0,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
              },
            ]
          },
          {
            margin: [margin.left, 10, margin.left, 0],
            columns: [
              {
                width: "40%",
                style: "infoEmpleado",
                text: `${data.nombresnomina_rep.trim()} ${data.Apellido1nomina_rep.trim()} ${data.Apellido2nomina_rep.trim()}`,
              },
              {
                width: "30%",
                style: "infoEmpleado",
                text: `C.C. ${data.idnomina_rep.trim()}`,
              },
              {
                width: "25%",
                style: "infoEmpleado",
                alignment: "center",
                fontSize: 10,
                text: `CARGO: ${data.descripcargo_rep.trim()}`,
              },
            ],
          },
          {
            margin: [0, 10, 0, 0],
            canvas: [
              {
                type: "line",
                x1: margin.right,
                x2: pageSize.width - margin.right,
                y1: 0,
                y2: 0,
                lineWidth: 1,
              },
            ],
          },
        ];
      },
      content: [
        {
          margin: [0, 20, 0, 0],
          columns: [
            {
              width: "50%",
              fontSize: 10,
              table: {
                widths: ["*", "auto", "auto"],
                body: devengos,
              },
              layout: "lightHorizontalLines",
            },
            {
              width: "50%",
              fontSize: 10,
              table: {
                widths: ["*", "auto", "auto"],
                body: deducciones,
              },
              layout: "lightHorizontalLines",
            },
          ],
          columnGap: 10,
        },
        {
          margin: [0, 20, 0, 20],
          bold: true,
          fontSize: 14,
          text: ["Neto Reportado: ".toUpperCase(), data.netonomina_rep],
          alignment: "center",
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              x2: 595.28 - margin.right - margin.left,
              y1: 0,
              y2: 0,
              lineWidth: 2,
            },
          ],
        },
        {
          margin: [0, 20, 0, 20],
          bold: true,
          fontSize: 14,
          text: "",
        },
      ],
      styles: {
        headerTabla: {
          bold: true,

        },
        infoEmpleado: {
          bold: true,
          fontSize: 12,
        },
      },
      images: {
        logo: data.logo,
        qr
      },
    };

    if (sendEmail) {
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

const cierre_caja = (data) => {
  return new Promise((res) => {
    var dd = {
      content: [
        {
          headerRows: 1,
          fontSize: 11,
          table: {
            widths: ["*", "*", "*"],
            heights: 15,
            body: [
              [
                {
                  colSpan: 3,
                  text: "CIERRE DE CAJA",
                  style: "center",
                  margin: [0, 6],
                },
                "",
                "",
              ],
              [
                {
                  colSpan: 2,
                  text: `Fecha: `,
                  bold: true,
                },
                "",
                {
                  text: `Turno: `,
                  bold: true,
                },
              ],
              [
                {
                  colSpan: 3,
                  text: `Despachador: `,
                  bold: true,
                },
                "",
                "",
              ],
              [
                {
                  colSpan: 2,
                  text: ["Tiquete inicial: ", { text: data.tiqini_rep, bold: true }],
                  alignment: "center",
                },
                "",
                {
                  text: ["RPC inicial: ", { text: "0", bold: true }],
                  alignment: "center",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: ["Tiquete final: ", { text: data.tiqfin_rep, bold: true }],
                  alignment: "center",
                },
                "",
                {
                  text: ["RPC final: ", { text: "0", bold: true }],
                  alignment: "center",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: ["Total tiquetes: ", { text: "0", bold: true }],
                  alignment: "center",
                },
                "",
                "",
              ],
              [
                {
                  colSpan: 3,
                  text: "INGRESOS INTERMUNICIPALES",
                  style: "center",
                  margin: [0, 4],
                },
                "",
                "",
              ],
              [
                {
                  colSpan: 2,
                  text: "CONCEPTO",
                  style: "center",
                },
                "",
                {
                  text: "VALOR",
                  style: "center",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Ventas",
                },
                "",
                {
                  text: `$${formatNumero(data.ventas_rep)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "RPC",
                },
                "",
                {
                  text: `$${formatNumero(data.rpc_rep)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Egresos",
                },
                "",
                {
                  text: `$${formatNumero(data.egresos_rep)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Redbus",
                },
                "",
                {
                  text: `$${formatNumero(data.redbus_rep)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Tarjeta débito",
                },
                "",
                {
                  text: `$0`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Tarjeta crédito",
                },
                "",
                {
                  text: `$0`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Convenios",
                },
                "",
                {
                  text: `$0`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Brasilia",
                },
                "",
                {
                  text: `$${formatNumero(data.brasilia_rep)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "Pinbus",
                },
                "",
                {
                  text: `$${formatNumero(data.pinbus_rep)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "TOTALES:",
                  style: "right",
                },
                "",
                `$${formatNumero(data.totales_rep)}`,
              ],
              [
                {
                  colSpan: 3,
                  text: "EFECTIVO ENTREGADO",
                  style: "center",
                  margin: [0, 4],
                },
                "",
                "",
              ],
              [
                {
                  text: "Denominación",
                  bold: true,
                },
                {
                  text: "Cantidad",
                  bold: true,
                },
                {
                  text: "Total",
                  bold: true,
                },
              ],
              [
                {
                  text: "$100,000",
                  alignment: "right",
                },
                {
                  text: data.cienk.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.cienk.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "$50,000",
                  alignment: "right",
                },
                {
                  text: data.ciencuentak.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.ciencuentak.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "$20,000",
                  alignment: "right",
                },
                {
                  text: data.veintek.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.veintek.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "$10,000",
                  alignment: "right",
                },
                {
                  text: data.diezk.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.diezk.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "$5,000",
                  alignment: "right",
                },
                {
                  text: data.cincok.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.cincok.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "$2,000",
                  alignment: "right",
                },
                {
                  text: data.dosk.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.dosk.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "$1,000",
                  alignment: "right",
                },
                {
                  text: data.unk.cantidad || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.unk.total)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  text: "Moneda",
                  alignment: "right",
                },
                {
                  text: data.moneda || 0,
                  alignment: "center",
                },
                {
                  text: `$${formatNumero(data.moneda)}`,
                  alignment: "right",
                },
              ],
              [
                {
                  colSpan: 2,
                  text: "TOTAL EFECTIVO:",
                  style: "right",
                },
                "",
                { text: `$${formatNumero(data.total)}`, alignment: "right" },
              ],
              [
                {
                  colSpan: 2,
                  text: "DIFERENCIA:",
                  style: "right",
                },
                "",
                { text: `$${formatNumero(data.diferencia)}`, alignment: "right" },
              ],
            ],
          },
          layout: {
            vLineColor: "#A4A4A4",
            hLineColor: "#A4A4A4",
          },
        },
        {
          margin: [0, 20],
          text: [{ text: `Observaciones:\n`, bold: true }, data.observaciones || ''],
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
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

const libro_viaje = (data) => {
  return new Promise((res) => {
    let watermark =
      data.estado_lvia === "0"
        ? ""
        : {
          text: "Anulado",
          angle: 60,
          color: "black",
          opacity: 0.2,
          fontSize: 70,
        };
    let stylePDF = {
      pageSize: {
        width: 200,
        height: "auto",
      },
      pageMargins: [20, 10, 10, 10],
    };

    let pasajeros = [];
    let pasajerosV2 = []
    let totalvlr_lvia = parseFloat(data.vlrbruto_lvia)
    let avances_lvia = parseFloat(data.vlravances_lvia) || 0;
    let recaudo_lvia = parseFloat(data.vlrrecaudo_lvia) || 0;
    let ssocial_lvia = parseFloat(data.vlrssocial_lvia) || 0;
    let gamarra_lvia = parseFloat(data.vlrgamarra_lvia) || 0;
    let tdebito_lvia = parseFloat(data.vlrtdeb_lvia) || 0;
    let totalPagar_lvia =
      totalvlr_lvia - avances_lvia - recaudo_lvia - ssocial_lvia - gamarra_lvia;

    let get_row = (label, value) => {
      return {
        columns: [
          { text: label + ': ' },
          { text: value }
        ]
      }
    }
    data.tiquetes_lvia.pop();
    let tiquetes = data.tiquetes_lvia.filter(el => el.tiquete_lvia && el.tiquete_lvia.trim())
    tiquetes.forEach((pas) => {
      pasajerosV2.push([
        {
          colSpan: 7,
          stack: [
            { ...get_row('Tiquete', parseInt(pas.tiquete_lvia.trim())) },
            { ...get_row('Pasajero', pas.pasajero_lvia.trim()) },
            { ...get_row('Destino', pas.destino_lvia.trim()) },
            { ...get_row('Sillas', pas.sillas_lvia.trim()) },
            { ...get_row('F.Pago', pas.fpago_lvia.trim()) },
            { ...get_row('Cant', pas.cantidad_lvia.trim()) },
            { ...get_row('Valor', "$" + formatNumero(pas.vlrtiq_lvia)) },
          ]
        }, {}, {}, {}, {}, {}, {}
      ])
    });
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
                  fit: [130, 130],
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
                    { text: "Libro de Viaje:  ", bold: true },
                    parseInt(data.nro_lvia.trim()),
                  ],
                  style: "center",
                  margin: [0, 2],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Origen:  ", bold: true },
                    data.origen_lvia.trim(),
                  ],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Destino:  ", bold: true },
                    data.destino_lvia.trim(),
                  ],
                },
                "", "", "", "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 4,
                  text: [
                    { text: "Fecha viaje:  ", style: "center" },
                    data.fecha_lvia,
                  ],
                },
                "", "", "",
                {
                  fontSize: 10,
                  colSpan: 3,
                  text: [
                    { text: "Hora:  ", style: "center" },
                    data.hora_lvia
                  ],
                },
                "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 3,
                  text: [
                    { text: "Número de cargue:  ", style: "center" },
                    parseFloat(data.nrocargue_lvia),
                  ],
                },
                "", "",
                {
                  fontSize: 10,
                  colSpan: 4,
                  text: [
                    { text: "Vehículo:  ", style: "center" },
                    data.placa_lvia,
                  ],
                },
                "", "", "",
              ],
              [
                {
                  fontSize: 10,
                  colSpan: 7,
                  text: [
                    { text: "Conductor:  ", bold: true },
                    `${data.idconductor_lvia
                    } - ${data.conductor_lvia.trim()}`,
                  ],
                },
                "", "", "", "", "", "",
              ],
              ...pasajerosV2,
              [
                {
                  colSpan: 2,
                  text: "Total seguro:",
                  style: "right",
                  fontSize: 10,
                },
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrseguro_lvia),
                  alignment: "right",
                  fontSize: 8,
                },
                "",
                { text: "Total", style: "right", fontSize: 10 },
                {
                  text: formatNumero(data.cantpasajeros_lvia),
                  alignment: "right",
                  fontSize: 8,
                },
                {
                  text: "$" + formatNumero(totalvlr_lvia),
                  alignment: "right",
                  fontSize: 8,
                },
              ],
              [
                { colSpan: 5, text: "Efectivo", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrefectivo_lvia.trim() || 0),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                { colSpan: 5, text: "Redbus", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrredbus_lvia.trim() || 0),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                { colSpan: 5, text: "Pinbus", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrpinbus_lvia.trim() || 0),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                { colSpan: 5, text: "Brasilia", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrbrasilia_lvia.trim() || 0),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                { colSpan: 5, text: "Gamarra", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrgamarra_lvia.trim() || 0),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                { colSpan: 5, text: "T.Debito/QR", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(data.vlrtdeb_lvia.trim() || 0),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],

              [
                { colSpan: 5, text: "Avance", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: formatNumero(avances_lvia),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                { colSpan: 5, text: "Recaudo", style: "right", fontSize: 8 },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: formatNumero(recaudo_lvia),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              // [
              //   {
              //     colSpan: 5,
              //     text: "Seguridad social",
              //     style: "right",
              //     fontSize: 8,
              //   },
              //   "",
              //   "",
              //   "",
              //   "",
              //   {
              //     colSpan: 2,
              //     text: formatNumero(ssocial_lvia),
              //     fontSize: 8,
              //     alignment: "center",
              //   },
              //   "",
              // ],
              [
                {
                  colSpan: 5,
                  text: "TOTAL LIBRO DE VIAJE",
                  style: "right",
                  fontSize: 10,
                },
                "",
                "",
                "",
                "",
                {
                  colSpan: 2,
                  text: "$" + formatNumero(totalPagar_lvia),
                  fontSize: 8,
                  alignment: "center",
                },
                "",
              ],
              [
                {
                  colSpan: 7,
                  text: [
                    { text: "Observaciones:\n  ", bold: true },
                    data.observaciones_lvia.trim(),
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
                  colSpan: 7,
                  text: [
                    "Taquilla de despacho: ",
                    { text: data.descagencia_lvia, bold: true },
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
                  colSpan: 7,
                  text: [
                    "Despachador: ",
                    { text: data.despachador_lvia.trim(), bold: true },
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
};


const factura = (data) => {
  return new Promise((res) => {
    let informacionEmpresa = {
      text: [
        { text: data.nombre_empresa, style: "header" },
        data.condicion
          ? `\nNIT:               ${data.nit_empresa
            .replace(/\,/g, "")
            .trim()}`
          : "",
        data.condicion ? `\nRégimen:     ${data.regimen_empresa.trim()}` : "",
        `\nDirección:    ${data.direccion_empresa.toLowerCase()} ${data.ciudad_empresa.replace(
          / /g,
          ""
        )}`,
        `\nTel:               ${data.telefono_empresa
          .replace(/\,/g, " ")
          .trim()}`,
        `\nEmail:           ${data.email_empresa}`,
      ],
      margin: [10, 0, 0, 0],
      style: "small",
    };

    let informacionCliente = [
      {
        text: [
          { text: "Cliente: ", bold: true },
          { text: `            ${data.nombre_cliente}`, fontSize: 8 },
        ],
        style: "small",
      },
      {
        text: [
          { text: "NIT: ", bold: true },
          `                 ${data.nit_cliente.replace(/\,/g, "").trim()}`,
        ],
        style: "small",
      },
      {
        text: [
          { text: "Dirección: ", bold: true },
          {
            text: `       ${data.direccion_cliente.toLowerCase()} ${data.ciudad_cliente
              .replace(/ /g, "")
              .toLowerCase()}`,
            fontSize: 8,
          },
        ],
        style: "small",
      },
      {
        text: [
          { text: "Telefono: ", bold: true },
          `       ${data.telefono_cliente.replace(/\,/g, " ").trim()}`,
        ],
        style: "small",
      },
      {
        text: [
          { text: "Email: ", bold: true },
          `             ${data.email_cliente.toLowerCase() ||
          "Email no registrado"}`,
        ],
        style: "small",
      },
      {
        text: [
          { text: "Tipo de negociación: ", bold: true },
          `       ${data.forma_pago}`,
        ],
        style: "small",
        margin: [0, 10, 0, 0],
      },
      {
        text: [
          { text: "Medio de pago: ", bold: true },
          `                 ${data.medio_pago}`,
        ],
        style: "small",
      },
    ];

    let informaciónFechas = [
      [
        {
          text: data.condicion ? "PRE_FACTURA:" : "DOCUMENTO EQUIVALENTE:",
          bold: true,
          style: "small",
        },
        { text: "MONEDA:", bold: true, style: "small" },
        // TABLA FECHA EMISION
        { text: "FECHA DE EMISION", style: "fechas" },
        {
          style: "small",
          table: {
            widths: [35, 35, 35],
            body: [
              [
                { text: "DÍA", bold: true },
                { text: "MES", bold: true },
                { text: "AÑO", bold: true },
              ],
              [
                data.fechacorta_factura.substr(8, 2),
                data.fechacorta_factura.substr(5, 2),
                data.fechacorta_factura.substr(0, 4),
              ],
            ],
          },
        },
      ],
      [
        { text: data.numero_fact.replace(/ /g, ""), style: "small" },
        { text: "COP Colombia pesos", style: "small" },
        //TABLA FECHA VENCIMIENTO
        {
          text: "FECHA DE VENCIMIENTO",
          style: "fechas",
          margin: [-10, 11, 0, 4],
        },
        {
          style: "small",
          margin: [0, 0, 9, 0],
          table: {
            widths: [35, 35, 30],
            body: [
              [
                { text: "DÍA", bold: true },
                { text: "MES", bold: true },
                { text: "AÑO", bold: true },
              ],
              [
                data.vencecorta_factura.substr(8, 2),
                data.vencecorta_factura.substr(5, 2),
                data.vencecorta_factura.substr(0, 4),
              ],
            ],
          },
        },
      ],
    ];

    let tablaProductos = {};
    let bodyProductos = [
      [
        { text: "Descripción", bold: true },
        { text: "Presentación", bold: true },
        { text: "Ubicación", bold: true },
        { text: "Cantidad", bold: true },
        { text: "V.Unitario", bold: true },
        { text: "V.Descuento", bold: true },
        data.condicion ? { text: "IVA", bold: true } : {},
        data.condicion ? { text: "Impoconsumo", bold: true } : {},
        { text: "Total", bold: true },
      ],
    ];
    let heightsProductos = [10];
    let granSubtotal = 0;
    let granIva = 0;
    let granImpoc = 0;
    let granDctos = data.descto.replace(/\,/g, "") || 0;
    let vlrprod = 0;
    let ivaprod = 0;
    let dctos = 0;
    let impocprod = 0;
    let subtotal = 0;
    let descripcion = "";
    let descripcion64 = "";
    data.productos.forEach((el, index) => {
      descripcion64 = window.atob(
        el.base1_pr.trim() +
        el.base2_pr.trim() +
        el.base3_pr.trim() +
        el.base4_pr.trim() +
        el.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = el.nombre_servicio;
      }
      el.nombre_servicio = descripcion;

      ivaprod = parseFloat(el.vlr_iva.replace(/\,/g, "") || 0);
      impocprod = parseFloat(el.vlr_impoconsumo.replace(/\,/g, "") || 0);
      vlrprod = parseFloat(el.vlr_subtotal.replace(/\,/g, "") || 0);
      subtotal = vlrprod + impocprod + ivaprod;

      let item = [
        el.nombre_servicio,
        el.presentac,
        el.ubicacion || "",
        { text: el.cantidad.trim(), alignment: "right" },
        { text: el.vlr_unit.trim(), alignment: "right" },
        data.condicion
          ? { text: el.vlr_unitiva.trim() || "0", alignment: "right" }
          : {},
        { text: el.vlr_dcto.trim() || "0", alignment: "right" },
        data.condicion
          ? { text: el.vlr_impoconsumo.trim() || "0", alignment: "right" }
          : {},
        { text: formatNumero(subtotal), alignment: "right" },
      ];
      bodyProductos.push(item);

      if (index + 1 == data.productos.length) {
        let heightTotal = 0;
        heightsProductos.forEach((el) => (heightTotal += el));
        heightsProductos.push(170 - heightTotal);
      } else heightsProductos.push(20);

      granSubtotal += parseFloat(el.vlr_subtotal.replace(/\,/g, "") || 0);
      if (data.condicion)
        granIva += parseFloat(el.vlr_iva.replace(/\,/g, "") || 0);
      granImpoc += parseFloat(el.vlr_impoconsumo.replace(/\,/g, "") || 0);
    });
    let granTotal = granSubtotal + granIva + granImpoc - granDctos;

    // TABLA DE LOS PRODUCTOS
    tablaProductos = {
      style: "small",
      margin: [0, 10, 0, 0],
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: [80, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

        heights: heightsProductos,
        body: bodyProductos,
      },
    };

    let totalesProductos = [
      [
        {
          style: "small",
          table: {
            widths: [330],
            heights: [70, 65],
            body: [
              [
                {
                  text: [
                    { text: "Notas: \n", bold: true },
                    data.observaciones.trim(),
                  ],
                },
              ],
              [
                {
                  text: [
                    { text: "SON: ", bold: true },
                    data.TotalEnLetras.trim(),

                    // `    ${numeroALetras(granTotal)}`,
                  ],
                },
              ],
            ],
          },
        },
      ],
      [
        {
          style: "small",
          table: {
            widths: [70, 120],
            heights: data.condicion ? 19 : [24, 23, 23, 0, 25],
            body: [
              [
                { text: "Base Impuestos:", bold: true },
                { text: formatNumero(granSubtotal), alignment: "right" },
              ],
              [
                { text: "Cargos:", bold: true },
                { text: "0", alignment: "right" },
              ],
              [
                { text: "Descuento:", bold: true },
                { text: formatNumero(granDctos), alignment: "right" },
              ],
              data.condicion
                ? [
                  { text: "Iva:", bold: true },
                  { text: formatNumero(granIva), alignment: "right" },
                ]
                : [
                  { fillColor: "#000000", text: "" },
                  { fillColor: "#000000", text: "" },
                ],
              data.condicion
                ? [
                  { text: "Impoconsumo:", bold: true },
                  { text: formatNumero(granImpoc), alignment: "right" },
                ]
                : [
                  { fillColor: "#000000", text: "" },
                  { fillColor: "#000000", text: "" },
                ],
              [
                {
                  text: data.condicion ? "Total:" : "Total Documento:",
                  bold: true,
                },
                { text: `$${formatNumero(granTotal)}`, alignment: "right" },
              ],
            ],
          },
        },
      ],
    ];

    var margin = {
      left: 15,
      right: 15,
    };

    var dd = {
      pageMargins: [margin.left, 280, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 40, margin.left, 0],
            columns: [
              {
                width: "20%",
                alignment: "center",
                stack: [
                  {
                    image: "logo",
                    fit: [130, 130],
                  },
                ],
              },
              informacionEmpresa,
            ],
          },
          {
            table: {
              widths: [539],
              body: [
                [
                  {
                    columns: [
                      informacionCliente,
                      {
                        margin: [0, 0, 0, 5],
                        columns: informaciónFechas,
                      },
                    ],
                  },
                ],
              ],
            },
            margin: [margin.left, 10, margin.left, 0],
          },
        ]
      },
      content: [
        tablaProductos,
        {
          margin: [0, 20, 0, 0],
          columns: totalesProductos,
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 12,
        },
        small: {
          fontSize: 9,
        },
        fechas: {
          bold: true,
          margin: [0, 12, 0, 3],
          fontSize: 9,
          alignment: "center",
          color: "red",
        },
        ultimaTabla: {
          fontSize: 9,
          bold: true,
          alignment: "center",
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

const pedido = (data) => {
  return new Promise((res) => {
    let informacionEmpresa = {
      text: [
        { text: data.nombre_empresa, style: "header" },
        data.condicion
          ? `\nNIT:               ${data.nit_empresa
            .replace(/\,/g, "")
            .trim()}`
          : "",
        data.condicion ? `\nRégimen:     ${data.regimen_empresa.trim()}` : "",
        `\nDirección:    ${data.direccion_empresa.toLowerCase()} ${data.ciudad_empresa.replace(
          / /g,
          ""
        )}`,
        `\nTel:               ${data.telefono_empresa
          .replace(/\,/g, " ")
          .trim()}`,
        `\nEmail:           ${data.email_empresa}`,
      ],
      margin: [10, 0, 0, 0],
      style: "small",
    };

    let informacionCliente = [
      {
        text: [
          { text: "Cliente: ", bold: true },
          { text: `            ${data.nombre_cliente}`, fontSize: 8 },
        ],
        style: "small",
      },
      {
        text: [
          { text: "NIT: ", bold: true },
          `                 ${data.nit_cliente.replace(/\,/g, "").trim()}`,
        ],
        style: "small",
      },
      {
        text: [
          { text: "Dirección: ", bold: true },
          {
            text: `       ${data.direccion_cliente.toLowerCase()} ${data.ciudad_cliente
              .replace(/ /g, "")
              .toLowerCase()}`,
            fontSize: 8,
          },
        ],
        style: "small",
      },
      {
        text: [
          { text: "Telefono: ", bold: true },
          `       ${data.telefono_cliente.replace(/\,/g, " ").trim()}`,
        ],
        style: "small",
      },
      {
        text: [
          { text: "Email: ", bold: true },
          `             ${data.email_cliente.toLowerCase() ||
          "Email no registrado"}`,
        ],
        style: "small",
      },
      {
        text: [
          { text: "Tipo de negociación: ", bold: true },
          `       ${data.forma_pago}`,
        ],
        style: "small",
        margin: [0, 10, 0, 0],
      },
      {
        text: [
          { text: "Medio de pago: ", bold: true },
          `                 ${data.medio_pago}`,
        ],
        style: "small",
      },
    ];

    let informaciónFechas = [
      [
        {
          text: "PEDIDO DE SERVICIOS Y MERCANCIAS",
          bold: true,
          style: "small",
        },
        { text: "MONEDA:", bold: true, style: "small" },
        // TABLA FECHA EMISION
        { text: "FECHA DE EMISION", style: "fechas" },
        {
          style: "small",
          table: {
            widths: [35, 35, 35],
            body: [
              [
                { text: "DÍA", bold: true },
                { text: "MES", bold: true },
                { text: "AÑO", bold: true },
              ],
              [
                data.fechacorta_factura.substr(8, 2),
                data.fechacorta_factura.substr(5, 2),
                data.fechacorta_factura.substr(0, 4),
              ],
            ],
          },
        },
      ],
      [
        { text: data.numero_fact.replace(/ /g, ""), style: "small" },
        { text: "COP Colombia pesos", style: "small" },
        //TABLA FECHA VENCIMIENTO
        {
          text: "FECHA DE VENCIMIENTO",
          style: "fechas",
          margin: [-10, 11, 0, 4],
        },
        {
          style: "small",
          margin: [0, 0, 9, 0],
          table: {
            widths: [35, 35, 30],
            body: [
              [
                { text: "DÍA", bold: true },
                { text: "MES", bold: true },
                { text: "AÑO", bold: true },
              ],
              [
                data.vencecorta_factura.substr(8, 2),
                data.vencecorta_factura.substr(5, 2),
                data.vencecorta_factura.substr(0, 4),
              ],
            ],
          },
        },
      ],
    ];

    let tablaProductos = {};
    let bodyProductos = [
      [
        { text: "#", bold: true },
        { text: "CÓDIGO", bold: true },
        { text: "DESCRIPCION", bold: true },
        { text: "CANTIDAD", bold: true },
        { text: "VLR_UNITARIO", bold: true },
        data.condicion ? { text: "IVA_UNIT", bold: true } : {},
        data.condicion ? { text: "IMPOCONSUMO", bold: true } : {},
        { text: "TOTAL", bold: true },
      ],
    ];
    let heightsProductos = [10];
    let granSubtotal = 0;
    let granIva = 0;
    let granImpoc = 0;
    let vlrprod = 0;
    let ivaprod = 0;
    let impocprod = 0;
    let subtotal = 0;
    let descripcion = "";
    let descripcion64 = "";
    data.productos.forEach((el, index) => {
      descripcion64 = window.atob(
        el.base1_pr.trim() +
        el.base2_pr.trim() +
        el.base3_pr.trim() +
        el.base4_pr.trim() +
        el.base5_pr.trim()
      );
      if (descripcion64) {
        descripcion = descripcion64;
      } else {
        descripcion = window.atob(el.nombre_servicio.trim());
      }
      el.nombre_servicio = descripcion;

      ivaprod = parseFloat(el.vlr_iva.replace(/\,/g, "") || 0);
      impocprod = parseFloat(el.vlr_impoconsumo.replace(/\,/g, "") || 0);
      vlrprod = parseFloat(el.vlr_subtotal.replace(/\,/g, "") || 0);
      subtotal = vlrprod + impocprod + ivaprod;

      let item = [
        index + 1,
        el.codigo,
        el.nombre_servicio,
        { text: el.cantidad.trim(), alignment: "right" },
        { text: el.vlr_unit.trim(), alignment: "right" },
        data.condicion
          ? { text: el.vlr_unitiva.trim() || "0", alignment: "right" }
          : {},
        data.condicion
          ? { text: el.vlr_impoconsumo.trim() || "0", alignment: "right" }
          : {},
        { text: formatNumero(subtotal), alignment: "right" },
      ];
      bodyProductos.push(item);

      if (index + 1 == data.productos.length) {
        let heightTotal = 0;
        heightsProductos.forEach((el) => (heightTotal += el));
        heightsProductos.push(170 - heightTotal);
      } else heightsProductos.push(20);

      granSubtotal += parseFloat(el.vlr_subtotal.replace(/\,/g, "") || 0);
      if (data.condicion)
        granIva += parseFloat(el.vlr_iva.replace(/\,/g, "") || 0);
      granImpoc += parseFloat(el.vlr_impoconsumo.replace(/\,/g, "") || 0);
    });
    let granTotal = granSubtotal + granIva + granImpoc;

    // TABLA DE LOS PRODUCTOS
    tablaProductos = {
      style: "small",
      margin: [0, 10, 0, 0],
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: data.condicion
          ? ['auto', 110, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']
          : ['auto', 110, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        heights: heightsProductos,
        body: bodyProductos,
      },
    };

    let totalesProductos = [
      [
        {
          style: "small",
          table: {
            widths: [330],
            heights: [70, 65],
            body: [
              [
                {
                  text: [
                    { text: "Notas: \n", bold: true },
                    data.observaciones.trim(),
                  ],
                },
              ],
              [
                {
                  text: [
                    { text: "SON: ", bold: true },
                    data.TotalEnLetras.trim(),

                    // `    ${numeroALetras(granTotal)}`,
                  ],
                },
              ],
            ],
          },
        },
      ],
      [
        {
          style: "small",
          table: {
            widths: [70, 120],
            heights: data.condicion ? 19 : [24, 23, 23, 0, 25],
            body: [
              [
                { text: "Base Impuestos:", bold: true },
                { text: formatNumero(granSubtotal), alignment: "right" },
              ],
              [
                { text: "Cargos:", bold: true },
                { text: "0", alignment: "right" },
              ],
              [
                { text: "Descuento:", bold: true },
                { text: "0", alignment: "right" },
              ],
              data.condicion
                ? [
                  { text: "Iva:", bold: true },
                  { text: formatNumero(granIva), alignment: "right" },
                ]
                : [
                  { fillColor: "#000000", text: "" },
                  { fillColor: "#000000", text: "" },
                ],
              data.condicion
                ? [
                  { text: "Impoconsumo:", bold: true },
                  { text: formatNumero(granImpoc), alignment: "right" },
                ]
                : [
                  { fillColor: "#000000", text: "" },
                  { fillColor: "#000000", text: "" },
                ],
              [
                {
                  text: data.condicion ? "Total:" : "Total Documento:",
                  bold: true,
                },
                { text: `$${formatNumero(granTotal)}`, alignment: "right" },
              ],
            ],
          },
        },
      ],
    ];

    var margin = {
      left: 23,
      right: 23,
    };

    var dd = {
      pageMargins: [margin.left, 280, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 40, margin.left, 0],
            columns: [
              {
                width: "20%",
                alignment: "center",
                stack: [
                  {
                    image: "logo",
                    fit: [130, 130],
                  },
                ],
              },
              informacionEmpresa,
            ],
          },
          {
            table: {
              widths: [539],
              body: [
                [
                  {
                    columns: [
                      informacionCliente,
                      {
                        margin: [0, 0, 0, 5],
                        columns: informaciónFechas,
                      },
                    ],
                  },
                ],
              ],
            },
            margin: [margin.left, 10, margin.left, 0],
          },
        ]
      },
      content: [
        tablaProductos,
        {
          margin: [0, 20, 0, 0],
          columns: totalesProductos,
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 12,
        },
        small: {
          fontSize: 9,
        },
        fechas: {
          bold: true,
          margin: [0, 12, 0, 3],
          fontSize: 9,
          alignment: "center",
          color: "red",
        },
        ultimaTabla: {
          fontSize: 9,
          bold: true,
          alignment: "center",
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



const doc_soporte = async (data) => {
  console.log("data", data);
  let url = "";

  if (data.cuds_prov) {
    url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.cuds_prov;
  }

  let qr = await QRCode.toDataURL(url);

  return new Promise((res, rej) => {
    let detalle = [];
    let subtotal = 0;

    const rtefte = parseFloat(data.rtefte_prov.replace(/\,/g, "")) || 0;
    const rtefteasumida = parseFloat(data.rtefteasum_prov.replace(/\,/g, "")) || 0;
    const rteica = parseFloat(data.rteica_prov.replace(/\,/g, "")) || 0;
    const anticipos = parseFloat(data.anticipos_prov.replace(/\,/g, "")) || 0;
    const otrosdesctos = parseFloat(data.otrosdesctos_prov.replace(/\,/g, "")) || 0;

    const ocultarCantidad = data.idempresa_prov === "000000860052649" && data.prefijo_prov.trim() == "LA";

    data.productos_prov.forEach((el) => {
      const cantidad = ocultarCantidad ? "" : el.cantidad_prov;
      const vlr_unitario = parseFloat(el.vlrunit_prov.replace(/\,/g, "")) || 0;
      const vlr_subtotal = parseFloat(el.vlrsubtotal_prov.replace(/\,/g, "")) || 0;

      subtotal += vlr_subtotal;

      detalle.push([
        cantidad,
        el.nombreservicio_prov,
        { text: formatNumero(vlr_unitario), alignment: "right" },
        { text: formatNumero(vlr_subtotal), alignment: "right" },
      ]);
    });

    const margin = { right: 40, left: 40 };

    const dd = {
      pageMargins: [margin.left, 245, margin.right, 60],
      header: function () {
        return [
          {
            margin: [margin.left, 15, margin.right, 0],
            fontSize: 9,
            columns: [
              {
                width: "10%",
                image: data.logo,
                fit: [100, 100],
              },
              {
                margin: [30, 0, 30, 0],
                width: "75%",
                alignment: "center",
                stack: [
                  { text: data.nombre_emi_prov, fontSize: 10 },
                  `NIT: ${data.idEmpresa}`,
                  `${data.direccion_emi_prov} \n - Teléfono - ${data.telefono_emi_prov}`,
                  `${data.ciudad_emi_prov} - Colombia - `,
                  `Email: ${data.email_emi_prov}`
                ]
              },
              data.cuds_prov ? {
                width: "10%",
                image: qr,
                fit: [80, 120],
              } : {},
            ]
          },
          {
            margin: [margin.left, 5, margin.right, 0],
            columns: [
              {
                width: "60%",
                text: "\nFecha de operación: " + data.fecha_prov,
              },
              {
                width: "40%",
                alignment: "center",
                bold: true,
                color: "#ad190e",
                stack: [
                  `No. ${data.prefijo_prov.trim()}  ${data.consecutivo_prov.trim()}`,
                  {
                    text: `Autorización de numeración Dian No ${parseInt(data.nroresdian_prov)} desde la ${parseInt(data.nroinidian_prov)} hasta la ${parseInt(data.nrofindian_prov)} Fecha: ${data.fecharesdian_prov} Vigencia  ${parseInt(data.vigenciadian_prov)} meses `,
                    fontSize: 9,
                  },
                ],
              },
            ],
          },
          {
            margin: [margin.left, 5, margin.right, 0],
            fontSize: 9,
            columns: [
              { text: "CUDS:", width: "auto", style: "firmas" },
              { text: data.cuds_prov.trim() }
            ]
          },
          {
            margin: [margin.left, 5, margin.right, 0],
            fontSize: 9,
            table: {
              widths: [350, 150],
              body: [
                ["Vendedor o quien presta el servicio:", "Nit:"],
                [data.nombre_prov, data.nit_prov.trim()],
                ["Dirección:", "Telefonos:"],
                [data.direccion_prov, data.telefono_prov],
              ],
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex % 2 === 0 ? "#ddd" : null;
              },
            },
          },
        ];
      },
      styles: {
        header_tabla: { bold: true, alignment: "center" },
        firmas: { margin: [0, 0, 4, 0], bold: true }
      },
      content: [
        {
          fontSize: 9,
          table: {
            widths: [50, 232, 100, 100],
            body: [
              [
                { text: ocultarCantidad ? "" : "CANTIDAD", style: "header_tabla" },
                { text: "DETALLE", style: "header_tabla" },
                { text: "VR UNITARIO", style: "header_tabla" },
                { text: "VR TOTAL", style: "header_tabla" },
              ],
              ...detalle,
            ],
          },
          layout: {
            fillColor: (rowIndex) => rowIndex === 0 ? "#ddd" : null,
          },
        },
        {
          margin: [0, 5, 0, 0],
          columns: [
            {
              width: 300,
              fontSize: 9,
              alignment: "center",
              margin: [0, 70, 0, 0],
              stack: [
                "_____________________________________________________",
                { text: "ACEPTO QUE NO ESTOY OBLIGADO A FACTURAR", bold: true },
              ],
            },
            {
              width: 200,
              fontSize: 9,
              table: {
                widths: [100, 100],
                body: [
                  [{ text: "Subtotal", bold: true }, { text: formatNumero(subtotal), alignment: "right" }],
                  [{ text: "Retefuente", bold: true }, { text: formatNumero(rtefte), alignment: "right" }],
                  [{ text: "Reteica", bold: true }, { text: formatNumero(rteica), alignment: "right" }],
                  [{ text: "Anticipos", bold: true }, { text: formatNumero(anticipos), alignment: "right" }],
                  [{ text: "Otros Dctos", bold: true }, { text: formatNumero(otrosdesctos), alignment: "right" }],
                  [
                    { text: "Total", bold: true },
                    {
                      text: formatNumero(subtotal - rtefte - rteica - anticipos - otrosdesctos + rtefteasumida),
                      alignment: "right",
                    },
                  ],
                ],
              },
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 || rowIndex === 3) ? "#ddd" : null,
              },
            },
          ],
        },
        {
          fontSize: 10,
          margin: [0, 10, 0, 0],
          table: {
            widths: ["*"],
            body: [[{ text: [{ text: 'Observaciones: ', bold: true }, data.observaciones_prov] }]]
          }
        },
        {
          margin: [0, 80, 0, 0],
          fontSize: 9,
          columns: [
            { text: "Elaboró", width: "auto", style: "firmas" },
            {
              margin: [0, 10, 0, 0],
              canvas: [{ type: "line", x1: 0, y1: 0, x2: 130, y2: 0, lineWidth: 1 }],
              alignment: "center",
            },
            { text: "Revisó", width: "auto", style: "firmas" },
            {
              margin: [0, 10, 0, 0],
              canvas: [{ type: "line", x1: 0, y1: 0, x2: 130, y2: 0, lineWidth: 1 }],
              alignment: "center",
            },
            { text: "Aprobó", width: "auto", style: "firmas" },
            {
              margin: [0, 10, 0, 0],
              canvas: [{ type: "line", x1: 0, y1: 0, x2: 130, y2: 0, lineWidth: 1 }],
              alignment: "center",
            },
          ],
        },
      ],
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
                  text: [
                    {
                      text: "C.Costo: ",
                      bold: true,
                    },
                    {
                      text: data.ccosto_prov,
                    },
                  ],
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
                  text: [
                    {
                      text: "Forma de pago: ",
                      bold: true,
                    },
                    {
                      text: data.formapago_prov,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: "Area que solicita: ",
                      bold: true,
                    },
                    {
                      text: data.areasolicita_prov,
                    },
                  ],
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

const rec_cierrecajero = (data) => {
  return new Promise((res, rej) => {
    var detalle = [];
    let subtcantidad = 0;
    let subtvalor = 0;
    data.recaudos_rep.pop();
    data.recaudos_rep.forEach((el) => {
      let cantidad = parseFloat(el.cantidad_rep);
      let vlr_subtotal = parseFloat(el.valor_rep.replace(/\,/g, ""));

      subtcantidad += cantidad;
      subtvalor += vlr_subtotal;
      let obj = [
        el.entidad_rep,
        { text: formatNumero(el.cantidad_rep), alignment: "center" },
        { text: formatNumero(el.valor_rep), alignment: "center" },
      ];

      detalle.push(obj);
    });

    detalle.push([
      { text: "TOTALES:", bold: true },
      { text: formatNumero(subtcantidad), alignment: "center", bold: true },
      { text: formatNumero(subtvalor), alignment: "center", bold: true },
    ]);

    const margin = {
      right: 40,
      left: 40,
    };

    let base = parseFloat(data.base_rep.replace(/\,/g, ""));
    let entregado = parseFloat(data.entregado_rep.replace(/\,/g, ""));
    let diferencia = entregado - subtvalor - base;
    let textdiferencia = " ";
    if (diferencia < 0) textdiferencia = "Faltante";
    else if (diferencia === 0) textdiferencia = "Caja cerrada";
    else textdiferencia = "Sobrante";

    var dd = {
      pageMargins: [margin.left, 180, margin.right, 60],
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
                    fit: [120, 100],
                  },
                ],
              },
              {
                margin: [0, 25, 0, 0],
                alignment: "center",
                bold: true,
                color: "#0074c1",
                fontSize: 16,
                stack: [
                  {
                    alignment: "center",
                    text: data.desripEmpresa,
                    fontSize: 16,
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
                ],
              },
            ],
          },
          {
            margin: [margin.left, 10, 0, 0],
            bold: true,
            stack: [
              {
                alignment: "center",
                text: "CIERRE DE CAJA  " + data.agencia_rep,
                fontSize: 16,
              },
              {
                alignment: "center",
                text: "Fecha:" + data.fechacierre_rep + "  Hora:" + data.horacierre_rep,
                fontSize: 16,
              },

            ],
          },
          {
            margin: [margin.left, 10, margin.right, 0],
            table: {
              widths: ["*", "*"],
              body: [
                [
                  { text: `Cajero: ${data.cajero_rep.trim()}`, bold: true },
                  {
                    text: `Punto Recaudo: ${data.agencia_rep.trim()}`,
                    bold: true,
                  },
                ],
                [
                  { text: `Fecha: ${data.fechacierre_rep}`, bold: true },
                  { text: `Hora: ${data.horacierre_rep}`, bold: true },
                ],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return i === 0 || i === node.table.body.length ? 1 : 0;
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
          margin: [0, 30, 0, 0],
          table: {
            widths: ["*", "auto", "*"],
            body: [
              [
                { text: "CONVENIO", style: "header_tabla" },
                { text: "CANTIDAD", style: "header_tabla" },
                { text: "VALOR", style: "header_tabla" },
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
          margin: [0, 30, 0, 0],
          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  text: "Resumen para conciliación de caja",
                  bold: true,
                  alignment: "center",
                  fontSize: 14,
                  colSpan: 2,
                },
                null,
              ],
              [
                {
                  text: {
                    text: "Valor Recaudos",
                    bold: true,
                  },
                },
                {
                  alignment: "right",
                  text: formatNumero(subtvalor),
                },
              ],
              [
                {
                  text: {
                    text: "Base Caja",
                    bold: true,
                  },
                },
                {
                  alignment: "right",
                  text: data.base_rep,
                },
              ],
              [
                {
                  text: {
                    text: "Valor Entregado",
                    bold: true,
                  },
                },
                {
                  alignment: "right",
                  text: data.entregado_rep,
                },
              ],
              [
                {
                  text: {
                    text: textdiferencia,
                    bold: true,
                  },
                },
                {
                  alignment: "right",
                  text: formatNumero(diferencia),
                },
              ],
            ],
          },
        },
        {
          fontSize: 9,
          alignment: "left",
          margin: [0, 50],
          columns: [
            {
              stack: [
                "____________________________________________",
                { text: `Cajero`, bold: true },
                { text: data.cajero_rep, bold: true },
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

const doc_ordencotiza = (data) => {
  return new Promise((res, rej) => {
    var detalle = [];
    let subtotal = 0;

    data.productos_prov.forEach((el) => {
      let vlr_subtotal = parseFloat(el.vlrsubtotal_prov.replace(/\,/g, ""));

      subtotal += vlr_subtotal;
      let obj = [
        el.nombreservicio_prov,
        { text: formatNumero(el.cantidad_prov), alignment: "center" },
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
                    text: "Orden de Cotización",
                  },
                  {
                    text: `No. ${data.consecutivo_prov.trim()}`,
                    color: "#ad190e",
                  },
                ],
              },
            ],
          },
          // {
          //   margin: [margin.left, 0, margin.right, 0],
          //   alignment: 'right',
          //   fontSize: 12,
          //   text: "\nFecha: " + data.fecha_prov,
          // },
          {
            margin: [margin.left, 25, margin.right, 0],
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: [
                      {
                        text: "Proveedor: ",
                        bold: true,
                      },
                      {
                        text: data.nombre_prov.trim(),
                      },
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Fecha:",
                        bold: true,
                      },
                      {
                        text: data.fecha_prov,
                      },
                    ],
                  },
                ],
              ],
            },
            layout: {
              paddingTop: function (i, node) {
                return 4;
              },
              paddingBottom: function (i, node) {
                return 4;
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
            widths: ["*", "auto"],
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
          margin: [0, 30, 0, 0],
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
                  colSpan: 2,
                },
                null,
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
                  text: [
                    {
                      text: "Forma de pago: ",
                      bold: true,
                    },
                    {
                      text: data.formapago_prov,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: "",
                      bold: true,
                    },
                    {
                      text: "",
                    },
                  ],
                },
              ],
            ],
          },
        },
        {
          fontSize: 9,
          alignment: "center",
          margin: [0, 50, 0],
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

const doc_remision = (data) => {
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
      pageMargins: [margin.left, 180, margin.right, 60],
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
                  data.desripEmpresa,
                  `${data.tipoId}. ${data.idEmpresa}`,
                  data.direccionEmpresa,
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
                ],
              },
            ],
          },
          {
            margin: [margin.left, 0, margin.right, 0],
            alignment: "right",
            fontSize: 12,
            text: "\nFecha: " + data.fecha_factura,
          },
          {
            margin: [margin.left, 5, margin.right, 0],
            fontSize: 9,
            table: {
              widths: [350, 150],
              body: [
                ["Proveedor:", "Nit:"],
                [data.nombre_cliente, data.nit_cliente.trim()],
                ["Dirección:", "Telefonos:"],
                [data.direccion_cliente, data.telefono_cliente],
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
        // {
        //   margin: [300, 5, 0, 0],
        //   fontSize: 9,
        //   table: {
        //     widths: [100, 100],
        //     body: [
        //       [
        //         { text: "Subtotal", bold: true },
        //         { text: formatNumero(subtotal), alignment: "right" },
        //       ],
        //       [
        //         { text: "Total", bold: true },
        //         {
        //           text: formatNumero(subtotal),
        //           alignment: "right",
        //         },
        //       ],
        //     ],
        //   },
        //   layout: {
        //     fillColor: function (rowIndex, node, columnIndex) {
        //       return rowIndex === 0 || rowIndex === 3 ? "#ddd" : null;
        //     },
        //   },
        // },
        {
          margin: [0, 30, 0, 0],
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
          alignment: "left",
          margin: [0, 50, 0, 0],
          columns: [
            {
              stack: [
                "_____________________________",
                { text: `Elaborado`, bold: true },
                { text: data.elaboro, bold: true },
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

const validacion2_rc = (data) => {
  return new Promise((res) => {
    let linea = {
      text:
        "------------------------------------------",
      bold: true,
      fontSize: 12,
    };
    let tipo = "COTREM NIT: 892.099.339-3";


    var dd = {
      pageSize: {
        width: 200,
        height: "auto",
      },
      pageMargins: [10, 10, 10, 10],

      content: [
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
                { text: `Entidad: ${data.entidad_rep.trim() || ""}\n` },
                { text: `Fecha: ${data.fecha_rep || ""}\n` },
                { text: `Hora: ${data.hora_rep || ""}\n` },
                { text: `Cajero: ${data.cajero_rep || ""}\n` },
                { text: `Factura: ${data.factura_rep.trim() || ""}\n` },
                { text: `Valor: ${data.valor_rep.trim() || ""}\n` },
              ]
            },
          ],
        },
        { ...linea },
      ],



      // content: [
      //   {
      //     fontSize: 10,
      //     stack: [
      //       { text: "COTREM NIT: 892.099.339-3" },
      //       { text: `Entidad: ${data.entidad_rep.trim() || ""}\n` },
      //       { text: `Fecha: ${data.fecha_rep || ""}\n Hora: ${data.hora_rep || ""}\n`,
      //       },
      //       { text: `Cajero: ${data.cajero_rep || ""}\n` },
      //       { text: `Fact: ${data.factura_rep.trim() || ""}\n  Vlr: ${data.valor_rep.trim()  || ""}\n`, },

      //     ],
      //   },
      // ],
    };

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

const validacion_rc = (data) => {
  return new Promise((res) => {
    var dd = {
      pageSize: {
        width: 250,
        height: "auto",
      },
      pageMargins: [10, 60, 0, 0],
      content: [
        {
          fontSize: 10,
          stack: [
            // { text: "COTREM NIT: 892.099.339-3" },
            { text: `${data.empresa_rep || ""}` },
            { text: `Entidad: ${data.entidad_rep || ""}` },
            {
              text: `Fecha: ${data.fecha_rep || ""} Hora: ${data.hora_rep ||
                ""}`,
            },
            { text: `Cajero: ${data.cajero_rep || ""}` },
            {
              text: `Fact: ${data.factura_rep || ""}  Vlr: ${data.valor_rep ||
                ""}`,
            },
          ],
        },
      ],
    };

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

const formato_contable = (data) => {
  return new Promise((res) => {
    var totalDeb = 0;
    var totalCred = 0;
    let vlrcheque = parseFloat(
      data.vlrcheque.replace(/\ /g, "").replace(/\,/g, "")
    );
    var datosTabla = [];
    var items = data.registros;
    items.forEach((el) => {
      if (el.rut != "" && el.rut != undefined) {
        totalDeb +=
          el.debito === ""
            ? 0
            : parseFloat(el.debito.replace(/\ /g, "").replace(/\,/g, ""));
        totalCred +=
          el.credito === ""
            ? 0
            : parseFloat(el.credito.replace(/\ /g, "").replace(/\,/g, ""));

        datosTabla.push([
          {
            fontSize: 9,
            alignment: "right",
            text: el.item.trim(),
          },
          {
            fontSize: 9,
            alignment: "left",
            text: el.cuenta.trim(),
          },
          {
            fontSize: 9,
            alignment: "left",
            text: el.rut.trim() + " id:" + parseFloat(el.idrut),
          },
          {
            fontSize: 9,
            alignment: "left",
            text: el.nroext.trim(),
          },
          {
            fontSize: 9,
            alignment: "left",
            text: el.ccosto.trim(),
          },
          {
            fontSize: 9,
            alignment: "right",
            text: el.debito.replace(/\ /g, ""),
          },
          {
            fontSize: 9,
            alignment: "right",
            text: el.credito.replace(/\ /g, ""),
          },
          {
            fontSize: 9,
            alignment: "left",
            text: el.detalle.trim(),
          },
        ]);
      }
    });

    datosTabla.push([
      {
        fontSize: 9,
        alignment: "right",
        text: "",
      },
      {
        fontSize: 9,
        alignment: "left",
        text: "",
      },
      {
        fontSize: 9,
        alignment: "left",
        text: "",
      },
      {
        fontSize: 9,
        alignment: "left",
        text: "",
      },
      {
        fontSize: 11,
        alignment: "left",
        bold: true,
        text: "Total",
      },
      {
        fontSize: 11,
        alignment: "right",
        bold: true,
        text: formatNumero(totalDeb),
      },
      {
        fontSize: 11,
        bold: true,
        alignment: "right",
        text: formatNumero(totalCred),
      },
      {
        fontSize: 9,
        alignment: "left",
        text: "",
      },
    ]);

    datosTabla.unshift([
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "Item",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "Cuenta",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "RUT",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "Documento",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "C. Costo",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "Débito",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "Crédito",
      },
      {
        fontSize: 10,
        color: "#aaaaaa",
        alignment: "center",
        text: "Detalle",
      },
    ]);

    var margin = {
      left: 40,
      right: 40,
    };

    let header_comprobantesEgreso = function (pageSize, currentPage) {
      return data.tipo_documento == "COMPROBANTES DE EGRESO" && currentPage == 1
        ? [
          {
            margin: [margin.left, 20, margin.right + 20, 0],
            text: `${data.fechadoc.substr(0, 4)}   ${data.fechadoc.substr(
              4,
              2
            )}   ${data.fechadoc.substr(6, 2)}         ***${formatNumero(
              vlrcheque
            )}.00`,
            style: "right",
          },
          {
            margin: [margin.left + 20, 20, margin.right, 0],
            text: data.rutcheque.trim(),
            bold: true,
          },
          {
            margin: [margin.left, 20, margin.right, 0],
            text: numeroALetras(vlrcheque) + "***************************",
            bold: true,
          },
          {
            margin: [0, 20, 0, 0],
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
        ]
        : [{}];
    };

    const headerDefault = () => {
      return {
        margin: [margin.left, 20, margin.right, 0],
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
            width: "50%",
            bold: true,
            fontSize: 11,
            stack: [
              data.empresa.descrip_empr,
              `NIT. ${formatNumero(
                parseInt(data.empresa.id_empr.replace(/\,/g, ""))
              )}`,
              `Dir. ${data.empresa.direccion_empr}`,
              `Tel. ${data.empresa.telefono_empr}`,
              `${data.empresa.Ciudad} - ${data.empresa.Departamento}`,
            ],
          },
          {
            width: "30%",
            bold: true,
            fontSize: 11,
            alignment: "center",
            stack: [
              data.tipo_documento.toUpperCase(),
              "Número: " + data.consecutivo.trim(),
              "Fecha: " + data.fecha.trim(),
            ],
          },
        ],
      }
    }

    var dd = {

      // watermark:
      //   data.estado == "1"
      //     ? {
      //       text: `ANULADO\n${data.modifica.trim()}`,
      //       color: "black",
      //       fontSize: 50,
      //       opacity: 0.3,
      //       bold: true,
      //     }
      //     : {},


      background: data.estado == "1"
        ? function (currentPage, pageSize) {
          return [
            {
              text: "ANULADO",
              color: "black",
              fontSize: 40,
              bold: true,
              opacity: 0.3,
              angle: 45,
              absolutePosition: { x: pageSize.width / 2 - 120, y: pageSize.height / 2 - 60 }
            },
            {
              text: data.modifica.trim(),
              color: "black",
              fontSize: 18,
              bold: false,
              opacity: 0.3,
              angle: 45,
              absolutePosition: { x: pageSize.width / 2 - 120, y: pageSize.height / 2 }
            }

          ];
        }
        : null,

      pageMargins: [
        margin.left,
        data.tipo_documento == "COMPROBANTES DE EGRESO" ? 160 : 100,
        margin.right,
        60,
      ],
      header: function (currentPage, pageCount, pageSize) {
        return [
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
          ...header_comprobantesEgreso(pageSize, currentPage),
          (currentPage != 1 || data.tipo_documento != "COMPROBANTES DE EGRESO") ? headerDefault() : {},
        ];
      },
      content: [
        data.tipo_documento == "COMPROBANTES DE EGRESO" ? { ...headerDefault(), margin: [0, 0, 0, 0] } : {},
        {
          margin: [0, 20, 0, 0],
          table: {
            headerRows: 1,
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
            body: datosTabla,
          },
          layout: "lightHorizontalLines",
        },
        {
          margin: [0, 40, 0, 0],
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                {
                  fontSize: 8,
                  bold: true,
                  stack: ["Generó: ", data.genero.trim(), data.fechagen.trim(), data.horagen.trim()],
                },
                {
                  fontSize: 8,
                  bold: true,
                  stack: ["Imprimió: ", data.imprime.trim(), data.fechaimprime.trim()],
                },

                {
                  fontSize: 8,
                  bold: true,
                  stack: ["Revisó: ", "", ""],
                },
                {
                  fontSize: 8,
                  bold: true,
                  stack: ["Aceptado: "],
                },
              ],
            ],
          },
        },
      ],
      styles: {
        right: {
          bold: true,
          alignment: "right",
        },
      },
      images: {
        logo: data.logo,
      },
    };

    pdfMake.createPdf(dd).open();
  });
};

var numeroALetras = (function () {
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }

    return "";
  } //Unidades()

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOSCIENTOS " + Decenas(decenas);
      case 3:
        return "TRESCIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let letras = "";

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += "";

    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;

    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "PESOS M/CTE", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || "PESO M/CTE", //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || "M/CTE",
      letrasMonedaCentavoSingular: currency.centSingular || "M/CTE",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  };
})();

export {
  cierre_caja,
  cierreCajaPto,
  contrato_titan,
  comprobantes_inv,
  comprobantes_inv_pos,
  doc_soporte,
  doc_ordencompra,
  doc_ordencotiza,
  doc_remision,
  factura,
  formato_contable,
  factura_titan,
  factura_gyro,
  libro_viaje,
  nomina_elect,
  pedido,
  reteica,
  rec_cierrecajero,
  solicitudDescuento,
  validacion_rc,
  validacion2_rc,
  vincAsociados,
  coingasco,
  comprobante_tes,
  declaracion_impuesto,
  esfm,
  esfc,
  conciliacion,
  escala_2years,
  proforma,
  ncredito_titan,
  ndebito_titan,
  proforma_titan,
  reporte_aux
};

