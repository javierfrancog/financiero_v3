<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-cash-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Formulario 350 Retención en la Fuente</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
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
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="cargarPeriodos()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="form.anterior"
                  hide-details
                  label="Clonar Año Anterior"
                ></v-switch>
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
                <template v-slot:item.edit="{ item }">
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

    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
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
        titulo: null,
        tipo: null,
      },
      card_estado: false,
      errores: {
        codigo: false,
        estado: false,
        anoselect: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      // periodo_cargue: this.$moment().format("YYYY"),
      contenido: [],
      search: "",
      form: {},
      drawer: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Renglón", align: "left", value: "renglon_for" },
        { text: "Descripcion", align: "left", value: "descripcion_for" },
        // { text: "Opciones", value: "edit", align: "center" },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
    };
  },
  created() {
    this.cargar_años();

    this.loader = false;
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;

      this.form.periodo_cargue = anioActual;
    },
    agregar_item() {
      // this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    editar_item(data) {
      this.dialogo.estado = true;
      this.dialogo.titulo =
        "Modificar Registro " + data.descripcion_for.trim();
      this.form.codigo = data.renglon_for;
      this.form.descripcion = data.descripcion_for.trim();
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };
    },
    cargarPeriodos: function () {
      var fecha = this.form.periodo_cargue;
      var clonar = this.form.anterior ? "1" : "0";
      post
        .postData({
          url: "Financiero/dlls//CfFrDianJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            350 +
            "|" +
            fecha +
            "|" +
            clonar +
            "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));
          this.form.anterior = false;
        })
        .catch((err) => {
          this.send_error("Error al cargar Formulario");
        });
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
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

    format_envio(data) {
      this.card_estado = true;
      var periodo = this.form.periodo_cargue;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/CfFRDian.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          350 +
          "|" +
          periodo +
          "|" +
          codigo +
          "|" +
          descripcion +
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
          this.cargar_años();
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
