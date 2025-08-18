import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { cond, trim } from "lodash";
import { ParseSpeeds } from "pdf-lib";
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

const atencionDomiciliaria = (data) => {
  return new Promise((res) => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();

    const margin = {
      left: 60,
      right: 60
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
        fontSize: 13,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 160, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          table: {
            widths: "*",
            body: [
              [
                {
                  width: 150,
                  height: 40,
                  image: data.logo,
                  rowSpan: 2,

                },
                {
                  colSpan: 2,
                  text: data.desripEmpresa,
                  style: "boldcenter"
                }, ""
              ],
              ["", { text: "Código: RH-FOR-27", colSpan: 2, style: "boldcenter" }, ""],
              [
                {
                  text: "CONSENTIMIENTO INFORMADO PARA ATENCION DOMICILIARIA",
                  rowSpan: 3,
                  colSpan: 2,
                  style: "boldcenter",
                  margin: [0, 10, 0, 0]
                }, "", `Fecha: ${data.fechaAct}`
              ],
              ["", "", "Versión: 2"],
              ["", "", `Documento Controlado`]
            ]
          }


        }

      },

      content: [
        {
          alignment: 'justify',
          stack: [
            {
              columns: [
                { text: "Yo", width: "8%" },
                { ...subrayado(data.nombrePaciente), width: "70%" },
                { text: " mayor de edad,", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "con documento de identidad N°", width: "39%" },
                subrayado(parseInt(data.identificacion)),
                { text: " de", margin: [20, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                subrayado(data.nombreciudad.trim()),
                { text: " actuando en nombre propio o como", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "representante legal de", width: "30%" },
                subrayado(" "),
              ]
            },
          ]
        },
        {
          margin: [0, 20, 0, 0],
          alignment: 'justify',
          stack: [
            { text: "DECLARO", bold: true, margin: [0, 0, 0, 10] },
            "Que     he      sido       informado(a)      hoy",
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "por ", width: "4%" },
                { ...subrayado(" "), width: "75%" },
                { text: " Anterior a la", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "valoración de las áreas de", width: "34%" },
                subrayado(" "),
              ]
            },
            { margin: [0, 3, 0, 0], text: "de los procedimientos requeridos para una atención terapéutica satistactoria y sin comprometer la integridad física y emocional del paciente durante la intervención terapéutica. Que todos los procedimientos efectuados pueden generar molestias y en algunas ocasiones complicaciones y que el resultado depende en forma importante del cumplimiento de cada una de las sesiones y ordenes terapéuticas que se determinen. Que teniendo en cuenta la condición de salud y limitación física o cognitiva del usuario se recomienda:" }
          ]
        },
        {
          margin: [20, 15, 0, 0],
          ul: [
            { margin: [0, 8, 0, 0], text: 'Visita domiciliaria' },
            { margin: [0, 8, 0, 0], text: 'Mecanismos de coordinación y supervisión del equipo tratante' },
            { margin: [0, 8, 0, 0], text: 'Se deberá realizar un comité científico de análisis de los casos.' },
            { margin: [0, 8, 0, 0], text: 'Los pacientes con atención domiciliaria «deberán tener su seguimiento en los diferentes aspectos a través de los comités establecidos por la IPS (historia clínica, mortalidad, infecciones).' },
            { margin: [0, 8, 0, 0], text: 'Entrenamiento a la familia incluyendo, plan casero de cuidado de pacientes en casa manejo de residuos, registros, restricción de procedimientos, por ejemplo: medicamentos parenterales, higiene y salubridad, manejo de almacenamiento de medicamentos.' },
            { margin: [0, 8, 0, 0], text: "El traslado del paciente del sitio de residencia en Villavicencio y que no requiera trasporte especializado estará a cargo de la IPS MEDICOOP." },
            { margin: [0, 8, 0, 0], text: "Deberá contar con un registo con el nombre del paciente atendido y trasladado indicando la fecha, hora, origen y destino del servicio, tipo de servicio, nombre del personal que atiende el servicio, evolución y procedimientos durante el traslado o atención de los pacientes en el programa o servicio." },
            { margin: [0, 8, 0, 0], text: "Se deberá tener registros de los cuidados encargados a la familia." },
            { margin: [0, 8, 0, 0], text: "Realizar procesos de evaluación y seguimiento de los riesgos inherentes al tipo de servicio que presta." }
          ]
        },
        {
          alignment: 'justify',
          margin: [0, 20, 0, 0],
          stack: [
            "Con respecto a lo manifestado por la Institución se me ha dado la oportunidad de preguntar y aclarar las dudas generadas sobre la atención en el servicio, por lo que he recibido la información a satisfacción sobre la atención a ser +*prestada.",
            { margin: [0, 10, 0, 0], text: "Por lo anterior doy constancia de haber sido informado(a) a satisfacción sobre el programa de atención domiciliaria que se me ha determinado y doy mi consentimiento para que se realicen los procedimientos propios de este tipo de" },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "atención en", width: "15%" },
                subrayado(" "),
              ]
            },
            {
              margin: [0, 3, 0, 0],
              ...subrayado(" "),
            },
            {
              margin: [0, 3, 0, 0],
              ...subrayado(" "),
            },
            {
              margin: [0, 3, 0, 0],
              ...subrayado(" "),
            },
            { text: "Y de esta manera acepto el tratamiento terapéutico y sus complicaciones y daños que se puedan generar. También se me ha informado de mi derecho a rechazar el tratamiento o revocar este consentimiento para el procedimiento especifico" },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { ...subrayado(" "), width: "57%" },
                "Y de las consecuencias posibles"
              ]
            },
            "de esta determinación.",
            {
              margin: [0, 10, 0, 10],
              columns: [
                { text: `En ${data.nombreciudad.trim()} a los`, width: "28%" },
                { ...subrayado(dia), width: "10%" },
                { text: "días, del mes", width: "20%", margin: [5, 0, 0, 0] },
                { ...subrayado(mes), width: "10%" },
                { text: "de", width: "auto" },
                subrayado(anio)
              ]
            },
            "Nombre o paciente del familiar",
            { ...subrayado(" "), margin: [0, 1, 0, 0] },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "Firma del paciente o familiar", width: "38%" },
                { ...subrayado(" "), width: "40%" },
                { text: " Documento", width: "17%", margin: [5, 0, 0, 0] },

              ]
            },
            { ...subrayado(" "), width: "10%", margin: [0, 3, 0, 0] },
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            { text: "Rechazo la atención y declaro que he sido ampliamente informado de las consecuencias de mi salud de esta decisión.", bold: true },
            {
              margin: [0, 10, 0, 10],
              columns: [
                { text: `En ${data.nombreciudad.trim()} a los`, width: "28%" },
                { ...subrayado(dia), width: "10%" },
                { text: "días, del mes", width: "20%", margin: [5, 0, 0, 0] },
                { ...subrayado(mes), width: "10%" },
                { text: "de", width: "auto" },
                subrayado(anio)
              ]
            },
            "Nombre o paciente del familiar",
            { ...subrayado(" "), margin: [0, 1, 0, 0] },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "Firma del paciente o familiar", width: "38%" },
                { ...subrayado(" "), width: "40%" },
                { text: " Documento", width: "17%", margin: [5, 0, 0, 0] },

              ]
            },
            { ...subrayado(" "), width: "10%", margin: [0, 3, 0, 0] },
          ]
        }

      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  });
};

