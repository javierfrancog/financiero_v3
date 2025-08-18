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
                >mdi-closed-caption</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Centro de Costos</v-list-item-title
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
                            <v-select
                              :items="[
                                { text: 'SubCentro', value: 2 },
                                { text: 'Centro', value: 1 },
                              ]"
                              label="Tipo Codigo"
                              outlined
                              clearable
                              hide-details
                              v-model="form.tipocod"
                              required
                              return-object
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
                              :counter="form.tipocod == 1 ? '2' : '4'"
                              max
                              :rules="[
                                (v) => !!v || 'Campo obligatorio',
                                (v) =>
                                  (v && v.length <= 4) || 'Maximo 4 digitos',
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
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              :items="[
                                { text: 'Activo', value: 0 },
                                { text: 'Desactivado', value: 1 },
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
                              :rules="[(v) => !!v || 'Campo es obligatorio']"
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
                        <td>{{ item.telefono_ases }}</td>
                        <td>{{ item.correo_ases }}</td>
                        <td>{{ item.ciudad_ases }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="opcionDialog('U', item)"
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
      styleObject: { border: "2px solid #01579B" },

      dialog: false,
      valid: false,
      contenido: [],
      search: "",

      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 60) || "Maximo 60 digitos",
      ],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+\..+/.test(v) || "E-mail no es valido",
        (v) => (v && v.length <= 60) || "Maximo 60 digitos",
      ],

      validField: [(v) => !!v || "Campo es obligatorio"],

      form: [],
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Centro", align: "center", value: "centro_cost" },
        { text: "Subcentro", align: "center", value: "subcentro_cost" },
        { text: "Descripción", align: "center", value: "descrip_cost" },
        { text: "Tipo", align: "center", value: "tipo_cost" },
        { text: "Estado", align: "center", value: "estado_cost" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargarTablacostos();
  },

  computed: {},

  methods: {
    cargarTablacostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
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

    opcionDialog(opc, key) {
      this.form = [];
      if (opc == "C") {
        this.form.text = "Agregar Centros Costos";
        this.form.eliminar = false;
        this.dialog = true;
      } else {
        var item = key;
        if (item) {
          this.form = {
            text: "Modificar Centros de costos",
            codigo: item.centro_cost + item.subcentro_cost.trim(),
            descripcion: item.descrip_cost.trim(),
            tipocod: { value: parseInt(item.tipo_cost) },
            estado: { value: parseInt(item.estado_cost) },
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
        console.log(this.form);
        var estado = this.form.estado.value ? 0 : 1;
        var eliminar = this.form.eliminar ? 1 : 0;
        var codigo = this.form.codigo.padEnd(4, "0");
        var codigo1 = codigo.slice(0, 2);
        var codigo2 = codigo.slice(2, 4);

        var datos = {
          url: "Financiero/dlls/Cfcostos.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.tipocod.value +
            "|" +
            codigo1 +
            "|" +
            codigo2 +
            "|" +
            this.form.descripcion +
            "|" +
            estado +
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
            this.cargarTablacostos();
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
