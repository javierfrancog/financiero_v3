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
              <v-list-item-title class="headline">SuperAdmin</v-list-item-title>
              <v-list-item-subtitle
                >Activacion de SuperAdmin</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="600px">
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
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ form.text }}</span>
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
                              :rules="[
                                v => !!v || 'Campo obligatorio',
                                v =>
                                  (v && v.length <= 15) || 'Maximo 15 digitos'
                              ]"
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
                              required
                              v-model="form.segundoApellido"
                              :rules="ape2Rules"
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
                              v-model="form.telefono"
                              counter="10"
                              :rules="[
                                v =>
                                  (v && v.length <= 10) || 'Maximo 15 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-autocomplete
                              label="Empresa"
                              v-model="form.empresa"
                              :items="empresas"
                              item-value="value"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Contraseña"
                              clearable
                              outlined
                              required
                              v-model="form.contraseña"
                              :rules="validField"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              :items="[
                                { text: 'Financiero', value: 1 },
                                { text: 'Clinico', value: 2 },
                                { text: 'Admon PH', value: 3 },                                
                                { text: 'Votaciones', value: 4 }
                              ]"
                              label="Perfil"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.perfil"
                              required
                              :rules="validField"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              :items="[
                                { text: 'Desactivado', value: 1 },
                                { text: 'Activo', value: 2 }
                              ]"
                              label="Estado"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.estado"
                              required
                              :rules="validField"
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
                      <v-btn class="ma-2" color="success" text @click="guardar"
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
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="superAdmins"
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
                        <th>Telefono</th>
                        <th>Correo</th>
                        <th>Contraseña</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.telefono }}</td>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.contrasena }}</td>
                        <td>{{ descripcionEstado(item.estado) }}</td>
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
  </v-layout>
</template>

<script>
import post from "../../methods.js";

export default {
  name: "admin",
  data() {
    return {
      singleExpand: true,
      expanded: [],
      dialog: false,
      valid: false,
      dialogPicker: false,
      superAdmins: [],
      search: "",
      nameRules: [
        v => !!v || "Campo obligatorio",
        v => (v && v.length <= 20) || "Maximo 20 digitos"
      ],
      ape2Rules: [v => (v && v.length <= 20) || "Maximo 20 digitos"],
      validField: [v => !!v || "Campo es obligatorio"],
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail no es valido",
        v => (v && v.length <= 60) || "Maximo 60 digitos"
      ],
      empresas: [],
      form: [],
      drawer: false,
      btn_guardar: {
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
        { text: "Empresa", align: "center", sortable: false, value: "empresa" },
        { text: "1er Apellido", align: "center", value: "primerApellido" },
        { text: "2do Apellido", align: "center", value: "segundoApellido" },
        { text: "Nombres", align: "center", value: "nombres" },
        { text: "Opciones", value: "edit", align: "center" }
      ]
    };
  },
  created() {
    post
      .postData({
        url: "Financiero/dlls/tit101j.dll",
        data: sessionStorage.Sesion + "|",
        method: ""
      })
      .then(data => {
        console.log(data);
        this.empresas = [];
        data.forEach((k, v) => {
          this.empresas.push({
            value: k.identificacion,
            text: k.descripcion
          });
        });
        this.cargarSuperAdmins();
      })
      .catch(err => {
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar empresas",
          estado: true
        });
      });
  },
  methods: {
    descripcionEstado(e) {
      return e == "0" ? "Desaactivado" : "Activo";
    },
    cargarSuperAdmins: function() {
      post
        .postData({
          url: "Financiero/dlls/tit301j.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.superAdmins = [];
          this.superAdmins = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar super admins",
            estado: true
          });
        });
    },
    opcionDialog(opc, key) {
      this.form = {
        text: "Agregar super Admin",
        numero: null,
        primerApellido: null,
        segundoApellido: null,
        nombres: null,
        empresa: null,
        telefono: null,
        correo: null,
        contraseña: null,
        perfil: null,
        fecha_act: null,
        estado: false,
        eliminar: false
      };

      if (opc == "C") {
        this.dialog = true;
      } else {
        var item = this.superAdmins.filter(e => {
          if (e.identificacion == key) {
            return e;
          }
        });
        if (item.length) {
          item = item[0];
          this.form.text = "Modificar super admin";
          this.form.numero = item.identificacion;
          this.form.empresa = item.empresa;
          this.form.primerApellido = item.primerApellido;
          this.form.segundoApellido = item.segundoApellido;
          this.form.nombres = item.nombres;
          this.form.telefono = item.telefono;
          this.form.correo = item.correo;
          this.form.contraseña = item.contrasena;
          this.form.perfil = {
            text: item.perfil == "0" ? "Desactivado" : "Activo",
            value: parseInt(item.perfil)
          };

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
    guardar() {
      if (this.$refs.form.validate()) {
        var eliminar = this.form.eliminar ? 1 : 0,
          empresa = this.form.empresa ? this.form.empresa : "0";
        var datos = {
          url: "Financiero/dlls/tit301.dll",
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
            empresa +
            "|" +
            this.form.telefono +
            "|" +
            this.form.correo +
            "|" +
            this.form.contraseña +
            "|" +
            this.form.perfil.value +
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
              text: "Admin modificado",
              estado: true
            });
            this.cargarSuperAdmins();
          })
          .catch(error => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar admin",
              estado: true
            });
          });
      }
    }
  }
};
</script>
