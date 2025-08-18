<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loaderCard"
        :disabled="loaderCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-up-bold-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Importar Contabilidad</v-list-item-title
              >
            </v-list-item-content>
            <v-col sm="3" cols="4">
              <v-btn
                color="green white--text"
                class
                @click="plantilla()"
                depressed
              >
                <v-icon size="20" left>mdi-book-outline</v-icon>
                Descargar Plantilla
              </v-btn>
            </v-col>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4" sm="3">
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
                      v-model="form.periodo"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      Autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.periodo"
                    scrollable
                    no-title
                    type="month"
                    @input="pickerMes = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col sm="3" cols="4">
                <v-select
                  :items="[
                    { text: 'Csv_Titán', value: 1 },
                    { text: 'Csv_Siesa', value: 3 },
                  ]"
                  label="Origen"
                  outlined
                  hide-details
                  v-model="form.origen"
                ></v-select>
              </v-col>

              <v-row> </v-row>

              <v-col cols="5" v-if="form.origen">
                <v-file-input
                  label="Buscar archivo"
                  outlined
                  chips
                  counter
                  color="blue darken-1"
                  hide-details
                  :show-size="1000"
                  accept=".csv"
                  v-model="adjunto"
                  id="archivo_adjunto"
                ></v-file-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class="mr-5"
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="purple white--text"
                  class="mr-5"
                  @click="validar_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Validar
                </v-btn>
              </v-col>

            </v-row>
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
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Numero Inicial"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.inicial"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Numero Final"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.final"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="eliminar_facturas()"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  FlowerSpinner,

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

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
      },

      card_estado: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      headers: [],
      detalle: [],
      adjunto: null,
      loaderCard: false,
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    // this.cargarTablaAg();
  },
  methods: {
    validar_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_CONTAB`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch(
          "https://server1ts.net//financiero/services/adjunto.impFact.php",
          {
            method: "POST",
            body: archivo,
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            if (res.code == 0) {
              _this.validar_plano(nombre_adjunto);
            }
          });
      }
    },
    validar_plano(nombre_adjunto) {
      var periodo = this.form.periodo.replace(/\-/g, "");
      let origen = this.form.origen;
      this.contenido = [];
      let dll = "0";
      if (origen === 1) dll = "Financiero/dlls/PrValImportcb.dll";
      else {
        // if (origen === 2) dll = "Financiero/dlls/PrImpRecapi.dll";
        if (origen === 3) dll = "Financiero/dlls/PrValSiesa.dll";        
      }
      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion + "|" + periodo + "|" + nombre_adjunto + "|",
          method: "",
        })
        .then((data) => {
          data.pop()
          this.contenido = data;
          this.print_reporte_excel()
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Cargue Completado",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err)
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al validar plano",
            estado: true,
          });
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Doc Siesa",
          value: "docsiesa_rep",
        },
        {
          title: "Nro Doc Siesa",
          value: "docum_rep",
        },

        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Cliente",
          value: "cliente_rep",
        },
        {
          title: "Prefijo",
          value: "pref_rep",
        },

        {
          title: "Factura",
          value: "nro_rep",
        },

        {
          title: "Valor",
          value: "valor_rep",
        },
        {
          title: "Estado",
          value: "tipo_rep",
        },
        {
          title: "Fecha Cargue",
          value: "fechacargue_rep",
          format: "fecha",
        },

      ];

      var fecha_inicial = this.form.periodo.replace(/\-/g, "");      
      var header_format = [
        { text: "REPORTE VALIDACION SIESA", bold: true, size: 16 },
        `Periodo: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Validacion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-VALIDACION SIESA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_CONTAB`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch(
          "https://server1ts.net//financiero/services/adjunto.impFact.php",
          {
            method: "POST",
            body: archivo,
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      var periodo = this.form.periodo.replace(/\-/g, "");
      let origen = this.form.origen;
      let dll = "0";
      if (origen === 1) dll = "Financiero/dlls/PrImportcb.dll";
      else {
        // if (origen === 2) dll = "Financiero/dlls/PrImpRecapi.dll";
        if (origen === 3) dll = "Financiero/dlls/PrImpSiesa.dll";        
      }
      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion + "|" + periodo + "|" + nombre_adjunto + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Cargue Completado",
            estado: true,
          });
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar plano",
            estado: true,
          });
        });
    },
    plantilla: function () {
    let url = "https://www.titansolucionescloud.ovh/imagen.plantillas/contabilidad.xlsx"
    window.open(url, '_blank')
    },

    eliminar_facturas() {
      var nroini = this.form.inicial.trim();
      var nrofin = this.form.final.trim();
      post
        .postData({
          url: "Ptovta/dlls/prfact03B.dll",
          data: sessionStorage.Sesion + "|" + nroini + "|" + nrofin + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.dialogo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Facturas Eliminadas correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar plano",
            estado: true,
          });
        });
    },
  },
};
</script>
