<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-book-check-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Configuración Contratos</v-list-item-title>
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
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
            >
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
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
          <span class="title col-12">{{ dialogo.titulo}}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="form.consecutivo"
                  disabled
                  hide-details
                  type="text"
                  :loading="load.consecutivo"
                ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8">
                <v-autocomplete
                  label="Cliente"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  hide-details
                  return-object
                  outlined
                  @change="errores.clientes = false"
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Nro_Contrato"
                clearable
                outlined
                type="text"
                v-model="form.contrato"
                @change="errores.contrato = false"
                :error="errores.contrato"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Inicio"
                      outlined
                      v-model="form.fechaini"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaini"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPickerfin"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Final"
                      outlined
                      v-model="form.fechafin"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechafin"
                    @input="dialogPickerfin = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

          </v-row>
          <v-row>
              <v-col sm="12">
                <v-text-field
                  outlined
                  clearable
                  label="Resumen Objeto"
                  v-model="form.objeto"
                  hide-details
                  ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
            <v-col class="d-flex" cols="6">
              <v-file-input
                label="Buscar PDF"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogo_archivo.model"
                id="archivo_pdf"
              ></v-file-input>
            </v-col>
          </v-row>


          <v-row justify="center">
            <v-switch v-model="form.eliminar" label="Eliminar" hide-details></v-switch>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false;init_form()">Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="guardar()">Guardar</v-btn>
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
    FlowerSpinner
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      clientes: [],
      tipo: null,
      search: "",
      form: {},
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Cliente", align: "left", value: "desccliente_rep" },
        { text: "Contrato", align: "left", value: "contrato_repc" },        
        { text: "Opciones", value: "edit", align: "center" }
      ],
      errores: {
        clientes: false,
        contrato: false,
        estado: false
      },
      load: {
        btn_enviar: false,
        consecutivo: false,
      },
      card_estado: false
    };
  },
  created() {
    this.cargarcontenido();
    this.get_Clientes();
    this.tipo = 0;
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Variedad";
      this.dialogo.tipo = 1;
      this.form.consecutivo = item.consec_rep;
      this.form.contrato = item.contrato_repc;
      this.form.fechaini = item.fechaini_rep;
      this.form.fechafin = item.fechafin_rep;  
      this.form.objeto = item.objeto_rep;  
      this.tipo = 1;
      
      var busqueda_cliente = this.clientes.find(
        (el) => el.identificacion_rut == item.cliente_rep
      );      
      this.form.clientes = busqueda_cliente;
      
      

    },
    guardar: function() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Dato Cliente Obligatorio!");
      } else if (!data.fechaini) {
        this.errores.fechaini = true;
        this.send_error("Fecha Inicial Obligatoria!");
      } else if (!data.fechafin) {
        this.errores.fechafin = true;
        this.send_error("Fecha Final Obligatoria!");
      } else if (!data.contrato) {
        this.errores.contrato = true;
        this.send_error("Contrato Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    async    format_envio(data) {
      await this.up_file();

      this.card_estado = true;
      let consecutivo = data.consecutivo;
      let cliente = data.clientes.identificacion_rut;
      let contrato = data.contrato;
      let fechaini = data.fechaini.replace(/\-/g, "");
      let fechafin = data.fechafin.replace(/\-/g, "");
      let objeto = data.objeto.trim();
      
      
      let descripcion = data.descripcion;

      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "trespecial/dlls/CfContratos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consecutivo +
          "|" +
          cliente +
          "|" +
          contrato +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          objeto +
          "|" +
          this.tipo +
          "|" +
          eliminar +
          "|",
        method: ""
      };
      post
        .postData(datos)
        .then(data => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch(error => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    async up_file() {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento = "TRESP";
      let consecutivo = this.form.consecutivo;
      this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      let file = this.dialogo_archivo.model;

      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        this.dialogo_archivo.estado = false;

        var ruta = `${this.dialogo_archivo.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/transporte.pdf.php", {
          method: "POST",
          body: archivo,
        }).then((res) => res.json());
        this.dialogo_archivo.loader = false;

        this.$emit("snack", {
          color: "success",
          text: "Archivo subido correctamente ",
          estado: true,
        });
      }
    },
    agregar_item() {
      this.init_form();
      this.get_consecutivo();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.tipo = 0;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false
      };

      this.errores = {
        codigo: false
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "trespecial/dlls/CfContratosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar variedades",
            estado: true
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    get_consecutivo() {
      var $this = this;
      this.load.consecutivo = true;
      // var fecha = this.form.fecha.replace(/-/g, "");
      post
        .postData({
          url: "trespecial/dlls/CfContratosCJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = data[0].Consc.trim();
        })
        .catch((err) => {
          this.load.consecutivo = false;
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true
      });
    }
  }
};
</script>
