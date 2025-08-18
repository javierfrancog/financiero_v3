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
const pago_nomina  = async (data, sendEmail) => {

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
                  "Comprobante de Pago NOMINA ELECTRONICA".toUpperCase(),
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
          text: ["Neto pagado: ".toUpperCase(), data.netonomina_rep],
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
          text: "Recibí: __________________________________________",
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

const liquidagth = (data) => {
  return new Promise((res) => {
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

    let data_devengos = [];
    let data_deducciones = [];
    let total_devengos = 0;
    let total_deducciones = 0;
    let excluido = 0;
    data.basesliq_rep.forEach((el) => {
      if (el.codigo_rep.substring(0, 1) == "1") {
        let valor_devengos = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        if (el.exluido_rep == "1") {
          excluido += valor_devengos
        }


        total_devengos += valor_devengos;
        total_devengos = total_devengos - excluido;
        
        data_devengos.push([
          {
            text: el.descripcion_rep.trim(),
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.valorbase_rep.trim(),
            style: "content_tabla",
            alignment: "center",
          },
          // { text: "0", style: "content_tabla", alignment: "right" },
          {
            text: el.cantidad_rep.trim() || 0,
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.valor_rep.trim() || 0,
            style: "content_tabla",
            alignment: "right",
          },
        ]);
      } else if (el.codigo_rep.substring(0, 1) == "2") {
        let valor_deducciones =
          parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        total_deducciones += valor_deducciones;

        data_deducciones.push([
          {
            text: el.descripcion_rep.trim(),
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.cantidad_rep.trim() || 0,
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.valor_rep.trim() || 0,
            style: "content_tabla",
            alignment: "right",
          },
        ]);
      }
    });

    var dd = {
      watermark,
      pageMargins: [40, 250, 40, 40],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [40, 40, 40, 0],
            columns: [
              {
                width: "20%",
                stack: [
                  {
                    image: data.logo,
                    fit: [80, 80],
                  },
                ],
              },

              {
                width: "60%",
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
                ],
                alignment: "center",
                bold: true,
              },
              { width: "20%", text: "" },
            ],
          },
          {
            margin: [40, 10, 40, 0],
            layout: {
              hLineWidth: function (i, node) {
                return i === 0 ||
                  i === 1 ||
                  i === 5 ||
                  i === 6 ||
                  i === node.table.body.length
                  ? 1
                  : 0;
              },
              vLineWidth: function (i, node) {
                return i === 0 || i === node.table.widths.length ? 1 : 1;
              },
              fillColor: function (rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#dcdcdc" : "";
              },
            },
            table: {
              widths: ["25%", "75%"],
              body: [
                [
                  {
                    text: "Liquidación de contrato de trabajo ".toUpperCase() + " Nro:" + data.nro_rep,
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    colSpan: 2,
                  },
                  {},
                ],
                [
                  {
                    text: "Nombre y Apellidos:",
                    style: "content_tabla",
                    bold: true,
                  },
                  `${data.nombres_rep.trim()} ${data.Apellido1_rep.trim()} ${data.Apellido2_rep.trim()}`.toUpperCase(),
                ],
                [
                  {
                    text: "C.C:",
                    style: "content_tabla",
                    bold: true,
                  },
                  parseInt(data.identif_rep) || "",
                ],
                [
                  {
                    text: "Cargo:",
                    style: "content_tabla",
                    bold: true,
                  },
                  `${data.cargo_rep.trim()}`,
                ],
                [
                  {
                    text: "Causa de liquidación:".toUpperCase(),
                    style: "content_tabla",
                    bold: true,
                  },

                  {
                    text: `${data.causa_rep.trim()}`,
                    style: "content_tabla",
                  },
                ],
                [
                  {
                    colSpan: 2,
                    columns: [
                      {
                        text: "Fecha de inicio contrato:".toUpperCase(),
                        bold: true,
                        width: "35%",
                      },
                      {
                        text: `${data.fecha_ing_rep.trim()}`.toUpperCase(),
                        alignment: "left",
                      },
                      {
                        text: "Fecha terminación de contrato:".toUpperCase(),
                        bold: true,
                        width: "35%",
                      },
                      {
                        text: `${data.fecha_ret_rep.trim()}`.toUpperCase(),
                        alignment: "left",
                      },
                    ],
                    style: "content_tabla",
                  },
                  {},
                ],
                [
                  {
                    text: "Tiempo laborado:".toUpperCase(),
                    style: "content_tabla",
                    bold: true,
                  },
                  {
                    text: `${data.totdias_rep} Dias`.toUpperCase(),
                    style: "content_tabla",
                  },
                ],
              ],
            },
          },
        ];
      },
      styles: {
        content_tabla: {
          fontSize: 10,
        },
      },
      content: [
        {
          columns: [
            {
              width: "50%",
              margin: [0, 0, 5, 0],
              table: {
                widths: ["*", "*", "*", "*"],
                body: [
                  [
                    {
                      text: "Devengos".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Base".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Cantidad".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Valor".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                  ],
                  ...data_devengos,
                  [
                    {
                      text: "Total devengos".toUpperCase(),
                      fontSize: 9,
                      alignment: "right",
                      bold: true,
                      colSpan: 3,
                    },
                    {},
                    {},
                    {
                      text: formatNumero(total_devengos),
                      fontSize: 9,
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
            {
              width: "50%",
              margin: [5, 0, 0, 0],
              table: {
                widths: ["*", "*", "*"],
                body: [
                  [
                    {
                      text: "Deducciones".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Cantidad".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Valor".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                  ],
                  ...data_deducciones,
                  [
                    {
                      text: "Total descuentos".toUpperCase(),
                      fontSize: 9,
                      alignment: "right",
                      bold: true,
                      colSpan: 2,
                    },
                    {},
                    {
                      text: formatNumero(total_deducciones),
                      fontSize: 9,
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          alignment: "right",
          bold: true,
          text: `Neto a cancelar: $${formatNumero(
            total_devengos - total_deducciones
          )}`.toUpperCase(),
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "Se hace constar:\n\n".toUpperCase(),
                  bold: true,
                  style: "content_tabla",
                },
              ],
              [
                {
                  text:
                    "1. Que el patrono ha incorporado en la presente liquidación los importes correspondientes a salarios, horas extras, descansos compensatorios, cesantías,vacaciones, prima de servicios, auxilio de transporte, y en sí, todo concepto relacionado con salarios, prestaciones o indemnizaciones causadas al quedar extinguido el contrato de trabajo.",
                },
              ],
              [
                {
                  text: `2. Que con el pago del dinero anotado en la presente liquidación, queda transada cualquier diferencia relativa al contrato de trabajo extinguido, o a cualquier diferencia anterior. Por lo tanto, esta transacción tiene como efecto la terminaciónde las obligaciones provenientes de la relación laboral que existió entre ${data.desripEmpresa
                    .trim()
                    .toUpperCase()} y el trabajador, quienes declaran estar a paz y salvo por todo concepto.`,
                },
              ],
              [{ text: "Observacion: \n\n", style: "content_tabla" }],
              [
                {
                  columns: [
                    {
                      width: "70%",
                      style: "content_tabla",
                      bold: true,
                      stack: [
                        "______________________",
                        "El Empleado".toUpperCase(),
                        parseInt(data.identif_rep) || "",
                      ],
                    },
                    {
                      style: "content_tabla",
                      bold: true,
                      stack: [
                        "______________________",
                        "El Empleador".toUpperCase(),
                        data.idEmpresa,
                      ],
                    },
                  ],
                },
              ],
            ],
          },
        },
      ],
    };
    pdfMake.createPdf(dd).open();
    res();
  });
};
const vacacgth = (data) => {
  return new Promise((res) => {
    let data_devengos = [];
    let data_deducciones = [];
    let total_devengos = 0;
    let total_deducciones = 0;
    data.basesvac_rep.forEach((el) => {
      if (el.codigo_rep.substring(0, 1) == "1") {
        let valor_devengos = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        total_devengos += valor_devengos;

        data_devengos.push([
          {
            text: el.descripcion_rep.trim(),
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.valorbase_rep.trim(),
            style: "content_tabla",
            alignment: "center",
          },
          // { text: "0", style: "content_tabla", alignment: "right" },
          {
            text: el.cantidad_rep.trim() || 0,
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.valor_rep.trim() || 0,
            style: "content_tabla",
            alignment: "right",
          },
        ]);
      } else if (el.codigo_rep.substring(0, 1) == "2") {
        let valor_deducciones =
          parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        total_deducciones += valor_deducciones;

        data_deducciones.push([
          {
            text: el.descripcion_rep.trim(),
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.cantidad_rep.trim() || 0,
            style: "content_tabla",
            alignment: "center",
          },
          {
            text: el.valor_rep.trim() || 0,
            style: "content_tabla",
            alignment: "right",
          },
        ]);
      }
    });

    var dd = {
      pageMargins: [40, 250, 40, 40],
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [40, 40, 40, 0],
            columns: [
              {
                width: "20%",
                stack: [
                  {
                    image: data.logo,
                    fit: [80, 80],
                  },
                ],
              },

              {
                width: "60%",
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
                ],
                alignment: "center",
                bold: true,
              },
              { width: "20%", text: "" },
            ],
          },
          {
            margin: [40, 10, 40, 0],
            layout: {
              hLineWidth: function (i, node) {
                return i === 0 ||
                  i === 1 ||
                  i === 5 ||
                  i === 6 ||
                  i === node.table.body.length
                  ? 1
                  : 0;
              },
              vLineWidth: function (i, node) {
                return i === 0 || i === node.table.widths.length ? 1 : 1;
              },
              fillColor: function (rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#dcdcdc" : "";
              },
            },
            table: {
              widths: ["25%", "75%"],
              body: [
                [
                  {
                    text: "Liquidación de contrato de trabajo".toUpperCase(),
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    colSpan: 2,
                  },
                  {},
                ],
                [
                  {
                    text: "Nombre y Apellidos:",
                    style: "content_tabla",
                    bold: true,
                  },
                  `${data.nombres_rep.trim()} ${data.Apellido1_rep.trim()} ${data.Apellido2_rep.trim()}`.toUpperCase(),
                ],
                [
                  {
                    text: "C.C:",
                    style: "content_tabla",
                    bold: true,
                  },
                  parseInt(data.identif_rep) || "",
                ],
                [
                  {
                    text: "Cargo:",
                    style: "content_tabla",
                    bold: true,
                  },
                  `${data.cargo_rep.trim()}`,
                ],
                [
                  {
                    text: "Causa de liquidación:".toUpperCase(),
                    style: "content_tabla",
                    bold: true,
                  },

                  {
                    text: `${data.causa_rep.trim()}`,
                    style: "content_tabla",
                  },
                ],
                [
                  {
                    colSpan: 2,
                    columns: [
                      {
                        text: "Fecha de inicio contrato:".toUpperCase(),
                        bold: true,
                        width: "35%",
                      },
                      {
                        text: `${data.fecha_ing_rep.trim()}`.toUpperCase(),
                        alignment: "left",
                      },
                      {
                        text: "Fecha terminación de contrato:".toUpperCase(),
                        bold: true,
                        width: "35%",
                      },
                      {
                        text: `${data.fecha_ret_rep.trim()}`.toUpperCase(),
                        alignment: "left",
                      },
                    ],
                    style: "content_tabla",
                  },
                  {},
                ],
                [
                  {
                    text: "Tiempo laborado:".toUpperCase(),
                    style: "content_tabla",
                    bold: true,
                  },
                  {
                    text: `${data.totdias_rep} Dias`.toUpperCase(),
                    style: "content_tabla",
                  },
                ],
              ],
            },
          },
        ];
      },
      styles: {
        content_tabla: {
          fontSize: 10,
        },
      },
      content: [
        {
          columns: [
            {
              width: "50%",
              margin: [0, 0, 5, 0],
              table: {
                widths: ["*", "*", "*", "*"],
                body: [
                  [
                    {
                      text: "Devengos".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Base".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Cantidad".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Valor".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                  ],
                  ...data_devengos,
                  [
                    {
                      text: "Total devengos".toUpperCase(),
                      fontSize: 9,
                      alignment: "right",
                      bold: true,
                      colSpan: 3,
                    },
                    {},
                    {},
                    {
                      text: formatNumero(total_devengos),
                      fontSize: 9,
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
            {
              width: "50%",
              margin: [5, 0, 0, 0],
              table: {
                widths: ["*", "*", "*"],
                body: [
                  [
                    {
                      text: "Deducciones".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Cantidad".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                    {
                      text: "Valor".toUpperCase(),
                      style: "content_tabla",
                      alignment: "center",
                      bold: true,
                    },
                  ],
                  ...data_deducciones,
                  [
                    {
                      text: "Total descuentos".toUpperCase(),
                      fontSize: 9,
                      alignment: "right",
                      bold: true,
                      colSpan: 2,
                    },
                    {},
                    {
                      text: formatNumero(total_deducciones),
                      fontSize: 9,
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          alignment: "right",
          bold: true,
          text: `Neto a cancelar: $${formatNumero(
            total_devengos + total_deducciones
          )}`.toUpperCase(),
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "Se hace constar:\n\n".toUpperCase(),
                  bold: true,
                  style: "content_tabla",
                },
              ],
              [
                {
                  text:
                    "1. Que el patrono ha incorporado en la presente liquidación los importes correspondientes a salarios, horas extras, descansos compensatorios, cesantías,vacaciones, prima de servicios, auxilio de transporte, y en sí, todo concepto relacionado con salarios, prestaciones o indemnizaciones causadas al quedar extinguido el contrato de trabajo.",
                },
              ],
              [
                {
                  text: `2. Que con el pago del dinero anotado en la presente liquidación, queda transada cualquier diferencia relativa al contrato de trabajo extinguido, o a cualquier diferencia anterior. Por lo tanto, esta transacción tiene como efecto la terminaciónde las obligaciones provenientes de la relación laboral que existió entre ${data.desripEmpresa
                    .trim()
                    .toUpperCase()} y el trabajador, quienes declaran estar a paz y salvo por todo concepto.`,
                },
              ],
              [{ text: "Observacion: \n\n", style: "content_tabla" }],
              [
                {
                  columns: [
                    {
                      width: "70%",
                      style: "content_tabla",
                      bold: true,
                      stack: [
                        "______________________",
                        "El Empleado".toUpperCase(),
                        parseInt(data.identif_rep) || "",
                      ],
                    },
                    {
                      style: "content_tabla",
                      bold: true,
                      stack: [
                        "______________________",
                        "El Empleador".toUpperCase(),
                        data.idEmpresa,
                      ],
                    },
                  ],
                },
              ],
            ],
          },
        },
      ],
    };
    pdfMake.createPdf(dd).open();
    res();
  });
};

const contratoTrabajo = (data) => {
  return new Promise((res) => {
    let item = data.item;
    const nombreTrabajador = `${item.Apellido1colabora_rep} ${item.Apellido2colabora_rep} ${item.nombrescolabora_rep}`;

    const fecha = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateadaActual = fecha.toLocaleDateString('es-ES', opciones);

    const margin = {
      left: 30,
      right: 30
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
        fontSize: 12,
      },
      styles: {
        header: {
          bold: true,
          alignment: "center",
          fillColor: "#c5ffd9"
        },
      },
      pageMargins: [margin.left, 130, margin.right, 100],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          bold: true,
          columns: [
            {
              width: "30%",
              stack: [
                {

                  image: data.logo,
                  fit: [150, 150],
                  margin: [0, 0, 0, 0]
                },
                `${data.tipoId}: ${data.idEmpresa}`
              ]
            },
            {
              margin: [0, 20, 0, 0],
              alignment: "center",
              stack: [
                "CONTRATO INDIVIDUAL DE TRABAJO A TERMINO INDEFINIDO",
                { margin: [0, 2, 0, 0], text: `No. ${item.contrato_rep}` },

              ]
            },


          ]


        }

      },
      footer: function (currentPage, pageCount) {
        return [
          {
            margin: [0, 20, 0, 0],
            fontSize: 9,
            bold: true,
            alignment: "center",
            stack: [
              data.direccionEmpresa,
              `Celular: ${data.telefonoEmpresa}`,
              `Email: ${data.emailEmpresa}`,
              `${data.ciudadEmpresa} – ${data.dptoEmpresa}`
            ]
          },
          { text: `Página ${currentPage} de ${pageCount}`, fontSize: 9, alignment: "right", margin: [0, 0, margin.right, 0] }
        ];
      },
      content: [
        {
          margin: [0, 0, 0, 20],
          table: {
            widths: "*",
            body: [
              [
                {
                  stack: [
                    "Nombre del Empleador:",
                    { text: data.desripEmpresa, bold: true }
                  ]
                },
                `Domicilio del empleador: \n${data.direccionEmpresa}`,
              ],
              [
                {
                  stack: [
                    "Nombre del trabajador:",
                    { text: nombreTrabajador, bold: true },
                    `C.C. ${parseInt(item.idcolabora_rep)}`
                  ]
                },
                {
                  stack: [
                    `Dirección del trabajador: ${item.direcccolabora_rep}`,
                    `Teléfono: ${item.telefonocolabora_rep}`,
                    `Correo: ${item.correocolabora_rep}`
                  ]
                }
              ],
              [
                {
                  stack: [
                    "Fecha de nacimiento:",
                    { text: `${item.fechanacim_rep}`, bold: true }
                  ]
                },
                {
                  stack: [
                    "Oficio que desempeñará el trabajador:",
                    { text: data.nombrecargo_rep, bold: true }
                  ]
                },
              ],
              [
                {
                  colSpan: 2,
                  text: `Salario:\n${item.salminimo_rep}`
                }
              ],
              [
                `Período de pago\n${item.perpago_rep}`,
                `Fecha de iniciación de labores:\n${item.fechaingcolabora_rep}`
              ],
              [
                `Lugar donde desempeñará las labores:\n${data.direccionEmpresa}`,
                `Ciudad donde ha sido contratado el trabajador:\n${item.ciudadctrto_rep}`
              ]
            ]
          }
        },
        "Entre el EMPLEADOR y el TRABAJADOR, de las condiciones ya dichas, identificados como aparece al pie de sus firmas, se ha celebrado el presente contrato individual de trabajo, regido además por las siguientes cláusulas:",
        {
          alignment: "justify",
          margin: [0, 5, 0, 0],
          text: [
            { text: "PRIMERA", bold: true },
            "—EL EMPLEADOR contrata los servicios personales del TRABAJADOR y éste se obliga: a) A poner al servicio del EMPLEADOR toda su capacidad normal de trabajo, en forma exclusiva en el desempeño de las funciones propias del oficio mencionado y en las labores anexas y complementarias del mismo, de conformidad con las órdenes e instrucciones que le imparta EL EMPLEADOR o sus representantes, y b) A no prestar directa ni indirectamente servicios laborales a otros EMPLEADORES, ni a trabajar por cuenta propia en el mismo oficio, durante la vigencia de este contrato (1).",
            { text: " SEGUNDA", bold: true },
            "—Las partes declaran que en el presente contrato se entienden incorporadas, en lo pertinente, las disposiciones legales que regulan las relaciones entre la empresa y sus trabajadores, en especial, las del contrato de trabajo para el oficio que se suscribe, fuera de las obligaciones consignadas en los reglamentos de trabajo y de higiene y seguridad industrial de la empresa.",
            { text: " TERCERA.", bold: true },
            "—En relación con la actividad propia del trabajador, éste la ejecutará dentro de las siguientes modalidades que implican claras obligaciones para el mismo trabajador así: —Observar rigurosamente las normas que le fije la empresa para la realización de la labor a que se refiere el presente contrato. —Guardar absoluta reserva, salvo autorización expresa de la empresa, de todas aquellas informaciones que lleguen a su conocimiento, en razón de su trabajo, y que sean por naturaleza privadas. —Ejecutar por sí mismo las funciones asignadas y cumplir estrictamente las instrucciones que le sean dadas por la empresa, o por quienes la representen, respecto del desarrollo de sus actividades. —Cuidar permanentemente los intereses de la empresa. — Dedicar la totalidad de su jornada de trabajo a cumplir a cabalidad con sus funciones. — Programar diariamente su trabajo y asistir puntualmente a las reuniones que efectúe la empresa a las cuales hubiere sido citado. —Observar completa armonía y comprensión con los clientes, con sus superiores y compañeros de trabajo, en sus relaciones personales y en la ejecución de su labor. —Cumplir permanentemente con espíritu de lealtad, colaboración y disciplina con la empresa. —Avisar oportunamente y por escrito, a la empresa todo cambio en su dirección, teléfono o ciudad de residencia.",
            { text: " CUARTA", bold: true },
            "—EL EMPLEADOR pagará al TRABAJADOR por la prestación de sus servicios y salario indicado, pagadero en las oportunidades también señaladas arriba. Dentro de este pago se encuentra incluida la remuneración de los descansos dominicales y festivos de que tratan los capítulos I y II del título VII del Código Sustantivo del Trabajo. Se aclara y se conviene que en los casos en los que EL TRABAJADOR devengue comisiones o cualquier otra modalidad de salario variable, el 82.5% de dichos ingresos, constituye remuneración ordinaria, y el 17.5% restante está destinado a remunerar el descanso en los días dominicales y festivos de que tratan los capítulos I y II del título VII del Código Sustantivo del Trabajo. PARAGRAFO 1. —Las partes expresamente acuerdan que lo que reciba el trabajador o llegue a recibir en el futuro, adicional a su salario ordinario, ya sean beneficios o auxilios habituales u ocasionales, tales como alimentación, habitación o vestuario, bonificaciones ocasionales o cualquier otra que reciba, durante la vigencia del contrato de trabajo, en dinero o en especie, no constituyen salario.",
            { text: " QUINTA.", bold: true },
            "—Todo trabajo suplementario o en horas extras y todo trabajo en día domingo o festivo en los que legalmente debe concederse descanso, se remunerará conforme a la ley, así como los correspondientes recargos nocturnos. Para el reconocimiento y pago del trabajo suplementario, dominical o festivo EL EMPLEADOR o sus representantes deben autorizarlo previamente por escrito. Cuando la necesidad de este trabajo se presente de manera imprevista o inaplazable, deberá ejecutarse y darse cuenta de él por escrito, a la mayor brevedad, al EMPLEADOR o a sus representantes. EL EMPLEADOR, en consecuencia, no reconocerá ningún trabajo suplementario o en días de descanso legalmente obligatorio que no haya sido autorizado previamente o avisado inmediatamente, como queda dicho.",
            { text: " SEXTA.", bold: true },
            `— EL TRABAJADOR se obliga a laborar a jornada ordinaria en los turnos y dentro de las horas señalados por EL EMPLEADOR, pudiendo hacer éste ajustes o cambios de horario cuando lo estime conveniente. Por el acuerdo expreso o tácito de las partes, podrán repartirse las horas de la jornada ordinaria en la forma prevista en el artículo 164 del Código Sustantivo del Trabajo, modificado por el artículo 23 de la Ley 50 de 1990, teniendo en cuenta que los tiempos de descanso entre las secciones de la jornada no se computan dentro de la misma, según el articulo 167 ibídem. Así mismo el empleador y el trabajador podrán acordar que la jornada semanal de cuarenta y siete (47) horas se realice mediante jornadas diarias flexibles de trabajo, distribuidas en máximo seis (6) días a la semana con un (1) día de descanso obligatorio, que podrá coincidir con el domingo. En éste, el número de horas de trabajo diario podrá repartirse de manera variable durante la respectiva semana y podrá ser de mínimo cuatro (4) horas continuas y hasta diez (10) horas diarias sin lugar a ningún recargo por trabajo suplementario, cuando el número de horas de trabajo no exceda el promedio de cuarenta y siete (47) horas semanales dentro de la jornada ordinaria de 6 a.m. a 09 p.m. PARAGRAFO 1: ${data.desripEmpresa} en cumplimiento de lo establecido por la Ley 2101 del 15 de julio de 2021, implementara gradualmente la reducción de la jornada laboral. A partir del segundo año de entrada en vigencia la ley 2101 de 2021, la jornada laboral se reducirá en una (1) hora quedando en cuarenta y siete (47) semanales. Pasados tres (3) años de la entrada en vigencia de la ley se reducirá otra hora de la jornada laboral quedando en cuarenta y seis (46) horas semanales. A partir del cuarto año de entrada en vigencia la ley se reducirán dos (2) horas cada año hasta llegar a cuarenta y dos (42) semanales conforme a lo establecido en el artículo 2 de la ley.`,
            { text: " SEPTIMA.", bold: true },
            "—Los primeros dos (2) meses del presente contrato se consideran como período de prueba y, por consiguiente, cualquiera de las partes podrá terminar el contrato unilateralmente, en cualquier momento durante dicho período. Vencido éste, la duración del contrato será indefinida, mientras subsistan las causas que le dieron origen y la materia del trabajo (2).",
            { text: " OCTAVA.", bold: true },
            "—Son justas causas para dar por terminado unilateralmente este contrato por cualquiera de las partes, las enumeradas en el artículo 70 del Decreto 2351 de 1965; y, además, por parte del EMPLEADOR, las faltas que para el efecto se califiquen como graves en el espacio reservado para cláusulas adicionales en el presente contrato.",
            { text: " NOVENA.", bold: true },
            "—Las invenciones o descubrimientos realizados por EL TRABAJADOR contratado para investigar pertenecen al EMPLEADOR, de conformidad con el artículo 539 del Código de Comercio, así como en los artículos 20 y concordantes de la Ley 23 de 1982 sobre derechos de autor. En cualquier otro caso el invento pertenece al TRABAJADOR, salvo cuando éste no haya sido contratado para investigar y realice la invención mediante datos o medios conocidos o utilizados en razón de la labor desempeñada, evento en el cual EL TRABAJADOR, tendrá derecho a una compensación que se fijará de acuerdo al monto del salario, la importancia del invento o descubrimiento, el beneficio que reporte al EMPLEADOR u otros factores similares.",
            { text: " DECIMA.", bold: true },
            "—Las partes podrán convenir que el trabajo se preste en lugar distinto del inicialmente contratado, siempre que tales traslados no desmejoren las condiciones laborales o de remuneración del TRABAJADOR, o impliquen perjuicios para él, Los gastos que se originen con el traslado serán cubiertos por EL EMPLEADOR de conformidad con el numeral 8° del artículo 57 del Código Sustantivo del Trabajo, EL TRABAJADOR se obliga a aceptar los cambios de oficio que decida EL EMPLEADOR dentro de su poder subordinante, siempre que se respeten las condiciones laborales del TRABAJADOR y no se le causen perjuicios. Todo ello sin que se afecte el honor, la dignidad y los derechos mínimos del TRABAJADOR, de conformidad con el artículo 23 del Código Sustantivo del Trabajo, modificado por el artículo 1° de la Ley 50 de 1990. ",
            { text: " UNDECIMA.", bold: true },
            "—El presente contrato reemplaza en su integridad y deja sin efecto cualquier otro contrato verbal o escrito celebrado entre las partes con anterioridad. Las modificaciones que se acuerden al presente contrato se anotarán a continuación de su texto."
          ]
        },
        { text: `Para constancia se firma en dos ejemplares del mismo tenor y valor, en la ciudad y fecha que se indican a continuación: ${data.ciudadEmpresa}, el ${fechaFormateadaActual}.`, margin: [0, 15, 0, 30] },
        {
          margin: [0, 20, 0, 0],
          columns: [
            {
              width: "40%",
              stack: [
                subrayado(" "),
                { text: "El Empleador:", bold: true },
                { text: data.desripEmpresa, bold: true },
                `NIT. ${data.idEmpresa}`,
                `Representante Legal`
              ]
            },
            {
              width: "50%",
              margin: [30, 0, 0, 0],
              stack: [
                subrayado(" "),
                { text: "El trabajador:", bold: true },
                { text: nombreTrabajador, bold: true },
                `C.C. ${parseInt(item.idcolabora_rep)}`,
              ]
            }
          ]
        }
      ]

    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

const listaChequeo = (data) => {
  return new Promise((res) => {
    let margin = {
      left: 20,
      right: 20,
    };

    var dd = {
      defaultStyle: {
        fontSize: 9,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
          fillColor: "#C9DBE6"
        },
        colorCenter: {
          alignment: "center",
          fillColor: "#C9DBE6"
        },
        segundaTabla: {
          alignment: "center",
          fillColor: "#CECFD0"
        }
      },
      pageMargins: [margin.left, 110, margin.right, 60],
      header: function (currentPage, pageCount, pageSize) {
        return {
          fontSize: 10,
          margin: [margin.left, 10, margin.right, 10],
          table: {
            widths: "*",
            body: [
              [
                {
                  columns: [
                    {
                      margin: [0, 15, 0, 0],
                      image: data.logo,
                      fit: [150, 150],
                      width: "30%"
                    },
                    {
                      alignment: "right",
                      stack: [
                        "SIKUANY SAS",
                        { text: "FORMATO LISTA DE CHEQUEO DOCUMENTOS DEL PERSONAL EN HOJA DE VIDA", bold: true, fontSize: 13 },
                        "TALENTO HUMANO",
                        {
                          columns: [
                            { text: "Código: TH-FO-08", width: "30%" },
                            { text: "V.07", width: "20%" },
                            { text: `Fecha de Aprobación 31-05-2023`, width: "50%", alignment: "right" }
                          ]
                        },
                        `Página ${currentPage} de ${pageCount}`
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        };
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 10, margin.right, 10],
          fontSize: 7,
          table: {
            widths: "*",
            body: [
              [`Elaborado por: Erika Paola Chávez Jiménez`, `Revisado por: Nohora Parra Bastos`, `Aprobado por: Nohora Parra Bastos`],
              [`Cargo: Practicante TH`, `Cargo: Coordinadora de Talento Humano`, `Cargo: Coordinadora de Talento Humano`],
              ["Firma:", "Firma:", "Firma:"]
            ]
          }
        }

      },
      content: [
        {
          fontSize: 10,
          table: {
            widths: ["auto", "*", "auto", "*"],
            body: [
              ["Tipo de contrato:", " ", "N° de contrato:", " "],
              ["Nombre del Empleado:", " ", "Identidad No.:", " "],
              ["Cargo del Empleado:", " ", "Área:", " "],
              ["Sede o punto de dispensación:", " ", "Fecha de ingreso:", " "],
            ]
          }
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ["auto", "*", "auto", "auto", "auto", "25%"],
            body: [
              [{ text: "Item", style: "boldcenter", rowSpan: 2, margin: [0, 5, 0, 0] }, { text: "Contenido", style: "boldcenter", rowSpan: 2, margin: [0, 5, 0, 0] }, { text: "Cumple", style: "boldcenter", colSpan: 3 }, "", "", { text: "Observaciones", style: "boldcenter", rowSpan: 2, margin: [0, 5, 0, 0] },],
              ["", "", { text: "Si", style: "colorCenter" }, { text: "No", style: "colorCenter" }, { text: "NA", style: "colorCenter" }, ""],
              [{ text: "Para Contratación", style: "boldcenter", colSpan: 6, fillColor: "#CECFD0" }],
              [{ text: "1", alignment: "center" }, "Formato requisición del personal", "", "", "", ""],
              [{ text: "2", alignment: "center" }, "Hoja de Vida del Trabajador Institucional", "", "", "", ""],
              [{ text: "3", alignment: "center" }, "Formato de Entrevista", "", "", "", ""],
              [{ text: "4", alignment: "center" }, "Formato análisis técnico jefe inmediato-selección de personal", "", "", "", ""],
              [{ text: "5", alignment: "center" }, "Formato de evaluación de conocimiento proceso de selección", "", "", "", ""],
              [{ text: "6", alignment: "center" }, "Formato prueba psicotécnica", "", "", "", ""],
              [{ text: "7", alignment: "center" }, "Examen de ingreso. Medico Ocupacional", "", "", "", ""],
              [{ text: "8", alignment: "center" }, "Inducción Puesto de Trabajo", "", "", "", ""],
              [{ text: "9", alignment: "center" }, "Formato verificación de referencias", "", "", "", ""],
              [{ text: "10", alignment: "center" }, "Formato verificación de datos de Hoja de Vida", "", "", "", ""],
              [{ text: "11", alignment: "center" }, "Copia de cedula", "", "", "", ""],
              [{ text: "12", alignment: "center" }, "Certificación bancaria", "", "", "", ""],
              [{ text: "13", alignment: "center" }, "3 Autorización habeas data", "", "", "", ""],
              [{ text: "14", alignment: "center" }, "Autorización datos sensibles", "", "", "", ""],
              [{ text: "15", alignment: "center" }, "Autorización de descuentos de nomina", "", "", "", ""],
              [{ text: "16", alignment: "center" }, "Contrato de trabajo anexo Declaración Compromiso de Confidencialidad", "", "", "", ""],
              [{ text: "17", alignment: "center" }, "Afiliación Administradora de Riesgos Profesionales", "", "", "", ""],
              [{ text: "18", alignment: "center" }, "Afiliación Entidad Promotora de Salud", "", "", "", ""],
              [{ text: "19", alignment: "center" }, "Afiliación a Caja de Compensación Familiar", "", "", "", ""],
              [{ text: "20", alignment: "center" }, "Afiliación a Fondo de Pensiones", "", "", "", ""],
              [{ text: "21", alignment: "center" }, "Formato de entrega de dotación", "", "", "", ""],
              [{ text: "22", alignment: "center" }, "Formato Constancia entrega de Documentos", "", "", "", ""],
              [{ text: "23", alignment: "center" }, "Copia de licencia de conducción (cargo conductor y mensajería)", "", "", "", ""],
              [{ text: "24", alignment: "center" }, "Carnet de Vacunas (Hepatitis B, tétano, Fiebre Amarilla) (servicios generales)", "", "", "", ""],
              [{ text: "Gestión de talento humano", style: "boldcenter", colSpan: 6, fillColor: "#CECFD0" }],
              [{ text: "25", alignment: "center" }, "Formatos de Vacaciones, Permisos, Incapacidad", "", "", "", ""],
              [{ text: "26", alignment: "center" }, "Formatos de Memorandos e investigaciones administrativos", "", "", "", ""],
              [{ text: "27", alignment: "center" }, "Evaluación de desempeño", "", "", "", ""],
              [{ text: "28", alignment: "center" }, "Examen Médico de Retiro", "", "", "", ""],
              [{ text: "29", alignment: "center" }, "Carta de Terminación del contrato de Trabajo", "", "", "", ""],
              [{ text: "30", alignment: "center" }, "Acta entrega de cargo, Paz y Salvo del Trabajador", "", "", "", ""],
              [{ text: "31", alignment: "center" }, "Liquidación", "", "", "", ""],
              [{ text: "32", alignment: "center" }, "Certificación Laboral.", "", "", "", ""],
              [{ text: "33", alignment: "center" }, "ARL de retiro", "", "", "", ""],
              [{ text: "34", alignment: "center" }, "Carta retiro de cesantías (si aplica)", "", "", "", ""],
            ]
          }
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 11,
          table: {
            widths: ["9%", "13%", "*", "auto", "18%"],
            body: [
              [{ text: "CONTROL DE CAMBIO Y APROBACIÓN DOCUMENTAL", style: "segundaTabla", bold: true, colSpan: 5 }, "", "", "", ""],
              [{ text: "Versión", style: "segundaTabla" }, { text: "CÓD.", style: "segundaTabla" }, { text: "Descripción de Cambio", style: "segundaTabla" }, { text: "Fecha de Aprobación", style: "segundaTabla" }, { text: "Área Responsable", style: "segundaTabla" },],
              ["", "", "", "", " "],
              ["", "", "", "", " "],
              ["", "", "", "", " "],
              ["", "", "", "", " "],
              [{ text: "5", alignment: "center" }, { text: "TH-FO-08", alignment: "center" }, "", "12/07/2022", "Talento Humano"],
              [{ text: "6", alignment: "center" }, { text: "TH-FO-08", alignment: "center" }, "Se agregan los ítems:” Formato análisis técnico jefe inmediato-selección de personal”, “Formato verificación de referencias”,” Autorización datos sensibles”, “Formato Constancia entrega de Documentos”. Se eliminaron de la anterior versión, los puntos: “Formato evaluación de la inducción puesto de trabajo”, “Acuerdo de Terminación del contrato de Trabajo.” Se unifican los formatos de valores, permisos e incapacidades, también el acta de entrega de cargo y paz y salvo del trabajador", "13/04/2023", "Talento Humano"],
              [{ text: "7", alignment: "center" }, { text: "TH-FO-08", alignment: "center" }, "Se agregan los ítems “ARL de retiro” y “carta de retiro de cesantías (si aplica”", "31/05/2023", "Talento Humano"],
            ]
          }
        }
      ]
    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

const certLaboral = (data) => {
  return new Promise((res) => {
    const fechaActual = new Date();

    const opciones = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const formateador = new Intl.DateTimeFormat('es-ES', opciones);
    const fechaFormateada = formateador.format(fechaActual);

    let margin = {
      left: 40,
      right: 40,
    };

    var dd = {
      defaultStyle: {
        fontSize: 14,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 150, margin.right, 80],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 15],
          stack: [
            {
              image: data.logo,
              fit: [140, 140]
            },
            { text: `Nit: ${data.idempresa}`, bold: true, fontSize: 10, margin: [30, 0, 0, 0] }
          ]
        };
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [0, 0, 0, 60],
          alignment: "center",
          fontSize: 12,
          stack: [
            `Dirección: ${data.direccion.trim()}`,
            `Teléfono: ${data.telefono.trim()}`,
            `${data.ciudad.trim()}`
          ]
        }

      },
      content: [
        { text: `LA COORDINACION DE TALENTO HUMANO DE  \n ${data.empresa}`, style: "boldcenter", fontSize: 15 },
        { text: "CERTIFICA", style: "boldcenter", fontSize: 15, margin: [0, 30, 0, 30] },
        data.fretiro_rep ? "" : { text: `Que ${data.nombresnomina_rep.trim()} ${data.Apellido1nomina_rep.trim()} ${data.Apellido2nomina_rep.trim()}, con cédula de ciudadanía No.${parseInt(data.idnomina_rep)}, labora en esta compañía desde el ${data.fingreso_rep}, desempeñando el cargo de ${data.descripcargo_rep.trim()}, con una asignación básica mensual de $${data.sueldo_rep.trim()} con un contrato a ${data.contrato_rep}.` },
        data.fretiro_rep ? { text: `Que ${data.nombresnomina_rep.trim()} ${data.Apellido1nomina_rep.trim()} ${data.Apellido2nomina_rep.trim()}, con cédula de ciudadanía No.${parseInt(data.idnomina_rep)}, laboró en esta compañía desde el ${data.fingreso_rep} hasta el ${data.fretiro_rep}, desempeñando el cargo de ${data.descripcargo_rep.trim()}, con una asignación básica mensual de $${data.sueldo_rep.trim()} con un contrato a ${data.contrato_rep}.` } : "",
        { text: `La presente certificación se expide el ${fechaFormateada}.`, margin: [0, 30, 0, 30] },
        "Cordialmente,",

        {
          image: data.firma,
          fit: [100, 100],
          margin: [0, 30, 0, 0]
        },
        `${data.descripfirma_rep.trim()}`,
        `Celular:${data.telfirma_rep.trim()}`,

      ]
    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

// const dotacion = async (data, getBase64) => {
//   let url = " ";
//   url = "https://catalogo-vpfe.dian.gov.co/document/ShowDocumentToPublic/" + data.iddian_fact
//   let qr = await QRCode.toDataURL(url);

//   return new Promise(res => {
//     let margin = {
//       left: 20,
//       right: 20
//     };

//     let observaciones = window.atob(data.Observaciones64.trim())


//     let descripcion = "";
//     let descripcion64 = "";

//     data.productos.forEach((p, i) => {
//       descripcion64 = window.atob(
//         p.base1_pr.trim() +
//         p.base2_pr.trim() +
//         p.base3_pr.trim() +
//         p.base4_pr.trim() +
//         p.base5_pr.trim()
//       );
//       if (descripcion64) {
//         descripcion = descripcion64;
//       } else {
//         descripcion = p.nombre_servicio;
//       }
//       p.nombre_servicio = descripcion + "  " + p.detprod.trim();

//       productos.push([
//         i + 1,
//         p.codigo,
//         { text: p.nombre_servicio.trim(), alignment: "left" },
//         { text: p.cantidad.trim(), alignment: "right" },
//         { text: "", alignment: "right" },
//         { text: p.vlr_unit.trim(), alignment: "right" },
//         { text: p.vlr_unitiva, alignment: "right" },
//         { text: p.porcimpto, alignment: "right" },
//         { text: p.vlr_dcto, alignment: "right" },
//         { text: p.tot_producto.trim(), alignment: "right" },
//       ])
//     })

//     var dd = {
//       styles: {
//         boldcenter: {
//           bold: true,
//           alignment: "center"
//         },
//         boldred: {
//           color: "red",
//           bold: true
//         }
//       },
//       pageMargins: [margin.left, 110, margin.right, 30],
//       header: function (currentPage, pageCount, pageSize) {
//         return {
//           margin: [margin.left, 10, margin.right, 0],
//           columns: [
//             {
//               image: data.logo,
//               width: 120,
//               height: 60,
//               margin: [6, 0, 0, 0]
//             },
//             {
//               width: "50%",
//               fontSize: 7,
//               alignment: "center",
//               stack: [
//                 { text: data.nombre_empresa, fontSize: 12 },
//                 { text: `NIT: ${data.nit_empresa.trim()} - Responsable de IVA - Obligación: No responsable`, margin: [0, 2, 0, 0] },
//                 `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia Teléfono - ${data.telefono_empresa}`,
//                 `E-mail: ${data.email_empresa}`,
//                 { text: `${data.actica_empresa.trim()}`, fontSize: 7, },
//               ]
//             },
//             {
//               fontSize: 10,
//               width: "28%",
//               alignment: "center",
//               stack: [
//                 { text: "PROFORMA No", fontSize: 10 },
//                 { text: data.numero_fact, style: "boldred", margin: [0, 5, 0, 0] },
//                 { text: `Fecha Emisión: ${data.fechacorta_factura}`, style: "boldred" },
//               ]
//             },

//           ]
//         }
//       },
//       footer: function (currentPage, pageCount) {
//         return {
//           fontSize: 7,
//           margin: [margin.left, 0, margin.right, 0],
//           alignment: "center",
//           stack: [
//             `Software Propio Fabricado por Titan Soluciones Sas Nit:901289171`
//           ]
//         }

//       },
//       content: [
//         {

//           fillColor: "#e2f3d9",
//           table: {
//             widths: "*",
//             body: [
//               [
//                 {
//                   fontSize: 9,

//                   columns: [
//                     {

//                       width: "40%",
//                       stack: [
//                         { text: `CC O NIT:: ${data.nit_cliente.trim()}`, margin: [0, 2, 0, 0] },
//                         { text: `Cliente: ${data.nombre_cliente.trim()}`, margin: [0, 2, 0, 0] },
//                         // "",
//                         // "",
//                         { text: `Dirección: ${data.direccion_cliente}`, margin: [0, 12, 0, 0] },
//                         { text: `Ciudad: ${data.ciudad_cliente}`, margin: [0, 2, 0, 0] },
//                         { text: `Teléfono: ${data.telefono_cliente.trim()}`, margin: [0, 2, 0, 0] },
//                         { text: `Email: ${data.email_cliente}`, margin: [0, 2, 0, 0] },
//                       ]
//                     },
//                   ]
//                 },
//               ]
//             ]
//           }
//         },
//         {
//           margin: [0, 20, 0, 0],
//           fontSize: 7,
//           table: {
//             widths: ["3%", "8%", "20%", "*", "*", "*", "*", "8%", "10%", "*"],
//             body: [
//               [
//                 { text: "#", style: "boldcenter" },
//                 { text: "Código", style: "boldcenter" },
//                 { text: "Descripción", style: "boldcenter" },
//                 { text: "Cantidad", style: "boldcenter" },
//                 { text: "UM", style: "boldcenter" },
//                 { text: "Val. Unit", style: "boldcenter" },
//                 { text: "IVA/IC", style: "boldcenter" },
//                 { text: "% Iva/Ic", style: "boldcenter" },
//                 { text: "Dcto", style: "boldcenter" },
//                 { text: "Val. Item", style: "boldcenter" },
//               ],
//               ...productos
//             ]
//           }
//         },
//         {
//           margin: [0, 40, 0, 0],
//           fillColor: "#e2f3d9",
//           fontSize: 7,
//           table: {
//             widths: ["*", "*", "25%"],
//             body: [
//               [
//                 { text: "Impuestos", style: "boldcenter" },
//                 { text: "Retenciones", style: "boldcenter" },
//                 { text: "Totales", style: "boldcenter" },
//               ],
//               [
//                 {
//                   table: {
//                     widths: ["15%", "*", "15%", "*"],
//                     body: [
//                       [
//                         { text: "Tipo", style: "boldcenter" },
//                         { text: "Base", style: "boldcenter" },
//                         { text: "%", style: "boldcenter" },
//                         { text: "Valor", style: "boldcenter" },
//                       ],
//                       ...impuestos
//                     ]
//                   }
//                 },
//                 {

//                   table: {
//                     widths: ["*", "30%", "*"],
//                     body: [
//                       [
//                         { text: "Base", style: "boldcenter" },
//                         { text: "%", style: "boldcenter" },
//                         { text: "Valor", style: "boldcenter" },
//                       ],
//                       ...retenciones
//                     ]
//                   }
//                 },
//                 {
//                   table: {
//                     widths: ["62%", "*"],
//                     body: [
//                       [
//                         { text: "Concepto", style: "boldcenter" },
//                         { text: "Valor", style: "boldcenter" },

//                       ],
//                       [
//                         "Nro Lineas:",
//                         { text: totales.lineas.trim(), alignment: "right" },
//                       ],
//                       [
//                         "Subtotal:",
//                         { text: totales.subtotal.trim(), alignment: "right" },
//                       ],
//                       [
//                         "Descuentos:",
//                         { text: totales.descuentos.trim(), alignment: "right" },
//                       ],
//                       [
//                         "Impuestos:",
//                         { text: totales.impuestos.trim(), alignment: "right" },
//                       ],
//                       [
//                         "Retenciones:",
//                         { text: totales.retenciones.trim(), alignment: "right" },
//                       ],
//                       [
//                         "Total Proforma: ",
//                         { text: totales.total.trim(), alignment: "right" },
//                       ],
//                     ]
//                   }
//                 },
//               ]
//             ]
//           }
//         },
//         {
//           margin: [0, 20, 0, 0],
//           fontSize: 9,
//           table: {
//             widths: "*",
//             body: [
//               [
//                 {
//                   stack: [
//                     { text: `NOTAS: ${observaciones}`, margin: [0, 10, 0, 0] },
//                     { text: `SON: : ${data.TotalEnLetras}*********`, margin: [0, 20, 0, 0] },
//                     { text: `\n Aceptación: ${data.nombre_cliente.trim()} \n\n\n\n`},

//                     {
//                       canvas: [
//                         {
//                           type: "line",
//                           x1: 0,
//                           y1: 0,
//                           x2: 150,
//                           y2: 0,
//                           lineWidth: 1,
//                         },
//                       ],
//                       alignment: "left",
//                     },

//                     { text: `NOMBRE:`},
//                     { text: `CC:`}, 
//                     { text: `ODI:`},
//                   ]
//                 }
//               ]
//             ]
//           }
//         },
//       ]
//     }

//     if (getBase64) {
//       const pdfDocGenerator = pdfMake.createPdf(dd);
//       pdfDocGenerator.getBlob((blob) => {
//         res(blob)
//       });
//     } else {
//       pdfMake.createPdf(dd).open();
//       res();
//     }
//   })
// };
const permiso_laboral = (data) => {
  return new Promise((res) => {
    let margin = {
      left: 10,
      right: 10

    };

    const color = "#7199FC"



    var dd = {
      defaultStyle: {
        fontSize: 11,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
          fontSize: 12,
          fillColor: color
        },
        color: {
          alignment: "center", fillColor: color
        },
        boldc: {
          alignment: "center",
          bold: true
        }
      },
      pageMargins: [
        margin.left, 90, margin.right, 60
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [
            margin.left, 10, margin.right, 0
          ],
          ...formatCaja({
            fontSize: 10,
            columns: [
              { image: data.logo, fit: [150, 150] },
              {
                width: "65%",
                alignment: "right",
                stack: [
                  "SIKUANY SAS",
                  { text: "FORMATO SOLICITUD DE PERMISO LABORAL", bold: true, fontSize: 13 },
                  "TALENTO HUMANO",
                  { columns: [`Código: TH-FO-11`, { text: "V.05", width: "10%" }, `Fecha de Aprobación: 14-09-2022`], fontSize: 10 },
                  "Página " + currentPage.toString() + " de " + pageCount,
                ]
              }
            ]
          })
        }
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 10],
          table: {
            widths: "*",
            body: [
              [{ text: [{ text: "Elaborado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Revisado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Aprobado por: ", bold: true }, "Rosalyn"] }],
              [{ text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }],
              [{ columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }]
            ]
          }
        };
      },
      content: [
        formatCaja({
          stack: [
            formatCaja({ text: [{ text: "Objetivo: ", bold: true }, "obtener información clara de la solicitud de permisos laborales, con el fin de conceder el requisito según lo estipulen la normatividad vigente y/o políticas y reglamentos internos de trabajo de Sikuany SAS."] }),
            {
              margin: [0, 5, 0, 0],
              columns: [
                { text: "Fecha de solicitud:", width: "auto" },
                subrayado(" "),
                { text: "Sede o punto de dispensación:", width: "auto", margin: [3, 0, 0, 0] },
                subrayado(" "),
              ]
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: "Información del solicitante", style: "boldcenter" }],
                  [
                    {
                      stack: [
                        {
                          columns: [

                            { text: "Nombres y apellidos:", width: "auto" },
                            subrayado(" "),

                          ]
                        },

                        {
                          margin: [0, 5, 0, 0],
                          columns: [

                            { text: "Número de identificación:", width: "auto" },
                            subrayado(" "),
                            { text: "Cargo:", width: "auto", margin: [13, 0, 0, 0] },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 5, 0, 0],
                          columns: [

                            { text: "Correo electrónico:", width: "auto" },
                            subrayado(" "),
                            { text: "Contacto:", width: "auto", margin: [13, 0, 0, 0] },
                            subrayado(" "),
                          ]
                        },
                      ]
                    }
                  ],
                  [{ text: "Motivo del permiso", style: "boldcenter" }],
                  [
                    {
                      stack: [
                        {

                          columns: [
                            { text: "Consulta médica", margin: [0, 2, 0, 0], width: "23%" },
                            { ...formatCaja(condicional("", "1")), width: "3.5%" },
                            { text: "Licencia remunerada: ", margin: [15, 2, 0, 0], width: "25%" },
                            { ...formatCaja(condicional("", "01")), width: "3.5%" },
                            { text: "Indique: ", margin: [10, 2, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { text: "Estudio", margin: [0, 2, 0, 0], width: "23%" },
                            { ...formatCaja(condicional("", "1")), width: "3.5%" },
                            { text: "Calamidad doméstica: ", margin: [15, 2, 0, 0], width: "25%" },
                            { ...formatCaja(condicional("", "01")), width: "3.5%" },
                            { text: "Explique: ", margin: [10, 2, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [
                            { text: "Licencia No remunerada", margin: [0, 2, 0, 0], width: "23%" },
                            { ...formatCaja(condicional("", "1")), width: "3.5%" },
                            { text: "Otro: ", margin: [15, 2, 0, 0], width: "25%" },
                            { ...formatCaja(condicional("", "01")), width: "3.5%" },
                            { text: "¿Cual?", margin: [10, 2, 5, 0], width: "auto" },
                            subrayado(" "),
                          ]
                        },
                      ]
                    }
                  ]
                ]
              }
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: "Tiempo del permiso", style: "boldcenter", colSpan: 4 }, "", "", ""],
                  [
                    {
                      colSpan: 4,
                      columns: [
                        { text: "Fecha del permiso:", width: "auto" },
                        subrayado(" "),
                        { text: "Presenta soporte o certificado", width: "auto", margin: [3, 0, 0, 0] },
                        { text: "Si", width: "auto", margin: [15, 3, 0, 0], },
                        { ...subrayado(condicional("", "1")), width: "3.5%" },
                        { text: "No", width: "auto", margin: [0, 3, 0, 0] },
                        { ...subrayado(condicional("", "1")), width: "3.5%" },

                      ]
                    }, "", "", ""
                  ],
                  [{ text: "¿Su permiso es en días?", style: "boldc", rowSpan: 2, margin: [0, 6, 0, 0] }, { text: "Fecha que inicia", alignment: "center" }, { text: "Fecha que finaliza", alignment: "center" }, { text: "Nº total de días", alignment: "center" }],
                  ["", "", " ", ""],
                  [{ text: "¿Su permiso es en horas?", style: "boldc", rowSpan: 2, margin: [0, 6, 0, 0], }, { text: "Hora de salida", alignment: "center" }, { text: "Hora de entrada", alignment: "center" }, { text: "Nº total de horas", alignment: "center" }],
                  ["", "", " ", ""],
                  [{ text: "En caso de requerir compensar el permiso", style: "boldcenter", colSpan: 4 }, "", "", ""],
                  [
                    {
                      colSpan: 4,
                      stack: [
                        {
                          columns: [
                            { text: "Se compensará:", width: "auto" },
                            { text: "desde:", width: "auto", margin: [10, 0, 0, 0] },
                            subrayado(" "),
                            { text: "hasta:", width: "auto" },
                            subrayado(" "),
                            { text: "Número de días (si aplica):", width: "auto" },
                            subrayado(" "),

                          ]
                        },
                        {
                          margin: [0, 4, 0, 0],
                          columns: [

                            { text: "Desde la hora:", width: "auto" },
                            subrayado(" "),
                            { text: "hasta la hora:", width: "auto" },
                            subrayado(" "),
                            { text: "Número de horas (si aplica):", width: "auto" },
                            subrayado(" "),
                            { text: "Fecha:", width: "auto" },
                            subrayado(" "),
                          ]
                        }
                      ]
                    }, "", "", ""
                  ],

                ]
              }
            },
            {
              margin: [0, 4, 0, 0],
              table: {
                widths: "*",
                heights: ["auto", 30],
                body: [
                  [{
                    text: "Observaciones:",
                    style: "boldcenter"
                  }],
                  [" "]
                ]
              }
            },
            {
              margin: [0, 5, 0, 0],
              table: {
                widths: ["*", "9%", "*", "8%", "*"],
                heights: ["auto", 45],
                body: [
                  [{ text: "Firma del solicitante", style: "boldcenter" }, { colSpan: 4, text: "Nombre y Firma de quien reemplaza (si aplica)", style: "boldcenter" }, "", "", ""],
                  [" ", { text: "Nombre: ", margin: [0, 15, 0, 0] }, " ", { text: "Firma: ", margin: [0, 15, 0, 0] }, " "]
                ]
              }
            },
            {
              margin: [0, 3, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: "Aprobación Empresarial", style: "boldcenter", colSpan: 3 }, "", ""],
                  [{ text: "Jefe Inmediato", alignment: "center" }, { text: "Firma de Aprobado", alignment: "center", border: [true, true, true, false] }, { text: "Firma de Aprobado Gerencia", alignment: "center" }],
                  [`Nombre: `, { text: "Coordinador de Talento Humano", border: [true, false, true, true], alignment: "center" }, { rowSpan: 3, text: "" }],
                  [`Cargo: `, { rowSpan: 3, text: "" }, ""],
                  [`Fecha: `, "", ""],
                  [`Firma: `, "", `Fecha de aprobación:`]
                ]
              }
            },
          ]

        })
      ]
    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

const evaluacion_desemp = (data) => {
  return new Promise((res) => {

    let margin = {
      left: 10,
      right: 10

    };

    const color = "#7199FC"

    const formatoEvaluador = (titulo, descripcion, recomendacion, arrayAspectos, observaciones) => {
      return {
        margin: [0, 4, 0, 0],
        table: {
          widths: ["*", "5%", "5%", "5%", "5%"],

          body: [
            [{ colSpan: 5, text: [{ text: titulo, bold: true }, descripcion] }, "", "", "", ""],
            [{ colSpan: 5, text: recomendacion, bold: true }, "", "", "", ""],
            [
              { text: "Aspectos a Evaluar", style: "color", rowSpan: 2, margin: [0, 4, 0, 0], fontSize: 11 },
              { text: "S", style: "boldcenter" },
              { text: "Cs", style: "boldcenter" },
              { text: "Cn", style: "boldcenter" },
              { text: "N", style: "boldcenter" }
            ],

            [
              "",
              { text: "5", style: "valores" },
              { text: "4", style: "valores" },
              { text: "3", style: "valores" },
              { text: "2", style: "valores" }
            ],
            ...arrayAspectos.map(a => {
              return [
                a.aspecto,
                { text: condicional(a.valoracion, 5), alignment: "center" },
                { text: condicional(a.valoracion, 4), alignment: "center" },
                { text: condicional(a.valoracion, 3), alignment: "center" },
                { text: condicional(a.valoracion, 2), alignment: "center" }

              ]
            }),
            [{ colSpan: 5, text: `Observaciones: ${observaciones}` }, "", "", "", ""],


          ]
        }
      }
    }


    var dd = {
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
          fontSize: 10,
          fillColor: color
        },
        color: {
          alignment: "center", fillColor: color
        },
        valores: {
          alignment: "center", fillColor: color, color: "#D0D0D0", fontSize: 7,
        }
      },
      pageMargins: [
        margin.left, 105, margin.right, 60
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [
            margin.left, 10, margin.right, 0
          ],
          ...formatCaja({
            fontSize: 10,
            columns: [
              { image: data.logo, fit: [150, 150] },
              {
                width: "65%",
                alignment: "right",
                stack: [
                  "SIKUANY SAS",
                  { text: "FORMATO EVALUACION DE DESEMPEÑO", bold: true, fontSize: 12 },
                  "TALENTO HUMANO",
                  { columns: [`Código: TH-FO-11`, { text: "V.05", width: "10%" }, `Fecha de Aprobación: 14-09-2022`], fontSize: 10 },
                  "Página " + currentPage.toString() + " de " + pageCount,
                ]
              }
            ]
          })
        }
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 0, margin.right, 10],
          table: {
            widths: "*",
            body: [
              [{ text: [{ text: "Elaborado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Revisado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Aprobado por: ", bold: true }, "Rosalyn"] }],
              [{ text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }],
              [{ columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }]
            ]
          }
        };
      },
      content: [
        formatCaja({
          stack: [
            {
              table: {
                widths: "*",
                body: [
                  [`Fecha en que se realiza la evaluación: `, `Sede: `],
                  [{ colSpan: 2, text: [{ text: "OBJETIVO: ", bold: true }, "Mejorar de forma permanente los resultados de la organización mediante el adecuado aprovechamiento potencial humano y propiciar el dialogo entre líderes y trabajadores."] }],
                  [{ colSpan: 2, text: "MOTIVO EVALUACION", style: "boldcenter" }],
                  [
                    {
                      colSpan: 2,
                      stack: [
                        {

                          columns: [
                            { text: "Prórroga del contrato", margin: [0, 2, 0, 0], width: "20%" },
                            { ...formatCaja(condicional("", "1")), width: "3.5%" },
                            { text: "Evaluación anual", margin: [15, 2, 0, 0], width: "31%" },
                            { ...formatCaja(condicional("", "01")), width: "3.5%" },
                            { text: "Nivelación o aumento salarial", margin: [10, 0, 0, 0], },
                            { ...formatCaja(condicional("", "02")), width: "3.5%" },
                          ]
                        },
                        {
                          margin: [0, 5, 0, 0],
                          columns: [
                            { text: "Período de prueba", margin: [0, 2, 0, 0], width: "20%" },
                            { ...formatCaja(condicional("", "1")), width: "3.5%" },
                            { text: "Ascenso o Translado", margin: [15, 2, 0, 0], width: "31%" },
                            { ...formatCaja(condicional("", "01")), width: "3.5%" },
                            { text: "Otro: ", margin: [15, 2, 0, 0], width: "auto" },
                            { ...subrayado(" "), margin: [4, 0, 0, 0] }
                          ]
                        },

                      ]

                    }
                  ],
                  [{ colSpan: 2, text: "INFORMACION DEL PERSONAL", style: "boldcenter" }],
                  [`Nombre Evaluado: `, `Nombre evaluador: `],
                  [`Cargo Actual Evaluado: `, `Cargo del evaluador: `],
                ]
              }
            },
            {
              margin: [0, 4, 0, 0],
              table: {
                widths: ["10%", "40%", "*"],
                headerRows: 1,
                body: [

                  [{ colSpan: 3, text: "VALORACION", style: "boldcenter" }, "", ""],
                  [{ text: "Puntaje", style: "color" }, { text: "Cualitativo", style: "color" }, { text: "Significado", style: "color" }],
                  [{ text: "5", alignment: "center" }, "(S) Siempre - Excelente", "Superior - Rendimiento laboral excelente"],
                  [{ text: "4", alignment: "center" }, "(Cs)Casi siempre - Bueno", "Superior al promedio - Rendimiento laboral bueno."],
                  [{ text: "3", alignment: "center" }, "(Cn)Casi nunca - Regular", "Promedio - Rendimiento laboral regular"],
                  [{ text: "2", alignment: "center" }, "(N) Nunca - Malo", "Inferior - Rendimiento laboral no aceptable."],
                ]
              }
            },
            {
              margin: [0, 4, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: "EVALUACION DEL COLABORADOR", style: "color" },],
                  [{ text: "Realice la evaluación con el evaluador presente, explique la importancia de realizar este instrumento de evaluación de desempeño, utilice un lenguaje sencillo, formal y con respeto, socialice su puntaje cualitativo y conviértalo en número (cuantitativo) según el rango de valores" }],
                ]
              }
            },
            formatoEvaluador(
              "A. ORGANIZACIONALES: ",
              "Habilidad y capacidad de planear, ejecutar y evaluar las actividades que permiten alcanzar o superar los objetivos de la organización",
              "Teniendo en cuenta la educación, formación, habilidades y experiencia del empleado que está siendo evaluado, responda:",
              [
                { aspecto: "1. Planifica sus actividades en tiempo y forma para el desempeño de sus funciones.", valoracion: 0 },
                { aspecto: "2. Termina su trabajo oportunamente.", valoracion: 0 },
                { aspecto: "3. Cumple con las tareas asignadas de manera exacta de acuerdo con las instrucciones dadas.", valoracion: 0 },
              ],
              ""
            ),
            formatoEvaluador(
              "B. CALIDAD: ",
              "Cumplimiento con las políticas internas y procedimientos; considerando la planeación y los direccionamientos del líder de su área en que pertenece, dando cumplimiento a la normatividad vigente, evaluando las acciones para establecer mejora en sus procesos.",
              "Teniendo en cuenta el desempeño diario del empleado y la cantidad de trabajo asignado, responda:",
              [
                { aspecto: "1. Realiza su trabajo sin errores", valoracion: 0 },
                { aspecto: "2. Hace uso racional de los recursos", valoracion: 0 },
                { aspecto: "3. Realiza su trabajo sin necesidad de supervisión frecuente", valoracion: 0 },
                { aspecto: "4. Realiza su trabajo de acuerdo a los procedimientos establecidos por la empresa ", valoracion: 0 },
                { aspecto: "5. Cumple con los tiempos de entrega o solicitud de los requerimientos realizados", valoracion: 0 },
                { aspecto: "6. Participa en actividades de educación continuada para el mejoramiento de su desempeño en el cargo asignado", valoracion: 0 },
              ],
              ""
            ),
            formatoEvaluador(
              "C. RELACIONES INTERPERSONALES: ",
              "Capacidad para relacionarse en forma positiva con las personas con quienes interactúa",
              "Considerando los criterios de calidad requeridos para cada labor que desarrolla el empleado, responda:",
              [
                { aspecto: "1. Se muestra cortes y respetuoso con los usuarios y sus compañeros de trabajo.", valoracion: 0 },
                { aspecto: "2. Brinda adecuada orientación a los usuarios.", valoracion: 0 },
                { aspecto: "3. Evita conflictos dentro del equipo de trabajo.", valoracion: 0 },
                { aspecto: "4. Mantiene un buen ambiente de trabajo cumpliendo las instrucciones dadas, aunque no siempre este de acuerdo con ello.", valoracion: 0 },
              ],
              ""
            ),
            formatoEvaluador(
              "D. INICIATIVA: ",
              "Cualidad para tomar la iniciativa de hacer alguna actividad o tarea por su propia voluntad, sin la desviación del alcance de sus labores y siguiendo el objetivo común del cumplimiento de las metas con su equipo de trabajo",
              "Considerando los criterios de calidad requeridos para cada labor que desarrolla el empleado, responda:",
              [
                { aspecto: "1. Muestra nuevas ideas para mejorar los procesos", valoracion: 0 },
                { aspecto: "2. Se muestra asequible al cambio", valoracion: 0 },
                { aspecto: "3. Se anticipa a las dificultades.", valoracion: 0 },
                { aspecto: "4. Tiene gran capacidad para resolver problemas", valoracion: 0 },
              ],
              ""
            ),
            formatoEvaluador(
              "E. TRABAJO EN EQUIPO: ",
              "Apoyar y colaborar con los compañeros en las labores internas a sus procesos, capacidad para interrelacionarse con otros, para cooperar en el alcance de objetivos comunes, subordinando los intereses particulares a los del equipo",
              "Considerando los comportamientos cotidianos del empleado, responda:",
              [
                { aspecto: "1. Muestra aptitud para integrarse al equipo", valoracion: 0 },
                { aspecto: "2. Se identifica fácilmente con los objetivos del equipo", valoracion: 0 },
                { aspecto: "3. Acepta las indicaciones de la mejor manera", valoracion: 0 },
                { aspecto: "4. Es comprometido con el grupo de trabajo", valoracion: 0 },
              ],
              ""
            ),
            formatoEvaluador(
              "F. RESPONSABILIDAD: ",
              "generar el cumplimiento con las políticas internas laborales ",
              "Considerando los comportamientos cotidianos del empleado, responda:",
              [
                { aspecto: "1. Cumple con el horario establecido", valoracion: 0 },
                { aspecto: "2. Se evidencia pertenencia con el uso correcto del uniforme", valoracion: 0 },
                { aspecto: "3. Cumple con los compromisos adquiridos", valoracion: 0 },
                { aspecto: "4. Se evidencia responsabilidad social del medio ambiente", valoracion: 0 },
              ],
              ""
            ),
            {
              margin: [0, 20, 0, 0],
              table: {
                widths: ["17%", "*", "*"],
                body: [
                  [{ text: "RESULTADOS DE LA EVALUACION DE DESEMPEÑO", colSpan: 3, style: "boldcenter" }, "", ""],
                  [{ text: "Obtenga el resultado de la evaluación sumando el puntaje de cada aspecto calificado.", rowSpan: 8, margin: [0, 30, 0, 0], style: "color" }, { text: "ASPECTOS EVALUADOS", style: "color" }, { text: "CALIFICACION", style: "color" }],
                  [" ", "A. ORGANIZACIONALES", ""],
                  [" ", "B. CALIDAD", ""],
                  [" ", "C. RELACIONES INTERPERSONALES", ""],
                  [" ", "D. INICIATIVA", ""],
                  [" ", "E. TRABAJO EN EQUIPO", ""],
                  [" ", "F. RESPONSABILIDAD", ""],
                  [" ", "F. CALIFICACION FINAL", ""],
                ]
              }
            },
            {
              margin: [0, 6, 0, 0],
              table: {
                widths: ["15%", "15%", "*"],
                body: [
                  [{ colSpan: 3, text: "TOMA DE DECISION SEGUN RESULTADO (evaluación cualitativa)", style: "boldcenter" }, "", ""],
                  [{ text: "Rangos", style: "color" }, { text: "Valores", style: "color" }, { text: "Aceptabilidad / Aprobación", fillColor: color }],
                  [{ text: "101-125", alignment: "center" }, { text: "Excelente", alignment: "center" }, "Totalmente aceptable y se felicita al trabajador"],
                  [{ text: "76-100", alignment: "center" }, { text: "Muy Bueno", alignment: "center" }, "Aceptable, pero se debe dejar planes de mejora para el trabajador y ser revisado mínimo en 6 meses"],
                  [{ text: "51-75", alignment: "center" }, { text: "Bueno", alignment: "center" }, "Dependerá de la decisión del jefe Inmediato, en caso de ser aceptable se deberá dejar planes de mejora y hacer seguimiento cada 3 meses, en caso que no se evidencia cumplimiento en los compromisos se tomará como No aceptable."],
                  [{ text: "25-50", alignment: "center" }, { text: "Regular - Malo", alignment: "center" }, "No aceptable, sin recomendaciones ni oportunidad de plan de mejora, se recomienda dirigirse al área de Talento Humano"],
                ]
              }
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: "*",
                heights: [10, 40, 40, 10],
                body: [
                  [{ text: "MEJORAMIENTO CONTINUO", style: "boldcenter" }],
                  [`Describa las principales fortalezas: `],
                  [`Describa los aspectos que debe reforzar: `],
                  [{
                    columns: [
                      { text: "Según el motivo de la evaluación ¿aprueba?", width: "50%" },
                      { text: "Si", width: "auto" },
                      { ...subrayado(condicional("", "1")), width: "4%" },
                      { text: "No", width: "auto", margin: [10, 0, 0, 0] },
                      { ...subrayado(condicional("", "1")), width: "4%" },
                      { text: "¿por qué?", width: "10%", margin: [10, 0, 0, 0] },
                    ]
                  }]
                ]
              }
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ["45%", "*", "15%", "4%", "4%"],
                body: [
                  [
                    { text: [{ text: "PLAN DE MEJORA", bold: true }, " - ACCIONES PROPUESTAS"], colSpan: 2, style: "color" },
                    "",
                    { text: "FECHA SEGUIMIENTO", rowSpan: 2, alignment: "center" },
                    { text: "CUMPLE", colSpan: 2, alignment: "center", bold: true },
                    ""
                  ],
                  [{ text: "COMPROMISOS / TAREAS", alignment: "center" }, { text: "RESPONSABLES", alignment: "center" }, "", "SI", "NO"],
                  [" ", "", "", "", ""],
                  [" ", "", "", "", ""],
                  [" ", "", "", "", ""],
                  [" ", "", "", "", ""],
                  [{ text: "COMENTARIOS EMPLEADO", style: "boldcenter", colSpan: 5 }],
                  [{ text: " ", colSpan: 5 }],
                  [{ text: " ", colSpan: 5 }],
                  [{ text: " ", colSpan: 5 }],
                ]
              }
            },
            {
              margin: [0, 5, 0, 0],
              table: {
                widths: "*",
                heights: [30, "auto"],
                body: [
                  [
                    {
                      stack: [
                        " ",
                        { text: "FIRMA EVALUADOR", bold: true }
                      ]
                    },
                    {
                      stack: [
                        " ",
                        { text: "FIRMA EVALUADO", bold: true }
                      ]
                    },
                  ],
                  [`CARGO: `, `CARGO: `],

                ]
              }
            },
            {
              margin: [0, 5, 0, 0],
              ...formatCaja({
                stack: [
                  { text: "ESPACIO RESERVADO PARA TALENTO HUMANO", bold: true, alignment: "center", color: "#676767" },
                  { text: [{ text: "Fecha recepción formato: ", bold: true }, ""], margin: [0, 10, 0, 0] },
                  { columns: [{ text: "VºB: ", bold: true, width: "auto", margin: [0, 0, 5, 0] }, subrayado(" ")], margin: [0, 20, 0, 10] },
                ]
              })
            }
          ]

        })
      ]
    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

const solicitud_vacaciones = (data) => {
  return new Promise((res) => {
    let margin = {
      left: 10,
      right: 10

    };

    var dd = {
      defaultStyle: {
        fontSize: 11,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
          fontSize: 12,
          fillColor: "#7199FC"
        },
        color: {
          alignment: "center", fillColor: "#7199FC"
        }
      },
      pageMargins: [
        margin.left, 105, margin.right, 10
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [
            margin.left, 10, margin.right, 0
          ],
          ...formatCaja({
            fontSize: 11,
            columns: [
              { image: data.logo, fit: [150, 150] },
              {
                width: "65%",
                alignment: "right",
                stack: [
                  "SIKUANY SAS",
                  { text: "FORMATO SOLICITUD PERIODO DE VACACIONES", bold: true, fontSize: 14 },
                  "TALENTO HUMANO",
                  { columns: [`Código: TH-FO-11`, { text: "V.05", width: "10%" }, `Fecha de Aprobación: 14-09-2022`], fontSize: 10 },
                  "Página " + currentPage.toString() + " de " + pageCount,
                ]
              }
            ]
          })
        }
      },

      content: [
        formatCaja({
          stack: [
            formatCaja("Objetivo: Documentar la solicitud formal del disfrute de las vacaciones remuneradas según el derecho del trabajador por haber prestado sus servicios durante un año en cumplimiento normativo del código sustantivo de trabajo y del reglamento interno de Sikuany SAS."),
            {

              margin: [0, 10, 0, 10],
              columns: [

                { text: "Fecha de solicitud:", width: "auto" },
                subrayado(" "),
                { text: "Sede o punto de dispensación:", width: "auto", margin: [3, 0, 0, 0] },
                subrayado(" "),
              ]
            },
            {
              table: {
                widths: "*",
                body: [
                  [{ text: "Información del solicitante", style: "boldcenter" }],
                  [{
                    stack: [
                      {
                        columns: [

                          { text: "Nombres y apellidos:", width: "auto" },
                          subrayado(" "),

                        ]
                      },

                      {
                        margin: [0, 5, 0, 0],
                        columns: [

                          { text: "Número de identificación:", width: "auto" },
                          subrayado(" "),
                          { text: "Cargo:", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [

                          { text: "Correo electrónico:", width: "auto" },
                          subrayado(" "),
                          { text: "Contacto:", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },
                    ]
                  }],
                  [{ text: "Solicitud de Vacaciones", style: "boldcenter" }],
                  [{
                    columns: [
                      { text: "Periodo laborado:", width: "20%" },
                      { text: "desde:", width: "auto" },
                      subrayado(" "),
                      { text: "hasta:", width: "auto", margin: [5, 0, 0, 0] },
                      subrayado(" "),
                    ]
                  },],
                  [{ text: "Solicito las vacaciones que me corresponden, para ser disfrutadas:", alignment: "center" }],
                  [{
                    columns: [
                      { text: "Inicio desde", width: "auto" },
                      subrayado(" "),
                      { text: "Finalizando el", width: "auto", margin: [5, 0, 0, 0] },
                      subrayado(" "),
                      { text: "Regresando a laborar el", width: "auto", margin: [5, 0, 0, 0] },
                      subrayado(" "),
                    ]
                  },],
                ]
              }
            },

            {
              margin: [0, 5, 0, 0],
              table: {
                widths: ["*", "9%", "*", "8%", "*"],
                heights: ["auto", 45],
                body: [
                  [{ text: "Firma del solicitante", style: "boldcenter" }, { colSpan: 4, text: "Nombre y Firma de quien reemplaza (si aplica)", style: "boldcenter" }, "", "", ""],
                  [" ", { text: "Nombre: ", margin: [0, 15, 0, 0] }, " ", { text: "Firma: ", margin: [0, 15, 0, 0] }, " "]
                ]
              }
            },
            {
              margin: [0, 3, 0, 0],
              table: {
                widths: "*",
                heights: ["auto", 40],
                body: [
                  [{ text: "Observaciones del trabajador", style: "boldcenter" }],
                  [" "]
                ]
              }
            },

            {
              margin: [0, 3, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: "Aprobación Empresarial", style: "boldcenter", colSpan: 3 }, "", ""],
                  [{ text: "Jefe Inmediato", alignment: "center" }, { text: "Firma de Aprobado", alignment: "center", border: [true, true, true, false] }, { text: "Firma de Aprobado Gerencia", alignment: "center" }],
                  [`Nombre: `, { text: "Coordinador de Talento Humano", border: [true, false, true, true], alignment: "center" }, { rowSpan: 3, text: "" }],
                  [`Cargo: `, { rowSpan: 3, text: "" }, ""],
                  [`Fecha: `, "", ""],
                  [`Firma: `, "", `Fecha de aprobación:`]
                ]
              }
            },
            {
              margin: [0, 3, 0, 0],
              table: {
                widths: "*",
                heights: ["auto", 40],
                body: [
                  [{ text: "Observaciones de la empresa", style: "boldcenter" }],
                  [" "]
                ]
              }
            },
            {
              margin: [0, 20, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: [{ text: "Elaborado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Revisado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Aprobado por: ", bold: true }, "Rosalyn"] }],
                  [{ text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }],
                  [{ columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }]
                ]
              }
            },
          ]

        })
      ]
    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

const certificacion_laboral = (data) => {
  return new Promise((res) => {
    let margin = {
      left: 40,
      right: 40

    };

    var dd = {
      defaultStyle: {
        fontSize: 13,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",

        },

      },
      pageMargins: [
        margin.left, 165, margin.right, 50
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [
            margin.left, 40, margin.right, 0
          ],
          stack: [
            { image: data.logo, fit: [200, 200] },
            { text: `Nit: 830`, bold: true }
          ]

        }
      },
      footer: function (currentPage, pageCount) {
        return {
          alignment: "center",
          fontSize: 8,
          margin: [0, 0, 0, 15],
          stack: [
            "RED DE SERVICIOS FARMACEUTICOS",
            "Calle 268 No.38-76 B. Siete de Agosto",
            "TELEFONIA IP 661",
            "VILLAVICENCIO - META"
          ]
        };
      },
      content: [
        { text: 'LA SUSCRITA COORDINADORA DE TALENTO HUMANO DE LA EMPRESA "SIKUANY S.A.S"', style: "boldcenter", margin: [0, 10, 0, 0] },
        { text: "CERTIFICA", style: "boldcenter", margin: [0, 50, 0, 0] },
        {
          text: [

            "Señor(a) ",
            { text: "DIYANA ESTRADA  VEGA", background: "yellow" },
            ", identificada con la cedula de ciudadanía No. ",
            { text: "30.081.939", background: "yellow" },
            ", labora con la empresa desde el ",
            { text: "22 de enero de 2021", background: "yellow" },
            ", desempeñando el cargo de ",
            { text: "regente de farmacia", background: "yellow" },
            " el municipio de ",
            { text: "Villavicencio", background: "yellow" },
            ",  devengando un salario mensual de ",
            { text: "$1.600.000 (un millón seiscientos mil pesos)", background: "yellow" },
            " con un contrato a término ",
            { text: "indefinido", background: "yellow" },
          ], margin: [0, 30, 0, 0]
        },
        {
          text: [

            "La presente certificación se expide a solicitud del interesado a los ",
            { text: "dieciocho (18) días del mes de diciembre de 2023.", background: "yellow" },

          ], margin: [0, 30, 0, 0]
        },
        { text: "Cordialmente", margin: [0, 50, 0, 0] },

        {
          margin: [0, 20, 0, 0],
          stack: [
            { image: data.logo, fit: [120, 120] },
            "NOHORA YANET PARRA BASTOS",
            `Celular 3227292338`

          ]
        }
      ]
    }
    pdfMake.createPdf(dd).open();
    res();

  });
};

const desplazamiento = (data) => {
  return new Promise((res) => {

    let margin = {
      left: 10,
      right: 10

    };

    var dd = {
      defaultStyle: {
        fontSize: 11,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
          fontSize: 12,
          fillColor: "#7199FC"
        },
        color: {
          alignment: "center", fillColor: "#7199FC"
        }
      },
      pageMargins: [
        margin.left, 105, margin.right, 10
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [
            margin.left, 10, margin.right, 0
          ],
          ...formatCaja({
            fontSize: 11,
            columns: [
              { image: data.logo, fit: [150, 150] },
              {
                width: "65%",
                alignment: "right",
                stack: [
                  "SIKUANY SAS",
                  { text: "FORMATO AUTORIZACION PARA DESPLAZAMIENTO DEL PERSONAL", bold: true, fontSize: 14 },
                  "TALENTO HUMANO",
                  { columns: [`Código: TH-FO-11`, { text: "V.05", width: "10%" }, `Fecha de Aprobación: 14-09-2022`], fontSize: 10 },
                  "Página " + currentPage.toString() + " de " + pageCount,
                ]
              }
            ]
          })
        }
      },

      content: [
        formatCaja({
          stack: [
            formatCaja({ text: ["Objetivo: ", { text: "Autorizar", color: "red" }, " el desplazamiento del trabajador oportunamente e informar a la ARL cuando corresponda a una comisión laboral"] }),
            {
              table: {
                widths: "*",
                body: [
                  [{ text: "Información del solicitante", style: "boldcenter" }],
                  [{
                    stack: [
                      {
                        columns: [

                          { text: "Nombres y apellidos:", width: "auto" },
                          subrayado(" "),
                          { text: "Identificación N:", width: "auto", margin: [3, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },

                      {
                        margin: [0, 5, 0, 0],
                        columns: [

                          { text: [{ text: "Sede ", color: "red" }, "de trabajo"], width: "auto" },
                          subrayado(" "),
                          { text: "Cargo:", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [

                          { text: "Contacto del trabajador:", width: "auto" },
                          subrayado(" "),
                          { text: "Nombre del jefe inmediato:", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },
                    ]
                  }],
                  [{ text: "Solicitud del desplazamiento", style: "boldcenter" }],
                  [{
                    stack: [
                      {
                        columns: [

                          { text: "Fecha del desplazamiento:", width: "auto" },
                          subrayado(" "),
                          { text: "Fecha de la solicitud:", width: "auto", margin: [3, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },

                      {
                        margin: [0, 5, 0, 0],
                        columns: [

                          { text: "N° de horas:", width: "auto" },
                          subrayado(" "),
                          { text: "Comprendida(s) entre:", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                          { text: "y", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [

                          { text: "N° de días:", width: "auto" },
                          subrayado(" "),
                          { text: "Comprendida(s) entre:", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                          { text: "y", width: "auto", margin: [13, 0, 0, 0] },
                          subrayado(" "),
                        ]
                      },
                    ]
                  }],
                  [{ text: "Motivo del desplazamiento", style: "boldcenter" }],
                  [{
                    stack: [
                      {

                        columns: [
                          { text: "Reunión programada", margin: [0, 2, 0, 0], width: "20%" },
                          { ...formatCaja(condicional("", "1")), width: "3.5%" },
                          { text: "Transporte de medicamentos", margin: [15, 2, 0, 0], width: "31%" },
                          { ...formatCaja(condicional("", "01")), width: "3.5%" },
                          { text: "Delegación o representación de la empresa", margin: [10, 0, 0, 0], },
                          { ...formatCaja(condicional("", "02")), width: "3.5%" },
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [
                          { text: "Auditoria", margin: [0, 2, 0, 0], width: "20%" },
                          { ...formatCaja(condicional("", "1")), width: "3.5%" },
                          { text: " ", margin: [15, 2, 0, 0], width: "31%" },
                          { ...formatCaja(condicional("", "01")), width: "3.5%" },
                          { text: "Radicación de facturas", margin: [10, 2, 0, 0], width: "30%" },
                          { ...formatCaja(condicional("", "02")), width: "3.5%" },
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [
                          { text: "Reemplazo personal", margin: [0, 2, 0, 0], width: "20%" },
                          { ...formatCaja(condicional("", "1")), width: "3.5%" },
                          { text: "Logística actividad de bienestar", margin: [15, 2, 0, 0], width: "31%" },
                          { ...formatCaja(condicional("", "01")), width: "3.5%" },
                          { text: "Examen ocupacional", margin: [10, 2, 0, 0], width: "30%" },
                          { ...formatCaja(condicional("", "02")), width: "3.5%" },
                        ]
                      },
                      {
                        margin: [0, 5, 0, 0],
                        columns: [
                          { text: "Otro", margin: [0, 2, 0, 0], width: "20%" },
                          { ...formatCaja(condicional("", "1")), width: "3.5%" },
                          { ...subrayado(" "), margin: [10, 3, 0, 0] }
                        ]
                      },
                    ]
                  }]
                ]
              }
            },
            {
              columns: [
                {

                  width: "60%",
                  table: {
                    widths: "*",
                    body: [
                      [{ text: "Descripción del desplazamiento", style: "boldcenter" }],
                      [" "],
                      [" "],
                      [" "]
                    ]
                  }
                },
                {
                  margin: [5, 10, 0, 0]
                  , columns: [
                    { text: "¿Soporte?", width: "30%" },
                    { text: "Si", width: "20%", margin: [10, 3, 0, 0] },
                    { ...formatCaja(condicional("", "1")), width: "10%" },
                    { text: "No", width: "20%", margin: [10, 3, 0, 0] },
                    { ...formatCaja(condicional("", "1")), width: "10%" },
                  ]
                },
              ]
            },
            {
              table: {
                heights: [8, 40, 8],
                widths: "*",
                body: [
                  [{ text: [{ text: "Firma ", color: "red" }, "del solicitante"], style: "color" }, { text: [{ text: "Firma ", color: "red" }, "de Autorización del jefe inmediato"], style: "color" }, { text: [{ text: "Firma ", color: "red" }, "de Talento Humano"], style: "color" }, { text: [{ text: "Firma ", color: "red" }, "del Gerente"], style: "color" }],
                  [{ rowSpan: 2, text: "" }, " ", " ", " "],
                  ["", `Fecha:`, `Fecha:`, `Fecha:`]
                ]
              }
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "¿Remisión a ARL Soporte?", width: "30%", color: "red" },
                { text: "Si", width: "10%", margin: [10, 3, 0, 0], color: "red" },
                { ...formatCaja(condicional("", "1")), width: "3.5%" },
                { text: "No", width: "10%", margin: [10, 3, 0, 0], color: "red" },
                { ...formatCaja(condicional("", "1")), width: "3.5%" },
                { text: "Fecha", margin: [15, 0, 0, 0], color: "red" },

                ""
              ]
            },
            {
              margin: [0, 20, 0, 0],
              table: {
                widths: "*",
                body: [
                  [{ text: [{ text: "Elaborado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Revisado por: ", bold: true }, "Rosalyn"] }, { text: [{ text: "Aprobado por: ", bold: true }, "Rosalyn"] }],
                  [{ text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }, { text: [{ text: "Cargo: ", bold: true }, ""] }],
                  [{ columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }, { columns: [{ text: "Firma: ", bold: true }, ""] }]
                ]
              }
            }
          ]

        })
      ]
    }

    pdfMake.createPdf(dd).open();
    res();

  });
};

const dotacion = (data) => {
  return new Promise((res) => {
    let productos = []

    data.productos_rep.forEach((p) => {
      productos.push([
        {
          text: p.codigo_rep,
          alignment: "center"
        },
        window.atob(p.nombreservicio_rep),
        {
          text: " ",
          alignment: "center"
        },
        "", {
          text: " ",
          alignment: "center"
        },
        " ", {
          text: " ",
          alignment: "center"
        }, {
          text: p.cantidad_rep.trim(),
          alignment: "right"
        }
      ],)
    })

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
      pageMargins: [
        margin.left, 110, margin.right, 20
      ],
      header: function (currentPage, pageCount, pageSize) {
        return {
          fontSize: 13,
          margin: [
            margin.left, 20, margin.right, 20
          ],
          table: {
            widths: "*",
            headerRows: 1,
            body: [
              [
                {
                  rowSpan: 4,
                  image: data.logo,
                  width: 100,
                  height: 65,
                  alignment: "center"
                }, {
                  text: "SISTEMA DE GESTION INTEGRAL HSEQ",
                  style: "boldcenter",
                  rowSpan: 2
                }, {
                  text: "CODIGO: GRH-FO-06",
                  style: "boldcenter"
                }
              ],
              [
                "", "", {
                  text: "VERSION: 01",
                  style: "boldcenter"
                }
              ],
              [
                "", {
                  text: "REGISTRO ENTREGA DE DOTACION Y EPP",
                  style: "boldcenter",
                  rowSpan: 2
                }, {
                  text: `FECHA: ${data.fechacorta_rep}`,
                  style: "boldcenter"
                }
              ],
              [
                "", "", {
                  text: `PÁGINA ${currentPage} DE ${pageCount}`,
                  style: "boldcenter"
                }
              ]
            ]
          }
        }
      },
      content: [
        {
          fontSize: 10,
          table: {
            widths: "*",
            headerRows: 1,
            body: [
              [
                {
                  text: "DATOS DEL TRABAJADOR",
                  style: "boldcenter",
                  colSpan: 4,
                  fontSize: 12
                },
                "",
                "",
                ""
              ],
              [
                {
                  text: "NOMBRE COMPLETO",
                  bold: true
                }, {
                  text: data.nombrecolabora_rep.trim(),
                  colSpan: 3
                }
              ],
              [
                {
                  text: "CEDULA CIUDADANÍA",
                  bold: true
                },
                data.idcolabora_rep.trim(), {
                  text: "CARGO",
                  bold: true
                },
                data.cargo_rep.trim(),
              ],
              [
                {
                  text: "FECHA DE ENTREGA",
                  bold: true
                }, {
                  text: data.fecha_rep,
                  colSpan: 3
                }
              ],
              [
                {
                  text: "TIPO DE DOTACION",
                  style: "boldcenter",
                  colSpan: 4,
                  fontSize: 12
                },
                "",
                "",
                ""
              ],
              [
                {
                  columns: [
                    {
                      text: "INICIAL",
                      width: "20%",
                      margin: [0, 0, 3, 0]
                    }, {
                      ...formatCaja((data.tipodot_rep == "1") ? "X" : " "),
                      width: "5%"
                    }, {
                      text: "PERIODICA",
                      width: "20%",
                      margin: [10, 0, 3, 0]
                    }, {
                      ...formatCaja((data.tipodot_rep == "2") ? "X" : " "),
                      width: "5%"
                    },
                  ],
                  style: "boldcenter",
                  colSpan: 4,
                  fontSize: 12
                },
                "",
                "",
                ""
              ],
              [
                {
                  text: "Por medio de mi firma en el presente documento, hago constar que: Recibí de TRANSPORTES LLANO LINE S.A.S.. La siguiente Dotación: ",
                  bold: true,
                  colSpan: 4
                },
                "",
                "",
                ""
              ],
            ]
          }
        }, {
          margin: [
            0, 2, 0, 0
          ],
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: [
              "9%",
              "*",
              "17%",
              "2%",
              "17%",
              "2%",
              "10%",
              "12%"
            ],
            body: [
              [
                {
                  text: "Código",
                  style: "boldcenter"
                },
                {
                  text: "Descripción",
                  style: "boldcenter"
                },
                {
                  colSpan: 4,
                  text: "Tipo (marque con una (X)",
                  style: "boldcenter"
                },
                "",
                "",
                "", {
                  text: "Unidad",
                  style: "boldcenter"
                }, {
                  text: "Cantidad",
                  style: "boldcenter"
                },
              ],
              ...productos,
              [
                {
                  colSpan: 8,
                  bold: true,
                  fontSize: 11,
                  columns: [
                    "Recibí Instrucción y Capacitación en el uso y manejo aducuado de los EPP?",
                    {
                      text: "SI",
                      width: "auto",
                      margin: [0, 0, 3, 0]
                    },
                    {
                      ...formatCaja(" "),
                      width: "5%"
                    },
                    {
                      text: "NO",
                      width: "auto",
                      margin: [10, 0, 3, 0]
                    }, {
                      ...formatCaja(" "),
                      width: "5%"
                    },
                  ]
                }
              ],
              [
                {
                  text: "EN CASO DE PERDIDA DE LOS ELEMENTOS DE PROTECCION PERSONAL (EPP) O DAÑO O PERDIDA SIN JUSTIFICACION ALGUNA, ANTES DE TERMINAR EL DERECHO A UNA NUEVA ENTREGA DE DOTACION, ESTOS SE SUMINISTRARAN Y SE DESCONTARAN POR NOMINA.",
                  bold: true,
                  colSpan: 8
                },
              ],
              [
                {
                  text: "Para ingresar a laborar a nombre de TRANSPORTES LLANO LINE S.A.S., en cualquier actividad, es indispensable utilizar estos elementos de protección personal suministrados por nosotros; de caso contrario, se hará acreedor a la sanción correspondiente en el Reglamento Interno de Trabajo.",
                  colSpan: 8
                },
              ],
            ]
          }
        }, {
          margin: [
            0, 2, 0, 0
          ],
          fontSize: 10.5,
          bold: true,
          table: {
            headerRows: 1,
            widths: "*",
            body: [
              [
                {
                  text: "Firmas",
                  fontSize: 12,
                  alignment: "center",
                  colSpan: 2
                },
                ""
              ],
              [
                {
                  stack: [
                    "Quien recibe a satisfacción:", {
                      text: "",
                      margin: [0, 20, 0, 0]
                    }
                  ]
                }, {
                  stack: [
                    "Quien entrega:", {
                      text: "",
                      margin: [0, 20, 0, 0]
                    }
                  ]
                },

              ],
              [
                "Nombre:", "Nombre:"
              ],
              [
                "Cargo:", "Cargo:"
              ],
            ]
          }
        }
      ]
    }

    pdfMake.createPdf(dd).open();
    res();

  });
};

// ------------- FUNCIONES DE AYUDA A PDFS --------------------------
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

const condicional = (dato, datoPdf) => {
  return (dato == datoPdf) ? "X" : " "
};
const liquidavac = (data, sendEmail) => {
  return new Promise((res) => {
    let nombreCompleto = `${data.nombres_rep.trim()} ${data.Apellido1_rep.trim()} ${data.Apellido2_rep.trim()}`;
    let data_devengos = [];
    let data_deducciones = [];
    let total_devengos = 0;
    let total_deducciones = 0;
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



    data.basesvac_rep.pop();
    data.basesvac_rep.forEach((el) => {
      if (el.codigo_rep.charAt(0) == "1") {
        data_devengos.push([
          el.descripcion_rep.trim(),
          el.valorbase_rep.trim(),
          { text: el.cantidad_rep.trim() || 0, alignment: 'right' },
          { text: el.valor_rep.trim() || 0, alignment: 'right' },
        ]);
        total_devengos += parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
      } else if (el.codigo_rep.charAt(0) == "2") {
        data_deducciones.push([
          el.descripcion_rep.trim(),
          { text: el.cantidad_rep.trim() || 0, alignment: 'right' },
          { text: el.valor_rep.trim() || 0, alignment: 'right' },
        ]);
        total_deducciones += parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
      }
    })

    // Ordenar tablas
    if (data_devengos.length < data_deducciones.length) {
      let diferencia = data_deducciones.length - data_devengos.length;
      for (let i = 0; i < diferencia; i++) {
        data_devengos.push([
          " ",
          " ",
          " ",
          " "
        ])
      }
    } else if (data_deducciones.length < data_devengos.length) {
      let diferencia = data_devengos.length - data_deducciones.length;
      for (let i = 0; i < diferencia; i++) {
        data_deducciones.push([
          " ",
          " ",
          " ",
          " "
        ])
      }
    }


    var margin = {
      left: 30,
      right: 30,
    };

    var dd = {
      watermark,
      pageMargins: [margin.left, 130, margin.right, 40],
      styles: {
        title: {
          bold: true,
          fontSize: 11
        },
        centerbold: {
          bold: true,
          alignment: 'center'
        },
        rightbold: {
          bold: true,
          alignment: 'right'
        },
        neto: {
          fontSize: 11,
          margin: [0, 10, 0, 10],
          bold: true
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [

          {
            margin: [margin.left, 30, margin.left, 0],
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
                width: "50%",
                style: 'title',
                text: `${data.desripEmpresa}\nNIT: ${data.idEmpresa}\nLIQUIDACION DE VACACIONES`
              },
              {
                style: 'title',
                alignment: 'center',
                text: [`Nro. ${data.nro_rep.trim()}\nFecha: `, { text: data.fecha_rep, bold: false }]
              },
            ],
          },
        ]
      },
      content: [
        {
          fontSize: 8,
          table: {
            widths: ['17%', '42%', '*'],
            heights: 10,
            body: [
              [
                { text: "NOMBRE Y APELLIDOS:", bold: true },
                nombreCompleto,
                { text: [{ text: "IDENTIFICACION:    ", bold: true }, parseFloat(data.identif_rep)] },
              ],
              [
                { text: "CARGO", bold: true },
                data.cargo_rep.trim(),
                ''
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 1) ? 0 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 2) ? 0 : 1;
            },
          }
        },
        {
          fontSize: 8,
          margin: [0, 15, 0, 0],
          table: {
            widths: ['17%', '14%', '27%', '*'],
            heights: 10,
            body: [
              [
                { rowSpan: 2, text: "PERIODO LIQUIDADO:", style: 'centerbold', margin: [0, 6, 0, 0] },
                { text: "Desde", bold: true, margin: [10, 0, 0, 0] },
                { text: "Hasta", bold: true, margin: [10, 0, 0, 0] },
                ''
              ],
              [
                '',
                data.perini_rep,
                data.perfin_rep,
                { text: [{ text: "DÍAS VACACIONES:       ", bold: true }, data.diasxliq_rep.trim()] },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 1) ? 0 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 2 || i === 3) ? 0 : 1;
            },
          }
        },
        {
          fontSize: 8,
          margin: [0, 15, 0, 0],
          table: {
            widths: ['17%', '42%', '*'],
            heights: 10,
            body: [
              [
                { text: "FECHA DE SALIDA:", bold: true },
                data.persal_rep,
                "",
              ],
              [
                { text: "FECHA DE RETORNO:", bold: true },
                data.perent_rep,
                { text: [{ text: "DÍAS LIQUIDADOS:        ", bold: true }, data.diasliq_rep.trim()] },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 1) ? 0 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 2) ? 0 : 1;
            },
          }
        },
        {
          margin: [0, 20, 0, 0],
          columns: [
            {
              width: "50%",
              fontSize: 8,
              table: {
                headerRows: 1,
                widths: '*',
                heights: 10,
                body: [
                  [
                    { text: "DEVENGADOS", style: 'centerbold' },
                    { text: "BASE", style: 'centerbold' },
                    { text: "CANTIDAD", style: 'centerbold' },
                    { text: "VALOR", style: 'centerbold' },
                  ],
                  ...data_devengos,
                  [
                    { text: "TOTAL", bold: true },
                    "",
                    "",
                    { text: formatNumero(total_devengos), style: 'rightbold' },
                  ]
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return (i === 0 || i === 1 ||
                    i === node.table.body.length || i === node.table.body.length - 1) ? 1.6 : 0;
                },
                vLineWidth: function (i, node) {
                  return (i === 0) ? 1.6 : 0;
                },

              }
            },
            {
              width: "50%",
              fontSize: 8,
              table: {
                headerRows: 1,
                widths: '*',
                heights: 10,
                body: [
                  [
                    { text: "DEDUCCIONES", style: 'centerbold' },
                    { text: "CANTIDAD", style: 'centerbold' },
                    { text: "VALOR", style: 'centerbold' },
                  ],
                  ...data_deducciones,
                  [
                    { text: "TOTAL", bold: true },
                    "",
                    { text: formatNumero(total_deducciones), style: 'rightbold' },
                  ]
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return (i === 0 || i === 1 ||
                    i === node.table.body.length || i === node.table.body.length - 1) ? 1.6 : 0;
                },
                vLineWidth: function (i, node) {
                  return (i === node.table.widths.length) ? 1.6 : 0;
                },

              }
            },
          ]
        },
        {
          columns: [
            { width: "50%", text: "" },
            {
              fontSize: 8,
              margin: [0, 25, 0, 30],
              table: {
                headerRows: 1,
                widths: '*',
                heights: 10,
                body: [
                  [{ text: "NETO A CANCELAR:", style: 'neto' }, { text: data.neto_rep.trim(), style: 'neto', alignment: "right" }]
                ],
              },
              layout: {
                vLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 1 : 0;
                },
              }
            }
          ]
        },

        {
          fontSize: 8,
          columns: [
            {
              width: '50%',
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      x2: 180,
                      y1: 0,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                },
                { text: 'RECIBIDO CONFORME', margin: [3, 6, 0, 0] },
                { text: nombreCompleto, margin: [3, 0, 0, 0] },
                { text: 'C.C:', margin: [3, 0, 0, 0] }
              ]
            },
            {
              width: '50%',
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      x2: 180,
                      y1: 0,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                },
                { text: 'EMPLEADOR', margin: [3, 6, 0, 0] },
                { text: data.desripEmpresa, margin: [3, 0, 0, 0] },
                { text: `NIT: ${data.idEmpresa}`, margin: [3, 0, 0, 0] }
              ]
            },
          ]
        }
      ],
      images: {
        logo: data.logo
      }
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
const certiDian = (data) => {
  return new Promise((res) => {
    let ingresosBrutos = 0;
    for (let i = 36; i <= 56; i++) {
      let valor = i <= 47 ? parseFloat(data.renglon[0][`r${i}_rep`].trim()) : 0;
      ingresosBrutos += valor;

      if (i != 48) data[`r${i}_rep`] = formatNumero(data.renglon[0][`r${i}_rep`].trim());
    }
    ingresosBrutos = formatNumero(ingresosBrutos);

    var dd = {
      pageMargins: [30, 10, 10, 30],
      content: [
        {
          table: {
            body: [
              [
                {
                  stack: [
                    {
                      image: data.logo_dian,
                      width: 110,
                      height: 50
                    }
                  ]
                },
                {
                  text:
                    `Certificado de Ingresos y Retenciones por Rentas de Trabajo y de Pensiones Año gravable  ${data.anocert_rep}`,
                  style: "boldCen",
                },
                {
                  stack: [
                    {
                      image: data.logo_220,
                      width: 115,
                      height: 50
                    }
                  ]
                },
              ],
            ],
          },
          layout: {
            vLineColor: "#555555",
            hLineColor: "#555555",
          },
        },
        {
          style: "small",
          table: {
            widths: [34, 50, 15, 70, 130, "*", "*"],
            body: [
              [
                {
                  colSpan: 5,
                  text:
                    "Antes de diligenciar este formulario lea cuidadosamente las instrucciones",
                  alignment: "center",
                },
                "",
                "",
                "",
                "",
                { colSpan: 2, text: "Número de formulario\n " },
                "",
              ],
              [
                { rowSpan: 2, text: "\nRetenedor", bold: true },
                `NIT\n ${data.idag_rep}`,
                `DV.\n ${data.dvag_rep}`,
                `Primer apellido\n${data.Apellido1ag_rep}`,
                `Segundo apellido\n${data.Apellido2ag_rep.trim()}`,
                `Primer nombre\n${data.nombresag_rep.trim()}`,
                "Otros nombres\n",
              ],

              ["", {
                colSpan: 6,
                text: `Razón social\n${data.razonag_rep.trim()}`,
              },
              ],
              [
                { text: "Trabajador", bold: true },
                {
                  colSpan: 2,
                  text: `Tipo de documento\n${data.tipo_rep.trim()}`,
                },
                "",
                {
                  colSpan: 2,
                  text: `Número de Identificación\n${data.id_rep.trim()}`,
                },
                "",
                {
                  colSpan: 2,
                  text: `Apellidos y nombres\n${data.Apellido1_rep
                    } ${data.Apellido2_rep.trim()} ${data.nombres_rep.trim()}`,
                },
                "",
              ],
              [
                {
                  colSpan: 3,
                  text: [
                    {
                      text: "Período de la Certificación\n",
                      alignment: "center",
                    },
                    {
                      text: [
                        {
                          text: [
                            { text: "DE:  ", bold: true },
                            data.periodoini_rep,
                          ],
                        },
                        {
                          text: [
                            { text: "            A:  ", bold: true },
                            data.periodofin_rep,
                          ],
                        },
                      ],
                    },
                  ],
                },
                "",
                "",
                {
                  text: `Fecha de expedición\n${data.fechaexp_rep}`,
                  alignment: "center",
                },
                `Lugar donde se practicó la retención\n${data.lugarexp_rep.trim()}`,
                `Cód. Dpto\n${data.dpto_rep}`,
                `Cód. Ciudad/Municipio\n${data.municipio_rep}`,
              ],
            ],
          },
          layout: {
            vLineColor: "#555555",
            hLineColor: "#555555",
          },
        },
        {
          style: "small",
          table: {
            widths: ["auto", "auto", "*"],
            body: [
              [
                { text: "Concepto de los ingresos", style: "boldCen" },
                { colSpan: 2, text: "Valor", style: "boldCen" },
                "",
              ],
              [
                "Pagos por salarios o emolumentos eclesiásticos",
                "36",
                { text: data.r36_rep, alignment: "right" },
              ],
              [
                "Pagos realizados con bonos electrónicos o de papel de servicio, cheques, tarjetas, vales, etc.",
                "37",
                { text: data.r37_rep, alignment: "right" },
              ],
              [
                "Pagos por honorarios",
                "38",
                { text: data.r38_rep, alignment: "right" },
              ],
              [
                "Pagos por servicios",
                "39",
                { text: data.r39_rep, alignment: "right" },
              ],
              [
                "Pagos por comisiones",
                "40",
                { text: data.r40_rep, alignment: "right" },
              ],
              [
                "Pagos por prestaciones sociales",
                "41",
                { text: data.r41_rep, alignment: "right" },
              ],
              [
                "Pagos por viáticos",
                "42",
                { text: data.r42_rep, alignment: "right" },
              ],
              [
                "Pagos por gastos de representación",
                "43",
                { text: data.r43_rep, alignment: "right" },
              ],
              [
                "Pagos por compensaciones por el trabajo asociado cooperativo",
                "44",
                { text: data.r44_rep, alignment: "right" },
              ],
              ["Otros pagos", "45", { text: data.r45_rep, alignment: "right" }],
              [
                "Cesantías e intereses de cesantías efectivamente pagadas en el periodo",
                "46",
                { text: data.r46_rep, alignment: "right" },
              ],
              [
                "Pensiones de jubilación, vejez o invalidez",
                "47",
                { text: data.r47_rep, alignment: "right" },
              ],
              [
                { text: "Total de ingresos brutos", bold: true },
                { text: "48", bold: true },
                { text: ingresosBrutos, alignment: "right" },
              ],

              [
                { text: "Concepto de los aportes", style: "boldCen" },
                { colSpan: 2, text: "Valor", style: "boldCen" },
                "",
              ],
              [
                "Aportes obligatorios por salud a cargo del trabajador",
                "49",
                { text: data.r49_rep, alignment: "right" },
              ],
              [
                "Aportes obligatorios a fondos de pensiones y solidaridad pensional a cargo del trabajador",
                "50",
                { text: data.r50_rep, alignment: "right" },
              ],
              [
                "Cotizaciones voluntarias al régimen de ahorro individual con solidaridad - RAIS",
                "51",
                { text: data.r51_rep, alignment: "right" },
              ],
              [
                "Aportes voluntarios al impuesto solidario por COVID 19",
                "52",
                { text: data.r52_rep, alignment: "right" },
              ],
              [
                "Aportes voluntarios a fondos de pensiones",
                { text: "53", bold: true },
                { text: data.r53_rep, alignment: "right" },
              ],
              [
                "Aportes a cuentas AFC",
                { text: "54", bold: true },
                { text: data.r54_rep, alignment: "right" },
              ],
              [
                {
                  text:
                    "Valor de la retención en la fuente por ingresos laborales y de pensiones",
                  color: "white",
                  fillColor: "#34628D",
                  bold: true,
                },
                { text: "55", bold: true },
                { text: data.r55_rep, alignment: "right" },
              ],
              [
                "Retenciones por aportes obligatorios al impuesto solidario por COVID 19",
                "56",
                { text: data.r56_rep, alignment: "right" },
              ],
              [
                { colSpan: 3, text: "Nombre del pagador o agente retenedor" },
                "",
                "",
              ],
              [
                {
                  colSpan: 3,
                  text: "Datos a cargo del trabajador o pensionado",
                  style: "boldCen",
                },
                "",
                "",
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 || rowIndex === 14
                ? "#E0E6F8"
                : rowIndex % 2 === 0
                  ? "#EFF5FB"
                  : null;
            },
            hLineWidth: function (i, node) {
              return i === 0 ||
                i === 14 ||
                i === node.table.body.length ||
                i === 21 ||
                i === 22 ||
                i === 23 ||
                i === 24
                ? 0.5
                : null;
            },
            vLineWidth: function (i, node) {
              return 1.5;
            },
            hLineColor: function (i, node) {
              return i === 0 ||
                i === 14 ||
                i === node.table.body.length ||
                i === 21 ||
                i === 22 ||
                i === 23 ||
                i === 24
                ? "#555555"
                : null;
            },
            vLineColor: "#555555",
          },
        },
        {
          style: "small",
          table: {
            widths: ["auto", 8, "*", 8, "*"],
            body: [
              [
                { text: "Concepto de otros ingresos", style: "boldCen" },
                { colSpan: 2, text: "Valor recibido", style: "boldCen" },
                "",
                { colSpan: 2, text: "Valor retenido", style: "boldCen" },
                "",
              ],
              ["Arrendamientos", "57", "", "64", ""],
              ["Honorarios, comisiones y servicios", "58", "", "65", ""],
              ["Intereses y rendimientos financieros", "59", "", "66", ""],
              ["Enajenación de activos fijos", "60", "", "67", ""],
              ["Loterías, rifas, apuestas y similares", "61", "", "68", ""],
              ["Otros", "62", "", "69", ""],
              [{ text: "Totales:", bold: true }, "63", "", "70", ""],
              [
                { text: `Total retenciones año gravable  ${data.anocert_rep}`, bold: true },
                { colSpan: 2, text: "" },
                "",
                "71",
                "",
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0
                ? "#E0E6F8"
                : rowIndex % 2 === 0
                  ? "#EFF5FB"
                  : null;
            },
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0.5 : null;
            },
            vLineWidth: function (i, node) {
              return 1.5;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length ? "#555555" : null;
            },
            vLineColor: "#555555",
          },
        },
        {
          style: "small",
          table: {
            widths: [15, "*", 8, "*"],
            body: [
              [
                { text: "Item", style: "boldCen" },
                {
                  colSpan: 2,
                  text: "72. Identificación de los bienes poseídos",
                  style: "boldCen",
                },
                "",
                { text: "73. Valor patrimonial", style: "boldCen" },
              ],
              [
                { text: "1", style: "boldCen" },
                { colSpan: 2, text: "" },
                "",
                "",
              ],
              [
                { text: "2", style: "boldCen" },
                { colSpan: 2, text: "" },
                "",
                "",
              ],
              [
                { text: "3", style: "boldCen" },
                { colSpan: 2, text: "" },
                "",
                "",
              ],
              [
                { text: "4", style: "boldCen" },
                { colSpan: 2, text: "" },
                "",
                "",
              ],
              [
                { text: "5", style: "boldCen" },
                { colSpan: 2, text: "" },
                "",
                "",
              ],
              [
                { text: "6", style: "boldCen" },
                { colSpan: 2, text: "" },
                "",
                "",
              ],
              [
                {
                  colSpan: 2,
                  text: `Deudas vigentes a 31 de Diciembre de   ${data.anocert_rep}`,
                  color: "white",
                  fillColor: "#34628D",
                  bold: true,
                },
                "",
                "74",
                "",
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0
                ? "#E0E6F8"
                : rowIndex % 2 === 0
                  ? "#EFF5FB"
                  : null;
            },
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length || i === 7
                ? 0.5
                : null;
            },
            vLineWidth: function (i, node) {
              return 1.5;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length || i === 7
                ? "#555555"
                : null;
            },
            vLineColor: "#555555",
          },
        },
        {
          fontSize: 6,
          table: {
            widths: ["auto", "auto", "auto", "*"],
            body: [
              [
                {
                  colSpan: 4,
                  text:
                    "Identificación del dependiente económico de acuerdo al parágrafo 2 del artículo 387 del Estatuto Tributario",
                  style: "boldCen",
                },
                "",
                "",
                "",
              ],
              [
                "75. Tipo de documento\n ",
                "76. No. Documento\n",
                "77. Apellidos y Nombres\n",
                "78. Parentesco\n",
              ],
              [
                {
                  colSpan: 3,
                  fontSize: 5,
                  text: `Certifico que durante el año gravable ${data.anocert_rep}:\n1. Mi patrimonio bruto no excedió de 4.500 UVT.\n2. Mis ingresos brutos fueron inferiores a 1.400 UVT.\n3. No fui responsable del impuesto sobre las ventas.\n4. Mis consumos mediante tarjeta de crédito no excedieron la suma de 1.400 UVT.\n5. Que el total de mis compras y consumos no superaron la suma de 1.400 UVT.\n6. Que el valor total de mis consignaciones bancarias, depósitos o inversiones financieras no excedieron los 1.400 UVT.\nPor lo tanto, manifiesto que no estoy obligado a presentar declaración de renta y complementario por el año gravable ${data.anocert_rep}.`,
                },
                "",
                "",
                "Firma del Trabajador o Pensionado",
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? "#E0E6F8" : null;
            },
            vLineColor: "#555555",
            hLineColor: "#555555",
          },
        },
        {
          text: [
            { text: "NOTA:", bold: true },
            " este certificado sustituye para todos los efectos legales la declaración de Renta y Complementario para el trabajador o pensionado que lo firme. Para aquellos trabajadores independientes contribuyentes del impuesto unificado deberán presentar la declaración anual consolidada del Régimen Simple de Tributación (SIMPLE).",
          ],
          fontSize: 6,
          alignment: "center",
        },
      ],
      styles: {
        small: {
          fontSize: 7,
        },
        boldCen: {
          bold: true,
          alignment: "center",
        },
      },
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};

export {
  certiDian,
  contratoTrabajo,
  certificacion_laboral,
  certLaboral,
  dotacion,
  desplazamiento,
  evaluacion_desemp,
  listaChequeo,
  liquidavac,
  liquidagth,
  solicitud_vacaciones,
  permiso_laboral,
  pago_nomina,
  vacacgth,
};

