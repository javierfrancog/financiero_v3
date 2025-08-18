<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-locker-multiple</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Presentaciones Comerciales</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col>
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar
                  <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>

              <v-col>
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
            >
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
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Consecutivo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="ml-2">
            <v-col class="d-flex" cols="3">
              <v-select
                :items="items_empaques"
                label="Empaque"
                clearable
                hide-details
                v-model="form.empaque"
                :error="errores.empaque"
                return-object
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                clearable
                type="numeric"
                required
                v-model="form.cantempaque"
                hide-details
                ><template v-slot:label>
                  <span style="color: #0033b3 !important">Cant x Empaque</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Abreviación"
                clearable
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar"
              label="Eliminar"
              hide-details
            ></v-switch>
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
      singleExpand: true,
      expanded: [],
      contenido: [],
      search: "",
      form: {},
      items_empaques: [
        { text: "Ampolla", value: 1 },
        { text: "Barra", value: 2 },
        { text: "Blister", value: 3 },
        { text: "Bolsa", value: 4 },
        { text: "Bolsa Rigida", value: 5 },
        { text: "Caja", value: 6 },
        { text: "Frasco", value: 7 },
        { text: "Frasco Spray", value: 8 },
        { text: "Garrafa", value: 9 },
        { text: "Kit", value: 10 },
        { text: "Lata", value: 11 },
        { text: "Paquete", value: 12 },
        { text: "Pote", value: 13 },
        { text: "Rollo", value: 14 },
        { text: "Saco", value: 15 },
        { text: "Sobre", value: 16 },
        { text: "Spray", value: 17 },
        { text: "Tarro", value: 18 },
        { text: "Tetrapack", value: 19 },
        { text: "Tubo", value: 20 },
        { text: "Vial", value: 21 },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        descripcion: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Codigo",
          value: "cod_rep",
          format: "string",
        },
        {
          title: "Nombre",
          value: "descrip_rep",
          format: "string",
        },
      ];
      var header_format = [
        { text: "REPORTE PRESENTACION COMERCIAL", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Presentacion Comercial",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE PRESENTACION COMERCIAL-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Presentación";
      this.dialogo.tipo = 1;

      let busqueda_empaque = this.items_empaques.find(
        (el) => parseFloat(el.value) == parseFloat(item.empaque_rep)
      );
      this.form.empaque = busqueda_empaque;

      this.form.codigo = item.cod_rep;
      this.form.descripcion = item.descrip_rep.trim();
      this.form.cantempaque = parseFloat(item.cant_rep);
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripcion Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      let codigo = data.codigo;
      let empaque = data.empaque.value;
      let cantidad = data.cantempaque;
      let descripcion = data.descripcion.replace(/\*/g, "x");
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Dispensa/dlls/CfPresentmedic.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          empaque +
          "|" +
          cantidad +
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
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfPresentmedicN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.estado = 0;
          this.form.activacion = this.$moment().format("YYYY-MM-DD");
          this.dialogo.titulo = "Agregar nuevo Registro";
          this.dialogo.estado = true;
          this.dialogo.tipo = 0;
          this.form.codigo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Presentaciones",
            estado: true,
          });
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

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfPresentmedicJ.dll",
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
            text: "Error al cargar Presentaciones",
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
