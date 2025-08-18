import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;



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

const reporteCartera = data => {
  return new Promise(res => {
    let sumaCarteras = {
      cant: 0,
      valor: 0,
    }
    const carteras = data.carteras_rep.map((el) => {
      sumaCarteras.cant += parseInt(el.cant_rep);
      sumaCarteras.valor += parseFloat(el.valor_rep.replace(/\,/g, ""));
      return [
        el.estado_rep.trim(),
        { text: el.cant_rep.trim(), alignment: "right" },
        { text: el.valor_rep.trim(), style: "boldright" },
        { text: el.porc_rep, style: "boldright" },
      ]
    }
    );

    const margin = {
      left: 30,
      right: 30
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
      pageMargins: [margin.left, 120, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          columns: [
            {
              width: "30%",
              image: data.logo,
              fit: [140, 140],
              margin: [6, 0, 0, 0]
            },
            {
              fontSize: 10,
              alignment: "center",
              stack: [
                data.nombre_empr,
                { margin: [0, 6, 0, 0], text: `NIT: ${data.nit_empr}` },
                { margin: [0, 6, 0, 0], text: `DETALLADO DE CARTERA CON CORTE A ${data.fecha_rep}` }
              ]
            }
          ]
        }

      },
      content: [
        {

          table: {
            widths: ["*", "auto", "*", "*"],
            body: [
              [
                { text: "DETALLE CARTERA", bold: true},
                { text: "INMUEBLES", bold: true},
                { text: "TOTAL CARTERA", bold: true},
                { text: "% SOBRE EL TOTAL DE CARTERA", bold: true},
              ],
              ...carteras,
              [
                { text: "TOTAL", bold: true },
                { text: sumaCarteras.cant, style: "boldright" },
                { text: formatNumero(sumaCarteras.valor), style: "boldright" },
                { text: "100%", style: "boldright" },
              ]

            ]
          }
        }, 
        {
          margin: [0,20,0,0],
          alignment: "center",
          stack: [
            {text: "TOTAL CARTERA", bold: true, fontSize: 12},
            {
              image: data.graficoPastel,
            }
          ]
          
        }
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};

const factura_titan = async (data, getBase64, masiva) => {

  let url = " ";
  url = "https://www.avalpaycenter.com/wps/portal/portal-de-pagos/web/pagos-aval/resultado-busqueda/realizar-pago?idConv=00003762&origen=buscar"
  let qr = await QRCode.toDataURL(url);
  return new Promise(res => {


    const margin = {
      left: 30,
      right: 10
    };

    let totales = data.totales[0]
    let productos = [];
    let cuotas = [];
    let impuestos = [];
    let retenciones = [];
    let observaciones = "";
    let descripcion = "";
    let descripcion64 = "";

    data.productos.forEach((p, i) => {
      descripcion = p.nombre_servicio;
      p.nombre_servicio = descripcion.trim();
      if (p.codigo == "1100" || p.codigo == "1101") {
        p.cantidad = ""
      }

      productos.push([
        i + 1,
        // p.codigo,
        { text: p.nombre_servicio.trim(), alignment: "left" },
        { text: p.cantidad.trim(), alignment: "right" },
        { text: p.vlr_unit.trim(), alignment: "right" },
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
    });

    var dd = {
      // pageSize: 'A5',
      // pageSize: {
      //   width: 500,
      //   height: 450
      // },
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
      pageMargins: [margin.left, 90, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 10, margin.right, 0],
          columns: [
            {
              image: data.logo,
              width: 120,
              height: 40,
              margin: [6, 0, 0, 0]
            },

            {
              width: "40%",
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
                { text: data.unidadph_fact, fontSize: 12, style: "bold", margin: [0, 5, 0, 0] },
              ]
            },
          ]
        }
      },
      // footer: function (currentPage, pageCount) {
      //   return {
      //     fontSize: 7,
      //     margin: [margin.left, 0, margin.right, 0],
      //     alignment: "center",
      //     stack: [
      //       `Software Propio Fabricado por Titan Soluciones Sas Nit:901289171`
      //     ]
      //   }

      // },
      pageOrientation: 'portrait',
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
                        { text: `CC O NIT: ${data.nit_cliente.trim()} - ${data.dv_cliente}  `, margin: [0, 2, 0, 0] },
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
                        { text: "Plazo Para Pagar:", margin: [0, 2, 0, 0] },
                        { text: "Fecha Vencimiento:", margin: [0, 2, 0, 0] },
                        { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
                      ]
                    },
                    {

                      width: "*",
                      stack: [
                        { text: data.forma_pago + " " + data.medio_pago, margin: [0, 2, 0, 0] },
                        { text: data.plazo_pago, margin: [0, 2, 0, 0] },
                        { text: data.vencecorta_factura, margin: [0, 2, 0, 0] },
                        " "

                      ]
                    },
                    {
                      margin: [0, 0, 10, 0],
                      width: 90,
                      stack: [
                        { text: "Pague Aquí:", alignment: "center" },
                        {
                          width: 70,
                          image: qr,

                        },
                      ]
                    }

                  ]
                },
              ]
            ]
          }
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 7,
          table: {
            widths: ["3%", "*", "10%", "10%", "10%"],
            body: [
              [
                { text: "#", style: "boldcenter" },
                { text: "Descripción", style: "boldcenter" },
                { text: "Cantidad", style: "boldcenter" },
                { text: "Unitario", style: "boldcenter" },
                { text: "Total", style: "boldcenter" },
              ],
              ...productos
            ]
          }
        },
        {
          fontSize: 8,
          margin: [0, 5, 0, 0],
          alignment: "right",
          columns: [
            (totales.saldoafavor == "1") ?
              {
                width: "80%",
                stack: [
                  "Total Saldo a Favor",
                  ""
                ]
              } :
              {
                width: "80%",
                stack: [
                  "Total cobros",
                  "Valor Pago oportuno hasta el dia " + data.diamax_fact
                ]
              },
            (totales.saldoafavor == "1") ?
              {
                stack: [
                  { text: `${totales.total.trim()}\n` },
                ]
              } :
              {
                stack: [
                  { text: `${totales.total.trim()}\n` },
                  { text: `${totales.neto.trim()}\n` },
                ]
              },

          ]
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 8.5,
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    {
                      text: `NOTAS: ${data.observaciones}`, margin: [0, 2, 0, 0]
                    },
                  ]
                }
              ]
            ]
          }
        },
        { text: `Favor consignar en la cuenta corriente 603 017 013 Banco AvVillas`, style: "boldred",  alignment: "center", fontSize: 12  },

      ]
    };

    if (masiva) {
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBuffer(res);
    } else {
      pdfMake.createPdf(dd).open();
      res();
    }
  })
};

export {
  factura_titan,
  reporteCartera
};

