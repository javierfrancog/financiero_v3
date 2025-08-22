<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card 
          elevation="8" 
          rounded="xl" 
          class="overflow-hidden"
          :loading="card.loader"
          :disabled="card.disabled"
        >
          <v-card-title 
            class="pa-6 bg-gradient-primary text-white"
          >
            <div class="d-flex align-center w-100">
              <div class="icon-wrapper me-4">
                <v-icon size="28" color="white">mdi-currency-usd-circle</v-icon>
              </div>
              <div class="flex-grow-1">
                <h1 class="text-h4 font-weight-bold mb-1">Recaudo de Financiaciones</h1>
                <p class="text-body-1 mb-0 opacity-90">Gestión de cobros y pagos de financiaciones</p>
              </div>
              <div class="ml-4">
                <v-menu
                  v-model="pickerMes"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="form.fecha_doc"
                      label="Fecha Recaudo"
                      variant="solo"
                      density="compact"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      class="fecha-picker"
                      color="white"
                      bg-color="rgba(255,255,255,0.1)"
                      style="min-width: 200px;"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_doc"
                    hide-header
                    @update:model-value="pickerMes = false"
                  ></v-date-picker>
                </v-menu>
              </div>
              <v-spacer></v-spacer>
              <v-chip
                variant="elevated"
                color="white"
                text-color="primary"
                size="small"
                class="font-weight-bold"
              >
                <v-icon start size="16">mdi-bank-transfer</v-icon>
                Recaudos
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row class="mb-4" align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="me-3" size="20"
                    >mdi-filter-outline</v-icon
                  >
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Filtros de Búsqueda
                  </h3>
                </div>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-autocomplete
                  label="Usuario"
                  v-model="form.usuario"
                  :items="usuarios"
                  :item-title="format_usuarios"
                  item-value="cod_rep"
                  clearable
                  return-object
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  prepend-inner-icon="mdi-account"
                  @update:model-value="(errores.medidor = false), cargarcontenido()"
                  :error="errores.medidor"
                  class="rounded-lg"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  label="Financiaciones"
                  v-model="form.financiac"
                  :items="financiaciones"
                  :item-title="format_financiac"
                  item-value="consec_rep"
                  clearable
                  return-object
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  prepend-inner-icon="mdi-currency-usd"
                  @update:model-value="(errores.financiac = false), cargarfinanciacion()"
                  :error="errores.financiac"
                  class="rounded-lg"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row v-if="this.contenido" class="mb-4">
              <v-col cols="12" md="4">
                <v-menu
                  ref="menu"
                  v-model="dialogPickerini"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      label="Fecha Primera Cuota"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      v-model="form.fechaini"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      class="rounded-lg"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaini"
                    @update:model-value="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row class="mb-4" align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="me-3" size="20"
                    >mdi-table-edit</v-icon
                  >
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Detalle de Financiaciones
                  </h3>
                </div>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-chip
                  :color="contenido.length > 0 ? 'success' : 'info'"
                  variant="elevated"
                  size="small"
                >
                  <v-icon start size="16">mdi-counter</v-icon>
                  {{ contenido.length }} Registros
                </v-chip>
              </v-col>
            </v-row>

            <v-card variant="outlined" class="rounded-lg overflow-hidden">
              <v-data-table
                :headers="headers"
                :items="contenido"
                v-model:expanded="expanded"
                item-key="cuotacr_rep"
                :search="search"
                v-model="list_select"
                disable-pagination
                hide-default-footer
                class="elevation-0"
              >
                <template v-slot:item.edit="{ item }">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="primary"
                        variant="text"
                        size="small"
                        icon
                        v-bind="props"
                        @click="editar_item(item)"
                      >
                        <v-icon size="18">mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar Item</span>
                  </v-tooltip>
                </template>

              <template v-slot:item.anula="{ item }">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      @click="anula_item(item)"
                      color="error"
                      variant="text"
                      size="small"
                      icon
                      v-bind="props"
                    >
                      <v-icon size="18">mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>

              <template v-slot:body.append>
                <tr>
                  <td colspan="2" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td></td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{ formatNumero(total_capital.toFixed(0)) }}
                    </strong>
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{ formatNumero(total_intereses.toFixed(0)) }}
                    </strong>
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{ formatNumero(total_recaudo.toFixed(0)) }}
                    </strong>
                  </td>
                </tr>
              </template>
            </v-data-table>
            </v-card>
          </v-card-text>

          <v-divider class="my-0" color="primary" thickness="1"></v-divider>

          <v-card-actions class="pa-6 bg-grey-lighten-5">
            <v-row align="center" no-gutters>
              <v-col>
                <div class="text-caption text-grey-darken-1">
                  Total de registros: <strong>{{ contenido.length }}</strong>
                </div>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="success"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="guardar_recaudo()"
                  :disabled="contenido.length === 0"
                  class="px-8"
                >
                  <v-icon start size="18">mdi-content-save</v-icon>
                  Grabar Recaudo
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Gradiente moderno para el header */
.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
}