const planillaAtencion = (data, fecha) => {
  return new Promise((res) => {
    const margin = {
      left: 30,
      right: 30,
    };

    const contenido = (copia) => {
      let filas = [];
      for (let i = 1; i <= parseInt(data.totalCitas); i++) {
        filas.push([{ text: i, style: "boldcenter", margin: [0, 12, 0, 12] }, "", "", "", ""])
      }
      return {
        stack: [
          {
            margin: [0, 17, 0, 0],
            style: "boldcenter",
            table: {
              widths: ["30%", "25%", "15%", "15%", "15%"],
              body: [
                [
                  {
                    width: 150,
                    height: 40,
                    image: data.logo,
                    rowSpan: 2,

                  },

                  {
                    colSpan: 2,
                    text: "PLANILLA DE ATENCION"
                  }, "",
                  {
                    colSpan: 2,
                    text: "Documento Controlado"
                  }, "",
                ],
                [
                  "",
                  `Fecha: 01/01/2014`,
                  { text: "Código: CE-F-264", colSpan: 2 }, "",
                  "Versión: 3"
                ]
              ]
            }


          },
          {
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0) ? 0 : 1;
              },
            },
            fontSize: 10,
            table: {
              widths: ["auto", "20%", "15%", "*", "*"],
              body: [
                [
                  {
                    margin: [5, 0, 0, 0],
                    colSpan: 5,
                    columns: [
                      {
                        width: "11%",
                        bold: true,
                        stack: [
                          "CONTRATO",
                          { text: "PACIENTE", margin: [0, 3, 0, 0] },
                          { text: "TIPO ID", margin: [0, 3, 0, 0] },
                          { text: "N* ID", margin: [0, 3, 0, 0] },
                          { text: "FECHA ACC", margin: [0, 3, 0, 0] },
                          { text: "TELEFONO", margin: [0, 3, 0, 0] },
                        ]
                      },
                      {
                        width: "30%",
                        stack: [
                          { text: data.contrato.detalle.trim(), decoration: "underline" },
                          { text: data.nombrePaciente, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.tipoid, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: parseInt(data.identificacion), margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.fechaaccid, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.telefono, margin: [0, 3, 0, 0], decoration: "underline" },

                        ]
                      },
                      // {
                      //   margin: [0, 20, 0, 0],
                      //   width: "10%",
                      //   stack: [
                      //     { text: "DX:", bold: true },
                      //     { text: data.dx, margin: [0, 3, 0, 0], decoration: "underline" },
                      //   ]
                      // },
                      {
                        width: "25%",
                        bold: true,
                        stack: [
                          "N AUTORIZACION:",
                          { text: "FECHA AUTORIZACION:", margin: [0, 3, 0, 0] },
                          { text: "FECHA VENCIMIENTO:", margin: [0, 3, 0, 0] },
                          { text: "PROFESIONAL:", margin: [0, 3, 0, 0] },
                          { text: "Nro.SESIONES:", margin: [0, 3, 0, 0] },
                          { text: "DX:", margin: [0, 3, 0, 0] },
                        ]
                      },
                      {
                        width: "*",
                        stack: [
                          { text: data.autorizacion || "0", decoration: "underline" },
                          { text: data.fechaauto, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.fechavence, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.profesional, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.totalCitas, margin: [0, 3, 0, 0], decoration: "underline" },
                          { text: data.dx, margin: [0, 3, 0, 0], decoration: "underline" },
                        ]
                      },
                    ]
                  },
                  "", "", "", ""
                ],
                [
                  {
                    colSpan: 5,
                    text: [
                      { text: "SERVICIO SOLICITADO:", margin: [4, 3, 0, 4], bold: true },
                      { text: "", margin: [0, 3, 0, 0], decoration: "underline" },
                    ]
                  }, "", "", "", ""
                ],
                [
                  { text: "No.CITA", style: "boldcenter" },
                  { text: "FECHA ATENCION", style: "boldcenter" },
                  { text: "HORA", style: "boldcenter" },
                  { text: "FIRMA PROFESIONAL", style: "boldcenter" },
                  { text: "FIRMA USUARIO", style: "boldcenter" },
                ],
                ...filas,
                [
                  {
                    colSpan: 5,
                    text: [
                      { text: "IMPRIME:", margin: [0, 3, 0, 0], bold: true },
                      { text: data.imprime, margin: [0, 3, 0, 0] },
                    ]
                  }, "", "", "", ""
                ]
              ]
            }
          },
          copia ? {
            bold: true,
            margin: [0, 5, 0, 0],
            fontSize: 14,
            text: "COPIA",
            alignment: "center"
          } : {
            bold: true,
            margin: [0, 5, 0, 0],
            fontSize: 14,
            text: "ORIGINAL",
            alignment: "center"

          }
        ]
      }
    }

    var dd = {
      pageSize: { width: 1224, height: 792 },
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      //pageMargins: [margin.left, 30, margin.right, 30],
      pageMargins: [30, 33, 30, 2],


      content: [
        {
          columns: [
            contenido(),
            { ...contenido(true), margin: [10, 0, 0, 10] }
          ]
        }
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  });
};
const cons_infoServicio = (data) => {
  return new Promise((res) => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const margin = {
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

    var dd = {
      defaultStyle: {
        fontSize: 12,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 160, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          table: {
            widths: "*",
            body: [
              [
                {
                  width: 150,
                  height: 40,
                  image: data.logo,
                  rowSpan: 2,

                },
                {
                  colSpan: 2,
                  text: data.desripEmpresa,
                  style: "boldcenter"
                }, ""
              ],
              ["", { text: `Código: RH-FOR-19`, colSpan: 2, style: "boldcenter" }, ""],
              [
                {
                  text: "CONSENTIMIENTO INFORMADO SERVICIO",
                  rowSpan: 3,
                  colSpan: 2,
                  style: "boldcenter",
                  margin: [0, 10, 0, 0]
                }, "", `Fecha: ${data.fechaAct}`
              ],
              ["", "", "Versión: 2"],
              ["", "", `Documento Controlado`]
            ]
          }


        }

      },
      content: [
        {
          stack: [
            {
              bold: true,
              columns: [
                {
                  text: "Paciente:",
                  width: "10%"
                },
                subrayado(data.nombrePaciente),
                { text: "IDENTIFICACION:", width: "auto" },
                { ...subrayado(parseInt(data.id_rep)), width: "18%" }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              bold: true,
              columns: [
                {
                  text: "EDAD:",
                  width: "auto"
                },
                { ...subrayado(data.edad), width: "10%" },
                { text: "TRATAMIENTO:", width: "auto" },
                subrayado(" ")
              ]
            },
            {
              margin: [0, 10, 0, 0],
              text: "Usted tiene derecho a conocer el procedimiento/ entrenamiento clínico deportivo al que va a ser sometido y las complicaciones más frecuentes que ocurren. Este documento intenta explicarle todas estas cuestiones; léalo atentamente y consulte con su fisioterapeuta todas las dudas que se le planteen. Le recordamos que, por imperativo legal, tendrá que firmar, usted O SU representante legal, el consentimiento informado para que podamos realizarle dicho procedimiento."
            }
          ]
        },
        {
          margin: [0, 30, 0, 0],
          stack: [
            {
              text: "1. PROCEDIMIENTO:",
              bold: true
            },
            {
              columns: [
                {
                  margin: [0, 2, 0, 0],
                  width: "30%",
                  stack: [
                    "Movilizaciones articulares",
                    { text: "Fortalecimiento muscular", margin: [0, 6, 0, 0] },
                    { text: "Estiramientos", margin: [0, 6, 0, 0] },
                    { text: "Técnicas de facilitación", margin: [0, 8, 0, 0] },
                    { text: "Masoterapia", margin: [0, 6, 0, 0] },
                    { text: "Medios físicos", margin: [0, 6, 0, 0] },
                    { text: "Técnica Williams/ Klapp", margin: [0, 8, 0, 0] },
                    { text: "Técnica de Kegel", margin: [0, 6, 0, 0] },
                    { text: "Rehabilitación vestibular", margin: [0, 8, 0, 0] },
                    { text: "Kinesiterapia", margin: [0, 8, 0, 0] },
                    {
                      columns: [
                        { text: "Otro:", width: "auto" },
                        subrayado(" ")
                      ],
                      margin: [0, 6, 0, 0]

                    },
                  ]
                },
                {
                  width: "5%",
                  stack: [
                    formatCaja(" "),
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                    { ...formatCaja(" "), margin: [0, 1, 0, 0] },
                  ]
                },
                {
                  margin: [30, 0, 0, 0],
                  width: "40%",
                  fit: [260, 260],
                  image: data.cuerpoImagen
                }
              ]
            }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            {
              style: "boldcenter",
              text: "2. CONSECUENCIAS.PREVESIBLES DE SU REALIZACION Y DE LA NO REALIZACION"
            },
            {
              margin: [0, 10, 0, 0],
              stack: [
                { bold: true, text: "De realizarse el tratamiento se logra:" },
                {
                  table: {
                    widths: ["14%", "*", "20%", "24%", "20%"],
                    body: [
                      [
                        {
                          alignment: "center",
                          stack: [
                            "Disminuir\ndolor",
                            { columns: [{ ...formatCaja(" "), width: "35%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Mejorar funciones en las actividades de la vida diaria",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Ser independiente en sus funciones",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Mejorar calidad de vida con respecto a su patología",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Integración en sus actividades laborales",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                      ]
                    ]
                  }
                }
              ]
            },
            {
              margin: [0, 10, 0, 0],
              stack: [
                { bold: true, text: "De no realizarse el tratamiento:" },
                {
                  table: {
                    widths: ["14%", "*", "20%", "24%", "20%"],
                    body: [
                      [
                        {
                          alignment: "center",
                          stack: [
                            "Mantener\ndolor",
                            { columns: [{ ...formatCaja(" "), width: "35%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Limitaciones en sus funciones básicas y laborales",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Ser\ndependiente en sus funciones",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Mantener retracciones articulares",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                        {
                          alignment: "center",
                          stack: [
                            "Deficiencias en el desarrollo de sus tareas diarias.",
                            { columns: [{ ...formatCaja(" "), width: "20%" }] }
                          ]
                        },
                      ]
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          margin: [0, 30, 0, 0],
          stack: [
            {
              text: "3.- DESCRIPCION DE LOS RIESGOS TÍPICOS DEL TRATAMIENTO",
              bold: true
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ["95%", "*"],
                body: [
                  [
                    "Aumento de la inflamación",
                    " "
                  ],
                  [
                    "Quemaduras superficiales por uso del paquete caliente o frio de no avisar si le causa molestia",
                    " "
                  ],
                  [
                    "Irritación del gel conductor en la piel",
                    " "
                  ],
                  [
                    "Aumento del dolor durante las primeras sesiones del tratamiento",
                    " "
                  ],
                  [
                    "Golpes con materiales de trabajo de no estar atento a las indicaciones del profesiónal.",
                    " "
                  ],
                  [
                    "Irritación o quemadura superficial con el uso de la parafina",
                    " "
                  ],
                  [
                    "Mareo",
                    " "
                  ],
                  [
                    "Adormecimiento",
                    " "
                  ],
                  [
                    "Caídas/Golpes por traslado y/o equipos suspendidos",
                    " "
                  ]
                ]
              }

            },

          ]
        },
        {
          margin: [0, 20, 0, 0],

          stack: [
            {
              text: "4.- DECLARACION DE CONSENTIMIENTO.",
              bold: true
            },
            {
              margin: [0, 10, 0, 0],
              stack: [
                {
                  columns: [
                    { text: "Yo", width: "5%" },
                    { ...subrayado(data.nombrePaciente), width: "40%" },
                    { text: " identificado(a) con C.C", margin: [7, 0, 10, 0], width: "auto" },
                    { ...subrayado(parseInt(data.identificacion)), width: "17%" },
                    " en"
                  ]
                },
                {
                  margin: [0, 3, 0, 0],
                  columns: [
                    { text: "calidad de paciente o como representante legal de ", width: "auto", margin: [0, 0, 10, 0] },
                    subrayado(" "),

                  ]
                },
                {
                  margin: [0, 3, 0, 0],
                  columns: [
                    { text: "identificado/a con CC, RC, Tl y CE ", width: "auto", margin: [0, 0, 10, 0] },
                    { ...subrayado(" "), width: "22%" },
                    "y en pleno uso de mis facultades"

                  ]
                },
                { text: "mentales y de mis derechos, manifiesto voluntariamente lo siguiente:", margin: [0, 3, 0, 0] },

              ]
            },

            {
              margin: [0, 12, 0, 0],
              stack: [
                {
                  columns: [
                    { text: "Que el/la terapeuta", width: "22%" },
                    subrayado(" "),
                    { text: " me ha informado de forma confidencial,", margin: [3, 0, 0, 0], width: "auto" },
                  ]
                },
                { text: "respetuosa, verbal y/o escrita comprensibles acerca de mi enfermedad la necesidad de realizar en mi persona y/o familiar el tratamiento quese requiere; abordando en forma clara la naturaleza y el propósito de este procedimiento, losriesgos asociados sus posibles efectos secundarios las complicaciones que pudieran aparecer, durante y después del procedimiento; y los beneficios que se obtendiía.de la realización formal de mi tratamiento.", margin: [0, 3, 0, 0] },

              ]
            },

            {
              margin: [0, 12, 0, 0],
              text: "Se me ha dado la oportunidad de preguntar y aclarar dudas generadas sobre la atención en el servicio, por lo que he recibido la información a satistacción sobre la atención allí prestada."
            },
            {
              margin: [0, 12, 0, 0],
              text: "También del compromiso que adquiero en la asistencia a terapias y en la cancelación de las mismas, como mínimo 24 horas antes, si no pudiera asistir por algún motivo y que la inasistencia de 2 o más: días programados de terapias, implicaría la cancelación de todas las terapias programadas y se entendería como abandono del proceso de rehabilitación. Para el entrenamiento clínico deportivo si el paciente no asistió y no cancelo la cita se dará por vista y tiene Una duración máxima de 30 días para realizar el entrenamiento a partir de la fecha de pago:"
            },

            {
              margin: [0, 12, 0, 0],
              stack: [
                "Por lo anterior, doy constancia de haber sido informado a satisfacción sobre el programa",
                {
                  columns: [
                    { text: "de Terapias", width: "14%" },
                    { ...subrayado(" "), width: "23%" },
                    " que se me ha determinado y doy consentimiento para"
                  ]
                },
                {
                  margin: [0, 3, 0, 0],
                  text: "qu me realicen los procedimientos propios de este tipo de atención, entendiendo y aceptando los riesgos de complicaciones y daños que pueden implicar."
                }
              ]
            },
            {
              margin: [0, 12, 0, 0],
              stack: [
                {
                  columns: [
                    { text: "En fe de la cual, firmo el presente documento, en la ciudad de", width: "auto" },
                    subrayado(data.nombreciudad.trim()),
                  ]
                },
                {
                  margin: [0, 3, 0, 0],
                  columns: [
                    { text: "A los días", width: "auto" },
                    { ...subrayado(dia), width: "10%" },
                    { text: "del mes", width: "auto" },
                    { ...subrayado(mes), width: "10%" },
                    { text: "del año", width: "auto" },
                    { ...subrayado(anio), width: "10%" },
                  ]
                }
              ]
            },
            {
              margin: [0, 20, 0, 0],
              stack: [
                subrayado(" "),
                "Firma y cedula."
              ]
            }
          ]
        },

      ]
    }

    pdfMake.createPdf(dd).open()
    res()
  })
};

const compr_prestacionServ = (data) => {
  return new Promise((res) => {
    const margin = {
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

    var dd = {
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 110, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 10, margin.right, 0],
          table: {
            widths: "*",
            body: [
              [
                {
                  width: 110,
                  height: 40,
                  image: data.logo,
                  rowSpan: 2,

                },
                {
                  colSpan: 2,
                  text: data.desripEmpresa,
                  style: "boldcenter"
                }, ""
              ],
              ["", { text: `Código: ASI-FOR-37`, colSpan: 2, style: "boldcenter" }, ""],
              [
                {
                  text: "COMPROBANTE PRESTACION DE SERVICIO",
                  rowSpan: 2,
                  colSpan: 2,
                  style: "boldcenter",
                  margin: [0, 10, 0, 0]
                }, "", `Fecha: 09/08/2021`
              ],
              ["", "", "Versión: 1"],
              ["", "", `Documento Controlado`]
            ]
          }


        }

      },

      content: [
        {
          margin: [0, 0, 0, 0],
          text: "LEY 1438 DE 2012. RESOLUCION 3047 DEL 2008 ANEXO 5.", alignment: "center"
        },
        {
          margin: [0, 8, 0, 0],
          text: "COMPROBANTE PRESTACION DE SERVICIO",
          style: "boldcenter"
        },

        {
          margin: [0, 10, 0, 0],
          alignment: 'justify',
          stack: [
            "Mediante el presente documento, se deja constancia que el usuario",
            {
              columns: [
                { text: " ", width: "10%" },
                subrayado(data.nombrePaciente),
                { text: " con documento de identidad número", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 3],
              columns: [
                subrayado(parseInt(data.identificacion)),
                { width: "80%", text: " ha recibido atención en el servicio, conforme como se detalla en el", margin: [20, 0, 0, 0] }
              ]
            },
            "siguiente cuadro."
          ]
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: "*",
            body: [
              [
                {
                  margin: [0, 3, 0, 3],
                  text: [
                    { text: "Servicio prestado:", bold: true },
                    data.servicio
                  ],
                  colSpan: 2,
                }, ""
              ],
              [
                {
                  margin: [0, 3, 0, 3],
                  text: [
                    { text: "Número telefónico:", bold: true },
                    parseFloat(data.telefono)
                  ]
                },
                {
                  margin: [0, 3, 0, 3],
                  text: [
                    { text: "Número autorización:", bold: true },
                    data.autorizacion
                  ]
                }
              ],
              [
                {
                  margin: [0, 3, 0, 3],
                  text: [
                    { text: "Profesional:", bold: true },
                    data.profesional
                  ]
                },
                {
                  margin: [0, 3, 0, 3],
                  text: [
                    { text: "Fecha:", bold: true },
                    data.fechaservicio
                  ]
                }
              ],
            ]
          }
        },
        {
          margin: [0, 10, 0, 0],
          text: "Con la cual se deja constancia de cumplimiento de la prestación del servicio solicitado y prestado por la entidad, para constancia se firma el presente documento."
        },
        {
          margin: [0, 10, 0, 0],

          columns: [
            {
              margin: [0, 30, 0, 0],
              width: "50%",
              alignment: "center",
              stack: [
                subrayado(" "),
                "Firma del usuario o responsable"
              ]
            },
            {
              margin: [25, 0, 0, 0],
              alignment: "center",
              width: "20%",
              stack: [
                formatCaja(" ", 80),
                "Huella"
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

const cons_anfiltracion = (data) => {
  return new Promise((res) => {
    const margin = {
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
      defaultStyle: {
        fontSize: 13,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 180, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          table: {
            widths: "*",
            body: [
              [
                {
                  width: 150,
                  height: 40,
                  image: data.logo,
                  rowSpan: 2,

                },
                {
                  colSpan: 2,
                  text: data.desripEmpresa,
                  style: "boldcenter"
                }, ""
              ],
              ["", { text: `Código: RH-FOR-13`, colSpan: 2, style: "boldcenter" }, ""],
              [
                {
                  text: "CONSENTIMIENTO INFORMADO ANFILTRACION",
                  rowSpan: 3,
                  colSpan: 2,
                  style: "boldcenter",
                  margin: [0, 10, 0, 0]
                }, "", `Fecha: 08/02/2024`
              ],
              ["", "", "Versión: 1"],
              ["", "", `Documento Controlado`]
            ]
          }


        }

      },

      content: [
        {
          text: "CONSENTIMIENTO INFORMADO PARA INFILTRACION ARTICULAR E INTRAARTICULAR.",
          style: "boldcenter"
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            "La infiltración articular e intraarticular consiste en la introducción de una sustancia antiinflamatoria (generalmente un corticoide de depósito asociada a un anestésico local) con una jeringa en una parte del cuerpo de manera local. Puede utilizarse como técnica diagnóstica o terapéutica.",
            { margin: [0, 10, 0, 0], text: "El objetivo de las infiltaciones consiste en aliviar o suprimir el dolor y las manifestaciones inflamatorias, prevenir o recuperar la limitación funcional, acelerar la evolución favorable del proceso y disminuir o eliminar la necesidad de tratamientos más agresivos o efectos secundarios." },
            { margin: [0, 10, 0, 0], text: "La infiltración suele precisar, en algunos casos, anestesia local." },
            { margin: [0, 10, 0, 0], text: "Después de la infiltración presentará en la zona de pinchazo molestias debidas al propio pinchazo y al volumen de medicamento introducido. Si la inyección se ha introducido dentro de la articulación es conveniente que realice reposo durante 24-48 horas para disminuir el riesgo de aumento de la inflamación articular." }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            { text: "Riesgos típicos de la infiltración", bold: true },
            {
              margin: [0, 10, 0, 0],
              ul: [
                'Reacción alérgica a la medicación introducida, bajada de tensión arterial, así como un mínimo porcentaje de mortalidad por anafilaxia.',
                'Lesiones en vasos, nervios y tendones adyacentes.',
                'Infección en la zona de pinchazo e irritación de la articulación con inflamación de la misma.',
                'Descompensación temporal de diabetes, hipertensión arterial o úlceras.',
                'Aparición de atrofia cutánea en la zona de los pinchazos.'
              ]
            },
            { margin: [0, 7, 0, 0], text: "Haga constar a su médico si usted padece alguno de los siguientes procesos, en cuyo caso habrán de tomarse medidas especiales:" },
            {
              margin: [0, 10, 0, 0],
              ul: [
                'Trastornos de la coagulación (Hemofilia, trombopenia, tratamiento con anticoagulantes, etc.)',
                'Alergia a anestésicos locales o medicamentos de otro tipo.',
                'Trastornos circulatorios (isquemia distal, claudicación intermitente, gangrena, etc.)',
                'Inmunodeficiencia (incluyendo infección por VIH, Sida).',
                'Hepatitis aguda o crónica.'
              ]
            },
          ]
        },
        {
          margin: [0, 20, 0, 0],
          alignment: 'justify',
          stack: [
            {
              columns: [
                { text: "Yo", width: "5%" },
                subrayado(" "),
                { text: " identificado(a) con", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "numero de documento", width: "35%" },
                subrayado(" "),
                { text: " de", margin: [20, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                subrayado(" "),
                { text: " con domicilio en", margin: [10, 0, 0, 0] }
              ]
            },
            { ...subrayado(" "), margin: [0, 3, 0, 0] }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            { text: "Si el paciente no está capacitado para la toma de decisión:", bold: true },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "Yo", width: "5%" },
                subrayado(" "),
                { text: " identificado(a) con", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "numero de documento", width: "35%" },
                subrayado(" "),
                { text: " de", margin: [20, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                subrayado(" "),
                { text: " con domicilio en", margin: [10, 0, 0, 0] }
              ]
            },
            { ...subrayado(" "), margin: [0, 3, 0, 0] }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          alignment: 'justify',
          stack: [
            { text: "DECLARO", bold: true, margin: [0, 0, 0, 10] },
            "Que he leído la hoja de información y he sido informado/a por el Dr./Dra.",
            {
              margin: [0, 3, 0, 0],
              columns: [
                { ...subrayado(" "), width: "75%" },
                { text: " del procedimiento", margin: [10, 0, 0, 0] }
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                { ...subrayado(" "), width: "70%" },
                { text: " e ¡igualmente de los", margin: [10, 0, 0, 0] }
              ]
            },
            "beneficios que se esperan y del tipo de riesgos que comporta su realización (complicaciones más frecuentes) y su no realización, así como de las posibles alternativas.",
            { margin: [0, 10, 0, 0], text: "He comprendido toda la información que se me ha proporcionado y mis dudas han sido aclaradas satistactoriamente." }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          alignment: 'justify',
          stack: [
            { text: "AUTORIZO:", bold: true, margin: [0, 0, 0, 10] },
            data.desripEmpresa + " a que me practiquen el procedimiento referido (descrito anteriormente) y las pruebas complementarias necesarias. Soy conocedor/a de que en caso de urgencia o por causas imprevistas podrán utilizar las actuaciones médicas necesarias para mantenerme con vida o evitarme un daño",
            { text: "Sé que en cualquier momento puedo revocar mi consentimiento:", margin: [0, 10, 0, 0] }
          ]
        },
        {
          margin: [0, 40, 0, 0],
          columns: [
            {
              alignment: "center",
              stack: [
                subrayado(" "),
                "FIRMA PACIENTE"
              ]
            },
            {
              alignment: "center",
              margin: [20, 0, 0, 0],
              stack: [
                subrayado(" "),
                "FIRMA ESPECIALISTA"
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

const cons_electromioVeloc = (data) => {
  return new Promise((res) => {
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
      pageMargins: [margin.left, 180, margin.right, 40],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 30, margin.right, 0],
          table: {
            widths: "*",
            body: [
              [
                {
                  width: 150,
                  height: 40,
                  image: data.logo,
                  rowSpan: 2,

                },
                {
                  colSpan: 2,
                  text: data.desripEmpresa,
                  style: "boldcenter"
                }, ""
              ],
              ["", { text: `Código: RH-FOR-02`, colSpan: 2, style: "boldcenter" }, ""],
              [
                {
                  text: "CONSENTIMIENTO INFORMADO ELECTROMIOGRAFIA Y VELOCIDAD DE CONDUCCIÓN NERVIOSA",
                  rowSpan: 3,
                  colSpan: 2,
                  style: "boldcenter",
                  margin: [0, 10, 0, 0]
                }, "", `Fecha: 08/02/2024`
              ],
              ["", "", "Versión: 1"],
              ["", "", `Documento Controlado`]
            ]
          }


        }

      },

      content: [
        {
          stack: [
            { text: "Marque una “X” la opción que corresponde según el procedimiento:", bold: true },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ["80%", "10%", "10%"],
                body: [
                  ["Electromiografía.", "", ""],
                  ["Neuroconducción", "", ""],
                  ["Potenciales evocados somatosensoriales.", "", ""],
                  ["Potenciales evocados auditivos", "", ""],
                  ["Potenciales evocados visuales", "", ""],
                  ["Reflejo H", "", ""],
                  ["Onda F", "", ""],
                ]
              }
            }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            { text: "+ IDENTIFICACIÓN Y DESCRIPCIÓN DEL PROCEDIMIENTO", bold: true },
            {
              margin: [0, 10, 0, 0],
              text: "El examen de electromiografía y velocidad de conducción nerviosa, es un procedimiento que entrega información respecto de la actividad de los nervios periféricos y de los músculos correspondientes, señalándome que el estudio de velocidad de conducción nerviosa corresponde a la estimulación de un nervio periférico con un impulso eléctrico obteniéndose la información necesaria sobre el funcionamiento de éste, y que el estudio de electromiografía es un examen invasivo donde se evalúa, puncionando con un electrodo de registro (tipo aguja), la actividad del músculo en reposo y durante un esfuerzo. Esta información permite estudiar un posible compromiso del músculo, secundario o un daño neurológico periférico o un daño primario de éste."
            },
            {
              margin: [0, 10, 0, 0],
              text: "Además, las únicas contraindicaciones para la realización del examen son el uso de marcapasos cardiaco y/o el tratamiento con anticoagulantes."
            },
            {
              margin: [0, 10, 0, 0],
              text: "El examen puede ser algo molesto y en cierta forma dolorosa según la zona donde se realice el estudio, dentro de las complicaciones que pueden presentarse para velocidad de conducción se ha descrito del aumento de la sensibilidad de la piel causada por los electrodos y para el caso de la electromiografía se han descrito algunas complicaciones tales como dolor, infección cutánea, equimosis y sangrado."
            },
            {
              margin: [0, 10, 0, 0],
              text: "Por lo señalado. anteriormente es importante informar:"
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "¿El paciente utiliza marcapaso cardiaco?", width: "60%" },
                { text: "NO", width: "auto" },
                { ...formatCaja(" "), width: "5%" },
                { text: "SI", width: "10%", alignment: "right" },
                { ...formatCaja(" "), width: "5%" }
              ]
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "¿El paciente está en tratamiento con anticoagulante?", width: "60%" },
                { text: "NO", width: "auto" },
                { ...formatCaja(" "), width: "5%" },
                { text: "SI", width: "10%", alignment: "right" },
                { ...formatCaja(" "), width: "5%" }
              ]
            }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            { text: "+ AL DAR MI CONSENTIMIENTO:", bold: true },
            {
              margin: [0, 10, 0, 0],
              text: "1. Entiendo mi estado de salud y que, por indicación médica, dicho procedimiento supone beneficios esperados para mejorar la situación que me afecta."
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "2. ANTECEDENTES ALÉRGICOS:", width: "40%" },
                { text: "NO", width: "auto" },
                { ...formatCaja(" "), width: "5%" },
                { text: "SI", width: "20%", alignment: "right" },
                { ...formatCaja(" "), width: "5%" },
                { text: "Cuál:", alignment: "right" }
              ]
            },
            subrayado(" "),
            {
              margin: [0, 10, 0, 0],
              text: "3. Me comprometo a brindar la información veraz cuando sea solicitada por el especialista y a cumplir con las indicaciones médicas que me sean indicadas y también a informar aquellas que no he de cumplir."
            },
            {
              margin: [0, 10, 0, 0],
              text: '4. Soy consciente que, en la realización de estudios médicos, en este caso, electromiografía, pueden presentarse efectos adversos o complicaciones, ejemplos: molestia o dolor al "pinchazo" con electrodos de aguja, o al paso de la descarga eléctrica regulada, pequeños sangrados, hematomas (moretones), dolores después de realizado el estudio, que pueden durar varios días, hormigueos, cosquilleos o adormecimientos en partes del cuerpo, infecciones en la zona del "pinchazo" (raras) etc.'
            },
            {
              margin: [0, 10, 0, 0],
              text: "Dejo constancia que he entendido el contenido del presente consentimiento informado, al igual que las respuestas a las preguntas que hubiere formulado, razón por la cual autorizo al profesional que firma al pie de la presente, a que me realice el estudio de electromiografía."
            }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            "PACIENTE",
            {
              columns: [{ text: "FIRMA", width: "auto" }, { ...subrayado(" "), width: "50%" }],
              margin: [0, 20, 0, 0]
            },
            {
              columns: [{ text: "NOMBRE COMPLETO", width: "auto" }, { ...subrayado(data.nombrePaciente), width: "50%" }],
              margin: [0, 5, 0, 0]
            },
            {
              columns: [{ text: "NUMERO DE IDENTIFICACIÓN", width: "auto" }, { ...subrayado(parseInt(data.identificacion)), width: "50%" }],
              margin: [0, 5, 0, 0]
            },
            {
              columns: [{ text: "TELEFONO", width: "auto" }, { ...subrayado(data.telefono), width: "50%" }],
              margin: [0, 5, 0, 20]
            },
            "ESPECIALISTA",
            {
              columns: [{ text: "FIRMA", width: "auto" }, { ...subrayado(" "), width: "50%" }],
              margin: [0, 20, 0, 0]
            },
          ]
        }
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  });
};

const incapacidad = (data) => {
  return new Promise((res) => {


    const seccion = data.secciones_rep.find(item => item.seccion_rep == "114");

    let strCoded = seccion.base1_rep.trim()
      + seccion.base2_rep.trim()
      + seccion.base3_rep.trim() + seccion.base4_rep.trim()
      + seccion.base5_rep.trim()
      + seccion.base6_rep.trim()
      + seccion.base7_rep.trim()
      + seccion.base8_rep.trim()
      + seccion.base9_rep.trim()
      + seccion.base10_rep.trim()
      + seccion.base11_rep.trim()
      + seccion.base12_rep.trim()
      + seccion.base13_rep.trim()
      + seccion.base14_rep.trim()
      + seccion.base15_rep.trim()
      + seccion.base16_rep.trim()
      + seccion.base17_rep.trim()
      + seccion.base18_rep.trim()
      + seccion.base19_rep.trim()
      + seccion.base20_rep.trim()
      + seccion.base21_rep.trim()
      + seccion.base22_rep.trim()
      + seccion.base23_rep.trim()
      + seccion.base24_rep.trim()
      + seccion.base25_rep.trim()
      + seccion.base26_rep.trim()
      + seccion.base27_rep.trim()
      + seccion.base28_rep.trim()
      + seccion.base29_rep.trim()
      + seccion.base30_rep.trim()
      + seccion.base31_rep.trim()
      + seccion.base32_rep.trim()
      + seccion.base33_rep.trim()
      + seccion.base34_rep.trim()
      + seccion.base35_rep.trim()
      + seccion.base36_rep.trim()
      + seccion.base37_rep.trim()
      + seccion.base38_rep.trim()
      + seccion.base39_rep.trim();
    let observaciones = atob(strCoded);

    const margin = {
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
          margin: [margin.left, 20, margin.right, 0],
          columns: [
            {
              width: "22%",
              stack: [
                {
                  image: data.logo,
                  fit: [70, 70],
                },
                { text: `FECHA: ${data.fechahc_rep}`, margin: [0, 15, 0, 0], fontSize: 12 }
              ]
            },
            {
              width: "*",
              alignment: "center",
              fontSize: 10,
              stack: [
                data.empresa.descrip_empr.trim(),
                { margin: [0, 2, 0, 0], text: `NIT ${parseInt(data.empresa.id_empr)}` },
                { margin: [0, 2, 0, 0], text: `Direccion: ${data.empresa.direccion_empr} Telefono: ${data.empresa.telefono_empr.trim()}`, fontSize: 12 },
                {
                  style: "boldright",
                  fontSize: 15,
                  columns: [
                    { margin: [0, 3, 3, 0], text: "INCAPACIDAD" },
                    { width: "20%", alignment: "left", ...formatCaja(`No ${parseInt(data.consecutivo_rep)}`) }
                  ]
                },

              ]
            },


          ]
        }

      },
      content: [
        {
          layout: {
            vLineWidth: function (i, node) {
              return 0;
            },

          },
          table: {
            widths: "*",
            body: [
              [
                {
                  columns: [
                    {
                      width: "10%",
                      bold: true,
                      stack: [
                        "PACIENTE:",
                        // { text: "APB:", margin: [0, 4, 0, 0] },
                        // { text: "CONTRATO:", margin: [0, 4, 0, 0] },
                        { text: "GENERO:", margin: [0, 4, 0, 0] },
                        { text: "ENTIDAD:", margin: [0, 4, 0, 0] },
                        { width: "30%", text: "CAUSA INGRESO:", },
                      ]
                    },
                    {
                      width: "35%",
                      stack: [
                        data.nombre1_rep.trim() + " " + data.nombre2_rep.trim() + " " + data.apellido1_rep.trim() + " " + data.apellido2_rep.trim(),
                        // { text: "  ", margin: [0, 4, 0, 0] },
                        // { text: " ", margin: [0, 4, 0, 0] },
                        { text: data.genero_rep, margin: [0, 4, 0, 0] },
                        { text: data.eps_rep.trim(), margin: [0, 4, 0, 0] },
                        { text: data.causa_rep.trim(), margin: [0, 4, 0, 0] },
                      ]
                    },
                    { width: "30%", text: `EDAD: ${data.edad_rep.trim()}` },

                    {
                      width: "15%",
                      bold: true,
                      stack: [
                        "IDENTIFICACION:",
                        { text: "HISTORIA CLINICA:", margin: [0, 4, 0, 0] }
                      ]
                    },
                    {

                      stack: [
                        parseInt(data.idpaciente_rep),
                        { text: parseInt(data.consecutivo_rep), margin: [0, 4, 0, 0] },
                      ]
                    },
                  ]
                }
              ],
              [
                [
                  {
                    stack: [
                      {
                        columns: [
                          { width: "30%", text: [{ text: "FECHA INICIAL: ", bold: true }, " "] },
                          { width: "30%", text: [{ text: "FECHA FINAL:", bold: true }, " "] },
                          { width: "40%", text: [{ text: "TOTAL DIAS: ", bold: true }, " "] },

                        ]
                      },

                      // { text: [{ text: "MOTIVO: ", bold: true }, " "], alignment: "right" },
                      {
                        columns: [
                          { width: "30%", text: seccion.viamedic_rep },
                          { width: "30%", text: seccion.frecmedic_rep, margin: [-7, 0, 0, 0] },
                          { width: "30%", text: seccion.cantordm_rep.trim() },

                          // { width: "35%", text: [{ text: "INCAPACIDAD: ", bold: true }, " "] },
                          // { width: "25%", text: [{ text: "DÍAS: ", bold: true }, " "] },
                          // { width: "25%", text: [{ text: "PRORROGA:", bold: true }, " "] },

                        ]
                      },
                      // { text: [{ text: "FECHA ACCIDENTE ó DX. E.P: ", bold: true }, " "], margin: [0, 4, 0, 0] },
                    ]
                  }
                ]
              ],
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          layout: {
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            }
          },
          table: {
            widths: "*",
            body: [
              [
                [{ text: "DIAGNOSTICO", style: "boldcenter" }],

              ],
              [
                [
                  {
                    stack: [
                      {
                        bold: true,
                        columns: [
                          //{ width: "15%", text: "FECHA" },
                          { width: "30%", text: "CODIGO" },
                          { width: "35%", text: "DESCRIPCION" },
                          //{ width: "20%", text: "ESPECIALIDAD" },
                          //{ width: "20%", text: "PROFESIONAL" },
                        ]
                      },
                      {

                        columns: [
                          { width: "30%", text: seccion.dx1inc_rep.split(":")[0].trim() },
                          { width: "35%", text: seccion.dx1inc_rep.split(":")[1].trim() },

                        ]
                      },
                      {

                        columns: [
                          { width: "30%", text: seccion.dx2inc_rep.split(":")[0].trim() },
                          { width: "35%", text: seccion.dx2inc_rep.split(":")[1].trim() },

                        ]
                      },
                      {

                        columns: [
                          { width: "30%", text: seccion.dx3inc_rep.split(":")[0].trim() },
                          { width: "35%", text: seccion.dx3inc_rep.split(":")[1].trim() },
                        ]
                      }
                    ]
                  }
                ]
              ],

            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          layout: {
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineWidth: function (i, node) {
              return (i === 0) ? 0 : 1;
            }
          },
          table: {
            widths: "*",
            body: [
              [
                [{ text: "OBSERVACIONES", style: "boldcenter" }],

              ],
              [[{ text: observaciones + "\n" + seccion.fechaacc_rep, margin: [0, 0, 0, 40], }]],
              [
                [
                  {

                    stack: [
                      {
                        columns: [
                          { width: "45%", text: [{ text: "MEDICO: ", bold: true }, { text: data.descprofesional.trim(), bold: false }, " "] },
                          { width: "30%", text: [{ text: "IDENTIFICACION: ", bold: true }, { text: parseFloat(data.idprofes_rep), bold: false }, " "] },
                          { width: "20%", text: [{ text: "REGISTRO:", bold: true }, { text: data.regmedico_rep.trim(), bold: false }, " "] },
                        ]
                      },

                      {
                        margin: [0, 20, 0, 10],
                        style: "boldcenter",
                        columns: [
                          {
                            stack: [
                              {
                                image: data.firma,
                                fit: [120, 120],
                              },
                              subrayado(" "),
                              "FIRMA MEDICO",
                              { text: ["ESPECIALIDAD: ", { text: data.especialidad_rep.trim(), bold: false }], margin: [0, 5, 0, 0] },
                              { text: ["PROFESIONAL: ", { text: data.descprofesional.trim(), bold: false }] },
                            ]
                          },
                          {
                            margin: [0, 80, 0, 0],
                            stack: [
                              subrayado(" "),
                              "FIRMA PACIENTE"
                            ]
                          }
                        ]
                      },

                    ]
                  }
                ]
              ],

            ]
          }
        },
        {
          margin: [0, 10, 0, 0],
          stack: [
            `Usuario: `,
            `Fecha impresión: ${data.fechaimp_rep}`
          ]
        }
      ]

    }
    pdfMake.createPdf(dd).open();
    res();
  });
};

const recordatorioCitas = (data, masiva) => {
  return new Promise((res) => {
    data.edad = data.edad.replace(/\Anos/g, "Años");

    let margin = {
      left: 20,
      right: 20
    };
    var dd = {
      pageMargins: [margin.left, 100, margin.right, 20],
      footer: function (currentPage, pageCount) {
        return {
          text: `Pagina ${currentPage} de ${pageCount}`,
          fontSize: 9,
          alignment: "center"
        };
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            margin: [margin.left, 20, margin.right, 20],
            columns: [
              { image: data.logo, fit: [75, 75], width: "30%" },

              {
                width: "50%",
                fontSize: 7,
                alignment: "center",
                stack: [

                  { text: data.nombre_empresa, fontSize: 12 },
                  { text: `NIT: ${data.nit_empresa.trim()}`, margin: [0, 2, 0, 0] },
                  `${data.direccion_empresa} - ${data.ciudad_empresa} - Colombia`,
                  { text: `Teléfono${data.telefono_empresa}` },
                  `E-mail: ${data.email_empresa}`,
                  { text: "RECORDATORIO DE CITA", bold: true, fontSize: 18 },
                ]


              },
            ]
          }
        ]
      },
      content: [
        {
          fontSize: 10,
          layout: {
            hLineColor: "grey"
          },
          table: {
            widths: "*",
            body: [
              [
                [
                  {
                    columns: [
                      { text: "Paciente:", bold: true },
                      data.descrip_paciente.trim(),
                      { text: "Identificación:", bold: true },
                      parseFloat(data.identificacion),
                      { text: "Edad:", bold: true },
                      data.edad.trim(),

                    ]
                  },
                ]
              ]
            ]
          }
        },
        {
          text: `Dirección Cita: ` + data.direccion_rep.trim(),
          bold: true,
          fontSize: 10,
          margin: [0, 30, 0, 0]
        },
        {
          fontSize: 10,
          layout: {
            hLineColor: "grey"
          },
          table: {
            widths: "*",
            body: [
              [
                [
                  {
                    columns: [
                      { text: "Fecha de Asignación:", bold: true },
                      data.fechaagendo_rep,
                      { text: "Asignada por:", bold: true },
                      data.agendo_rep.trim(),
                    ]
                  },
                  // {
                  //   margin: [0, 10, 0, 0],
                  //   columns: [
                  //     { text: "Médico:", bold: true },
                  //     "",
                  //     { text: "Especialidad:", bold: true },
                  //     "",
                  //   ]
                  // },
                  {
                    margin: [0, 10, 0, 0],
                    columns: [
                      { text: "Fecha:", bold: true },
                      data.fecha_ag,
                      { text: "Hora:", bold: true },
                      data.hora_ag,
                      { text: "Sala/Consultorio:", bold: true },
                      data.sala_rep,
                    ]
                  },
                  {
                    margin: [0, 10, 0, 0],
                    columns: [
                      { text: "Servicio:", bold: true },
                      data.servicio,
                      { text: "" },
                    ]
                  },


                ]
              ]
            ]
          }
        },

        {
          fontSize: 10,
          margin: [0, 30, 0, 0],

          text: "El día de su cita, presentarse con 15 minutos de anticipación a caja. Presente su documento de identificación. Cancele su cuota moderadora. Menores de 18 años deben asistir con acompañante. Si no puede asistir, recuerde cancelar su cita con anterioridad. Agradecemos su Colaboración"
        },

      ]
    }

    if (masiva) {
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBuffer(res);
    } else {
      pdfMake.createPdf(dd).open();
      res();
    }

  });
};

const lecturas_rx = (data, content) => {
  return new Promise((res) => {
    let margin = {
      left: 40,
      right: 40,
    };
    let consecutivo = parseFloat(data.agencia) + "-" + parseFloat(data.consec);
    var dd = {
      defaultStyle: {
        fontSize: 12,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 150, margin.right, 30],

      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 0, margin.right, 10],
          columns: [
            {
              width: "100%",
              stack: [
                {
                  canvas: [
                    {
                      type: "rect",
                      x: 0,
                      y: 20,
                      w: pageSize.width - margin.left - margin.right,
                      h: 100,
                      r: 5,
                      lineWidth: 1,
                      lineColor: "black",
                    },
                  ],
                },
                {
                  margin: [10, -90, 0, 0],
                  columns: [
                    {
                      width: "70%",
                      stack: [
                        {
                          text: [
                            { text: "Paciente: ", bold: true },
                            data.descrip_paciente,
                          ],
                        },
                        {
                          text: [
                            { text: "Identidad: ", bold: true },
                            parseFloat(data.id_paciente),
                          ],
                        },
                        { text: [{ text: "Edad: ", bold: true }, `${data.anosedad_rep.trim()} años, ${data.mesesedad_rep.trim()} meses, ${data.diasedad_rep.trim()} días`] },
                        {
                          text: [{ text: "Entidad: ", bold: true }, data.descripeps],
                        },
                        {
                          text: [{ text: "Estudio: ", bold: true }, data.desc_servicio],
                        },
                      ],
                    },
                    {
                      stack: [
                        {
                          image: data.logo,
                          width: 120,
                          height: 60,
                          margin: [6, 0, 0, 0],
                        },
                        {
                          text: [
                            { text: "Nro Servicio: ", bold: true },
                            consecutivo,
                          ],
                        },
                        { text: [{ text: "Fecha: ", bold: true }, data.fecha.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
      footer: function (currentPage, pageCount) {
        return {
          layout: "noBorders",
          table: {
            widths: "*",
            heights: 30,
            body: [
              [
                {
                  fontSize: 10,
                  alignment: "center",
                  columns: [
                    `Dirección: ${data.direccion_empr} ${data.ciudad_empr}`,
                    `Teléfono: ${data.telefono_empr}`
                  ],
                },
              ],
            ],
          },
        };
      },
      content: [...content, {
        fontSize: 11,
        bold: true,
        stack: [
          {
            image: data.firma,
            fit: [120, 120],
          },
          data.nombre_per,
          data.nro_per
        ]
      },],
    };

    pdfMake.createPdf(dd).open();
    res();

  });
};

const notas_rx = (data, content) => {
  return new Promise((res) => {
    // content[1].alignment = "justify"
    let margin = {
      left: 20,
      right: 20,
    };

    const lectura = data.datos_lectura

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
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center",
        },
      },
      pageMargins: [margin.left, 130, margin.right, 30],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 10, margin.right, 10],
          table: {
            widths: "*",
            body: [
              [{
                alignment: "center",
                columns: [
                  {
                    image: data.logo,
                    width: 120,
                    height: 60,
                    margin: [6, 0, 0, 0],
                  },
                  { text: data.descrip_empr, margin: [0, 30, 0, 0] },
                  { text: `NIT: ${data.nit_empr}`, margin: [0, 30, 0, 0] },
                ]
              }],
              [
                {
                  columns: [
                    {
                      stack: [
                        { text: `ENTIDAD: ${data.descrip_empr}`, margin: [8, 0, 0, 0] },
                        `ATIENDE: ${data.nombre_per}`,
                        "F. PAGO: Ambulatorio"
                      ]
                    },
                    {
                      stack: [
                        { text: `FACTURA NR: ${parseInt(data.consec)}`, margin: [0, 0, 10, 0], alignment: "right" },
                        "MD. ESP ESPECIALIDAD: Radiología",
                        { columns: ["Autorización: ", { text: "Afiliación: ", alignment: "right" }] }
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        };
      },
      content: [
        {
          stack: [
            {
              table: {
                widths: "*",
                body: [
                  [
                  { text: "CODIGO", bold: true },
                    { text: "DESCRIPCION", bold: true },
                    { text: "CANT.", bold: true },
                    { text: "VALOR UNIT.", bold: true },
                    { text: "VALOR TOTAL", bold: true },
                  ],
                  [" ", "", "", "", ""]
                ]
              }
            },
            { text: "TOTAL, FACTURA", bold: true, margin: [20, 0, 0, 0] }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            `DETALLE: `,
            {
              margin: [0, 10, 0, 0],
              columns: [
                { text: "FIRMA DE USUARIO: ", width: "auto", margin: [0, 0, 5, 0] },
                subrayado(" "),
                { text: "ELABORO: ", width: "auto", margin: [10, 0, 5, 0] },
                subrayado(lectura.elaboro_lect)
              ]
            },
            {
              margin: [0, 10, 0, 0],
              columns: [
                `HORA DE INGRESO: ${data.id_hora
                }`,
                `HORA DE ATENCION: `,
                `FECHA: ${data.fecha}`
              ]
            }
          ]
        },
        {
          margin: [0, 40, 0, 0],
          table: {
            widths: ["30%", "25%", "auto", "auto", "auto", "15%", "15%"],
            body: [
              [
                { text: "NOMBRE DEL PACIENTE", style: "boldcenter" },
                { text: "IDENTIFICACION: DOC", style: "boldcenter" },
                { text: "EMB", style: "boldcenter" },
                { text: "EDAD", style: "boldcenter" },
                { text: "SEXO", style: "boldcenter" },
                { text: "CIUDAD", style: "boldcenter" },
                { text: "ZONA", style: "boldcenter" },
              ],
              [
                data.descrip_paciente.trim(),
                parseInt(data.id_paciente),
                lectura.embarazada_lect === "1" ? "SI" : "NO",
                data.anosedad_rep,
                data.sexo_paciente === "1" ? "F" : "M",
                data.ciudad_empr,
                data.zona_paciente === "0" ? "URBANA" : "RURAL"
              ],
              [
                `REPORTE DE CREATININA: ${lectura.creatinina_lect}`,
                { colSpan: 2, text: `IOPRAMIDA: ${lectura.iopramida_lect} MG` }, "",
                { colSpan: 4, text: `EPS: ${data.descripeps}` },

              ],
              [
                `REPORTE DE BUN: ${lectura.bun_lect}`,
                { colSpan: 2, text: `TELEFONO: ${data.telefono_paciente}` }, "",
                { colSpan: 4, text: `HORA EGRESO: ${data.id_hora}` },

              ],
              [
                { colSpan: 7, text: `ACOMPAÑANTE: ${lectura.acompana_lect}` },
              ]
            ]
          }
        },
        {
          margin: [0, 4, 0, 0],
          table: {
            widths: ["30%", "*", "auto", "auto", "auto", "*", "*"],
            body: [
              [
                { text: "PACIENTE LLEGO", style: "boldcenter" },
                { text: "ESTADO DE SALIDA:", style: "boldcenter" },
                { text: "SIGNOS VITALES AL INGRESO", style: "boldcenter", colSpan: 2 }, "",
                { text: "SIGNOS VITALES AL EGRESO", style: "boldcenter", colSpan: 2 }, "",
                { text: "PESO:", style: "boldcenter" },
              ],
              [
                `CONSCIENTE: ${condicional(lectura.condingr_lect, "1")}`,
                `VIVO: ${condicional(lectura.condegre_lect, "1")}`,
                { alignment: "center", text: `T/A1 ${lectura.diasting_lect.trim()}/${lectura.systing_lect.trim()}` },
                { alignment: "center", text: 'MMGH1' },
                { alignment: "center", text: `T/A: ${lectura.diastegr_lect.trim()}/${lectura.systegr_lect.trim()}` },
                { alignment: "center", text: 'MMGH' },
                { text: `Kg: ${lectura.peso_lect.trim()}`, alignment: "center", rowSpan: 3, margin: [0, 20, 0, 0] }
              ],
              [
                `INCONCIENTE: ${condicional(lectura.condingr_lect, "2")}`,
                `CEXT: ${condicional(lectura.condegre_lect, "2")}`,
                { alignment: "center", text: `FC: ${lectura.fcarding_lect.trim()}` },
                { alignment: "center", text: 'PM' },
                { alignment: "center", text: `FC: ${lectura.fcardegr_lect.trim()}` },
                { alignment: "center", text: 'PM' },
                ""
              ],
              [
                `MUERTO: ${condicional(lectura.condingr_lect, "3")}`,
                `REMITIDO: ${condicional(lectura.condegre_lect, "3")}`,
                { alignment: "center", text: `SpO2: ${lectura.o2sating_lect.trim()}` },
                { alignment: "center", text: '%' },
                { alignment: "center", text: `SpO2: ${lectura.o2sategr_lect.trim()}` },
                { alignment: "center", text: '%' },
                ""
              ]
            ]
          }
        },
        ...content,
        {
          fontSize: 11,
          bold: true,
          stack: [
            {
              image: data.firma,
              fit: [120, 120],
            },
            data.nombre_per,
            data.nro_per
          ]
        },
      ]
    }

    pdfMake.createPdf(dd).open();
    res();

  });
};

const factura_titan = async (data, getBase64, open_pdf) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian
  let qr = await QRCode.toDataURL(url);

  data.numero_fact = data.numero_fact.replace(/\s+/g, '');
  let watermark =
    data.ncredito_fact === "0"
      ? ""
      : {
        text: "Con Nota Crédito",
        angle: 60,
        color: "black",
        opacity: 0.2,
        fontSize: 100,
      };

  return new Promise(res => {
    let margin = {
      left: 20,
      right: 20
    };

    let totales = data.totales[0]
    let productos = [];
    let impuestos = [];
    let retenciones = [];

    let observaciones = "";
    if (data.Observaciones64 == "0") {
      data.Observaciones64 = "";
    }

    if (!data.Observaciones64 || typeof data.Observaciones64 !== "string") {
      console.log("paso-1")
    } else {
      const regexBase64 = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!regexBase64.test(data.Observaciones64)) {
        observaciones = data.Observaciones64.trim()
      } else {
        observaciones = window.atob(data.Observaciones64.trim())
      }

    }

    let descripcion = "";
    let descripcion64 = "";
    if (data.productos.length > 1) {
      data.productos.pop();
    }
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
                { text: `Fecha Factura: ${data.fechadian_factura}`, style: "boldred" }, // 

                // { text: `Fecha Factura: ${data.fechacorta_factura}`, style: "boldred" }, // 

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
                      ]
                    },
                    {
                      width: "*",
                      stack: [
                        { text: data.forma_pago, margin: [0, 2, 0, 0] },
                        { text: data.medio_pago, margin: [0, 2, 0, 0] },
                        { text: data.plazo_pago, margin: [0, 2, 0, 0] },
                        { text: data.vencecorta_factura, margin: [0, 2, 0, 0] },
                        { text: data.contrato.trim(), margin: [0, 2, 0, 0] },

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
            widths: ["3%", "*", "10%", "9%", "*", "7%", "10%", "10%", "10%", "10%"],
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
        { text: `CUFE: : ${data.iddian_fact}`, margin: [0, 20, 0, 0], fontSize: 9, },
        { text: `Fecha Emisión: ${data.fechacorta_factura}`, fontSize: 8, margin: [0, 5, 0, 0] }, //
        { text: `Elaboró: : ${data.elaboro}`, margin: [0, 10, 0, 0], fontSize: 8, }
      ]
    }

    if (open_pdf) {
      pdfMake.createPdf(dd).open();
    } else {
      if (getBase64) {
        const pdfDocGenerator = pdfMake.createPdf(dd);
        pdfDocGenerator.getBlob((blob) => {
          res(blob)
        });
      } else {
        pdfMake.createPdf(dd).download(data.numero_fact.trim());
        res();
      }
    }

  })
};
const factura_titan2 = async (data, getBase64) => {
  let url = " ";
  url = "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + data.iddian
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
      descripcion64 =
        p.base1_pr.trim() +
        p.base2_pr.trim() +
        p.base3_pr.trim() +
        p.base4_pr.trim() +
        p.base5_pr.trim()
        ;
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
const consent_infor = (data) => {
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
      styles: {
        boldcenter: {
          bold: true,
          alignment: "center"
        },
      },
      pageMargins: [margin.left, 110, margin.right, 20],
      header: function (currentPage, pageCount, pageSize) {
        return {
          margin: [margin.left, 20, margin.right, 0],
          columns: [
            {
              width: "30%",
              image: data.logo,
              fit: [150, 250]
            },
            {
              width: "60%",
              fontSize: 10,
              style: "boldcenter",
              stack: [
                "MERAKIDS-MEDICAL CENTER",
                { text: "FORMATO DE CONSENTIMIENTO INFORMADO ", margin: [0, 5, 0, 0] },
                "PROCEDIMIENTO RELACIONADO:",
                "Gestión en Salud: Historia Clínica y Registros"
              ]
            }
          ]
        }
      },

      content: [
        {
          fontSize: 11,
          alignment: "center",
          stack: [
            { text: "CONSENTIMIENTO INFORMADO", bold: true },
            "(En cumplimiento de la Ley 23 de 1981)"
          ]
        },
        {
          fontSize: 11,
          text: "Dentro de las normas éticas exigidas al profesional en Colombia por la ley 23 de 1981 se encuentra el deber de informar adecuada y oportunamente a todos sus pacientes los riesgos que puedan derivarse del tratamiento que le será practicado, solicitando su consentimiento anticipadamente (artículo 15 y 16). Por tanto, con el presente documento escrito se pretende informar a usted y a su familia acerca del proceso y/o procedimiento que se le practicará, por lo cual solicitamos llene de su puño y letra los espacios en blanco.",
          margin: [0, 10, 0, 0]
        },
        {
          fontSize: 11,
          margin: [0, 3, 0, 0],
          stack: [
            {

              columns: [
                { text: "Yo, ", width: "auto", margin: [0, 0, 3, 0] },
                { ...subrayado(" "), width: "80%" },
                { text: "con C.C. o T.I. ", width: "*" }
              ]
            },
            {
              margin: [0, 3, 0, 3],
              columns: [
                { ...subrayado(" "), width: "30%" },
                { text: ", solicito al doctor(a) ", margin: [3, 0, 0, 0] }
              ]
            },
            subrayado(" "),
            { text: "Y a sus asociados/asistentes que realicen en mi persona, el proceso y/o procedimiento ", margin: [0, 5, 0, 0] },
            {
              margin: [0, 3, 0, 3],
              columns: [
                { text: "elegido: ", width: "auto", margin: [0, 0, 3, 0] },
                { ...subrayado(" "), width: "60%" },
                { text: "el cual consiste en:", width: "*" }
              ]
            },
            subrayado(" "),
            subrayado(" "),
            subrayado(" "),
            subrayado(" "),
          ]
        },
        {
          margin: [0, 30, 0, 0],
          fontSize: 11,
          stack: [
            "Manifiesto que estoy satisfecha con la información recibida del profesional de salud, quien me ha dado la oportunidad de preguntar y resolver las dudas y todas ellas han sido resueltas a satisfacción. Manifiesto que he entendido sobre las condiciones y objetivos de la atención que se me va a practicar, los cuidados que debo tener, además comprendo y acepto el alcance y los riesgos justificados de posible previsión que conlleva el procedimiento que aquí autorizo. Yo entiendo este acto médico y acepto los riesgos arriba explicados y entiendo que si no acepto las intervenciones sugeridas por mi médico tratante y/o no cumplo las citas de control y/o decido no realizar los exámenes diagnósticos y/o los tratamientos ordenados, pueden presentarse reacciones adversas, ajenas al actuar de mi médico, sin que ello signifique pérdida de mis derechos a la atención profesional posterior.",
            { text: "Comprendo y acepto que durante el procedimiento pueden aparecer circunstancias imprevisibles o inesperadas, que puedan requerir una extensión del procedimiento original o la realización de otro procedimiento no mencionado arriba.", margin: [0, 20, 0, 0] }
          ]
        },

        {

          fontSize: 11,
          margin: [0, 30, 0, 0],
          stack: [
            {

              columns: [
                { text: "Solicito al profesional de salud", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" "),
              ]
            },
            "y a sus asociados/asistentes que realicen los procesos y/o procedimientos adicionales que juzguen necesarios.",
            { text: "Al firmar este formulario reconozco que lo he leído o que me ha sido leído y explicado y que comprendo perfectamente su contenido.", margin: [0, 20, 0, 0] }
          ]
        },
        {
          pageBreak: 'before',
          fontSize: 11,
          stack: [
            "Se me han dado amplias oportunidades de formular preguntas y que todas las preguntas que he formulado han sido respondidas o explicadas en forma satisfactoria. Todos los espacios en blanco o frases por completar han sido llenados y todos los puntos en los que no estoy de acuerdo han sido marcados antes de firmar este consentimiento.",
            { text: "Acepto que la medicina no es una ciencia exacta y que no se me han garantizado los resultados que se esperan de la intervención quirúrgica o procedimientos diagnósticos o terapéuticos, en el sentido de que la práctica de la intervención o procedimiento que requiero compromete una actividad de medio, pero no de resultados.", margin: [0, 20, 0, 0] }
          ]
        },
        {
          fontSize: 11,
          margin: [0, 20, 0, 0],
          stack: [
            "Comprendiendo estas limitaciones, solicito al profesional de salud",
            subrayado(" "),
            { margin: [0, 15, 0, 0], text: "y a sus asociados/asistentes que realicen el proceso y/o procedimiento." },
            subrayado(" "),
            { margin: [0, 15, 0, 0], text: "Nombre y Firma del paciente" },

            {
              margin: [0, 3, 0, 0],
              columns: [
                { text: "C.C. ", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" "),
                { text: "expedida en ", width: "auto", margin: [3, 0, 0, 0] },
                subrayado(" "),
                { text: "o Huella ", width: "auto", margin: [3, 0, 0, 0] },
                subrayado(" "),
              ]
            },

            {
              margin: [0, 15, 0, 0],
              columns: [
                { text: "Firma en calidad de  testigo", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" "),

              ]
            },
            {
              margin: [0, 5, 0, 0],
              columns: [
                { text: "C.C. ", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" "),
                { text: "expedida en ", width: "auto", margin: [3, 0, 0, 0] },
                subrayado(" "),

              ]
            },
            { margin: [0, 15, 0, 0], text: "Nombre y Firma del Profesional de Salud" },
            {
              margin: [0, 5, 0, 0],
              columns: [
                { text: "C.C. ", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" "),
                { text: "expedida en ", width: "auto", margin: [3, 0, 0, 0] },
                subrayado(" "),

              ]
            },
            {
              margin: [0, 15, 0, 0],
              columns: [
                { text: "Ciudad y fecha", width: "auto", margin: [0, 0, 3, 0] },
                subrayado(" "),

              ]
            },
          ]
        },
        {
          margin: [0, 30, 0, 0],
          fontSize: 11,
          table: {
            widths: "*",
            body: [
              [
                { colSpan: 4, text: "CONTROL DE CAMBIOS", fillColor: "#9FF9FF", style: "boldcenter" }, "", "", ""
              ],
              [
                { text: "VERSION", alignment: "center" },
                { text: "FECHA", alignment: "center" },
                { text: "MOTIVO DE CAMBIO", alignment: "center" },
                { text: "RESPONSABLE", alignment: "center" }
              ]
            ]
          }
        },
        {
          image: data.firma
        }
      ]
    }

    pdfMake.createPdf(dd).open();
    res();
  })
}

const historiaClinica = (data, blob, abrir) => {
  return new Promise(res => {
    let nombre2 = data.nombre2_rep ? data.nombre2_rep.trim() : "";
    let apellido2 = data.apellido1_rep ? data.apellido2_rep.trim() : "";
    let paciente = data.nombre1_rep.trim() + " " + nombre2 + " " + data.apellido1_rep.trim() + " " + apellido2
    let empresa = data.empresa;
    data.empresa.telefono_empr = data.empresa.telefono_empr.replace(/,/g, "");

    let margin = {
      left: 30,
      right: 40
    };
    const color = "#002378";

    let tablaSecciones = (secciones) => {
      secciones.pop()
      let newList = []
      secciones.forEach(item => {
        if (item.seccion_rep === "001" || item.seccion_rep === "002"
          || item.seccion_rep === "003" || item.seccion_rep === "005"
          || item.seccion_rep === "006" || item.seccion_rep === "007"
          || item.seccion_rep === "009" || item.seccion_rep === "010"
          || item.seccion_rep === "012") {
          item.base1_rep = item.base1_rep.trim()
            + item.base2_rep.trim()
            + item.base3_rep.trim()
            + item.base4_rep.trim()
            + item.base5_rep.trim()
            + item.base6_rep.trim()
            + item.base7_rep.trim()
            + item.base8_rep.trim()
            + item.base9_rep.trim()
            + item.base10_rep.trim()
            + item.base11_rep.trim()
            + item.base12_rep.trim()
            + item.base13_rep.trim()
            + item.base14_rep.trim()
            + item.base15_rep.trim()
            + item.base16_rep.trim()
            + item.base17_rep.trim()
            + item.base18_rep.trim()
            + item.base19_rep.trim()
            + item.base20_rep.trim()
            + item.base21_rep.trim()
            + item.base22_rep.trim()
            + item.base23_rep.trim()
            + item.base24_rep.trim()
            + item.base25_rep.trim()
            + item.base26_rep.trim()
            + item.base27_rep.trim()
            + item.base28_rep.trim()
            + item.base29_rep.trim()
            + item.base30_rep.trim()
            + item.base31_rep.trim()
            + item.base32_rep.trim()
            + item.base33_rep.trim()
            + item.base34_rep.trim()
            + item.base35_rep.trim()
            + item.base36_rep.trim()
            + item.base37_rep.trim()
            + item.base38_rep.trim()
            + item.base39_rep.trim()

          item.base2_rep = ""
          item.base3_rep = ""
          item.base4_rep = ""
          item.base5_rep = ""
          item.base6_rep = ""
          item.base7_rep = ""
          item.base8_rep = ""
          item.base9_rep = ""
          item.base10_rep = ""
          item.base11_rep = ""
          item.base12_rep = ""
          item.base13_rep = ""
          item.base14_rep = ""
          item.base15_rep = ""
          item.base16_rep = ""
          item.base17_rep = ""
          item.base18_rep = ""
          item.base19_rep = ""
          item.base20_rep = ""
          item.base21_rep = ""
          item.base22_rep = ""
          item.base23_rep = ""
          item.base24_rep = ""
          item.base25_rep = ""
          item.base26_rep = ""
          item.base27_rep = ""
          item.base28_rep = ""
          item.base29_rep = ""
          item.base30_rep = ""
          item.base31_rep = ""
          item.base32_rep = ""
          item.base33_rep = ""
          item.base34_rep = ""
          item.base35_rep = ""
          item.base36_rep = ""
          item.base37_rep = ""
          item.base38_rep = ""
          item.base39_rep = ""
        }

        //******SIGNOS VITALES*********
        if (item.seccion_rep === "004") {
          item.base1_rep = window.btoa(item.base1_rep.trim()
            + item.base2_rep.trim()
            + item.base3_rep.trim()
            + item.base4_rep.trim()
            + item.base5_rep.trim()
            + item.base6_rep.trim()
            + item.base7_rep.trim()
            + item.base8_rep.trim()
            + item.base9_rep.trim()
            + item.base10_rep.trim()
            + item.base11_rep.trim()
            + item.base12_rep.trim()
            + item.base13_rep.trim()
            + item.base14_rep.trim()
            + item.base15_rep.trim()
            + item.base16_rep.trim()
            + item.base17_rep.trim()
            + item.base18_rep.trim()
            + item.base19_rep.trim()
            + item.base20_rep.trim()
            + item.base21_rep.trim()
            + item.base22_rep.trim()
            + item.base23_rep.trim()
            + item.base24_rep.trim()
            + item.base25_rep.trim()
            + item.base26_rep.trim()
            + item.base27_rep.trim()
            + item.base28_rep.trim()
            + item.base29_rep.trim()
            + item.base30_rep.trim()
            + item.base31_rep.trim()
            + item.base32_rep.trim()
            + item.base33_rep.trim()
            + item.base34_rep.trim()
            + item.base35_rep.trim()
            + item.base36_rep.trim()
            + item.base37_rep.trim()
            + item.base38_rep.trim()
            + item.base39_rep.trim()
          )
          item.base2_rep = ""
          item.base3_rep = ""
          item.base4_rep = ""
          item.base5_rep = ""
          item.base6_rep = ""
          item.base7_rep = ""
          item.base8_rep = ""
          item.base9_rep = ""
          item.base10_rep = ""
          item.base11_rep = ""
          item.base12_rep = ""
          item.base13_rep = ""
          item.base14_rep = ""
          item.base15_rep = ""
          item.base16_rep = ""
          item.base17_rep = ""
          item.base18_rep = ""
          item.base19_rep = ""
          item.base20_rep = ""
          item.base21_rep = ""
          item.base22_rep = ""
          item.base23_rep = ""
          item.base24_rep = ""
          item.base25_rep = ""
          item.base26_rep = ""
          item.base27_rep = ""
          item.base28_rep = ""
          item.base29_rep = ""
          item.base30_rep = ""
          item.base31_rep = ""
          item.base32_rep = ""
          item.base33_rep = ""
          item.base34_rep = ""
          item.base35_rep = ""
          item.base36_rep = ""
          item.base37_rep = ""
          item.base38_rep = ""
          item.base39_rep = ""
        }

        //******GONIOMETRIA******** */
        if (item.seccion_rep === "006_01") {
          console.log("");
        }

        //******DIAGNOSTICO*********
        if (item.seccion_rep === "008") {
          // item.base1_rep = window.btoa(item.base1_rep.trim()
          item.base1_rep = window.btoa(unescape(encodeURIComponent(item.base1_rep))

            + item.base2_rep.trim()
            + item.base3_rep.trim()
            + item.base4_rep.trim()
            + item.base5_rep.trim()
            + item.base6_rep.trim()
            + item.base7_rep.trim()
            + item.base8_rep.trim()
            + item.base9_rep.trim()
            + item.base10_rep.trim()
            + item.base11_rep.trim()
            + item.base12_rep.trim()
            + item.base13_rep.trim()
            + item.base14_rep.trim()
            + item.base15_rep.trim()
            + item.base16_rep.trim()
            + item.base17_rep.trim()
            + item.base18_rep.trim()
            + item.base19_rep.trim()
            + item.base20_rep.trim()
            + item.base21_rep.trim()
            + item.base22_rep.trim()
            + item.base23_rep.trim()
            + item.base24_rep.trim()
            + item.base25_rep.trim()
            + item.base26_rep.trim()
            + item.base27_rep.trim()
            + item.base28_rep.trim()
            + item.base29_rep.trim()
            + item.base30_rep.trim()
            + item.base31_rep.trim()
            + item.base32_rep.trim()
            + item.base33_rep.trim()
            + item.base34_rep.trim()
            + item.base35_rep.trim()
            + item.base36_rep.trim()
            + item.base37_rep.trim()
            + item.base38_rep.trim()
            + item.base39_rep.trim())

          item.base2_rep = ""
          item.base3_rep = ""
          item.base4_rep = ""
          item.base5_rep = ""
          item.base6_rep = ""
          item.base7_rep = ""
          item.base8_rep = ""
          item.base9_rep = ""
          item.base10_rep = ""
          item.base11_rep = ""
          item.base12_rep = ""
          item.base13_rep = ""
          item.base14_rep = ""
          item.base15_rep = ""
          item.base16_rep = ""
          item.base17_rep = ""
          item.base18_rep = ""
          item.base19_rep = ""
          item.base20_rep = ""
          item.base21_rep = ""
          item.base22_rep = ""
          item.base23_rep = ""
          item.base24_rep = ""
          item.base25_rep = ""
          item.base26_rep = ""
          item.base27_rep = ""
          item.base28_rep = ""
          item.base29_rep = ""
          item.base30_rep = ""
          item.base31_rep = ""
          item.base32_rep = ""
          item.base33_rep = ""
          item.base34_rep = ""
          item.base35_rep = ""
          item.base36_rep = ""
          item.base37_rep = ""
          item.base38_rep = ""
          item.base39_rep = ""
        }
        //******MEDICAMENTOS/EXAMENES/ORDENES/INCAPACIDADES*********

        if (item.seccion_rep === "111" || item.seccion_rep === "112" || item.seccion_rep === "113" || item.seccion_rep === "114" || item.seccion_rep === "115") {
          if (item.base3_rep.trim() == "N/A") {
            item.base2_rep = ""
          }
          if (item.seccion_rep === "114") {
            const decodeBase64 = (base64) => {
              try {
                let binario = atob(base64.trim()); // Decodifica Base64 a binario
                let bytes = new Uint8Array([...binario].map(c => c.charCodeAt(0))); // Convierte a Uint8Array
                let decoder = new TextDecoder("utf-8");
                return decoder.decode(bytes); // Decodifica a texto UTF-8
              } catch (error) {
                console.error("Error al decodificar Base64:", error);
                return null;
              }
            };

            const base64String = item.base2_rep;
            item.base2_rep = decodeBase64(base64String); 

            item.base1_rep = item.base1_rep + item.base2_rep;
          }

          // item.base1_rep = window.btoa(item.base1_rep.trim())
          item.base1_rep = window.btoa(unescape(encodeURIComponent(item.base1_rep)))

          if (item.base3_rep.trim() == "N/A") {
            item.indicacion_rep = item.base4_rep.trim()
          } else {

            item.indicacion_rep = item.base2_rep.trim()
              + item.base3_rep.trim()
              + item.base4_rep.trim()
              + item.base5_rep.trim()
              + item.base6_rep.trim()
              + item.base7_rep.trim()
              + item.base8_rep.trim()
              + item.base9_rep.trim()
              + item.base10_rep.trim()
              + item.base11_rep.trim()
              + item.base12_rep.trim()
              + item.base13_rep.trim()
              + item.base14_rep.trim()
              + item.base15_rep.trim()
              + item.base16_rep.trim()
              + item.base17_rep.trim()
              + item.base18_rep.trim()
              + item.base19_rep.trim()
              + item.base20_rep.trim()
              + item.base21_rep.trim()
              + item.base22_rep.trim()
              + item.base23_rep.trim()
              + item.base24_rep.trim()
              + item.base25_rep.trim()
              + item.base26_rep.trim()
              + item.base27_rep.trim()
              + item.base28_rep.trim()
              + item.base29_rep.trim()
              + item.base30_rep.trim()
              + item.base31_rep.trim()
              + item.base32_rep.trim()
              + item.base33_rep.trim()
              + item.base34_rep.trim()
              + item.base35_rep.trim()
              + item.base36_rep.trim()
              + item.base37_rep.trim()
              + item.base38_rep.trim()
              + item.base39_rep.trim()
            item.indicacion_rep = Buffer.from(item.indicacion_rep, 'base64').toString('utf-8')
          }
        }
        // let exist = newList.find(el => el.nombreseccion_rep.trim() === item.nombreseccion_rep.trim());

        let exist = newList.find(el => {
          if (el.nombreseccion_rep?.trim() && item.nombreseccion_rep?.trim()) {
            return el.nombreseccion_rep.trim() === item.nombreseccion_rep.trim();
          }
          return false;
        });

        let seccion = item.seccion_rep?.trim(); // Aseguramos que no tenga espacios

        let elemento = {
          codigo: seccion == "111" ? item.codmedicam_rep.trim() :
            seccion == "112" ? item.codexamen_rep.trim() :
              seccion == "113" ? item.codordm_rep.trim() :
                seccion == "115" ? item.codmat_rep.trim() : "",
          titulo: item.nombresubseccn_rep.trim(),
          presentacion: seccion != "006_01" ? item.presentacmedic_rep.trim() : "",
          tiempo: seccion != "006_01" ? `${item.duracionmedic_rep.trim()} ${item.tiempomedic_rep.trim()}` : "",
          indicacion: seccion != "006_01" ? item.indicacion_rep.trim() : " no tiene",
          cantidad: seccion == "111" ? item.cantmedic_rep.trim() :
            seccion == "112" ? item.cantexam_rep.trim() :
              seccion == "113" ? item.cantordm_rep.trim() :
                seccion == "115" ? item.cantmat_rep.trim() : "",
          text: seccion != "006_01" ? `${item.base1_rep.trim()}` : "",
          tabla_subseccion: seccion == "006_01" ? item.tabla_subseccion : null
        };


        // let seccion = item.seccion_rep;
        // let elemento = {
        //   codigo: seccion == "111" ? item.codmedicam_rep.trim() : seccion == "112" ? item.codexamen_rep.trim() : seccion == "113" ? item.codordm_rep.trim() : seccion == "115" ? item.codmat_rep.trim() : "",
        //   titulo: item.nombresubseccn_rep.trim(),
        //   presentacion: seccion != "006_01" ? item.presentacmedic_rep.trim() : "",
        //   tiempo: seccion != "006_01" ? `${item.duracionmedic_rep.trim()} ${item.tiempomedic_rep.trim()}` : "",
        //   indicacion: seccion != "006_01" ? item.indicacion_rep.trim() : " no tiene",
        //   cantidad: seccion == "111" ? item.cantmedic_rep.trim() : seccion == "112" ? item.cantexam_rep.trim() : seccion == "113" ? item.cantordm_rep.trim() : seccion == "115" ? item.cantmat_rep.trim() : "",
        //   text: seccion != "006_01" ? `${item.base1_rep.trim()}` : "",
        //   tabla_subseccion: seccion == "006_01" ? item.tabla_subseccion : null
        // }

        if (!exist) {
          item = {
            nombreseccion_rep: item.nombreseccion_rep,
            seccion_rep: item.seccion_rep,
            contenido: [elemento]
          }

          newList.push(item)
        } else {
          exist.contenido.push(elemento)
        }

      })
      // const decodificar = (el) => {
      //   try {
      //     let textob64 = el.text.trim();
      //     console.log(textob64);

      //     // Validar que solo contenga caracteres Base64 válidos
      //     if (!/^[A-Za-z0-9+/=]+$/.test(textob64)) {
      //       throw new Error("La cadena contiene caracteres no válidos para Base64.");
      //     }

      //     while (textob64.length % 4 !== 0) {
      //       textob64 += "=";
      //     }

      //     let binaryData = atob(textob64);
      //     let byteArray = new Uint8Array(binaryData.length);

      //     for (let i = 0; i < binaryData.length; i++) {
      //       byteArray[i] = binaryData.charCodeAt(i);
      //     }

      //     let decoder = new TextDecoder("utf-8");
      //     return decoder.decode(byteArray);
      //   } catch (error) {
      //     console.error("Error al decodificar historia:", error.message)
      //     return null;
      //   }
      // };

      const decodificar = (el) => {
        try {
          let textob64 = el.text.trim();
          let binaryData = atob(textob64);

          let byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }

          let decoder = new TextDecoder("utf-8");
          return decoder.decode(byteArray);

        }
        catch (error) {
          console.error("Error al decodificar historia:", error.message)
          return null;
        }
      };

      function renderTablaGoniometria(tablaItem) {
        return [
          {
            text: tablaItem.subtitulo?.trim() || "",
            bold: true,
            margin: [20, 5, 0, 3]
          },
          ...(tablaItem.sub_tabla || []).map(subTabla => {
            const body = [
              [subTabla.descr_subtabla.trim(), "Izquierdo", "Derecho", { text: "VN", alignment: "center" }]
            ];

            const buildRows = (valores) => {
              if (!Array.isArray(valores)) return [];
              return valores
                .filter(v => Object.keys(v).length)
                .map(v => [
                  v.descrval_subtabla?.trim() || "",
                  { text: v.vlr_izq ?? "", alignment: "center" },
                  { text: v.vlr_der ?? "", alignment: "center" },
                  {
                    text: (v.vlr_vn || "").replace("G", " Grados").replace("P", "%").trim(),
                    alignment: "center"
                  }
                ]);
            };

            body.push(...buildRows(subTabla.valores_subtabla));

            return {
              margin: [40, 0, 0, 10],
              layout: 'noBorders',
              table: {
                widths: ["40%", "15%", "15%", "30%"],
                body
              }
            };
          })
        ];
      }

      return newList.map((item, index) => {
        return {
          margin: [0, 10, 0, 0],
          stack: [
            {
              text: `${item.nombreseccion_rep?.trim() || ""}`,
              bold: true,
              fontSize: 10
            },
            (item.seccion_rep == "112" || item.seccion_rep == "113" || item.seccion_rep == "115") ?
              {
                fontSize: 9,
                table: {
                  headerRows: 1,
                  widths: ["9%", "30%", "8%", "35%"],
                  body: [
                    [{ text: 'Código', style: "boldcenter" }, { text: 'Descripcion', style: "boldcenter" }, { text: 'Cantidad', style: "boldcenter" }, { text: 'Posologia', style: "boldcenter" },],
                    ...item.contenido.map(el => {
                      let textodecode = decodificar(el)

                      return [

                        el.codigo,
                        { text: textodecode, alignment: "right" }, // x
                        {
                          text: el.cantidad.trim(),
                          alignment: "center"
                        },
                        {
                          text: el.indicacion.trim(),
                          alignment: "right"
                        },
                      ]
                    })
                  ]
                }
              } : (item.seccion_rep == "111") ? {
                fontSize: 9,
                table: {
                  headerRows: 1,
                  widths: ["9%", "27%", "11%", "9%", "12%", "23%"],
                  body: [
                    [{ text: 'Código', style: "boldcenter" }, { text: 'Descripcion', style: "boldcenter" }, { text: 'Presentacion', style: "boldcenter" }, { text: 'Cantidad', style: "boldcenter" }, { text: 'Tiempo Tratamiento', style: "boldcenter" }, { text: 'Posologia', style: "boldcenter" },],
                    ...item.contenido.map(el => {
                      let textodecode = decodificar(el)

                      return [

                        el.codigo,
                        { text: textodecode, alignment: "right" }, // x
                        el.presentacion,
                        {
                          text: el.cantidad.trim(),
                          alignment: "center"
                        },

                        // el.cantidad,
                        el.tiempo,
                        // item.seccion_rep == "111" ? {
                        //   text: el.tiempo.trim(),
                        //   alignment: "right"
                        // } : {},
                        {
                          text: el.indicacion.trim(),
                          alignment: "right"
                        },
                      ]
                    })
                  ]
                }
              } : {
                stack: item.contenido.map(el => {
                  let textodecode = decodificar(el)
                  return {
                    stack: [
                      {
                        text: `${el.titulo}`,
                        bold: true,
                        fontSize: 10,
                        alignment: item.seccion_rep == "006_01" ? "center" : "left"
                      },

                      {
                        margin: [0, 0, item.seccion_rep == "009" || item.seccion_rep == "007" || item.seccion_rep == "010" || item.seccion_rep == "012" ? 110 : 0, 0],
                        alignment: "justify",
                        text: `${textodecode}`,
                        fontSize: 10
                      },

                      item.seccion_rep == "111" ? {
                        text: `${el.tiempo.trim()}\n`,
                        bold: false,
                        fontSize: 10
                      } : {},
                      item.seccion_rep == "111" || item.seccion_rep == "112" || item.seccion_rep == "113" || item.seccion_rep == "115" ? {
                        text: `${el.indicacion.trim()}\n\n`,
                        bold: false,
                        fontSize: 10
                      } : {},
                      // PARA CUANDO ES GONIOMETRIA

                      item.seccion_rep == "006_01" ? {
                        fontSize: 10,
                        stack: [
                          ...(Array.isArray(el.tabla_subseccion)
                            ? (
                              el.tabla_subseccion[0]?.tabla
                                ? el.tabla_subseccion.flatMap(subseccion => [
                                  {
                                    text: subseccion.descr_subseccion?.trim() || "",
                                    bold: true,
                                    margin: [0, 10, 0, 5]
                                  },
                                  ...(subseccion.tabla || []).flatMap(tablaItem => renderTablaGoniometria(tablaItem))
                                ])
                                : el.tabla_subseccion.flatMap(tablaItem => renderTablaGoniometria(tablaItem))
                            )
                            : []
                          )
                        ]
                      } : {}



                      // item.seccion_rep == "006_01" ? {
                      //   fontSize: 10,
                      //   stack: [
                      //     // Recorre las subsecciones de mano y pie
                      //     ...el.tabla_subseccion.map(subseccion => {
                      //       return [
                      //         subseccion.descr_subseccion?.trim() || "",
                      //         {
                      //           margin: [70, 0, 0, 0],
                      //           stack: [
                      //             // Recorre subsecciones de muñeca y los dedos
                      //             ...subseccion.tabla.map(e => {
                      //               return [
                      //                 e.subtitulo?.trim() || "",
                      //                 {
                      //                   margin: [20, 0, 0, 0],
                      //                   // Recorre subsecciones del tipo
                      //                   stack: e.sub_tabla.map(ele => {
                      //                     return {
                      //                       stack: [
                      //                         ele.descr_subtabla?.trim() || "",
                      //                         {
                      //                           margin: [20, 0, 0, 0],
                      //                           layout: 'noBorders',
                      //                           table: {
                      //                             widths: ["23%", "12%", "10%", "16%"],
                      //                             body: [
                      //                               ["", "Izquierdo", "Derecho", { text: "VN", alignment: "center" }],
                      //                               // Recorre subsecciones de la tabla segun el tipo
                      //                               ...ele.valores_subtabla.filter(ele2 => !(Object.keys(ele2).length === 0)).map(ele2 => {
                      //                                 function formatVlrVn(value) {
                      //                                   if (!value) return "0";
                      //                                   if (value.endsWith("G")) return value.replace("G", " Grados");
                      //                                   if (value.endsWith("P")) return value.replace("P", "%");
                      //                                   return value;
                      //                                 }
                      //                                 if (!ele2.valores_subtabla) return [
                      //                                   ele2.descrval_subtabla || "",
                      //                                   { text: ele2.vlr_izq, alignment: "center" },
                      //                                   { text: ele2.vlr_der, alignment: "center" },
                      //                                   {
                      //                                     text: ele2.vlr_vn
                      //                                       ? formatVlrVn(ele2.vlr_vn) : "0", alignment: "center"
                      //                                   },
                      //                                 ]
                      //                                 else {
                      //                                   return [
                      //                                     {
                      //                                       stack: [
                      //                                         ele2.descr_subtabla,
                      //                                         {
                      //                                           layout: 'noBorders',
                      //                                           table: {
                      //                                             widths: ["25%", "25%", "25%", "25%"],
                      //                                             body: [
                      //                                               ["", "Izquierdo", "Derecho", { text: "VN", alignment: "center" }],
                      //                                               ...ele2.valores_subtabla.filter(ele3 => !(Object.keys(ele3).length === 0)).map(ele3 => [
                      //                                                 ele3.descrval_subtabla,
                      //                                                 { text: ele3.vlr_izq, alignment: "center" },
                      //                                                 { text: ele3.vlr_der, alignment: "center" },
                      //                                                 { text: formatVlrVn(ele3.vlr_vn) || "", alignment: "center" },
                      //                                               ])
                      //                                             ]
                      //                                           }
                      //                                         }
                      //                                       ],
                      //                                       colSpan: 4
                      //                                     },
                      //                                     "", "", ""
                      //                                   ]
                      //                                 }

                      //                               })

                      //                             ]
                      //                           }
                      //                         }

                      //                       ]
                      //                     }
                      //                   })
                      //                 }
                      //               ]
                      //             }),
                      //           ]
                      //         }
                      //       ]
                      //     })

                      //   ]
                      // } : {}


                    ]
                  }
                })
              },
          ]
        }
      })
    }
    var dd = {
      // pageSize: 'LETTER',
      // pageMargins: [margin.left, 190, margin.right, 85],

      pageSize: parseFloat(empresa.id_empr) == 9014670990 ? {
        width: 612,
        height: 396,
        pageOrientation: 'portrait'
      } : 'LETTER',
      pageMargins: [margin.left, 190, margin.right, 85],

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
            margin: [margin.left, 15, margin.right, 5],
            columns: [
              ////NO SE PUEDE CAMBIAR EL TAMAÑO DEL LOGO PORQUE OCULTA EL ENCABEZADO
              {
                width: "auto",
                margin: [0, 0, 8, 0],
                image: data.logo,
                fit: [90, 90],
              },
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "HISTORIA CLINICA", fontSize: 14, margin: [0, 0, 0, 3] },
                  { text: `${data.especialidad_rep.trim()}`, fontSize: 12 },
                  { text: `\n Nro: ${parseFloat(data.consecutivo_rep.trim())}`, fontSize: 8 },
                  { text: `Fecha: ${data.fechahc_rep} Hora: ${data.horahc_rep}` },
                ]
              },
              {
                style: "header",
                stack: [
                  { text: `${empresa.descrip_empr}`, fontSize: 10, alignment: "right" },
                  { text: `NIT. ${parseFloat(empresa.id_empr)}`, fontSize: 8, alignment: "right" },
                  { text: `Dir. ${empresa.direccion_empr}`, fontSize: 8, alignment: "right" },
                  { text: `Tel. ${empresa.telefono_empr}`, fontSize: 8, alignment: "right" },
                  { text: `${empresa.Ciudad} - ${empresa.Departamento}`, fontSize: 8, alignment: "right" },
                ]
              },

            ]
          },
          {
            margin: [margin.left, 5, margin.right, 0],
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 560,
                    h: 70,
                    r: 5,
                    lineColor: 'black',
                  },
                ]
              },
              {
                margin: [10, -68, 0, 5],
                fontSize: 9,
                columns: [
                  {
                    text: [
                      { text: "Paciente: ", bold: true },
                      `${paciente}`
                    ]
                  },
                  {
                    text: [
                      { text: "Identificacion: ", bold: true },
                      `${parseFloat(data.idpaciente_rep)}`
                    ]
                  },
                  {
                    text: [
                      { text: "F.Nacimiento: ", bold: true },
                      `${data.fnacimiento_rep}`
                    ]
                  },

                  {
                    text: [
                      { text: "Edad: ", bold: true },
                      `${data.edad_rep}`
                    ]
                  }

                ]
              },
              {
                margin: [10, 0, 0, 5],
                fontSize: 9,
                columns: [
                  {
                    text: [
                      { text: "Dirección: ", bold: true },
                      `${data.direccion_rep}`
                    ]
                  },
                  {
                    text: [
                      { text: "Teléfono: ", bold: true },
                      `${parseFloat(data.telefono_rep)}`
                    ]
                  },
                  {
                    text: [
                      { text: "Género: ", bold: true },
                      `${data.genero_rep}`
                    ]
                  }

                ]
              },
              {
                margin: [10, 0, 0, 5],
                fontSize: 9,
                columns: [
                  {
                    text: [
                      { text: "Entidad: ", bold: true },
                      `${data.eps_rep}`
                    ]
                  },
                  {
                    text: [
                      { text: "Acompañante: ", bold: true },
                      `${data.acompanante_rep}`
                    ]
                  },
                  {
                    text: [
                      { text: "Teléfono:", bold: true },
                      `${data.telacompanante_rep}`

                    ]
                  },

                ]
              },
            ]
          },
          {
            margin: [margin.left, 20, margin.right, 5],
            columns: [
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: `${data.tipohc_rep.trim()}  ${data.especialidad_rep.trim()}`, fontSize: 12 },

                ]
              },
            ]
          },
        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 10, margin.right, 0],
          fontSize: 7,
          columns: [
            { text: `Impreso: ${data.fechaimp_rep}` },
            { text: "Página " + currentPage.toString() + ' de ' + pageCount, alignment: "center" },
            { text: "www.titansoluciones.com", alignment: "right" },
          ]
        }
      },
      content: [
        // {
        //   canvas: [
        //     {
        //       type: 'rect',
        //       x: 0,
        //       y: 0,
        //       w: 560,
        //       h: 520,
        //       r: 5,
        //       lineColor: 'black',
        //     },
        //   ]
        // },

        ...tablaSecciones(data.secciones_rep),
        {
          columns: [
            {
              // pageBreak: 'before',
              margin: [0, 20, 0, 0],
              stack: [
                {
                  margin: [0, 0, 8, 0],
                  image: data.firma,
                  fit: [100, 100],
                },
                '________________________________________________',
                { text: `${data.descprofesional.trim()}`, bold: true },
                { text: `Médico : ${data.especialidad_rep.trim()}`, fontSize: 9 },
                { text: `RM: ${data.regmedico_rep.trim()}`, fontSize: 9 },
              ]
            },
            data.firma2 && {
              // pageBreak: 'before',
              margin: [0, 20, 0, 0],
              stack: [
                {
                  margin: [0, 0, 8, 0],
                  image: data.firma2,
                  fit: [100, 100],
                },
                '________________________________________________',
                { text: `${data.descprofesional2.trim()}`, bold: true },
                { text: `Médico : ${data.especialidad2_rep.trim()}`, fontSize: 9 },
                { text: `RM: ${data.regmedico2_rep.trim()}`, fontSize: 9 },
              ]
            }
          ]
        }
      ],
    }

    // Generar PDF
    if (abrir) {
      if (blob) {
        pdfMake.createPdf(dd).getBlob((blob) => {
          res(blob);
        });
      } else {
        pdfMake.createPdf(dd).open();
        res();
      }
    } else {
      pdfMake.createPdf(dd).getBlob((pdfBlob) => {
        if (pdfBlob) {
          res(pdfBlob);
        } else {
          console.error("Error al generar el PDF.");
          res(null);
        }
      });
    }
    // if (blob) {
    //   pdfMake.createPdf(dd).getBlob((blob) => {
    //     res(blob);
    //   });
    // } else {
    //   pdfMake.createPdf(dd).open();
    //   res();
    // }
  })
};

const OrdenMedica = (data, blob) => {

  return new Promise(res => {
    let nombre2 = data.nombre2_rep ? data.nombre2_rep.trim() : "";
    let apellido2 = data.apellido1_rep ? data.apellido2_rep.trim() : "";
    let paciente = data.nombre1_rep.trim() + " " + nombre2 + " " + data.apellido1_rep.trim() + " " + apellido2
    let empresa = data.empresa;

    let margin = {
      left: 30,
      right: 20
    };
    const color = "#002378";
    function decodeBase64Utf8(base64) {
      try {
        // Decodifica base64 a binario
        const binary = atob(base64);
        // Convierte binario a Uint8Array
        const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
        // Decodifica a UTF-8
        return new TextDecoder("utf-8").decode(bytes);
      } catch (e) {
        console.error("Error al decodificar base64:", e);
        return "";
      }
    }

    const diagnosticos = [];

    data.secciones_rep.forEach(sec => {
      if (sec.seccion_rep == "008") {
        let textob64 = window.btoa(
          unescape(encodeURIComponent(sec.base1_rep))
        );
        diagnosticos.push(sec.base1_rep.trim() + "\n")

      }
    });

    let tablaSecciones = (secciones) => {
      secciones.pop()
      let newList = []

      let secciones_rep = secciones.filter((el) => el.seccion_rep === "012" || el.seccion_rep === "111" || el.seccion_rep === "112" || el.seccion_rep === "113" || el.seccion_rep === "115");
      secciones_rep.forEach(item => {


        //******MEDICAMENTOS/EXAMENES/ORDENES*********
        if (item.seccion_rep === "012" || item.seccion_rep === "111" || item.seccion_rep === "112" || item.seccion_rep === "113" || item.seccion_rep === "115") {
          if (item.base3_rep.trim() == "N/A") {
            item.base2_rep = ""
          }
          if (!item.seccion_rep === "012") {
            item.base1_rep = window.btoa(item.base1_rep.trim())
          }

          if (item.base3_rep.trim() == "N/A") {
            item.indicacion_rep = item.base4_rep.trim()
          } else {
            item.indicacion_rep = item.base2_rep.trim()
              + item.base3_rep.trim()
              + item.base4_rep.trim()
              + item.base5_rep.trim()
              + item.base6_rep.trim()
              + item.base7_rep.trim()
              + item.base8_rep.trim()
              + item.base9_rep.trim()
              + item.base10_rep.trim()
              + item.base11_rep.trim()
              + item.base12_rep.trim()
              + item.base13_rep.trim()
              + item.base14_rep.trim()
              + item.base15_rep.trim()
              + item.base16_rep.trim()
              + item.base17_rep.trim()
              + item.base18_rep.trim()
              + item.base19_rep.trim()
              + item.base20_rep.trim()
              + item.base21_rep.trim()
              + item.base22_rep.trim()
              + item.base23_rep.trim()
              + item.base24_rep.trim()
              + item.base25_rep.trim()
              + item.base26_rep.trim()
              + item.base27_rep.trim()
              + item.base28_rep.trim()
              + item.base29_rep.trim()
              + item.base30_rep.trim()
              + item.base31_rep.trim()
              + item.base32_rep.trim()
              + item.base33_rep.trim()
              + item.base34_rep.trim()
              + item.base35_rep.trim()
              + item.base36_rep.trim()
              + item.base37_rep.trim()
              + item.base38_rep.trim()
              + item.base39_rep.trim()
            item.indicacion_rep = Buffer.from(item.indicacion_rep, 'base64').toString('utf-8')
          }
        }
        let exist = newList.find(el => el.nombreseccion_rep.trim() === item.nombreseccion_rep.trim())
        let seccion = item.seccion_rep;
        let elemento = {
          codigo: seccion == "111" ? item.codmedicam_rep.trim() : seccion == "112" ? item.codexamen_rep.trim() : seccion == "113" ? item.codordm_rep.trim() : seccion == "115" ? item.codmat_rep.trim() : "",
          titulo: item.nombresubseccn_rep.trim(),
          presentacion: item.presentacmedic_rep.trim(),
          // tiempo: `${item.duracionmedic_rep.trim()} ${item.frecmedic_rep.trim()}`,
          tiempo: `${item.duracionmedic_rep.trim()}  ${item.tiempomedic_rep.trim()}`,
          indicacion: seccion == "012" ? "" : item.indicacion_rep.trim(),
          cantidad: seccion == "111" ? item.cantmedic_rep.trim() : seccion == "112" ? item.cantexam_rep.trim() : seccion == "113" ? item.cantordm_rep.trim() : seccion == "115" ? item.cantmat_rep.trim() : "",
          text: `${item.base1_rep.trim()}
        `}

        if (seccion == "012") {
          const base64 = item.base1_rep.trim();
          item.base1_rep = decodeBase64Utf8(base64) + item.indicacion_rep.trim();
          elemento.text = item.base1_rep.trim();
          elemento.codigo = 1;
        }

        if (!exist) {
          item = {
            nombreseccion_rep: item.nombreseccion_rep,
            seccion_rep: item.seccion_rep,
            contenido: [elemento]
          }
          newList.push(item)

        } else
          exist.contenido.push(elemento)

      })
      return newList.map((item, index) => {

        return {
          margin: [0, 10, 0, 0],
          stack: [
            {
              text: `${item.nombreseccion_rep.trim()}`,
              bold: true,
              fontSize: 10
            },

            item.seccion_rep == "012"
              ? {
                fontSize: 9,
                table: {
                  headerRows: 1,
                  widths: ["100%"],
                  body: [
                    [{ text: 'Descripcion', style: "boldcenter" }],
                    ...item.contenido.map(el => [
                      { text: el.text, alignment: "left" }
                    ])
                  ]
                }
              }
              : (item.seccion_rep == "112" || item.seccion_rep == "113" || item.seccion_rep == "115")
                ? {
                  fontSize: 9,
                  table: {
                    headerRows: 1,
                    widths: ["10%", "50%", "10%", "*"],
                    body: [
                      [
                        { text: 'Código', style: "boldcenter" },
                        { text: 'Descripcion', style: "boldcenter" },
                        { text: 'Cantidad', style: "boldcenter" },
                        { text: 'Posologia', style: "boldcenter" }
                      ],
                      ...item.contenido.map(el => [
                        el.codigo,
                        { text: el.text, alignment: "right" },
                        { text: el.cantidad.trim(), alignment: "center" },
                        { text: el.indicacion.trim(), alignment: "right" }
                      ])
                    ]
                  }
                }
                : {
                  fontSize: 9,
                  table: {
                    headerRows: 1,
                    widths: ["10%", "30%", "12%", "10%", "10%", "28%"],
                    body: [
                      [
                        { text: 'Código', style: "boldcenter" },
                        { text: 'Descripcion', style: "boldcenter" },
                        { text: 'Presentacion', style: "boldcenter" },
                        { text: 'Cantidad', style: "boldcenter", alignment: "center" },
                        { text: 'Tiempo Tratamiento', style: "boldcenter" },
                        { text: 'Posologia', style: "boldcenter" }
                      ],
                      ...item.contenido.map(el => [
                        el.codigo,
                        { text: el.text, alignment: "right" },
                        el.presentacion,
                        { text: el.cantidad.trim(), alignment: "center" },
                        el.tiempo,
                        { text: el.indicacion.trim(), alignment: "right" }
                      ])
                    ]
                  }
                },

          ]
        }

      })

    }

    var dd = {
      pageSize: 'LETTER',
      pageMargins: [margin.left, 90, margin.right, 80],

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
                fit: [70, 70],
              },
              {
                style: "header",
                alignment: "center",
                stack: [
                  { text: "ORDEN MEDICA", fontSize: 14, margin: [0, 0, 0, 3] },
                  { text: `${data.especialidad_rep.trim()}`, fontSize: 8 },
                ]
              },
              {
                style: "header",
                stack: [
                  empresa.descrip_empr,
                  { text: `NIT. ${parseFloat(empresa.id_empr)}`, fontSize: 8 },
                  { text: `Dir. ${empresa.direccion_empr}`, fontSize: 8 },
                  { text: `Tel. ${empresa.telefono_empr}`, fontSize: 8 },
                  { text: `${empresa.Ciudad} - ${empresa.Departamento}`, fontSize: 8 },
                ]
              },
            ]
          },
        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: [margin.left, 10, margin.right, 0],
          fontSize: 7,
          columns: [
            { text: `Impreso: ${data.fechaimp_rep}` },
            { text: "Página " + currentPage.toString() + ' de ' + pageCount, alignment: "center" },
            { text: "www.titansoluciones.com", alignment: "right" },
          ]
        }
      },
      content: [
        {
          margin: [110, 0, 0, 5],
          columns: [
            `Nro Historia: ${parseFloat(data.consecutivo_rep.trim())}`,
            { text: `Fecha: ${data.fechahc_rep}`, alignment: "right" },
          ]
        },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 560,
              h: 70,
              r: 5,
              lineColor: 'black',
            },
          ]
        },
        {
          margin: [10, -55, 0, 5],
          fontSize: 9,
          columns: [
            {
              text: [
                { text: "Paciente: ", bold: true },
                `${paciente}`
              ]
            },
            {
              text: [
                { text: "Identificacion: ", bold: true },
                `${parseFloat(data.idpaciente_rep)}`
              ]
            },
            {
              text: [
                { text: "Edad: ", bold: true },
                `${data.edad_rep}`
              ]
            }

          ]
        },
        {
          margin: [10, 0, 0, 5],
          fontSize: 9,
          columns: [
            {
              text: [
                { text: "Dirección: ", bold: true },
                `${data.direccion_rep}`
              ]
            },
            {
              text: [
                { text: "Teléfono: ", bold: true },
                `${parseFloat(data.telefono_rep)}`
              ]
            },
            {
              text: [
                { text: "Género: ", bold: true },
                `${data.genero_rep}`
              ]
            }

          ]
        },
        {
          margin: [10, 0, 0, 5],
          fontSize: 9,
          columns: [
            {
              text: [
                { text: "Entidad: ", bold: true },
                `${data.eps_rep}`
              ]
            },
          ]
        },
        diagnosticos.length > 0 ? {
          margin: [0, 20, 0, 0],
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 550,
              y2: 0,
              lineWidth: 1.5,
            },
          ],
          alignment: "center",
        } : {},
        diagnosticos.length > 0 ? {
          margin: [10, 10, 0, 5],
          fontSize: 9,
          columns: [
            {
              text: [
                { text: "Diagnosticos: ", bold: true },
                {
                  text: [...diagnosticos],
                }
              ]
            },
          ]
        } : {},
        diagnosticos.length > 0 ? {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 550,
              y2: 0,
              lineWidth: 1.5,
            },
          ],
          alignment: "center",
        } : {},
        // {
        //   canvas: [
        //     {
        //       type: 'rect',
        //       x: 0,
        //       y: 0,
        //       w: 560,
        //       h: 520,
        //       r: 5,
        //       lineColor: 'black',
        //     },
        //   ]
        // },

        ...tablaSecciones(data.secciones_rep),
        // {
        //   // pageBreak: 'before',
        //   margin: [0, 10, 0, 0],
        //   stack: [
        //     {
        //       margin: [0, 0, 8, 10],
        //       image: data.firma,
        //       fit: [100, 100],
        //     },
        //     { text: '_____________________________________________________', margin: [0, 5, 0, 0] },
        //     { text: `${data.descprofesional.trim()}`, bold: true, margin: [0, 5, 0, 0] },
        //     { text: `Médico :${data.especialidad_rep.trim()}`, fontSize: 9 },
        //     { text: `RM: ${data.regmedico_rep.trim()}`, fontSize: 9 },
        //   ]
        // }


        {
          columns: [
            {
              // pageBreak: 'before',
              margin: [0, 20, 0, 0],
              stack: [
                {
                  margin: [0, 0, 8, 0],
                  image: data.firma,
                  fit: [100, 100],
                },
                '________________________________________________',
                { text: `${data.descprofesional.trim()}`, bold: true },
                { text: `Médico : ${data.especialidad_rep.trim()}`, fontSize: 9 },
                { text: `RM: ${data.regmedico_rep.trim()}`, fontSize: 9 },
              ]
            },
            data.firma2 && {
              // pageBreak: 'before',
              margin: [0, 20, 0, 0],
              stack: [
                {
                  margin: [0, 0, 8, 0],
                  image: data.firma2,
                  fit: [100, 100],
                },
                '________________________________________________',
                { text: `${data.descprofesional2.trim()}`, bold: true },
                { text: `Médico : ${data.especialidad2_rep.trim()}`, fontSize: 9 },
                { text: `RM: ${data.regmedico2_rep.trim()}`, fontSize: 9 },
              ]
            }
          ]
        }

      ],
    }
    if (blob) {
      pdfMake.createPdf(dd).getBlob((blob) => {
        res(blob);
      });
    } else {
      pdfMake.createPdf(dd).open();
      res();
    }
  })
};
const prestacionServicios = (data) => {
  return new Promise(res => {
    let servicios = [];
    let subtotal = 0;
    let total = 0;

    data.servicios.forEach(el => {
      servicios.push([
        el.codigo,
        el.nombre_servicio,
        { alignment: "center", text: el.cantidad.trim() },
        { alignment: "right", text: el.vlr_unit.trim() },
        { alignment: "right", text: el.subtotal.trim() },
        { alignment: "right", text: el.vlr_iva.trim() },
        { alignment: "right", text: el.vlr_total.trim() },
      ]);

      subtotal += parseFloat(el.subtotal.replace(/\,/g, "")) || 0;
      total += parseFloat(el.vlr_total.replace(/\,/g, "")) || 0;
    })

    let margin = {
      left: 30,
      right: 30
    };


    var dd = {
      pageMargins: [margin.left, 110, margin.right, 60],
      styles: {
        title: {
          fontSize: 12,
          bold: true
        },
        boldcenter: {
          bold: true,
          alignment: "center",
        },
        boldright: {
          bold: true,
          alignment: "right",
        }
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          { text: data.fecha_actual, margin: [margin.left, 7, margin.right, 0], fontSize: 9 },
          {
            margin: [margin.left, 10, margin.right, 0],
            fontSize: 8,
            columns: [
              {
                width: "50%",
                columns: [
                  {
                    image: data.logo,
                    width: 80,
                    height: 30
                  },
                  {
                    bold: true,
                    margin: [2, 0, 0, 0],
                    stack: [
                      { text: data.nombre_ips, style: "title" },
                      `Nit: ${data.nit_ips}`,
                      `Régimen: ${data.regimen_ips}`,
                      `Dirección: ${data.direccion_ips}`,
                      `Ciudad: ${data.ciudad_ips}`,
                    ]
                  }
                ]
              },
              {
                margin: [5, 0, 0, 0],
                width: "50%",
                columns: [
                  {
                    stack: [
                      { text: [{ text: "Fecha atención: ", bold: true }, data.fecha_atencion] },
                      { text: [{ text: "Cliente: ", bold: true }, data.nombre_cliente] },
                      { text: [{ text: "Nit: ", bold: true }, data.nit_cliente] }
                    ]
                  },
                  {
                    style: "boldcenter",
                    margin: [2, 5, 0, 0],
                    stack: [
                      { text: "PRESTACION DE SERVICIOS", fontSize: 9 },
                      { text: `No. ${data.nro_prestacion}`, margin: [0, 2, 0, 0] },
                      { text: ["Admisión: ", { text: data.nro_admision, bold: false }], margin: [0, 2, 0, 0] },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      content: [
        {
          fontSize: 8.5,
          columns: [
            {
              width: "48%",
              stack: [
                { text: [{ text: "Paciente: ", bold: true }, data.nombre_paciente] },
                { text: [{ text: "Id: ", bold: true }, data.id_paciente.trim()], margin: [0, 1.5, 0, 0] },
                { text: [{ text: "Dirección: ", bold: true }, data.direccion_paciente], margin: [0, 1.5, 0, 0] },
                { text: [{ text: "Teléfono: ", bold: true }, data.telefono_paciente], margin: [0, 1.5, 0, 0] },
                { text: [{ text: "Ciudad: ", bold: true }, data.ciudad_paciente], margin: [0, 1.5, 0, 0] },
                { text: [{ text: "E-mail: ", bold: true }, data.email_paciente], margin: [0, 1.5, 0, 0] }
              ]
            },
            {
              width: "52%",
              columns: [
                {
                  width: "60%",
                  stack: [
                    { text: [{ text: "Edad: ", bold: true }, data.edad_paciente] },
                    { text: [{ text: "Género: ", bold: true }, data.genero_paciente], margin: [0, 1.5, 0, 0] },
                    { text: [{ text: "Régimen: ", bold: true }, data.regimen_paciente], margin: [0, 1.5, 0, 0] },
                    { text: [{ text: "Eps: ", bold: true }, data.eps_paciente], margin: [0, 1.5, 0, 0] },
                    { text: [{ text: "Medio pago: ", bold: true }, data.medio_pago], margin: [0, 1.5, 0, 0] },
                    { text: [{ text: "P. Atención: ", bold: true }, data.p_atencion], margin: [0, 1.5, 0, 0] }
                  ]
                },
                {
                  width: "40%",
                  margin: [0, 10, 0, 0],
                  alignment: "center",
                  text: `QR: \n${data.info_qr}`
                }
              ]
            }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 8,
          layout: 'lightHorizontalLines',
          table: {
            widths: ["10%", "32%", "9%", "13%", "11%", "10%", "15%"],
            headerRows: 1,
            body: [
              [
                { text: "CODIGO", bold: true },
                { text: "DESCRIPCION", style: "boldcenter" },
                { text: "CANTIDAD", bold: true },
                { text: "VLR UNITARIO", bold: true },
                { text: "SUB TOTAL", bold: true },
                { text: "VLR. IVA", bold: true },
                { text: "TOTAL", bold: true },
              ],
              ...servicios
            ]
          }
        },
        {
          margin: [0, 20, 0, 0],
          fontSize: 8,
          columns: [
            {
              width: "50%",
              stack: [
                " ",
                " ",
                `Elaboró: ${data.elaboro}`,
                " ",
                { text: data.fecha_actual, margin: [0, 3, 0, 0] },
                { text: `Nr. Autorización: ${data.autorizacion}`, margin: [0, 3, 0, 0] }
              ]
            },
            {
              width: "50%",
              layout: 'noBorders',
              alignment: "right",
              table: {
                widths: ["auto", "20%", "20%", "*"],
                body: [
                  [
                    { text: "Subtotal servicios", style: "boldright" },
                    "",
                    "",
                    `$${formatNumero(subtotal)}`,
                  ],
                  [
                    { text: "Descuentos", style: "boldright" },
                    "",
                    "",
                    `$${data.descuento}`,
                  ],
                  [
                    { text: "Total servicios", style: "boldright" },
                    "",
                    "",
                    { text: `$${formatNumero(total)}`, bold: true },
                  ],
                  [
                    { text: "Copago", style: "boldright" },
                    "",
                    "",
                    `$${data.copago}`,
                  ],
                  [
                    { text: "Cuota moderadora", style: "boldright" },
                    "",
                    "",
                    `$${data.cuotam}`,
                  ]
                ]
              }
            }
          ]
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 8,
          table: {
            widths: "*",
            heights: 30,
            body: [
              [{ text: [{ text: "Observaciones: ", bold: true }, data.observacion_rep] }]
            ]
          }
        },
        {
          margin: [0, 60, 0, 0],
          fontSize: 8,
          columns: [
            {
              margin: [15, 0, 0, 0],
              width: "50%",
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
                { text: "PRESTADOR", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
            {
              margin: [30, 0, 0, 0],
              width: "50%",
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
                { text: "Recibi el Servicio a Satisfacción", style: "boldcenter", margin: [0, 2, 0, 0] },
                { text: "Paciente", style: "boldcenter", margin: [0, 2, 0, 0] },
              ],
            },
          ]
        },
      ]

    }

    pdfMake.createPdf(dd).open();
    res();
  })
};
const furips = (data) => {
  return new Promise((res) => {
    var margin = {
      left: 20,
      right: 20,
    };


    let marginSeparador = [3, 3, 9, 0];
    let widthTitle = "15%";

    const formatCuadros = (string = "") => {
      let arrayStr = string.split("");
      let arr = arrayStr.length ? arrayStr : [' ']
      return {
        alignment: "center",
        table: {
          widths: "*",
          body: [
            arr
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
    const formatStr = (string) => {
      return {
        margin: marginSeparador,
        width: "auto",
        text: string
      };
    };
    const formatTitle = (string) => {
      return {
        style: "titles",
        width: widthTitle,
        text: string
      };
    };
    const headerTable = (string) => {
      return [
        { fillColor: '#cccccc', text: string, alignment: "center" }
      ]
    };
    const checkbox = (string, value) => {
      return {
        columns: [
          { text: string, margin: [0, 3, 2, 0] },
          { width: "14%", ...formatCaja(value) }
        ],
        alignment: "right"
      };
    };

    const condicional = (dato, datoPdf) => {
      return (dato == datoPdf) ? "X" : " "
    };

    var dd = {
      pageMargins: [margin.left, 65, margin.right, 40],
      styles: {
        header: {
          margin: [margin.left, 15, margin.left, 0],
          fontSize: 9,
          alignment: "center",
        },
        titles: {
          alignment: "center",
          margin: [0, 2, 0, 0]
        },
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            style: "header",
            stack: [
              "REPUBLICA DE COLOMBIA",
              "MINISTERIO DE SALUD Y PROTECCIÓN SOCIAL",
              "FORMULARIO ÚNICO DE RECLAMACIÓN DE LAS INSTITUCIONES PRESTADORAS DE SALUD POR SERVICIOS PRESTADOS A VICTIMAS",
              "PRESTADORES DE SERVICIOS DE SALUD - FURISP"
            ]
          }
        ]
      },
      content: [
        {
          fontSize: 8.5,
          stack: [
            {
              columns: [
                {
                  width: "20%",
                  text: "Fecha Radicación:",
                },
                formatCuadros(data.fecha_rep.replace(/\-/g, "")),
                formatStr("RG"),
                { ...formatCaja(" "), width: '5%' },
                { margin: marginSeparador, text: "No. Radicado" },
                formatCaja(" "),
              ]
            },
            {
              margin: [0, 3, 0, 0],
              columns: [
                {
                  width: "26%",
                  text: "No. Radicado Anterior(Respuesta\nGlosa Anterior, marcar x en RG)",
                },
                formatCaja("", 18),
                formatStr("Nro. Factura/Cuenta de \nCobro"),
                formatCaja(data.factura_rep, 18)
              ]
            },
            {
              margin: [0, 3, 0, 0],
              layout: 'noBorders',
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("I. DATOS DE LA INSTITUCIÓN PRESTADORA DE SALUD"),
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "Razón Social" },
                        formatCaja(data.desripEmpresa),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "Código Habilitación" },
                        formatCuadros(data.ciudadCodigo_rep),
                        formatStr("Nit"),
                        formatCuadros(data.idEmpresa.replace(/\,/g, "")),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Dirección"),
                        formatCuadros(data.direccionEmpresa)
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Departamento"),
                        formatCuadros(data.dptoEmpresa),
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(" ") },
                        formatStr("Teléfono"),
                        formatCuadros("          ")
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Municipio"),
                        { width: "auto", ...formatCuadros(data.ciudadEmpresa) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(" ") },
                      ]
                    }
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("II. DATOS DE LA VICTIMA DEL EVENTO CATASTRÓFICO O ACCIDENTE DE TRANSITO"),
                  [
                    {
                      columns: [
                        {
                          width: "60%",
                          stack: [
                            formatCaja(data.Apellido1_rep.trim() || " "),
                            { text: "1er Apellido", alignment: "center" },
                            formatCaja(data.Nombre1_rep.trim() || " "),
                            { text: "1er Nombre ", alignment: "center" },
                          ],
                        },
                        {
                          width: "40%",
                          margin: [30, 0, 0, 0],
                          stack: [
                            formatCaja(data.Apellido2_rep.trim() || " "),
                            { text: "2do Apellido", alignment: "center" },
                            formatCaja((data.Nombre2_rep) ? data.Nombre2_rep.trim() || " " : " "),
                            { text: "2do Nombre ", alignment: "center" },
                          ],
                        },
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { width: widthTitle, text: "Tipo de Documento" },
                        {
                          fontSize: 7,
                          width: "40%",
                          table: {
                            widths: "11%",
                            body: [
                              [`CC:${condicional(data.tipodoc_vic_rep, "CC")}`,
                              `CE:${condicional(data.tipodoc_vic_rep, "CE")}`,
                              `PA:${condicional(data.tipodoc_vic_rep, "PA")}`,
                              `TI:${condicional(data.tipodoc_vic_rep, "TI")}`,
                              `RC:${condicional(data.tipodoc_vic_rep, "RC")}`,
                              `AS:${condicional(data.tipodoc_vic_rep, "AS")}`,
                              `MS:${condicional(data.tipodoc_vic_rep, "MS")}`,
                              `CD:${condicional(data.tipodoc_vic_rep, "CD")}`,
                              `TR:${condicional(data.tipodoc_cer_rep, "TR")}`
                              ]
                            ]
                          }
                        },
                        formatStr("N° Documento"),
                        formatCuadros(data.nrodoc_vic_rep.trim() ? data.nrodoc_vic_rep.trim() : " "),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Fecha de Nacimiento"),
                        { width: "30%", ...formatCuadros(data.fnacim_vic_rep) },
                        formatStr("Sexo"),
                        { width: "4%", ...formatCaja(`F:${condicional(data.sexo_vic_rep, "F")}`) },
                        { width: "4%", margin: [10, 0, 0, 0], ...formatCaja(`M:${condicional(data.sexo_vic_rep, "M")}`) },
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Dirección"),
                        formatCuadros(data.direcc_vic_rep.trim()),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Departamento"),
                        { width: "auto", ...formatCuadros(data.departamento_rep.trim()) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.departamentoCodigo_rep) },
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Municipio"),
                        { width: "auto", ...formatCuadros(data.ciudad_rep.trim()) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.ciudadCodigo_rep.substr(2, 3)) },
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 1, 0, 0],
                      columns: [
                        { text: "Condición del Accidentado", width: "30%", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.condicion_rep, "1")) },
                        { text: "Conductor", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.condicion_rep, "2")) },
                        { text: "Peatón", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.condicion_rep, "3")) },
                        { text: "Ocupante", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.condicion_rep, "4")) },
                        { text: "Ciclista", style: 'titles' }
                      ]
                    }
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*", "*", "*", "25%", "*"],
                body: [
                  [{ colSpan: 5, fillColor: '#cccccc', text: "III. DATOS DEL SITIO DONDE OCURRIO EL EVENTO CATASTROFICO O EL ACCIDENTE DE TRANSITO", alignment: "center" }, "", "", "", ""],
                  [{ colSpan: 5, text: "Naturaleza del evento", decoration: "underline", decorationColor: "grey" }, "", "", "", ""],
                  ["", checkbox("Accidente de Transito", condicional(data.naturaleza_evt_rep, "01")), "", "", ""],
                  [
                    "Naturales:",
                    checkbox("Sismo", condicional(data.naturaleza_evt_rep, "02")),
                    checkbox("Maremoto", condicional(data.naturaleza_evt_rep, "03")),
                    checkbox("Erupciones Volcánicas", condicional(data.naturaleza_evt_rep, "04")),
                    checkbox("Huracán", condicional(data.naturaleza_evt_rep, "05")),
                  ],
                  [
                    "",
                    checkbox("Inundaciones", condicional(data.naturaleza_evt_rep, "06")),
                    checkbox("Avalancha", condicional(data.naturaleza_evt_rep, "07")),
                    checkbox("Deslizamiento de Tierra", condicional(data.naturaleza_evt_rep, "08")),
                    checkbox("Incendio Natural", condicional(data.naturaleza_evt_rep, "09")),
                  ],
                  [
                    "",
                    checkbox("Rayo", condicional(data.naturaleza_evt_rep, "10")),
                    checkbox("Vendaval", condicional(data.naturaleza_evt_rep, "11")),
                    checkbox("Tornado", condicional(data.naturaleza_evt_rep, "12")),
                    ""
                  ],
                  [
                    "Terroristas:",
                    checkbox("Explosión", condicional(data.naturaleza_evt_rep, "13")),
                    checkbox("Masacre", condicional(data.naturaleza_evt_rep, "14")),
                    checkbox("Mina Antipersonal", condicional(data.naturaleza_evt_rep, "15")),
                    checkbox("Combate", condicional(data.naturaleza_evt_rep, "16")),
                  ],
                  [
                    "",
                    checkbox("Incendio", condicional(data.naturaleza_evt_rep, "17")),
                    checkbox("Ataques a Municipios", condicional(data.naturaleza_evt_rep, "18")),
                    "",
                    ""
                  ],
                  [
                    {
                      columns: [
                        { text: 'Otro', margin: [0, 3, 0, 0] },
                        { width: "15%", ...formatCaja(condicional(data.naturaleza_evt_rep, "19")), alignment: "right" }
                      ],
                    },
                    {
                      colSpan: 4,
                      columns: [
                        { width: "auto", text: '¿Cuál?', margin: [0, 3, 2, 0] },
                        formatCuadros("                     ")
                      ],
                    },
                    "",
                    "",
                    ""
                  ],
                  [
                    { text: 'Dirección de la ocurrencia', margin: [0, 3, 0, 0] },
                    {
                      colSpan: 4,
                      ...formatCuadros(data.direcc_evt_rep.trim())
                    },
                    "",
                    "",
                    ""
                  ],
                  [
                    { text: 'Fecha Evento/Accidente', margin: [0, 3, 0, 0] },
                    formatCuadros(data.fecha_evt_rep),
                    { text: "Hora", alignment: "right", margin: [0, 3, 0, 0] },
                    formatCuadros(data.hora_evt_rep),
                    ""
                  ],
                  [
                    {
                      colSpan: 5,
                      columns: [
                        formatTitle("Departamento"),
                        { width: "auto", ...formatCuadros(data.departamento_evt_rep.trim()) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.departamentoCodigo_evt_rep) },
                      ]
                    }
                  ],
                  [
                    {
                      colSpan: 5,
                      columns: [
                        formatTitle("Municipio"),
                        { width: "auto", ...formatCuadros(data.ciudad_evt_rep.trim()) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.ciudadCodigo_evt_rep.substr(2, 3)) },
                        formatStr("Zona"),
                        { width: "5%", ...formatCaja(`U:${condicional(data.zona_evt_rep, "1")}`) },
                      ]
                    }
                  ],
                  [
                    { alignment: "center", ...formatCaja(`R:${condicional(data.zona_evt_rep, "2")}`) },
                    "", "", "", ""
                  ],
                  [
                    {
                      colSpan: 5,
                      text: "Descripción Breve Evento Catastrófico o Accidente de Transito\nEnuncie las principales características del evento/accidente"
                    }
                  ],
                  [
                    {
                      colSpan: 5,
                      ...formatCaja(data.detalleEvento)
                    }
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                widths: ["*"],
                body: [
                  headerTable("IV. DATOS DEL VEHÍCULO DE ACCIDENTE DE TRANSITO"),
                  [
                    {
                      margin: [0, 1, 0, 50],
                      columns: [
                        { text: "Asegurado", width: "17%", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.estado_veh_rep, "1")) },
                        { text: "No Asegurado", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.estado_veh_rep, "2")) },
                        { text: "Vehículo fantasma", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.estado_veh_rep, "3")) },
                        { text: "Poliza Falsa", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.estado_veh_rep, "4")) },
                        { text: "Vehiculo en fuga", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.estado_veh_rep, "5")) },
                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "Marca" },
                        { ...formatCaja(data.marca_veh_rep.trim(), 1), width: "40%" },
                        formatStr("Placa"),
                        { ...formatCuadros(data.placas_veh_rep), width: "20%" },
                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "Tipo de Servicio:" },
                        { ...formatStr("Particular"), margin: [0, 3, 2, 0] },
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "01")) },
                        formatStr("Público"),
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "02")) },
                        { ...formatStr("Oficial"), margin: [2, 3, 2, 0] },
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "03")) },
                        formatStr("Vehiculo de emergencia"),
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "04")) },
                        formatStr("Vehiculo de servicio diplomático o consular"),
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "05")) },

                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "" },
                        { ...formatStr("Vehiculo de transporte masivo "), margin: [0, 3, 25, 0] },
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "06")) },
                        formatStr("Vehiculo escolar"),
                        { width: "3%", ...formatCaja(condicional(data.tipo_veh_rep, "07")) },

                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        { width: "23%", text: "Código de la aseguradora" },
                        { ...formatCuadros(data.codaseg_veh_rep.trim()), width: "auto" },
                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "N° de la Póliza" },
                        formatCuadros(data.poliza_veh_rep.trim()),
                        formatStr("Intervención de autoridad"),
                        formatStr("Si"),
                        { ...formatCaja(condicional(data.intervenc_veh_rep, "1")), width: "3%" },
                        formatStr("No"),
                        { ...formatCaja(condicional(data.intervenc_veh_rep, "2")), width: "3%" },
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "Vigencia" },
                        formatStr("Desde"),
                        formatCuadros(data.inicpoliza_veh_rep),
                        formatStr("Hasta"),
                        formatCuadros(data.finpoliza_veh_rep),
                        formatStr("Cobro Excedente Póliza"),
                        formatStr("Si"),
                        { ...formatCaja(condicional(data.cobroexed_veh_rep, "1")), width: "3%" },
                        formatStr("No"),
                        { ...formatCaja(condicional(data.cobroexed_veh_rep, "2")), width: "3%" },
                      ]
                    }
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("V. DATOS DEL PROPIETARIO DEL VEHÍCULO"),
                  [
                    {
                      columns: [
                        {
                          width: "60%",
                          stack: [
                            formatCaja(data.apell1_prv_rep.trim() || " "),
                            { text: "1er Apellido", alignment: "center" },
                            formatCaja(data.nombrel_prv_rep.trim() || " "),
                            { text: "1er Nombre ", alignment: "center" },
                          ],
                        },
                        {
                          width: "40%",
                          margin: [30, 0, 0, 0],
                          stack: [
                            formatCaja(data.apell2_prv_rep.trim() || " "),
                            { text: "2do Apellido", alignment: "center" },
                            formatCaja(data.nombre2_prv_rep.trim() || " "),
                            { text: "2do Nombre ", alignment: "center" },
                          ],
                        },
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { width: widthTitle, text: "Tipo de Documento" },
                        {
                          fontSize: 7,
                          width: "40%",
                          table: {
                            widths: "11%",
                            body: [
                              [`CC:${condicional(data.tipodoc_prv_rep, "CC")}`,
                              `CE:${condicional(data.tipodoc_prv_rep, "CE")}`,
                              `PA:${condicional(data.tipodoc_prv_rep, "PA")}`,
                              `TI:${condicional(data.tipodoc_prv_rep, "TI")}`,
                              `RC:${condicional(data.tipodoc_prv_rep, "RC")}`,
                              `AS:${condicional(data.tipodoc_prv_rep, "AS")}`,
                              `MS:${condicional(data.tipodoc_prv_rep, "MS")}`,
                              `CD:${condicional(data.tipodoc_prv_rep, "CD")}`,
                              `TR:${condicional(data.tipodoc_cer_rep, "TR")}`
                              ]
                            ]
                          }
                        },
                        formatStr("N° Documento"),
                        formatCuadros(data.idprop_prv_rep.trim() ? data.idprop_prv_rep.trim() : " "),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Dirección"),
                        formatCuadros(data.direccprop_prv_rep.trim())
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Departamento"),
                        formatCuadros(data.departamento_prv_rep.trim()),
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.departamentoCodigo_prv_rep) },
                        formatStr("Teléfono"),
                        { ...formatCuadros(data.telefprop_prv_rep.trim()), width: "auto" }
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Municipio"),
                        { width: "auto", ...formatCuadros(data.ciudad_prv_rep.trim()) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.ciudadCodigo_prv_rep.substr(2, 3)) },
                      ]
                    }
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("VI. DATOS DEL CONDUCTOR DEL VEHÍCULO INVOLUCRADO EN EL ACCIDENTE DE TRANSITO"),
                  [
                    {
                      columns: [
                        {
                          width: "60%",
                          stack: [
                            formatCaja(data.apell1_cond_rep.trim() || " "),
                            { text: "1er Apellido", alignment: "center" },
                            formatCaja(data.nombrel_cond_rep.trim() || " "),
                            { text: "1er Nombre ", alignment: "center" },
                          ],
                        },
                        {
                          width: "40%",
                          margin: [30, 0, 0, 0],
                          stack: [
                            formatCaja(data.apell2_cond_rep.trim() || " "),
                            { text: "2do Apellido", alignment: "center" },
                            formatCaja(data.nombre2_cond_rep.trim() || " "),
                            { text: "2do Nombre ", alignment: "center" },
                          ],
                        },
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { width: widthTitle, text: "Tipo de Documento" },
                        {
                          fontSize: 7,
                          width: "40%",
                          table: {
                            widths: "11%",
                            body: [
                              [`CC:${condicional(data.tipodoc_cond_rep, "CC")}`,
                              `CE:${condicional(data.tipodoc_cond_rep, "CE")}`,
                              `PA:${condicional(data.tipodoc_cond_rep, "PA")}`,
                              `TI:${condicional(data.tipodoc_cond_rep, "TI")}`,
                              `RC:${condicional(data.tipodoc_cond_rep, "RC")}`,
                              `AS:${condicional(data.tipodoc_cond_rep, "AS")}`,
                              `MS:${condicional(data.tipodoc_cond_rep, "MS")}`,
                              `CD:${condicional(data.tipodoc_cond_rep, "CD")}`,
                              `TR:${condicional(data.tipodoc_cer_rep, "TR")}`
                              ]
                            ]
                          }
                        },
                        formatStr("N° Documento"),
                        formatCuadros(data.idprop_cond_rep.trim() ? data.idprop_cond_rep.trim() : " "),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Dirección"),
                        formatCuadros(data.direccprop_cond_rep.trim())
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Departamento"),
                        formatCuadros(data.departamento_cond_rep.trim()),
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.departamentoCodigo_cond_rep) },
                        formatStr("Teléfono"),
                        { ...formatCuadros(data.telefprop_cond_rep.trim()), width: "auto" }
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 0, 0, 3],
                      columns: [
                        formatTitle("Municipio"),
                        { width: "auto", ...formatCuadros(data.ciudad_cond_rep.trim()) },
                        formatStr("Cod"),
                        { width: "auto", ...formatCuadros(data.ciudadCodigo_cond_rep.substr(2, 3)) },
                      ]
                    }
                  ],
                  headerTable("DATOS DE VEHÍCULOS INVOLUCRADOS"),
                  [{ text: "Datos del Segundo Vehículo:", style: "titles" }],
                  [
                    {
                      columns: [
                        { text: "Asegurado", width: "17%", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh2_rep, "1")) },
                        { text: "No Asegurado", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh2_rep, "2")) },
                        { text: "Vehículo fantasma", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh2_rep, "3")) },
                        { text: "Poliza Falsa", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh2_rep, "4")) },
                        { text: "Vehiculo en fuga", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh2_rep, "5")) },
                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Placa"),
                        { width: "22%", ...formatCuadros(data.placa_veh2_rep) }
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { width: widthTitle, text: "Tipo de Documento" },
                        {
                          fontSize: 7,
                          width: "40%",
                          table: {
                            widths: "11%",
                            body: [
                              [`CC:${condicional(data.tipodoc_veh2_rep, "CC")}`,
                              `CE:${condicional(data.tipodoc_veh2_rep, "CE")}`,
                              `PA:${condicional(data.tipodoc_veh2_rep, "PA")}`,
                              `TI:${condicional(data.tipodoc_veh2_rep, "TI")}`,
                              `RC:${condicional(data.tipodoc_veh2_rep, "RC")}`,
                              `AS:${condicional(data.tipodoc_veh2_rep, "AS")}`,
                              `MS:${condicional(data.tipodoc_veh2_rep, "MS")}`,
                              `CD:${condicional(data.tipodoc_veh2_rep, "CD")}`,
                              `TR:${condicional(data.tipodoc_veh2_rep, "TR")}`
                              ]
                            ]
                          }
                        },
                        formatStr("N° Documento"),
                        formatCuadros(`${parseFloat(data.nrodoc_veh2_rep)}`),
                      ]
                    }
                  ],
                  [{ text: "Datos del Tercer Vehículo:", style: "titles" }],
                  [
                    {
                      columns: [
                        { text: "Asegurado", width: "17%", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh3_rep, "1")) },
                        { text: "No Asegurado", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh3_rep, "2")) },
                        { text: "Vehículo fantasma", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh3_rep, "3")) },
                        { text: "Poliza Falsa", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh3_rep, "4")) },
                        { text: "Vehiculo en fuga", style: 'titles' },
                        { width: "3%", ...formatCaja(condicional(data.tipovh_veh3_rep, "5")) },
                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        formatTitle("Placa"),
                        { width: "22%", ...formatCuadros(data.placa_veh3_rep) }
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { width: widthTitle, text: "Tipo de Documento" },
                        {
                          fontSize: 7,
                          width: "40%",
                          table: {
                            widths: "11%",
                            body: [
                              [`CC:${condicional(data.tipodoc_veh3_rep, "CC")}`,
                              `CE:${condicional(data.tipodoc_veh3_rep, "CE")}`,
                              `PA:${condicional(data.tipodoc_veh3_rep, "PA")}`,
                              `TI:${condicional(data.tipodoc_veh3_rep, "TI")}`,
                              `RC:${condicional(data.tipodoc_veh3_rep, "RC")}`,
                              `AS:${condicional(data.tipodoc_veh3_rep, "AS")}`,
                              `MS:${condicional(data.tipodoc_veh3_rep, "MS")}`,
                              `CD:${condicional(data.tipodoc_veh3_rep, "CD")}`,
                              `TR:${condicional(data.tipodoc_veh3_rep, "TR")}`
                              ]
                            ]
                          }
                        },
                        formatStr("N° Documento"),
                        formatCuadros(`${parseFloat(data.nrodoc_veh3_rep)}`),
                      ]
                    }
                  ],
                ],

              },
            },
            {
              margin: [0, 3, 0, 0],
              layout: 'noBorders',
              table: {
                widths: ["17%", "*"],
                body: [
                  [{ colSpan: 2, fillColor: '#cccccc', text: "VII. DATOS DE REMISIÓN", alignment: "center" }, ""],
                  [
                    { text: "Tipo referencia:", margin: [0, 3, 0, 0] },
                    {
                      columns: [
                        formatStr("Remisión"),
                        { ...formatCaja(condicional(data.tiporef_rem_rep, "1")), width: "4%" },
                        formatStr("Órden de Servicio"),
                        { ...formatCaja(condicional(data.tiporef_rem_rep, "2")), width: "4%" },

                      ]
                    },
                  ],
                  [
                    { text: "Fecha remisión", style: "titles" },
                    {
                      columns: [
                        { ...formatCuadros(data.fecharm_rem_rep), width: "30%" },
                        formatStr("Hora"),
                        { ...formatCuadros(data.horarm_rem_rep), width: "15%" },
                      ]
                    },
                  ],
                  [
                    { text: "Prestador que remite", style: "titles" },
                    formatCaja(data.prestadorrm_rem_rep.trim())
                  ],
                  [
                    { text: "Código de Inscripción:", style: "titles" },
                    { columns: [{ ...formatCuadros(data.codinscrm_rem_rep.trim()), width: "45%" }] }
                  ],
                  [
                    { text: "Profesional que remite:", style: "titles" },
                    {
                      margin: [0, 0, 0, 60],
                      columns: [
                        { ...formatCaja(data.profesrm_rem_rep.trim()), width: "65%" },
                        formatStr("Cargo:"),
                        formatCaja(data.cargorm_rem_rep.trim())
                      ]
                    }
                  ],
                  [
                    { text: "Dirección que remite:", style: "titles" },
                    formatCuadros(data.direccionrm_rem_rep.trim())
                  ],
                  [
                    { text: "Municipio que remite:", style: "titles" },
                    formatCuadros(data.municipiorm_rem_rep.trim())
                  ],
                  [
                    { text: "Fecha aceptación", style: "titles" },
                    {
                      columns: [
                        { ...formatCuadros(data.fecharc_rem_rep), width: "30%" },
                        formatStr("Hora"),
                        { ...formatCuadros(data.horarc_rem_rep), width: "15%" },
                      ]
                    },
                  ],
                  [
                    { text: "Prestador que recibe", style: "titles" },
                    formatCaja(data.prestadorrc_rem_rep.trim())
                  ],
                  [
                    { text: "Código de Inscripción:", style: "titles" },
                    { columns: [{ ...formatCuadros(data.codinscrc_rem_rep.trim()), width: "45%" }] }
                  ],
                  [
                    { text: "Profesional que recibe:", style: "titles" },
                    {
                      columns: [
                        { ...formatCaja(data.profesrc_rem_rep.trim()), width: "65%" },
                        formatStr("Cargo:"),
                        formatCaja(data.cargorc_rem_rep.trim())
                      ]
                    }
                  ],
                  [
                    { text: "Dirección que recibe:", style: "titles" },
                    formatCuadros(data.direccionrc_rem_rep.trim())
                  ],
                  [
                    { text: "Municipio que recibe:", style: "titles" },
                    formatCuadros(data.municipiorc_rem_rep.trim())
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("VIII. AMPARO DE TRANSPORTE Y MOVILIZACIÓN DE LA VICTIMA"),
                  ["Diligenciar únicamente para el transporte desde el sitio del evento hasta la primera IPS(Transporte Primario)"],
                  [
                    {
                      columns: [
                        { text: "Datos de Vehiculo", width: widthTitle, margin: [0, 2, 0, 0] },
                        formatStr("Placa N°"),
                        { ...formatCuadros(data.placa_amp_rep), width: "20%" },

                      ]
                    },
                  ],
                  [
                    {
                      columns: [
                        {
                          width: "50%",
                          stack: [
                            formatCaja(data.apell1_amp_rep.trim() || " "),
                            { text: "1er Apellido", alignment: "center" },
                            formatCaja(data.nombrel_amp_rep.trim() || " "),
                            { text: "1er Nombre ", alignment: "center" },
                          ],
                        },
                        {
                          width: "50%",
                          margin: [30, 0, 0, 0],
                          stack: [
                            formatCaja(data.apell2_amp_rep.trim() || " "),
                            { text: "2do Apellido", alignment: "center" },
                            formatCaja(data.nombre2_amp_rep.trim() || " "),
                            { text: "2do Nombre ", alignment: "center" },
                          ],
                        },
                      ]
                    }
                  ],
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        { width: "20%", text: "Transporto la victima desde" },
                        formatCaja(data.trdesde_amp_rep.trim()),
                        formatStr("Hasta"),
                        formatCaja(data.trhasta_amp_rep.trim()),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        { text: "Tipo de Transporte", width: widthTitle, style: 'titles' },
                        formatStr("Ambulancia Básica"),
                        { width: "3%", ...formatCaja(condicional(data.tipotr_amp_rep, "1")) },
                        formatStr("Ambulancia Médicada"),
                        { width: "3%", ...formatCaja(condicional(data.tipotr_amp_rep, "2")) },
                        formatStr("Lugar donde recoge la Victima"),
                        { width: "3%", ...formatCaja(condicional(data.tipotr_amp_rep, "3")) },
                        formatStr("Zona"),
                        { ...formatCaja(`U:${condicional(data.zonatr_amp_rep, "1")}`), alignment: "center" },
                        { ...formatCaja(`R:${condicional(data.zonatr_amp_rep, "2")}`), margin: [5, 0, 0, 0], alignment: "center" },
                      ]
                    },
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("IX. CERTIFICADO DE LA ATENCIÓN MEDICA DE LA VICTIMA COMO PRUEBA DEL ACCIDENTE O EVENTO"),
                  [
                    {
                      margin: [0, 2, 0, 0],
                      columns: [
                        {
                          width: "50%",
                          stack: [
                            {
                              columns: [
                                { text: "Fecha ingreso", width: "20%", margin: [0, 2, 0, 0] },
                                { ...formatCuadros(data.fechaing_cer_rep), },
                                formatStr("a las"),
                                { ...formatCuadros(data.horaing_cer_rep), width: "25%" },
                              ]
                            },
                            {
                              margin: [0, 3, 0, 0],
                              columns: [
                                { text: "Código de Diagnóstico principal Ingreso", style: "titles" },
                                { ...formatCuadros(data.dx1ing_cer_rep.trim()), width: "25%" },
                              ]
                            },
                            {
                              margin: [0, 3, 0, 0],
                              columns: [
                                { text: "Otro Código de Diagnóstico principal Ingreso", style: "titles" },
                                { ...formatCuadros(data.dx2ing_cer_rep.trim()), width: "25%" },
                              ]
                            },
                            {
                              margin: [0, 3, 0, 0],
                              columns: [
                                { text: "Otro Código de Diagnóstico principal Ingreso", style: "titles" },
                                { ...formatCuadros(data.dx3ing_cer_rep.trim()), width: "25%" },
                              ]
                            }
                          ],
                        },
                        {
                          width: "50%",
                          margin: [20, 0, 0, 0],
                          stack: [
                            {
                              columns: [
                                { text: "Fecha egreso", width: "20%", margin: [0, 2, 0, 0] },
                                { ...formatCuadros(data.fechaegr_cer_rep), },
                                formatStr("a las"),
                                { ...formatCuadros(data.horaegr_cer_rep), width: "25%" },
                              ]
                            },
                            {
                              margin: [0, 3, 0, 0],
                              columns: [
                                { text: "Código de Diagnóstico principal Egreso", style: "titles" },
                                { ...formatCuadros(data.dx1egr_cer_rep.trim()), width: "25%" },
                              ]
                            },
                            {
                              margin: [0, 3, 0, 0],
                              columns: [
                                { text: "Otro Código de Diagnóstico principal Egreso", style: "titles" },
                                { ...formatCuadros(data.dx2egr_cer_rep.trim()), width: "25%" },
                              ]
                            },
                            {
                              margin: [0, 3, 0, 0],
                              columns: [
                                { text: "Otro Código de Diagnóstico principal Egreso", style: "titles" },
                                { ...formatCuadros(data.dx3egr_cer_rep.trim()), width: "25%" },
                              ]
                            }
                          ],
                        },

                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        {
                          width: "50%",
                          stack: [
                            formatCaja(data.apell1_cer_rep.trim() || " "),
                            { text: "1er Apellido", alignment: "center" },
                            formatCaja(data.nombre1_cer_rep.trim() || " "),
                            { text: "1er Nombre ", alignment: "center" },
                          ],
                        },
                        {
                          width: "50%",
                          margin: [30, 0, 0, 0],
                          stack: [
                            formatCaja(data.apell2_cer_rep.trim() || " "),
                            { text: "2do Apellido", alignment: "center" },
                            formatCaja(data.nombre2_cer_rep.trim() || " "),
                            { text: "2do Nombre ", alignment: "center" },
                          ],
                        },
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        { width: widthTitle, text: "Tipo de Documento" },
                        {
                          fontSize: 7,
                          width: "40%",
                          table: {
                            widths: "11%",
                            body: [
                              [`CC:${condicional(data.tipodoc_cer_rep, "CC")}`,
                              `CE:${condicional(data.tipodoc_cer_rep, "CE")}`,
                              `PA:${condicional(data.tipodoc_cer_rep, "PA")}`,
                              `TI:${condicional(data.tipodoc_cer_rep, "TI")}`,
                              `RC:${condicional(data.tipodoc_cer_rep, "RC")}`,
                              `AS:${condicional(data.tipodoc_cer_rep, "AS")}`,
                              `MS:${condicional(data.tipodoc_cer_rep, "MS")}`,
                              `CD:${condicional(data.tipodoc_cer_rep, "CD")}`,
                              `TR:${condicional(data.tipodoc_cer_rep, "TR")}`
                              ]
                            ]
                          }
                        },
                        formatStr("N° Documento"),
                        formatCuadros(data.docmedico_cer_rep.trim() ? data.docmedico_cer_rep.trim() : " "),
                      ]
                    }
                  ],
                  [
                    {
                      columns: [
                        { width: "55%", text: "" },
                        formatStr("N° de Registro Médico"),
                        formatCuadros(data.regmedico_cer_rep.trim() ? data.regmedico_cer_rep.trim() : " "),
                      ]
                    }
                  ],
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("X. AMPAROS QUE RECLAMA"),
                  [{
                    margin: [0, 2, 0, 3],
                    table: {
                      widths: ["auto", "30%", "30%"],
                      body: [
                        [{ border: [false, false], text: "" }, { text: 'Valor total facturado', alignment: "center" }, { text: 'Valor raclamado al FOSYGA', alignment: "center" }],
                        ['Gastos medicos quirurgicos', data.vlrfact_gm_rep.trim(), data.vlrrecl_gm_rep.trim()],
                        ['Gastos de transporte y movilización de victima', data.vlrfact_gt_rep.trim(), data.vlrrecl_gt_rep.trim()],
                      ]
                    },

                  }],
                  ["El total facturado y reclamado descrito en este númeral se debe detallar y hacer descripción de las actividades, procedimientos,\nmedicamentos, insumos, suministros, materiales, dentro del anexo técnico número 2"]
                ],

              },
            },
            {
              layout: 'noBorders',
              margin: [0, 3, 0, 0],
              table: {
                headerRows: 1,
                widths: ["*"],
                body: [
                  headerTable("XI. DECLARACIONES DE LA INSTITUCION PRESTADORA DE SERVICIOS DE SALUD"),
                  [{ text: "Como representante legal o Gerente de la Institución Prestadora de Servicios de Salud, declaró bajo la gavedad de juramento que toda la información contenidad en este formulario es cierta y podrá se verificada por la Compañía de Seguros, por la Dirección de Administracion de Fondos de la Protección Social o quien haga sus veces, por el Administrador Fiduciario del Fondo de Solidaridad y Garantía Fosyga, por la Superintendencia Nacional de Salud o la Contraloria General de la República de no ser así, acepto todas las consecuencias legales que produzca esta situación. Adicionalmente, manifiesto que la reclamación no ha sido presentada con anterioridad ni se ha recibido pago alguno por las sumas reclamadas", margin: [0, 4, 0, 0] }]
                ],

              },
            },
            {
              margin: [0, 30, 0, 0],
              columns: [

                {
                  width: "50%",
                  stack: [
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 230,
                          y2: 0,
                          lineWidth: 1,
                        },
                      ],
                      alignment: "center",
                    },
                    { text: "NOMBRE", style: "titles" },
                  ],
                },
                {
                  width: "50%",
                  stack: [
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 230,
                          y2: 0,
                          lineWidth: 1,
                        },
                      ],
                      alignment: "center",
                    },
                    { text: "FIRMA DEL REPRESENTATE LEGAL O GERENTE", style: "titles" },
                  ],
                },
              ],
            },
          ]
        }
      ]
    };

    pdfMake.createPdf(dd).open();
    res();
  });
};



