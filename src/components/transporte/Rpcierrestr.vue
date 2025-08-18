<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cierres de Caja</v-list-item-title
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
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Cierre</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anexo_item(item)"
                      color="green"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      :disabled="item.estado_rep.trim() === 'Anulado'"                      
                    >
                      <v-icon>mdi-chart-timeline</v-icon>
                    </v-btn>
                  </template>
                  <span>Anexo Cierre</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="cargar_item(item)"
                      color="orange"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      :disabled="item.estado_rep.trim() === 'Anulado'"
                    >
                      <v-icon>mdi-chart-timeline</v-icon>
                    </v-btn>
                  </template>
                  <span>Actualizar Cierre</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogo_editar.estado" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">
          Actualizar Cierre {{ dialogo.titulo2 }}</v-card-title
        >
        <v-card-text>
          <v-col cols="6" class="d-flex justify-center">
            <span class="title col-12">{{ dialogo.titulo }}</span>
          </v-col>
          <v-row class="justify-center mt-0">
            <v-col cols="12" md="8">
              <v-row class="text-body-1 font-weight-medium" no-gutters>
                <v-col cols="8">
                  <v-card class="pa-4 font-weight-regular" tile outlined>
                    Avance
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    prefix="$"
                    outlined
                    hide-details
                    clearable
                    :value="formatNumero(form.avances)"
                    @keypress="lettersDisabled()"
                    @input="input_mask('avances')"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cerrar_editar">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="grabar_editar">
            Grabar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";
import { cuadre_cajatr } from "../../_formatos_trans.js";

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
      dialogo_editar: {
        estado: false,
        tipo: 0,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      itemselecc: [],
      contenido: [],
      contenidoExcel: [],
      pickeFechaIni: false,
      search: "",
      puntos: "",
      ptosrecaudo: [],

      cierre: {},      
      form: {
        avances: 0
      },

      headers: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Hora", align: "center", value: "hora_rep" },

        { text: "Agencia", align: "left", value: "punto_rep" },
        { text: "Consecutivo", align: "center", value: "consec2_rep" },
        { text: "Taquillero", align: "left", value: "desccajero_rep" },
        { text: "Total Cierre", align: "center", value: "trecaudo_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.data_msg = true
    this.get_empresa();
    this.form = {
      fechaInicial: this.$moment().format("YYYY-MM-DD"),
    };
  },
  computed: {},
  methods: {
    cerrar_editar() {
      this.dialogo_editar.estado = false;
    },
    grabar_editar() {
      this.dialogo_editar.estado = false;
      this.loader = true;
      let agencia = this.itemselecc.codpunto_rep;
      let idcuadre = parseInt(this.itemselecc.consecutivo_rep);
      let avances = this.form.avances.replace(/\,/g, "").trim();

      var datos = {
          url: "Transporte/dlls/PrCuadreM.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            idcuadre +
            "|" +
            avances +
            "|",
          method: "",
        };      
        post
          .postData(datos)
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
            color: "success",
            text: "Cuadre de Caja Actualizado",
            estado: true,
          });
          this.consultar();


          })
          .catch((error) => {
            this.loader = false;
            this.send_error("Error al actualizar Cuadre");
          });
    },        
    cargar_item(item) {
      this.itemselecc = item;
      let consecutivo = item.consecutivo_rep.trim();
      let agencia = item.codpunto_rep;
      post
        .postData({
          url: "Transporte/dlls/PrCuadre2VJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let dataImpresion = JSON.parse(JSON.stringify(data));
          this.dialogo_editar.estado = true;     
          this.form.avances =  dataImpresion[0].avances_cua.replace(/\,/g, "");
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },    
    consultar: function () {
      this.loader = true;
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      post
        .postData({
          url: "Transporte/dlls/RpCierre01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          this.loader = false;
          this.send_error(err.Mensaje[0].msg);
        });
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    print_item(item) {
      let consecutivo = item.consecutivo_rep.trim();
      let agencia = item.codpunto_rep;
      post
        .postData({
          url: "Transporte/dlls/PrCuadre2VJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let dataImpresion = JSON.parse(JSON.stringify(data));

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataImpresion[0].logo = logo;
            cuadre_cajatr(dataImpresion[0]).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },
    anexo_item(item) {
      let fecha = item.fecha_rep.replace(/\-/g, "");
      let idtaquillero = item.cajero_rep;
      let turno = 0;
      let agencia = item.codpunto_rep;
      let consecutivo = item.consecutivo_rep.trim();
      post
        .postData({
          url: "Transporte/dlls/RpAnexocajaJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            idtaquillero +
            "|" +
            turno +
            "|" +
            agencia +
            "|" +
            consecutivo +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenidoExcel = data;
          this.print_reporte_excel();
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },
    print_reporte_excel() {
      var data = this.contenidoExcel;
      var data_parse = data.map((el) => {
        let valor = parseInt(el.valor_rep.trim()) || 0;
        let documento = el.tipodoc_rep.trim();
        if (documento == "EGRESO") {
          valor = valor * -1;
        }
        el.valor_rep = valor;
        return el;
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Tipo Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Número",
          value: "documento_rep",
        },

        {
          title: "Valor",
          value: "valor_rep",
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
        `Periodo Inicial: ${this.form.fecha}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo",
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
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Recaudos/dlls/CfConveniorcJ.dll",
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
            text: "Error al cargar Convenios",
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
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
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },    
  },
};
</script>
