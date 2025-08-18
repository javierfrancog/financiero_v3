<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">flip_to_front</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Formato Unico de Extracto del Contrato de Transporte
                Especial</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-divider color="succes"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mt-1">
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="get_consecutivo(), (errores.punto_fact = false)"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Registro"
                      outlined
                      v-model="form.fecha"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="form.consecutivo"
                  disabled
                  hide-details
                  type="text"
                  :loading="load.consecutivo"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="8">
                <v-text-field
                  label="Cliente"
                  outlined
                  v-model="form.clientes"
                  hide-details
                  type="text"
                  @input="errores.clientes = false"
                  :error="errores.clientes"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Nit/CC"
                  outlined
                  clearable
                  hide-details
                  v-model="form.identificacion"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Nro Contrato"
                  outlined
                  clearable
                  hide-details
                  v-model="form.nrocontrato"
                  @input="errores.nrocontrato = false"
                  :error="errores.nrocontrato"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
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
                      v-model="form.finicial"
                      label="F.Inicial contrato"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.finicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>

                <!-- <v-text-field
                  label="F.Inicial contrato"
                  outlined
                  clearable
                  hide-details
                  v-model="form.finicial"
                ></v-text-field>-->
              </v-col>
              <v-col cols="3">
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
                      v-model="form.ffinal"
                      label="F. Final contrato"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.ffinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- <v-col cols="3">
                <v-text-field
                  label="F. Final contrato"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ffinal"
                ></v-text-field>
              </v-col> -->
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="8">
                <v-text-field
                  label="Objeto Contrato"
                  outlined
                  v-model="form.objeto"
                  hide-details
                  type="text"
                  @input="errores.objeto = false"
                  :error="errores.objeto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="Responsable"
                  outlined
                  v-model="form.responsable"
                  hide-details
                  type="text"
                  @input="errores.responsable = false"
                  :error="errores.responsable"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Id Responsable"
                  outlined
                  clearable
                  hide-details
                  v-model="form.idresponsable"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-1">
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Telefono"
                  outlined
                  v-model="form.telresponsa"
                  hide-details
                  type="text"
                  @input="errores.telresponsa = false"
                  :error="errores.telresponsa"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="Dirección"
                  outlined
                  v-model="form.dirresponsa"
                  hide-details
                  type="text"
                  @input="errores.dirresponsa = false"
                  :error="errores.dirresponsa"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider color="succes"></v-divider>
            <v-divider color="succes"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Detalle del Extracto</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Origen/Destino"
                  outlined
                  hide-details
                  clearable
                  v-model="form.origen"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex">
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Vehiculo"
                  :items="placas"
                  outlined
                  clearable
                  :item-text="format_placas"
                  item-value="placa_rep"
                  v-model="form.vehiculo"
                  hide-details
                  return-object
                  @change="montar_placa(), (errores.vehiculos = false)"
                  :error="errores.vehiculos"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Marca"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.marca"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Modelo"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.modelo"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="3">
                  <v-text-field
                    label="Clase"
                    outlined
                    hide-details
                    clearable
                    disabled
                    v-model="form.clase"
                  ></v-text-field>
                </v-col> -->
              <v-col cols="6">
                <v-text-field
                  label="Convenio Colaboración"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.convenio"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-1">
              <v-col cols="3">
                <v-text-field
                  label="Nro.Interno"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.interno"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="T.Operación"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.toperacion"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider color="succes"></v-divider>
            <v-divider color="succes"></v-divider>
            <v-row class="d-flex mt-1">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Conductor_1"
                  v-model="form.conductor1"
                  item-value="identificacion_rut"
                  :items="conductores"
                  :item-text="format_clientes"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="montar_cond1(), (errores.conductor1 = false)"
                  :error="errores.conductor1"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Licencia"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.licencia"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Vigencia"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.vigencia"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Conductor_2"
                  v-model="form.conductor2"
                  :items="conductores"
                  :item-text="format_clientes"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="montar_cond2()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Licencia"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.licencia2"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Vigencia"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.vigencia2"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Conductor_3"
                  v-model="form.conductor3"
                  hide-details
                  return-object
                  outlined
                  :items="conductores"
                  :item-text="format_clientes"
                  @change="montar_cond3()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Licencia"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.licencia3"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Vigencia"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.vigencia3"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="indigo darken-1"
            class="white--text"
            large
            depressed
            @click="grabar_documento"
            >Grabar Documento</v-btn
          >
          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            large
            :loading="load.imprimir_factura"
            @click="print_item"
            >Pre_Imprimir</v-btn
          >
          <!-- <v-btn
            color="orange darken-1"
            class="white--text"
            large
            depressed
            :disabled="disabled.imprimir_factura"
            @click="dialogoconcepto.estado = true"
            >Contabilizar
            </v-btn> -->
          <!-- <v-btn
            color="green darken-1"
            class="white--text"
            large
            depressed
            :disabled="disabled.imprimir_factura"
            @click="send_dian()"
            >Enviar Dian
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import { extracto_contrato } from "../../_formatos_trans.js";

