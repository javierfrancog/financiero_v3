<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="load.card"
        :disabled="load.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-question-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Servicios pendientes por Facturar cl</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="1300px">
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Prestación de servicios</span>
                    </v-card-title>
                    <v-container>
                      <v-row>
                        <v-col class="d-flex" cols="12" sm="7">
                          <v-autocomplete
                            outlined
                            label="Contrato"
                            :items="contratos"
                            :item-text="format_contrato"
                            item-value="nro"
                            hide-details
                            v-model="contrato_select"
                            @change="get_servicios"
                            clearable
                            :error="errores.contrato"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-card-actions></v-card-actions>
                    </v-container>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :items="contratos_clrpServ101"
                  :item-text="format_contrato"
                  item-value="nro"
                  v-model="selectContrato"
                  :loading="load.contratos"
                  hide-details
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
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
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
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
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-row justify="center">
                <v-col class="d-flex" cols="12" sm="4">
                  <v-switch
                    v-model="form.sptes"
                    label="Solo pendientes"
                  ></v-switch>
                </v-col>

                <v-col class="d-flex align-center" cols="12" sm="4">
                  <v-btn
                    color="indigo"
                    class="white--text"
                    large
                    depressed
                    @click="consultarServicios"
                  >
                    Consultar
                    <v-icon right dark>mdi-file-upload-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-menu
                  v-model="fechaFactura_picker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fechaFactura"
                      label="Fecha de la Factura"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fechaFactura"
                    @input="fechaFactura_picker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  :items="anios_select"
                  label="Año del servicio"
                  outlined
                  clearable
                  hide-details
                  v-model="form.anoserv"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoserv"
                ></v-select>
              </v-col>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="nro"
              :search="search"
              v-if="prest_servicios.length != 0"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="item.factura.trim() ? false : true"
                      color="green"
                      class="ma-2 white--text"
                      @click="confirmar_receptor(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                      :disabled="
                        parseInt(item.factura.trim()) == 0 ? false : true
                      "
                    >
                      <v-icon>mdi-text-box-check-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Facturar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="send_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="
                        parseInt(item.factura.trim()) == 0 ? true : false
                      "
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar DIAN</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf_facse(item)"
                      :disabled="item.iddian_fact ? false : true"
                    >
                      <v-icon>mdi-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Definitiva</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="orange"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      fab
                      @click="subir_soportes(item)"
                    >
                      <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir soportes</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="
                        parseInt(item.factura.trim()) == 0 ? true : false
                      "
                      color="blue"
                      class="ma-2 white--text"
                      @click="imprimir_factura(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Pre-factura</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="indigo"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="down_file(item)"
                      fab
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir soportes</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
      <v-dialog
        v-model="dialogo_archivo.estado"
        width="600"
        max-width="90%"
        persistent
      >
        <v-card
          :loading="dialogo_archivo.loader"
          :disabled="dialogo_archivo.loader"
        >
          <v-card-title>Adjuntar documento</v-card-title>
          <v-card-text>
            <v-file-input
              label="Buscar PDF"
              outlined
              chips
              counter
              color="blue darken-1"
              hide-details
              :show-size="1000"
              accept="application/pdf"
              v-model="dialogo_archivo.model"
              id="archivo_pdf"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
            <v-btn
              depressed
              color="blue darken-2"
              class="white--text px-12 mx-5"
              @click="up_file"
              >Subir archivo</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-flex>
    <v-dialog v-model="dialogofact.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Receptor de la Factura</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="Receptor"
                v-model="form.rut"
                :items="tablaruts"
                :item-text="format_ruts"
                item-value="item.identificacion"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="cerrar_receptor()"
                >Grabar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="dialogofact.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Agregar item</v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-autocomplete
                label="Servicio"
                :items="servicios"
                outlined
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="servicio_select.codigo"
                :item-text="format_servicios"
                @change="change_servicio_modal"
                :loading="load.servicios"
              ></v-autocomplete>
            </v-row>
            <v-row>
              <v-col sm="6">
                <v-text-field
                  label="Grupo"
                  outlined
                  disabled
                  hide-details
                  v-model="servicio_select.grupo"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  label="IVA"
                  outlined
                  disabled
                  hide-details
                  v-model="servicio_select.tar_iva"
                  suffix="%"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Valor"
                  outlined
                  disabled
                  hide-details
                  suffix="$"
                  v-money="money"
                  v-model="servicio_select.valor"
                  ref="input_valor"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  v-model="servicio_select.cantidad"
                  @input="calcularSubtotal"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="servicio_select.total"
                  ref="input_total"
                  v-money="money2"
                  suffix="$"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-form>
        <v-card-actions>
          <v-row class="d-flex justify-end">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="red darken-4 "
                text
                class
                block
                @click="
                  dialogo.estado = false;
                  clear_form();
                "
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                v-if="dialogo.tipo"
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_servicio"
                >Agregar servicio</v-btn
              >
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                @click="modificar_servicio"
                >Modificar articulo</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fechaFactura_picker: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      fecha_final: this.$moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Sede", align: "center", value: "sede" },
        { text: "Numero", align: "center", value: "numero" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Id_Paciente", align: "center", value: "identificacion" },
        { text: "Desc_Paciente", align: "center", value: "descrip_paciente" },
        { text: "Autorizacion", align: "center", value: "autorizacion" },
        { text: "Prefijo", align: "center", value: "preffactura" },
        { text: "Factura", align: "center", value: "nrofactura" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      dialog: false,
      valid: false,
      form: [],
      tablaruts: [],
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      load: {
        contratos: true,
        pacientes: true,
        servicios: false,
        btn_enviar: false,
        citas: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
        card: false,
      },
      card: {
        loader: false,
        disabled: false,
      },

      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "index",
          },
          {
            text: "Código",
            align: "center",
            value: "codigo",
          },
          {
            text: "Lote",
            align: "center",
            value: "lote",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descripcion",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Iva",
            align: "center",
            value: "valor_iva",
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
        totales: {},
      },
      selectContrato: null,
      prest_servicios: [],
      contratos_clrpServ101: [],
      contratos: [],
      pacientes: [],
      servicios: [],
      info_servicios: {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: null,
        cuotaModeradora: null,
        paciente: null,
        observaciones: null,
        descuento: null,
        medio_pago: 1,
        cita: null,
        diagnostico: null,
      },
      contrato_select: [],
      dialogo: {
        estado: false,
        tipo: true,
      },
      servicio_select: {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      },
      edit_index: -1,
      errores: {
        contrato: false,
        paciente: false,
        autorizacion: false,
        copago: false,
        cuota: false,
        observaciones: false,
        cita: false,
        anoserv: false,
        diagnostico: false,
      },
      citas: [],
      diagnosticos: [],
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      dialogofact: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      grabar: {
        disabled: false,
      },
      disabled: {
        generar_factura: true,
        imprimir_factura: true,
      },

      datos_factura: {
        fecha_atencion: null,
        consecutivo: null,
      },
      fechaFactura: null,
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      empresa: null,
      item_fact: {},
    };
  },
  created() {
    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          let sub_total =
            parseFloat(val.sub_total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.sub_total += sub_total;

          let total_iva = parseFloat(val.iva_total) || 0;
          $this.tablaDetalle.totales.total_iva += total_iva;

          let total = parseFloat(val.total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total += total;
        });
      },
      { deep: true }
    );
    this.cargar_años();
    this.get_contratos();
    this.cargar_empresa();
    this.cargarTablaruts();
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
    // fecha_ini() {
    //   this.fecha_final = this.fecha_ini;
    // },
  },
  methods: {
    confirmar_receptor(item) {
      this.item_fact = item;

      var busqueda_cliente = this.tablaruts.find(
        (el) => el.identificacion_rut == item.idcliente
      );
      this.form.rut = busqueda_cliente;

      this.dialogofact.estado = true;
    },
    cerrar_receptor() {
      this.dialogofact.estado = false;
      this.generar_factura(this.item_fact);
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
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
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut.trim()} - ${val.descripcion_rut}`;
    },
    get_pdf_facse(item) {
      this.load.card = true;
      var id_factura = item.iddian_fact;
      var $this = this;

      var urlEnvio = null;
      if (this.empresa.felectronica_empr == "0")
        urlEnvio = "https://server1ts.net/facturae/consulta_pdf.php";
      else urlEnvio = "https://server1ts.net/facturae/consulta_pdf.prod.php";

      var formData = new FormData();
      formData.append("key_factura", id_factura);
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.load.card = false;
          $this.send_error(error);
        })
        .then((data) => {
          this.load.card = false;
          var response = JSON.parse(data.res);
          if (response.Respuesta) {
            const linkSource = `data:application/pdf;base64,${response.PdfBase64}`;
            const downloadLink = document.createElement("a");
            const fileName = id_factura + ".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          } else {
            $this.send_error("Error: " + response.MensajeRespuesta);
          }
        });
    },
    get_pdf(item) {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento = "FE";
      let consecutivo = item.numero.replace(/\ /g, "");
      let nombrePdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      var ruta2 = `https://server100ts.net/pdfs/${nombrePdf}.pdf`;
      window.open(ruta2, "_blank");
    },
    send_dian(item) {
      var prefijo = item.factura.substring(0, 3).trim();
      var numero = item.factura.substring(4, 16);
      var fecha = item.fecha;
      this.load.card = true;
      post
        .postData({
          url: "Clinico/dlls/ClRpFact01FEJ.dll",
          data: `${sessionStorage.Sesion}|01|${prefijo}|${numero}|${fecha}|`,
          method: "",
        })
        .then((data) => {
          this.send_facse(data[0]);
        })
        .catch((err) => {
          this.load.card = false;
          this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error durante la consulta",
            estado: true,
          });
        });
    },
    send_facse(factura) {
      var _this = this;
      var urlEnvio = null;
      if (this.empresa.felectronica_empr == "0")
        urlEnvio = "https://server1ts.net/facturae/consulta.php";
      else urlEnvio = "https://server1ts.net/facturae/consulta.prod.php";

      var formData = new FormData();
      formData.append("factura", JSON.stringify(factura));
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.load.card = false;
          _this.send_error(
            "Ha ocurrido un error durante el envío de la factura: " + error
          );
        })
        .then((response) => {
          var res = JSON.parse(response.res);
          if (response.codigo == "0") {
            if (res.IdDocumento.Respuesta) {
              this.grabar_cufe(factura, res);
            } else {
              _this.load.card = false;
              _this.$emit("snack", {
                color: "success",
                text: res.RespuestaFacse,
                estado: true,
              });
            }
          } else {
            _this.load.card = false;
            this.send_error("Error enviando la factura electrónica");
          }
        });
    },
    grabar_cufe(item, res) {
      var _this = this;
      var prefijo = item.Comprobante.Prefijo;
      var consecutivo = item.Comprobante.Numero;
      var fecha = this.fecha_ini.replace(/\-/g, "");
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        res.IdDocumento.Contenido +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClPrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          _this.load.card = false;
          this.consultarServicios();
          _this.$emit("snack", {
            color: "success",
            text: res.RespuestaFacse,
            estado: true,
          });
        })
        .catch((err) => {
          _this.load.card = false;
          _this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    imprimir_factura(item) {
      var $this = this;
      $this.load.card = true;
      var key = item.factura.substr(4);
      let prefijo = item.preffactura.trim();
      post
        .postData({
          url: "Clinico/dlls/Titcl103R.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "01" +
            "|" +
            prefijo +
            "|" +
            key +
            "|",
          method: "POST",
        })
        .then((data) => {
          $this.load.card = false;

          data = data[0];
          // let url_firma =   "https://server1ts.net/Datos/50001/" +
          //   sessionStorage.Sesion.substr(0, 15) +
          //   "/FACT00000090099286.jpg";

          let url_firma = " ";

          document.getElementsByClassName("imf_firma")[0].src = url_firma;
          Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
            var obj = document.getElementsByClassName(val + "2")[0];
            if (val == "servicios") {
              var pacientes = data[val].dato_paciente;
              var parent = document
                .getElementById("pdf2_body_titcl101")
                .getElementsByTagName("tbody")[0];

              var subtotal = 0,
                subtotal_iva = 0,
                subtotal_total = 0,
                subtotal_descuento = 0;

              pacientes.forEach((el) => {
                var actual_row = parent.rows.length;
                var row = parent.insertRow(actual_row);

                var cell = row.insertCell(0);
                cell.innerHTML = `<b>Paciente :</b> ${el.nombre_paciente} <b>${el.tipo_id} :</b> ${el.id_paciente} <b>Régimen :</b> ${el.regimen_paciente}`;
                cell.colSpan = 6;
                cell.style = "border-bottom: 1px solid;text-align: left;";

                var articulos = el.articulos;
                articulos.forEach((item) => {
                  var actual_row = parent.rows.length;
                  var row = parent.insertRow(actual_row);
                  row
                    .insertCell(0)
                    .appendChild(document.createTextNode(item.codigo));
                  row
                    .insertCell(1)
                    .appendChild(document.createTextNode(item.nombre_servicio));

                  var cell = row.insertCell(2);
                  cell.innerHTML = "<b>" + item.autorizacion + "</b>";

                  row
                    .insertCell(3)
                    .appendChild(document.createTextNode(item.cantidad));
                  row
                    .insertCell(4)
                    .appendChild(document.createTextNode(item.vlr_unit));
                  row
                    .insertCell(5)
                    .appendChild(document.createTextNode(item.subtotal));
                  row
                    .insertCell(6)
                    .appendChild(document.createTextNode(item.vlr_iva));
                  row
                    .insertCell(7)
                    .appendChild(document.createTextNode(item.vlr_total));

                  subtotal += parseFloat(item.subtotal.replace(/\,/g, "")) || 0;
                  subtotal_iva +=
                    parseFloat(item.vlr_iva.replace(/\,/g, "")) || 0;
                  subtotal_total +=
                    parseFloat(item.vlr_total.replace(/\,/g, "")) || 0;
                  subtotal_descuento +=
                    parseFloat(item.vlr_dcto.replace(/\,/g, "")) || 0;
                });
              });

              var subtotal_final = subtotal_total - subtotal_descuento;

              document.getElementsByClassName("subtotal_final")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_final.toString());

              document.getElementsByClassName(
                "factura_subtotal"
              )[0].innerHTML += " " + $this.formatNumero(subtotal.toString());

              document.getElementsByClassName("factura_iva")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_iva.toString());

              document.getElementsByClassName("factura_total")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_total.toString());

              document.getElementsByClassName(
                "factura_descuento"
              )[0].innerHTML +=
                " " + $this.formatNumero(subtotal_descuento.toString());

              var copago_total =
                parseFloat(data.copago.replace(/\,/g, "")) || 0;
              var cuotam_total =
                parseFloat(data.cuotam.replace(/\,/g, "")) || 0;

              var total_final = subtotal_final - copago_total - cuotam_total;

              document.getElementsByClassName("total_final")[0].innerHTML +=
                " " + $this.formatNumero(total_final.toString());

              var letras = numeroALetras(total_final, {
                plural: "",
                singular: "",
                centPlural: "pesos",
                centSingular: "pesos",
              });
              // document.getElementsByClassName("total_final")[0].innerHTML +=
              //   " " + $this.formatNumero(total_final.toString());
              document.getElementsByClassName(
                "valorLetras_impresion"
              )[0].innerHTML += " " + letras;
            } else if (obj) obj.innerHTML += " " + data[val].trim();
          });
          $this.load.card = false;
          imprimir_pdf2();
        })
        .catch((err) => {
          $this.load.card = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
    async up_file() {
      if (!this.dialogo_archivo.model) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        let empresa = sessionStorage.Sesion.substr(0, 15);
        let consec = parseFloat(this.item_select.numero);
        let prefijo = this.item_select.preffactura.trim();
        let sede = this.item_select.sede.trim();
        let nombre_pdf = empresa + "PRSERV_" + sede + "_" + consec + ".pdf";
        //let nombre_pdf = empresa + "FACT_" + prefijo + consec + ".pdf";

        let data = new FormData();
        data.append("nombre_pdf", nombre_pdf);
        data.append("file", this.dialogo_archivo.model);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/salud.php",
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
        this.dialogo_archivo.estado = false;
        this.consultarServicios();
      }
      this.dialogo_archivo.estado = false;
    },
    down_file(item) {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let prefijo = item.preffactura.trim();
      let sede = item.sede.trim();
      let consecutivo = parseFloat(item.numero.trim());
      //      let idFile = empresa + "FACT_" + prefijo + consecutivo + ".pdf";
      let idFile = empresa + "PRSERV_" + sede + "_" + consecutivo + ".pdf";
      let periodo = item.fecha.substr(0, 6);

      if (empresa == 900767863 && periodo < 202412) {
        let ruta = item.iddrive;
        const url =
          `https://drive.google.com/file/d/` +
          ruta.trim() +
          `/view?usp=drive_link`;
        window.open(url, "_blank").focus();
      } else {
        const url =
          "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

        const timestamp = new Date().getTime();
        const urlSinCache = `${url}?_=${timestamp}`;
        window.open(urlSinCache, "_blank");
      }
    },

    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.consecutivo = null;
    },
    subir_soportes(item) {
      this.item_select = item;
      this.dialogo_archivo.estado = true;
      this.dialogo_archivo.ruta_pdf = item.rutapdf;
      this.dialogo_archivo.consecutivo = item.numero.replace(/\ /g, "");
    },
    get_contratos: function () {
      post
        .postData({
          url: "Clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "POST",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos_clrpServ101 = data;
          this.load.contratos = false;
          // this.get_pacientes();
        })
        .catch((err) => {
          this.load.contratos = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    get_pacientes() {
      post
        .postData({
          url: "Clinico/dlls/titCL301j.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.pacientes = data;
          this.load.pacientes = false;
          this.get_diagnosticos();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true,
          });
        });
    },
    get_diagnosticos() {
      post
        .postData({
          url: "datos/base/CIE10.json",
          data: sessionStorage.Sesion + "|",
          method: "GET",
        })
        .then((data) => {
          this.diagnosticos = data.cie10;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    get_servicios() {
      this.errores.contrato = false;
      if (this.contrato_select) {
        this.load.servicios = true;
        post
          .postData({
            url: "Clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + this.contrato_select + "|",
            method: "POST",
          })
          .then((data) => {
            this.load.servicios = false;
            this.servicios = data[0].servicios;
          })
          .catch((err) => {
            this.load.servicios = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    get_citas() {
      if (this.info_servicios.paciente) {
        this.load.citas = true;
        post
          .postData({
            url: "Clinico/dlls/titCL102JP.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              this.info_servicios.paciente +
              "|1|",
            method: "POST",
          })
          .then((data) => {
            // this.citas = data;
          })
          .catch((err) => {
            this.load.citas = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar las citas del paciente",
              estado: true,
            });
          });
      }
    },
    cargar_empresa() {
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
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    format_contrato(val) {
      return val.nro + " - " + val.descripcion + "-" + val.detalle;
    },
    format_pacientes(val) {
      return `${val.identificacion} - ${val.primerApellido} ${val.segundoApellido} ${val.nombres}`;
    },
    format_servicios(val) {
      return `${val.codigo} - ${val.descripcion}`;
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    calcularSubtotal() {
      var item = this.servicio_select;

      if (item.codigo) {
        var iva = parseFloat(item.tar_iva) || 0,
          parse_iva = iva / 100,
          valor_neto = parseFloat(item.valor.replace(/\,/g, "")) || 0,
          iva_tmp = parse_iva + 1,
          subtotal = valor_neto * iva_tmp,
          cantidad = parseFloat(item.cantidad) || 0,
          total = subtotal * cantidad;

        this.servicio_select.total = total.toFixed(2);
        this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
          total.toFixed(2);

        var valor_iva = valor_neto * parse_iva;
        this.servicio_select.valor_iva = valor_iva;
        this.servicio_select.iva_total = valor_iva * cantidad;
        this.servicio_select.sub_total = valor_neto * cantidad;
      }
    },
    change_servicio_modal(data) {
      if (data) {
        var copia = JSON.parse(JSON.stringify(data));
        this.servicio_select = copia;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          copia.valor;
        this.servicio_select.cantidad = this.servicio_select.cantidad || 1;
        this.calcularSubtotal();
      } else this.clear_form();
    },
    agregar_servicio() {
      var item = JSON.parse(JSON.stringify(this.servicio_select));
      item.lote = "00";
      this.tablaDetalle.data.push(item);
      this.dialogo.estado = false;
      this.clear_form();
    },
    clear_form() {
      this.servicio_select = {};
      this.servicio_select = {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      };
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = 0;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value = 0;
      this.edit_index = -1;
    },
    formatNumero: function (val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: ".",
      });
      mask.resolve(val.toString());
      return "$ " + mask.value;
    },
    modificar_servicio() {
      if (this.edit_index > -1) {
        Object.assign(
          this.tablaDetalle.data[this.edit_index],
          this.servicio_select
        );
      }

      this.dialogo.estado = false;
      this.clear_form();
    },
    edit_item(item) {
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
        item.valor;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
        parseFloat(item.total.replace(/\,/g, "")).toFixed(2);

      this.dialogo.estado = true;
      this.servicio_select = JSON.parse(JSON.stringify(item));
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    alerta_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    calcularEdad(dateString) {
      var today = new Date();
      var DOB = new Date(dateString);
      var totalMonths =
        (today.getFullYear() - DOB.getFullYear()) * 12 +
        today.getMonth() -
        DOB.getMonth();
      totalMonths += today.getDay() < DOB.getDay() ? -1 : 0;
      var years = today.getFullYear() - DOB.getFullYear();
      if (DOB.getMonth() > today.getMonth()) years = years - 1;
      else if (DOB.getMonth() === today.getMonth())
        if (DOB.getDate() > today.getDate()) years = years - 1;

      var days;
      var months;
      var a;

      if (DOB.getDate() > today.getDate()) {
        months = totalMonths % 12;
        if (months == 0) months = 11;
        var x = today.getMonth();
        switch (x) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12: {
            a = DOB.getDate() - today.getDate();
            days = 31 - a;
            break;
          }
          default: {
            a = DOB.getDate() - today.getDate();
            days = 30 - a;
            break;
          }
        }
      } else {
        days = today.getDate() - DOB.getDate();
        if (DOB.getMonth() === today.getMonth()) months = totalMonths % 12;
        else months = (totalMonths % 12) + 1;
      }

      return { años: years, meses: months, dias: days };
    },

    enviar_servicio(linea_envio) {
      var $this = this;
      post
        .postData({
          url: "Clinico/dlls/TITCL101.dll",
          data: linea_envio,
          method: "POST",
        })
        .then((data) => {
          $this.load.btn_enviar = false;
          // $this.grabar.disabled = true;
          this.clear_form_PrServ();
          this.consultarServicios();
          this.dialog = false;
          $this.$emit("snack", {
            color: "success",
            text: "Registro grabado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          $this.load.btn_enviar = false;
          $this.$emit("snack", {
            color: "error",
            text: err,
            estado: true,
          });
        });
    },
    grabar_servicio() {
      var $this = this,
        paciente = this.pacientes.filter((e) => {
          if (e.identificacion == this.info_servicios.paciente) return e;
        });
      paciente = paciente[0] || null;
      if (!$this.contrato_select) {
        $this.errores.contrato = true;
        $this.alerta_error("Debes seleccionar un contrato");
      } else if (!paciente) {
        $this.errores.paciente = true;
        $this.alerta_error("Debes seleccionar un paciente");
      } else if (!$this.info_servicios.autorizacion) {
        $this.errores.autorizacion = true;
        $this.alerta_error("Ingresa un número de autorización");
      } else if ($this.tablaDetalle.data.length <= 0) {
        $this.alerta_error("Debes ingresar al menos un servicio en el detalle");
      } else if (!$this.info_servicios.medio_pago) {
        $this.alerta_error("Selecciona un medio de pago");
      } else if (!$this.info_servicios.diagnostico) {
        $this.errores.diagnostico = true;
        $this.alerta_error("Selecciona un diagnostico");
      } else {
        let contrato = this.contratos.filter((e) => {
          if (this.contrato_select == e.nro) return e;
        });
        contrato = contrato[0];
        this.load.btn_enviar = true;
        var fecha_actual = new Date(),
          mes = (fecha_actual.getMonth() + 1).toString().padStart(2, "0"),
          dia = fecha_actual.getDate().toString().padStart(2, "0"),
          año = fecha_actual.getFullYear().toString(),
          detalle = $this.tablaDetalle.data;

        var fecha = this.$moment(paciente.nacimiento).format("YYYY/MM/DD"),
          edad = $this.calcularEdad(fecha);
        let eliminar = this.info_servicios.eliminar ? 1 : 0;

        var linea_envio =
          sessionStorage.Sesion +
          "|" +
          this.info_servicios.consecutivo +
          "|" +
          this.info_servicios.fecha.split("-").join("") +
          "|" +
          this.info_servicios.paciente +
          "|" +
          contrato.identificacion +
          "|" +
          edad.años +
          "|" +
          edad.meses +
          "|" +
          edad.dias +
          "|" +
          this.info_servicios.copago.replace(/\,/g, "") +
          "|" +
          this.info_servicios.cuotaModeradora.replace(/\,/g, "") +
          "|" +
          this.info_servicios.descuento.replace(/\,/g, "") +
          "|" +
          this.info_servicios.medio_pago +
          "|" +
          this.tablaDetalle.data.length +
          "|" +
          contrato.nro +
          "|" +
          (this.info_servicios.observaciones || "") +
          "|" +
          this.info_servicios.autorizacion +
          "|" +
          this.info_servicios.nro_admon +
          "|" +
          this.info_servicios.diagnostico +
          "|" +
          this.info_servicios.nivel +
          "|" +
          this.info_servicios.id_agenda +
          "|" +
          this.info_servicios.fecha_agenda +
          "|" +
          this.info_servicios.hora_agenda +
          "|" +
          eliminar +
          "|" +
          "1" +
          "|" +
          "9|";
        var linea_items = "";
        detalle.forEach((item) => {
          linea_items +=
            item.codigo +
            ";" +
            item.cantidad +
            ";" +
            item.sub_total.toString() +
            ";" +
            item.iva_total.toString() +
            ";" +
            item.lote +
            ";";
        });

        linea_envio += linea_items + "|" + "0" + "|";

        this.enviar_servicio(linea_envio);
      }
    },
    generar_factura(item) {
      var $this = this;

      if (!this.form.anoserv) {
        this.errores.anoserv = true;
        this.send_error("Selecciona un año de Servicio");
      } else if (!this.fechaFactura) {
        $this.$emit("snack", {
          color: "error",
          text: "Selecciona la fecha de la factura",
          estado: true,
        });
      } else {
        this.load.card = true;
        var fechaFactura = this.fechaFactura.split("-").join("");
        var sede = item.sede;
        var numero = item.numero;
        var anoserv = this.form.anoserv;
        let cliente = this.form.rut.identificacion_rut;

        var datos =
          sessionStorage.Sesion +
          "|" +
          sede +
          "|" +
          numero.replace(/\ /g, "") +
          "|" +
          fechaFactura +
          "|" +
          anoserv +
          "|" +
          cliente +
          "|";
        post
          .postData({
            url: "Clinico/dlls/PrFactptes.dll",
            data: datos,
            method: "POST",
          })
          .then((data) => {
            this.load.card = false;
            this.consultarServicios();
            $this.$emit("snack", {
              color: "success",
              text: "Factura generada correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.load.card = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al generar la factura",
              estado: true,
            });
          });
      }
    },
    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    consultarServicios() {
      let estado_fecha = this._validarFechas();
      var ptes = this.form.sptes ? "1" : "0";
      this.prest_servicios = [];
      if (this.selectContrato) {
        if (estado_fecha) {
          this.loader = true;
          post
            .postData({
              url: "Clinico/dlls/ClRpPrest0101J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                1 +
                "|" +
                this.selectContrato.nro +
                "|" +
                this.selectContrato.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                ptes +
                "|",
              method: "",
            })
            .then((data) => {
              this.prest_servicios = data;
              this.loader = false;
            })
            .catch((err) => {
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios",
                estado: true,
              });
            });
        }
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un contrato",
          estado: true,
        });
      }
    },

    imprimir(key) {
      post
        .postData({
          url: "Clinico/dlls/titcl101r.dll",
          data: sessionStorage.Sesion + "|01|" + key + "|",
          method: "",
        })
        .then((data) => {
          var $this = this;
          data = data[0];
          //Llenar datos
          var subtotal = 0,
            subtotal_iva = 0,
            subtotal_total = 0;

          data.fecha_impresion = new Date().toJSON();
          Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
            if (val == "fecha2_atencion")
              $this.datos_factura.fecha_atencion = data[val];
            else if (
              (val != "servicios") &
              (val != "id_agenda") &
              (val != "dx") &
              (val != "fecha_agenda") &
              (val != "hora_agenda") &
              (val != "contrato") &
              (val != "nivel_paciente") &
              // (val != "tipo_id_paciente") &
              (val != "cod_medio")
            )
              document.getElementsByClassName(val)[0].innerHTML +=
                " " + data[val].trim();
            else if (
              (val != "id_agenda") &
              (val != "dx") &
              (val != "fecha_agenda") &
              (val != "hora_agenda") &
              (val != "contrato") &
              (val != "nivel_paciente") &
              (val != "tipo_id_paciente") &
              (val != "cod_medio")
            ) {
              var items = data[val];
              var parent = document
                .getElementById("pdf_body_titcl101")
                .getElementsByTagName("tbody")[0];
              // for (var i in parent) {
              // }
              items.forEach((val) => {
                var actual_row = parent.rows.length;
                var row = parent.insertRow(actual_row);
                row
                  .insertCell(0)
                  .appendChild(document.createTextNode(val.codigo));
                row
                  .insertCell(1)
                  .appendChild(document.createTextNode(val.nombre_servicio));
                row
                  .insertCell(2)
                  .appendChild(document.createTextNode(val.cantidad));
                row
                  .insertCell(3)
                  .appendChild(document.createTextNode(val.vlr_unit));
                row
                  .insertCell(4)
                  .appendChild(document.createTextNode(val.subtotal));
                row
                  .insertCell(5)
                  .appendChild(document.createTextNode(val.vlr_iva));
                row
                  .insertCell(6)
                  .appendChild(document.createTextNode(val.vlr_total));

                subtotal += parseFloat(val.subtotal.replace(/\,/g, "")) || 0;
                subtotal_iva += parseFloat(val.vlr_iva.replace(/\,/g, "")) || 0;
                subtotal_total +=
                  parseFloat(val.vlr_total.replace(/\,/g, "")) || 0;
              });

              document.getElementsByClassName(
                "subtotal_servicios"
              )[0].innerHTML += " " + $this.formatNumero(subtotal.toString());

              document.getElementsByClassName("subtotal_iva")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_iva.toString());

              document.getElementsByClassName("subtotal_total")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_total.toString());
            }
          });

          var descuento = parseFloat(data.descuento.replace(/\,/g, "")) || 0;
          var total = $this.formatNumero(
            (subtotal_total - descuento).toString()
          );
          document.getElementsByClassName(
            "total_servicios"
          )[0].innerHTML += `<b>${total}</b>`;
          imprimir_pdf();
        })
        .catch((err) => {
          // this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar servicios",
            estado: true,
          });
        });
    },
    opcionDialog(key) {
      post
        .postData({
          url: "Clinico/dlls/titcl101r.dll",
          data: sessionStorage.Sesion + "|01|" + key + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          this.contrato_select = data.contrato;
          this.info_servicios.consecutivo = data.nro_prestacion;
          this.info_servicios.fecha = this.$moment(data.fecha2_atencion).format(
            "YYYY-MM-DD"
          );
          this.info_servicios.autorizacion = data.autorizacion;
          this.info_servicios.paciente = data.id_paciente
            .split(",")
            .join("")
            .trim()
            .padStart(15, "0");
          data.servicios.forEach((k, v) => {
            this.tablaDetalle.data.push({
              codigo: k.codigo,
              lote: "00",
              descripcion: k.nombre_servicio,
              cantidad: parseFloat(k.cantidad),
              sub_total: k.subtotal.split(",").join("").trim(),
              iva_total: k.vlr_iva,
              total: k.vlr_total.split(",").join("").trim(),
              valor: k.subtotal.split(",").join("").trim(),
            });
          });

          this.info_servicios.copago = data.copago;
          this.info_servicios.cuotaModeradora = data.cuotam;
          this.info_servicios.descuento = data.descuento;

          this.info_servicios.nivel = parseInt(data.nivel_paciente) || 0;
          this.info_servicios.medio_pago = parseInt(data.cod_medio) || 0;
          this.info_servicios.diagnostico = data.dx.padEnd(8, " ");

          this.info_servicios.nro_admon = data.nro_admision;
          this.info_servicios.id_agenda = data.id_agenda.split(",").join("");
          this.info_servicios.fecha_agenda = data.fecha_agenda;
          this.info_servicios.hora_agenda = data.hora_agenda;
          this.info_servicios.tipo_id_paciente = data.tipo_id_paciente;
          this.info_servicios.estado = data.estado;
          this.get_servicios();
          this.dialog = true;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar servicios",
            estado: true,
          });
        });
    },
    clear_form_PrServ() {
      this.info_servicios = {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: null,
        cuotaModeradora: null,
        paciente: null,
        observaciones: null,
        descuento: null,
        medio_pago: 1,
        selectContrato: null,
        cita: null,
        diagnostico: null,
      };
      this.tablaDetalle.data = [];
      this.tablaDetalle.totales = {};
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

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print").innerHTML}</style>`
  );

  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    _emptyImpresion();
    //    location.reload();
  }, 2000);
}

