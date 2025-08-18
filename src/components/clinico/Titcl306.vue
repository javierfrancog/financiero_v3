<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-view-grid-plus-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Personal Asistencial s.s</v-list-item-title
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Identificación"
                clearable
                outlined
                type="text"
                required
                v-model="form.id"
                :error="errores.id"
                @input="errores.id = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8">
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
                :items="items_tipo"
                label="Tipo Profesional"
                outlined
                clearable
                v-model="form.tipoprof"
                required
                return-object
                hide-details
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Registro Médico"
                clearable
                outlined
                type="text"
                required
                v-model="form.regmedico"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Rango Tiempo minutos"
                clearable
                outlined
                type="text"
                required
                v-model="form.rango"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="8">
              <v-select
                :items="items_especialidad"
                :item-text="format_especialidad"
                hide-details
                label="Especialidad"
                v-model="form.especialidad"
                return-object
                clearable
              ></v-select>
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
      items_especialidad: [],
      search: "",
      form: {},
      items_tipo: [
        { text: "Medico General", value: "01" },
        { text: "Medico Cardiólogo", value: "02" },
        { text: "Medico Radiólogo", value: "03" },        

      ],
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Identificacion", align: "left", value: "id" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Estado", align: "center", value: "estado" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.get_especialidad();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.id = item.id;
      this.form.descripcion = item.descripcion;
      this.form.especialidad = item.descripcion;
      this.form.regmedico = item.nro_registro;
      this.form.rango = item.tiempo;
      this.form.estado = item.estado == "1" ? true : false;

      var busqueda_tipo = this.items_tipo.find(
        (el) => el.value == item.tipo
      );
      this.form.tipoprof = busqueda_tipo;

      var busqueda_espec = this.items_especialidad.find(
        (el) => el.codigo_rep == item.espec_rep
      );
      this.form.especialidad = busqueda_espec;     


    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.id) {
        this.errores.id = true;
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
      let id = data.id;
      let descripcion = data.descripcion;
      let espec = data.especialidad? data.especialidad.codigo_rep : 0;
      let regmedico = data.regmedico;
      let rango = data.rango;
      let tipoprof = data.tipoprof.value;
      let estado = data.estado ? "1" : "0";
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Clinico/dlls/titcl303L.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          id +
          "|" +
          descripcion +
          "|" +
          tipoprof +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          regmedico +
          "|" +
          rango +
          "|" +          
          espec +          
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
    get_especialidad() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfespecialidadJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.items_especialidad = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error en Especialidades",
            estado: true,
          });
        });
    },
    format_especialidad(val) {
      return `${val.descripcion_rep}`;
    },
    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
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
            text: "Error en Categorias",
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
