<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" rounded="xl" class="overflow-hidden">
          <v-card-title class="pa-6 bg-gradient-primary text-white">
            <div class="d-flex align-center w-100">
              <div class="icon-wrapper me-4">
                <v-icon size="28" color="white">mdi-file-document-edit</v-icon>
              </div>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">
                  Reimpresión Comprobantes
                </h1>
                <p class="text-body-1 mb-0 opacity-90">
                  Consulta e imprime comprobantes contables
                </p>
              </div>
              <v-spacer></v-spacer>
              <v-chip
                variant="elevated"
                color="white"
                text-color="primary"
                size="small"
                class="font-weight-bold"
              >
                <v-icon start size="16">mdi-file-check</v-icon>
                Comprobantes
              </v-chip>
            </div>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row class="mb-4" align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="me-3" size="20"
                    >mdi-calendar-search</v-icon
                  >
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Filtros de Búsqueda
                  </h3>
                </div>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <app-date-picker
                  placeholder="Seleccionar Período"
                  :minimum-view="'month'"
                  :maximum-view="'month'"
                  v-model="periodo_cargue"
                  @changed-month="handleChangedMonth"
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-autocomplete
                  label="Tipo Documento"
                  v-model="form.tipoDocumento"
                  :items="docc"
                  :item-title="format_docc"
                  return-object
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  clearable
                  @update:model-value="get_comprobantes()"
                  :loading="loader.tipoDocumento"
                  prepend-inner-icon="mdi-file-document"
                  class="rounded-lg"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-end">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="get_comprobantes()"
                  :loading="btnEnvio.loader"
                  class="px-6 w-100"
                >
                  <v-icon start size="18">mdi-magnify</v-icon>
                  Consultar
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="mb-4" align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="me-3" size="20"
                    >mdi-format-list-bulleted</v-icon
                  >
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Lista de Comprobantes
                  </h3>
                </div>
              </v-col>
              <v-col class="d-flex justify-end gap-3">
                <v-btn
                  color="success"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="print_reporte_excel()"
                  :loading="btnEnvio.loader_excel"
                  :disabled="detalle.length === 0"
                  class="px-6"
                >
                  <v-icon start size="18">mdi-file-excel</v-icon>
                  Exportar Excel
                </v-btn>
                <v-chip
                  :color="detalle.length > 0 ? 'success' : 'info'"
                  variant="elevated"
                  size="small"
                >
                  <v-icon start size="16">mdi-counter</v-icon>
                  {{ detalle.length }} Registros
                </v-chip>
              </v-col>
            </v-row>

            <v-row class="mb-4" justify="center">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Buscar en comprobantes"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  color="primary"
                  class="rounded-lg"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card variant="outlined" class="rounded-lg overflow-hidden">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                item-key="consecutivo"
                show-expand
                :loading="loader.tabla_datos"
                class="elevation-0"
                :sort-by="[{ key: 'consecutivo', order: 'desc' }]"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4 py-4">
                    <v-card variant="flat" class="bg-grey-lighten-5 rounded-lg">
                      <v-card-text>
                        <v-table
                          density="compact"
                          class="rounded-lg overflow-hidden"
                        >
                          <thead class="bg-primary">
                            <tr>
                              <th class="text-white font-weight-bold">Item</th>
                              <th class="text-white font-weight-bold">
                                Cuenta
                              </th>
                              <th class="text-white font-weight-bold">Rut</th>
                              <th class="text-white font-weight-bold">
                                Documento
                              </th>
                              <th class="text-white font-weight-bold">
                                C. Costo
                              </th>
                              <th
                                class="text-white font-weight-bold text-right"
                              >
                                Débito
                              </th>
                              <th
                                class="text-white font-weight-bold text-right"
                              >
                                Crédito
                              </th>
                              <th class="text-white font-weight-bold">
                                Detalle
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="row in item.registros"
                              :key="row.item"
                              class="hover:bg-grey-lighten-4"
                            >
                              <td class="font-weight-medium">{{ row.item }}</td>
                              <td>{{ row.cuenta }}</td>
                              <td>{{ row.rut }}</td>
                              <td>{{ row.nroext }}</td>
                              <td>{{ row.ccosto }}</td>
                              <td class="text-right font-weight-medium">
                                {{ row.debito }}
                              </td>
                              <td class="text-right font-weight-medium">
                                {{ row.credito }}
                              </td>
                              <td>{{ row.detalle }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-card-text>
                    </v-card>
                  </td>
                </template>

                <template v-slot:item.estado="{ item }">
                  <v-chip
                    :color="item.estado == '1' ? 'error' : 'success'"
                    variant="flat"
                    size="small"
                    class="font-weight-bold"
                  >
                    <v-icon start size="14">
                      {{
                        item.estado == "1"
                          ? "mdi-close-circle"
                          : "mdi-check-circle"
                      }}
                    </v-icon>
                    {{ item.estado == "1" ? "Anulado" : "Activo" }}
                  </v-chip>
                </template>

                <template v-slot:item.imprimir_pdf="{ item }">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        @click="generar_pdf(item)"
                        color="error"
                        variant="text"
                        size="small"
                        icon
                        v-bind="props"
                      >
                        <v-icon size="18">mdi-file-pdf-box</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir PDF</span>
                  </v-tooltip>
                </template>

                <template v-slot:item.anular_doc="{ item }">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        @click="anular_doc(item)"
                        color="warning"
                        variant="text"
                        size="small"
                        icon
                        v-bind="props"
                        :disabled="item.estado == '1'"
                      >
                        <v-icon size="18">mdi-cancel</v-icon>
                      </v-btn>
                    </template>
                    <span>Anular Documento</span>
                  </v-tooltip>
                </template>

                <template v-slot:item.imprimir_exec="{ item }">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        @click="generar_excel_individual(item)"
                        color="success"
                        variant="text"
                        size="small"
                        icon
                        v-bind="props"
                      >
                        <v-icon size="18">mdi-file-excel</v-icon>
                      </v-btn>
                    </template>
                    <span>Exportar a Excel</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>

          <v-divider class="my-0" color="primary" thickness="1"></v-divider>

          <v-card-actions class="pa-6 bg-grey-lighten-5">
            <v-row align="center" no-gutters>
              <v-col>
                <div class="text-caption text-grey-darken-1">
                  Total de comprobantes: <strong>{{ detalle.length }}</strong>
                </div>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="get_comprobantes()"
                  :loading="loader.tabla_datos"
                  class="px-8"
                >
                  <v-icon start size="18">mdi-refresh</v-icon>
                  Actualizar
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

/* Hover effects para filas de tabla */
.hover\:bg-grey-lighten-4:hover {
  background-color: rgb(245, 245, 245);
}
</style>

<script>
import post from "../../methods.js";
import { formato_contable } from "../../_formatos.pdf.js";
import AppDatePicker from "../AppDatePicker.vue";

export default {
  components: {
    AppDatePicker,
  },

  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      expanded: [],
      empresa: [],
      docc: [],
      item_sel: null,
      btnEnvio: {
        loader: false,
        loader_excel: false,
        disabled: false,
      },

      search: "",
      form: null,
      drawer: false,
      headers: [
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          align: "center",
        },
        {
          text: "Consecutivo",
          align: "center",
          value: "consecutivo",
          width: "15%",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripc",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
        {
          text: "Estado",
          align: "left",
          value: "estado",
          width: "20%",
        },
        { text: "Imprimir Pdf", value: "imprimir_pdf", align: "center" },
        { text: "Imprimir Excel", value: "imprimir_exec", align: "center" },
        { text: "Subir Soportes", value: "subir_sop", align: "center" },
        { text: "Ver Soportes", value: "bajar_sop", align: "center" },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
    };
  },
  created() {
    this.get_empresa();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    this.cargarTabladocc();
  },
  methods: {
    handleChangedMonth(dateInfo) {
      this.periodo_cargue = dateInfo.formatted;
      this.get_comprobantes();
    },

    print_reporte_excel() {
      // Validaciones iniciales
      if (!this.form?.tipoDocumento) {
        this.send_error("Debe seleccionar un tipo de documento");
        return;
      }

      if (this.detalle.length === 0) {
        this.send_error("No hay datos para exportar");
        return;
      }

      // Activar loader
      this.btnEnvio.loader_excel = true;

      const _this = this;
      let tipo_documento = this.form.tipoDocumento.descrip_docc;
      let data = [];

      try {
        // Procesar cada comprobante
        this.detalle.forEach((el) => {
          // Crear una copia para no mutar el original
          const registrosCopia = [...el.registros];
          
          // Eliminar último elemento (totales) si existe
          if (registrosCopia.length > 0) {
            registrosCopia.pop();
          }

          let total_debito = 0;
          let total_credito = 0;

          registrosCopia.forEach((item) => {
            let debito = 0;
            let credito = 0;

            // Procesar valores de débito y crédito
            if (item.debito && item.debito !== "") {
              debito = parseFloat(item.debito.replace(/\s/g, "").replace(/,/g, "")) || 0;
            }
            
            if (item.credito && item.credito !== "") {
              credito = parseFloat(item.credito.replace(/\s/g, "").replace(/,/g, "")) || 0;
            }

            total_debito += debito;
            total_credito += credito;

            // Agregar registro individual
            data.push({
              fecha: el.fechadoc || el.fecha || "",
              comprobante: el.consecutivo ? el.consecutivo.trim() : "",
              descripcion: el.descripc || "",
              item: item.item ? item.item.trim() : "",
              cuenta: item.cuenta ? item.cuenta.trim() : "",
              descrcuenta: item.descrcuenta || "",
              idrut: item.idrut || "",
              rut: item.rut ? item.rut.trim() : "",
              nroext: item.nroext ? item.nroext.trim() : "",
              ccosto: item.ccosto ? item.ccosto.trim() : "",
              debito: debito,
              credito: credito,
              detalle: item.detalle ? item.detalle.trim() : "",
            });
          });

          // Agregar línea de totales
          data.push({
            fecha: "",
            comprobante: el.consecutivo ? el.consecutivo.trim() : "",
            descripcion: "",
            item: "",
            cuenta: "",
            descrcuenta: "",
            idrut: "",
            rut: "",
            nroext: "",
            ccosto: "*** TOTALES ***",
            debito: total_debito,
            credito: total_credito,
            detalle: "",
          });
        });

        // Configuración de columnas
        const columnas = [
          { title: "Fecha", value: "fecha" },
          { title: "Comprobante", value: "comprobante" },
          { title: "Descripción", value: "descripcion" },
          { title: "Item", value: "item" },
          { title: "Cuenta", value: "cuenta", format: "string" },
          { title: "Nombre Cuenta", value: "descrcuenta" },
          { title: "Id_Rut", value: "idrut" },
          { title: "RUT", value: "rut" },
          { title: "Documento", value: "nroext" },
          { title: "Centro de costos", value: "ccosto" },
          { title: "Débito", value: "debito", format: "money", totalsRowFunction: "sum" },
          { title: "Crédito", value: "credito", format: "money", totalsRowFunction: "sum" },
          { title: "Detalle", value: "detalle" },
        ];

        // Configuración del header
        const header = [
          {
            text: _this.empresa.descrip_empr ? _this.empresa.descrip_empr.trim() : "EMPRESA",
            bold: true,
            size: 16,
          },
          "REPORTE DE COMPROBANTES CONTABLES",
          tipo_documento.toUpperCase(),
          "Período: " + this.periodo_cargue,
          "Total de comprobantes: " + this.detalle.length,
          "Fecha de generación: " + this.$moment().format("DD/MM/YYYY HH:mm:ss"),
        ];

        // CAMBIO PRINCIPAL: Usar getImageBase64 en lugar de import dinámico
        const empresaId = parseFloat(sessionStorage.Sesion.substr(0, 15));
        const logo_url = `http://www.imagenes.titansolucionescloud.ovh/clientes/image-proxy.php?image=${empresaId}.png`;

        // Intentar cargar el logo con getImageBase64
        this.getImageBase64(logo_url)
          .then((logo) => {
            this.generarArchivoExcel(header, columnas, data, logo);
          })
          .catch((err) => {
            console.warn("Error al cargar logo externo:", err);
            // Generar sin logo
            this.generarArchivoExcel(header, columnas, data, null);
          });

      } catch (error) {
        console.error("Error procesando datos:", error);
        this.btnEnvio.loader_excel = false;
        this.send_error("Error al procesar datos: " + error.message);
      }
    },

    generarArchivoExcel(header, columnas, data, logo) {
      if (!window.excel || !window.excel._informe) {
        this.btnEnvio.loader_excel = false;
        this.send_error("Servicio de Excel no disponible");
        return;
      }

      window.excel._informe({
        sheetName: "Comprobantes contables",
        header: header,
        logo: logo,
        tabla: {
          columnas: columnas,
          totalsRow: true,
          data: data,
          theme: "TableStyleMedium2",
        },
        archivo: `Reporte-Comprobantes-${this.periodo_cargue}-${new Date().getTime()}`,
      })
      .then(() => {
        this.btnEnvio.loader_excel = false;
        this.$emit("snack", {
          color: "success",
          text: "Archivo Excel generado exitosamente",
          estado: true,
        });
      })
      .catch((error) => {
        this.btnEnvio.loader_excel = false;
        console.error("Error generando Excel:", error);
        this.send_error("Error al generar archivo Excel: " + error.message);
      });
    },

    generar_excel_individual(item) {
      if (!this.form?.tipoDocumento) {
        this.send_error("Debe seleccionar un tipo de documento");
        return;
      }
      this.generar_excel(item);
    },

    generar_excel(data) {
      var _this = this;
      var data_parse = [];
      var items = data.registros;
      let tipo_documento = this.form.tipoDocumento.descrip_docc;

      var columnas = [
        { title: "Item", value: "item" },
        { title: "Cuenta", value: "cuenta", format: "string" },
        { title: "Id_Rut", value: "idrut" },
        { title: "RUT", value: "rut" },
        { title: "Documento", value: "nroext" },
        { title: "Centro de costos", value: "ccosto" },
        { title: "Débito", value: "debito", format: "money", totalsRowFunction: "sum" },
        { title: "Crédito", value: "credito", format: "money", totalsRowFunction: "sum" },
        { title: "Detalle", value: "detalle" },
      ];

      items.forEach((el) => {
        data_parse.push({
          item: el.item.trim(),
          idrut: el.idrut,
          cuenta: el.cuenta.trim(),
          rut: el.rut.trim(),
          nroext: el.nroext.trim(),
          ccosto: el.ccosto.trim(),
          debito: el.debito === "" ? 0 : parseFloat(el.debito.replace(/\ /g, "").replace(/\,/g, "")),
          credito: el.credito === "" ? 0 : parseFloat(el.credito.replace(/\ /g, "").replace(/\,/g, "")),
          detalle: el.detalle.trim(),
        });
      });

      data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        tipo_documento.toUpperCase(),
        "Fecha: " + data.fechagen.trim(),
        "Número: " + data.consecutivo.trim(),
      ];

      // CAMBIO: Usar getImageBase64 en lugar de import dinámico
      const empresaId = parseFloat(sessionStorage.Sesion.substr(0, 15));
      const logo_url = `http://www.imagenes.titansolucionescloud.ovh/clientes/image-proxy.php?image=${empresaId}.png`;
      
      this.getImageBase64(logo_url)
        .then((logo) => {
          // CAMBIO: Usar window.excel en lugar de this.excel
          window.excel._informe({
            sheetName: "Comprobantes contables",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Reimp-Combroantes-${new Date().getTime()}`,
          }).then(() => {
            console.log("Impresion terminada");
          });
        })
        .catch(() => {
          // Sin logo
          window.excel._informe({
            sheetName: "Comprobantes contables",
            header: header,
            logo: null,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Reimp-Combroantes-${new Date().getTime()}`,
          }).then(() => {
            console.log("Impresion terminada sin logo");
          });
        });
    },

    async getImageBase64(url) {
      return new Promise(async (resolve, reject) => {
        try {
          // Para URLs externas, intentar primero con fetch
          if (
            !url.startsWith("/") &&
            !url.startsWith("./") &&
            !url.startsWith("data:")
          ) {
            try {
              const response = await fetch(url, {
                method: "GET",
                headers: {
                  Accept: "image/*",
                },
              });

              if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = function () {
                  resolve(reader.result);
                };
                reader.onerror = function () {
                  reject(new Error("Error al convertir blob a base64"));
                };
                reader.readAsDataURL(blob);
                return;
              }
            } catch (fetchError) {
              console.warn(
                "Fetch falló, intentando con Image:",
                fetchError.message
              );
            }
          }

          // Fallback al método original con Image
          const img = new window.Image();

          // Configurar CORS solo para URLs externas
          if (
            !url.startsWith("/") &&
            !url.startsWith("./") &&
            !url.startsWith("data:")
          ) {
            img.crossOrigin = "Anonymous";
          }

          img.onload = function () {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const dataURL = canvas.toDataURL("image/png");
              resolve(dataURL);
            } catch (canvasError) {
              console.error("Error al convertir imagen a base64:", canvasError);
              reject(new Error(`Error de canvas: ${canvasError.message}`));
            }
          };

          img.onerror = function (error) {
            console.error("Error al cargar imagen desde:", url, error);
            if (
              url.includes("titansolucionescloud") ||
              url.includes("server1ts.net")
            ) {
              reject(
                new Error(
                  `Error CORS: No se puede acceder a la imagen externa desde ${url}`
                )
              );
            } else {
              reject(
                new Error(
                  `Error de carga: No se pudo cargar la imagen desde ${url}`
                )
              );
            }
          };

          img.src = url;
        } catch (e) {
          console.error("Error general en getImageBase64:", e);
          reject(new Error(`Error general: ${e.message}`));
        }
      });
    },
    up_file_old() {
      var file = this.dialogo_archivo.model;
      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        var ruta = `${this.dialogo_archivo.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/up.pdf.php", {
          method: "POST",
          body: archivo,
        })
          .then((res) => res.json())
          .catch((err) => {
            this.dialogo_archivo.loader = false;
            this.send_error("Ha ocurrido un error subiendo el PDF");
          })
          .then((res) => {
            this.dialogo_archivo.loader = false;
            if (res.code == 0) {
              this.cancelar_subida();

              this.$emit("snack", {
                color: "success",
                text: res.msj,
                estado: true,
              });
            } else {
              this.cancelar_subida();
              this.send_error(res.msj);
            }
          });
      }
    },
    async up_file() {
      var file = this.dialogo_archivo.model;
      let digito = this.empresa.id_empr.substr(14, 15);
      let idempresa = parseFloat(this.empresa.id_empr);
      let idjson = "cargue_" + digito + ".json";
      let session = sessionStorage.Sesion;
      let agencia = this.item_sel.agencia;
      let fechadoc = this.item_sel.fechadoc;
      let periodo = fechadoc.substr(0, 6);
      let coddoc = this.item_sel.coddoc;
      let empresa = this.empresa.descrip_empr.trim();
      let iddrive = this.empresa.iddrive_rep.trim();
      let llavedoc = agencia + this.item_sel.coddoc;
      // iddrive = "1V9QwiShda842F6U5UHvh4tOPRqnMsqsq";
      let cargue_pdf = file.name;
      let consec = parseFloat(this.item_sel.consecutivo.trim());
      let clasif = 1;
      let consecpte = 0;
      let agcpte = 0;
      let idrut = 0;
      let codigo = "";
      let tipodoc = "02";
      let nombre_pdf =
        idempresa +
        "_CONT_" +
        periodo +
        "_" +
        agencia +
        coddoc +
        "_" +
        consec +
        "_" +
        clasif +
        ".pdf";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("clasif", clasif);
      data.append("consecutivo", consec);
      data.append("file", file);
      data.append("agencia", agencia);
      data.append("codigo", codigo);
      data.append("consecpte", consecpte);
      data.append("agcpte", agcpte);
      data.append("iddrive", iddrive);
      data.append("idjson", idjson);
      data.append("llavedoc", llavedoc);
      data.append("fechadoc", fechadoc);
      data.append("idrut", idrut);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/soporte.contab.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;
      this.cancelar_subida();
      this.get_comprobantes();

      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
      });
    },
    async up_file_sep() {
      var file = this.dialogo_archivo.model;
      let digito = this.empresa.id_empr.substr(14, 15);
      let idempresa = parseFloat(this.empresa.id_empr);
      let idjson = "cargue_" + digito + ".json";
      let session = sessionStorage.Sesion;
      let agencia = this.item_sel.agencia;
      let fechadoc = this.item_sel.fechadoc;
      let periodo = fechadoc.substr(0, 6);
      let coddoc = this.item_sel.coddoc;
      let empresa = this.empresa.descrip_empr.trim();
      let iddrive = this.empresa.iddrive_rep.trim();
      let llavedoc = agencia + this.item_sel.coddoc;
      // iddrive = "1V9QwiShda842F6U5UHvh4tOPRqnMsqsq";
      let cargue_pdf = file.name;
      let consec = parseFloat(this.item_sel.consecutivo.trim());
      let clasif = 1;
      let consecpte = 0;
      let agcpte = 0;
      let idrut = 0;
      let codigo = "";
      let tipodoc = "02";
      let nombre_pdf =
        idempresa +
        "_CONT_" +
        periodo +
        "_" +
        agencia +
        coddoc +
        "_" +
        consec +
        "_" +
        clasif +
        ".pdf";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("clasif", clasif);
      data.append("consecutivo", consec);
      data.append("file", file);
      data.append("agencia", agencia);
      data.append("codigo", codigo);
      data.append("consecpte", consecpte);
      data.append("agcpte", agcpte);
      data.append("iddrive", iddrive);
      data.append("idjson", idjson);
      data.append("llavedoc", llavedoc);
      data.append("fechadoc", fechadoc);
      data.append("idrut", idrut);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/soporte.contab.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;
      this.cancelar_subida();
      this.get_comprobantes();

      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
      });
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
    },
    subir_soportes(item) {
      this.item_sel = item;
      this.dialogo_archivo.estado = true;

      const data = this.form;
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento =
        data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
      let consecutivo = item.consecutivo;
      let fecha = this.periodo_cargue.replace(/\-/g, "");

      this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo
        .trim()
        .padStart(12, "0")}_${fecha}`;
    },
    descargar_soportes(item) {
      const data = this.form;
      let nit = item.nit.trim().replace(/\,/g, "").padStart(15, "0");
      let documento =
        data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
      let consecutivo = item.consecutivo.trim().padStart(12, "0");
      let fecha = this.periodo_cargue.replace(/\-/g, "");

      if (!item.iddrive.trim()) {
        let llave = `${nit}_${documento}_${consecutivo}_${fecha}`;
        window.open(`https://server100ts.net/pdfs/${llave}.pdf`, "_blank");
      } else {
        const url =
          `https://drive.google.com/file/d/` +
          item.iddrive.trim() +
          `/view?usp=drive_link`;
        window.open(url, "_blank").focus();
      }
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    generar_pdf(data) {
      let tipo_documento = this.form.tipoDocumento.descrip_docc;

      data.tipo_documento = tipo_documento;
      data.empresa = this.empresa;

      // Usar el proxy PHP en el servidor OVH
      let empresaId = parseFloat(sessionStorage.Sesion.substr(0, 15));
      var logo_src = `http://www.imagenes.titansolucionescloud.ovh/clientes/image-proxy.php?image=${empresaId}.png`;
      var logo_fallback = `/logo_vacio.png`;

      this.getImageBase64(logo_src)
        .then((logo) => {
          data.logo = logo;
          formato_contable(data).then(() => {
            console.log("Impresión finalizada con logo del servidor");
          });
        })
        .catch((err) => {
          console.warn(
            "No se pudo cargar logo del servidor, intentando con logo local:",
            err.message
          );
          // Intentar con logo local
          this.getImageBase64(logo_fallback)
            .then((logo) => {
              data.logo = logo;
              formato_contable(data).then(() => {
                console.log("Impresión finalizada con logo local");
              });
            })
            .catch((err2) => {
              console.error("Error al cargar logo local:", err2);
              // Continuar sin logo si ambos fallan
              data.logo = null;
              formato_contable(data).then(() => {
                console.log("Impresión finalizada sin logo");
              });
            });
        });
    },
    get_comprobantes() {
      this.detalle = [];
      var tipoDocumento = this.form.tipoDocumento;
      if (tipoDocumento) {
        this.loader.tabla_datos = true;
        var fecha = this.periodo_cargue.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          tipoDocumento.agencia_docc +
          tipoDocumento.codigo_docc +
          "|" +
          fecha +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrReimpcbJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader.tabla_datos = false;
            data = data.map((el) => {
              el.consecutivo = el.consecutivo.replace(/\,/g, "");
              return el;
            });

            data.pop();
            this.detalle = data;
          })
          .catch((err) => {
            this.loader.tabla_datos = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.detalle = [];
      }
    },
    format_docc: function (val) {
      return `${val.agencia_docc + val.codigo_docc} - ${val.descrip_docc}`;
    },
    cargarTabladocc: function () {
      this.loader.tipoDocumento = true;
      post
        .postData({
          url: "Financiero/dlls//CfDoccontabJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.docc = data;
          this.loader.tipoDocumento = false;
        })
        .catch((err) => {
          console.error(err);
          this.loader.tipoDocumento = false;
          this.send_error("Error al cargar Documento Contable");
        });
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