/* Contenedor de icono mejorado */
.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

/* Date picker en header con estilo transparente */
.fecha-picker .v-field__input {
  color: white !important;
}

.fecha-picker .v-field__prepend-inner .v-icon {
  color: white !important;
}

/* Campos de entrada con estilo moderno */
.v-field--outlined {
  border-radius: 12px !important;
}

/* Botones con sombras suaves */
.v-btn {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Cards con efecto glass */
.v-card {
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Tabla con diseño limpio */
.v-data-table {
  border-radius: 12px;
  overflow: hidden;
}

.v-data-table__wrapper {
  border-radius: 12px;
}

/* Dividers modernos */
.v-divider {
  opacity: 0.3;
}

/* Animaciones suaves */
.v-card-actions {
  transition: all 0.3s ease;
}

/* Mejoras de tipografía */
.text-h4 {
  letter-spacing: -0.02em;
}

.text-h6 {
  letter-spacing: -0.01em;
}

/* Espaciado consistente */
.gap-3 {
  gap: 12px;
}

/* Efectos hover para iconos */
.v-icon {
  transition: all 0.2s ease;
}

.v-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Mejoras de accesibilidad */
.v-btn:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* Responsive design mejorado */
@media (max-width: 960px) {
  .v-card-actions .v-col {
    flex-direction: column;
    align-items: stretch !important;
  }

  .gap-3 {
    gap: 8px;
  }

  .v-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* Estado de loading mejorado */
.v-btn--loading {
  opacity: 0.8;
}

/* Chips con estilo moderno */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.02em;
}
</style>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;
import { PDFDocument } from "pdf-lib";
import Chart from 'chart.js/auto'
import { formato_amortiza } from "../../_formatos_sdm.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickerMes: false,
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoModificar: {
        estado: false,
        data: false,
      },

      dialogoFinancia: {
        estado: false,
        data: false,
      },
      tablefinanc: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "pago_no",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "saldo",
            align: "right",
          },
          {
            text: "Pago capital",
            value: "pago_capital",
            align: "right",
          },
          {
            text: "Pago Int.",
            value: "interes",
            align: "right",
          },
          {
            text: "Total Cuota",
            value: "monto_pago",
            align: "right",
          },
          {
            text: "Sdo. capital",
            value: "saldo_capital",
            align: "right",
          },
          {
            text: "Fecha",
            value: "fecha",
            align: "center",
          },
        ],
      },

      dialog: true,
      valid: false,
      dialogPicker: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      dialogPickerini: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      nvocontenido: [],
      list_select: [],
      total_recaudo: 0,
      total_capital: 0,
      total_intereses: 0,
      cuotas_ptes: 0,
      financia_ant: 0,
      nvo_consec: 0,
      financiaciones: [],
      item_selecc: [],
      usuarios: [],
      conceptos: [],
      tipoliq: [
        { text: "Factor", value: 1 },
        { text: "Tasa Mensual", value: 2 },
      ],
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 5,
        masked: false,
      },
      table: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "nrocuota_rep",
            align: "center",
          },

          {
            text: "Sdo.Capital",
            value: "sdocapital_rep",
            align: "center",
            format: "money",
          },
          {
            text: "Capital",
            value: "pagocapital_rep",
            align: "center",
          },
          {
            text: "Intereses",
            value: "pagointer_rep",
            align: "center",
          },
          {
            text: "Total Cuota",
            value: "totalcuota_rep",
            align: "center",
          },
          {
            text: "Nuevo Capital",
            value: "saldocuota_rep",
            align: "center",
          },
          {
            text: "Fecha",
            value: "fechacuota_rep",
            align: "center",
          },
          {
            text: "Cuota Pagada",
            value: "saldocuota_rep",
            align: "center",
          },
        ],
      },
      search: "",
      form: {
        usuario: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Cuota", align: "center", value: "cuotacr_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Capital", align: "center", value: "capital_rep" },
        { text: "Intereses", align: "center", value: "intereses_rep" },
        { text: "Total", align: "center", value: "total_rep" },
        { text: "Editar", value: "edit", align: "center" },
        { text: "Eliminar", value: "anula", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.get_empresa();
    this.cargar_usuarios();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
    };

    this.$watch(
      "contenido",
      (contenido) => {
        this.total_recaudo = 0;
        this.total_capital = 0;
        this.total_intereses = 0;

        let total_cuota = 0;
        let total_capital = 0;
        let total_interes = 0;

        contenido.forEach((val) => {
          if (/[,]/.test(val.total_rep)) {
            total_cuota = parseFloat(val.total_rep.replace(/\,/g, "").trim());
          } else {
            total_cuota = parseFloat(val.total_rep);
          }

          this.total_recaudo += total_cuota;
          total_capital = val.capital_rep
            ? parseFloat(val.capital_rep.replace(/\,/g, "").trim())
            : 0;
          this.total_capital += total_capital;
          total_interes = parseFloat(
            val.intereses_rep.replace(/\,/g, "").trim()
          );
          this.total_intereses += total_interes;
        });
      },
      { deep: true }
    );
  },
  computed: {},
  methods: {
    editar_item(item) {
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = item;
      this.dialogoModificar.index = this.contenido.indexOf(item);

      this.form.vlr_capital = parseFloat(
        item.capital_rep.replace(/\,/g, "").trim()
      );
      this.form.vlr_intereses = parseFloat(
        item.intereses_rep.replace(/\,/g, "").trim()
      );
    },
    anula_item(item) {
      const index = this.contenido.indexOf(item);
      this.contenido.splice(index, 1);
    },
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
    },
    cancelar_financia() {
      this.dialogoFinancia.estado = false;
    },
    async guardar_financia() {
      this.dialogoFinancia.estado = false;
      let tabla_nvascuotas = await this.enviar_nvatabla(1);
      let item = 0;
      let consecutivo = 0;
      let rut = this.form.usuario.idcontab_rep.trim();
      let codigo = this.form.usuario.cod_rep.trim();
      let fechaini = this.tablefinanc.items[0].fecha.replace(/\-/g, "");
      let valorini = this.form.valorfinanc;
      let cuotas = this.form.cuotasfinanc;
      let tasa = this.form.tasafinanc;
      if (this.form.financiac.concepto_rep == 1003) {
        item = 1;
      } else if (this.form.financiac.concepto_rep == 1050) {
        item = 2;
      }

      post
        .postData({
          url: "Servdm/dlls/PrsdmfinanciaU.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              rut +
              "|" +
              codigo +
              "|" +
              fechaini +
              "|" +
              cuotas +
              "|" +
              valorini +
              "|" +
              tasa +
              "|" +
              item +
              "|" +
              "1" +
              "|" +
              this.financia_ant +
              "|",
            ...tabla_nvascuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.nvo_consec = data[0];
          this.$emit("snack", {
            color: "success",
            text: "Financiación Generada Correctamente",
            estado: true,
          });
          this.imprimir_documento(this.nvo_consec);
        });
    },
    enviar_nvatabla(item) {
      return new Promise((res) => {
        let tablajson = {};
        this.tablefinanc.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let saldo = item.saldo.replace(/\,/g, "");
          let pago_capital = item.pago_capital.replace(/\,/g, "");
          let interes = item.interes.replace(/\,/g, "");
          let pago_no = item.pago_no;
          let fecha = item.fecha.replace(/\-/g, "");
          tablajson[
            `DATOJ-${format_index}`
          ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${fecha}|`;
        });
        res(tablajson);
      });
    },
    guardar_cambios() {
      this.dialogoModificar.estado = false;
      let valorcapital = this.form.vlr_capital ? this.form.vlr_capital : 0;
      this.dialogoModificar.data.capital_rep = this.formatNumero(valorcapital);
      let valorintereses = this.form.vlr_intereses
        ? this.form.vlr_intereses
        : 0;
      this.dialogoModificar.data.intereses_rep =
        this.formatNumero(valorintereses);
      this.dialogoModificar.data.total_rep =
        parseFloat(valorcapital) + parseFloat(valorintereses);
    },
    async cargarfinanciacion() {
      this.item_selecc = this.form.financiac;
      let consecutivo = this.form.financiac.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + 1 + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinancia03J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = data;
          this.card.loader = false;
          this.card.disabled = false;
          this.cuotas_ptes = this.contenido.length;
        })
        .catch((err) => {
          this.card.loader = false;
          console.log(err);
          this.card.disabled = false;
          this.send_error("Error al consultar Financiacion");
        });
    },
    imprimir_documento(item) {
      let consecutivo = item;
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            formato_amortiza(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async guardar_recaudo() {
      var data = JSON.parse(JSON.stringify(this.form));
      let consecutivo = data.financiac.consec_rep.trim();
      this.financia_ant = consecutivo;
      let tabla_cuotas = await this.enviar_tabla();
      let fecha = data.fecha_doc.replace(/\-/g, "");
      let agencia = this.agencia_recaudo;
      let total_rec = this.total_recaudo;

      post
        .postData({
          url: "Servdm/dlls/Prsdmrecaudo02.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              fecha +
              "|" +
              agencia +
              "|" +
              total_rec +
              "|",

            ...tabla_cuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.dialogo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Documento Grabado Correctamente",
            estado: true,
          });
          this.abrir_financiacion();
        });
    },
    async abrir_financiacion() {
      this.contenido = [];
      this.total_capital = 0;
      let total_nvocapital = 0;
      this.dialogoFinancia.estado = true;
      total_nvocapital = await this.cargar_nuevatabla();

      this.form.fechaini = this.form.fecha_doc;
      this.form.usuariorefinanc = this.item_selecc.nombrecliente_rep.trim();
      this.form.concepto = this.item_selecc.descrbase_rep.trim();
      this.form.cuotasfinanc = this.cuotas_ptes;
      this.form.tasafinanc = this.item_selecc.tasaint_rep.trim();
      this.$set(this.form, "valorfinanc", total_nvocapital);

      // this.form.valorfinanc = total_nvocapital;

      this.table.items = [];
      await this.liquidacion_bancaria();
    },
    cargar_nuevatabla: async function (total_nvocapital) {
      let capital = 0;
      let subtotal = 0;

      this.item_selecc = this.form.financiac;
      let consecutivo = this.form.financiac.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + 1 + "|" + key;
      return await post
        .postData({
          url: "Servdm//dlls/PrFinancia03J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.nvocontenido = data;
          this.card.loader = false;
          this.card.disabled = false;
          this.cuotas_ptes = this.nvocontenido.length;

          this.nvocontenido.forEach((item, index) => {
            let format_index = (index + 1).toString().padStart(3, "0");

            if (/[,]/.test(item.capital_rep)) {
              capital = parseFloat(item.capital_rep.replace(/\,/g, "").trim());
            } else {
              capital = parseFloat(item.capital_rep).trim();
            }
            subtotal = subtotal + capital;
          });
          total_nvocapital = subtotal;
          return total_nvocapital;
        })
        .catch((err) => {
          this.card.loader = false;
          console.log(err);
          this.card.disabled = false;
          this.send_error("Error al consultar Financiacion");
          return false;
        });
    },
    async liquidacion_bancaria() {
      let valor = parseInt(this.form.valorfinanc);
      let cuotas = parseInt(this.form.cuotasfinanc);
      let tasa_interes = parseFloat(this.form.tasafinanc);
      let fecha_inicial = this.form.fechaini;
      let ano = fecha_inicial.substring(0, 4);
      let mes = fecha_inicial.substring(5, 7);
      let dia = fecha_inicial.substring(8, 10);

      (mes = mes.toString().padStart(2, "0")),
        (fecha_inicial = ano + mes + dia);

      let factor1 = (tasa_interes / 100) * valor;
      let basepot = 1 + tasa_interes / 100;
      let potencia = Math.pow(basepot, -cuotas);
      let factor2 = 1 - potencia;
      let tcuota = (factor1 / factor2).toFixed(0);

      let list = [];
      let capital = parseFloat(valor);
      for (let i = 0; i < cuotas; i++) {
        // let pago_capital = (capital / cuotas).toFixed(0);
        // let interes = (capital * (tasa_interes / 100)).toFixed(0);
        // let monto_pago = parseFloat(pago_capital) + parseFloat(interes);
        // let saldo_capital = capital - pago_capital;

        let interes = (capital * (tasa_interes / 100)).toFixed(0);
        let monto_pago = tcuota;
        let pago_capital = (monto_pago - interes).toFixed(0);
        let saldo_capital = capital - pago_capital;

        let fecha = 0;

        fecha = this.$moment(fecha_inicial)
          .add(i, "months")
          .format("YYYY-MM-DD");

        list.push({
          saldo: this.formatNumero(capital),
          pago_capital: this.formatNumero(pago_capital),
          interes: this.formatNumero(interes),
          monto_pago: this.formatNumero(monto_pago),
          saldo_capital: this.formatNumero(saldo_capital),
          pago_no: i + 1,
          fecha,
        });

        capital = saldo_capital;
      }

      this.tablefinanc.items = list;
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.contenido.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let capital = 0;
          let interes = 0;
          let tot_pago = 0;
          let cuota = 0;

          if (/[,]/.test(item.capital_rep)) {
            capital = parseFloat(item.capital_rep.replace(/\,/g, ""));
          } else {
            capital = parseFloat(item.capital_rep);
          }

          if (/[,]/.test(item.intereses_rep)) {
            interes = parseFloat(item.intereses_rep.replace(/\,/g, ""));
          } else {
            interes = parseFloat(item.intereses_rep);
          }

          if (/[,]/.test(item.intereses_rep)) {
            interes = parseFloat(item.intereses_rep.replace(/\,/g, ""));
          } else {
            interes = parseFloat(item.intereses_rep);
          }

          tot_pago = parseFloat(item.total_rep);
          cuota = parseFloat(item.cuotacr_rep.replace(/\,/g, ""));

          tablajson[
            `DATOJ-${format_index}`
          ] = `${cuota}|${tot_pago}|${capital}|${interes}|`;
        });
        res(tablajson);
      });
    },
    cargarcontenido() {
      var data = this.form;
      let usuario = data.usuario.idcontab_rep;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFinancia02J.dll",
          data: sessionStorage.Sesion + "|" + usuario + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.financiaciones = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Financiaciones",
            estado: true,
          });
        });
    },
    format_usuarios: function (val) {
      return `${
        val.cod_rep.trim() +
        " - " +
        val.nombres_rep.trim() +
        " - " +
        val.apellido1_rep.trim()
      } `;
    },
    format_financiac: function (val) {
      return `${val.consec_rep.trim() + " - " + val.descrbase_rep.trim()}`;
    },
    cargar_usuarios() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfusuariosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.usuarios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Usuarios",
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
          this.agencia_recaudo = this.datosEmpresa.agencia_empr;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
