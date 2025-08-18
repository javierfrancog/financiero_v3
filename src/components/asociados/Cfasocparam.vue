<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-tune</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Parámetros</v-list-item-title
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
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
          <v-row class="px-6 ml-1 mt-2 justify-end">
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Año"
                clearable
                required
                v-model="form.año"
                :error="errores.año"
                @input="errores.año = false"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="6" class="d-flex">
              <v-btn
                class="ma-2 white--text"
                color="red"
                depressed
                large
                text
                @click="
                  dialogo.estado = false;
                  init_form();
                "
                >Cancelar</v-btn
              >
              <v-btn
                class="ma-2 px-4 white--text"
                color="indigo"
                depressed
                large
                @click="guardar()"
                >Guardar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider color="#FF6F00"></v-divider>

        <v-card-text class="pb-0 mb-2">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>General</v-tab>
          </v-tabs>

          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Enero: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura01')"
                      :value="formatNumero(form.usura01)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Febrero: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura02')"
                      :value="formatNumero(form.usura02)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Marzo: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura03')"
                      :value="formatNumero(form.usura03)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Abril: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura04')"
                      :value="formatNumero(form.usura04)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Mayo: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura05')"
                      :value="formatNumero(form.usura05)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Junio: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura06')"
                      :value="formatNumero(form.usura06)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Julio: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura07')"
                      :value="formatNumero(form.usura07)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Agosto: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura08')"
                      :value="formatNumero(form.usura08)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Septiembre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura09')"
                      :value="formatNumero(form.usura09)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Octubre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura10')"
                      :value="formatNumero(form.usura10)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Noviembre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura11')"
                      :value="formatNumero(form.usura11)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Diciembre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Tasa Usura"
                      required
                      @input="input_mask('usura12')"
                      :value="formatNumero(form.usura12)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>
        </v-card-text>
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
      datosctas: [],
      datosctas1: [],
      tablaruts: [],
      productos: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Año", align: "left", value: "ano_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        año: false,
      },
      card_estado: false,
      tab: 0,
      años: [],
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    var ano_actual = new Date().getFullYear();
    this.años.push(ano_actual);
    for (let i = 1; i < 3; i++) this.años.push(ano_actual + i);
    for (let i = 1; i < 3; i++) this.años.unshift(ano_actual - i);

    this.cargarcontenido();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.form.año = item.ano_rep;
      this.form.usura01 = item.usura01_rep.trim();
      this.form.usura02 = item.usura02_rep.trim();
      this.form.usura03 = item.usura03_rep.trim();
      this.form.usura04 = item.usura04_rep.trim();
      this.form.usura05 = item.usura05_rep.trim();
      this.form.usura06 = item.usura06_rep.trim();
      this.form.usura07 = item.usura07_rep.trim();
      this.form.usura08 = item.usura08_rep.trim();
      this.form.usura09 = item.usura09_rep.trim();
      this.form.usura10 = item.usura10_rep.trim();
      this.form.usura11 = item.usura11_rep.trim();
      this.form.usura12 = item.usura12_rep.trim();

      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Parámetros";
      this.dialogo.tipo = 1;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      console.log(data);
      if (!data.año) {
        this.errores.año = true;
        this.send_error("Año Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      let año = data.año;
      let usura01 = data.usura01;
      let usura02 = data.usura02;
      let usura03 = data.usura03;
      let usura04 = data.usura04;
      let usura05 = data.usura05;
      let usura06 = data.usura06;
      let usura07 = data.usura07;
      let usura08 = data.usura08;
      let usura09 = data.usura09;
      let usura10 = data.usura10;
      let usura11 = data.usura11;
      let usura12 = data.usura12;

      var eliminar = data.eliminar ? "1" : "0";
      this.card_estado = true;

      let datos = {
        url: "Asociados/dlls/Cfparam.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          año +
          "|" +
          usura01 +
          "|" +
          usura02 +
          "|" +
          usura03 +
          "|" +
          usura04 +
          "|" +
          usura05 +
          "|" +
          usura06 +
          "|" +
          usura07 +
          "|" +
          usura08 +
          "|" +
          usura09 +
          "|" +
          usura10 +
          "|" +
          usura11 +
          "|" +
          usura12 +
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
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Parametros Año ";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },
    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/CfparamJ.dll",
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
            text: "Error al cargar Parametros",
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
