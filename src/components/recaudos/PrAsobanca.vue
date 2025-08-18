<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-bank-transfer-out</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generación Asobancaria</v-list-item-title
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
                @click="generar_asobanca"
                >Generar</v-btn
              >
            </v-col>
          </v-card-actions>
        </div>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
            </v-data-table>
          </v-card-text>
          <v-card-text class="pb-0">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />

            <v-data-table
              id="tabla_resumen"
              :headers="headersresumen"
              :items="tablaresumen"
              item-key="cant_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:body.append>
                <tr>
                  <td class="text-right font-weight-medium">Totales:</td>
                  <td class="text-center">{{ cant_resumen }}</td>
                  <td class="text-center">{{ valor_resumen }}</td>
                </tr>
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
      headers: [
        { text: "Usuario", align: "left", value: "cajero_rep".trim() },
        { text: "Hora Envio", align: "left", value: "hora_rep" },
      ],
      headersresumen: [
        { text: "Resumen", align: "left", value: "descripcion_rep".trim() },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
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

    generar_asobanca: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    descargar_plano(codigo) {
      return new Promise((res) => {
        let convenio = this.form.convenio.descrip_rep
          .trim()
          .substr(0, 5)
          .padEnd(5, " ");
        let fecha = this.form.fecha.split("-").join("");
        let hora = this.form.hora.toString().padStart(2, "0");

        let label = "";
        if (convenio.trim() === "ESPG") label = "COTREM";
        else if (convenio.trim() === "LLANO") label = "LLGAS" + "-" + codigo;
        else label = convenio + "-" + codigo;

        let archivo = `${label}-${fecha}-${hora}.txt`;
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
            pom.setAttribute("download", archivo);
            pom.click();
            res();
          });
      });
    },

    descargar_csv() {
      let convenio = this.form.convenio.descrip_rep
        .trim()
        .substr(0, 5)
        .padEnd(5, " ");
      let fecha = this.form.fecha.split("-").join("");
      let hora = this.form.hora.toString().padStart(2, "0");

      let archivo = `${convenio}_${fecha}-${hora}.csv`;
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
          pom.setAttribute("download", archivo);
          pom.click();
        });
    },
    format_envio(data) {
      console.log(data);
      this.card_estado = true;
      var fecha = this.form.fecha.replace(/\-/g, "");
      var convenio = this.form.convenio.cod_rep;
      var hora = this.form.hora;
      let datos = {
        url: "Recaudos/dlls/PrAsobanca.dll",
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
          data.pop();
          this.tablaresumen = data;

          let cantidad = 0;
          data.forEach(
            (el) => (cantidad += parseFloat(el.cant_rep.replace(/\,/g, "")))
          );
          this.cant_resumen = this.formatNumero(cantidad);

          let valor = 0;
          data.forEach(
            (el) => (valor += parseFloat(el.valor_rep.replace(/\,/g, "")))
          );
          this.valor_resumen = this.formatNumero(valor);

          // this.resumen.data = data;

          this.descargar_plano("50001").then(() => {
            let convenio = this.form.convenio;
            if (convenio.cod_rep == "000008220002689") {
              this.descargar_csv();
            } else {
              // this.$emit("snack", {
              //   color: "success",
              //   text: "Registro guardado correctamente",
              //   estado: true,
              // });

            // {
              this.descargar_plano("99999").then(() => {
                this.$emit("snack", {
                  color: "success",
                  text: "Registro guardado correctamente",
                  estado: true,
                });
              });
            }
          });
        })
        .catch((error) => {
          console.log("Error:", error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
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

// <style>
// #tabla_resumen .v-data-table__wrapper td {
//   padding: 3px !important;
// }
// </style>
</script>
