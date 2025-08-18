<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-finance </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Cargue Presupuesto</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex justify-end" cols="3">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="clonar_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-sheep</v-icon>Clonar Presupuesto
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="mb-3">
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.periodo_cargue"
                      label="Periodo de cargue"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @change="cargarPeriodos()"
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="cargarPeriodos()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Consultar
                </v-btn>
              </v-col>

              <v-col
                class="d-flex align-center"
                v-if="this.form.periodo_cargue"
              >
                <v-btn
                  color="success"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar
                  <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="false"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.action="{ item }">
                  <v-icon small class="mr-2" @click="editar_item(item)"
                    >edit</v-icon
                  >
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="5">
              <v-autocomplete
                :items="datospresup"
                label="Rubro Presupuestal"
                v-model="form.presup"
                :item-text="format_presup"
                item-value="cod_rep"
                return-object
                hide-details
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Valor"
                clearable
                outlined
                required
                v-money="money0"
                v-model="form.valor"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
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
    <v-dialog v-model="dialogo.clonar" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="pickerPeriodoDest"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.periodo_destino"
                    label="Periodo Destino"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.periodo_destino"
                  type="month"
                  no-title
                  scrollable
                  @input="pickerPeriodoDest = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.clonar = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="clonar()"
            >Clonar</v-btn
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
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      dialogo: {
        estado: false,
        clonar: false,
        titulo: null,
        tipo: null,
      },

      card_estado: false,
      errores: {
        formato: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      dialogPicker: false,
      pickerPeriodoDest: false,
      singleExpand: true,
      pickerPeriodo: false,
      años_select: [],
      datospresup: [],
      tablaruts: [],
      contenido: [],
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      search: "",
      form: {},
      drawer: false,
      headers: [
        { text: "Codigo", align: "center", value: "codcuenta_rep" },
        { text: "Cuenta", align: "left", value: "desccuenta_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Opción", align: "center", value: "action", width: "15%" },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
    };
  },
  created() {
    this.loader = false;
    this.cargarPresup();
  },
  methods: {
    cargarPresup() {
      post
        .postData({
          url: "Phorizontal/dlls/CfCodPresupJ.DLL",
          data: sessionStorage.Sesion + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datospresup = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Presupuesto",
            estado: true,
          });
        });
    },
    editar_item(item) {
      let busqueda = this.datospresup.find(
        (el) => el.cod_rep.trim() == parseFloat(item.codcuenta_rep.trim())
      );
      this.form.presup = busqueda;
      this.form.valor = item.valor_rep.trim();
      this.dialogo.titulo = "Periodo:  " + this.form.periodo_cargue;

      this.dialogo.estado = true;
      this.dialogo.tipo = 1;
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Periodo:  " + this.form.periodo_cargue;
      this.dialogo.estado = true;
      this.form.valor = 0;
      this.form.presup = null;
      this.dialogo.tipo = 0;
    },
    clonar_item() {
      this.form.clonar = 0;
      this.dialogo.titulo = "Clonar Periodo";
      this.dialogo.clonar = true;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };
    },
    cargarPeriodos: function () {
      var periodo = this.form.periodo_cargue.replace(/\-/g, "");

      post
        .postData({
          url: "Phorizontal/dlls//PrPptoJ.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.send_error("Error al cargar Presupeusto");
        });
    },

    clonar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo_cargue) {
        this.errores.periodo_cargue = true;
        this.send_error("Periodo Origen Obligatorio!");
      } else if (!data.periodo_destino) {
        this.errores.formato = true;
        this.send_error("Periodo Destino Obligatorio!");
      } else {
        this.envio_clonar(data);
      }
    },

    envio_clonar(data) {
      this.card_estado = true;
      var origen = this.form.periodo_cargue.replace(/\-/g, "");
      var destino = this.form.periodo_destino.replace(/\-/g, "");

      let datos = {
        url: "Phorizontal/dlls/RpPrevtas02J.dll",
        data: sessionStorage.Sesion + "|" + origen + "|" + destino + "|",
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
          this.dialogo.clonar = false;
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo_cargue) {
        this.errores.periodo_cargue = true;
        this.send_error("Periodo Obligatorio!");
      } else if (!data.presup) {
        this.errores.formato = true;
        this.send_error("Rubro Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },
    format_presup(val) {
      return `${val.descrip_rep}`;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    format_envio(data) {
      this.card_estado = true;
      let send_color = "success";
      var periodo = this.form.periodo_cargue.replace(/\-/g, "");
      var cuenta = data.presup.cod_rep.trim();
      var valor = data.valor.replace(/\,/g, "");
      var eliminar = data.eliminar ? "1" : "0";
      if(eliminar == "1"){
        send_color = "orange";
      }

      let datos = {
        url: "Phorizontal/dlls/PrPpto.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          periodo +
          "|" +
          cuenta +
          "|" +
          valor +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color:send_color,
            text: data[0],
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarPeriodos();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
  },
};
</script>
