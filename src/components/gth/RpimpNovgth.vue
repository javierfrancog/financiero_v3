<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alpha-n-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Novedades de Nómina</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Periodo de Nómina"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @change="cargarcontenido()"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="justify-end">
          <v-btn
            color="success"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="generar_excel"
          >
            Generar EXCEL
            <v-icon right>mdi-file-excel-box</v-icon>
          </v-btn>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              item-key="idnomina_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="orange--text">Base</th> -->
                          <th class="orange--text text-left">Descripción</th>
                          <th class="orange--text text-left">Cantidad</th>
                          <th class="orange--text text-rigth">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="el in item.basesnomina_rep"
                          :key="el.codigo_rep"
                        >
                          <!-- <td>{{ el.codigo_rep }}</td> -->
                          <td class="text-left">{{ el.descripcion_rep }}</td>
                          <td class="text-left">{{ el.cantidad_rep }}</td>
                          <td class="text-center">{{ el.valor_rep }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

              <template v-slot:item.estadobase_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.soporte="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_soporte(item)"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Contrato</span>
                </v-tooltip>
              </template>
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
      pickerMes: false,
      dialogPickerPrest: false,
      pickerInicial: false,
      pickerFinal: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      colaborador: [],
      basesnomina: [],
      tipo_selecc: 0,
      dialogo_novedad: {
        estado: false,
        titulo: null,
        tipo: 0,
        loader: false,
      },
      dialogo_prestamo: {
        estado: false,
        titulo: null,
        tipo: 0,
        loader: false,
      },

      search: "",
      form: {
        consecutivo: null,
        fecha: null,
      },
      headers: [
        { text: "Ver Soporte", value: "soporte", align: "center" },
        { text: "Consecutivo", align: "left", value: "consec_rep" },
        { text: "Colaborador", align: "left", value: "nombrecolabora_rep" },
        { text: "Cargo", align: "left", value: "cargo_rep" },
        { text: "Novedad", align: "left", value: "nombrebase_rep" },
        { text: "Inicio Novedad", align: "left", value: "fechainicio_rep" },
        { text: "Fin Novedad", align: "left", value: "fechafin_rep" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        colabora: false,
        novedad: false,
        fechaini: false,
        fechafin: false,
        fechainidesc: false,
        dias: false,
        valorprest: false,
        tcuotas: false,
        tipoliq: false,
      },

      card_estado: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    this.cargar_empresa();
  },
  methods: {
    generar_excel() {
      var data_parse = this.contenido;
      var periodo = this.form.fecha;
      var columnas = [
        {
          title: "Colaborador",
          value: "nombrecolabora_rep",
          format: "string",
        },
        {
          title: "Cargo",
          value: "cargo_rep",
          format: "string",
        },
        {
          title: "Novedad",
          value: "nombrebase_rep",
          format: "string",
        },
        {
          title: "Inicio Novedad",
          value: "fechainicio_rep",
        },
        {
          title: "Fin Novedad",
          value: "fechafin_rep",
        },
        {
          title: "Cantidad",
          value: "cant_rep",
          format: "number",
        },
        {
          title: "Observaciones",
          value: "Observaciones64",
          format: "string",
        },
      ];

      var header = [
        {
          text: this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        `NIT. ${parseInt(this.empresa.id_empr)}`,
        "REPORTE NOVEDADES DE NOMINA",
        periodo,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Novedades de Nomina",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE NOVEDADES DE NOMINA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    cargar_empresa() {
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
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    get_soporte(item) {
      let empresa = parseFloat(this.empresa.id_empr);
      let consecutivo = item.consec_rep;
      let idFile = empresa + "_NOVEDAD_" + consecutivo + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/GTH/" + idFile;
      window.open(url, "_blank").focus();
    },

    cargarcolaborador() {
      this.loader = true;
      let ano = this.form.fecha.substring(0, 4);
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|" + ano + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },
    format_colabora(val) {
      return `${
        parseInt(val.idcolabora_rep) || 0
      } - ${val.Apellido1colabora_rep.trim()} 
         ${val.nombrescolabora_rep.trim()}`;
    },
    cargarcontenido() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthNovedadJ.DLL",
          data: sessionStorage.Sesion + "|" + periodo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Novedades",
            estado: true,
          });
        });
    },

    init_form() {
      this.form.novedad = null;
      this.form.consecutivo = null;
      this.form.soporte = null;
      this.form.fechaini = null;
      this.form.fechafin = null;
      this.form.dias = null;
      this.form.detalle = null;

      this.errores = {
        codigo: false,
      };
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