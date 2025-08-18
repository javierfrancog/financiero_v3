<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-sheep</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >ClonaciÃ³n de NÃ³minas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-card-subtitle
            class="
              subtitle-1
              font-weight-medium
              grey--text
              text--darken-2
              ma-0
              mx-0
            "
            >Origen</v-card-subtitle
          >
        </v-row>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMes_ori"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha_ori"
                  label="Periodo de Origen"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha_ori"
                scrollable
                no-title
                type="month"
                @input="pickerMes_ori = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo_ori"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia_ori"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-divider color="#FF6F00"></v-divider>
        <v-divider color="#FF6F00"></v-divider>

        <v-row>
          <v-card-subtitle
            class="
              subtitle-1
              font-weight-medium
              grey--text
              text--darken-2
              ma-0
              mx-0
            "
            >Destino</v-card-subtitle
          >
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMes_dest"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha_dest"
                  label="Periodo de Destino"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha_dest"
                scrollable
                no-title
                type="month"
                @input="pickerMes_dest = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo_dest"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia_dest"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <v-btn
            color="indigo"
            class="white--text mr-3"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Clonar
            <v-icon right dark>mdi-sheep</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes_ori: false,
      pickerMes_dest: false,
      periodos: [
        { text: "Mensual", value: 1 },
        { text: "1ra Quincena", value: 2 },
        { text: "2da Quincena", value: 3 },
      ],

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Apellido2", align: "left", value: "Apellido2nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Neto", align: "left", value: "netonomina_rep" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      empresa: {},
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        });
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      let fechaori = this.form.fecha_ori ? this.form.fecha_ori.replace(/\-/g, "") : "";
      let periodoori = this.form.periodo_ori.value || "0";
      let agenciaori = this.form.agencia_ori.codigo_agc;
      let fechadest = this.form.fecha_dest ? this.form.fecha_dest.replace(/\-/g, "") : "";
      let periododest = this.form.periodo_dest.value || "0";
      let agenciadest = this.form.agencia_dest.codigo_agc;

      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrClonagth.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaori +
            "|" +
            periodoori +
            "|" +
            agenciaori +
            "|" +
            fechadest +
            "|" +
            periododest +
            "|" +
            agenciadest +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "NÃ³mina clonada correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al clonar NÃ³mina",
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

