<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Tarifas</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
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

              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="6">
                <v-btn
                  color="green darken-1"
                  class="ml-3 white--text px-6"
                  @click="imprimir_excel"
                  large
                  depressed
                >
                  Generar EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estadobase_rep="{ item }">
                {{ item.estadobase_rep == "1" ? "Bloqueado" : "Activo" }}
              </template>

              <template v-slot:item.estadoretro_rep="{ item }">
                {{ item.estadoretro_rep == "1" ? "Activado" : "Desactivado" }}
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Año"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.año"
                :error="errores.año"
                @input="errores.año = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                disabled
                required
                v-model="form.descripcion"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Area"
                v-model="form.area"
                :items="areas"
                :item-text="format_areas"
                hide-details
                outlined
                @change="errores.areas = false"
                :error="errores.areas"
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Valor Cuota Ordinaria"
                clearable
                outlined
                required
                v-money="money0"
                v-model="form.vlr_ord"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.extra"
                hide-details
                @change="select_extra()"
                label="Activar Extraordinaria"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="4" v-if="extra">
              <v-text-field
                label="Valor Cuota Extraordinaria"
                clearable
                outlined
                required
                v-money="money0"
                v-model="form.vlr_extra"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Valor Retroactivo"
                clearable
                outlined
                required
                v-money="money0"
                v-model="form.vlr_retro"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.retro"
                hide-details
                label="Activar Retroactivo"
              ></v-switch>
            </v-col>
          </v-row>

          <v-divider class="mt-1"></v-divider>

          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      extra: false,
      expanded: [],
      contenido: [],
      datosctas: [],
      areas: [],
      search: "",
      form: {},
      headers: [
        { text: "Año", align: "left", value: "ano_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Area", align: "left", value: "vlrarea_rep" },

        { text: "Cuota Ordinaria", align: "center", value: "vlrord_rep" },
        { text: "Cuota ExtraOrdinaria", align: "center", value: "vlrext_rep" },
        { text: "Retroactivo", align: "center", value: "vlrretro_rep" },
        { text: "Estado Retroactivo", align: "center", value: "estadoretro_rep" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        año: false,
        areas: false,
        vlr_ord: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    this.cargarcontenido();
    this.get_areas();
  },
  computed: {},
  methods: {
    select_extra() {
      if (this.form.extra) {
        this.extra = true;
      } else {
        this.extra = false;
      }
    },
    get_areas() {
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/CfAreasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.areas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Areas",
            estado: true,
          });
        });
    },
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];
      let perini = this.periodo_ini;
      let perfin = this.periodo_fin;

      const safeNumber = (value) => {
        if (typeof value === "string") {
          const cleanedValue = value.replace(/\s+/g, "").replace(/,/g, "");
          const parsedValue = parseFloat(cleanedValue);
          return isNaN(parsedValue) ? 0 : parsedValue;
        }
        return typeof value === "number" ? value : 0;
      };

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.vlrord_rep = safeNumber(el.vlrord_rep);
        copia.vlrarea_rep = safeNumber(el.vlrarea_rep);
        copia.vlrext_rep = safeNumber(el.vlrext_rep);
        copia.vlrretro_rep = safeNumber(el.vlrretro_rep);
        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Año",
          value: "ano_rep",
          format: "string",
        },

        {
          title: "Codigo",
          value: "idarea_rep",
          format: "string",
        },
        {
          title: "Descripción",
          value: "descrip_rep",
          format: "string",
        },
        {
          title: "Area",
          value: "vlrarea_rep",
          format: "money",
        },
        {
          title: "Cuota Ordinaria",
          value: "vlrord_rep",
          format: "money",
        },
        {
          title: "Cuota extraordinaria",
          value: "vlrext_rep",
          format: "money",
        },
        {
          title: "Retroactivo",
          value: "vlrretro_rep",
          format: "money",
        },
      ];

      let header_format = [
        {
          text: "REPORTE TARIFAS",
          bold: true,
          size: 16,
        },
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Tarifas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE TARIFAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    editar_item(data) {
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      var item = JSON.parse(JSON.stringify(data));

      var busqueda = this.areas.find(
        (el) => el.cod_rep == parseFloat(item.idarea_rep)
      );
      this.form.año = item.ano_rep;
      this.form.descripcion = item.descrip_rep;
      this.form.area = busqueda;
      this.form.vlr_ord = item.vlrord_rep.replace(/\,/g, "");
      this.form.vlr_retro = item.vlrretro_rep.replace(/\,/g, "");
      this.form.vlr_extra = item.vlrext_rep;
      if (item.estadoretro_rep == 1) {
        this.form.retro = true;
      } else {
        this.form.retro = false;
      }
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      console.log(data);
      if (!data.año) {
        this.errores.año = true;
        this.send_error("Año Obligatorio!");
      } else if (!data.area) {
        this.errores.area = true;
        this.send_error("Coeficiente Obligatorio!");
      } else if (!data.vlr_ord) {
        this.errores.vlr_ord = true;
        this.send_error("Valor Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var año = data.año;
      var area = data.area.cod_rep;
      var descripcion = data.descripcion.trim();
      var vlr_ord = data.vlr_ord.toString().replace(/\,/g, "");
      var vlr_extra = data.extra
        ? data.vlr_extra.toString().replace(/\,/g, "")
        : "0";
      var vlr_retro = data.vlr_retro
        ? data.vlr_retro.toString().replace(/\,/g, "")
        : "0";

      var eliminar = data.eliminar ? "1" : "0";
      var retro = data.retro ? "1" : "0";

      let datos = {
        url: "Phorizontal/dlls/Cftarifas.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          año +
          "|" +
          area +
          "|" +
          descripcion +
          "|" +
          vlr_ord +
          "|" +
          vlr_extra +
          "|" +
          vlr_retro +
          "|" +
          eliminar +
          "|" +
          retro +
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
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.form.descripcion = "Cuota de Administracion";
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

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/CftarifasJ.dll",
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
            text: "Error al cargar Tarifas",
            estado: true,
          });
        });
    },
    format_areas(val) {
      return `${val.valor_rep}`;
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