function _emptyImpresion() {
  document.getElementsByClassName("nro_prestacion")[0].innerHTML = "No.";

  var header = document
    .getElementById("pdf_header_titcl101")
    .getElementsByTagName("a");

  header.forEach((value) => {
    if (value.className) {
      var text = "";
      if (value.className == "nit_ips") text = "Nit.";
      if (value.className == "regimen_ips") text = "Régimen común";
      if (value.className == "fecha_atencion")
        text = "<b>Fecha atención:</b><br />";
      if (value.className == "nombre_cliente") text = "<b>Cliente:</b>";
      if (value.className == "nit_cliente") text = "<b>Nit:</b>";
      if (value.className == "nro_admision") text = "<b>Admision:</b>";

      if (value.className == "nombre_paciente") text = "<b>Paciente :</b>";
      if (value.className == "id_paciente") text = "<b>:</b>";
      if (value.className == "tipo_id_paciente") text = "<b>Id:</b>";

      if (value.className == "direccion_paciente") text = "<b>Dirección :</b>";
      if (value.className == "telefono_paciente") text = "<b>Teléfono :</b>";
      if (value.className == "ciudad_paciente") text = "<b>Ciudad :</b>";
      if (value.className == "email_paciente") text = "<b>E-mail :</b>";
      if (value.className == "edad_paciente") text = "<b>Edad :</b>";
      if (value.className == "genero_paciente") text = "<b>Genero :</b>";
      if (value.className == "regimen_paciente") text = "<b>Regimen :</b>";
      if (value.className == "eps_paciente") text = "<b>Eps :</b>";
      if (value.className == "medio_pago") text = "<b>Medio pago :</b>";
      if (value.className == "p_atencion") text = "<b>P. Atención :</b>";

      document.getElementsByClassName(value.className)[0].innerHTML = text;
    }
  });

  document
    .getElementById("pdf_body_titcl101")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  document.getElementsByClassName("subtotal_servicios")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_iva")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_total")[0].innerHTML = "";
  document.getElementsByClassName("descuento")[0].innerHTML = "";
  document.getElementsByClassName("total_servicios")[0].innerHTML = "";
  document.getElementsByClassName("impreso")[0].innerHTML = "Impreso por:";
  document.getElementsByClassName("copago")[0].innerHTML = "$ ";
  document.getElementsByClassName("fecha_impresion")[0].innerHTML = "";
  document.getElementsByClassName("cuotam")[0].innerHTML = "$ ";
  document.getElementsByClassName("autorizacion")[0].innerHTML =
    "Nro.Autorizacion:";
  document.getElementsByClassName("info_qr")[0].innerHTML = "QR:";
}

