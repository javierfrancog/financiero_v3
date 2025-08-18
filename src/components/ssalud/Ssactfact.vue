<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-list-status</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualización de Factura ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Año Factura"
                outlined
                hide-details
                v-model="form.añofact"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Prefijo"
                outlined
                hide-details
                v-model="form.prefijo"
                text-transform:uppercase
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                hide-details
                v-model="form.consecutivo"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-btn
                color="indigo"
                large
                class="ma-2 white--text"
                @click="cargarTablaFactura"
              >
                Buscar
                <v-icon right dark>mdi-card-search-outline</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex" cols="2">
                <v-menu
                  v-model="pickerFactura"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_factura"
                      label="Fecha Factura"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_factura"
                    @input="pickerFactura = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- <v-col class="d-flex" cols="2">
              <v-btn
                color="orange"
                large
                class="ma-2 white--text"
                @click="grabarFactura"
              >
                Guardar
                <v-icon right dark>mdi-card-search-outline</v-icon>
              </v-btn>
            </v-col> -->


          </v-row>

          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Año Servicio"
                outlined
                hide-details
                v-model="form.anoserv"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Agencia"
                outlined
                hide-details
                v-model="form.agencia"
                text-transform:uppercase
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                hide-details
                v-model="form.nroserv"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-btn
                color="green"
                class="ma-2 white--text"
                @click="agregarServicio()"
              >
                Agregar Servicio
                <v-icon dark>mdi-file-download-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider color="succes"></v-divider>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider color="succes" v-if="servicios.length != 0"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="form.consecutivo !== null"
            >
              <v-col class="mb-4" cols="4">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center">
              <v-switch
                class="ml-6"
                v-model="form.eliminar"
                label="Eliminar todos los Registros"
                @change="validar_eliminar()" 
                        ></v-switch>
            </v-row>
            <v-data-table
              v-if="form.consecutivo != null"
              :loading="load_table"
              :headers="headers"
              :items="servicios"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-btn
                  color="error"
                  class="ma-2 white--text"
                  @click="borrarServicio(item)"
                  >Eliminar Servicio</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>

        <v-dialog v-model="dialogo.estado"
        transition="dialog-bottom-transition"        
         persistent max-width="290px">
          <v-card class="px-6">
            <v-card-text class="pb-0">
              <v-row>
                <v-col class="d-flex" cols="12">
                  <span class="title col-12">Seguro que Desea Eliminar todos los Registros de la Factura?</span>                  
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-row>
                <v-col class="d-flex" cols="4">
                  <v-btn
                    color="indigo"
                    class="ma-2 white--text"
                    @click="get_eliminar()"
                    >Eliminar</v-btn
                  >
                </v-col>
                <v-col class="d-flex ml-8" cols="2">
                  <v-btn
                    color="red"
                    class="ma-2 white--text"
                    @click="dialogo.estado = false"
                    >Cancelar</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      search: null,
      load_contrato: true,
      load_table: false,
      pickerPeriodo: false,
      pickerFactura: false,
      pickerActual: false,
      servicios: [],
      form: [],
      empresa: [],
      fecha_factura: "",
      dialogo: {
      estado: false,
    },

      errores: {
        anoserv: false,
      },

      headers: [
        { text: "Nro Servicio", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Paciente", align: "center", value: "paciente_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.form.añofact = this.$moment().format("YYYY");
  },
  watch: {},
  computed: {},

  methods: {
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    cargarTablaFactura() {
      this.servicios = [];
      let año = this.form.añofact;
      let prefijo = this.form.prefijo;
      let nrofact = this.form.consecutivo;
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClactfactJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            año +
            "|" +
            prefijo +
            "|" +
            nrofact +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.servicios = JSON.parse(JSON.stringify(data));
          this.fecha_factura = this.servicios[0].fechafact_rep;
        })
        .catch((err) => {
          let mensaje = err.Mensaje[0].msg
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: mensaje,
            estado: true,
          });
        });
    },
    validar_eliminar(){
      let eliminar = this.form.eliminar ? 2 : 0;
      if (eliminar === 2) {
         this.dialogo.estado = true;     
      } else{
        this.dialogo.estado = false        
      }    
      this.form.eliminar = false;
    },  
    grabarFactura(){
      this.form.eliminar = 0;      
      this.dialogo.estado = false              
      let año = this.form.añofact;
      let prefijo = this.form.prefijo;
      let nrofact = this.form.consecutivo;
      let fecha = this.fecha_factura.replace(/\-/g, "");
      let datos =
        sessionStorage.Sesion +
        "|" +
        año +
        "|" +
        prefijo +
        "|" +
        nrofact +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Clinico/dlls/Clactfactm.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "blue",
            text: "Factura Actualizada",
            estado: true,
          });
          this.cargarTablaFactura();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: err,
            estado: true,
          });
        });
    },  
    get_eliminar(item) {
      this.form.eliminar = 0;      
      this.dialogo.estado = false              
      let año = this.form.añofact;
      let prefijo = this.form.prefijo;
      let nrofact = this.form.consecutivo;
      let datos =
        sessionStorage.Sesion +
        "|" +
        año +
        "|" +
        prefijo +
        "|" +
        nrofact +
        "|";
      post
        .postData({
          url: "Clinico/dlls/Clactfact01x.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "orange",
            text: "Servicios Eliminados",
            estado: true,
          });
          this.cargarTablaFactura();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: err,
            estado: true,
          });
        });
    },    
    borrarServicio(item) {
      let año = this.form.añofact;
      let prefijo = this.form.prefijo;
      let nrofact = this.form.consecutivo;

      let fecha = item.fecha_rep;
      let nro = item.nro_rep;
      let sede = item.sede_rep;
      let datos =
        sessionStorage.Sesion +
        "|" +
        año +
        "|" +
        prefijo +
        "|" +
        nrofact +
        "|" +
        fecha +
        "|" +
        nro +
        "|" +
        sede +
        "|";
      post
        .postData({
          url: "Clinico/dlls/Clactfactx.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "orange",
            text: "Servicio Eliminado",
            estado: true,
          });
          this.cargarTablaFactura();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: err,
            estado: true,
          });
        });
    },
    agregarServicio() {
      let año = this.form.añofact;
      let prefijo = this.form.prefijo;
      let nrofact = this.form.consecutivo;

      let fecha = this.form.anoserv;
      let nro = this.form.nroserv;
      let sede = this.form.agencia;
      let datos =
        sessionStorage.Sesion +
        "|" +
        año +
        "|" +
        prefijo +
        "|" +
        nrofact +
        "|" +
        fecha +
        "|" +
        nro +
        "|" +
        sede +
        "|";
      post
        .postData({
          url: "Clinico/dlls/Clactfact01.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Servicio Agregado",
            estado: true,
          });
          this.cargarTablaFactura();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
  },
};
</script>
