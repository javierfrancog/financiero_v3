<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-group-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Vendedores</v-list-item-title>
              <v-list-item-subtitle>Activacion de Vendedores</v-list-item-subtitle>
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{}">
                  <v-btn color="success" class="ma-2 white--text" @click="opcionDialog('C','')">
                    Agregar
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                  </v-btn>
                </template>
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{form.text}}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Identificacion"
                              clearable
                              outlined
                              type="number"
                              required
                              v-model="form.numero"
                              counter="15"
                              max
                              :rules="[v=> !!v  || 'Campo obligatorio', v => (v && v.length <= 15) || 'Maximo 15 digitos']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="1er apellido"
                              clearable
                              outlined
                              required
                              v-model="form.primerApellido"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="2do apellido"
                              clearable
                              outlined
                              v-model="form.segundoApellido"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Nombres"
                              clearable
                              outlined
                              required
                              v-model="form.nombres"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Correo"
                              clearable
                              outlined
                              v-model="form.correo"
                              :rules="emailRules"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Telefono"
                              clearable
                              outlined
                              type="number"
                              v-model="form.telefono"
                              counter="10"
                              :rules="[v => (v && v.length <= 10) || 'Maximo 10 digitos']"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Direccion"
                              clearable
                              outlined
                              required
                              v-model="form.direccion"
                              :rules="[v=> !!v  || 'Campo obligatorio', v => (v && v.length <= 60) || 'Maximo 60 digitos']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-autocomplete
                              label="Departamento"
                              v-model="form.departamento"
                              :items="departamentos"
                              item-value="value"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-autocomplete
                              label="Ciudad"
                              v-model="form.ciudad"
                              :items="filterMunicipios"
                              item-value="value"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Contraseña"
                              clearable
                              outlined
                              required
                              v-model="form.contraseña"
                              :rules="[v=> !!v  || 'Campo obligatorio', v => (v && v.length <= 10) || 'Maximo 10 digitos']"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-menu
                              ref="menu"
                              v-model="dialogPicker"
                              :close-on-content-click="false"
                              :return-value.sync="form.date"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                              required
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.date"
                                  label="Fecha de activacion"
                                  append-icon="event"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="form.date" @input="dialogPicker = false"></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              :items="[{ text: 'Desactivado',value: 0},{ text: 'Activo',value: 1}]"
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
                          <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="ma-2" color="red" text @click="dialog = false">Cancelar</v-btn>
                      <v-btn class="ma-2" color="success" text @click="guardarVendedor">Guardar</v-btn>
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
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="vendedores"
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
                        <th>Correo</th>
                        <th>Direcion</th>
                        <th>Ciudad</th>
                        <th>Contraseña</th>
                        <th>Fecha_act</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.ciudad }}</td>
                        <td>{{ item.contrasena }}</td>
                        <td>{{ item.FechaAct }}</td>
                        <td>{{ item.estado }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="opcionDialog('U', item.identificacion)">edit</v-icon>
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
      dialog: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      search: "",
      nameRules: [
        v => !!v || "Campo obligatorio",
        v => (v && v.length <= 20) || "Maximo 20 digitos"
      ],
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail no es valido",
        v => (v && v.length <= 60) || "Maximo 60 digitos"
      ],
      vendedores: [],
      ciudades_dian: [],
      departamentos: [],
      form: [],
      btn_guardarVendedor: {
        loader: false,
        disabled: false
      },
      headers: [
        { text: "", value: "data-table-expand" },
        {
          text: "Identificacion",
          align: "center",
          sortable: false,
          value: "identificacion"
        },
        { text: "1er Apellido", align: "center", value: "primerApellido" },
        { text: "2do Apellido", align: "center", value: "segundoApellido" },
        { text: "Nombres", align: "center", value: "nombres" },
        { text: "Telefono", align: "center", value: "telefono" },
        { text: "Opciones", value: "edit", align: "center" }
      ]
    };
  },
  created() {
    post
      .postData({
        url: "Datos/BASE/CIUDADES_DIAN.json",
        data: "",
        method: "GET"
      })
      .then(data => {
        this.ciudades_dian = data.departamentos;
        this.ciudades_dian.forEach((k, v) => {
          this.departamentos.push({
            value: k.codigo,
            text: k.departamento
          });
        });
        this.cargarVendedores();
      })
      .catch(err => {
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar ciudades",
          estado: true
        });
      });
  },
  computed: {
    filterMunicipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter(e => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio
            });
          });
          return registro;
        }
      });
      return registro;
    }
  },
  methods: {
    cargarVendedores: function() {
      post
        .postData({
          url: "Financiero/dlls/tit303j.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.vendedores = [];
          this.vendedores = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar vendedores",
            estado: true
          });
        });
    },
    opcionDialog(opc, key) {
      this.form = {
        text: "Agregar vendedor",
        numero: null,
        primerApellido: null,
        segundoApellido: null,
        nombres: null,
        direccion: null,
        departamento: null,
        ciudad: null,
        telefono: null,
        correo: null,
        contraseña: null,
        date: this.$moment().format("YYYY-MM-DD"),
        estado: null,
        eliminar: false
      };
      if (opc == "C") {
        this.dialog = true;
      } else {
        var item = this.vendedores.filter(e => {
          if (e.identificacion == key) {
            return e;
          }
        });
        if (item.length) {
          item = item[0];
          this.form.text = "Modificar vendedor";
          this.form.numero = item.identificacion;
          this.form.primerApellido = item.primerApellido;
          this.form.segundoApellido = item.segundoApellido;
          this.form.nombres = item.nombres;
          this.form.direccion = item.direccion;
          this.form.departamento = item.ciudad.substr(0, 2);
          this.form.ciudad = item.ciudad;
          this.form.telefono = item.telefono;
          this.form.correo = item.correo;
          this.form.contraseña = item.contrasena;
          this.form.date = this.$moment(item.fechaAct).format("YYYY-MM-DD");
          this.form.estado = {
            text: item.estado == "0" ? "Desactivado" : "Activo",
            value: parseInt(item.estado)
          };
          this.dialog = true;
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Vendedor no encontrado",
            estado: true
          });
        }
      }
    },
    guardarVendedor() {
      if (this.$refs.form.validate()) {
        var eliminar = this.form.eliminar ? 1 : 0;
        var fecha = this.form.date.split("-");
        fecha = fecha[0] + fecha[1] + fecha[2];
        var datos = {
          url: "Financiero/dlls/tit303.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.numero +
            "|" +
            this.form.nombres +
            "|" +
            this.form.primerApellido +
            "|" +
            this.form.segundoApellido +
            "|" +
            this.form.direccion +
            "|" +
            this.form.telefono +
            "|" +
            this.form.correo +
            "|" +
            this.form.ciudad +
            "|" +
            this.form.contraseña.trim().padStart(10, "0") +
            "|" +
            fecha +
            "|" +
            this.form.estado.value +
            "|" +
            eliminar +
            "|",
          method: ""
        };
        console.log(datos);
        post
          .postData(datos)
          .then(data => {
            this.dialog = false;
            this.$emit("snack", {
              color: "success",
              text: "Vendedor modificado",
              estado: true
            });
            this.cargarVendedores();
          })
          .catch(error => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar vendedor",
              estado: true
            });
          });
      }
    }
  }
};
</script>
