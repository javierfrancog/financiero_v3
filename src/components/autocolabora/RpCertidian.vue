<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-card-account-details-star-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Certificado de Ingresos y Retenciones
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="2">
            <v-select
              :items="años_select"
              label="Año"
              outlined
              clearable
              hide-details
              v-model="form.periodo_cargue"
              item-text="text"
              item-value="value"
              required
              :error="errores.anoselect"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
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
        <v-row> </v-row>
        <v-divider color="#FF6F00"></v-divider>

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
import { certiDian } from "../../_formatos_gth.js";

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
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargar_años();
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;

      this.form.periodo_cargue = anioActual;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    get_certificado() {
      this.loader = true;
      let ano = this.form.periodo_cargue;
      var colaborador = sessionStorage.Sesion.substr(15,15);
      post
        .postData({
          url: "Financiero/dlls/RpGthCerdianJ.dll",
          data: sessionStorage.Sesion + "|" + ano + "|" + colaborador + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.imprimir_pdf(data[0]);
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
    async imprimir_pdf(data) {
      let logo_dian_src = require(`../../assets/image/logos/DIAN.png`);
      let logo_dian = await this.pdfs.getBase64(logo_dian_src);

      let logo_220_src = require(`../../assets/image/logos/DIAN220.png`);
      let logo_220 = await this.pdfs.getBase64(logo_220_src);

      data.logo_dian = logo_dian;
      data.logo_220 = logo_220;
      certiDian(data).then(() => {
        console.log("Impresión terminada");
      });
    },
    format_colabora(val) {
      return `${
        parseInt(val.idcolabora_rep) || 0
      } - ${val.Apellido1colabora_rep.trim()} ${val.nombrescolabora_rep.trim()}`;
    },
    get_ruts3() {
      var _this = this;

      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => {
            let busqueda = _this.colaborador.find(
              (item) => item.idcolabora_rep == el.identificacion_rut
            );

            if (busqueda && parseInt(busqueda.fecharetcolabora_rep) != 0) {
              return true;
            }
            return false;
          });
          this.ruts3 = filtro;
        })
        .catch((err) => {
          console.error(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar colaboradores",
            estado: true,
          });
        });
    },
  },
};
</script>
