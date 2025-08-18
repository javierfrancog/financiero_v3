<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-check-underline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Validación Solicitudes Colaboradores</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
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
                  label="Periodo de Solicitud"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @change="cargarcontenido()"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="justify-end">
          <v-btn
            color="success"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="generar_excel"
          >
            Generar EXCEL
            <v-icon right>mdi-file-excel-box</v-icon>
          </v-btn>
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
              item-key="idnomina_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="orange--text">Base</th> -->
                          <th class="orange--text text-left">Descripción</th>
                          <th class="orange--text text-left">Cantidad</th>
                          <th class="orange--text text-rigth">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="el in item.basesnomina_rep"
                          :key="el.codigo_rep"
                        >
                          <!-- <td>{{ el.codigo_rep }}</td> -->
                          <td class="text-left">{{ el.descripcion_rep }}</td>
                          <td class="text-left">{{ el.cantidad_rep }}</td>
                          <td class="text-center">{{ el.valor_rep }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

              <template v-slot:item.estadobase_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>

              <template v-slot:item.soporte="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_soporte(item)"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Soporte</span>
                </v-tooltip>
              </template>
              <template v-slot:item.validar="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="open_valida(item)"
                      color="purple"
                      :disabled="item.estado_rep == 2 ? true : false || item.estado_rep == 1 ? true : false" 
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-checkbox-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Validar</span>
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
    <v-dialog v-model="dialogovalida.estado" max-width="900px">
      <template>
        <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
          <v-card-title>
            <span class="title col-12"
              >Validación de Solicitud: {{ dialogovalida.titulo }}</span
            >
          </v-card-title>
          <v-card-text>
            <v-row class="d-flex mb-4" no-gutters>
              <v-col class="mt-3 d-flex" cols="6">
                <v-text-field
                  label="Solicitud"
                  disabled
                  v-model="form.Novedad"
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4" no-gutters>
              <v-col class="mt-3 d-flex" cols="3">
                <v-text-field
                  label="Fecha Inicial"
                  disabled
                  v-model="form.iniNovedad"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="mt-3 d-flex" cols="3">
                <v-text-field
                  label="Hora Inicial"
                  disabled
                  v-model="form.horainiNovedad"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="mt-3 d-flex" cols="3">
                <v-text-field
                  label="Fecha Final"
                  disabled
                  v-model="form.finNovedad"
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="mt-3 d-flex" cols="3">
                <v-text-field
                  disabled
                  label="Hora Final"
                  v-model="form.horafinNovedad"
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4" no-gutters>
              <v-col class="mt-3 d-flex" cols="12">
                <v-text-field
                  label="Detalle"
                  disabled
                  v-model="form.detalle"
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-8 d-flex" color="#FF6F00"></v-divider>

            <v-row class="d-flex mb-4" justify="center">
              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Aprobado', value: 2 },
                    { text: 'Rechazado', value: 3 },
                  ]"
                  label="Estado"
                  clearable
                  hide-details
                  return-object
                  v-model="form.tiponovedad"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.tiponovedad"
                  @change="errores.tiponovedad = false"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4" no-gutters>
              <v-col class="mt-3 d-flex" cols="12">
                <v-text-field
                  label="Observaciones"
                  outlined
                  v-model="form.observacion"
                  hide-details
                  :error="errores.observacion"
                  @input="errores.observacion = false"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-8 d-flex" color="#FF6F00"></v-divider>

            <v-row justify="center" class="mt-2 d-flex">
              <v-col class="d-flex">
                <v-btn
                  color="purple"
                  class="white--text px-12"
                  depressed
                  large
                  @click="get_soporte(item_sel)"
                >
                  Ver Soportes
                </v-btn>
              </v-col>

              <v-col class="d-flex">
                <v-btn
                  color="indigo"
                  class="white--text px-12"
                  depressed
                  :disabled="habilita_validar == true"
                  large
                  @click="grabar_novedad()"
                >
                  Grabar
                </v-btn>
              </v-col>

              <v-col class="d-flex">
                <v-btn
                  color="red accent-4"
                  class="white--text px-12"
                  depressed
                  large
                  @click="dialogovalida.estado = false"
                >
                  Cancelar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
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
      dialogPickerPrest: false,
      pickerInicial: false,
      pickerFinal: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      habilita_validar: true,
      expanded: [],
      agencias: [],
      contenido: [],
      colaborador: [],
      basesnomina: [],
      item_sel: null,
      tipo_selecc: 0,
      dialogovalida: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_novedad: {
        estado: false,
        titulo: null,
        tipo: 0,
        loader: false,
      },
      dialogo_prestamo: {
        estado: false,
        titulo: null,
        tipo: 0,
        loader: false,
      },

      search: "",
      form: {
        consecutivo: null,
        fecha: null,
      },
      headers: [
        { text: "Validar", value: "validar", align: "center", width: "50px" },
        {
          text: "Ver Soporte",
          value: "soporte",
          align: "center",
          width: "50px",
        },
        {
          text: "Fecha Solicitud",
          align: "center",
          value: "fechasol_rep",
          width: "110px",
        },
        { text: "Hora Solicitud", align: "left", value: "horasolic_rep" },

        // {
        //   text: "Consecutivo",
        //   align: "center",
        //   value: "consec_rep",
        //   width: "50px",
        // },
        { text: "Colaborador", align: "left", value: "nombrecolabora_rep" },
        { text: "Cargo", align: "left", value: "cargo_rep" },
        { text: "Novedad", align: "left", value: "descripcion1_rep" },
        { text: "Tipo", align: "left", value: "tiposol_rep" },

        { text: "Estado", align: "left", value: "descnovedad_rep" },
        {
          text: "Inicio Novedad",
          align: "left",
          value: "fechainicio_rep",
          width: "110px",
        },
        { text: "Hora Inicio", align: "left", value: "horaini_rep" },

        {
          text: "Fin Novedad",
          align: "left",
          value: "fechafin_rep",
          width: "110px",
        },
        { text: "Hora Final", align: "left", value: "horafin_rep" },

        {
          text: "Observación Validación",
          align: "left",
          value: "Observacionvalida",
        },
        {
          text: "Lider",
          align: "left",
          value: "nombrevalida_rep",
        },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        colabora: false,
        novedad: false,
        fechaini: false,
        fechafin: false,
        fechainidesc: false,
        dias: false,
        valorprest: false,
        tiponovedad: false,
        observacion: false,
      },

      card_estado: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    this.cargar_empresa();
  },
  methods: {
    open_valida(item) {
      this.item_sel = item;
      this.dialogovalida.estado = true;
      this.dialogovalida.titulo = item.nombrecolabora_rep.trim();
      this.form.Novedad = item.nombrebase_rep.trim();
      this.form.iniNovedad = item.fechainicio_rep;
      this.form.horainiNovedad = item.horaini_rep;
      this.form.finNovedad = item.fechafin_rep;
      this.form.horafinNovedad = item.horafin_rep;
      this.form.detalle = item.detalle_rep;

      this.form.tiponovedad = null;
      this.form.observacion = null;
      this.habilita_validar = true;
    },
    generar_excel() {
      var data_parse = this.contenido;
      // let data = this.contenido;

      // data.forEach((el) => {
      //   let copia = JSON.parse(JSON.stringify(el));
      //   copia.fechainicio_rep = copia.fechainicio_rep.replace(/\-/g, "");
      //   data_parse.push(copia);
      // });

      var periodo = this.form.fecha;
      var columnas = [
        {
          title: "Fecha Solicitud",
          value: "fechasol_rep",
          format: "string",
        },
        {
          title: "Colaborador",
          value: "nombrecolabora_rep",
          format: "string",
        },
        {
          title: "Cargo",
          value: "cargo_rep",
          format: "string",
        },
        {
          title: "Novedad",
          value: "tiposol_rep",
          format: "string",
        },
        {
          title: "Descripción",
          value: "nombrebase_rep",
          format: "string",
        },
        {
          title: "Fecha Inicio",
          value: "fechainicio_rep",
          format: "string",
        },
        {
          title: "Hora Inicio",
          value: "horaini_rep",
          format: "string",
        },
        {
          title: "Fin Novedad",
          value: "fechafin_rep",
          format: "string",
        },
        {
          title: "Hora Final",
          value: "horafin_rep",
          format: "string",
        },
        {
          title: "Estado",
          value: "descnovedad_rep",
          format: "string",
        },

        {
          title: "Observaciones",
          value: "Observacionvalida",
          format: "string",
        },
        {
          title: "Lider Validador",
          value: "nombrevalida_rep",
          format: "string",
        },

      ];

      var header = [
        {
          text: this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        `NIT. ${parseInt(this.empresa.id_empr)}`,
        "REPORTE SOLICITUDES AUTOGESTION TALENTO HUMANO",
        periodo,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Solicitud autogestión",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE SOLICITUDES AUTOGESTION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
    grabar_novedad() {
      if (!this.form.tiponovedad) {
        this.errores.tiponovedad = true;
        this.send_error("Seleccione un Estado !");
      } else {
        let tipo = this.form.tiponovedad.value;
        if (tipo == 3 && !this.form.observacion) {
          this.errores.observacion = true;
          this.send_error("Debe indicar una observación !");
        } else {
          let consec = this.item_sel.consec_rep.trim();
          let observacion = this.form.observacion
            ? this.form.observacion.trim().replace(/\*/g, "") || 0
            : "";
          post
            .postData({
              url: "Financiero/dlls/PrGthValSol.DLL",
              data:
                sessionStorage.Sesion +
                "|" +
                consec +
                "|" +
                tipo +
                "|" +
                observacion +
                "|",
              method: "",
            })
            .then((data) => {
              this.loader = false;
              this.dialogovalida.estado = false;
              this.cargarcontenido();
              this.$emit("snack", {
                color: "green",
                text: "Validación Registrada",
                estado: true,
              });
            })
            .catch((err) => {
              this.loader = false;
            });
        }
      }
    },
    get_soporte(item) {
      this.habilita_validar = false;
      let empresa = parseFloat(this.empresa.id_empr);
      let consecutivo = parseFloat(item.consec_rep);
      let tipodoc = 5;

      let nombre_pdf = empresa + "_SOLIC_" + consecutivo + "_" + tipodoc + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/GTH/" + nombre_pdf;
      window.open(url, "_blank").focus();
    },
    cargarcolaborador() {
      this.loader = true;
      let ano = this.form.fecha.substring(0, 4);
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|" + ano + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },
    format_colabora(val) {
      return `${
        parseInt(val.idcolabora_rep) || 0
      } - ${val.Apellido1colabora_rep.trim()} 
         ${val.nombrescolabora_rep.trim()}`;
    },
    cargarcontenido() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthSolicitudJ.DLL",
          data: sessionStorage.Sesion + "|" + periodo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Novedades",
            estado: true,
          });
        });
    },
    init_form() {
      this.form.novedad = null;
      this.form.consecutivo = null;
      this.form.soporte = null;
      this.form.fechaini = null;
      this.form.fechafin = null;
      this.form.dias = null;
      this.form.detalle = null;

      this.errores = {
        codigo: false,
      };
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