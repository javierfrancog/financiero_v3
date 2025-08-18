<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loadCard"
        :disabled="loadCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alert-circle-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Registro de Novedades</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="4">
            <v-select
              :items="tiposolicitud"
              :item-text="format_novedad"
              label="Tipo Novedad"
              outlined
              clearable
              return-object
              @change="select_unidad()"
              hide-details
              v-model="form.tiposolicitud"
              required
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-autocomplete
              :items="unidad"
              label="Unidad Residencial"
              outlined
              :item-text="format_unidad"
              clearable
              return-object
              hide-details
              v-model="form.unidad"
              :error="errores.unidad"
              @change="select_unidad(), (errores.unidad = false)"
              required
            ></v-autocomplete>
          </v-col>
          <v-btn
            v-if="activar"
            color="orange"
            class="mt-4 ml-2 white--text px-12"
            large
            depressed
            @click="get_novedad()"
          >
            Reportar Novedad
            <v-icon right class="mr-2">mdi-alert-circle-check-outline</v-icon>
          </v-btn>
        </v-row>
        <v-row class="d-flex mb-4 justify-center align-center">
          <v-col class="d-flex" cols="4">
            <v-btn
              color="indigo"
              class="ml-2 white--text px-12"
              large
              depressed
              @click="cargarcontenido()"
            >
              Consultar
              <v-icon right class="mr-2">mdi-alert-circle-check-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0"> </v-card-text>
        </div>
      </v-card>
      <v-row class="d-flex mb-4 justify-center align-center">
        <v-col cols="6" lg="6" md="12" sm="12">
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
          item.estado_rep == "1" ? "Bloqueado" : "Activo"
        }}</template>
        <!-- <template v-slot:item.subir_sop="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="subir_soportes(item)"
                color="purple"
                fab
                small
                icon
                v-on="on"
              >
                <v-icon>mdi-file-upload-outline</v-icon>
              </v-btn>
            </template>
            <span>Subir soportes</span>
          </v-tooltip>
        </template> -->
        <template v-slot:item.bajar_sop="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="descargar_soportes(item)"
                color="red"
                fab
                small
                icon
                v-on="on"
              >
                <v-icon>mdi-download-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>Descargar soportes</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo_novedad.estado" persistent max-width="800px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="d-flex">
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Consecutivo"
                clearable
                outlined
                type="text"
                disabled
                v-model="form.consecutivo"
                :loading="loader.consecutivo"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="5">
              <v-autocomplete
                label="Placas"
                v-model="form.placas"
                :items="placas"
                clearable
                :item-text="format_placas"
                hide-details
                :error="errores.placas"
                @change="errores.placas = false"
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12">
              <v-textarea
                label="Descripción:"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @change="errores.descripcion = false"
                hide-details
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="Cantidad"
                outlined
                hide-details
                v-model="form.cantidad"
                :error="errores.cantidad"
                @change="errores.cantidad = false"
                type="number"
                ref="input_cantidad"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-file-input
                label="Anexar Imagen"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="form.archivo_model"
                id="archivo_pdf"
              ></v-file-input>
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
              dialogo_novedad.estado = false;
              init_form_novedad();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_novedad()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogo_archivo.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar documento</v-card-title>
        <v-card-text>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
          <v-btn
            depressed
            color="green darken-2"
            class="white--text px-12 mx-5"
            @click="up_file"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      activar: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      placas: [],
      contenido: [],
      item_sel: [],
      unidad: [],
      ciudades_dian: null,

      search: "",
      form: {
        consecutivo: null,
        descripcion: null,
      },
      tiposolicitud: [],

      btnEnvio: {
        loader: false,
        disabled: false,
      },
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },

      errores: {
        destino: false,
        descripcion: false,
        placas: false,
        unidad:false,
        cantidad: false,
      },
      dialogo_novedad: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,

      headers: [
        { text: "Consecutivo", align: "left", value: "consec_rep" },
        { text: "Tipo Novedad", align: "left", value: "descrtipo_rep" },
        { text: "Unidad", align: "left", value: "unidad_rep" },
        { text: "Fecha Novedad", align: "center", value: "fechanov_rep" },
        { text: "Descripcion", align: "left", value: "descripcion1_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        { text: "Placas", align: "center", value: "placas_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Subir Soportes", value: "subir_sop", align: "center" },
        { text: "Ver Soportes", value: "bajar_sop", align: "center" },
      ],

      empresa: {},
      loadCard: false,
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarcontenido();
    this.get_Unidades();
    this.get_placas();
    this.cargar_novedad();
  },
  computed: {},
  methods: {
    cargar_novedad() {
      this.loader = true;
      this.tiposolicitud = [];
      post
        .postData({
          url: "Phorizontal/dlls/CfNovedadesJ.dll",
          data: sessionStorage.Sesion + "|" ,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.tiposolicitud = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Novedades",
            estado: true,
          });
        });
    },    
    get_Unidades() {
      post
        .postData({
          url: "Phorizontal/dlls/CfcopropiedadJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.unidad = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    get_placas() {
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/CfvehiculoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.placas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    get_novedad() {
      if (!this.form.unidad) {
        this.errores.unidad = true;
        this.send_error("Debe seleccionar una unidad residencial");
      } else {
        this.getConsecutivo();
        this.dialogo_novedad.estado = true;
      }
    },
    cargarcontenido() {
      post
        .postData({
          url: "Phorizontal/dlls/PrNovedadJ.dll",
          data: sessionStorage.Sesion + "|",
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
            text: "Error al cargar Solicitudes",
            estado: true,
          });
        });
    },
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        });
    },
    init_form_novedad() {
      this.form = {
        dialogo_archivo: null,
        descripcion: null,
        cantidad: null,
      };
    },
    subir_soportes(item) {
      this.item_select = item;
      this.dialogo_archivo.estado = true;
    },
    descargar_soportes(item) {
      const url =
        `https://drive.google.com/file/d/` +
        item.iddrive_rep.trim() +
        `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
    },
    async up_file() {
      if (!this.dialogo_archivo.model) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        // this.card_estado = true;
        this.loader = true;
        let session = sessionStorage.Sesion;
        let agencia = sessionStorage.Sede;
        let empresa = parseFloat(this.empresa.id_empr);
        let cargue_pdf = this.dialogo_archivo.model.name;
        let consec = parseFloat(this.item_select.consec_rep);
        let tipodoc = 5;
        let item = 1;
        let nombre_pdf = empresa + "_SOLIC_" + consec + "_" + tipodoc + ".pdf";

        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("item", item);
        data.append("consecutivo", consec);
        data.append("agencia", agencia);
        data.append("file", this.dialogo_archivo.model);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/cargue.drive.gth.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.loader = false;
        this.dialogo_archivo.estado = false;
        this.dialogo_archivo.model = "";

        this.$emit("snack", {
          color: "success",
          text: "Soporte Guardado Correctamente",
          estado: true,
        });

        this.cargarcontenido();
        this.dialogo.estado = false;
        this.loader = false;
      }
    },
    format_unidad(val) {
      return `${parseInt(val.idpropiet_rep) || 0} -
      ${
        val.desctipo_rep.trim() +
        " " +
        parseInt(val.nro_rep) +
        " " +
        val.descubica_rep.trim() +
        " " +
        val.ubic2_rep
      } `;
    },
    format_novedad(val) {
      return `${val.descrip_rep}`;
    },    
    select_unidad() {
      let tipo = this.form.tiposolicitud.cod_rep;
      if (tipo == 1) {
        this.activar = true;
      } else {
        this.activar = false;
      }
    },
    guardar_novedad() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Debe registrar una descripcion!");
      } else if (data.tiposolicitud.cod_rep == 1 && !data.placas) {
        this.errores.placas = true;
        this.send_error("Debe seleccionar una placa!");
      } else if (data.tiposolicitud.cod_rep == 1 && !data.cantidad) {
        this.errores.cantidad = true;
        this.send_error("Debe indicar cantidad!");
      } else {
        this.envio_novedad(data);
      }
    },
    envio_novedad(data) {
      this.dialogo_novedad.estado = false;
      let tipo = data.tiposolicitud.cod_rep;
      let unidad = data.unidad.idph_rep;
      let cantidad = data.cantidad ? data.cantidad : 1;
      let placas = data.placas ? data.placas.placa_rep : "";
      let descripcion = data.descripcion.trim();
      let consecutivo = data.consecutivo;
      let estado = 0;

      this.loader = true;
      let datos = {
        url: "Phorizontal/dlls/PrNovedad.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          unidad +
          "|" +
          consecutivo +
          "|" +
          cantidad +
          "|" +
          estado +
          "|" +
          placas +
          "|" +
          descripcion +
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
          this.loader = false;
          this.init_form_novedad();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    format_placas: function (val) {
      return `${val.placa_rep.trim()} - ${val.descrtipo_rep}`;
    },
    getConsecutivo() {
      this.form.consecutivo = null;
      post
        .postData({
          url: "Phorizontal/dlls/PrNovedadN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          let consec = data[0].nro;
          this.form.consecutivo = consec;
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al cargar Consecutivo");
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
