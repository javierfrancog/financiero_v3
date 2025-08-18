<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-door-closed-lock</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cierre Turno Cajero</v-list-item-title
              >
            </v-list-item-content>
            <!-- <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row> -->
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaInicial"
                      label="Fecha Cierre"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechacierre"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-btn
                color="indigo"
                class="ma-5 white--text px-12"
                large
                depressed
                @click="consultar()"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
              <v-btn
                color="success"
                class="ma-5 white--text px-12 d-flex justify-end"
                large
                depressed
                @click="cargaranexos"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Descargar Anexo
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
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
                  <span>Editar Cierre</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Cierre</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Cierre de Caja</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-text-field
                label="Operador"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.operador"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Fecha"
                clearable
                outlined
                disabled
                required
                v-model="form.fecha"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="12">
              <v-text-field
                label="Punto de Recaudo"
                v-model="form.punto"
                hide-details
                outlined
                disabled
                return-object
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="8" sm="4">
              <v-text-field
                label="Efectivo Entregado"
                clearable
                outlined
                :error="errores.efectivo"
                hide-details
                :value="formatNumero(form.efectivo)"
                @input="input_mask('efectivo', calcular_total)"
                tabindex="1"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="4">
              <v-text-field
                label="Base"
                clearable
                outlined
                required
                hide-details
                :value="formatNumero(form.base)"
                @input="input_mask('base', calcular_total)"
                tabindex="2"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="4">
              <v-text-field
                label="Total Recaudos"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.netorec"
                hide-details
              ></v-text-field>
            </v-col>
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
            @click="guardar()"
            >Cerrar Caja</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
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
import { rec_cierrecajero } from "../../_formatos.pdf.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
      },
      money1: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      anexos: [],

      agencia_recaudo: null,
      pickeFechaIni: false,
      perfil: "0",
      search: "",
      puntos: "",
      ptosrecaudo: [],
      form: {
        efectivo: null,
        base: null,
      },
      headers: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Punto Recaudo", align: "left", value: "punto_rep" },
        { text: "Efectivo", align: "center", value: "efectivo_rep" },
        { text: "Base", align: "center", value: "base_rep" },
        { text: "Total Recaudo", align: "center", value: "trecaudo_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
      efectivo: null,
    };
  },
  created() {
    this.get_empresa();
    this.form.fechaInicial = this.$moment().format("YYYY-MM-DD");

    this.cargaragencias();
    this.dialogo.estado = false;
  },
  computed: {},
  methods: {
    input_mask(obj_name, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      this.$set(this.form, obj_name, val_edit);
      if (callback) callback();
    },
    calcular_total() {
      let efectivo_format = this.form.efectivo || "0";
      let base_format = this.form.base || "0";
      let efectivo = parseFloat(efectivo_format.replace(/\,/g, "")) || 0;
      let base = parseFloat(base_format.replace(/\,/g, "")) || 0;

      let total = efectivo - base;
      this.form.netorec = this.formatNumero(total);
    },
    cargaragencias: function () {
      post
        .postData({
          url: "Recaudos/dlls/CfAgenciasJ.dll",
          data: 0 + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    print_item(item) {
      var fecha = item.fecha_rep.replace(/\-/g, "");
      var cajero = item.cajero_rep;
      var agencia = item.codpunto_rep;
      post
        .postData({
          url: "Servdm/dlls/PrCierre02J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            cajero +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          let data_impresion = data[0];
          let empresa = this.datosEmpresa;

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;

            rec_cierrecajero(data_impresion).then((el) => {
              this.card.loader = false;
              this.card.disabled = false;
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },

    consultar: function () {
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      let punto = this.agencia_recaudo;
      post
        .postData({
          url: "Recaudos/dlls/PrCierre01J.dll",
          data:
            sessionStorage.Sesion + "|" + fecha + "|" + "0" + "|" + punto + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          this.send_error(err.Mensaje[0].msg);
        });
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";

      this.form.operador = sessionStorage.User;
      this.form.fecha = this.form.fechaInicial;
      let punto_recaudo = this.agencia_recaudo;
      this.form.punto = data.codpunto_rep + "_" + data.punto_rep;
      this.form.efectivo = item.efectivo_rep.trim();
      this.form.base = item.base_rep.trim();
      this.calcular_total();
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fechaInicial) {
        this.errores.fechacierre = true;
        this.send_error("Fecha Cierre Obligatoria!");
        // } else if (!data.efecivo) {
        //   this.errores.efectivo = true;
        //   this.send_error("Efectivo Obligatorio!");
        // }
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      var punto = this.form.punto.substr(0, 4);
      var efectivo = this.form.efectivo.replace(/\,/g, "");
      var base = this.form.base.replace(/\,/g, "");
      let datos = {
        url: "Servdm/dlls/PrCierre.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          punto +
          "|" +
          efectivo +
          "|" +
          base +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.consultar();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.operador = sessionStorage.User;
      this.form.fecha = this.form.fechaInicial;
      this.form.punto = this.agencia_recaudo;

      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form.efectivo = 0;
      this.form.base = 0;

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Recaudos/dlls/CfConveniorcJ.dll",
          data: sessionStorage.Sesion + "|",
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
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },
    get_empresa() {
      return new Promise((resolve) => {
        post
          .postData({
            url: "Financiero/dlls/CfEmpresaJ.dll",
            data: sessionStorage.Sesion + "|",
            method: "",
          })
          .then((data) => {
            this.datosEmpresa = data[0];
            this.agencia_recaudo = this.datosEmpresa.agencia_empr;
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar empresa",
              estado: true,
            });
          });
      });
    },

    cargaranexos() {
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      let punto = this.agencia_recaudo;
      post
        .postData({
          url: "Servdm/dlls/PrCierre03J.dll",
          data:
            sessionStorage.Sesion + "|" + fecha + "|" + "0" + "|" + punto + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.anexos = data;
          this.print_reporte_excel();
        })
        .catch((err) => {
          this.send_error(err.Mensaje[0].msg);
        });
    },
    print_reporte_excel() {
      var data = this.anexos;
      var data_parse = data.map((el) => {
        el.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        return el;
      });
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Punto Recaudo",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Codigo",
          value: "codusuario_rep",
          format: "number",
        },
        {
          title: "Factura",
          value: "factura_rep",
          format: "number",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cajero",
          value: "cajero_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
   
      var header_format = [
        { text: "ANEXO CIERRE DE CAJA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo cierre caja",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `ANEXO CIERRE DE CAJA-${new Date().getTime()}`,
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
