<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-certificate-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Certificado Laboral
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="mb-8">
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  @change="cargarcolaborador()"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Seleccione el Colaborador"
                  v-model="form.selruts"
                  :items="colaborador"
                  :item-text="format_ruts"
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  clearable
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12 d-flex justify-end"
                  large
                  depressed
                  @click="get_certificado"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Generar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
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
import { certLaboral } from "../../_formatos_gth.js";

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

      ruts3: [],
      contenido: [],
      colaborador: [],
      search: "",
      datosEmpresa: [],
      años_select: [],

      form: {},

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        colabora: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogoModificar: {
        estado: false,
        data: false,
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
      historico: {
        estado: false,
      },
      datos_historico: [],
    };
  },
  created() {
    this.get_empresa();
    this.cargar_años();
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          let idfirma = parseFloat(this.datosEmpresa.idthumano_empr);
          if (!idfirma) {
            this.send_error("Falta configurar Firmas!!");
          }
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
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
    cargarcolaborador() {
      this.loader = true;
      let ano = this.form.periodo_cargue;
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|" + ano + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },
    format_ruts: function (val) {
      return `${val.Apellido1colabora_rep}  ${val.nombrescolabora_rep}`;
    },
    get_certificado() {
      this.loader = true;
      var colaborador = parseFloat(this.form.selruts.idcolabora_rep);
      //      colaborador = 1120499917
      post
        .postData({
          url: "Financiero/dlls/RpGthCerLabJ.dll",
          data: sessionStorage.Sesion + "|" + colaborador + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data = data[0];
          data.empresa = this.datosEmpresa.descrip_empr.trim();
          data.idempresa = this.datosEmpresa.ideditado_empr;
          data.direccion = this.datosEmpresa.direccion_empr.trim();
          data.telefono = this.datosEmpresa.telefono_empr.trim();
          data.ciudad =
            this.datosEmpresa.Ciudad.trim() +
            "-" +
            this.datosEmpresa.Departamento.trim();

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          var firma_src = require(`../../assets/image/firmas/${parseFloat(
            data.idfirma_rep
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            this.pdfs.getBase64(firma_src).then((firma) => {
              data.firma = firma;
              certLaboral(data).then(() => {
                console.log("Impresion terminada");
              });
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al generar Certificado",
            estado: true,
          });
        });
    },
  },
};
</script>
