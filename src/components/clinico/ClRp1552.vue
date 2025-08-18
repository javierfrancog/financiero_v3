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
                >Reporte Resolución 1552 Cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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

              <v-col class="d-flex" cols="12" sm="3">
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

              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="2"
                v-if="prest_servicios.length != 0"
              >
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="prest_servicios.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <!-- "Cantidad de servicios" = dias maximos de oportunidad a reportar -->
              <v-col class="d-flex mb-4" cols="3">
                <v-text-field
                  label="Cantidad de servicios"
                  v-model="form.dias"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="primeravez"
                  label="Primera Vez"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="nro"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>

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
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      anulados: null,
      form: {
        dias: 0,
      },
      prest_servicios: [],
      headerCsv: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      headers: [
        { text: "TD", align: "center", value: "tipo" },
        { text: "DOCUMENTO", align: "center", value: "identificacion" },
        { text: "PRIMER APELLIDO", align: "center", value: "apellido1" },
        { text: "SEGUNDO APELLIDO", align: "center", value: "apellido2" },
        { text: "PRIMER NOMBRE", align: "center", value: "nombre1" },
        { text: "SEGUNDO NOMBRE", align: "center", value: "nombre2" },
        { text: "DIRECCION", align: "center", value: "direccion" },
        { text: "TELEFONO", align: "center", value: "telefono" },
        { text: "CORREO", align: "center", value: "correo" },
        { text: "F_SOLICITUD", align: "center", value: "f_solicitud" },
        { text: "F_ASIGNACION", align: "center", value: "f_asigna" },
        { text: "F_USUARIO", align: "center", value: "f_usuario" },
        { text: "CUPS", align: "center", value: "cod_servicio" },
        { text: "ESPECIALIDAD", align: "center", value: "especialidad" },
        { text: "NRO_HORAS", align: "center", value: "nro_horas" },
      ],
    };
  },
  created() {
    this.cargarContratos();
  },
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
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "01" + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.prest_servicios;
      var data_parse = [];
      var dato_contrato = this.selectContrato;

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Tipo",
          value: "tipo",
        },
        {
          title: "Dopcumento",
          value: "identificacion",
        },
        {
          title: "Primer Apellido",
          value: "apellido1",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2",
          // format: "fecha",
        },
        {
          title: "Primer Nombre",
          value: "nombre1",
        },
        {
          title: "Segundo Nombre",
          value: "nombre2",
        },
        {
          title: "Dirección",
          value: "direccion",
        },
        {
          title: "Telefono",
          value: "telefono",
        },
        {
          title: "Correo",
          value: "correo",
        },
        {
          title: "Fecha Solicitud",
          value: "f_solicitud",
        },
        {
          title: "Fecha Asignacion",
          value: "f_asigna",
        },
        {
          title: "Dias Oportunidad",
          value: "nro_horas",
        },
        {
          title: "Fecha Usuario",
          value: "f_usuario",
        },
        {
          title: "Dias Usuario",
          value: "dias_usu",
        },
        {
          title: "Cups",
          value: "cod_servicio",
          format: "string",
        },

        {
          title: "Cod.Especialidad",
          value: "cod_espec",
        },

        {
          title: "Especialidad",
          value: "especialidad",
        },
        {
          title: "Cod. Habilitado (Fuera de Resolucion)",
          value: "cod_habilitacion",
        },
        {
          title: "Cod Eps (Fuera de Resolucion)",
          value: "cod_eps",
        },
        {
          title: "Nombre Eps (Fuera de Resolucion)",
          value: "eps_rep",
        },
        {
          title: "Nombre servicio (Fuera de Resolucion)",
          value: "nombreserv_rep",
        },
        {
          title: "Regimen",
          value: "regimen_rep",
        },
      ];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var contrato = this.descripContrato;
      var header_format = [
        { text: "REPORTE RESOLUCION 1552", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Contrato: ${contrato}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte rES 1552",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-RESOLUCION 1552-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultarServicios() {
      let consulta = this.contratos.filter((e) => {
          if (e.nro == this.selectContrato) {
            return e;
          }
        }),
        estado_fecha = this._validarFechas();
      consulta = consulta[0];

      this.headerCsv = [
        "Reporte: , Resolucion 1552," +
          "Contrato: ," +
          this.selectContrato +
          " - " +
          this.descripContrato +
          " , Fecha inicial: ," +
          this.fecha_ini +
          ", Fecha final: , " +
          this.fecha_final.replace(/-/g, "/"),
        "",
      ];
      if (consulta) {
        if (estado_fecha) {
          this.loader = true;
          let dias = this.form.dias;
          let primeravez = this.primeravez ? "1" : "0";

          post
            .postData({
              url: "Clinico/dlls/ClRp1552J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                consulta.nro +
                "|" +
                consulta.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                dias +
                "|" +
                primeravez +
                "|",
              method: "",
            })
            .then((data) => {
              this.loader = false;
              this.prest_servicios = data;
            })
            .catch((err) => {
              console.log(err);
              this.load_contrato = false;
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios",
                estado: true,
              });
            });
        }
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un contrato",
          estado: true,
        });
      }
    },
  },
};
</script>
