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
                >mdi-human-greeting-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Solicitud Laborales</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="4">
            <v-select
              :items="tiposolicitud"
              label="Nueva Solicitud"
              outlined
              clearable
              return-object
              hide-details
              @change="select_tipo()"
              v-model="form.tiposolicitud"
              required
            ></v-select>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0"> </v-card-text>
        </div>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="contenido"
        item-key="identificacion"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.subir_sop="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="subir_soportes(item)"
                color="purple"
                :disabled="
                  item.descnovedad_rep.trim() == 'Anulado' ? true : false || item.validado_rep.trim() == '2' ? true : false
                "
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
        </template>
        <template v-slot:item.bajar_sop="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="descargar_soportes(item)"
                color="red"
                :disabled="
                  item.descnovedad_rep.trim() == 'Anulado' ? true : false
                "
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
        <template v-slot:item.anular="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="get_anula(item)"
                :disabled="
                  item.descnovedad_rep.trim() == 'Anulado' ? true : false || item.validado_rep == '2' ? true : false 
                "
                color="red"
                fab
                small
                icon
                v-on="on"
              >
                <v-icon>mdi-delete-empty-outline</v-icon>
              </v-btn>
            </template>
            <span>Anular</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo_permiso.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="tipos"
                label="Tipo de Permiso"
                outlined
                clearable
                return-object
                hide-details
                :error="errores.tipopermiso"
                @change="errores.tipopermiso = false"
                v-model="form.tipopermiso"
                required
                :disabled="dialogo.tipo == 1"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Descripción:"
                clearable
                outlined
                required
                v-model="form.descripotro"
                :error="errores.descripotro"
                @change="errores.descripotro = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                v-model="form.fechaini"
                label="Fecha Inicio Permiso"
                type="date"
                hide-details
                outlined
                :error="errores.fechaini"
                @input="errores.fechaini = false"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Hora Inicio:"
                type="time"
                clearable
                outlined
                v-model="form.horaini"
                :error="errores.horaini"
                @input="errores.horaini = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                v-model="form.fechafin"
                label="Fecha Final Permiso"
                type="date"
                hide-details
                outlined
                :error="errores.fechafin"
                @input="errores.fechafin = false"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Hora Final:"
                type="time"
                clearable
                outlined
                v-model="form.horafin"
                :error="errores.horafin"
                @input="errores.horafin = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.medgral"
                label="Médico General"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.medespec"
                label="Médico Especialista"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.examen" label="Exámen"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.odonto" label="Odontología"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.proced" label="Procedimientos"></v-switch>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12">
              <v-file-input
                label="Buscar Soporte"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :error="errores.archivo"
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogo_archivo.model"
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
              dialogo_permiso.estado = false;
              init_form_permiso();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            large
            @click="guardar_permiso()"
            >Solicitar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_vacacion.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Solicitud Vacaciones</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                v-model="form.fechainivac"
                label="Fecha Inicio Vacaciones"
                type="date"
                hide-details
                outlined
                :error="errores.fechainivac"
                @input="errores.fechainivac = false"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                v-model="form.fechafinvac"
                label="Fecha Final Vacaciones"
                type="date"
                hide-details
                outlined
                :error="errores.fechafinvac"
                @input="errores.fechafinvac = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción:"
                clearable
                outlined
                required
                v-model="form.descripvacac"
                :error="errores.descripvacac"
                @change="errores.descripvacac = false"
                hide-details
              ></v-text-field>
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
              dialogo_vacacion.estado = false;
              init_form_vacacion();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_vacacion()"
            >Solicitar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_capacita.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Solicitud Capacitación</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción:"
                clearable
                outlined
                required
                v-model="form.descripcapacita"
                :error="errores.descripcapacita"
                @change="errores.descripcapacita = false"
                hide-details
              ></v-text-field>
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
              dialogo_capacita.estado = false;
              init_form_capacita();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_capacita()"
            >Solicitar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_desplaza.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Solicitud Desplazamiento</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                v-model="form.fechainidesp"
                label="Fecha Inicio Desplazamiento"
                type="date"
                hide-details
                outlined
                :error="errores.fechainidesp"
                @input="errores.fechainidesp = false"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Hora Inicio:"
                type="time"
                clearable
                outlined
                v-model="form.horaini"
                :error="errores.horaini"
                @input="errores.horaini = false"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                v-model="form.fechafindesp"
                label="Fecha Final Desplazamiento"
                type="date"
                hide-details
                outlined
                :error="errores.fechafindesp"
                @input="errores.fechafindesp = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Ciudad de Origen"
                v-model="form.origen"
                :items="ciudades_dian"
                item-value="c_digo_dane_del_municipio"
                item-text="municipio"
                outlined
                :error="errores.origen"
                @change="errores.origen = false"
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Ciudad Destino"
                v-model="form.destino"
                :items="ciudades_dian"
                item-value="c_digo_dane_del_municipio"
                item-text="municipio"
                outlined
                :error="errores.destino"
                @change="errores.destino = false"
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción:"
                clearable
                outlined
                required
                v-model="form.descripdesp"
                :error="errores.descripdesp"
                @change="errores.descripdesp = false"
                hide-details
              ></v-text-field>
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
              dialogo_desplaza.estado = false;
              init_form_desplaza();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_desplaza()"
            >Solicitar</v-btn
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
            label="Buscar Soporte"
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
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      item_sel: [],
      ciudades_dian: null,

      search: "",
      form: {},
      tiposolicitud: [
        { text: "Permisos", value: 1 },
        { text: "Vacaciones", value: 2 },
        { text: "Capacitación", value: 3 },
        { text: "Desplazamientos", value: 4 },
        { text: "Libranzas", value: 5 },
        { text: "Cambio Eps", value: 6 },
      ],

      tipos: [
        { text: "Consulta Médica", value: 1 },
        { text: "Estudio", value: 2 },
        { text: "Calamidad Domestica", value: 3 },
        // { text: "Licencia Remunerada", value: 4 },
        // { text: "Licencia No Remunerada", value: 5 },
        { text: "Otra", value: 9 },
      ],

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
        tipopermiso: false,
        descripotro: false,
        fechaini: false,
        horaini: false,
        fechafin: false,
        horafin: false,
        fechainivac: false,
        fechafinvac: false,
        descripcapacita: false,
        fechainidesp: false,
        fechafindesp: false,
        origen: false,
        destino: false,
        descripdesp: false,
        archivo: false,
      },
      dialogo_permiso: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_vacacion: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_capacita: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_desplaza: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },

      headers: [
        // { text: "Numero", align: "left", value: "consec_rep" },        
        { text: "Tipo Solicitud", align: "left", value: "tiposol_rep" },
        { text: "Fecha Solicitud", align: "center", value: "fechasol_rep" },
       
        { text: "Descripcion", align: "left", value: "descripcion1_rep" },
        {
          text: "Inicio Novedad",
          align: "left",
          value: "fechainicio_rep",
          width: "110px",
        },
        { text: "Hora Inicio", align: "left", value: "horaini_rep" },

        {
          text: "Fin Novedad",
          align: "left",
          value: "fechafin_rep",
          width: "110px",
        },
        { text: "Hora Final", align: "left", value: "horafin_rep" },

        {
          text: "Observación Validación",
          align: "left",
          value: "Observacionvalida",
        },
        {
          text: "Lider",
          align: "left",
          value: "nombrevalida_rep",
        },

        { text: "Estado", align: "center", value: "descnovedad_rep" },
        { text: "Subir Soportes", value: "subir_sop", align: "center" },
        { text: "Ver Soportes", value: "bajar_sop", align: "center" },
        { text: "Anular", value: "anular", align: "center" },
      ],

      empresa: {},
      loadCard: false,
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarcontenido();
    this.cargarCiudades();
  },
  computed: {},
  methods: {
    guardar_desplaza() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fechainidesp) {
        this.errores.fechainidesp = true;
        this.send_error("Seleccione fecha Inicial!");
      } else if (!data.fechafindesp) {
        this.errores.fechafindesp = true;
        this.send_error("Seleccione Fecha final!");
      } else if (!data.origen) {
        this.errores.origen = true;
        this.send_error("Seleccione ciudad de Origen!");
      } else if (!data.destino) {
        this.errores.destino = true;
        this.send_error("Seleccione  ciudad de Destino!");
      } else if (!data.descripdesp) {
        this.errores.descripdesp = true;
        this.send_error("Registre una descripción!");
      } else {
        this.envio_desplaza(data);
      }
    },
    envio_desplaza(data) {
      this.dialogo_capacita.estado = false;
      var tipo = data.tiposolicitud.value;
      var tipopermiso = 0;
      var descripcion = data.descripdesp.trim();
      var fechaini = data.fechainidesp.replace(/\-/g, "");
      var fechafin = data.fechafindesp.replace(/\-/g, "");
      var horaini = data.horaini.replace(/\:/g, "");
  
      var horafin = 0;
      var origen = data.origen;
      var destino = data.destino;
      this.loader = true;
      let datos = {
        url: "Financiero/dlls/PrGthSolicitud.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          tipopermiso +
          "|" +
          descripcion +
          "|" +
          fechaini +
          "|" +
          horaini +
          "|" +
          fechafin +
          "|" +
          horafin +
          "|" +
          origen +
          "|" +
          destino +
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
          this.dialogo_desplaza.estado = false;
          this.init_form_desplaza();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    guardar_capacita() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcapacita) {
        this.errores.descripcapacita = true;
        this.send_error("Registre la solicitud!");
      } else {
        this.envio_capacita(data);
      }
    },
    envio_capacita(data) {
      this.dialogo_capacita.estado = false;
      var tipo = data.tiposolicitud.value;
      var tipopermiso = 0;
      var descripcion = data.descripcapacita.trim();
      var fechaini = 0;
      var fechafin = 0;
      var horaini = 0;
      var horafin = 0;
      var origen = 0;
      var destino = 0;
      this.loader = true;
      let datos = {
        url: "Financiero/dlls/PrGthSolicitud.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          tipopermiso +
          "|" +
          descripcion +
          "|" +
          fechaini +
          "|" +
          horaini +
          "|" +
          fechafin +
          "|" +
          horafin +
          "|" +
          origen +
          "|" +
          destino +
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
          this.dialogo_capacita.estado = false;
          this.init_form_capacita();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    get_anula(item) {
      let consecutivo = item.consec_rep;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthSolX.DLL",
          data: sessionStorage.Sesion + "|" + consecutivo + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al anular Novedad",
            estado: true,
          });
        });
    },
    guardar_vacacion() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fechainivac) {
        this.errores.fechainivac = true;
        this.send_error("Seleccione fecha Inicial!");
      } else if (!data.fechafinvac) {
        this.errores.fechafinvac = true;
        this.send_error("Seleccione Fecha final!");
      } else {
        this.envio_vacacion(data);
      }
    },
    envio_vacacion(data) {
      this.dialogo_vacacion.estado = false;
      var tipo = data.tiposolicitud.value;
      var tipopermiso = 0;
      var descripcion = data.descripvacac.trim();
      var fechaini = data.fechainivac.replace(/\-/g, "");
      var fechafin = data.fechafinvac.replace(/\-/g, "");
      var horaini = 0;
      var horafin = 0;
      var origen = 0;
      var destino = 0;
      this.loader = true;
      let datos = {
        url: "Financiero/dlls/PrGthSolicitud.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          tipopermiso +
          "|" +
          descripcion +
          "|" +
          fechaini +
          "|" +
          horaini +
          "|" +
          fechafin +
          "|" +
          horafin +
          "|" +
          origen +
          "|" +
          destino +
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
          this.dialogo_vacacion.estado = false;
          this.init_form_vacacion();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    guardar_permiso() {
      var data = JSON.parse(JSON.stringify(this.form));
      let tipo_per = 0;
      let tipopermiso = data.tipopermiso.value;

      if (data.medgral) {
        tipo_per = 1;
      }
      if (data.medespec) {
        tipo_per = 1;
      }
      if (data.examen) {
        tipo_per = 1;
      }
      if (data.odonto) {
        tipo_per = 1;
      }
      if (data.proced) {
        tipo_per = 1;
      }
      if (tipopermiso > 1) {
        tipo_per = 1;
      }

      if (!data.tipopermiso) {
        this.errores.tipopermiso = true;
        this.send_error("Tipo permiso Obligatorio!");
      } else if (!data.descripotro) {
        this.errores.descripotro = true;
        this.send_error("Descripción Obligatoria!");
      } else if (!data.fechaini) {
        this.errores.fechaini = true;
        this.send_error("Seleccione fecha Inicial!");
      } else if (!data.horaini) {
        this.errores.horaini = true;
        this.send_error("Seleccione hora Inicial!");
      } else if (!data.fechafin) {
        this.errores.fechafin = true;
        this.send_error("Seleccione Fecha final!");
      } else if (!data.horafin) {
        this.errores.horafin = true;
        this.send_error("Seleccione hora Final!");
      } else if (tipo_per == 0) {
        this.send_error("Debe indicar el tipo de cita !!");
      } else if (this.dialogo_archivo.model == null) {
        this.errores.archivo = true;
        this.send_error("Debe seleccionar el soporte en Pdf !!");
      } else {
        this.envio_permiso(data);
      }
    },
    async envio_permiso(data) {
      this.dialogo_permiso.estado = false;
      var tipo = data.tiposolicitud.value;
      var tipopermiso = data.tipopermiso.value;
      var descripcion = data.descripotro.trim();
      var fechaini = data.fechaini.replace(/\-/g, "");
      var horaini = data.horaini.replace(/\:/g, "");
      var fechafin = data.fechafin.replace(/\-/g, "");
      var horafin = data.horafin.replace(/\:/g, "");
      var origen = 0;
      var destino = 0;
      let medgral = data.medgral ? data.medgral : 0;
      let medespec = data.medespec ? data.medespec : 0;
      let examen = data.examen ? data.examen : 0;
      let odonto = data.odonto ? data.odonto : 0;
      let proced = data.proced ? data.proced : 0;

      this.loader = true;
      let datos = {
        url: "Financiero/dlls/PrGthSolicitud.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          tipopermiso +
          "|" +
          descripcion +
          "|" +
          fechaini +
          "|" +
          horaini +
          "|" +
          fechafin +
          "|" +
          horafin +
          "|" +
          origen +
          "|" +
          destino +
          "|" +
          medgral +
          "|" +
          medespec +
          "|" +
          examen +
          "|" +
          odonto +
          "|" +
          proced +
          "|",
        method: "",
      };
      await post
        .postData(datos)
        .then((data) => {
          let consecutivo = data[0];
          this.up_file(consecutivo);

          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.loader = false;
          this.dialogo_permiso.estado = false;
          this.init_form_permiso();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    cargarcontenido() {
      post
        .postData({
          url: "Financiero/dlls/PrGthSolicitudJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Sin Solicitudes",
            estado: true,
          });
        });
    },
    select_tipo() {
      let tipo = this.form.tiposolicitud.value;

      switch (tipo) {
        case 1:
          this.dialogo_permiso.estado = true;
          break;
        case 2:
          this.dialogo_vacacion.estado = true;
          break;
        case 3:
          this.dialogo_capacita.estado = true;
          break;
        case 4:
          this.dialogo_desplaza.estado = true;
          break;
      }
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
    init_form_capacita() {
      this.form = {
        tipopermiso: null,
        descripvacac: null,
        fechainivac: null,
        fechafinvac: null,
      };
    },
    init_form_vacacion() {
      this.form = {
        tipopermiso: null,
        descripvacac: null,
        fechainivac: null,
        fechafinvac: null,
      };
    },
    init_form_desplaza() {
      this.form = {
        tipopermiso: null,
        descripvacac: null,
        fechainivac: null,
        fechafinvac: null,
      };
    },
    init_form_permiso() {
      this.form = {
        tipopermiso: null,
        descripotro: null,
        fechaini: null,
        horaini: null,
        fechafin: null,
        horafin: null,
      };

      this.errores = {
        codigo: false,
      };
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          var departamentos = data.departamentos;
          var ciudadesTodas = [];
          departamentos.forEach((dep) => {
            let ciudades = dep.municipios;
            ciudadesTodas = ciudadesTodas.concat(ciudades);
          });

          this.ciudades_dian = ciudadesTodas;
        })
        .catch((err) => {
          console.log("Error ->", err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    subir_soportes(item) {
      this.item_select = item;
      this.dialogo_archivo.estado = true;
    },
    descargar_soportes(item) {
      let empresa = parseFloat(this.empresa.id_empr);
      let consec = parseFloat(item.consec_rep);
      let tipodoc = 5;
      let nombre_pdf = empresa + "_SOLIC_" + consec + "_" + tipodoc + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/GTH/" + nombre_pdf;

      // window.open(url, "_blank").focus();

      const timestamp = new Date().getTime(); // Genera un timestamp único
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank"); // Abre el PDF
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
    },
    async up_file(consecutivo) {
      if (!this.dialogo_archivo.model) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        // this.card_estado = true;
        this.loader = true;
        let session = sessionStorage.Sesion;
        let agencia = sessionStorage.Sede;
        let empresa = parseFloat(this.empresa.id_empr);
        let cargue_pdf = this.dialogo_archivo.model.name;
        let consec = 0;

        if (consecutivo) {
          consec = parseFloat(consecutivo);
        } else {
          consec = parseFloat(this.item_select.consec_rep);
        }
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
          "https://server1ts.net//financiero/inc/api_titan/cargue_gth.php",
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
