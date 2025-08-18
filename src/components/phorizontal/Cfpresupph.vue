<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-numeric</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Codigos Presupuestales</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn
                  depressed
                  color="green darken-2"
                  class="white--text"
                  @click="imprimir_excel"
                >
                  Imprimir EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details2
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-col cols="6" class="d-flex justify-center">
            <span class="title col-12">{{ dialogo.titulo }}</span>
          </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-btn
              class="ma-2 white--text"
              color="red"
              depressed
              large
              text
              @click="
                dialogo.estado = false;
                init_form();
              "
              >Cancelar</v-btn
            >
            <v-btn
              class="ma-2 px-4 white--text"
              color="indigo"
              depressed
              large
              @click="guardar()"
              >Guardar</v-btn
            >
          </v-col>
        </v-card-title>
        <v-divider color="succes"></v-divider>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-2 ml-1">
                  <v-col class="d-flex" cols="8" sm="3">
                    <v-select
                      :items="[
                        { text: 'Auxiliar', value: 4 },
                        { text: 'Capitulo', value: 2 },
                        { text: 'Titulo', value: 1 },
                      ]"
                      label="Nivel"
                      v-model="form.tipocod"
                      outlined
                      required
                      hide-details
                      :error="errores.tipocod"
                      @change="
                        errores.tipocod = false;
                      "
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Codigo"
                      clearable
                      outlined
                      type="text"
                      required
                      counter="10"
                      max
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-2 ml-1 mb-1">
                  <v-col class="d-flex" cols="6F" sm="6">
                    <v-text-field
                      label="Descripción"
                      clearable
                      outlined
                      required
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      auxiliar: 0,
      tab: 0,

      search: "",
      form: {},
      headers: [
        { text: "Editar", value: "edit", align: "center" },
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Nivel", align: "center", value: "nivel_rep" },
      ],
      errores: {
        tipocod:false,  
        codigo: false,
        estado: false,
        descripcion: false,
      },
      card_estado: false,
      show_select: true,
    };
  },
  created() {
    var $this = this;
    this.cargarcontenido();
  },
  methods: {
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];

      data_parse = [...data];

      let columnas = [
        {
          title: "Codigo",
          value: "cod_puc",
        },
        {
          title: "Descripción",
          value: "descrip_puc",
          format: "string",
        },
        {
          title: "Tipo",
          value: "tipo_puc",
        },
        {
          title: "Cod. Niif",
          value: "codniif_puc",
        },
        {
          title: "Nombre Niif",
          value: "descripniif_puc",
          format: "string",
        },
        {
          title: "Base Retención",
          value: "base_puc",
        },
        {
          title: "% Retención",
          value: "porc_puc",
        },
        {
          title: "Formato",
          value: "formato_puc",
        },
        {
          title: "Concepto",
          value: "concepto_puc",
        },
        {
          title: "Renglon Iva",
          value: "iva_puc",
        },
        {
          title: "Renglon RteFte",
          value: "rfte_puc",
        },
      ];

      let header_format = [
        { text: "INFORME CONFIGURACIÓN DE CUENTAS", bold: true, size: 16 },
        "",
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Informe configuración de cuentas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `INFORME CONFIGURACIÓN DE CUENTAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = item.cod_rep + "-" + item.descrip_rep;
      this.form.tipocod = parseInt(item.nivel_rep);
      this.form.codigo = item.cod_rep.trim();
      this.form.descripcion = item.descrip_rep.trim();

    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.tipocod) {
        this.errores.tipocod = true;
        this.send_error("Nivel Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;        
        this.send_error("Descripción Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var eliminar = data.eliminar ? "1" : "0";
      var codigo = data.codigo.trim();
      var tipocod = data.tipocod;
      var descripcion = data.descripcion.trim();

      let datos = {
        url: "Phorizontal/dlls/CfCodPresup.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          tipocod +
          "|" +
          descripcion +
          "|" +
          eliminar +
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
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
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

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      this.auxiliar = this.form.auxiliar ? 4 : 0;
      post
        .postData({
          url: "Phorizontal/dlls/CfCodPresupJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|",
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
            text: "Error al cargar Codificación",
            estado: true,
          });
        });
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      this.$set(this.form, index, val_edit);
      if (callback) callback();
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
