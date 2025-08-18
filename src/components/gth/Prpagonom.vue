3<template>
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
              <v-icon size="30" color="blue darken-4 ">mdi-cash-fast</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generar Pago de NÃ³mina</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
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
                  v-model="form.fecha"
                  label="Fecha de NÃ³mina"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>

          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex pb-0" cols="4">
            <v-autocomplete
              label="Cuenta de Pago"
              v-model="form.cuentaPago"
              :items="cuentasContables"
              :item-text="format_cuentac"
              item-value="cod_puc"
              hide-details
              clearable
              return-object
              @change="errores.cuenta = false"
              :error="errores.cuenta"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" sm="3">
            <v-menu
              v-model="pickeFechaComp"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechaComp"
                  label="Fecha Comprobante"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaComp"
                @input="pickeFechaComp = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-center" cols="3">
            <v-switch
              v-model="form.agpr_debito"
              label="Registrar DÃ©bito por Empleado"
            ></v-switch>
          </v-col>
          <v-col class="d-flex" cols="5">
            <v-autocomplete
              label="Seleccione el Fondo a Procesar"
              v-model="form.selruts"
              :items="tablaruts"
              :item-text="format_ruts"
              item-value="cod_puc"
              hide-details
              return-object
              clearable
              outlined
              v-if="form.agpr_debito === false ? true : false"
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex justify-center" cols="3">
            <v-switch
              v-model="form.agrupar"
              label="Agrupar CrÃ©dito en nit de la Empresa"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex pb-0" cols="4">
            <v-btn
              color="indigo"
              class="white--text mr-3"
              large
              depressed
              @click="cargarcontenido"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
            <v-btn
              color="orange"
              class="white--text mr-3"
              large
              depressed
              @click="grabar"
            >
              Grabar Comprobante
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              :expanded.sync="expanded"
              item-key="idnomina_rep"
              :search="search"
              v-model="list_select"
              disable-pagination
            >
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>

              <template v-slot:item.anula="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anula_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-empty</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
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

    <v-dialog v-model="dialogoModificar.estado" max-width="600" persistent>
      <v-card
        :loading="dialogoModificar.load"
        :disabled="dialogoModificar.load"
      >
        <v-card-title class="headline">Modificar Pago</v-card-title>

        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Valor"
                outlined
                hide-details
                v-model="form.valor"
                type="number"
                ref="input_cantidad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            @click="cancelar_modificar"
            >Cancelar</v-btn
          >
          <v-btn
            color="green"
            class="white--text"
            depressed
            @click="guardar_cambios"
            >Guardar cambios</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      pickeFechaComp: false,

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      load: {
        btn_enviar: false,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      dialogoModificar: {
        estado: false,
        data: false,
      },
      expanded: [],
      agencias: [],
      contenido: [],
      tablaruts: [],
      cuentasContables: [],
      item_nom: "",
      ptedian: null,
      card: {
        loader: false,
        disabled: false,
      },

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "left", value: "agencianomina_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Apellido2", align: "left", value: "Apellido2nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Neto", align: "left", value: "netonomina_rep" },
        { text: "Editar", value: "edit", align: "center" },
        { text: "Eliminar", value: "anula", align: "center" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      periodos: [
        { text: "Mensual", value: 1 },
        { text: "1ra Quincena", value: 2 },
        { text: "2da Quincena", value: 3 },
        { text: "Nomina Adicional", value: 4 },
        { text: "Prima 1er. Semestre", value: 5 },
        { text: "Prima 2do. Semestre", value: 6 },
        { text: "Cesantias", value: 7 },
        { text: "Intereses/Cesantias", value: 8 },
      ],
      errores: {
        codigo: false,
        fecha: false,
        estado: false,
        cuenta: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      empresa: {},
      list_select: [],
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaAg();
    this.cargarTablactas();
    this.cargarTablaruts();

    this.form.agencia = {
      text: "Todas las Agencias",
      codigo_agc: "0",
    };
  },
  computed: {},
  methods: {
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
    },
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.descripcion_rut}`;
    },
    anula_item(item) {
      const index = this.contenido.indexOf(item);
      this.contenido.splice(index, 1);
    },
    editar_item(item) {
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = item;
      this.dialogoModificar.index = this.contenido.indexOf(item);
      this.form.valor = parseFloat(
        item.netonomina_rep.replace(/\,/g, "").trim()
      );
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasContables = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    guardar_cambios() {
      this.dialogoModificar.estado = false;
      let valor = this.form.valor ? this.form.valor : 0;
      this.dialogoModificar.data.netonomina_rep = this.formatNumero(valor);
    },

    grabar() {
      let data = "";
      let datotabla = this.contenido.length;
      if (!this.form.fecha) {
        this.errores.fecha = true;
        this.send_error("Selecciona un Periodo");
      } else if (datotabla == 0) {
        this.send_error("No hay datos para Grabar");
      } else if (!this.form.cuentaPago) {
        this.send_error("Debe Seleccionar una cuenta de pago");
        this.errores.cuenta = true;
      } else if (!this.form.fechaComp) {
        this.send_error("Debe Seleccionar la Fecha del Comprobante");
      } else {
        let sesion = sessionStorage.Sesion;
        let fecha = this.form.fecha.replace(/\-/g, "");
        let item_nom = this.item_nom;
        let agencia = this.form.agencia.codigo_agc;
        let cuenta = this.form.cuentaPago.cod_puc;
        let fechacomp = this.form.fechaComp.replace(/\-/g, "");
        let periodo = this.form.periodo.value;
        let agrupar = this.form.agrupar ? "1" : "0";
        let agpr_debito = this.form.agpr_debito ? "1" : "0";

        let rut = 0;
        if (periodo === 7) {
          rut = this.form.selruts? this.form.selruts.identificacion_rut: 0;
        }
        if (periodo === 8) {
          item_nom = "C2";
        }

        let plano = {};
        let index = 0;
        this.get_plano(this.contenido)
          .then((plano) => {
            var datosEnvio =
              sesion +
              "|" +
              fecha +
              "|" +
              item_nom +
              "|" +
              agencia +
              "|" +
              cuenta +
              "|" +
              fechacomp +
              "|" +
              rut +
              "|" +
              agrupar +
              "|" +
              agpr_debito +
              "|";
            post
              .postData({
                url: "Financiero/dlls/PrGthPago.dll",
                data: { importarhtml: datosEnvio, ...plano },
                method: "",
                json: true,
              })
              .then((data) => {
                this.load.btn_enviar = false;
                // this.print.comprobante = data[0];
                this.$emit("snack", {
                  color: "success",
                  text: "Pago generado correctamente",
                  estado: true,
                });
                this.cargarcontenido();
              })
              .catch((err) => {
                console.log(err);
                this.load.btn_enviar = false;
                let msg_error = err.Mensaje[0].msg;
                this.send_error(msg_error);
              });
          })
          .catch((err) => {
            this.load.btn_enviar = false;
            console.error(err);
            this.send_error(err);
          });
      }
    },
    get_plano(contenido) {
      return new Promise((resolve, reject) => {
        var nuevo = {};
        contenido.forEach((el, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let colaborador = parseFloat(el.idnomina_rep);
          let ccosto = el.ccostonomina_rep;
          let agencia = el.agencianomina_rep;
          let periodo = el.periodonomina_rep;
          let valor = parseFloat(el.netonomina_rep.replace(/\,/g, "").trim());

          nuevo[
            `DATOJ-${format_index}`
          ] = `${colaborador}|${valor}|${ccosto}|${agencia}|${periodo}|`;
        });

        resolve(nuevo);
      });
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
          this.agencias.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas las Agencias",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
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
    cargarcontenido() {
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.form.periodo.value || "0";
      let agencia = this.form.agencia.codigo_agc;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthPagoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            periodo +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          this.item_nom = this.contenido[0].item_rep;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "No hay Pagos Pendientes",
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

