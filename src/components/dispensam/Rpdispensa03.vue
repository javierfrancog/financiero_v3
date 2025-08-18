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
                >mdi-format-list-numbered</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Dispensación</v-list-item-title
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
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
                      outlined
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
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Sede"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="errores.puntos = false"
                  :error="errores.puntos"
                ></v-autocomplete>
              </v-col>
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

              <v-col>
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
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="form.ressede"
            >
              <v-col cols="12">
                <canvas id="grafico1"></canvas>
              </v-col>
            </v-row>
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
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

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printdispos_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-paper-roll-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Tirilla Entrega</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printpend_item(item)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-cloud-print-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Pendientes</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printcopago_item(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-currency-usd</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Recibo de Caja</span>
                </v-tooltip>

                <v-tooltip top>
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
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Soportes Entrega</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="item.idtirilla_rep.trim() == ''"
                      @click="downloadFile(item, 2)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-text-box-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Soporte Tirilla Pte</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_file(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-cloud-arrow-up-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir Soportes</span>
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
    <v-dialog v-model="dialogocargue.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Cargue Documentos</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Soporte Entrega', value: 1 },
                  { text: 'Tirilla Pendientes', value: 2 },
                ]"
                label="Tipo Documento"
                clearable
                hide-details
                return-object
                v-model="form.tipodocum"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-file-input
                label="Cargar Documentos"
                accept=".pdf"
                outlined
                hide-details
                v-model="form.pdf"
              ></v-file-input>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn
                color="purple"
                class="white--text px-12"
                depressed
                large
                @click="subir_pdf"
              >
                Grabar Soporte
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-end">
              <v-btn
                color="red accent-4"
                class="white--text px-12"
                depressed
                large
                @click="dialogocargue.estado = false"
              >
                Cerrar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import Chart from 'chart.js/auto'
