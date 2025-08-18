<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrange-send-to-back</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Barrios</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                @click="opcionDialog('C', '')"
              >
                Agregar
                <v-icon right dark>mdi-plus-box</v-icon>
              </v-btn>
              <v-dialog v-model="dialog" persistent max-width="900px">
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card :shaped="true" outlined>
                    <v-card-title>
                      <span class="headline">{{ form.text }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Codigo"
                              clearable
                              outlined
                              type="text"
                              required
                              v-model="form.codigo"
                              :counter="'4'"
                              max
                              :rules="[
                                v => !!v || 'Campo obligatorio',
                                v =>
                                  (v && v.length <= 4) || 'Maximo 4 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="8">
                            <v-text-field
                              label="Descripción"
                              clearable
                              outlined
                              required
                              v-model="form.descripcion"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              :items="[
                                { text: 'Activo', value: 0 },
                                { text: 'Desactivado', value: 1 }
                              ]"
                              label="Estado"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.estado"
                              item-text="text"
                              item-value="value"
                              required
                              :rules="[v => !!v || 'Campo es obligatorio']"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-switch
                            v-model="form.eliminar"
                            label="Eliminar"
                          ></v-switch>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        class="ma-2"
                        color="red"
                        text
                        @click="dialog = false"
                        >Cancelar</v-btn
                      >
                      <v-btn
                        class="ma-2"
                        color="success"
                        text
                        @click="guardarFormulario"
                        >Guardar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
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
              item-key="cod_rep"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="opcionDialog('U', item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

export default {
  data() {
    return {
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      ciudades_dian: [],
      departamentos: [],
      styleObject: { border: '2px solid #01579B'},            

      dialog: false,
      valid: false,
      contenido: [],
      search: "",

      nameRules: [
        v => !!v || "Campo obligatorio",
        v => (v && v.length <= 60) || "Maximo 60 digitos"
      ],
      validField: [v => !!v || "Campo es obligatorio"],

      form: [],
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "cod_rep"},
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" }
      ]
    };
  },
  created() {
    this.cargarBarrios();
  },

  computed: {
  },

methods: {
    cargarBarrios: function() {
      post
        .postData({
          url: "Servdm/dlls/CfBarriosJ.DLL",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.contenido = [];
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Barrios",
            estado: true
          });
        });
    },

    opcionDialog(opc, key) {
      this.form = [];
      if (opc == "C") {
        this.form.text = "Agregar Barrio";
        this.form.eliminar = false;
        this.dialog = true;
      } else {
        var item = key
        if (item) {
          this.form = {
            text: "Modificar Barrio",
            codigo: item.cod_rep,
            descripcion: item.descrip_rep,
            estado : parseInt(item.estado_rep),
            eliminar: false
          };
          this.dialog = true;
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Registro no encontrado",
            estado: true
          });
        }
      }
    },
    guardarFormulario() {
      if (this.$refs.form.validate()) {
        var estado = this.form.estado.value;
        var eliminar = this.form.eliminar ? 1 : 0;
        var codigo = this.form.codigo;

        var datos = {
          url: "servdm/dlls/CfBarrios.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            codigo +
            "|" +
            this.form.descripcion +
            "|" +
            estado +
            "|" +
            eliminar +
            "|",
          method: ""
        };
        post
          .postData(datos)
          .then(data => {
            this.dialog = false;
            this.$emit("snack", {
              color: "success",
              text: "Registro Grabado",
              estado: true
            });
            this.cargarBarrios();
          })
          .catch(error => {
            console.log(error)
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar Registro",
              estado: true
            });
          });
      }
    }
  }
};
</script>
