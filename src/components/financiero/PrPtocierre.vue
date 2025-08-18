<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-door-closed-lock</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cierre de Caja</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaInicial"
                      label="Fecha Cierre"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechacierre"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  clearable
                  hide-details
                  outlined
                  return-object
                  @change="errores.punto_fact = false"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-btn
                color="indigo"
                class="ma-5 white--text px-12"
                large
                depressed
                @click="consultar()"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      class="mr-2"
                      icon
                      depressed
                      v-on="on"
                      @click="imprimir(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="green darken-2"
                      class="mr-2"
                      icon
                      depressed
                      v-on="on"
                      @click="get_anexo(item)"
                    >
                      <v-icon right dark class="ml-4"
                        >mdi-file-excel-box</v-icon
                      >
                    </v-btn>
                  </template>
                  <span>Anexo</span>
                </v-tooltip>
              </template>
            </v-data-table>
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
import { cierreCajaPto } from "../../_formatos.pdf.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
      },
      money1: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      ruts3: [],
      agencias: [],
      pickeFechaIni: false,
      perfil: "0",
      search: "",
      puntos: "",
      ptosrecaudo: [],
      disabledpunto_fact: false,
      form: {
        efectivo: null,
        base: null,
      },
      headers: [
        { text: "Punto Recaudo", align: "center", value: "agencia_rep" },
        { text: "Ventas", align: "center", value: "tventas_rep" },
        { text: "Recaudos", align: "center", value: "trecaudo_rep" },
        { text: "Pagos Anticipado", align: "center", value: "tpagoant_rep" },
        { text: "Efectivo", align: "center", value: "efectivo_rep" },
        { text: "Transferencia", align: "center", value: "transferencia_rep" },
        { text: "Egresos", align: "center", value: "tegresos_rep" },
        { text: "Total Entregado", align: "center", value: "tentregado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
      efectivo: null,
    };
  },
  created() {
    this.get_empresa();
    this.get_ruts3();
    this.cargarTablaAg();
    this.form.fechaInicial = this.$moment().format("YYYY-MM-DD");
  },
  computed: {},
  methods: {
    imprimir(data) {
      let fecha = this.$moment().format("YYYY-MM-DD");
      let data_impresion = { ...data };
      let empresa = this.datosEmpresa;

      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: empresa.ideditado_empr,
        direccionEmpresa: empresa.direccion_empr,
        ciudadEmpresa: empresa.Ciudad,
        dptoEmpresa: empresa.Departamento,
        telfEmpresa: empresa.telefono_empr,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data_impresion.logo = logo;
        cierreCajaPto(data_impresion, fecha).then(() => {
          console.log("Impresión terminada");
        });
      });
    },
    get_anexo() {
      let fechaini = this.form.fechaInicial.replace(/\-/g, "");
      var punto = this.form.punto_fact.codigo_agc;

      post
        .postData({
          url: "ptovta/dlls/PrPtocierredetJ.dll",
          data: sessionStorage.Sesion + "|" + fechaini + "|" + punto + "|",
          method: "",
        })
        .then((data) => {
          this.contenidoExcel = data;
          this.print_reporte_excel();
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar detallado",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenidoExcel));
      var data_parse = data;

      var columnas = [
        {
          title: "Tipo Operación",
          value: "tipo_rep",
          format: "string",
        },
        {
          title: "Prefijo",
          value: "pref_rep",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "nro_rep",
        },
        {
          title: "Vlr Efectivo",
          value: "vta_efectivo_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Credito",
          value: "vta_credito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Transferencia",
          value: "vta_transf_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

      ];
      var header_format = [
        {
          text: "Anexo Cierre",
          bold: true,
          size: 16,
        },
        // `Responsable: ${this.form.placas.placa_veh}`,
        `Periodo Inicial: ${this.form.fechaInicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo Cierre de Caja",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Anexo cierre-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultar() {
      var fechaini = this.form.fechaInicial.replace(/\-/g, "");
      var punto = this.form.punto_fact.codigo_agc;
      this.loader = true;
      post
        .postData({
          url: "ptovta/dlls/PrPtocierreJ.dll",
          data: sessionStorage.Sesion + "|" + fechaini + "|" + punto + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;

          this.contenido = JSON.parse(JSON.stringify(data));

          let data_copia = [...this.contenido];
          data_copia.forEach((el, i) => {
            let vtaEfec =
              parseFloat(el.vta_efectivo_rep.replace(/\,/g, "")) || 0;
            let vtaTransf =
              parseFloat(el.vta_transf_rep.replace(/\,/g, "")) || 0;
            let vtaCred =
              parseFloat(el.vta_credito_rep.replace(/\,/g, "")) || 0;

            let recEfec =
              parseFloat(el.rec_efectivo_rep.replace(/\,/g, "")) || 0;
            let recTransf =
              parseFloat(el.rec_transf_rep.replace(/\,/g, "")) || 0;

            let antEfec =
              parseFloat(el.ant_efectivo_rep.replace(/\,/g, "")) || 0;
            let antTransf =
              parseFloat(el.ant_transf_rep.replace(/\,/g, "")) || 0;

              let sdocaja =
              parseFloat(el.sdo_caja_rep.replace(/\,/g, "")) || 0;

            let totalVta = vtaEfec + vtaTransf + vtaCred;
            let totalRec = recEfec + recTransf;
            let totalAnt = antEfec + antTransf;
            let totalEfec = vtaEfec + recEfec + antEfec;
            let totalTrans = vtaTransf + recTransf + antTransf;

            let totalEgr = 0;
            el.egresos.forEach((eg) => {
              totalEgr += parseFloat(eg.egr_valor_rep.replace(/\,/g, "")) || 0;
            });

            let totalEntregado = totalEfec - totalEgr + sdocaja;

            data_copia[i] = {
              ...el,
              tventas_rep: this.formatNumero(totalVta),
              trecaudo_rep: this.formatNumero(totalRec),
              tpagoant_rep: this.formatNumero(totalAnt),
              efectivo_rep: this.formatNumero(totalEfec),
              transferencia_rep: this.formatNumero(totalTrans),
              tegresos_rep: this.formatNumero(totalEgr),
              tentregado_rep: this.formatNumero(totalEntregado),
            };
          });

          this.contenido = [...data_copia];
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ubicaciones",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar colaboradores",
            estado: true,
          });
        });
    },
    init_form() {
      this.form.efectivo = 0;
      this.form.base = 0;

      this.errores = {
        codigo: false,
      };
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
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
          this.perfil = sessionStorage.Perfil;

          this.disabledpunto_fact = true;

          // let busqueda = this.agencias.find(
          //   (el) => el.codigo_agc == this.datosEmpresa.ptoperfil_empr
          // );
          // this.form.punto_fact = busqueda ;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
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
  },
};
</script>
