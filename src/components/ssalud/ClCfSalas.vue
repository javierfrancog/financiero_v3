<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-prescription</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Salas Rx</v-list-item-title
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
            <v-col class="d-flex" cols="6" sm="7">
              <v-autocomplete
                label="Sede de Servicio"
                v-model="form.punto_fact"
                :items="agencias"
                :item-text="format_punto_fact"
                item-value="codigo_agc"
                hide-details
                outlined
                return-object
                @change="errores.punto_fact = false"
                :error="errores.punto_fact"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="3" sm="3">
              <v-text-field
                label="Rango Tiempo"
                clearable
                outlined
                required
                v-model="form.tiempo"
                :error="errores.tiempo"
                @input="errores.tiempo = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="8" sm="4">
              <v-select
                :items="categorias"
                label="Categoria_1"
                outlined
                clearable
                return-object
                hide-details
                :item-text="format_categorias"
                v-model="form.categoria1"
                required
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="8" sm="4">
              <v-select
                :items="categorias"
                label="Categoria_2"
                outlined
                clearable
                return-object
                hide-details
                :item-text="format_categorias"
                v-model="form.categoria2"
                required
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
      agencias: [],
      categorias: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "codigo_sala" },
        { text: "Descripción", align: "left", value: "descrip_sala" },
        { text: "Categoria1", align: "center", value: "desccat1_sala" },
        { text: "Categoria2", align: "center", value: "desccat2_sala" },

        { text: "Intervalo(Minutos)", align: "center", value: "rango_sala" },

        { text: "Estado", align: "center", value: "estado_sala" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        punto_fact: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarTablaAg();
    this.cargarcontenido();
    this.cargarcategorias();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_sala;
      this.form.descripcion = item.descrip_sala;
      this.form.grupo = item.grupo_sala;
      this.form.tiempo = item.rango_sala.trim();
      this.form.estado = item.estado_sala == "1" ? true : false;
      var busqueda_agencia = this.agencias.find(
        (el) => el.codigo_agc == item.agencia_sala
      );
      this.form.punto_fact = busqueda_agencia;

      var busqueda_cat1 = this.categorias.find(
        (el) => el.codigo_rep == item.cat1_sala
      );
      this.form.categoria1 = busqueda_cat1;

      var busqueda_cat2 = this.categorias.find(
        (el) => el.codigo_rep == item.cat2_sala
      );
      this.form.categoria2 = busqueda_cat2;


    },
    format_categorias(val) {
      return `${val.descripcion_rep}`;
    },
    cargarcategorias() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfCategoriaJ.dll",
          data: sessionStorage.Sesion + "|" + "1"+ "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.categorias = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error en Categorias",
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
      this.card_estado = true;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var tiempo = data.tiempo;
      var cat1 = data.categoria1? data.categoria1.codigo_rep : "0";
      var cat2 = data.categoria2? data.categoria2.codigo_rep : "0";
      var grupo = data.grupo;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      let sede = data.punto_fact.codigo_agc;

      let datos = {
        url: "Clinico/dlls/ClCfSalas.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          tiempo +
          "|" +
          grupo +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          sede +
          "|" +
          cat1 +
          "|" + 
          cat2 +                   
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
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
          url: "Clinico/dlls/ClCfSalasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Salas",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesN.dll",
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
