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
                    >Declaración Retención Impuesto de Industria y
                    Comercio</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/ICA.png"
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
                  v-model="form.fechaini"
                  label="Periodo Inicial"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechaini"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaini"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechaini = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMesfin"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechafin"
                  label="Periodo Final"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechafin"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechafin"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechafin = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              label="id_Municipio"
              v-model="form.municipio"
              :items="ruts"
              :item-text="format_ruts"
              item-value="identificacion_rut"
              hide-details
              return-object
              outlined
            ></v-autocomplete>
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
          <div>
            <v-btn
              color="red lighten-1"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="imprimir_pdf"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Imprimir
              <v-icon right dark>print</v-icon>
            </v-btn>
          </div>
        </v-row>

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
              :expanded.sync="expanded"
              show-expand
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              primary
            ></v-data-table>
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
import { reteica } from "../../_formatos.pdf";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      pickerMesfin: false,
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
      empresa: {},
      anexos: [],
      ruts: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        // { text: "Renglon", align: "left", value: "renglon_for" },
        { text: "Descripción", align: "left", value: "descripcion_for" },
        { text: "Base", align: "center", value: "base_for" },
        { text: "Valor", align: "center", value: "rte_for" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        fechafin: false,
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
    };
  },
  created() {
    this.get_empresa();
    this.get_ruts();
  },
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
    get_empresa() {
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },

    cargarcontenido() {
      if (!this.form.fechaini) {
        this.errores.fechaini = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo inicial",
          estado: true,
        });
      } else {
        var fechaini = this.form.fechaini
          ? this.form.fechaini.replace(/\-/g, "")
          : "";
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";
        var rut = this.form.municipio.identificacion_rut;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpformIcaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|" +
              rut +
              "|",
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
              text: "Error al cargar Datos Ica",
              estado: true,
            });
          });
      }
    },

    cargaranexos() {
      if (!this.form.fechaini) {
        this.errores.fechaini = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar periodo inicial",
          estado: true,
        });
      } else {
        var fecha = this.form.fechaini
          ? this.form.fechaini.replace(/\-/g, "")
          : "";
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";
        var rut = this.form.municipio.identificacion_rut;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpformIcaAJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              fecha +
              "|" +
              fechafin +
              "|" +
              rut +
              "|",
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

    imprimir_pdf() {
      if (!this.form.fechaini) {
        this.errores.fechaini = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo inicial",
          estado: true,
        });
      } else {
        var fechaini = this.form.fechaini
          ? this.form.fechaini.replace(/\-/g, "")
          : "";
        var fechafin = this.form.fechafin
          ? this.form.fechafin.replace(/\-/g, "")
          : "";
        var rut = this.form.municipio.identificacion_rut;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpformIcaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|" +
              rut +
              "|",
            method: "",
          })
          .then((dataJSON) => {
            this.loader = false;
            dataJSON.pop();

            let data = {
              descripcion_rut: this.form.municipio.descripcion_rut.trim(),
              identificacion_rut: parseInt(rut),
              ...this.empresa,
              fecha_impr: this.$moment().format("YYYY-MM-DD"),
              hora_impr: this.$moment().format("HH:mm"),
              añogravable: fechaini.substr(0,4),
              periodo: `${this.formatMesLetras(fechaini).substr(0,3)} - ${this.formatMesLetras(fechafin).substr(0,3)}`,
              renglones: dataJSON,
            };
    
            // var logo_src = require(`../../assets/image/clientes/${parseFloat(

            //   sessionStorage.Sesion.substr(0, 15)
            // )}.png`);
            var logo_src = require(`../../assets/image/logos/logovcio.png`);            

            this.pdfs.getBase64(logo_src).then((logo) => {
              data.logo = logo;
              reteica(data).then(() => {
                console.log("Impresion terminada");
              });
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Datos Ica",
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

        copia.base_rep =
          parseFloat(el.base_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) || 0;

        if (anterior != siguiente) {
          data_parse.push({
            renglon_rep: null,
            descrenglon_rep: null,
            codcta_rep: null,
            descripcta_rep: null,
            fecha_rep: null,
            descriprut_rep: "TOTAL RENGLON",
            docinter_rep: null,
            debito_rep: totales.debitos,
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
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Descripcion",
          value: "descriprut_rep",
        },
        {
          title: "Doc. interno",
          value: "docabrev_rep",
        },
        {
          title: "Vlr débito",
          value: "debito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr crédito",
          value: "credito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Base",
          value: "base_rep",
          format: "money",
        },

        {
          title: "Detalle",
          value: "detalle_rep",
        },
      ];

      var fecha_inicial = this.form.fechaini;
      var fecha_final = this.form.fechafin;

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
        { text: "ANEXO ICA", bold: true, size: 16 },
        `Periodo: ${fecha_inicial + "_" + fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/logos/logovcio.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo Ica",
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `ANEXO ICA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    formatMesLetras: function(fecha) {
      let mes = new Date(0, parseInt(fecha.substr(4,2)), 0);
      return this.$moment(mes).format("MMMM");
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