const prestacionServicios2 = (data) => {
  return new Promise(res => {
    let margin = {
      left: 30,
      right: 30
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
      pageMargins: [margin.left, 110, margin.right, 60],
      styles: {
        headers: {
          alignment: "center",
          fontSize: 11,
        },
        title: {
          fontSize: 13,
          bold: true
        }
      },
      header: function (currentPage, pageCount, pageSize) {

        return [
          {
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {
                image: data.logo,
                width: 80,
                height: 70
              },
              {
                style: "headers",
                stack: [
                  // "MERAKIDS MEDICAL CENTER S.A.S",
                  // `Nit: `,
                  // "Cr 3",
                  // `Villa - Meta`,
                  { margin: [0, 6, 0, 0], style: "title", text: "CERTIFICACION DE SERVICIOS PRESTADOS" },
                  { margin: [0, 2, 0, 0], style: "title", text: `Nro: ${parseFloat(data.nro_prestacion)}` }
                ]
              }
            ]
          }

        ]
      },
      content: [
        {
          columns: [
            { text: "Yo  ", width: "auto" },
            subrayado(data.nombre_paciente.trim()),
            { text: "con identificación:", width: "auto" },
            { ...subrayado(data.id_paciente.trim()), width: "18%" },
          ]
        },

        { text: ["manifiesto bajo la ", { text: "GRAVEDAD DE JURAMENTO", bold: true }, " que he recibido los servicios prestados por"], margin: [0, 2, 0, 0] },

        {
          margin: [0, 2, 0, 0],
          columns: [

            subrayado(data.nombre_ips.trim()), { text: "el dia ", width: "auto" }, { ...subrayado(data.fecha_atencion.trim()), width: "auto" },
          ]
        },
        // {
        //   margin: [0, 2, 0, 0],
        //   columns: [
        //     { text: "el dia ", width: "auto" },
        //     { ...subrayado(data.fecha_atencion.trim()), width: "auto" },
        //     ""
        //   ]
        // },

        {
          margin: [0, 10, 0, 0],
          text: "Lo anterior dando cumplimiento al numeral 8 del literal A del anexo técnico No 05 de la resolución No 3047 del 14 de agosto del 2008 expedida por el Ministerio de la Protección Social."
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                { text: `Servicio: ${data.servicios[0].nombre_servicio.trim() || ""}\n` },
                { text: `Entidad: ${data.nombre_cliente.trim() || ""}\n` },
                { text: `Autorizacion: ${data.autorizacion.trim() || ""}\n` },
                { text: `Copago/Cuota: ${data.copago || ""}\n` },
              ]
            }]
        },
        {
          margin: [0, 10, 0, 0],
          stack: [
            { margin: [0, 5, 0, 0], text: "Firma:" },
            { columns: [{ width: "40%", text: "Paciente o acudiente:" }, subrayado(" ")] },
            { margin: [0, 4, 0, 0], columns: [{ width: "40%", text: "CC:" }, subrayado(" ")] },
            { margin: [0, 4, 0, 0], columns: [{ width: "40%", text: "Teléfono:" }, subrayado(" ")] },
            { margin: [0, 4, 0, 0], columns: [{ width: "40%", text: "Parentesco:" }, subrayado(" ")] },
            { margin: [0, 4, 0, 0], columns: [{ width: "40%", text: "Dirección:" }, subrayado(" ")] }
          ]
        },

        { text: ["Admisionado por:", (data.elaboro.trim())], margin: [0, 30, 0, 0], fontSize: 8 },

        // {
        //   margin: [0, 10, 0, 0],
        //   text: "Admisionado por:" (data.elaboro.trim())
        // },

      ]

    }
    pdfMake.createPdf(dd).open();
    res();
  })
}
const agenda_medico = (data) => {
  return new Promise(res => {
    const formatFecha = (fecha) => {
      let year = fecha.slice(0, 4); // extraer el año
      let month = fecha.slice(4, 6); // extraer el mes
      let day = fecha.slice(6, 8); // extraer el día
      let fechaFormateada = `${year}/${month}/${day}`; // construir la fecha formateada

      return fechaFormateada
    }
    data.fecha_rep = formatFecha(data.fecha_rep)

    let margin = {
      left: 40,
      right: 40
    };
    var dd = {};

    // Si el id de la empresa es igual a 900108793 entonces muestra el nuevo formato
    if (parseInt(data.id_empr) == 900108793
    ) {
      const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

      let agendamientos = data.agendamientos.map(a => [
        `${a.id_hora}`,
        parseInt(a.id_paciente),
        a.descrip_paciente,
        a.tel_paciente,
        a.desc_servicio + " " + a.primervez,
        { text: a.entidad_paciente, fontSize: 7.8 },
        ""
      ]);


      dd = {
        defaultStyle: {
          fontSize: 9,
        },
        pageOrientation: "landscape",
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
        pageMargins: [margin.left, 100, margin.right, 30],
        header: function (currentPage, pageCount, pageSize) {
          return {
            margin: [margin.left, 20, margin.right, 0],
            columns: [
              {

                image: data.logo,
                width: 80,
                height: 45,
              },
              {
                width: "*",
                alignment: "center",
                fontSize: 10,
                stack: [
                  data.nombre_empr,
                  { margin: [0, 2, 0, 0], text: `Fecha Agenda ${data.fecha_rep}` },
                  { margin: [0, 2, 0, 0], bold: true, text: "Informe Citas Asignadas por Profesional", fontSize: 12 }
                ]
              },


            ]
          }

        },
        content: [
          {
            stack: [
              {
                margin: [0, -10, 0, 0],
                columns: [
                  {
                    text: [{ text: "PROFESIONAL: ", bold: true }, data.profesional_rep]
                  },

                  {

                    text: [{ text: "TOTAL CITAS: ", bold: true }, data.agendamientos.length]
                  },
                ]
              },
              {
                margin: [0, 0, 0, 0],
                text: [{ text: "ESPECIALIDAD: ", bold: true }, data.especialidad_rep]
              },
              // {
              //   margin: [0, 6, 0, 0],
              //   text: [{ text: "SUBESPECIALIDAD: ", bold: true }, ""]
              // },
              // { text: data.fecha_rep, bold: true, margin: [0, 6, 0, 0], }

            ]
          },
          {
            margin: [0, 12, 0, 0],
            table: {
              widths: ["4%", "8%", "15%", "8%", "25%", "20%", "24%"],
              body: [
                [
                  { text: "Hora", bold: true },
                  { text: "Identificación", bold: true },
                  { text: "Paciente", bold: true },
                  { text: "Teléfono", bold: true },
                  { text: "Servicio", bold: true },
                  { text: "Convenio", bold: true },
                  { text: "FIRMA", bold: true },
                ],
                ...agendamientos
              ]
            }
          }
        ]

      }
    } else {


      let agendamientos = []


      data.agendamientos.forEach((a, i) => {
        agendamientos.push([
          i + 1,
          formatFecha(a.fecha),
          a.id_hora,
          a.descrip_paciente,
          a.edad.replace(/\Anos/g, "Años"),
          a.desc_servicio,
          a.consultorio,
          a.entidad_paciente
        ])
      })


      dd = {
        pageMargins: [margin.left, 100, margin.right, 20],
        pageOrientation: "landscape",
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
            fontSize: 10,
            bold: true
          }
        },
        header: function (currentPage, pageCount, pageSize) {
          return [
            {
              margin: [margin.left, 30, margin.right, 0],
              fontSize: 8,
              columns: [
                {
                  image: data.logo,
                  width: 20,
                  height: 25
                },
                {
                  fontSize: 11,
                  margin: [10, 0, 0, 0],
                  stack: [
                    { text: "REPORTE AGENDAMIENTO", style: "title" },
                    `Fecha: ${data.fecha_rep}`,
                    { text: `Profesional:  ${data.profesional_rep}`, margin: [0, 2, 0, 0] },
                  ]
                }

              ]
            }
          ]
        },
        content: [
          {
            // layout: 'lightHorizontalLines',
            fontSize: 9,
            table: {
              headerRows: 1,
              widths: ["3%", "10%", "5%", "*", "10%", "*", "*", "*"],
              body: [
                [
                  { text: 'Item', style: "tableTitle" },
                  { text: 'Fecha', style: "tableTitle" },
                  { text: 'Hora', style: "tableTitle" },
                  { text: "Paciente", style: "tableTitle" },
                  { text: "Edad:", style: "tableTitle" },
                  { text: "Servicio", style: "tableTitle" },
                  { text: "Consultorio", style: "tableTitle" },
                  { text: "Entidad", style: "tableTitle" }],
                ...agendamientos
              ]
            },

          },
        ]
      }
    }



    pdfMake.createPdf(dd).open();
    res();
  })
}

export {
  agenda_medico,
  historiaClinica,
  OrdenMedica,
  consent_infor,
  factura_titan,
  factura_titan2,
  ncredito_titan,

  lecturas_rx,
  notas_rx,
  prestacionServicios,
  prestacionServicios2,
  recordatorioCitas,
  furips,
  incapacidad,
  cons_electromioVeloc,
  cons_anfiltracion,
  compr_prestacionServ,
  cons_infoServicio,
  planillaAtencion,
  atencionDomiciliaria
};

