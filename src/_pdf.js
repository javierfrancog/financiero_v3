var pdfMake = require("pdfmake/build/pdfmake.js");
var pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import QRCode from 'qrcode'

function _informe(datos) {
  let margin = {
    left: datos.margin?.[0] ?? 60,
    right: datos.margin?.[1] ?? 40,
  }
  var width_table = [];
  if (!datos.width_table) {
    datos.data[0].forEach(() => width_table.push("auto"));
  } else {
    width_table = datos.width_table;
  }

  var content = {
    pageOrientation: datos.orientation || "portrait",
    pageMargins: [margin.left, 110, margin.right, 40],
    footer: function (currentPage, pageCount) {
      return [
        {
          fontSize: 10,
          margin: [margin.left, 0, margin.right, 0],
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
    header: function (currentPage, pageCount, pageSize) {
      return [
        {
          margin: [margin.left, 20, margin.right, 20],
          columns: [
            {
              width: "70%",
              stack: [
                {
                  text: `${datos.titulo || "titulo"} \n`.toUpperCase(),
                  bold: true,
                  fontSize: 14,
                },
                { stack: datos.header_pdf || null },
              ],
            },
            {
              width: "30%",
              stack: [
                {
                  image: datos.logo,
                  // width: 100,
                  fit: datos.fitSizeLogo ?? [50, 50],
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
          margin: [margin.left, 0, margin.right, 0],
        },
      ];
    },
    content: [
      {
        fontSize: datos.fontSize || 12,
        layout: "lightHorizontalLines",
        table: {
          headerRows: 1,
          widths: width_table,
          body: datos.data,
        },
      },
    ],
    styles: {
      header_table: {
        bold: true,
      },
    },
  };

  pdfMake.createPdf(content).open();
}
const prfact02_pos = async (data, logo) => {
  let desctitulo = "Documento equivalente";
  let observacion64 = window.atob(data.Observaciones64.trim());
   

  if (data.iddian_fact) {
    desctitulo = "Factura Eléctronica de Venta"
  }
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian_fact
  let qr = await QRCode.toDataURL(url);

  return new Promise((res) => {
    let impuestosTabla = [];
    data.impuestos.pop();
    data.impuestos.forEach(imp => {
      impuestosTabla.push({
        columns: [
          {
            width: "40%",
            text: imp.tipo,

          },
          {
            width: "17%",
            text: imp.porcentaje,
          },
          {
            width: "25%",
            text: imp.base.trim(),
          },
          {
            width: "25%",
            text: imp.valor.trim(),
          },
        ],
      },)
    })
    let width = 210;
    var total = 0;
    var productos = [];
    let descripcion = "";
    let descripcion64 = "";
    data.productos.forEach((el) => {
      descripcion64 = window.atob(
        el.base1_pr.trim() +
        el.base2_pr.trim() +
        el.base3_pr.trim() +
        el.base4_pr.trim() +
        el.base5_pr.trim())
      if (descripcion64) {
        descripcion = descripcion64 + " " + el.detprod;
        el.nombre_servicio = descripcion
      } else {
        descripcion = el.nombre_servicio + " " + el.detprod;
      }

      let vlriva = el.vlr_iva.trim().replace(/\,/g, "")
      let vlrinc = el.vlr_impoconsumo.trim().replace(/\,/g, "")
      if (vlriva) { total += parseFloat(el.vlr_iva.trim().replace(/\,/g, "")) }
      if (vlrinc) { total += parseFloat(el.vlr_impoconsumo.trim().replace(/\,/g, "")) }

      total += parseFloat(el.vlr_subtotal.trim().replace(/\,/g, ""));
      productos.push({
        stack: [
          el.nombre_servicio.trim(),
          {
            columns: [
              {
                text: el.cantidad.trim(),
                width: "60%",
                alignment: "right",
              },
              {
                text: el.tot_producto.trim(),
                width: "40%",
                alignment: "center",
                margin: [30, 0, 0, 0],
              },
            ],
          },
        ],
      });
    });

    let dd = {
      // pageSize: "A7",
      pageSize: {
        width,
        height: "auto",
      },
      pageMargins: [2, 2, 15, 10],
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        headers: {
          margin: [0, 1],
          alignment: "center",
        },
      },
      content: [
        {
          stack: [
            {
              width: 90,
              image: logo,
              alignment: "center",
              bold: true,
            },
          ],
        },
        {
          text: [
            { text: `${data.nombre_empresa}\n`, bold: true },
            `Nit. ${data.nit_empresa}\n`,
            `Telefono:${data.telefono_empresa}\n`,
            `${data.direccion_empresa}\n`,
            data.ciudad_empresa,
          ],
          alignment: "center",
        },
        {
          text: data.regimen_empresa.toUpperCase(),
          margin: [0, 5],
          alignment: "center",
          bold: true,
        },
        {
          stack: [
            (data.iddian_fact) ? {
              fit: [80, 80],
              alignment: "center",
              image: "qr",
            } : {},
            {
              text: `${desctitulo} Nro. ${data.numero_fact.trim()}`,
              bold: true,
              style: "headers",
            },
            {
              text: `Resolución DIAN ${data.nrores_dian.replace(/\s\s+/g, " ")}`,
              style: "headers",
            },
            {
              text: `Rango: ${data.rango_dian.replace(/\s\s+/g, " ")}`,
              alignment: "center",
              style: "headers",
            },
          ],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 20,
              // x2: pageSize.width - 20,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          stack: [
            {
              text: `Fecha: ${data.fecha_factura.replace(/\s\s+/g, " ")}`,
              margin: [0, 1],
              alignment: "left",
            },
            {
              text: `Cliente: ${data.nit_cliente} - ${data.nombre_cliente}`,
              margin: [0, 1],
              alignment: "left",
              fontSize: 8,
            },
            {
              text: `Asesor: ${data.asesor}`,
              margin: [0, 1],
              alignment: "left",
              fontSize: 8,
            },
            {
              text: `Forma Pago: ${data.forma_pago}`,
              margin: [0, 1],
              alignment: "left",
              fontSize: 8,
            },
            {
              text: `Fecha Vence: ${data.fecha_vence}`,
              margin: [0, 1],
              alignment: "left",
              fontSize: 8,
            },

          ],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 20,
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
              width: "50%",
              text: "Producto",
              bold: true,
            },
            {
              width: "30%",
              text: "Cantidad",
              alignment: "left",
              bold: true,
            },
            {
              width: "20%",
              text: "Valor",
              alignment: "center",
              bold: true,
            },
          ],
          margin: [0, 0, 0, 5],
        },
        productos,
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 20,
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
              fontSize: 12,
            },
            {
              width: "40%",
              text: `$ ${formatNumero(total)}`,
              alignment: "center",
              bold: true,
              fontSize: 12,
            },
          ],
        },
        {
          columns: [
            {
              width: "40%",
              text: "Impuesto",
            },
            {
              width: "20%",
              text: "Tarifa",
            },
            {
              width: "20%",
              text: "Base",
            },
            {
              width: "20%",
              text: "Valor",
            },
          ],
          margin: [0, 10, 0, 0],
        },
        // {
        //   columns: [
        //     {
        //       width: "40%",
        //       text: data.descimpto1,
        //     },
        //     {
        //       width: "30%",
        //       text: data.tarifa1,
        //     },
        //     {
        //       width: "20%",
        //       text: data.base_iva1,
        //     },
        //     {
        //       width: "20%",
        //       text: data.vlr_iva1,
        //     },
        //   ],
        // },
        ...impuestosTabla,
        {
          text: `Observaciones: ${observacion64.trim()} \n`,
          alignment: "center",
          margin: [0, 10, 0, 10],
 
        },

        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width - 20,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 5, space: 2 },
            },
          ],
          margin: [0, 5, 0, 10],
        },
        {
          text: `Cufe: ${data.iddian_fact.trim()} \n`,
          alignment: "center",
        },
        {
          text: `Maquina: ${data.maqpos_fact} Nombre Maquina: ${data.nommaqpos_fact.trim()} \n`,
        },
        {
          text: `Ubicación: ${data.ubicamaqpos_fact.trim()} \n`,
        },

        {
          text: `Atendido por: ${data.elaboro.trim()} \n`,
        },
        {
          text: `Software: Titán Soluciones Sas \n\n.`,
          alignment: "center",
        },
      ],
      images: {
        qr
      }
    };

    // pdfMake.createPdf(dd).open();
    pdfMake.createPdf(dd).print();

    res();
  })
};

