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
                >mdi-debug-step-out</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Importar Facturas Cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  return-object
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
                  hide-details
                  clearable
                  return-object
                  :error="errores.pref_fact"
                  @change="errores.pref_fact = false"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="3" cols="12">
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

              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
                <v-btn
                  color="red accent-4 ml-3 white--text"
                  class
                  @click="agregar_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Borrar
                  Facturas
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
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Prefijo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.prefijo"
                hide-details
              ></v-text-field>
            </v-col>

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
import { contrato_titan } from "../../_formatos.pdf.js";

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
      },
      dialog: true,
      prefijos: [],

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
        pref_fact: false,
      },

      card_estado: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      selectObjContratos: [],
      load_contrato: true,
      selectContrato: null,
      origen: [
        { text: "Csv_Titán", value: 1 },
        { text: "Csv_Simeón", value: 2 },
      ],
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
    this.cargarContratos();
    this.get_resolucion();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    // this.cargarTablaAg();
  },
  methods: {
    get_resolucion() {
      var $this = this;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar resolucion: " + err.Mensaje[0].Error,
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
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: parseInt(k.nro) + "-" + k.detalle,
              id_entidad: parseInt(k.identificacion),
              autoriza: parseInt(k.autoriza),
            });
          });
          this.load_contrato = false;
          // this.cargarPacientes();
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    subir_archivo() {
      if (!this.form.pref_fact) {
        this.errores.pref_fact = true;
        this.$emit("snack", {
          color: "error",
          text: "Seleccione un prefijo",
          estado: true,
        });
        return;
      }
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
      let contrato = this.selectContrato.value;
      let dll = "0";
      let origen = this.form.origen;
      let prefijo = this.form.pref_fact.prefijo_resd;

      if (origen == 1) {
        dll = "Clinico/dlls/PrImportfact.dll";
      }

      if (origen == 2) {
        dll = "Clinico/dlls/PrImportfact2.dll";
      }

      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion +
            "|" +
            contrato +
            "|" +
            prefijo +
            "|" +
            nombre_adjunto +
            "|",
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
          console.log("err:", err.Mensaje[0]);
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0],
            estado: true,
          });
        });
    },
    eliminar_facturas() {
      let prefijo = this.form.prefijo.trim();
      var nroini = this.form.inicial.trim();
      var nrofin = this.form.final.trim();
      post
        .postData({
          url: "Clinico/dlls/PrBorrafact.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|" +
            nroini +
            "|" +
            nrofin +
            "|",
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
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
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
