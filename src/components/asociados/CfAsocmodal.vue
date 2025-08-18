<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-ab-testing</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Modalidad de Creditos</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="modalidad"
                label="Modalidad"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.modalidad"
                return-object
                :error="errores.modalidad"
                @input="errores.modalidad = false"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="linea"
                label="Linea"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.linea"
                return-object
                :error="errores.linea"
                @input="errores.linea = false"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="clasificacion"
                label="Clasificación"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.clasificacion"
                return-object
                :error="errores.clasificacion"
                @input="errores.clasificacion = false"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4" v-if="form.clasificacion.value === 1">
              <v-select
                :items="tipoord"
                label="Tipo"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.tipoord"
                return-object
                :error="errores.tipoord"
                @input="errores.tipoord = false"
             ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4" v-if="form.clasificacion.value === 2">
              <v-select
                :items="tipoextra"
                label="Tipo"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.tipoextra"
                return-object
                :error="errores.tipoextra"
                @input="errores.tipoextra = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4" v-if="form.clasificacion.value === 3">
              <v-select
                :items="tipoconvenio"
                label="Tipo"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.tipoconvenio"
                return-object
                :error="errores.tipoconvenio"
                @input="errores.tipoconvenio = false"

              ></v-select>
            </v-col>
          </v-row>

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
            color="indigo"
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
      modalidad: [{ text: "Consumo", value: "1" }],
      linea: [
        { text: "Crédito Personal", value: "1" },
        { text: "Crédito Libranza", value: "2" },
      ],

      clasificacion: [
        { text: "Ordinario", value: 1 },
        { text: "ExtraOrdinario", value: 2 },
        { text: "Convenio", value: 3 },
      ],
      tipoord: [
        { text: "Ordinario", value: "1" },
        { text: "Crédito Sobre Aportes", value: "2" },
        { text: "Compra de Cartera", value: "3" },
        { text: "Educativo", value: "4" },
      ],
      tipoextra: [
        { text: "Especial", value: "1" },
        { text: "Rotativo", value: "2" },
      ],

      tipoconvenio: [
        { text: "Mercadeo", value: "1" },
        { text: "Seguros", value: "2" },
        { text: "Electrodomesticos", value: "3" },
        { text: "Turismo", value: "4" },
      ],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Modulo", align: "center", value: "modulo_rep" },
        { text: "Menu", align: "center", value: "menu_rep" },
        { text: "SubMenu1", align: "center", value: "submenu1_rep" },
        { text: "SubMenu2", align: "center", value: "submenu2_rep" },
        { text: "Opción", align: "center", value: "opcion_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        modulo: false,
        menu: false,
        submenu1: false,
        submenu2: false,
        opcion: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    editar_item(data) {
      console.log(data);
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.modulo = data.cod_rep;
      this.form.opcion = data.opcion_rep;
      this.form.descrip = data.descrip_rep.trim();
      let busqueda_menu1 = this.modulos.find((el) => el.value == data.menu_rep);

      this.form.menu = busqueda_menu1;

      this.form.estado = data.estado_rep == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.opcion) {
        this.errores.opcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var modalidad = data.modalidad.value;
      var linea = data.linea.value;
      var clasificacion = data.clasificacion.value;
      var tipoord = data.tipoord? data.tipoord.value: 0;
      var tipoextra = data.tipoextra? data.tipoextra.value : 0;
      var tipoconvenio = data.tipoconvenio? data.tipoconvenio.value : 0;

      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let dataenvio = [
        sessionStorage.Sesion,
        modalidad,
        linea,
        clasificacion,
        tipoord,
        tipoextra,
        tipoconvenio,
        estado,
        eliminar,
      ];
      this.postData({
        url: "Asociados/dlls/Cfmodalidad.dll",
        data: dataenvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.card_estado = false;
          this.$emit("msj", data[0], "green", 1000);
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          this.form.barras = null;
          this.$emit("msj", err[0], "red", 500);
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
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
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfopcionesJ.dll",
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
            text: "Error al cargar Opciones",
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
