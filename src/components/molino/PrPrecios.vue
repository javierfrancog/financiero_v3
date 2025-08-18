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
                >mdi-cash-usd-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue de Precios a Pesajes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  label="Punto de Pesaje"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
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

              <v-col cols="3">
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
                      hide-details
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
              <v-col class="d-flex">
              <v-switch v-model="form.soloptes"
              @change="get_pesaje"              
               label="Solo Pendientes de Precio"></v-switch>              
              </v-col>                            
              <v-col class="d-flex justify-end" cols="8">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="get_pesaje"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
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
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="asignar_precio(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Precio</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf(item)"
                    >
                      <v-icon>mdi-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir PDF</span>
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

    <v-dialog v-model="dialogo.estado" persistent max-width="800px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6" sm="8">
              <v-text-field
                label="Proveedor"
                clearable
                outlined
                type="text"
                required
                v-model="form.precio_proveedor"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Humedad"
                clearable
                outlined
                type="text"
                required
                v-model="form.precio_humedad"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Impureza"
                clearable
                outlined
                type="text"
                required
                v-model="form.precio_impureza"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Grano Partido"
                clearable
                outlined
                type="text"
                required
                v-model="form.precio_gpartido"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Kilos compra"
                clearable
                outlined
                type="text"
                required
                v-model="form.precio_kiloscomp"
                height="60"
                class="inputPesoprec"
                disabled
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Precio x Kilo"
                clearable
                outlined
                type="text"
                required
                v-model="form.precio_precio"
                height="60"
                class="inputPesoprec"
                hide-details
                @input="calcular_carga"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Precio x Carga"
                clearable
                outlined
                required
                disabled
                v-model="form.precio_carga"
                height="60"
                class="inputPesoprec"
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
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style scoped>
.inputPesoprec {
  font-size: 36px !important;
}
</style>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pesajes: [],
      load: {
        btn_enviar: false,
        impresion: false,
      },

      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      prest_facturas: [],
      loader: false,
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
      consecutivo: [],
      contenido: [],
      search: "",
      form: {
        precio_carga: null,
        soloptes: true 
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_pes" },
        { text: "Pesaje", align: "center", value: "nro_pes" },
        { text: "Proveedor", align: "left", value: "nombre_pes" },
        { text: "Placa", align: "center", value: "placa_pes" },
        { text: "Fecha", align: "center", value: "fecha_pes" },
        { text: "Producto", align: "center", value: "producto_pes" },
        { text: "Humedad", align: "center", value: "humedad_pes" },
        { text: "Impureza", align: "center", value: "impureza_pes" },
        { text: "G.Partido", align: "center", value: "gpartido_pes" },
        { text: "K.Compra", align: "center", value: "kcompra_pes" },
        { text: "Vlr_Carga", align: "center", value: "vlrcarga_pes" },
        { text: "Vlr_Total", align: "right", value: "vlrtotal_pes" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
    };
  },
  created() {
    this.cargarTablaAg();
    this.get_empresa();
  },
  computed: {},
  methods: {
    calcular_carga() {
      var precio = this.form.precio_precio;
      var carga = precio * 125;
      console.log(carga)
      this.form.precio_carga = this.formatNumero(carga);
    },
    asignar_precio(item) {
      this.dialogo.estado = true;
      this.form.precio_proveedor = item.nombre_pes;
      this.form.precio_humedad = item.humedad_pes;
      this.form.precio_impureza = item.impureza_pes;
      this.form.precio_gpartido = item.gpartido_pes;
      this.form.precio_kiloscomp = item.kcompra_pes;
      this.form.precio_precio = item.vlrkilo_pes.trim();
      this.consecutivo = item.consecut_pes.trim();      
      this.dialogo.titulo = "Pesaje:" + item.consecut_pes;
    },
    guardar() {
      var data = this.form;
      var precio = data.precio_precio;
      if (!precio) {
        console.log(this.dialogo.titulo);
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var agencia = data.punto_fact.codigo_agc;
      var consecutivo = this.consecutivo.trim();
      var precio = data.precio_precio.replace(/,/g, "").trim();
      let datos = {
        url: "Molinos/dlls/PrLaborat3.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          consecutivo +
          "|" +
          precio +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.form.precio_precio = 0;
          this.form.precio_carga  = 0;
          this.get_pesaje();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    get_pesaje() {
      var $this = this;
      this.contenido = [];      
      var agencia = this.form.punto_fact;
      let soloptes = this.form.soloptes ? "1" : "0"; 
      let fechaini = this.fecha_ini.replace(/\-/g, "");           
      let fechafin = this.fecha_final.replace(/\-/g, "");                 

      if (agencia) {
        this.load.consecutivo = true;
        post
          .postData({
            url: "Molinos/dlls/PrPesajeJ.dll",
            data: sessionStorage.Sesion +
             "|" +
             agencia.codigo_agc +
             "|" +
             "2" +
             "|" +
             soloptes +
             "|" +
             fechaini +
             "|" +
             fechafin +
             "|",
            method: "POST",
          })
          .then((data) => {
            this.load.consecutivo = false;
            let dataParse = JSON.parse(JSON.stringify(data));
            data = dataParse.map((item) => {
              item.registros = item.registros.map(el => {
                item.producto_pes = el.base1_pr ? window.atob(
                  el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() 
                ) : item.producto_pes;
                return el;
              })

              return item
          });
            this.contenido = data;
          })
          .catch((err) => {
            this.load.consecutivo = false;
            console.error("Error: ", err);
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar pesajes: " + err.Mensaje[0].Error,
              estado: true,
            });
          });
      }
    },

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
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
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>

