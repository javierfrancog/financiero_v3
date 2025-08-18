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
              <v-list-item-title class="headline">Clientes</v-list-item-title>
              <v-list-item-subtitle
                >Activacion de clientes</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="1100px">
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
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-select
                              :items="[
                                { text: 'Nit', value: 31 },
                                { text: 'Cedula', value: 13 }
                              ]"
                              label="Tipo Identificacion"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.tipo_id"
                              required
                              :rules="validField"
                            ></v-select>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Identificacion"
                              clearable
                              outlined
                              type="number"
                              required
                              v-model="form.numero"
                              counter="15"
                              max
                              :rules="[
                                v => !!v || 'Campo obligatorio',
                                v =>
                                  (v && v.length <= 15) || 'Maximo 15 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Descripcion"
                              clearable
                              outlined
                              required
                              v-model="form.descripcion"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Direccion"
                              clearable
                              outlined
                              required
                              v-model="form.direccion"
                              :rules="nameRules"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Telefono"
                              clearable
                              outlined
                              type="number"
                              v-model="form.telefono"
                              counter="10"
                              :rules="[
                                v =>
                                  (v && v.length <= 10) || 'Maximo 10 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-text-field
                              label="Correo"
                              clearable
                              outlined
                              v-model="form.correo"
                              :rules="emailRules"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-autocomplete
                              label="Departamento"
                              v-model="form.departamento"
                              :items="departamentos"
                              item-value="value"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-autocomplete
                              label="Ciudad"
                              v-model="form.ciudad"
                              :items="filterMunicipios"
                              item-value="value"
                              :rules="validField"
                              required
                              outlined
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Contacto"
                              clearable
                              outlined
                              required
                              v-model="form.contacto"
                              :rules="[
                                v => !!v || 'Campo obligatorio',
                                v =>
                                  (v && v.length <= 30) || 'Maximo 30 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-autocomplete
                              label="Vendedor"
                              v-model="form.vendedor"
                              :items="vendedores"
                              item-value="value"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-autocomplete
                              label="Super admin"
                              v-model="form.super"
                              :items="superAdmins"
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
                              :rules="[
                                v => !!v || 'Campo obligatorio',
                                v =>
                                  (v && v.length <= 12) || 'Maximo 12 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-menu
                              ref="menu"
                              v-model="dialogPicker"
                              :close-on-content-click="false"
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
                          <v-col class="d-flex" cols="12" sm="3">
                            <v-select
                              :items="[
                                { text: 'Comercial', value: 1 },
                                { text: 'Ips', value: 2 },
                                { text: 'P_Horizontal', value: 3 }
                              ]"
                              label="Tipo Empresa"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.tipo_emp"
                              required
                              :rules="validField"
                            ></v-select>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-text-field
                              label="Codigo Habilitación"
                              clearable
                              outlined
                              required
                              v-model="form.habilitacion"
                              :rules="[
                                v => !!v || 'Campo obligatorio',
                                v =>
                                  (v && v.length <= 12) || 'Maximo 12 digitos'
                              ]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="8">
                            <v-text-field
                              label="Client_Token"
                              clearable
                              outlined
                              required
                              v-model="form.cltoken"
                            ></v-text-field>
                          </v-col>
                        </v-row>                          
                        <v-row>                        
                          <v-col class="d-flex" cols="12" sm="8">
                            <v-text-field
                              label="Acces_Token"
                              clearable
                              outlined
                              required
                              v-model="form.acctoken"
                            ></v-text-field>
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
                        @click="guardarCliente"
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
              :items="clientes"
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
                        <th>Contacto</th>
                        <th>Telefono Contacto</th>
                        <th>Ciudad</th>
                        <th>Vendedor</th>
                        <th>Super admin</th>
                        <th>Contraseña</th>
                        <th>Tiempo</th>
                        <th>Ip hosting</th>
                        <th>Fecha_act</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.contacto }}</td>
                        <td>{{ item.telecontact }}</td>
                        <td>{{ item.ciudad }}</td>
                        <td>{{ item.vendedor }}</td>
                        <td>{{ item.super }}</td>
                        <td>{{ item.contrasena }}</td>
                        <td>{{ item.tiempo }}</td>
                        <td>{{ item.iphosting }}</td>
                        <td>{{ item.fecha }}</td>
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
  data() {
    return {
      nameRules: [
        v => !!v || "Campo obligatorio",
        v => (v && v.length <= 60) || "Maximo 20 digitos"
      ],
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail no es valido",
        v => (v && v.length <= 60) || "Maximo 60 digitos"
      ],
      validField: [v => !!v || "Campo obligatorio"],
      dialog: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      date: new Date().toISOString().substr(0, 10),
      clientes: [],
      vendedores: [],
      superAdmins: [],
      ciudades_dian: [],
      departamentos: [],
      form: [],
      search: "",
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Tipo id", align: "center", value: "tipo" },
        {
          text: "Identificacion",
          align: "center",
          sortable: false,
          value: "identificacion"
        },
        { text: "Descripcion", align: "center", value: "descripcion" },
        { text: "Direccion", align: "center", value: "direccion" },
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
    descripcionEstado(e) {
      return e == "0" ? "Desaactivado" : "Activo";
    },
    cargarVendedores: function() {
      post
        .postData({
          url: "Financiero/dlls/tit303j.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.vendedores = [];
          data.forEach((k, v) => {
            this.vendedores.push({
              value: k.identificacion,
              text:
                k.primerApellido.trim() +
                " " +
                k.segundoApellido +
                " " +
                k.nombres
            });
          });
          this.cargarSuperAdmins();
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar vendedores",
            estado: true
          });
        });
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
          data.forEach((k, v) => {
            this.superAdmins.push({
              value: k.identificacion,
              text:
                k.primerApellido.trim() +
                " " +
                k.segundoApellido +
                " " +
                k.nombres
            });
          });
          this.cargarClientes();
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar super admins",
            estado: true
          });
        });
    },
    cargarClientes: function() {
      post
        .postData({
          url: "Financiero/dlls/tit101j.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.clientes = [];
          this.clientes = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true
          });
        });
    },
    opcionDialog(opc, key) {
      this.form = {
        text: "Agregar cliente",
        tipo_id: null,
        numero: null,
        descripcion: null,
        direccion: null,
        telefono: null,
        correo: null,
        departamento: null,
        ciudad: null,
        contacto: null,
        vendedor: null,
        super: null,
        contraseña: null,
        habilitacion: null,
        fecha_act: this.$moment().format("YYYY-MM-DD"),
        estado: null,
        eliminar: false
      };

      if (opc == "C") {
        this.dialog = true;
      } else {
        var item = this.clientes.filter(e => {
          if (e.identificacion == key) {
            return e;
          }
        });
        if (item.length) {
          item = item[0];
          let fecha_act =
            this.$moment(item.fecha).format("YYYY-MM-DD") == "Invalid date"
              ? this.$moment().format("YYYY-MM-DD")
              : this.$moment(item.fecha).format("YYYY-MM-DD");
          this.form.text = "Modificar clientes";
          this.form.tipo_id = {
            value: parseInt(item.tipo)
          };
          this.form.numero = item.identificacion;
          this.form.descripcion = item.descripcion;
          this.form.direccion = item.direccion;
          this.form.telefono = item.telefono;
          this.form.correo = item.correo;
          this.form.departamento = item.ciudad.substr(0, 2);
          this.form.ciudad = item.ciudad;
          this.form.contacto = item.contacto;
          // this.form.contacto = item.contacto;
          
          this.form.vendedor = item.vendedor;
          this.form.super = item.super;
          this.form.contraseña = item.contrasena;
          this.form.habilitacion = item.habilitacion;
          this.form.fecha_act = fecha_act;
          this.form.tipo_emp = {
            text: item.tipoemp == "0" ? "Desactivado" : "Activo",
            value: parseInt(item.tipoemp)
          };
          this.form.estado = {
            text: item.estado == "0" ? "Desactivado" : "Activo",
            value: parseInt(item.estado)
          };
          this.dialog = true;
        } else {
          this.$emit("snack", {
            color: "error",
            text: "vendedor no encontrado",
            estado: true
          });
        }
      }
    },
    guardarCliente() {
      if (this.$refs.form.validate()) {
        var eliminar = this.form.eliminar ? 1 : 0;
        var fecha = this.form.fecha_act.split("-");
        fecha = fecha[0] + fecha[1] + fecha[2];
        var datos = {
          url: "Financiero/dlls/tit101.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.numero +
            "|" +
            this.form.tipo_id.value +
            "|" +
            this.form.descripcion +
            "|" +
            this.form.direccion +
            "|" +
            this.form.telefono +
            "|" +
            this.form.correo +
            "|" +
            this.form.contacto +
            "|" +
            "0" + //telefono contacto
            "|" +
            this.form.ciudad +
            "|" +
            this.form.vendedor +
            "|" +
            this.form.super +
            "|" +
            this.form.contraseña.trim().padStart(12, "0") +
            "|" +
            "0" + //tiempo
            "|" +
            this.form.estado.value +
            "|" +
            "0" + //ip hosting
            "|" +
            this.form.tipo_emp.value +
            "|" +
            fecha +
            "|" +
            this.form.habilitacion +
            "|" +
            this.form.cltoken +
            "|" +            
            this.form.acctoken +            
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
              text: "Cliente modificado",
              estado: true
            });
            this.cargarClientes();
          })
          .catch(error => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar cliente",
              estado: true
            });
          });
      }
    }
  }
};
</script>