var remision_pos = (data, logo) => {
  let width = 210;
  var total = parseFloat(data.total_rem.trim().replace(/\,/g, ""));
  var productos = [];
  let descripcion = "";
  let descripcion64 = "";
  data.productos.forEach((el) => {
    descripcion64 = window.atob(
      el.base1_pr.trim() +
      el.base2_pr.trim() +
      el.base3_pr.trim() +
      el.base4_pr.trim() +
      el.base5_pr.trim())
    if (descripcion64) {
      descripcion = descripcion64;
    } else {
      descripcion = el.nombre_servicio;
    }

    // total += parseFloat(el.vlr_subtotal.trim().replace(/\,/g, ""));
    productos.push({
      stack: [
        { text: el.nombre_servicio.trim() + "_" + el.descpres_rep.trim(), fontSize: 7 },
        {
          columns: [
            {
              text: " ",
              width: "30%",
            },
            {
              text: el.cantidad.trim(),
              width: "20%",
              alignment: "center",
            },

            {
              text: el.vlr_unit.trim(),
              width: "20%",
              alignment: "center",
            },
            {
              text: el.vlr_subtotal.trim(),
              width: "30%",
              alignment: "center",
              margin: [10, 0, 0, 0],
            },
          ],
        },
      ],
    });
  });

  return {
    // pageSize: "A7",
    pageSize: {
      width,
      height: "auto",
    },
    pageMargins: [2, 2, 15, 10],
    defaultStyle: {
      fontSize: 8,
    },
    styles: {
      headers: {
        margin: [0, 1],
        alignment: "center",
      },
    },
    content: [
      {
        stack: [
          {
            width: 90,
            image: logo,
            alignment: "center",
            bold: true,
          },
        ],
      },
      {
        text: [
          { text: `${data.nombre_empresa}\n`, bold: true },
          `Nit. ${data.nit_empresa}\n`,
          `Telefono:  ${data.telefono_empresa ? data.telefono_empresa.trim().replace(/\,/g, " ") : ''}\n`,
          `Telefóno Ruta 1:  322.248.9847 \n`,
          `Telefóno Ruta 2:  314.605.1977 \n`,

          `${data.direccion_empresa}\n`,
          data.ciudad_empresa,
        ],
        alignment: "center",
      },
      {
        text: " ",
        margin: [0, 5],
        alignment: "center",
        bold: true,
      },
      {
        stack: [
          {
            text: `REMISION Nro. ${data.numero_fact.trim()}`,
            bold: true,
            style: "headers",
            fontSize: 14,
          },
          {
            // text: `Resolución DIAN ${data.nrores_dian.replace(/\s\s+/g, " ")}`,
            text: ` `,
            style: "headers",
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
            // x2: pageSize.width - 20,
            y2: 0,
            lineWidth: 0.5,
            dash: { length: 5, space: 2 },
          },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        stack: [
          {
            text: `Fecha: ${data.fecha_factura.replace(/\s\s+/g, " ")}`,
            margin: [0, 1],
            alignment: "left",
          },
          {
            text: `Cliente: ${data.nit_cliente} - ${data.nombre_cliente}`,
            margin: [0, 1],
            alignment: "left",
            fontSize: 8,
          },
          {
            text: `Forma de Pago: ${data.forma_pago}`,
            margin: [0, 1],
            alignment: "left",
            fontSize: 8,
          },
          {
            text: `Vendedor: ${data.elaboro}`,
            margin: [0, 1],
            alignment: "left",
            fontSize: 8,
          },


        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
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
            width: "35%",
            text: "Producto",
            bold: true,
          },
          {
            width: "20%",
            text: "Cantidad",
            alignment: "left",
            bold: true,
          },
          {
            width: "15%",
            text: "Unitario",
            alignment: "left",
            bold: true,
          },

          {
            width: "30%",
            text: "Subtotal",
            alignment: "center",
            bold: true,
          },
        ],
        margin: [0, 0, 0, 5],
      },
      productos,
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
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
            fontSize: 12,
          },
          {
            width: "40%",
            text: `$ ${formatNumero(total)}`,
            alignment: "center",
            bold: true,
            fontSize: 12,
          },
        ],
      },
      {
        columns: [
          {
            width: "40%",
            text: "Tarifa",
          },
          {
            width: "30%",
            text: "Base",
          },
          {
            width: "30%",
            text: "Iva",
          },
        ],
        margin: [0, 15, 0, 0],
      },
      {
        columns: [
          {
            width: "40%",
            text: data.tarifa1,
          },
          {
            width: "30%",
            text: data.base_iva1,
          },
          {
            width: "30%",
            text: data.vlr_iva1,
          },
        ],
      },
      {
        columns: [
          {
            width: "40%",
            text: data.tarifa2,
          },
          {
            width: "30%",
            text: data.base_iva2,
          },
          {
            width: "30%",
            text: data.vlr_iva2,
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
            y2: 0,
            lineWidth: 0.5,
            dash: { length: 5, space: 2 },
          },
        ],
        margin: [0, 5, 0, 10],
      },
      [
        {
          columns: [
            {
              width: "40%",
              text: "0%",
            },
            {
              width: "30%",
              text: "0",
            },
            {
              width: "30%",
              text: "0",
            },
          ],
        },
      ],
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
            y2: 0,
            lineWidth: 0.5,
            dash: { length: 5, space: 2 },
          },
        ],
        margin: [0, 5, 0, 10],
      },
      {
        text: `Atendido por: ${data.elaboro.trim()} \n\n\n\n\n`,
      },
      {
        text: `Firma del Cliente: ________________________________ \n\n\n\n`,
      },

      {
        text: `Software: Titán Soluciones Sas \n\n.`,
        alignment: "center",
      },
    ],
  };
};
var prcotiza02_pos = (data, logo) => {
  let width = 210;
  var total = parseFloat(data.total_iva.trim().replace(/\,/g, ""));
  var productos = [];
  let descripcion = "";
  let descripcion64 = "";
  data.productos.forEach((el) => {
    descripcion64 = window.atob(
      el.base1_pr.trim() +
      el.base2_pr.trim() +
      el.base3_pr.trim() +
      el.base4_pr.trim() +
      el.base5_pr.trim())
    if (descripcion64) {
      descripcion = descripcion64;
    } else {
      descripcion = el.nombre_servicio;
    }

    total += parseFloat(el.vlr_subtotal.trim().replace(/\,/g, ""));
    productos.push({
      stack: [
        { text: el.nombre_servicio.trim(), fontSize: 7.5 },
        {
          columns: [
            {
              text: el.cantidad.trim(),
              width: "60%",
              alignment: "right",
            },
            {
              text: el.vlr_totalprod.trim(),
              width: "40%",
              alignment: "center",
              margin: [30, 0, 0, 0],
            },
          ],
        },
      ],
    });
  });

  return {
    // pageSize: "A7",
    pageSize: {
      width,
      height: "auto",
    },
    pageMargins: [2, 2, 15, 10],
    defaultStyle: {
      fontSize: 8,
    },
    styles: {
      headers: {
        margin: [0, 1],
        alignment: "center",
      },
    },
    content: [
      {
        stack: [
          {
            width: 90,
            image: logo,
            alignment: "center",
            bold: true,
          },
        ],
      },
      {
        text: [
          { text: `${data.nombre_empresa}\n`, bold: true },
          `Nit. ${data.nit_empresa}\n`,
          `Telefono:  ${data.telefono_empresa ? data.telefono_empresa.trim().replace(/\,/g, " ") : ''}\n`,
          `${data.direccion_empresa}\n`,
          data.ciudad_empresa,
        ],
        alignment: "center",
      },
      {
        text: " ",
        margin: [0, 5],
        alignment: "center",
        bold: true,
      },
      {
        stack: [
          {
            text: `COTIZACION Nro. ${data.numero_fact.trim()}`,
            bold: true,
            style: "headers",
            fontSize: 14,
          },
          {
            // text: `Resolución DIAN ${data.nrores_dian.replace(/\s\s+/g, " ")}`,
            text: ` `,
            style: "headers",
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
            // x2: pageSize.width - 20,
            y2: 0,
            lineWidth: 0.5,
            dash: { length: 5, space: 2 },
          },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        stack: [
          {
            text: `Fecha: ${data.fecha_factura.replace(/\s\s+/g, " ")}`,
            margin: [0, 1],
            alignment: "left",
          },
          {
            text: `Cliente: ${data.nit_cliente} - ${data.nombre_cliente}`,
            margin: [0, 1],
            alignment: "left",
            fontSize: 8,
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
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
            width: "50%",
            text: "Producto",
            bold: true,
          },
          {
            width: "30%",
            text: "Cantidad",
            alignment: "left",
            bold: true,
          },
          {
            width: "20%",
            text: "Valor",
            alignment: "center",
            bold: true,
          },
        ],
        margin: [0, 0, 0, 5],
      },
      productos,
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
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
            fontSize: 12,
          },
          {
            width: "40%",
            text: `$ ${formatNumero(total)}`,
            alignment: "center",
            bold: true,
            fontSize: 12,
          },
        ],
      },
      {
        columns: [
          {
            width: "40%",
            text: "Tarifa",
          },
          {
            width: "30%",
            text: "Base",
          },
          {
            width: "30%",
            text: "Iva",
          },
        ],
        margin: [0, 15, 0, 0],
      },
      {
        columns: [
          {
            width: "40%",
            text: data.tarifa1,
          },
          {
            width: "30%",
            text: data.base_iva1,
          },
          {
            width: "30%",
            text: data.vlr_iva1,
          },
        ],
      },
      {
        columns: [
          {
            width: "40%",
            text: data.tarifa2,
          },
          {
            width: "30%",
            text: data.base_iva2,
          },
          {
            width: "30%",
            text: data.vlr_iva2,
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
            y2: 0,
            lineWidth: 0.5,
            dash: { length: 5, space: 2 },
          },
        ],
        margin: [0, 5, 0, 10],
      },
      [
        {
          columns: [
            {
              width: "40%",
              text: "0%",
            },
            {
              width: "30%",
              text: "0",
            },
            {
              width: "30%",
              text: "0",
            },
          ],
        },
      ],
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width - 20,
            y2: 0,
            lineWidth: 0.5,
            dash: { length: 5, space: 2 },
          },
        ],
        margin: [0, 5, 0, 10],
      },
      {
        text: `Atendido por: ${data.elaboro.trim()} \n`,
      },
      {
        text: `Software: Titán Soluciones Sas \n\n.`,
        alignment: "center",
      },
    ],
  };
};

