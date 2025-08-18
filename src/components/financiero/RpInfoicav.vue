<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Reporte Exógena Industria y Comercio</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/ICA.png"
                  contain
                  width="250"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="2">
            <v-menu
              v-model="pickerMesfin"
              close-on-content-click
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechafin"
                  label="Fecha de Corte"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechafin"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechafin"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechafin = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-autocomplete
              :items="mpios"
              label="Municipio a Reportar"
              v-model="form.municipio"
              hide-details
              return-object
              clearable
              outlined
              @change="seleccionar_ciudad"
            ></v-autocomplete>
          </v-col>

          <!-- <v-col class="d-flex align-end">
            <v-btn color="red white--text" class @click="validar()" depressed>
              <v-icon size="20" left>mdi-book-outline</v-icon>
              Ver Config Puc
            </v-btn>
          </v-col> -->
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
        <v-row class="mt-2">
          <v-col class="d-flex" cols="6" v-if="selbta">
            <v-autocomplete
              :items="formatosbta"
              label="Formato Exógena"
              v-model="form.format_exogena"
              hide-details
              return-object
              clearable
              outlined
              @change="filtrar_conceptos"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              color="orange"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="generarExogena"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Generar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>

            <v-btn
              color="indigo darken-3 white--text"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="consultarExog"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>

            <v-btn
              color="teal lighten-1"
              class="ma-2 white--text px-12"
              large
              depressed
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
              @click="descargar_prev"
            >
              Formato Excel
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
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
          :search="search"
        >
          <!-- <template v-slot:item.edit="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="editar_formato(item)"
                  color="indigo accent-3"
                  fab
                  small
                  icon
                  outlined
                  v-on="on"
                  class="mr-2"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
          </template> -->
        </v-data-table>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo_1100102.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Formato Compras -Art. 2-</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1100102"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1100102"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Reportado"
                clearable
                outlined
                required
                v-model="form.valor_1100102"
                v-money="money0"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1100102"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1100102()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1100102.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      pickerMes: false,
      pickerMesfin: false,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogo_1100102: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      selbta: false,
      selvcio: false,
      expanded: [],
      contenido: [],
      data_excel: [],
      conceptosdian_filtro: [],
      conceptosdian: [],
      clientes: [],
      tab: 0,
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id Reportado", align: "left", value: "NroId_rep" },
        { text: "Descripcion", align: "left", value: "reportado_rep" },
        { text: "Valor", align: "center", value: "vrlreportado_rep" },
      ],

      mpios: [
        { text: "Bogotá", value: 11001 },
        { text: "Villavicencio", value: 50001 },
        { text: "Monterrey", value: 85162 },
      ],
      formatosbta: [
        {
          text: "Bogotá -Ingresos por actividades excluidas -Art. 1-",
          value: 1100101,
        },
        { text: "Bogotá -Compra Bienes y Servicios -Art. 2-", value: 1100102 },
        { text: "Bogotá -Venta Bienes  y Servicios -Art. 3-", value: 1100103 },
        { text: "Bogotá -Reteica -Art. 4-", value: 1100104 },
        { text: "Bogotá -Sujetos Reteica -Art. 6-", value: 1100106 },
        {
          text: "Bogotá -Ingresos Recibidos Terceros -Art. 10-",
          value: 1100106,
        },
        { text: "Bogotá -Ingresos Fuera Bogotá -Art. 13-", value: 1100113 },
        {
          text: "Monterrey -Retenciones Practicadas-Res.139 -Art.1",
          value: 8516201,
        },
        {
          text: "Monterrey -Retenciones que le Practicaron-Res.139 -Art.2",
          value: 8516202,
        },
        { text: "Villavicencio -Retenciones Practicadas-", value: 5000101 },
      ],

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        fechafin: false,
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
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 1,
        masked: false,
      },
    };
  },
  created() {
    this.cargarConcDian();
    this.get_Clientes();
  },
  computed: {},
  methods: {
    init_form() {
      this.errores = {
        codigo: false,
      };
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
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
    seleccionar_ciudad() {
      let municipio = this.form.municipio.value;
      this.selbta = true;

      // if (municipio === 11001){
      //   this.selbta = true
      //   this.selvcio = false
      // }else if (municipio === 50001){
      //   this.selbta = false
      //   this.selvcio = true
      // }
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    cargarConcDian: function () {
      post
        .postData({
          url: "financiero/dlls/CfConcDianJ.DLL",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.conceptosdian = [];
          this.conceptosdian = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Barrios",
            estado: true,
          });
        });
    },
    format_conceptos(val) {
      return val.concepto_rep + " - " + val.descripcion_rep.trim();
    },
    filtrar_conceptos() {
      let formato = this.form.format_exogena;
      if (formato) {
        this.form.concepto_exogena = null;
        let filtro = this.conceptosdian.filter(
          (el) => el.formato_rep == formato.value
        );
        this.conceptosdian_filtro = filtro;
        this.consultarExog();
      }
    },
    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    editar_1100102(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1100102.estado = true;
      this.form.eliminar_1100102 = false;
      this.form.peredit_1100102 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.valor_1100102 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1100102 = busqueda_informado;
    },
    editar_5252(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5252.estado = true;
      this.form.eliminar_5252 = false;
      this.form.peredit_5252 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_5252 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_5252 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5252 = busqueda_concepto;
    },
    descargar_prev() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        let municipio = this.form.municipio.value;
        var periodo = this.form.fechafin.replace(/\-/g, "");
        var formato = this.form.format_exogena.value;
        let url = `Financiero/dlls/RpIcaF${formato}j.dll`;
        this.contenido = [];
        post
          .postData({
            url,
            data:
              sessionStorage.Sesion +
              "|" +
              municipio +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              "1" +
              "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.data_excel = data.map((item) => {
              const nuevoItem = { ...item };

              if (item.razonsocial_rep.trim() === "") {
                nuevoItem.reportado_rep = `${item.apellido1_rep || ""} ${
                  item.apellido2_rep || ""
                } ${item.nombre1_rep || ""} ${item.nombre2_rep || ""}`.trim();
              } else {
                nuevoItem.reportado_rep = item.razonsocial_rep.trim();
              }
              return nuevoItem;
            });
            this.contenido = this.data_excel;

            if (formato == "1100101") this.print_1100101_excel();
            else if (formato == "1100102") this.print_1100102_excel();
            else if (formato == "1100103") this.print_1100103_excel();
            else if (formato == "1100104") this.print_1100104_excel();
            else if (formato == "1100106") this.print_1100106_excel();
            else if (formato == "1100113") this.print_1100113_excel();
            else if (formato == "5000101") this.print_rtevcio_excel();
            else if (formato == "8516201") this.print_8516201_excel();
            else if (formato == "8516202") this.print_8516202_excel();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },
    async print_1100101_excel(datos) {
      var data = this.data_excel;

      var data_parse = data.map((el) => {
        el.vrlreportado_rep =
          parseFloat(el.vrlreportado_rep.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "VIGENCIA",
          value: "periodo_rep",
          format: "string",
        },
        {
          title: "CONCEPTO",
          value: "concepto_rep",
          format: "string",
        },
        {
          title: "VALOR",
          value: "vrlreportado_rep",
          format: "string",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "EXOGENA ICA ARTICULO 1", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Articulo_1",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `EXOGENA BOGOTA_ART1-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1100102_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "VIGENCIA",
          value: "vigencia_rep",
        },
        {
          title: "TIPO DOCUMENTO",
          value: "tipodoc_rep",
        },

        {
          title: "NUMERO DOCUMENTO",
          value: "NroId_rep",
        },
        {
          title: "NOMBRE/RAZON SOCIAL",
          value: "reportado_rep",
        },
        {
          title: "DIRECCION",
          value: "direccion_rep",
        },
        {
          title: "TELEFONO",
          value: "telefono_rep",
        },
        {
          title: "EMAIL",
          value: "correo_rut",
        },
        {
          title: "MUNICIPIO",
          value: "municipio_rep",
        },
        {
          title: "DEPARTAMENTO",
          value: "dpto_rep",
        },
        {
          title: "CONCEPTO",
          value: "concepto_rep",
        },
        {
          title: "VALOR COMPRAS",
          value: "vrlexcel_rep",
        },
        {
          title: "VALOR DEVOLUCIONES",
          value: "vrldevoluciones_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Compras -Art. 2-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `EXOGENA BOGOTA_ART2-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async print_1100103_excel(datos) {
      var data = this.data_excel;

      var data_parse = data.map((el) => {
        el.vrlreportado_rep =
          parseFloat(el.vrlreportado_rep.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "VIGENCIA",
          value: "vigencia_rep",
          format: "string",
        },
        {
          title: "COD_CIIU",
          value: "ciiu_rep",
          format: "string",
        },
        {
          title: "TIPO DOCUMENTO",
          value: "tipodoc_rep",
          format: "string",
        },
        {
          title: "NUMERO DOCUMENTO",
          value: "NroId_rep",
          format: "string",
        },
        {
          title: "NOMBRE/RAZON SOCIAL",
          value: "reportado_rep",
          format: "string",
        },
        {
          title: "DIRECCION NOTIFICACION",
          value: "direccion_rep",
          format: "string",
        },
        {
          title: "TELEFONO",
          value: "telefono_rep",
          format: "string",
        },
        {
          title: "EMAIL",
          value: "correo_rut",
          format: "string",
        },
        {
          title: "CODIGO MUNICIPIO",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "CODIGO DEPARTAMENTO",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "CONCEPTO",
          value: "concepto_rep",
          format: "string",
        },

        {
          title: "VALOR INGRESO",
          value: "vrlreportado_rep",
          format: "number",
        },
        {
          title: "VALOR DEVOLUCIONES",
          value: "vrldevoluciones_rep",
          format: "number",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "EXOGENA ICA ARTICULO 3", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Articulo_3",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `EXOGENA BOGOTA_ART3-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async print_1100104_excel(datos) {
      var data = this.data_excel;

      var data_parse = data.map((el) => {
        el.vrlreportado_rep =
          parseFloat(el.vrlreportado_rep.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "VIGENCIA",
          value: "vigencia_rep",
          format: "string",
        },
        {
          title: "TIPO DOCUMENTO",
          value: "tipodoc_rep",
          format: "string",
        },
        {
          title: "NUMERO DOCUMENTO",
          value: "NroId_rep",
          format: "string",
        },
        {
          title: "NOMBRE/RAZON SOCIAL",
          value: "reportado_rep",
          format: "string",
        },
        {
          title: "DIRECCION NOTIFICACION",
          value: "direccion_rep",
          format: "string",
        },
        {
          title: "TELEFONO",
          value: "telefono_rep",
          format: "string",
        },
        {
          title: "EMAIL",
          value: "correo_rut",
          format: "string",
        },
        {
          title: "CODIGO MUNICIPIO",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "CODIGO DEPARTAMENTO",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "BASE RETENCION",
          value: "vrlbase_rep",
          format: "number",
        },
        {
          title: "TARIFA APLICADA",
          value: "porcentaje_rep",
          format: "number",
        },
        {
          title: "VALOR RETENCION",
          value: "vrlexcel_rep",
          format: "number",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "EXOGENA ICA ARTICULO 4", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Articulo_4",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `EXOGENA BOGOTA_ART4-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async print_1100106_excel(datos) {
      var data = this.data_excel;

      var data_parse = data.map((el) => {
        el.vrlreportado_rep =
          parseFloat(el.vrlreportado_rep.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "VIGENCIA",
          value: "vigencia_rep",
          format: "string",
        },
        {
          title: "TIPO DOCUMENTO",
          value: "tipodoc_rep",
          format: "string",
        },
        {
          title: "NUMERO DOCUMENTO",
          value: "NroId_rep",
          format: "string",
        },
        {
          title: "NOMBRE/RAZON SOCIAL",
          value: "reportado_rep",
          format: "string",
        },
        {
          title: "DIRECCION NOTIFICACION",
          value: "direccion_rep",
          format: "string",
        },
        {
          title: "TELEFONO",
          value: "telefono_rep",
          format: "string",
        },
        {
          title: "EMAIL",
          value: "correo_rut",
          format: "string",
        },
        {
          title: "CODIGO MUNICIPIO",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "CODIGO DEPARTAMENTO",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "MONTO PAGO",
          value: "vrlbase_rep",
          format: "number",
        },
        {
          title: "TARIFA APLICADA",
          value: "porcentaje_rep",
          format: "number",
        },
        {
          title: "VALOR RETENCION",
          value: "vrlexcel_rep",
          format: "number",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "EXOGENA ICA ARTICULO 6", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Articulo_6",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `EXOGENA BOGOTA_ART6-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async print_1100113_excel(datos) {
      var data = this.data_excel;

      var data_parse = data.map((el) => {
        el.vrlreportado_rep =
          parseFloat(el.vrlreportado_rep.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "VIGENCIA",
          value: "vigencia_rep",
          format: "string",
        },
        {
          title: "VALOR TOTAL POR MUNICIPIO",
          value: "vrlexcel_rep",
          format: "number",
        },
        {
          title: "CODIGO MUNICIPIO",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "CODIGO DEPARTAMENTO",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "ACTIVIDAD ECONOMICA",
          value: "nada_rep",
          format: "string",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "EXOGENA ICA ARTICULO 13", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Articulo_13",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `EXOGENA BOGOTA_ART13-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultarExog() {
      this.contenido = [];
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        let municipio = this.form.municipio.value;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let url = `Financiero/dlls/RpIcaF${formato}j.dll`;
        post
          .postData({
            url,
            data:
              sessionStorage.Sesion +
              "|" +
              municipio +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              "1" +
              "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;

            this.contenido = data.map((item) => {
              const nuevoItem = { ...item };
              if (item.razonsocial_rep.trim() === "") {
                nuevoItem.reportado_rep = `${item.apellido1_rep || ""} ${
                  item.apellido2_rep || ""
                } ${item.nombre1_rep || ""} ${item.nombre2_rep || ""}`.trim();
              } else {
                nuevoItem.reportado_rep = item.razonsocial_rep.trim();
              }
              return nuevoItem;
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },
    guardar_1100102() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1100102.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1100102.identificacion_rut;
        let valor_1100102 = this.form.valor_1100102.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1100102 ? "1" : "0";
        this.form.eliminar_1100102 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogIcaM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              eliminar +
              "|" +
              valor_1100102 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarExog();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },

    generarExogena() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var periodo = this.form.fechafin.replace(/\-/g, "");
        var formato = this.form.format_exogena.value;
        var municipio = this.form.municipio.value;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogIca.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              municipio +
              "|" +
              periodo +
              "|" +
              formato +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Proceso Terminado",
              estado: true,
            });
            this.consultarExog();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al generar Formato",
              estado: true,
            });
          });
      }
    },
    print_rtevcio_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        el.porc_rep = parseFloat(el.porc_rep) / 1000;
        return el;
      });
      var columnas = [
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "D.v.",
          value: "dv_rep",
        },

        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Telefono",
          value: "telefono_rep",
        },
        {
          title: "Correo",
          value: "correo_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Base Retención",
          value: "baseexcel_rep",
        },
        {
          title: "Retención en la fuente Practicada",
          value: "vrlexcel_rep",
        },
        {
          title: "Codigo Actividad",
          value: "codacti_rep",
        },

        {
          title: "Tarifa Aplicada",
          value: "porc_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato Retenciones Practicadas Exogena ICA -Villavicencio-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_8516201_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        el.porc_rep = parseFloat(el.porc_rep) / 1000;
        return el;
      });
      var columnas = [
        {
          title: "VIGENCIA ",
          value: "vigencia_rep",
        },
        {
          title: "Tipo Identificación",
          value: "tipoid_rep",
        },
        {
          title: "Numero de Identificación",
          value: "NroId_rep",
        },
        {
          title: "Dv",
          value: "dv_rep",
        },
        {
          title: "APELLIDOS Y NOMBRES Y/O RAZON SOCIAL",
          value: "reportado_rep",
        },
        {
          title: "DIRECCION",
          value: "direccion_rep",
        },
        {
          title: "CIUDAD",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "DEPARTAMENTO",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "CODIGO CIIU DEL CONCEPTO DEL PAGO O ABONO EN CUENTA",
          value: "codacti_rep",
        },

        {
          title: "DIRECCION ELECTRONICA ",
          value: "correo_rep",
        },

        {
          title: "TELEFONO",
          value: "telefono_rep",
        },
        {
          title: "TARIFA ",
          value: "tarifa_rep",
        },

        {
          title: "VALOR SOMETIDO A RETENCION ",
          value: "baseexcel_rep",
        },

        {
          title: "VALOR RETENIDO DE INDUSTRIA Y COMERCIO ",
          value: "vrlicareportado_rep",
        },
        {
          title: "VALOR RETENIDO AVISOS Y TABLEROS",
          value: "vrlavisosreportado_rep",
        },
        {
          title: "VALOR RETENIDO SOBRETASA BOMBERIL",
          value: "vrlbomreportado_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato Agentes Retenedores Exogena ICA -Monterrey Casanare- Art.1",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Exoica${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_8516202_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        el.porc_rep = parseFloat(el.porc_rep) / 1000;
        return el;
      });
      var columnas = [
        {
          title: "VIGENCIA ",
          value: "vigencia_rep",
        },
        {
          title: "Tipo Identificación",
          value: "tipoid_rep",
        },
        {
          title: "Numero de Identificación",
          value: "NroId_rep",
        },
        {
          title: "Dv",
          value: "dv_rep",
        },
        {
          title: "APELLIDOS Y NOMBRES Y/O RAZON SOCIAL",
          value: "reportado_rep",
        },
        {
          title: "DIRECCION",
          value: "direccion_rep",
        },
        {
          title: "CIUDAD",
          value: "municipio_rep",
          format: "string",
        },
        {
          title: "DEPARTAMENTO",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "CODIGO CIIU DEL CONCEPTO DEL PAGO O ABONO EN CUENTA",
          value: "codacti_rep",
        },

        {
          title: "DIRECCION ELECTRONICA ",
          value: "correo_rep",
        },

        {
          title: "TELEFONO",
          value: "telefono_rep",
        },
        {
          title: "TARIFA ",
          value: "tarifa_rep",
        },

        {
          title: "VALOR PAGO SUJETO A RETENCION ",
          value: "baseexcel_rep",
        },

        {
          title: "VALOR RETENIDO DE INDUSTRIA Y COMERCIO ",
          value: "vrlicareportado_rep",
        },
        {
          title: "VALOR RETENIDO AVISOS Y TABLEROS",
          value: "vrlavisosreportado_rep",
        },
        {
          title: "VALOR RETENIDO SOBRETASA BOMBERIL",
          value: "vrlbomreportado_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato Sujetos de Retención Exogena ICA -Monterrey Casanare- Art.2",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Exoica${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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