function imprimir_pdf2() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print2").innerHTML}</style>`
  );

  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    _emptyImpresion2();
  }, 2000);
}

function _emptyImpresion2() {
  var header = document
    .getElementById("pdf2_header_titcl101")
    .getElementsByTagName("a");

  header.forEach((value) => {
    if (value.className) {
      var text = "";
      if (value.className == "nombre_cliente2") text = "<b>Cliente :</b>";
      if (value.className == "nit_cliente2") text = "<b>Nit :</b>";
      if (value.className == "direccion_cliente2") text = "<b>Dirección :</b>";
      if (value.className == "telefono_cliente2") text = "<b>Teléfono :</b>";
      if (value.className == "ciudad_cliente2") text = "<b>Ciudad :</b>";
      if (value.className == "correo_cliente2") text = "<b>E-mail :</b>";
      if (value.className == "fecha_factura2") text = "<b>Fecha factura :</b>";
      if (value.className == "vence_factura2")
        text = "<b>Fecha vencimiento :</b>";
      if (value.className == "cod_ica2") text = "<b>Actividad económica :</b>";

      document.getElementsByClassName(value.className)[0].innerHTML = text;
    }
  });

  document
    .getElementById("pdf2_body_titcl101")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  var footer = document
    .getElementById("pdf2_body_titcl101")
    .getElementsByTagName("tfoot")[0]
    .getElementsByTagName("td");

  footer.forEach((value) => {
    if (value.className) {
      var text = "";
      if (value.className == "base_gravada2") text = "$";
      if (value.className == "copago2") text = "$";
      if (value.className == "base_excluida2") text = "$";
      if (value.className == "cuotam2") text = "$";

      document.getElementsByClassName(value.className)[0].innerHTML = text;
    }
  });

  document.getElementsByClassName("impreso2")[0].innerHTML = "";
  document.getElementsByClassName("fecha_impre2")[0].innerHTML = "";
  document.getElementsByClassName("valorLetras_impresion")[0].innerHTML = "";
}

var numeroALetras = (function () {
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }

    return "";
  } //Unidades()

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOSCIENTOS " + Decenas(decenas);
      case 3:
        return "TRESCIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let letras = "";

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += "";

    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;

    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "PESOS M/CTE", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || "PESO M/CTE", //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || "M/CTE",
      letrasMonedaCentavoSingular: currency.centSingular || "M/CTE",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  };
})();
</script>
