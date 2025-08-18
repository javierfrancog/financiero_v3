<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-card-account-details-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Libro de Socios/Accionistas</v-list-item-title
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estadocolabora_rep="{ item }">{{
                item.estadocolabora_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
              <template v-slot:body.append>
                <td colspan="3" class="text-right">
                  <strong>TOTALES</strong>
                </td>
                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales) }}</strong>
                </td>
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
        </v-card-title>
        <v-row>
          <v-col class="d-flex" cols="12" sm="8">
            <v-autocomplete
              label="Informado"
              v-model="form.socio"
              :items="clientes"
              :item-text="format_clientes"
              hide-details
              return-object
              outlined
              :error="errores.informado"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="4" sm="3">
            <v-text-field
              label="Porcentaje"
              clearable
              outlined
              required
              v-model="form.porcentaje"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

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
      error: {
        rut: false,
      },

      dialog: true,
      valid: false,
      pickerFechaRet: false,
      pickerFechaIng: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      clientes: [],
      totales: 0,
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },

      dialogoEditar: {
        estado: false,
        load: false,
        valores: {},
        llave: null,
      },

      search: "",
      form: {
        listado_devengos: [],
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id", align: "center", value: "idsoc_rep" },
        { text: "Socio/Accionista", align: "left", value: "descripsocio_rep" },
        { text: "Porcentaje", align: "center", value: "porc_rep" },
        { text: "Estado", align: "center", value: "estadocolabora_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        ccosto: false,
        colabora: false,
        cargo: false,
        descripcion: false,
        estado: false,
        anoselect: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
    };
  },
  created() {
    this.get_Clientes();
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.porcentaje = this.formatNumero(item.porc_rep);

      var busqueda_informado = this.clientes.find(
        (el) => el.identificacion_rut == item.idsoc_rep
      );
      this.form.socio = busqueda_informado;
    },
    guardar: function () {
      let idsocio = this.form.socio.identificacion_rut;
      let porc = this.form.porcentaje || 0;
      let nacionalidad = "01";
      let acciones = 1;
      let titulo = 1;
      let fechainsc = 0;
      let estado = 0;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfSocios.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            idsocio +
            "|" +
            nacionalidad +
            "|" +
            acciones +
            "|" +
            titulo +
            "|" +
            porc +
            "|" +
            fechainsc +
            "|" +
            estado +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Asociados",
            estado: true,
          });
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
        eliminar: false,
        listado_devengos: [],
      };
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfSociosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          this.totales = 0;
          let acumtotal = 0;
          data.forEach((item) => {
            let total = parseFloat(item.porc_rep.replace(/\,/g, "")) || 0;

            acumtotal += total;
            this.totales = acumtotal;
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Asociados",
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