import { FlowerSpinner } from "epic-spinners";
import { dispensacion } from "../../_formatos_disp.js";
import { dispensacion_pos } from "../../_formatos_disp.js";
import { pendientes_pos } from "../../_formatos_disp.js";
import { copago_pos } from "../../_formatos_disp.js";

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
      convenios: [],
      ptosrecaudo: [],
      empresa: [],
      dialogocargue: {
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
        { text: "", value: "data-table-expand" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Paciente", align: "center", value: "descrpaciente_rep" },
        { text: "Id Paciente", align: "center", value: "idpac_rep" },
        { text: "Dispensa", align: "center", value: "elabora_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        puntos: false,
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
    this.cargaragencias();
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
    get_file(item) {
      this.item_sel = item;
      this.dialogocargue.estado = true;

      this.form.pdf = null;
    },
    async subir_pdf() {
      this.card_estado = true;

      let session = sessionStorage.Sesion;
      let agencia = this.item_sel.idagenc_rep;
      let empresa = this.empresa.descrip_empr.trim();
      let cargue_pdf = this.form.pdf.name;
      let consec = parseFloat(this.item_sel.consec_rep);
      let clasif = this.form.tipodocum.value;
      let consecpte = 0;
      let agcpte = 0;
      let codigo = "";
      let tipodoc = "02";
      let nombre_pdf = "DSP_" + agencia + "_" + consec + "_" + clasif + ".pdf";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("clasif", clasif);
      data.append("consecutivo", consec);
      data.append("file", this.form.pdf);
      data.append("agencia", agencia);
      data.append("codigo", codigo);
      data.append("consecpte", consecpte);
      data.append("agcpte", agcpte);

      let response = await fetch(
        "https://server3ts.com//financiero/inc/cargue.googledrive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;

      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
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

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
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
      console.log(item);
      let idFile = null;
      if (tipo == 1) {
        idFile = item.idsoporte_rep.trim();
      } else {
        idFile = item.idtirilla_rep.trim();
      }

      const url =
        `https://drive.google.com/file/d/` + idFile + `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
    },
    cargaragencias: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas",
          });

          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todas",
          };
        })
        .catch((err) => {
          this.send_error("Error al cargar Sedes");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Bloqueado";
    },
    print_reporte_excel() {
      var data_parse = this.contenido
        .map((item) => {
          const filters = item.productos_rep.filter((e) => e.descripcion_rep);

          const productos = filters.map((producto) => {
            return {
              consec_rep: item.consec_rep,
              agencia_rep: item.agencia_rep,
              idagenc_rep: item.idagenc_rep,
              descrpaciente_rep: item.descrpaciente_rep,
              idagencpte_rep: item.idagencpte_rep,
              consecpte_rep: item.consecpte_rep,
              fecha_rep: item.fecha_rep,
              idsoporte_rep: item.idsoporte_rep,
              soporte_rep: item.soporte_rep,
              idtirilla_rep: item.idtirilla_rep,
              elabora_rep: item.elabora_rep,
              estado_rep: item.estado_rep,
              idpac_rep: item.idpac_rep,
              descripcion_rep: producto.descripcion_rep,
              direccionpaciente_rep: item.direccionpaciente_rep,
              telefonopaciente_rep: item.telefonopaciente_rep,
              dx_rep: item.dx_rep,
              descripeps: item.descripeps,
              nomregimen: item.nomregimen,
              cantidad_rep: producto.cantidad_rep,
              tiposervicio: item.tiposervicio,
              pqr: item.pqr,
              tipoorden: item.tipoorden,
              tutela: item.tutela,
              gestante: item.gestante,
            };
          });

          return productos;
        })
        .flat();

      var columnas = [
      {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Cod.Interno",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Medicamento",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Via administración",
          value: "viadmon_rep",
          format: "string",
        },
        {
          title: "Forma Farmaceutica",
          value: "ffarmac_rep",
          format: "string",
        },
        {
          title: "PBS",
          value: "pbs_rep",
          format: "string",
        },
        {
          title: "Tipo Servicio",
          value: "tiposervicio",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "consec_rep",
          format: "string",
        },
        {
          title: "Bodega",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Usuario Creación",
          value: "elabora_rep",
          format: "string",
        },
        {
          title: "Usuario Modificación",
          value: "modifica_rep",
          format: "string",
        },
        {
          title: "Cant.Autorizada",
          value: "cant_rep",
          format: "string",
        },
        {
          title: "Cant.Entregada",
          value: "cant_rep",
          format: "string",
        },
        {
          title: "Pendiente",
          value: "cantpte_rep",
          format: "string",
        },

        {
          title: "Frecuencia de Uso",
          value: "frecuencia_rep",
          format: "string",
        },
        {
          title: "Fecha Prescripción",
          value: "fechapresc_rep",
          format: "string",
        },
        {
          title: "Fecha Autorización",
          value: "fechautoriza_rep",
          format: "string",
        },
        {
          title: "Numero Autorización",
          value: "nroautoriza_rep",
          format: "string",
        },
        {
          title: "Numero Mipres",
          value: "nromipres_rep",
          format: "string",
        },
        {
          title: "Fecha Solicitud",
          value: "fsolicitud_rep",
          format: "string",
        },
        {
          title: "Fecha Entrega",
          value: "fentrega_rep",
          format: "string",
        },
        {
          title: "Oportunidad Dias",
          value: "oportunidad_rep",
          format: "string",
        },
        {
          title: "Estado Registro",
          value: "estadoreg_rep",
          format: "string",
        },
        {
          title: "Tipo Documento",
          value: "tipodoc_rep",
          format: "string",
        },
        {
          title: "Id_Paciente",
          value: "idpac_rep",
          format: "string",
        },
        {
          title: "Paciente",
          value: "descrpaciente_rep",
          format: "string",
        },
        {
          title: "Género",
          value: "genero_rep",
          format: "string",
        },
        {
          title: "Edad",
          value: "edad_rep",
          format: "string",
        },
        {
          title: "Ciudad",
          value: "ciudad_rep",
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
          title: "Nit Eps",
          value: "idpes_rep",
          format: "string",
        },
        {
          title: "Nombre IPS",
          value: "nomregimen",
          format: "string",
        },
        {
          title: "codigo CIE",
          value: "iddx_rep",
          format: "string",
        },

        {
          title: "Descripcion CIE",
          value: "dx_rep",
          format: "string",
        },
        {
          title: "Concentración",
          value: "concentracion_rep",
          format: "string",
        },
        {
          title: "Lote",
          value: "lote_rep",
          format: "string",
        },

        {
          title: "Fecha Vencimiento",
          value: "fvence_rep",
          format: "string",
        },
        {
          title: "codigo ATC",
          value: "atc_rep",
          format: "string",
        },
        {
          title: "Domicilio",
          value: "domicilio",
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

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          ressede,
          resfunc,
        ];
        this.postData({
          url: "dispensa/dlls/RpDispensa01J.dll",
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
      }
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
