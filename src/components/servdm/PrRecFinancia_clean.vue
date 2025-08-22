<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card 
          elevation="8" 
          rounded="xl" 
          class="overflow-hidden"
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
                  <v-icon color="primary" class="me-3" size="20">mdi-filter-outline</v-icon>
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Filtros de Búsqueda
                  </h3>
                </div>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-autocomplete
                  label="Seleccionar Deudor"
                  v-model="deudor_selected"
                  :items="lista_terceros"
                  item-title="nombre"
                  item-value="tercero"
                  clearable
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  prepend-inner-icon="mdi-account"
                  class="rounded-lg"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Fecha de Recaudo"
                  v-model="fecha_recaudo"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  prepend-inner-icon="mdi-calendar"
                  class="rounded-lg"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mb-4" align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="me-3" size="20">mdi-table-edit</v-icon>
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Financiaciones Disponibles
                  </h3>
                </div>
              </v-col>
              <v-col class="d-flex justify-end" v-if="flag_busqueda">
                <v-chip
                  :color="items_fac.length > 0 ? 'success' : 'info'"
                  variant="elevated"
                  size="small"
                >
                  <v-icon start size="16">mdi-counter</v-icon>
                  {{ items_fac.length }} Registros
                </v-chip>
              </v-col>
            </v-row>

            <v-card variant="outlined" class="rounded-lg overflow-hidden" v-if="flag_busqueda">
              <v-data-table
                :headers="headers_recaudo"
                :items="items_fac"
                :search="search"
                disable-pagination
                hide-default-footer
                class="elevation-0"
              >
                <template v-slot:item.actions="{ item }">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="success"
                        variant="elevated"
                        size="small"
                        v-bind="props"
                        @click="recaudar(item)"
                      >
                        <v-icon size="18">mdi-cash-register</v-icon>
                        Recaudar
                      </v-btn>
                    </template>
                    <span>Realizar Recaudo</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>

            <v-alert
              v-if="!flag_busqueda && deudor_selected"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              <v-icon start>mdi-information</v-icon>
              Seleccione un deudor y la fecha para consultar las financiaciones disponibles.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de Recaudo -->
    <v-dialog v-model="dialog_factura" max-width="800" persistent>
      <v-card>
        <v-card-title class="bg-gradient-primary text-white">
          <v-icon start color="white">mdi-cash-register</v-icon>
          Procesar Recaudo
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Número de Pagaré"
                v-model="datos_factura.nro_obligacion"
                readonly
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Valor a Recaudar"
                v-model="valor_recaudo"
                type="number"
                variant="outlined"
                @input="calcular"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="Observaciones"
                v-model="observaciones"
                variant="outlined"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Tabla de asientos contables -->
          <v-card variant="outlined" class="mt-4">
            <v-card-title class="bg-grey-lighten-4">
              Asientos Contables
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="items"
              hide-default-footer
              disable-pagination
            ></v-data-table>
          </v-card>
        </v-card-text>
        
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="dialog_factura = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            variant="elevated"
            @click="continuar"
          >
            <v-icon start>mdi-check</v-icon>
            Procesar Recaudo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Voucher -->
    <v-dialog v-model="dialog_voucher" max-width="600">
      <v-card>
        <v-card-title class="bg-success text-white">
          <v-icon start color="white">mdi-check-circle</v-icon>
          Recaudo Procesado
        </v-card-title>
        
        <v-card-text class="pa-6 text-center">
          <v-icon size="64" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
          <h3>¡Recaudo realizado exitosamente!</h3>
          <p class="mt-2">El voucher ha sido generado correctamente.</p>
        </v-card-text>
        
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            @click="imprimir"
          >
            <v-icon start>mdi-printer</v-icon>
            Imprimir Voucher
          </v-btn>
          <v-btn
            color="grey"
            variant="text"
            @click="dialog_voucher = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  data: function () {
    return {
      titulo: "RECAUDO FINANCIACION",
      loading: false,
      flag_busqueda: false,
      items: [],
      items_fac: [],
      items_ori: [],
      datos_factura: {
        nro_factura: null,
        fecha_factura: null,
        periodo_factura: null,
        deudor_factura: null,
        valor_original: null,
        valor_actual: null,
        tipo: null,
        nro_obligacion: null,
        interes_actual: null,
        total: null,
      },
      interes: 0,
      headers: [
        {
          title: "Cuenta Contable",
          align: "left",
          key: "cuenta_contable",
          sortable: false,
        },
        {
          title: "Nombre Cuenta",
          align: "left",
          key: "nombre_cuenta",
          sortable: false,
        },
        {
          title: "Valor Debe",
          align: "right",
          key: "valor_debe",
          sortable: false,
        },
        {
          title: "Valor Haber",
          align: "right",
          key: "valor_haber",
          sortable: false,
        },
      ],
      headers_recaudo: [
        {
          title: "PAGARÉ",
          align: "center",
          key: "nro_obligacion",
          sortable: false,
        },
        {
          title: "IDENTIFICACIÓN",
          align: "left",
          key: "deudor",
          sortable: false,
        },
        {
          title: "DEUDOR",
          align: "left",
          key: "nombre_deudor",
          sortable: false,
        },
        {
          title: "FECHA",
          align: "center",
          key: "fecha_factura",
          sortable: false,
        },
        {
          title: "VALOR ORIGINAL",
          align: "right",
          key: "valor_original",
          sortable: false,
        },
        {
          title: "CAPITAL",
          align: "right",
          key: "valor_actual",
          sortable: false,
        },
        {
          title: "INTERÉS",
          align: "right",
          key: "interes_actual",
          sortable: false,
        },
        {
          title: "TOTAL ACTUAL",
          align: "right",
          key: "total",
          sortable: false,
        },
        {
          title: "ACCIÓN",
          align: "center",
          key: "actions",
          sortable: false,
        },
      ],
      lista_terceros: [],
      tercero_seleccionado: null,
      fecha_vencimiento_original: null,
      fecha_recaudo: null,
      fecha_recaudo_formatted: null,
      valor_recaudo: 0,
      dialog_terceros: false,
      dialog_factura: false,
      headers_terceros: [
        {
          title: "Identificación",
          align: "left",
          key: "tercero",
          sortable: false,
        },
        {
          title: "Nombre",
          align: "left",
          key: "nombre",
          sortable: false,
        },
      ],
      dialog_voucher: false,
      reporte_voucher: null,
      observaciones: null,
      search: "",
      deudor_selected: null,
      filter_deudor: "",
    };
  },
  watch: {
    fecha_recaudo(val) {
      this.fecha_recaudo_formatted = this.formatDate(val);
    },
    deudor_selected: function (val) {
      this.buscar();
    },
  },
  created: function () {
    this.fecha_recaudo = this.getCurrentDate();
    this.buscarTerceros();
  },
  methods: {
    formatDate: function (date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    getCurrentDate: function () {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    buscarTerceros: async function () {
      this.lista_terceros = [];
      this.loading = true;
      let datos = await post("terceros.php", {
        request: "lista_deudores_rec_financiacion",
      });
      if (datos.success) {
        this.lista_terceros = datos.data;
      }
      this.loading = false;
    },
    buscar: async function () {
      if (this.deudor_selected) {
        this.items_ori = [];
        this.items_fac = [];
        this.flag_busqueda = false;
        this.loading = true;

        let datos = await post("servdm.php", {
          request: "consultar_valor_actual_pagare",
          fecha_consulta: this.fecha_recaudo,
          deudor: this.deudor_selected,
        });
        if (datos.success) {
          this.items_ori = datos.data;
          for (let i = 0; i < this.items_ori.length; i++) {
            this.items_ori[i].total =
              parseFloat(this.items_ori[i].valor_actual) +
              parseFloat(this.items_ori[i].interes_actual);
          }
          this.items_fac = [...this.items_ori];
          this.flag_busqueda = true;
        } else {
          this.alert(datos.msg);
        }
        this.loading = false;
      }
    },
    recaudar: function (factura) {
      this.datos_factura = { ...factura };
      this.valor_recaudo = this.datos_factura.total;
      this.dialog_factura = true;
      this.calcular();
    },
    continuar: async function () {
      if (this.valor_recaudo <= 0) {
        this.alert("El valor debe ser mayor a 0");
        return;
      }
      if (parseFloat(this.valor_recaudo) > parseFloat(this.datos_factura.total)) {
        this.alert("El valor no puede ser mayor al total actual");
        return;
      }

      let datos = await post("servdm.php", {
        request: "recaudo_pago_financiacion",
        nro_obligacion: this.datos_factura.nro_obligacion,
        fecha_recaudo: this.fecha_recaudo,
        valor_recaudo: this.valor_recaudo,
        observaciones: this.observaciones,
      });

      if (datos.success) {
        this.reporte_voucher = datos.voucher;
        this.dialog_voucher = true;
        this.dialog_factura = false;
        this.alert("Recaudo realizado exitosamente");
        this.buscar();
      } else {
        this.alert(datos.msg);
      }
    },
    calcular: function () {
      this.items = [];
      let capital_recaudado = parseFloat(this.valor_recaudo) || 0;
      let interes_recaudado = 0;

      let total_actual = parseFloat(this.datos_factura.total);
      let capital_actual = parseFloat(this.datos_factura.valor_actual);
      let interes_actual = parseFloat(this.datos_factura.interes_actual);

      if (capital_recaudado <= interes_actual) {
        interes_recaudado = capital_recaudado;
        capital_recaudado = 0;
      } else {
        interes_recaudado = interes_actual;
        capital_recaudado = capital_recaudado - interes_actual;
      }

      this.items = [];

      this.items.push({
        cuenta_contable: "1105050505",
        nombre_cuenta: "CAJA GENERAL",
        valor_debe: parseFloat(this.valor_recaudo),
        valor_haber: 0,
      });

      if (capital_recaudado > 0) {
        this.items.push({
          cuenta_contable: "1370050505",
          nombre_cuenta: "CARTERA FINANCIACION",
          valor_debe: 0,
          valor_haber: capital_recaudado,
        });
      }

      if (interes_recaudado > 0) {
        this.items.push({
          cuenta_contable: "4220550505",
          nombre_cuenta: "INTERESES FINANCIACION",
          valor_debe: 0,
          valor_haber: interes_recaudado,
        });
      }
    },
    imprimir: function () {
      if (!this.reporte_voucher) return;

      const docDefinition = formato_amortiza(
        this.reporte_voucher,
        "VOUCHER DE RECAUDO"
      );

      pdfMake.createPdf(docDefinition).print();
    },
    alert: function (msj) {
      this.$root.$emit("alert", {
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