const prcotizacion = (data, logo) => {
  var datos_tabla = [];
  let heightsProductos = [10];

  var subTotal = 0;
  var descuento = 0;
  var totalIva = parseFloat(data.total_iva.replace(/\,/g, "")) || 0;

  data.productos.forEach((el, index) => {
    let subTotal_item = parseFloat(el.vlr_subtotal.replace(/\,/g, "")) || 0;
    subTotal += subTotal_item;

    let descuento_item = parseFloat(el.vlr_dcto.replace(/\,/g, "")) || 0;
    descuento += descuento_item;

    let descripcion64 =
      el.base1_pr + el.base2_pr + el.base3_pr + el.base4_pr + el.base5_pr;
    if (descripcion64) {
      el.nombre_servicio = window.atob(descripcion64);
    }
    datos_tabla.push([
      {
        text: el.codigo.trim(),
      },
      {
        text: el.nombre_servicio.trim(),
      },
      {
        text: el.cantidad.trim(),
        alignment: "right",
      },
      {
        text: el.vlr_unit.trim(),
        alignment: "right",
      },
      {
        text: el.vlr_dcto.trim() || "0.00",
        alignment: "right",
      },
      {
        text: el.vlr_totalprod.trim(),
        alignment: "right",
      },
    ]);

    if (index + 1 == data.productos.length) {
      let heightTotal = 0;
      heightsProductos.forEach((el) => (heightTotal += el));
      heightsProductos.push(170 - heightTotal);
    } else heightsProductos.push(20);
  });

  var subtotal_total = subTotal - descuento;
  var total_factura = subtotal_total + totalIva;

  datos_tabla.unshift([
    {
      text: "Código".toUpperCase(),
      style: "headerTabla",
      alignment: "center",
    },
    {
      text: "Descripción".toUpperCase(),
      style: "headerTabla",
      alignment: "center",
    },
    {
      text: "Cantidad".toUpperCase(),
      style: "headerTabla",
      alignment: "center",
    },
    {
      text: "Vlr. unitario".toUpperCase(),
      style: "headerTabla",
      alignment: "center",
    },
    {
      text: "Descuento".toUpperCase(),
      style: "headerTabla",
      alignment: "center",
    },
    {
      text: "Total".toUpperCase(),
      style: "headerTabla",
      alignment: "center",
    },
  ]);

  var margin = {
    left: 40,
    right: 40,
  };

  return {
    pageMargins: [margin.left, 230, margin.right, 50],
    footer: function (currentPage, pageCount) {
      return [
        {
          fontSize: 10,
          margin: [60, 0, 40, 0],
          columns: [
            {
              text: "Impreso por: Titán Soluciones SAS nit 901,289,171-0",
              alignment: "left",
              width: "70%",
            },
            {
              text: currentPage.toString() + " de " + pageCount,
              alignment: "right",
              width: "30%",
            },
          ],
        },
      ];
    },
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
                  fit: [80, 80],
                },
              ],
            },
            {
              fontSize: 10,
              stack: [
                { text: data.nombre_empresa, style: "header" },
                `NIT:               ${data.nit_empresa
                  .replace(/\,/g, "")
                  .trim()}`,
                `Régimen:     ${data.regimen_empresa.trim()}`,
                `Dirección:    ${data.direccion_empresa.toLowerCase()} ${data.ciudad_empresa.replace(
                  / /g, "")}`,
                `Teléfono:     ${data.telefono_empresa.trim()}`
              ],
            },
            {
              fontSize: 11,
              alignment: "center",
              stack: [
                "Cotización".toUpperCase(),
                "Número: " + data.numero_fact.trim(),
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
        {
          margin: [margin.left, 10, margin.left, 0],
          fontSize: 10,
          columns: [
            {
              width: "60%",
              stack: [
                {
                  text: [
                    { text: "Cliente: ", style: "label" },
                    data.nombre_cliente.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Nit: ", style: "label" },
                    data.nit_cliente.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Dirección: ", style: "label" },
                    data.direccion_cliente.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Telefono: ", style: "label" },
                    data.telefono_cliente.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Ciudad: ", style: "label" },
                    data.ciudad_cliente.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Email: ", style: "label" },
                    data.email_cliente.trim(),
                  ],
                },
              ],
            },
            {
              width: "40%",
              stack: [
                {
                  text: [
                    {
                      text: "Fecha:",
                      style: "label",
                    },
                    data.fecha_factura.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Fecha vigencia: ", style: "label" },
                    data.fecha_vence.trim(),
                  ],
                },
                {
                  text: [
                    { text: "Forma de Pago: ", style: "label" },
                    data.forma_pago.trim(),
                  ],
                },
              ],
            },
          ],
        },
      ];
    },
    content: [
      {
        fontSize: 9,
        table: {
          headerRows: 1,
          widths: [35, "*", "auto", "auto", "auto", "auto"],
          heights: heightsProductos,
          body: datos_tabla,
        },
        layout: "lightHorizontalLines",
      },
      {
        margin: [0, 37, 0, 0],
        columns: [
          [
            {
              fontSize: 9,
              table: {
                widths: [320],
                heights: [70, 40],
                body: [
                  [
                    {
                      text: [
                        { text: "Observaciones: \n", bold: true },
                        data.observaciones.trim(),
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        { text: "SON: ", bold: true },
                        `    ${data.TotalEnLetras}`,
                      ],
                    },
                  ],
                ],
              },
            },
          ],
          [
            {
              fontSize: 9,
              table: {
                widths: ['auto', 110],
                heights: 19,
                body: [
                  [
                    { text: "Subtotal", bold: true },
                    {
                      text: formatNumero(subTotal),
                      alignment: "right",
                    },
                  ],
                  [
                    { text: "Descuentos", bold: true },
                    {
                      text: formatNumero(descuento),
                      alignment: "right",
                    },
                  ],
                  [
                    { text: "Subtotal", bold: true },
                    { text: formatNumero(subtotal_total), alignment: "right" },
                  ],
                  [
                    { text: "Iva", bold: true },
                    {
                      text: formatNumero(totalIva),
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: "Total cotización",
                      bold: true,
                    },
                    {
                      text: `$${formatNumero(total_factura)}`,
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
          ],
        ],
      },
      {
        margin: [0, 47, 0, 0],
        columns: [
          {
            width: "35%",
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
              { text: "Elaboró", alignment: "center", bold: true },
            ],
          },
          {
            width: "35%",
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
              { text: "Revisó", alignment: "center", bold: true },
            ],
          },
          {
            width: "30%",
            stack: [
              {
                text: "Generó:",
                bold: true,
                alignment: "center",
              },
              { text: data.elaboro.trim(), alignment: "center" },
            ],
          },
        ],
      },
    ],
    styles: {
      label: {
        bold: true,
      },
      headerTabla: {
        bold: true,
        fontSize: 8,
      },
      header: {
        bold: true,
        fontSize: 13,
      },
    },
    images: {
      logo,
    },
  };
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

function getBase64(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = url;
  });
}


var formatos = {
  data: () => {
    return {
      pdfs: {
        getBase64,
        prfact02_pos,
        prcotiza02_pos,
        prcotizacion,
        remision_pos,
        _informe,
      },
    };
  },
};

export { formatos };

