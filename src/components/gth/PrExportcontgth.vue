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
              <v-icon size="30" color="blue darken-4 "
                >mdi-transfer-down</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Exportar Contabilización Nómina</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Periodo Registro"
                      outlined
                      v-model="form.fecha"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    type="month"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col sm="4" cols="12">
                <v-select
                  :items="[{ text: 'Prosoft_VRM', value: 1 }]"
                  label="Formato"
                  outlined
                  hide-details
                  v-model="form.origen"
                ></v-select>
              </v-col>

              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="generar_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Generar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
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
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Numero Inicial"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.inicial"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Numero Final"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.final"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="eliminar_facturas()"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  FlowerSpinner,

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
      dialog: true,

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
      },

      card_estado: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      detalle: [],
      adjunto: null,
      card: {
        loader: false,
        disabled: false,
      },
      headers: [
        { text: "Descripcion", align: "left", value: "error_rep" },
        { text: "Base", align: "left", value: "base_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1_rep" },
        { text: "Nombre", align: "left", value: "nombres_rep" },
      ],
    };
  },
  created() {
    this.form = {
      fecha: this.$moment().format("YYYY-MM"),
    };
    this.cargarTablaAg();
  },
  methods: {
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },

    generar_archivo: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let origen = this.form.origen;

      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (!origen) {
        this.send_error("Debe Seleccionar el formato!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.loader = true;
      this.card_estado = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let formato = this.form.origen;
      let datos = {
        url: "Financiero/dlls/PrExportcontgth.dll",
        data: sessionStorage.Sesion + "|" + fecha + "|" + formato + "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader = false;
          let archivo = `NOMINA-${fecha}.csv`;
          let nom_plano = `D:\\TITAN\\TMP\\${archivo}`;
          var formData = new FormData();
          formData.append("ruta", nom_plano);

          fetch("https://server1ts.net//financiero/inc/get.plano.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((result) => {
              var csvContent = result;
              var blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              var url = URL.createObjectURL(blob);
              var pom = document.createElement("a");
              pom.href = url;
              pom.setAttribute("download", "MOVIM.CSV");
              pom.click();
              res();
            });
        })
        .catch((error) => {
          this.loader = false;
          console.log("Error:", error);
          this.send_error("Error al generar archivo");
        });
    },

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

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
  },
};
</script>
