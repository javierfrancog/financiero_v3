<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alert-decagram</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Eventos de Facturación</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="2">
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
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="2">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <!-- <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Aprobados', value: 1 },
                    { text: 'Sin Validar', value: 3 },
                    { text: 'Rechazados', value: 2 },
                    { text: 'Todos', value: 9 },
                  ]"
                  label="Estado"
                  clearable
                  hide-details
                  return-object
                  v-model="form.estado"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.estado"
                  @change="consultar_reporte(), (errores.tipoorden = false)"
                ></v-select>
              </v-col> -->
              <!-- <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Contributivo', value: 8 },
                    { text: 'Subsidiado', value: 1 },
                    { text: 'Particular', value: 2 },
                    { text: 'Otro', value: 9 },
                  ]"
                  label="Regimen"
                  clearable
                  hide-details
                  return-object
                  v-model="form.regimen"
                  item-text="text"
                  item-value="value"
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col> -->
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col>
                <v-btn
                  color="indigo darken-3 white--text"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="consultar_reporte"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>

              <!-- <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col> -->
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />

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
              item-key="consec_rep"
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="pl-4">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Descripción</th>
                          <th class="text-left">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in item.productos_rep" :key="row.item">
                          <td class="text-left">{{ row.descripcion_rep }}</td>
                          <td class="text-left">{{ row.cantidad_rep }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>
              <template v-slot:item.idpac_rep="{ item }">
                {{ parseInt(item.idpac_rep) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printdisp_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Acta de Entrega</span>
                </v-tooltip>

                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="item.idsoporte_rep.trim() == ''"
                      @click="downloadFile(item, 1)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-chevron-double-up</v-icon>
                    </v-btn>
                  </template>
                  <span>Soportes Entrega</span>
                </v-tooltip> -->

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="item.factura_rep.trim() > 0"
                      @click="open_valida(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-check-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Responder</span>
                </v-tooltip>

              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogovalida.estado" max-width="900px">
      <template>
        <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
          <v-card-title>
            <span class="title col-12">Respuesta Rechazo Facturación</span>
          </v-card-title>
          <v-card-text>
            <v-row class="d-flex">
              <!-- <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Aprobado', value: 1 },
                    { text: 'Rechazado', value: 2 },
                  ]"
                  label="Tipo Novedad"
                  clearable
                  hide-details
                  return-object
                  v-model="form.tiponovedad"
                  item-text="text"
                  item-value="value"
                  @change="change_tipo()"
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col> -->
              <!-- <v-col class="d-flex" cols="6" v-if="habilita_novedad">
                <v-select
                  :items="novedad"
                  label="Novedad"
                  clearable
                  hide-details
                  return-object
                  v-model="form.novedad"
                  item-value="value"
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col> -->
            </v-row>

            <v-row class="d-flex mb-4" no-gutters>
              <v-col class="mt-3 d-flex" cols="10" v-if="habilita_novedad">
                <v-text-field
                  label="Observaciones"
                  outlined
                  v-model="form.observacion"
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-8 d-flex" color="#FF6F00"></v-divider>

            <v-row justify="center" class="mt-2 d-flex">
              <v-col class="d-flex">
                <v-btn
                  color="purple"
                  class="white--text px-12"
                  depressed
                  large
                  @click="downloadFile()"
                >
                  Ver Soportes
                </v-btn>
              </v-col>

              <v-col class="d-flex">
                <v-btn
                  color="indigo"
                  class="white--text px-12"
                  depressed
                  :disabled="habilita_validar == true"
                  large
                  @click="grabar_novedad()"
                >
                  Grabar
                </v-btn>
              </v-col>

              <v-col class="d-flex">
                <v-btn
                  color="red accent-4"
                  class="white--text px-12"
                  depressed
                  large
                  @click="dialogovalida.estado = false"
                >
                  Cancelar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { dispensacion, prefactura_titan } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      pterad: null,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      item_sel: [],
      expanded: [],
      contenido: [],
      tablaruts: [],
      empresa: [],

      dialogovalida: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Paciente", align: "center", value: "descrpaciente_rep" },
        { text: "Estado", align: "center", value: "descnovedad_rep" },
        { text: "Observación", align: "center", value: "obsevento_rep" },
        { text: "Autorización", align: "center", value: "autorizacion_rep" },
        { text: "Dispensó", align: "center", value: "elabora_rep" },
        { text: "Rechaza", align: "center", value: "userevento_rep" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        estado:false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.get_empresa();
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          this.idusuario = parseFloat(sessionStorage.Sesion.substr(15, 15));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    change_tipo() {
      this.habilita_novedad = false;
      let tipo = this.form.tiponovedad.value;
      if (tipo == 2) {
        this.habilita_novedad = true;
      }
    },
    open_valida(item) {
      this.item_sel = item;
      this.dialogovalida.estado = true;
      this.form.tiponovedad = null;
      this.form.observacion = null;
      this.habilita_validar = true;
    },

    grabar_novedad() {
      console.log(this.form);
      let fecha = this.item_sel.fecha_rep.substr(0, 4);
      let consec = this.item_sel.consec_rep;
      let agencia = this.item_sel.idagenc_rep;
      let novedad = this.form.tiponovedad.value;
      let motivo = this.form.novedad ? this.form.novedad.value : 0;
      let observacion = this.form.observacion
        ? this.form.observacion.trim()
        : "";
      post
        .postData({
          url: "Dispensa/dlls/PrFactNov.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            consec +
            "|" +
            novedad +
            "|" +
            observacion +
            "|" +
            motivo +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.dialogovalida.estado = false;
          this.consultar_reporte();
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    async printdisp_item(item) {
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = "";

          try {
            let idelabora = data.idelabora.trim();
            firma_src = require(`../../assets/image/firmas/${idelabora}.png`);
          } catch (err) {
            firma_src = require(`../../assets/image/firmas/vacio.png`);
          } finally {
            let firma = await this.pdfs.getBase64(firma_src);
            data.firma = firma;
          }

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            dispensacion(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },

    async printdispos_item(item) {
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            dispensacion_pos(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printpend_item(item) {
      let agencia = item.idagencpte_rep;
      let consecutivo = item.consecpte_rep;

      var datosEnvio = sessionStorage.Sesion + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            pendientes_pos(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printcopago_item(item) {
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            copago_pos(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async downloadFile(item, tipo) {
      let idFile = this.item_sel.idsoporte_rep.trim();
      if (idFile == "") {
        this.habilita_validar = true;
      } else {
        this.habilita_validar = false;
      }

      const url =
        "https://storage.googleapis.com/documentos_titan/DISPENSA/" + idFile;
      window.open(url, "_blank").focus();
    },

    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Bloqueado";
    },

    print_reporte_excel() {
      if (!this.form.puntos) {
        this.errores.puntos = true;
        this.send_error("Selecciona una sede");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.puntos.codigo_agc;
        let ressede = this.form.ressede ? 1 : 0;
        let resfunc = this.form.resfunc ? 1 : 0;

        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          ressede,
          resfunc,
        ];
        this.postData({
          url: "dispensa/dlls/RpDispensaEx01J.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            let data_parse = JSON.parse(JSON.stringify(data));
            this.montar_excel(data_parse);
          })
          .catch((err) => {
            this.loader = false;
            console.log("Error", err);
            this.$emit(
              "msj",
              err.Mensaje ? err.Mensaje[0].msg : err,
              "red",
              1000
            );
          });
      }
    },

    montar_excel(data) {
      var data_parse = data;

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Sede",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "consec_rep",
          format: "string",
        },
        {
          title: "Id_Paciente",
          value: "idpac_rep",
          format: "number",
        },
        {
          title: "Paciente",
          value: "descrpaciente_rep",
          format: "string",
        },
        {
          title: "Dirección",
          value: "direccionpaciente_rep",
          format: "string",
        },
        {
          title: "Telefono",
          value: "telefonopaciente_rep",
          format: "string",
        },
        {
          title: "Eps",
          value: "descripeps",
          format: "string",
        },
        {
          title: "Regimen",
          value: "nomregimen",
          format: "string",
        },

        {
          title: "Tipo Servicio",
          value: "tiposervicio",
          format: "string",
        },
        {
          title: "Tipo Orden",
          value: "tipoorden",
          format: "string",
        },
        {
          title: "Domicilio",
          value: "domicilio",
          format: "string",
        },
        {
          title: "Tutela",
          value: "tutela",
          format: "string",
        },
        {
          title: "PQR",
          value: "pqr",
          format: "string",
        },
        {
          title: "Gestante",
          value: "gestante",
          format: "string",
        },
        {
          title: "Dx",
          value: "dx_rep",
          format: "string",
        },
        {
          title: "Medicamento",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Lote",
          value: "lote_rep",
          format: "string",
        },

        {
          title: "Cantidad",
          value: "cantidad_rep",
        },

        {
          title: "Estado",
          value: "estado_rep",
          format: "string",
        },
        {
          title: "Copago",
          value: "copago_rep",
          format: "number",
        },
        {
          title: "Moderadora",
          value: "moderadora_rep",
          format: "number",
        },
        {
          title: "Fecha Formula",
          value: "fechaform_rep",
          format: "string",
        },
        {
          title: "Fecha Autorización",
          value: "fechaauto_rep",
          format: "string",
        },
        {
          title: "Estado_Soporte",
          value: "soporte_rep",
          format: "string",
        },
        {
          title: "Id_Tirilla",
          value: "idtirilla_rep",
          format: "string",
        },
        {
          title: "Funcionario",
          value: "elabora_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE DISPENSACIONES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Dispensacion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE DISPENSACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultar_reporte() {

        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        // let estado = this.form.estado.value;
        let estado = 9;

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          estado,
        ];
        this.postData({
          url: "dispensa/dlls/RpDispFact02J.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));

            if (this.form.ressede) this.graficar(this.contenido);
          })
          .catch((err) => {
            this.loader = false;
            console.log("Error", err);
            this.$emit(
              "msj",
              err.Mensaje ? err.Mensaje[0].msg : err,
              "red",
              1000
            );
          });
      
    },
    calcular_final() {
      this.form.fechaFinal = this.form.fechaInicial;
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
