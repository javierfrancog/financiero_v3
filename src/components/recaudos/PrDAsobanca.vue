<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-upload-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Desmarcar Asobancaria</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickerFecha"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha"
                      label="Fecha"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fecha"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="pickerFecha = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="5">
                <v-autocomplete
                  label="Convenio"
                  v-model="form.convenio"
                  :items="convenios"
                  :item-text="format_convenios"
                  item-value="cod_rep"
                  hide-details
                  clearable
                  return-object
                  outlined
                  @change="
                    errores.convenio = false;
                    get_imagen();
                  "
                  :error="errores.convenioman2"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="[
                    { text: '9:00 am', value: 1 },
                    { text: '12:00 m', value: 2 },
                    { text: '3:00 pm', value: 3 },
                    { text: '6:00 pm', value: 4 },
                  ]"
                  label="Hora Envio"
                  outlined
                  clearable
                  hide-details
                  v-model="form.hora"
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="imagen">
              <v-col class="d-flex align-center justify-center">
                <v-img width="120" height="120" contain :src="imagen" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-col class="d-flex align-center justify-center">
              <v-btn
                class="ma-2 px-4"
                color="success"
                depressed
                large
                @click="consultar_asobanca"
                >Consultar</v-btn
              >
            </v-col>
          </v-card-actions>
        </div>
        <div class="pa-0 px-8">
          <v-card-text class="pb-0">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />

            <v-data-table
              id="tabla_resumen"
              :headers="headersresumen"
              :items="contenido"
              item-key="cant_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="desmarcar_asobanca(item)"
                      :color="`red`"
                      fab
                      small
                      icon
                      v-on="on"
                      outlined
                    >
                      <v-icon>{{ "mdi-alarm-note-off" }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ "Desmarcar Asobancaria" }}</span>
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
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaresumen: [],
      convenios: [],
      ptosrecaudo: [],
      valor_resumen: 0,
      cant_resumen: 0,
      pickerFecha: false,
      search: "",
      puntos: "",
      imagen: null,

      form: {},
      headersresumen: [
        { text: "Hora Generación", align: "left", value: "hora_rep".trim() },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.consultar_convenios();
    (this.form.fecha = this.$moment().format("YYYY-MM-DD")),
      (this.dialogo.estado = false);
  },
  computed: {},
  methods: {
    get_imagen() {
      let convenio = this.form.convenio;
      if (convenio) {
        let url = `https://titansoluciones.cloud/img/${parseInt(
          convenio.cod_rep
        )}.png`;
        this.imagen = url;
      } else {
        this.imagen = null;
      }
    },
    consultar_convenios() {
      this.loader = true;
      let data = [sessionStorage.Sesion, 1];
      this.postData({
        url: "Recaudos/dlls/CfConveniorcJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.convenios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },
    format_convenios(val) {
      return `${parseInt(val.cod_rep) || 0} - ${val.descrip_rep.trim()}`;
    },

    consultar_asobanca: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else {
        this.format_consulta(data);
      }
    },
    format_consulta(data) {
      this.card_estado = true;
      var fecha = this.form.fecha.replace(/\-/g, "");
      var convenio = this.form.convenio.cod_rep;
      var hora = this.form.hora;
      this.contenido = [];

      let datos = {
        url: "Recaudos/dlls/PrDAsobancaJ.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          convenio +
          "|" +
          hora +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          data.pop();
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((error) => {
          console.log(error[0]);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: error.Mensaje[0].msg,
            estado: true,
          });
        });
    },

    desmarcar_asobanca: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var fecha = this.form.fecha.replace(/\-/g, "");
      var convenio = this.form.convenio.cod_rep;
      var hora = this.form.hora;
      let datos = {
        url: "Recaudos/dlls/PrDAsobanca.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          convenio +
          "|" +
          hora +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = [];
          this.$emit("snack", {
            color: "success",
            text: data[0].msg,
            estado: true,
          });
        })
        .catch((error) => {
          console.log(error[0]);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: error.Mensaje[0].msg,
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
