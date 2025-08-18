<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-pill-multiple</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Productos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar
                  <v-icon right dark class="ml-4">mdi-cart-plus</v-icon>
                </v-btn>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
              <!-- <v-btn
              class="ma-2 white--text"
              color="orange"
              depressed
              large
              @click="cargarMoleculas(), cargarNombrecom()"
              >Actualiza Agrpmolecula</v-btn
            > -->
            </v-row>
          </v-list-item>
        </v-card-title>
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
              item-key="index"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:item.estado_rep="{ item }">
                {{ item.estado_rep === "1" ? "Inactivo" : "Activo" }}
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>

              <template v-slot:item.elimina="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
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

    <v-dialog v-model="dialogo_medicamento.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <v-toolbar color="indigo darken-2" dark>
            <v-row class="px-6 mt-0 justify-center">
              <span class="subtitle-1">Creación de Medicamentos</span>
            </v-row>
          </v-toolbar>
        </v-card-title>
        <v-row>
          <v-col class="d-flex" cols="4">
            <v-text-field
              clearable
              v-model="form.consecutivo"
              disabled
              hide-details
              ><template v-slot:label>
                <span style="color: #0033b3 !important">Consecutivo</span>
              </template></v-text-field
            >
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex" cols="4">
            <v-text-field clearable required v-model="form.cum" hide-details
              ><template v-slot:label>
                <span style="color: #0033b3 !important">C.U.M</span>
              </template></v-text-field
            >
          </v-col>
          <v-col class="d-flex" cols="8">
            <v-text-field
              required
              v-model="form.descripcion"
              :error="errores.descripcion"
              @input="errores.descripcion = false"
              hide-details
              ><template v-slot:label>
                <span style="color: #0033b3 !important">Descripción</span>
              </template></v-text-field
            >
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-col class="d-flex" cols="4">
            <v-switch
              v-model="form.bloqueo"
              hide-details
              label="Bloquear"
            ></v-switch>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-btn
              color="green"
              class="ma-2 white--text"
              @click="guardar_medicamento()"
              >Guardar</v-btn
            >
            <v-btn
              color="red darken-1"
              class="ma-2 white--text"
              @click="cerrar_creamedica()"
              >Cerrar</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogo_confirma.estado"
      persistent
      width="600"
      height="200"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"></v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          <v-row justify="center">
            <v-col class="d-flex justify-center" cols="12">
              <span class="title col-12">{{ dialogo_confirma.titulo }}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-row justify="center">
          <v-col class="d-flex justify-center" cols="6">
            <v-card-text class="text-h6"> Eliminar Medicamento?</v-card-text>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row justify="center">
            <v-col class="d-flex justify-center" cols="2">
              <v-btn
                color="red"
                variant="text"
                @click="dialogo_confirma.estado = false"
                class="white--text"
              >
                Cancelar
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center" cols="8">
              <v-btn
                color="green"
                variant="text"
                @click="get_eliminar()"
                class="white--text"
              >
                Aceptar
              </v-btn>
            </v-col>
          </v-row>
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
      dialogo_confirma: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      genero: [
        { text: "Femenino", value: 1 },
        { text: "Masculino", value: 2 },
        { text: "Todos", value: 9 },
      ],
      styleObject: { border: "2px solid #01579B" },
      dialog: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      grpfarma: [],
      grpfarma_items: [],
      concentrac: [],
      ffarmac: [],
      moleculas: [],
      presentaciones: [],
      laboratorios: [],
      nombrecom: [],
      datosctas: [],
      datosEmpresa: [],
      item_select: [],
      empaque: [
        { text: "Unidad", value: 1 },
        { text: "Caja", value: 2 },
        { text: "Blister", value: 13 },
      ],

      tab: 0,
      search: null,
      respuesta: 0,
      form: {
        consecutivo: 0,
        molecula: null,
        descripcion: null,
        basevta: 0,
        cantempaque: null,
      },
      dialogo_medicamento: {
        estado: false,
        titulo: null,
      },
      headers: [
        { text: "Opciones", value: "edit", align: "center" },
        // { text: "Codigo", align: "left", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Cum", align: "center", value: "cum_rep" },
        {
          text: "Laboratorio",
          align: "center",
          value: "descriplaboratorio_rep",
        },
        { text: "Barras", align: "center", value: "barras_rep" },

        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Eliminar", value: "elimina", align: "center" },
      ],
      errores: {
        molecula: false,
        cum: false,
        presentaciones: false,
        nombrecom: false,
        descripcion: false,

        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    anular_item(item) {
      this.item_select = item;
      this.dialogo_confirma.estado = true;
      this.dialogo_confirma.titulo = item.descripcion_rep.trim();
    },
    get_eliminar() {
      let codigo = this.item_select.cod_rep.trim();
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfMedicamentoX.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let msg = data[0];
          this.$emit("snack", {
            color: "success",
            text: msg,
            estado: true,
          });
          this.dialogo.estado = false;
          this.dialogo_confirma.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.dialogo.estado = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al Eliminar AgrpMoleculas",
            estado: true,
          });
          this.loader = false;
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      this.form.eliminar = false;
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfMedicamentosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    editar_item(item) {
      this.dialogo_medicamento.estado = true;
      this.dialogo_medicamento.titulo = "Modificar Registro";
      this.form.consecutivo = item.molecula_rep.trim();
      this.form.descripcion = item.descripcion_rep.trim();
      this.form.cum = item.cum_rep.trim() || 0;
    },
    async agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo_medicamento.titulo = "Agregar nuevo Medicamento";
      this.dialogo.tipo = 0;
      await this.get_consecutivo();
      this.dialogo_medicamento.estado = true;
    },
    cerrar_creamedica() {
      this.dialogo_medicamento.estado = false;
    },
    crear_medicamento() {
      this.dialogo_medicamento.estado = true;
    },
    guardar_medicamento() {
      let cum = this.form.cum.trim();
      let consecutivo = this.form.consecutivo;
      let descripcion = this.form.descripcion.trim();
      var bloqueo = this.form.bloqueo ? 1 : "0";

      this.dialogo_medicamento.estado = false;

      post
        .postData({
          url: "Clinico/dlls/CfMedicamento.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            consecutivo +
            "|" +
            cum +
            "|" +
            descripcion +
            "|" +
            bloqueo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.cargarcontenido();
        })
        .catch((err) => {
          this.load.consecutivo = false;
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al grabar Medicamento" + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    async get_consecutivo() {
      await post
        .postData({
          url: "Clinico/dlls/CfMedicamentoN.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.consecutivo = parseFloat(data[0].nro);
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
    init_form() {
      this.form.molecula = "";
      this.form.descripcion = "";
      this.form.barras = "";
      this.form.grpfarma = "";
      this.form.concentrac = "";
      this.form.ffarmac = "";
      this.form.presentaciones = "";
      this.form.nombrecom = "";
      this.form.laboratorios = "";
      this.form.cum = "";
      this.form.invima = "";
      this.form.basevta = "0";
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_moleculas(val) {
      return `${val.descripcion_rep}`;
    },
    format_presentaciones(val) {
      return `${val.descrip_rep}`;
    },
    format_nombrecom(val) {
      return `${val.descrip_rep}`;
    },
    format_laboratorios(val) {
      return `${val.descrip_rep}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    asignar_nombre(tipo) {
      let descripcion = " ";
      if (tipo == 1 && this.form.molecula) {
        const molecula = this.form.molecula;
        descripcion = molecula.descripcion_rep.trim();
      }
      if (tipo == 2 && this.form.presentaciones) {
        descripcion =
          this.form.molecula.descripcion_rep.trim() +
          " " +
          this.form.presentaciones.descrip_rep.trim();
      }
      if (tipo == 3 && this.form.nombrecom) {
        descripcion =
          this.form.molecula.descripcion_rep.trim() +
          " " +
          this.form.presentaciones.descrip_rep.trim() +
          " " +
          this.form.nombrecom.descrip_rep.trim();
      }
      this.form.descripcion = descripcion;
    },
    choseColor() {
      return this.counter % 2 !== 0 ? `blue` : "white";
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        if (copia.tpmedicam_rep == 1) {
          copia.tpmedicam_rep = "S";
        } else {
          copia.tpmedicam_rep = "N";
        }
        if (copia.disposit_rep == 1) {
          copia.disposit_rep = "S";
        } else {
          copia.disposit_rep = "N";
        }
        if (copia.regulado_rep == 1) {
          copia.regulado_rep = "S";
        } else {
          copia.regulado_rep = "N";
        }
        if (copia.controlado_rep == 1) {
          copia.controlado_rep = "S";
        } else {
          copia.controlado_rep = "N";
        }
        if (copia.frio_rep == 1) {
          copia.frio_rep = "S";
        } else {
          copia.frio_rep = "N";
        }
        if (copia.liquido_rep == 1) {
          copia.liquido_rep = "S";
        } else {
          copia.liquido_rep = "N";
        }
        if (copia.pyp_rep == 1) {
          copia.pyp_rep = "S";
        } else {
          copia.pyp_rep = "N";
        }
        if (copia.altocto_rep == 1) {
          copia.altocto_rep = "S";
        } else {
          copia.altocto_rep = "N";
        }
        if (copia.genero_rep == 1) {
          copia.genero_rep = "F";
        } else {
          copia.genero_rep = "M";
        }

        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Codigo",
          value: "cod_rep",
          format: "string",
        },
        {
          title: "Nombre",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Presentacion Comercial",
          value: "descripresentacion_rep",
          format: "string",
        },

        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Barras",
          value: "barras_rep",
          format: "string",
        },
        {
          title: "Invima",
          value: "invima_rep",
          format: "string",
        },
        {
          title: "Laboratorio",
          value: "descriplaboratorio_rep",
          format: "string",
        },
        {
          title: "nombre Comercial",
          value: "descripcomercial_rep",
          format: "string",
        },
        {
          title: "Medicamento",
          value: "tpmedicam_rep",
          format: "string",
        },
        {
          title: "Dispositivo Medico",
          value: "disposit_rep",
          format: "string",
        },
        {
          title: "Producto Regulado",
          value: "regulado_rep",
          format: "string",
        },
        {
          title: "Producto controlado",
          value: "controlado_rep",
          format: "string",
        },
        {
          title: "Cadena Frio",
          value: "frio_rep",
          format: "string",
        },
        {
          title: "Producto Liquido",
          value: "liquido_rep",
          format: "string",
        },

        {
          title: "P Y P",
          value: "pyp_rep",
          format: "string",
        },
        {
          title: "Alto Costo",
          value: "altocto_rep",
          format: "string",
        },
        {
          title: "Genero",
          value: "genero_rep",
          format: "string",
        },
      ];
      var header_format = [
        { text: "REPORTE MEDICAMENTOS", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Medicamentos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE MEDICAMENTOS-${new Date().getTime()}`,
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
