<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-car-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Vehículos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
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
              item-key="placa"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estadoestud_rep="{ item }">{{
                item.estadoestud_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información General</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-2 ml-1">
                  <v-col class="d-flex" cols="4" sm="2">
                    <v-text-field
                      label="Placa"
                      clearable
                      outlined
                      required
                      v-model="form.placa"
                      :error="errores.placa"
                      @input="errores.placa = false"
                      autocomplete="off"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Automóvil', value: 8 },
                        // { text: 'TractoCamión', value: 1 },
                        // { text: 'Camión', value: 2 },
                        // { text: 'Volqueta', value: 3 },
                        // { text: 'Camioneta', value: 4 },
                        // { text: 'Tractor', value: 5 },
                        // { text: 'Motocarguero', value: 6 },
                        { text: 'Motocicleta', value: 7 },
                      ]"
                      label="Tipo Vehículo"
                      outlined
                      clearable
                      hide-details
                      :error="errores.tipo"
                      @input="errores.tipo = false"
                      v-model="form.tipo"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaReg"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_reg"
                          label="Fecha Registro"
                          append-icon="event"
                          outlined
                          disabled
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_reg"
                        @input="pickerFechaReg = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

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
      dialogo: {
        estado: true,
        titulo: null,
        tipo: null,
      },
      error: {
        rut: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      pickerFechaReg: false,
      pickerFechatec: false,
      pickerFecha: false,
      singleExpand: true,
      expanded: [],
      ruts3: [],
      contenido: [],
      modelo: [],
      agencias: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Placa", align: "left", value: "placa_rep" },
        {
          text: "Tipo",
          align: "left",
          value: "descrtipo_rep",
        },
        { text: "Estado", align: "center", value: "estadoestud_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        tipo: false,
        placa: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      tab: 0,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money: {
        decimal: ".",
        thousands: ",",
        precision: 3,
        masked: false,
      },
      img_actual: null,
      imagenes: [],
      imagenes_src: [],
      pdf: null,
      imagenes_subidas: [],
    };
  },
  created() {
    this.dialogo.estado = false;
    this.cargarcontenido();
  },
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.placa = item.placa_rep;
      this.form.tipo = parseInt(item.tipo_rep) || 0;
      this.form.fecha_reg = item.fechamod_rep;
      this.form.estado = item.estado_rep == "1" ? true : false;
      },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.placa) {
        this.errores.placa = true;
        this.send_error("Debe registrar una placa!");
      } else if (!data.tipo) {
        this.errores.tipo = true;
        this.send_error("Debe seleccionar un tipo de vehiculo!");
      } else {
        let placa = data.placa;
        let tipo = data.tipo;
        let estado = data.estado ? "1" : "0";
        let eliminar = data.eliminar ? "1" : "0";

        let datos = {
          url: "PHorizontal/dlls/Cfvehiculo.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            placa +
            "|" +
            tipo +
            "|" +
            estado +
            "|" +
            eliminar +
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
            this.init_form();
            this.cargarcontenido();
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al grabar Registro");
          });
      }
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
      };
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/CfvehiculoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 7 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
          this.ruts3.pop();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
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
