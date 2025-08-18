<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-playlist-edit</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Contratos</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
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
              item-key="nro"
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
                disabled
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="Rut"
                v-model="form.rut"
                :items="tablaruts"
                :item-text="format_ruts"
                item-value="item.identificacion"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Contributivo', value: 0 },
                  { text: 'Subsidiado', value: 1 },
                  { text: 'Reg.Especial', value: 3 },
                  { text: 'Otro', value: 9 },
                ]"
                label="Regimen"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.regimen"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
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
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Iss', value: 1 },
                  { text: 'Soat', value: 2 },
                  { text: 'Propia', value: 5 },                  
                ]"
                label="Tarifa"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tarifa"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="anios_select"
                label="Año Tarifa"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.anoserv"
                item-text="text"
                item-value="value"
                required
                :error="errores.anoserv"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Porcentaje"
                outlined
                v-model="form.porcentaje"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="left">
            <v-col class="d-flex" cols="4">
              <v-switch v-model="form.campaña" label="Campaña"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch v-model="form.cargue" label="Cargue Masivo Cups"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
            <v-autocomplete
              label="Activar en Sede"
              v-model="form.punto_fact"
              :items="agencias"
              :item-text="format_punto_fact"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.punto_fact = false;"
              :error="errores.punto_fact"
            ></v-autocomplete>
          </v-col>

          </v-row>
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
      tablaruts: [],
      agencias: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "nro" },
        { text: "Entidad", align: "left", value: "descripcion" },
        { text: "Régimen", align: "left", value: "detalle" },
        { text: "Estado", align: "center", value: "estado" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        entidad: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargar_años();
    this.cargarcontenido();
    this.cargarTablaruts();
    this.cargarTablaAg();    
  },
  computed: {},
  methods: {
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
          this.agencias.unshift({
            codigo_agc: "0000",
            descripcion_agc: "Todas ",
          });

        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },    
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 23; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 5; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.nro;

      var busqueda_rut = this.tablaruts.find(
        (el) => parseInt(el.identificacion_rut.trim()) == item.identificacion
      );
      var busqueda_sede = this.agencias.find(
            (el) => el.codigo_agc == item.sede
          );
          this.form.punto_fact = busqueda_sede;

      this.form.rut = busqueda_rut;
      this.form.tarifa = { value: parseInt(item.tarifa) };
      this.form.anoserv = { value: parseInt(item.ano) };      
      this.form.porcentaje = data.porc.trim();

      this.form.regimen = { value: parseInt(item.Regimen) };
      this.form.descripcion = item.detalle;
      this.form.campaña = item.campana == "1" ? true : false;
      this.form.estado = item.estado == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      console.log(data)
      this.card_estado = true;
      var codigo = data.codigo;
      var cliente = data.rut.identificacion_rut;
      var regimen = data.regimen.value;
      var tarifa = data.tarifa.value;
      var porc = data.porcentaje.trim();
      var ano = data.anoserv.value;
      var detalle = this.form.descripcion;
      var cargue = data.cargue ? "1" : "0";
      var campana = data.campaña ? "1" : "0";
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      let sede = data.punto_fact? data.punto_fact.codigo_agc : "0"

      let datos = {
        url: "Clinico/dlls/ClCfcontratos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          cliente +
          "|" +
          regimen +
          "|" +
          detalle +
          "|" +
          campana +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          tarifa +
          "|" +   
          porc +  
          "|" +   
          cargue +
          "|" +                   
          ano +      
          "|" +                   
           0  +
          "|" +                   
          sede +           
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

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|",
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
            text: "Error al cargar Contratos",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Clinico/dlls/ClCfContratosN.dll",
          data: sessionStorage.Sesion + "|",
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

    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut.trim()} - ${val.descripcion_rut}`;
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
