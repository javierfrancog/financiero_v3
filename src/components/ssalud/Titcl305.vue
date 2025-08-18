<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-group-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Servicios y Procedimientos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="900px">
                <v-bottom-sheet v-model="sheet" persistent>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="success"
                      class="ma-2 white--text"
                      v-on="on"
                      @click="opcionDialog('C', '')"
                    >
                      Agregar
                      <v-icon right dark>mdi-cloud-upload</v-icon>
                    </v-btn>
                  </template>
                </v-bottom-sheet>
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card>
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
                              type="number"
                              required
                              v-model="form.numero"
                              counter="15"
                              max
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="9">
                            <v-text-field
                              label="Descripcion"
                              clearable
                              outlined
                              required
                              v-model="form.descripcion"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Codigo soat"
                              clearable
                              outlined
                              required
                              v-model="form.cod_soat"
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Tarifa soat"
                              clearable
                              outlined
                              required
                              v-model="form.tar_soat"
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Codigo Iss 2001"
                              clearable
                              outlined
                              required
                              v-model="form.cod_iss"
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Tarifa Iss 2001"
                              clearable
                              outlined
                              required
                              v-model="form.tar_iss"
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-select
                              :items="[
                                { text: 'Todos', value: 1 },
                                { text: 'Femenino', value: 2 },
                                { text: 'Masculino', value: 3 },
                              ]"
                              label="Genero"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.genero"
                              required
                              :rules="[(v) => !!v || 'Campo es obligatorio']"
                            ></v-select>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Edad"
                              type="number"
                              clearable
                              outlined
                              required
                              v-model="form.edad"
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Cuenta contable"
                              type="number"
                              clearable
                              outlined
                              required
                              v-model="form.cuenta"
                              :rules="[(v) => !!v || 'Campo obligatorio']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-select
                              :items="[
                                { text: 'Desactivado', value: 0 },
                                { text: 'Activo', value: 1 },
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
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-menu
                              ref="menu"
                              v-model="dialogPicker"
                              :close-on-content-click="false"
                              :return-value.sync="form.fecha_act"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                              required
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.fecha_act"
                                  label="Fecha de activacion"
                                  append-icon="event"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.fecha_act"
                                @input="dialogPicker = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
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
                        @click="guardarServicio"
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
              :items="servicios"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Genero</th>
                        <th>Edad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.genero }}</td>
                        <td>{{ item.edad }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="opcionDialog('U', item.identificacion)"
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
      singleExpand: true,
      expanded: [],
      dialog: false,
      valid: false,
      dialogPicker: false,
      servicios: [],
      search: "",
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 60) || "Maximo 60 digitos",
      ],
      validField: [(v) => !!v || "Campo es obligatorio"],

      form: [],

      tiposerv: [
        { text: "Servicio", value: 1 },
        { text: "Medicamento", value: 2 },
        { text: "Otros Servicios", value: 99 },
      ],
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "identificacion" },
        { text: "Descripcion", align: "center", value: "descripcion" },
        { text: "Vlr Soat", align: "center", value: "vlrsoat" },
        { text: "Vlr Iss2001", align: "center", value: "vlriss" },
        { text: "Cuenta", align: "center", value: "cuenta" },
        { text: "Estado", align: "center", value: "estado" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargarServicios();
  },
  methods: {
    cargarServicios: function () {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl305j.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.servicios = [];
          this.servicios = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar servicios",
            estado: true,
          });
        });
    },
    opcionDialog(opc, key) {
      this.form = {
        text: "Agregar servicios y procedimientos",
        numero: null,
        descripcion: null,
        cod_soat: null,
        tar_soat: null,
        cod_iss: null,
        tar_iss: null,
        genero: null,
        edad: null,
        cuenta: null,
        fecha_act: this.$moment().format("YYYY-MM-DD"),
        estado: null,
        eliminar: false,
      };
      if (opc == "C") {
        this.dialog = true;
      } else {
        console.log(key);
        var item = this.servicios.filter((e) => {
          if (e.identificacion == key) {
            return e;
          }
        });
        if (item.length) {
          item = item[0];
          this.form = {
            text: "Modificar servicios y procedimientos",
            numero: item.identificacion,
            descripcion: item.descripcion,
            cod_soat: item.idsoat,
            tar_soat: item.vlrsoat,
            cod_iss: item.idiss,
            tar_iss: item.vlriss,
            genero: { value: parseInt(item.genero) },
            edad: item.edad,
            cuenta: item.cuenta,
            fecha_act: this.$moment(item.fechaAct).format("YYYY-MM-DD"),
            estado: { value: parseInt(item.estado) },
            eliminar: false,
          };
          this.dialog = true;
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Servicio no encontrado",
            estado: true,
          });
        }
      }
    },
    guardarServicio() {
      if (this.$refs.form.validate()) {
        var eliminar = this.form.eliminar ? 1 : 0;
        var datos = {
          url: "Clinico/dlls/titcl305.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.numero +
            "|" +
            this.form.descripcion +
            "|" +
            this.form.cod_soat +
            "|" +
            this.form.tar_soat +
            "|" +
            this.form.cod_iss +
            "|" +
            this.form.tar_iss +
            "|" +
            this.form.genero.value +
            "|" +
            this.form.edad +
            "|" +
            this.form.cuenta +
            "|" +
            this.form.estado.value +
            "|" +
            eliminar +
            "|",
          method: "",
        };
        console.log(datos);
        post
          .postData(datos)
          .then((data) => {
            this.dialog = false;
            this.$emit("snack", {
              color: "success",
              text: "Servicio modificado",
              estado: true,
            });
            this.cargarServicios();
          })
          .catch((error) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar servicio",
              estado: true,
            });
          });
      }
    },
  },
};
</script>
