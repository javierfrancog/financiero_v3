<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cash-usd-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Cargos</v-list-item-title
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
              <template v-slot:item.estadobase_rep="{ item }">
                {{ item.estadobase_rep == "1" ? "Bloqueado" : "Activo" }}
              </template>

              <template v-slot:item.bprest_rep="{ item }">
                {{ item.bprest_rep == "0" ? "No" : "Si" }}
              </template>

              <template v-slot:item.bvacac_rep="{ item }">
                {{ item.bvacac_rep == "0" ? "No" : "Si" }}
              </template>

              <template v-slot:item.bssocial_rep="{ item }">
                {{ item.bssocial_rep == "0" ? "No" : "Si" }}
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
            <v-col class="d-flex" cols="4" sm="4">
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
          <v-row>
            <v-col class="d-flex" cols="8">
              <v-autocomplete
                label="Cuenta Crédito"
                v-model="form.ctacontab"
                :items="datosctas"
                :item-text="format_ctas"
                item-value="cod_puc"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Iva 19%', value: 19 },
                  { text: 'Iva 16%', value: 16 },
                  { text: 'Iva 5%', value: 5 },
                  { text: 'Iva Exento 0%', value: 0 },
                  { text: 'Iva Excluido', value: 99 },
                ]"
                label="Tarifa Iva"
                outlined
                clearable
                hide-details
                v-model="form.tariva"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col class="d-flex" cols="4">
              <v-switch v-model="form.vrmanual" label="Valor Manual"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Valor"
                clearable
                v-model="form.valor"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider></v-divider>

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
      search: "",
      form: {
        tariva: 0,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "left", value: "codigobase_rep" },
        { text: "Descripción", align: "left", value: "descrbase_rep" },
        { text: "Iva", align: "left", value: "ivabase_rep" },
        { text: "Valor", align: "left", value: "valorbase_rep" },
        { text: "Estado", align: "center", value: "estadobase_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
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
    this.cargarcontenido();
    this.cargarTablactas();
  },
  computed: {},
  methods: {
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + 4 + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigobase_rep;
      this.form.descripcion = item.descrbase_rep;
      this.form.valor = item.valorbase_rep.replace(/,/g, "").trim();
      this.form.vrmanual = item.vrmanual_rep == "1" ? true : false;
      this.form.porcent = item.porcbase_rep;
      this.form.tariva = parseInt(item.ivabase_rep);

      var busqueda_cta = this.datosctas.find(
        (el) => el.cod_puc.trim() == item.ctadeb_rep.trim()
      );
      this.form.ctacontab = busqueda_cta;
      this.form.estado = item.estadobase_rep == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripción Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var porcentaje = data.porcent ? data.porcent : "0";
      var valor = data.valor ? parseInt(data.valor) : "0";
      var vrmanual = data.vrmanual ? "1" : "0";
      var tariva = data.tariva || "0";
      var ctacredito = data.ctacontab.cod_puc
        ? data.ctacontab.cod_puc.trim()
        : "0";

      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Servdm/dlls/Cfsdmbase.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "1" +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          porcentaje +
          "|" +
          valor +
          "|" +
          ctacredito +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          vrmanual +
          "|" +
          tariva +
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
      this.buscarNumero();

      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
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

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfsdmbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
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
            text: "Error al consultar Cargos",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Servdm/dlls/CfsdmbaseN.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.form.codigo = data[0].nro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
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
