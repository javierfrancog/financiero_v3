<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Borrador Formulario Declaración de Renta</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/DIAN110.png"
                  contain
                  width="400"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Periodo"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fecha"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fecha = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-btn
            color="indigo"
            class="ma-2 white--text px-12 d-flex justify-end"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
          <div>
            <v-btn
              color="success"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargaranexos"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Descargar Anexos
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </div>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters> </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              :expanded.sync="expanded"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              primary
              disable-pagination                
              hide-default-footer

            >
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
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
      </v-card>
    </v-dialog>
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
      contenido: [],
      anexos: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Renglon", align: "center", value: "renglon_for" },
        { text: "Descripción", align: "left", value: "descripcion_for" },
        { text: "Valor", align: "center", value: "saldo_for" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fecha: false,
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
      total_valor: 0,
    };
  },
  created() {},
  computed: {},
  methods: {
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      if (!this.form.fecha) {
        this.errores.fecha = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar un periodo",
          estado: true,
        });
      } else {
        var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpformDianJ.dll",
            data:
              sessionStorage.Sesion + "|" + "110" + "|" + fecha + "|" + 0 + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
            this.contenido.pop();

            let valor_total = 0;
            this.contenido.forEach((el) => {
              let valor = parseFloat(el.rte_for.replace(/\,/g, "")) || 0;
              valor_total += valor;
            });

            this.total_valor = valor_total;
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Información",
              estado: true,
            });
          });
      }
    },

    cargaranexos() {
      if (!this.form.fecha) {
        this.errores.fecha = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar un periodo",
          estado: true,
        });
      } else {
        var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpformDianAJ.dll",
            data: sessionStorage.Sesion + "|" + "110" + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.anexos = JSON.parse(JSON.stringify(data));
            this.print_reporte_excel();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },

    print_reporte_excel() {
      var data = this.anexos;
      var data_parse = [];
      var anterior = null;
      var siguiente = false;

      var totales = {
        debitos: 0,
        creditos: 0,
      };

      data.forEach((el, index) => {
        anterior = el.renglon_rep;
        if (!siguiente) siguiente = el.renglon_rep;

        let copia = JSON.parse(JSON.stringify(el));
        let debito = parseFloat(el.debito_rep.replace(/\,/g, "")) || 0;
        let credito =
          parseFloat(el.credito_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
          0;

        copia.debito_rep = debito;
        copia.credito_rep = credito;
        copia.debito_rep = debito + credito

        copia.base_rep =
          parseFloat(el.base_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) || 0;

        if (anterior != siguiente) {
          data_parse.push({
            renglon_rep: null,
            descrenglon_rep: null,
            codcta_rep: null,
            fecha_rep: null,
            descripcta_rep: "TOTAL RENGLON",
            docinter_rep: null,
            debito_rep: totales.debitos + totales.creditos,
            credito_rep: totales.creditos,
            base_rep: null,
            detalle_rep: null,
            // docabrev_rep: null,
            // nombredoc_rep: null,
            // registro_rep: null,
            // rut_rep: null,
          });

          totales = {
            debitos: debito,
            creditos: credito,
          };
        } else {
          totales.debitos += debito;
          totales.creditos += credito;
        }
        data_parse.push(copia);

        siguiente = anterior;
      });

      var columnas = [
        {
          title: "Renglon",
          value: "renglon_rep",
        },
        {
          title: "Descripcion Renglon",
          value: "descrenglon_rep",
        },

        {
          title: "Cuenta",
          value: "codcta_rep",
        },
        {
          title: "Descripción cuenta",
          value: "descripcta_rep",
        },
        {
          title: "Valor",
          value: "debito_rep",
          format: "money",
        },

      ];

      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var cuenta_contable = this.form.cuentaContable
        ? `${
            this.form.cuentaContable.cod_puc.trim() +
            " - " +
            this.form.cuentaContable.descrip_puc.trim()
          }`
        : "Todas las cuentas";
      var rut_procesado = this.form.selruts
        ? `${
            this.form.selruts.identificacion_rut.trim() +
            " - " +
            this.form.selruts.descripcion_rut.trim()
          }`
        : "Todos los ruts";
      var header_format = [
        { text: "ANEXO RENTA", bold: true, size: 16 },
        `Periodo: ${this.form.fecha}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo Renta",
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `ANEXO RENTA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
  },
};
</script>
<style>
#rpformrtefte .v-data-table__wrapper table tbody tr:nth-child(even) {
  background-color: #e2f8e3 !important;
}
</style>
