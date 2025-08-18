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
                >Importar Facturas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col cols="4">
                <v-select
                  :items="origen"
                  label="Origen"
                  outlined
                  hide-details
                  v-model="form.origen"
                ></v-select>
              </v-col>

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
              <v-row class="d-flex mb-4 justify-center" no-gutters>              
              <v-col class="d-flex align-center" cols="2">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
              </v-col>
              <v-col class="d-flex align-center" cols="2">
                <v-btn
                  color="purple white--text"
                  class = "ml-0 mr-2"
                  @click="abrir_validar()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Validar
                </v-btn>
              </v-col>
              <v-col class="d-flex align-center" cols="2">
                <v-btn
                  color="red accent-4 white--text"
                  class = "ml-0 mr-2"
                  @click="agregar_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Borrar
                  Facturas
                </v-btn>
              </v-col>
              <v-col class="d-flex align-center" cols="2">
                <v-btn
                color="green white--text"
                  class = "ml-6"
                  @click="print_reporte_excel()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Excel Validación
                </v-btn>
              </v-col>

             <!-- <v-col class="d-flex align-center" cols="2">
              <v-btn
                  color="green darken-2"
                  class
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Excel Validación
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col> -->
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-col class="d-flex" cols="3">
              <v-switch v-model="form.diferencia" label="Mostrar Solo Diferencias"></v-switch>
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
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
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

    <v-dialog v-model="dialogo.validacion" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="8" v-if="form.origen">
              <v-file-input
                label="Buscar archivo"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept=".csv"
                v-model="filevalida"
                id="archivo_adjunto"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogo.validacion = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="purple white--text"
            depressed
            large
            @click="validar_facturas()"
            >Validar</v-btn
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
        validacion: false,
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
      origen: [
        { text: "Csv_Prosoft Versión Nueva", value: 1 },
        { text: "Csv_Prosoft Versión Anterior", value: 2 },
        { text: "Csv_El Yopal", value: 3 },
      ],
      data: [],
      search: "",
      form: null,
      filevalida: null,
      drawer: false,
      detalle: [],
      adjunto: null,
      loaderCard: false,
      headers: [
      { text: "Estado", align: "center", value: "estado_rep" },        
        { text: "Prefijo", align: "center", value: "pref_rep" },
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Vlr Factura", align: "center", value: "vlrfactura_rep" },
        { text: "Vlr Validacion", align: "center", value: "vlrvalida_rep" },
        { text: "Diferencia", align: "center", value: "vlrdiferencia_rep" },
      ],

    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    this.form.diferencia = true;
    // this.cargarTablaAg();
  },
  methods: {
    abrir_validar() {
      this.form.estado = 0;
      this.dialogo.titulo = "Valida facturas";
      this.dialogo.validacion = true;
      this.dialogo.tipo = 0;
    },

    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    validar_facturas() {
      var _this = this;
      this.contenido = [];
      var adjunto = this.filevalida;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_FACTVALIDA`;
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
            console.log("Res", res);
            if (res.code == 0) {
              _this.validar_plano(nombre_adjunto);
            }
            this.dialogo.validacion = false;

          });
      }
    },
    validar_plano(nombre_adjunto) {
      let dll = "0";
      let resumen = this.form.diferencia ? "1" : "0";      
      let origen = this.form.origen;
      dll = "Ptovta/dlls/prfact04V.dll";

      post
        .postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + nombre_adjunto + "|" + resumen + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));

          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Facturas Validadas correctamente",
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
    subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_FACT`;
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
            console.log("Res", res);
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      let dll = "0";
      let origen = this.form.origen;
      if (origen === 1 || origen === 2) dll = "Ptovta/dlls/prfact03.dll";
      else if (origen === 3) dll = "Ptovta/dlls/prfact03Y.dll";

      post
        .postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + nombre_adjunto + "|" + origen + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Facturas guardadas correctamente",
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
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      var data_parse = data.map((el) => {
        el.vlrfactura_rep = parseFloat(el.vlrfactura_rep) || 0;
        el.vlrvalida_rep = parseFloat(el.vlrvalida_rep) || 0;
        el.vlrdiferencia_rep = parseFloat(el.vlrdiferencia_rep) || 0;
        return el;
      });


      var columnas = [
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
          title: "Estado",
          value: "estado_rep",
        },

        {
          title: "Valor Factura",
          value: "vlrfactura_rep",
          format: "money",
        },
        {
          title: "Valor Validación",
          value: "vlrvalida_rep",
          format: "money",
        },
        {
          title: "Valor Diferencia",
          value: "vlrdiferencia_rep",
          format: "money",
        },

      ];
      var header_format = [
        { text: "Validacion Cargues Facturas", bold: true, size: 16 },
        { text: " ", bold: true, size: 16 },
        { text: " ", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Validacion Cargue Facturas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `VALIDACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },  
    get_comprobantes() {
      var data = this.form;
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var agencia = data.punto_fact.codigo_agc;
      var docconta = data.punto_fact.docconta_agc;
      var tipoper = data.punto_fact.tipoper_agc;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrFact01R.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            docconta +
            "|" +
            tipoper +
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
            text: "Error al cargar comprobantes",
            estado: true,
          });
        });
    },
  },
};
</script>
