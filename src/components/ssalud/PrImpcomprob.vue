<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-printer-search</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Recibos de caja y Egresos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col cols="3">
              <v-menu
                v-model="pickerFechaIni"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaIni"
                    label="Fecha Inicial"
                    append-icon="event"
                    hide-details
                    :error="errores.fechaIni"
                    @input="errores.fechaIni = false"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaIni"
                  @input="
                    pickerFechaIni = false;
                    errores.fechaIni = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="3">
              <v-menu
                v-model="pickerFechaFin"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaFin"
                    label="Fecha Final"
                    append-icon="event"
                    hide-details
                    :error="errores.fechafin"
                    @input="errores.fechafin = false"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechafin"
                  @input="
                    pickerFechafin = false;
                    errores.fechafin = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-btn
                color="indigo"
                class="white--text mt-1"
                large
                depressed
                @click="cargarcontenido"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-col>

            <v-col class="d-flex" cols="12" sm="2">
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="contenido_egr.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <div v-if="form.estado" class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="12" class="mt-4">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search_egr"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers_egr"
                  :items="contenido_egr"
                  item-key="consecutivo"
                  :search="search_egr"
                  class="elevation-1"
                >
                  <template v-slot:item.nro_rep="{ item }">
                    {{ parseInt(item.nro_rep) }}
                  </template>

                  <template v-slot:item.estado_rep="{ item }">
                    <v-chip
                      class="white--text"
                      small
                      label
                      :color="`${
                        item.estado_rep == 1 ? 'red' : 'green'
                      } darken-1`"
                      >{{ item.estado_rep == 1 ? "Anulado" : "Activo" }}</v-chip
                    >
                  </template>

                  <template v-slot:item.action="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="blue accent-3"
                          class="mr-2"
                          icon
                          depressed
                          v-on="on"
                          @click="imprimir(item)"
                        >
                          <v-icon>print</v-icon>
                        </v-btn>
                      </template>
                      <span>Imprimir</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="red accent-3"
                          icon
                          depressed
                          v-on="on"
                          @click="anular(item)"
                        >
                          <v-icon>mdi-book-arrow-right-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Anular Comprobante</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
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
import { comprobante_tes } from "../../_formatos.pdf";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      pickerFechaIni: false,
      pickerFechaFin: false,

      tipos: [
        { text: "01 - RPC", value: "001" },
        { text: "02 - Egresos", value: "002" },
      ],
      consecutivos: [],
      tipo: "0",
      numero: "0",

      fechas: [],
      expanded: [],
      contenido_egr: [],
      datosEmpresa: [],
      form: {},

      search_egr: "",
      headers_egr: [
        { text: "", align: "right", value: "data-table-expand" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Descripción", align: "center", value: "descripcion_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Concepto", align: "center", value: "concepto_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", align: "center", value: "action" },
      ],

      errores: {
        fechaIni: false,
        fechaFin: false,
      },

      card_estado: false,
    };
  },
  created() {
    this.form.fechaIni = this.$moment().format("YYYY-MM-DD");
    this.form.fechaFin = this.$moment().format("YYYY-MM-DD");
    this.cargar_empresa();
  },
  methods: {
    imprimir(item) {
      let consecutivo = item.nro_rep;
      let fecha = item.fechares_rep;
      let tipo = 2;
      let agencia = item.agencia_rep;
      var key = tipo + "|" + agencia + "|" + consecutivo + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "clinico/dlls/PrCptesoreria01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let data_impresion = data[0];
          let empresa = this.datosEmpresa;

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: parseInt(empresa.id_empr),
            direccionEmpresa: empresa.direccion_empr,
            telefonoEmpresa: empresa.telefono_empr.trim(),
            ciudadEmpresa: empresa.Ciudad,
            deparEmpresa: empresa.Departamento,
          };
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            comprobante_tes(data_impresion).then((el) => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    anular(item) {
      let consecutivo = item.nro_rep;
      let fecha = item.fechares_rep;
      let tipo = 2;
      let agencia = item.agencia_rep;
      var key = tipo + "|" + agencia + "|" + consecutivo + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "clinico/dlls/PrAnulaCptes.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Anulado",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al Anular el documento");
        });
    },
    async print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido_egr));
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
         copia.valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
       
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fechares_rep",
        },
        {
          title: "Consecutivo",
          value: "nro_rep",
        },
        {
          title: "Valor",
          value: "valor",
          totalsRowFunction: "sum",
        },
        {
          title: "Paciente",
          value: "detalle_rep",
        },

        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Medico",
          value: "descripcion_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaIni;
      var fecha_final = this.form.fechaFin;

      var header_format = [
        { text: "DETALLADO RECAUDOS", bold: true, size: 16 },
        `Periodo: ${fecha_inicial}  ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Detallado Recaudos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `DETALLADO RECAUDOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarcontenido() {
      if (!this.form.fechaIni) {
        this.errores.fechaIni = true;
        this.send_error("Fecha Inicial Obligatoria!");
      } else if (!this.form.fechaFin) {
        this.errores.fechaFin = true;
        this.send_error("Fecha Final Obligatoria!");
      } else {
        this.loader = true;
        let fechaini = this.form.fechaIni.replace(/\-/g, "");
        let fechafin = this.form.fechaFin.replace(/\-/g, "");
        let tipo = 2;
        post
          .postData({
            url: "clinico/dlls/PrCptesoreriaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              tipo +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
            method: "",
          })
          .then((data) => {
            this.contenido_egr = JSON.parse(JSON.stringify(data));
            this.contenido_egr.pop();
            this.loader = false;
            this.form.estado = true;
          })
          .catch((err) => {
            this.loader = false;
            this.form.estado = false;
            this.send_error("Error al cargar Contenido");
          });
      }
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.form.punto_fact = this.datosEmpresa.ptoperfil_empr;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
