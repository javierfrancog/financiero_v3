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
              <v-icon size="30" color="blue darken-4 "
                >mdi-format-text-rotation-down-vertical</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Conf. Clasificación Niif</v-list-item-title
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
              <v-dialog v-model="dialog" persistent max-width="800px">
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card :shaped="true" outlined>
                    <v-card-title>
                      <span class="headline">{{ form.text }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              :items="[
                                { text: 'Clase', value: 1 },
                                { text: 'Grupo', value: 2 },
                                { text: 'Cuenta', value: 3 },
                              ]"
                              label="Tipo Codigo"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.tipocod"
                              required
                              :rules="[(v) => !!v || 'Campo es obligatorio']"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Codigo"
                              clearable
                              outlined
                              type="text"
                              required
                              v-model="form.codigo"
                              counter="6"
                              max
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col class="d-flex" cols="12" sm="7">
                            <v-text-field
                              label="Descripción"
                              clearable
                              outlined
                              type="text"
                              required
                              v-model="form.descripcion"
                              counter="60"
                              max
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row justify="center">
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-switch
                              v-model="form.eliminar"
                              label="Eliminar"
                            ></v-switch>
                          </v-col>
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
              item-key="codigo"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>{{ item.codigo }}</td>
                        <td>{{ item.descripcion }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
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
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      dialog: false,
      valid: false,
      contenido: [],
      search: "",
      validField: [(v) => !!v || "Campo es obligatorio"],
      styleObject: { border: "2px solid #01579B" },

      form: [],
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "left", value: "cod_niif" },
        { text: "Descripción", align: "left", value: "descrip_niif" },
        { text: "Tipo", align: "center", value: "tipo_niif" },
        { text: "Nombre Tipo", align: "center", value: "nombre_niif" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargarTablaniif();
  },

  methods: {
    cargarTablaniif: function () {
      post
        .postData({
          url: "Financiero/dlls/CfClasniifJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          console.log(data);
          this.contenido = [];
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },

    opcionDialog(opc, item) {
      this.form = [];
      if (opc == "C") {
        this.form = {
          text: "Configuración Clasificación Niif",
        };
        this.dialog = true;
      } else {
        if (item) {
          this.form = {
            text: "Modificar Configuración Niif",
            tipocod: { value: parseInt(item.tipo_niif) },
            codigo: item.cod_niif,
            descripcion: item.descrip_niif,
            estado: item.estado == "0" ? true : false,
            eliminar: false,
          };
          this.dialog = true;
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Registro no encontrado",
            estado: true,
          });
        }
      }
    },
    guardarFormulario() {
      if (this.$refs.form.validate()) {
        var eliminar = this.form.eliminar ? 1 : 0;
        var datos = {
          url: "Financiero/dlls/CfClasniif.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.codigo +
            "|" +
            this.form.tipocod.value +
            "|" +
            this.form.descripcion +
            "|" +
            eliminar +
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.dialog = false;
            this.$emit("snack", {
              color: "success",
              text: "Registro modificado",
              estado: true,
            });
            this.cargarTablaniif();
          })
          .catch((error) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar Registro",
              estado: true,
            });
          });
      }
    },
  },
};
</script>