export default {

  data() {
    return {
      dialogPicker: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,

      agencias: [],
      ubica: [],
      clientes: [],
      placas: [],
      empresa: [],
      productos: [],
      conductores: [],
      prefijos: [],
      contratos: [],
      listas: [],
      conceptosc: [],
      tablaruts: [],
      tablaccosto: [],
      cuentasContables: [],
      caja_comision: false,
      dis_contrato: 0,
      nro_print: 0,

      comprobante: {
        conc_conta: null,
        rut: null,
        ccosto: null,
        valor: null,
        iva: null,
        detalle: null,
        documento: 0,
        facturas: null,
      },

      error: {
        conc_conta: false,
        rut: false,
        ccosto: false,
        valor: false,
        iva: false,
        detalle: false,
        documento: false,
        tipoDocumento: false,
        facturas: false,

      },

      load: {
        btn_enviar: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
        consecutivo: false,
        servicios: false,
      },
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "key",
          },
          {
            text: "Descripción",
            align: "left",
            value: "producto",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "valor",
          },
          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Total",
            align: "center",
            value: "total",
          },
          {
            text: " ",
            align: "center",
            value: "action",
          },
        ],
        data: [],
        dataconta: [],
        totales: {},
      },
      form: {
        fpago: 1,
        valorRetencion: 0,
        valorNeto: 0,
      },
      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
      },
      dialogoconcepto: {
        estado: false,
        tipo: true,
        loader: false,
      },

      articulo_select: {
        barras: null,
        producto: null,
        lista: null,
        iva: 0,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
        ubicaciones: [],
        observacion: null,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
      },
      errores: {
        punto_fact: false,
        clientes: false,
        responsable: false,
        nrocontrato: false,
        dirresponsa: false,
        telresponsa: false,
        objeto: false,
      },
      print: {
        comprobante: null,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      search: null,
      input_articulo: false,

      modal_anticipos: {
        estado: false,
        data: [],
      },
    };
  },
  created() {
    this.cargar_empresa();
    this.get_Clientes();
    this.get_Conductores();
    this.cargarVehiculos();
    this.cargarTablaAg();
    this.get_fecha();
  },
  watch: {},
  methods: {
    cargarVehiculos: function () {
      post
        .postData({
          url: "Transporte/dlls/CfvehiculoVJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.placas = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    grabar_documento() {
      var data = this.form;
      this.dataconta = JSON.parse(JSON.stringify(this.form));
      let total = parseFloat(this.tablaDetalle?.totales?.total) || 0;
      this.dataconta.total = total;

      var detalle = this.tablaDetalle.data;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona una Agencia");
      } else if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Registra un Cliente");
      } else if (!data.nrocontrato) {
        this.errores.nrocontrato = true;
        this.send_error("Registre un Nro contrato");
      } else if (!data.objeto) {
        this.errores.objeto = true;
        this.send_error("Registre un Objeto del contrato");
      } else  if (!data.responsable) {
        this.send_error("Selecciona un Responsable");
        this.errores.responsable = true;
      } else if (!data.vehiculo) {
        this.send_error("Selecciona un Vehiculo");
      } else if (!data.conductor1) {
        this.send_error("Selecciona un Conductor");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        let sesion = sessionStorage.Sesion;
        let agencia = data.punto_fact.codigo_agc;
        let consecutivo = data.consecutivo.trim();
        let fecha = data.fecha.replace(/\-/g, "");
        let contrato = data.nrocontrato;
        let fechaini = data.finicial.replace(/\-/g, "");
        let fechafin = data.ffinal.replace(/\-/g, "");
        let cliente = data.clientes.trim();
        let idcliente = data.identificacion.trim();
        let responsable = data.responsable.trim();
        let idresponsable = data.idresponsable.trim();
        let telresponsa = data.telresponsa.trim();
        let dirresponsa = data.dirresponsa.trim();
        let objeto = data.objeto.trim();

        let origen = data.origen.trim();
        let convenio = data.convenio.trim();
        let vehiculo = data.vehiculo.placa_rep;
        let conductor1 = data.conductor1.identificacion_rut;

        let conductor2 = data.conductor2
          ? data.conductor2.identificacion_rut
          : "0";
        let conductor3 = data.conductor3
          ? data.conductor3.identificacion_rut
          : "0";

        var datosEnvio =
          sesion +
          "|" +
          agencia +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          idcliente +
          "|" +
          cliente +
          "|" +
          contrato +
          "|" +
          idresponsable +
          "|" +
          responsable +
          "|" +
          telresponsa +
          "|" +
          dirresponsa +
          "|" +
          origen +
          "|" +
          vehiculo +
          "|" +
          conductor1 +
          "|" +
          conductor2 +
          "|" +
          conductor3 +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          objeto +
          "|";
        post
          .postData({
            url: "trespecial/dlls/PrExtracto.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.nro_print = parseFloat(data[0].Consc);
            this.load.btn_enviar = false;
            this.disabled.btn_enviar = false;
            this.reset_formulario();
            this.$emit("snack", {
              color: "success",
              text: "Documento guardado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.load.btn_enviar = false;
            this.disabled.btn_enviar = false;
            console.error(err);
            this.send_error("Error al grabar Documento");
          });
      }
    },
    reset_formulario() {
      this.clear_form();
      this.form.clientes = null;
      this.get_consecutivo();
    },
    montar_placa() {
      this.form.marca = this.form.vehiculo.marca_rep.trim();
      this.form.modelo = this.form.vehiculo.modelo_rep.trim();
      this.form.clase = this.form.vehiculo.tipo_rep.trim();
      this.form.interno = parseFloat(this.form.vehiculo.nrointer_rep);
      this.form.toperacion = parseFloat(this.form.vehiculo.nrotopera_rep);
      this.form.convenio = this.form.vehiculo.convenio_rep.trim();
    },
    montar_cond1() {
      this.form.licencia = this.form.conductor1.licencia_rut.trim();
      this.form.vigencia = this.form.conductor1.fechavpase_rut.trim();
    },
    montar_cond2() {
      this.form.licencia2 = this.form.conductor2.licencia_rut.trim();
      this.form.vigencia2 = this.form.conductor2.fechavpase_rut.trim();
    },
    montar_cond3() {
      this.form.licencia3 = this.form.conductor3.licencia_rut.trim();
      this.form.vigencia3 = this.form.conductor3.fechavpase_rut.trim();
    },
    montar_contrato() {
      if (this.form.contrato.cliente_rep == "0") {
        this.form.finicial = this.$moment().format("YYYY-MM-DD");
        this.form.ffinal = this.$moment().format("YYYY-MM-DD");
        this.dis_contrato = 1;
      } else {
        this.form.finicial = this.form.contrato.fechaini_rep;
        this.form.ffinal = this.form.contrato.fechafin_rep;
        this.form.nrocontrato = this.form.contrato.contrato_repc.trim();
        this.dis_contrato = 0;
      }
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },

    print_item() {
      let agencia = this.form.punto_fact.codigo_agc;
      let consec = this.nro_print;
      var key = agencia + "|" + consec + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "trespecial/dlls/PrExtracto01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.format_impresion(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    format_impresion(data) {
      data = {
        ...data,
        direccionEmpresa: this.empresa[0].direccion_empr,
        telEmpresa: this.empresa[0].telefono_empr,
        ciudadEmpresa:
          this.empresa[0].Ciudad.trim() +
          "-" +
          this.empresa[0].Departamento.trim(),
        correoEmpresa: this.empresa[0].email_empr.trim(),
      };
      var logo_src = require(`../../assets/image/logos/ext_llanoline.png`);
      var firma_src = require(`../../assets/image/firmas/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        this.pdfs.getBase64(firma_src).then((firma) => {
          data.firma = firma;
          extracto_contrato(data).then(() => {});
        });
      });
    },

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_contratos(val) {
      return `${parseInt(val.contrato_repc) || 0} - ${val.fechafin_rep}`;
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.codigo_agc == "0001");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + "07" + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    get_Conductores() {
      post
        .postData({
          url: "Molinos/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.conductores = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar conductores",
            estado: true,
          });
        });
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
          this.caja_comision = false;
          let idempresa = parseInt(this.empresa[0].id_empr);
          if (idempresa == 901463277) {
            this.caja_comision = true;
          }
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    get_consecutivo() {
      var $this = this;
      this.load.consecutivo = true;
      // var fecha = this.form.fecha.replace(/-/g, "");
      post
        .postData({
          url: "trespecial/dlls/PrExtractoCJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = data[0].Consc.trim();
        })
        .catch((err) => {
          this.load.consecutivo = false;
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    get_contratos() {
      var $this = this;
      this.load.consecutivo = true;
      var cliente = this.form.clientes.identificacion_rut;
      post
        .postData({
          url: "trespecial/dlls/Prcontr01J.dll",
          data: sessionStorage.Sesion + "|" + cliente + "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          data.pop();
          this.contratos = data;

          this.contratos.push({
            cliente_rep: "0",
            consec_rep: "0",
            fechafin_rep: "Sin contrato",
          });
        })
        .catch((err) => {
          this.load.consecutivo = false;
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    get_fecha() {
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
    },
    clear_form() {
      this.articulo_select = {
        producto: null,
        lista: null,
        iva: 0,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
        ubicaciones: [],
        observacion: null,
      };
      this.form.valorRteica = 0;
      this.form.valorRetencion = 0;
      this.form.porcRetencion = 0;
      this.form.valorNeto = 0;
    },
    format_placas: function (val) {
      return `${val.placa_rep.trim()}`;
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
