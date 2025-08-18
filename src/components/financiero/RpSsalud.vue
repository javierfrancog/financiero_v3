<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Reportes Super Salud</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/supersalud.png"
                  contain
                  width="150"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMesfin"
              close-on-content-click
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechafin"
                  label="Fecha de Corte"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechafin"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechafin"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechafin = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargarft001"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              FT_001
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              color="primary"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargarft003"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              FT_003
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              color="primary"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargarft004"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              FT_004
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              color="primary"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargarft025"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              FT_025
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
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
      pickerMesfin: false,
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
      contenido: [],
      anexos: [],
      search: "",
      form: {},
      headers: [],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        fechafin: false,
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
    };
  },
  created() {
    this.get_empresa();
  },
  computed: {},
  methods: {
    get_empresa() {
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

    cargarft001() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpFt001J.dll",
            data: sessionStorage.Sesion + "|" + fechafin + "|",
            method: "",
          })
          .then((data) => {
            let archivo = data[0].url;
            var formData = new FormData();
            formData.append("ruta", archivo.trim());

            fetch("https://server1ts.net//financiero/inc/get.plano.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((result) => {
                var xmlContent = result;
                var blob = new Blob([xmlContent], {
                  type: "text/xml",
                });
                var url = URL.createObjectURL(blob);
                var pom = document.createElement("a");
                let idempresa = parseFloat(this.empresa.id_empr);
                let dv = parseFloat(this.empresa.dv_empr);
                let nombre_xml = "" + idempresa + dv + "812024" + "FT001"
                
                pom.href = url;
                pom.setAttribute("download", nombre_xml);
                pom.click();
                this.loader = false;
              });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al generar FT001",
              estado: true,
            });
          });
      }
    },

    cargarft003() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpFt003J.dll",
            data: sessionStorage.Sesion + "|" + fechafin + "|",
            method: "",
          })
          .then((data) => {
            let archivo = data[0].url;
            var formData = new FormData();
            formData.append("ruta", archivo.trim());

            fetch("https://server1ts.net//financiero/inc/get.plano.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((result) => {
                var xmlContent = result;
                var blob = new Blob([xmlContent], {
                  type: "text/xml",
                });
                var url = URL.createObjectURL(blob);
                var pom = document.createElement("a");
                pom.href = url;
                pom.setAttribute("download", "FT003.xml");
                pom.click();
                this.loader = false;
              });
          })
          .catch((err) => {
            this.loader = false;
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al generar FT003",
              estado: true,
            });
          });
      }
    },

    cargarft004() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpFt004J.dll",
            data: sessionStorage.Sesion + "|" + fechafin + "|",
            method: "",
          })
          .then((data) => {
            let archivo = data[0].url;
            var formData = new FormData();
            formData.append("ruta", archivo.trim());

            fetch("https://server1ts.net//financiero/inc/get.plano.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((result) => {
                var xmlContent = result;
                var blob = new Blob([xmlContent], {
                  type: "text/xml",
                });
                var url = URL.createObjectURL(blob);
                var pom = document.createElement("a");
                pom.href = url;
                pom.setAttribute("download", "FT004.xml");
                pom.click();
                this.loader = false;
              });
          })
          .catch((err) => {
            this.loader = false;
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al generar FT004",
              estado: true,
            });
          });
      }
    },

    cargarft025() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpFt025J.dll",
            data: sessionStorage.Sesion + "|" + fechafin + "|",
            method: "",
          })
          .then((data) => {
            let archivo = data[0].url;
            var formData = new FormData();
            formData.append("ruta", archivo.trim());

            fetch("https://server1ts.net//financiero/inc/get.plano.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((result) => {
                var xmlContent = result;
                var blob = new Blob([xmlContent], {
                  type: "text/xml",
                });
                var url = URL.createObjectURL(blob);
                var pom = document.createElement("a");
                pom.href = url;
                pom.setAttribute("download", "FT025.xml");
                pom.click();
                this.loader = false;
              });
          })
          .catch((err) => {
            this.loader = false;
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al generar FT025",
              estado: true,
            });
          });
      }
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