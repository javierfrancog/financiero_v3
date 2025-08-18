<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cart-arrow-right</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Resolución 256</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
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
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="5">
                <v-select
                  label="Oportunidad en Citas -Consultas-"
                  :items="oportunidad"
                  clearable
                  hide-details
                  return-object
                  v-model="form.oportunidad"
                  item-text="text"
                  item-value="value"
                  @change="errores.oportunidad = false"
                  :error="errores.oportunidad"
                ></v-select>
              </v-col>
              <v-col class="mb-4" cols="3">
                <v-btn
                  color="indigo"
                  class="white--text ml-5 mt-3"
                  large
                  @click="generar_reporte"
                >
                  Consultar Reporte
                  <v-icon right>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="3">
                <v-btn
                  color="success"
                  class="white--text ml-5 mt-3"
                  large
                  @click="excel_formato2"
                >
                  Generar Reporte
                  <v-icon right>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
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

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-card-text>
              <v-data-table
                :headers="headers_tabla"
                :items="contenido"
                item-key="index"
                :search="search"
                disable-pagination
              >
              </v-data-table>
            </v-card-text>
          </v-row>
        </div>
      </v-card>

      <!-- <div id="downloadPdf">
        <div id="cargando_pdf">
          <h3>Cargando impresión...</h3>
        </div>
        <table id="download_pdf_header">
          <thead>
            <tr>
              <th>
                <img
                  class="logo"
                  src="https://server1ts.net/datos/image/clientes/901099286.png"
                />
              </th>
              <th>
                <a id="tipo_reporte"></a>
              </th>
              <th>
                <a id="fecha_ini_reporte"></a>
                <br />
                <a id="fecha_fin_reporte"></a>
                <br />
              </th>
            </tr>
          </thead>
        </table>
        <table id="download_pdf_body">
          <thead>
            <tr>
              <th>Prefijo</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div> -->
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";


export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      load_table: false,
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      contenido: [],
      datos256: [],
      errores: {
        oportunidad: false,
      },
      form: {},
      oportunidad: [
        { text: "Primera Vez Medicina General", value: 1 },
        { text: "Primera Vez Odontologia General", value: 2 },
        { text: "Primera Vez Medicina Interna", value: 3 },
        { text: "Primera Vez Pediatria", value: 4 },
        { text: "Primera Vez Ginecologia", value: 5 },
        { text: "Primera Vez Obstetricia", value: 6 },
        { text: "Primera Vez Cirugia General", value: 7 },
        { text: "Primera Vez Ecografias", value: 8 },
        { text: "Primera Vez Resonancia Magnetica", value: 9 },
        { text: "Todos los Servicios", value: 999 },
      ],
      headers: [
        { text: "DOMINIO", align: "center", value: "dominio256" },
        { text: "CODIGO", align: "center", value: "codigo256" },
        { text: "NOMBRE INDICADOR", align: "center", value: "n_indicador256" },
        { text: "NUMERADOR", align: "center", value: "numerador256" },
        { text: "DENOMINADOR", align: "center", value: "denominador256" },
        { text: "RESULTADO INDICADOR", align: "center", value: "resultado256" },
      ],
      headers_tabla: [
        { text: "Codigo", align: "center", value: "codigo256" },
        { text: "Descripción", align: "left", value: "descripcion256" },
        { text: "Cantidad", align: "center", value: "cantidad256" },
      ],
    };
  },
  created() {},
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
    fecha_ini() {
      this.fecha_final = this.fecha_ini;
    },
  },
  methods: {
    generar_reporte() {
      if (!this.form.oportunidad) {
        this.errores.oportunidad = true;
        this.alerta_error("Debes seleccionar un Servicio");
      } else {
        let tipo = this.form.oportunidad.value;
        let estado_fecha = this._validarFechas();
        if (estado_fecha) {
          this.loader = true;
          post
            .postData({
              url: "Clinico/dlls/ClRp256F2J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                tipo +
                "|",
              method: "",
            })
            .then((data) => {
              data.pop();
              this.contenido = data;
              this.datos256 = data;
              this.loader = false;
            })
            .catch((err) => {
              console.log(err);
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Sin Datos para Reportar",
                estado: true,
              });
            });
        }
      }
    },
    excel_formato2(data) {
      let seleccion = this.form.oportunidad.text;

      var data_parse = this.datos256;
      data_parse = data_parse.map((el) => {
        el.edad_rep = el.edad_rep.replace(/\Anos/g, "Años");

        return el;
      });

      var columnas = [
        {
          title: "Tipo Registro",
          value: "tipo_rep",
        },
        {
          title: "Consecutivo",
          value: "consecutivo_rep",
        },
        {
          title: "Tipo de identificación del usuario",
          value: "tipoid_rep",
        },
        {
          title: "Número de identificación del usuario",
          value: "idpaciente_rep",
        },
        {
          title: "Fecha de nacimiento del usuario",
          value: "fechanacim_rep",
          format: "string",
        },
        {
          title: "Edad",
          value: "edad_rep",
          format: "string",
        },
        {
          title: "Sexo del usuario",
          value: "sexo_rep",
        },
        {
          title: "Primer apellido del usuario",
          value: "apellido1_rep",
        },
        {
          title: "Segundo apellido del usuario",
          value: "apellido2_rep",
        },
        {
          title: "Primer nombre del usuario",
          value: "nombre1_rep",
        },
        {
          title: "Segundo nombre del usuario",
          value: "nombre2_rep",
        },
        {
          title: "Código de la EAPB del usuario",
          value: "eps_rep",
        },
        {
          title:
            "Identificación del tipo de cita o procedimiento no quirúrgico",
          value: "idcita_rep",
          format: "string",
        },
        {
          title: "Fecha de la solicitud de la cita",
          value: "fechasolic_rep",
          format: "string",
        },
        {
          title: "La cita fue asignada",
          value: "citasigna_rep",
        },
        {
          title: "Fecha de la asignación de la cita",
          value: "fechacita_rep",
          format: "string",
        },
        {
          title:
            "Fecha para la cual el usuario solicitó que le fuera asignada la cita (fecha deseada)",
          value: "fecharequerida_rep",
          format: "string",
        },
        {
          title: "Servicio",
          value: "descripcion256",
          format: "string",
        },
      ];

      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var header_format = [
        { text: `"REPORTE 256 FORMATO " ${seleccion}`, bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: seleccion,
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REP256_FORMATO_2_${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    alerta_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
  },
};
</script>
