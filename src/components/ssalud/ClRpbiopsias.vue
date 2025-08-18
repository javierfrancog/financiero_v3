<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-microscope</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Reporte Biopsias</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.fechaInicial" @input="pickeFechaIni = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFechaFin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.fechaFinal" @input="pickeFechaFin = false"></v-date-picker>
                </v-menu>
              </v-col>

            </v-row>

            <v-row class="justify-end">
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="generar_excel()"
                :disabled="contenido.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
              <v-btn
                color="blue"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="cargarcontenido"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
              :search="search"
            >
              <template v-slot:item.paciente="{ item }">
                {{ item.apellido1_rep.trim() + ' ' +  item.nombre1_rep.trim() }}
              </template>
              <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep">{{item.codcta_rep}} - {{item.descripcta_rep}}</label>
              </template>
              <template v-slot:item.docinter_rep="{ item }">
                <v-btn
                  depressed
                  small
                  rounded
                  color="primary"
                  outlined
                  v-if="item.descripcta_rep"
                  @click="reimprimir(item)"
                >{{item.docinter_rep}}</v-btn>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <table id="pdf_header_comp">
        <thead>
          <tr>
            <th>
              <img class="logo" :src="logoSrc" />
            </th>
            <th>
              <a class="nombre_print"></a>
              <br />Nit
              <a class="nit_print"></a>
            </th>
            <th colspan="5">
              <b class="nombredoc_print"></b>
              <br />
              <b>
                Número:
                <a class="consecutivo_print"></a>
              </b>
              <br />
              <b>Fecha:</b>
              <a class="fecha_print"></a>
              <br />
            </th>
          </tr>
        </thead>
      </table>
      <table id="pdf_body_comp">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cuenta</th>
            <th>Rut</th>
            <th>Documento</th>
            <th>c. costo</th>
            <th>Débito</th>
            <th>Crédito</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr style="border-top: 1px solid;">
            <td colspan="5" style="padding-bottom: 40px">
              <b>TOTALES:</b>
            </td>
            <td style="padding-bottom: 40px;">
              <b class="total_debito"></b>
            </td>
            <td style="padding-bottom: 40px;">
              <b class="total_credito"></b>
            </td>
            <td style="padding-bottom: 40px;"></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <b>Revisó:</b>
            </td>
            <td colspan="2">
              <b>Generó:</b>
              <br />
              <a class="impreso_print"></a>
              <br />
              <a class="fechagen_print"></a>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner
  },
  data() {
    return {
      agencias: [],
      empresa: [],
      pickeFechaIni: false,
      pickeFechaFin: false,      
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      search: "",
      form: {
        cuenta: null,
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),        

      },
      headers: [
        { text: "Entidad", align: "center", value: "descripent_rep" },
        { text: "Identificación", align: "center", value: "idpaciente_rep"},        
        { text: "Paciente", align: "left", value: "paciente" },        
        { text: "Fecha Servicio", align: "center", value: "fechaserv_rep" },
        { text: "Estudio", align: "center", value: "descservicio_rep" }
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false
      },
      card: {
        loader: false,
        disabled: false
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png"
    };
  },
  created() {
    this.get_empresa();
  },
  methods: {
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];

      var columnas = [
        {
          title: "ENTIDAD",
          value: "descripent_rep",
        },
        {
          title: "DEPARTAMENTO",
          value: "departamento_rep",
        },
        {
          title: "MUNICIPIO",
          value: "ciudad_rep",
        },
        {
          title: "IPS",
          value: "razonsocial_rep",
        },
        {
          title: "CODIGO HABILITACION",
          value: "codips_rep",
          format: "string",          
        },
        {
          title: "NIT",
          value: "idips_rep",
          format: "number"
        },
 
        {
          title: "TIPO DOCUMENTO",
          value: "tipoid_rep",
        },
        {
          title: "DOCUMENTO",
          value: "idpaciente_rep",
          format: "number"
        },
        {
          title: "PRIMER APELLIDO",
          value: "apellido1_rep",
        },
        {
          title: "SEGUNDO APELLIDO",
          value: "apellido2_rep",
        },
        {
          title: "PRIMER NOMBRE",
          value: "nombre1_rep",
        },
        {
          title: "SEGUNDO NOMBRE",
          value: "nombre2_rep",
        },
        {
          title: "FECHA NACIMIENTO",
          value: "fechanac_rep",
          format: "fecha",          
        },
        {
          title: "FECHA ESTUDIO",
          value: "fechaserv_rep",
          format: "fecha",          
        },
        {
          title: "ESTUDIO",
          value: "descservicio_rep",
        },
      ];

      data.forEach((el, index)=>{

          data_parse.push({
            descripent_rep: (el.descripent_rep === undefined)?"":el.descripent_rep.trim(),
            departamento_rep: (el.departamento_rep === undefined)?"":el.departamento_rep.trim(),
            ciudad_rep: (el.ciudad_rep === undefined)?"":el.ciudad_rep.trim(),            
            razonsocial_rep: (el.razonsocial_rep === undefined)?"":el.razonsocial_rep.trim(),            
            codips_rep: (el.codips_rep === undefined)?"":el.codips_rep.trim(),            
            idips_rep: (el.idips_rep === undefined)?"":el.idips_rep.trim(),            
            tipoid_rep: (el.tipoid_rep === undefined)?"":el.tipoid_rep.trim(),            
            idpaciente_rep: (el.idpaciente_rep === undefined)?"":el.idpaciente_rep.trim(),            
            apellido1_rep: (el.apellido1_rep === undefined)?"":el.apellido1_rep.trim(),            
            apellido2_rep: (el.apellido2_rep === undefined)?"":el.apellido2_rep.trim(),                        
            nombre1_rep: (el.nombre1_rep === undefined)?"":el.nombre1_rep.trim(),                                    
            nombre2_rep: (el.nombre2_rep === undefined)?"":el.nombre2_rep.trim(),                                    
            fechanac_rep: (el.fechanac_rep === undefined)?"":el.fechanac_rep.trim(),                                    
            fechaserv_rep: (el.fechaserv_rep === undefined)?"":el.fechaserv_rep.trim(),                                                            
            descservicio_rep: (el.descservicio_rep === undefined)?"":el.descservicio_rep.trim(),                                    
          });
      });
      data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        "Reporte de Biopsias".toUpperCase(),
        "Fecha Inicial: " + this.form.fechaInicial,
        "Fecha Final: " + this.form.fechaFinal,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte de Biopsias",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `BIOPSIAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    generar_pdf() {
      var _this = this;
      var contenido = this.contenido;
      var datosTabla = [];
      var totalSaldo = 0;
      var rut = "";
      var subTotal = 0;
      var poneSubTot = false;

      contenido.forEach((el, index)=>{
        if (el.rut_rep != undefined && el.saldo_rep != undefined){
          totalSaldo += (el.saldo_rep === undefined)?0:parseFloat(el.saldo_rep.replace(/\,/g, "").replace(/\ /g, ""));
          
          if (rut === el.rut_rep){
            poneSubTot = false;
          }else{
            if (index > 0){
              poneSubTot = true;
            }
            rut = el.rut_rep;
          }

          if (poneSubTot){
            datosTabla.push([
              {},
              {},
              {},
              {
                fontSize: 10,
                colSpan: 2,
                bold: true,
                text: "Subtotal".toUpperCase(),
              },
              {},
              {
                fontSize: 10,
                bold: true,
                alignment: "right",
                text: _this.formatNumero(subTotal),
              },
            ]);
            subTotal = 0;
          }
          subTotal += (el.saldo_rep === undefined)?0:parseFloat(el.saldo_rep.replace(/\,/g, "").replace(/\ /g, ""));

          datosTabla.push([
            {
              fontSize: 8,
              alignment: "left",
              text: (el.descriprut_rep === undefined)?"":el.descriprut_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "right",
              text: (el.docexter_rep === undefined)?"":el.docexter_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "center",
              text: (el.fecha_rep === undefined)?"":el.fecha_rep,
            },
            {
              fontSize: 8,
              alignment: "right",
              text: (el.diasvenc_rep === undefined)?"":el.diasvenc_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "right",
              text: (el.diasxvenc_rep === undefined)?"":el.diasxvenc_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "right",
              text: (el.saldo_rep === undefined)?"":el.saldo_rep.replace(/\ /g, ""),
            },
          ]);
        }
      });

      datosTabla.push([
        {},
        {},
        {},
        {
          fontSize: 10,
          colSpan: 2,
          bold: true,
          text: "Total Proveedores".toUpperCase(),
        },
        {},
        {
          fontSize: 10,
          bold: true,
          alignment: "right",
          text: _this.formatNumero(totalSaldo),
        },
      ]);

      datosTabla.unshift([
        {
          fontSize: 10,
          text: "Proveedor",
        },
        {
          fontSize: 10,
          text: "Factura",
        },
        {
          fontSize: 10,
          text: "Fecha factura",
        },
        {
          fontSize: 10,
          text: "Días vencido",
        },
        {
          fontSize: 10,
          text: "Días por vencer",
        },
        {
          fontSize: 10,
          text: "Valor Saldo",
        },
      ]);

      var margin = {
        left: 40,
        right: 40,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var dd = {
          //pageOrientation: "landscape",
          pageMargins: [margin.left, 100, margin.right, 60],
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
                    width: "50%",
                    bold: true,
                    fontSize: 11,
                    stack: [
                      _this.empresa.descrip_empr,
                      `NIT. ${_this.formatNumero(parseInt(_this.empresa.id_empr.replace(/\,/g, "")))}`,
                      `Dir. ${_this.empresa.direccion_empr}`,
                      `Tel. ${_this.empresa.telefono_empr}`,
                      `${_this.empresa.Ciudad} - ${_this.empresa.Departamento}`
                    ],
                  },
                  {
                    width: "30%",
                    bold: true,
                    fontSize: 11,
                    alignment: "center",
                    stack: [
                      "Reporte de proveedores".toUpperCase(),
                      "Fecha corte: " + _this.form.fechaInicial,
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
                widths: [
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
          ],
          styles: {},
          images: {
            logo: logo,
          },
        };

        pdfMake.createPdf(dd).open();
      });
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    reimprimir(item) {
      this.card.loader = true;
      this.card.disabled = true;

      var documento = item.docinter_rep.substring(0, 7);
      var consecutivo = item.docinter_rep.substring(7);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        documento +
        "|" +
        consecutivo +
        "|" +
        item.fecha_rep +
        "|";

      post
        .postData({
          url: "Financiero/dlls/PrRegcontJ.dll",
          data: datosEnvio,
          method: ""
        })
        .then(data => {
          this.format_imprimir(data);
        })
        .catch(err => {
          this.card.loader = false;
          this.card.disabled = false;
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    format_imprimir(data) {
      data = data[0];
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        try {
          if (val == "registros") {
            var parent = document
              .getElementById("pdf_body_comp")
              .getElementsByTagName("tbody")[0];

            var registros = data[val];
            var debitos = 0;
            var creditos = 0;

            registros.forEach(item => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              row.insertCell(0).appendChild(document.createTextNode(item.item));
              row
                .insertCell(1)
                .appendChild(document.createTextNode(item.cuenta));
              row.insertCell(2).appendChild(document.createTextNode(item.rut));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.nroext));
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.ccosto));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.debito));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.credito));
              row
                .insertCell(7)
                .appendChild(document.createTextNode(item.detalle));

              debitos += parseFloat(item.debito.replace(/\,/g, "")) || 0;
              creditos += parseFloat(item.credito.replace(/\,/g, "")) || 0;
            });

            document.getElementsByClassName("total_debito")[0].innerHTML +=
              " " + this.formatNumero(debitos.toFixed(2));

            document.getElementsByClassName("total_credito")[0].innerHTML +=
              " " + this.formatNumero(creditos.toFixed(2));
          } else {
            var el = val + "_print";
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          console.error(`Parametro: ${val} - Error`, error);
        }
      });

      imprimir_pdf();
      this.card.loader = false;
      this.card.disabled = false;
    },
    cargarcontenido() {
      var data = this.form;

      if (!data.fechaInicial) {
        this.send_error("Selecciona una fecha Inicial");
      } else if (!data.fechaFinal) {
        this.send_error("Selecciona fecha Final");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;
        var sesion = sessionStorage.Sesion;
        var fechaini = data.fechaInicial.replace(/\-/g, "");        
        var fechafin = data.fechaFinal.replace(/\-/g, "");                
        var datosEnvio =
          sesion +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          "1" +
          "|" +          
          "|";
        post
          .postData({
            url: "Clinico/dlls/ClRpmamografiasJ.DLL",
            data: datosEnvio,
            method: ""
          })
          .then(data => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
           this.contenido = data;
          })
          .catch(err => {
            console.log(err)
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte");
          });
      }
    },

    formatNumero: function(val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: "."
      });

      mask.resolve(val.toString());
      return mask.value;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true
      });
    }
  }
};

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_print")[0].innerHTML = "";
  document.getElementsByClassName("nombredoc_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_print")[0].innerHTML = "";
  document.getElementsByClassName("consecutivo_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_print")[0].innerHTML = "";
  document.getElementsByClassName("total_debito")[0].innerHTML = "";
  document.getElementsByClassName("total_credito")[0].innerHTML = "";
  document.getElementsByClassName("impreso_print")[0].innerHTML = "";
  document.getElementsByClassName("fechagen_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body_comp")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}
</script>
