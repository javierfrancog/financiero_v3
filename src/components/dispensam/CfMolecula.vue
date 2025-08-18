<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-virus-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Móleculas</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
              <v-btn
                color="orange"
                class="ma-2 white--text"
                large
                depressed
                @click="cargarcontenido()"
              >
                Refrescar
                <v-icon right dark class="ml-4">mdi-approximately-equal</v-icon>
              </v-btn>
              <!-- <v-col>
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
 -->

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
      <flower-spinner :animation-duration="1700" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
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
                type="text"
                required
                disabled
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="grpfarma"
                clearable
                hide-details
                v-model="form.grpfarma1"
                :item-text="format_grpfarma"
                :error="errores.grpfarma1"
                return-object
                required
                ><template v-slot:label>
                  <span style="color: #0033b3 !important"
                    >Grupo Farmacológico_1</span
                  >
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="grpfarma"
                clearable
                hide-details
                v-model="form.grpfarma2"
                :item-text="format_grpfarma"
                :error="errores.grpfarma2"
                return-object
                required
                ><template v-slot:label>
                  <span style="color: #0033b3 !important"
                    >Grupo Farmacológico_2</span
                  >
                </template></v-autocomplete
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="grpfarma"
                clearable
                hide-details
                v-model="form.grpfarma3"
                :item-text="format_grpfarma"
                :error="errores.grpfarma3"
                return-object
                required
                ><template v-slot:label>
                  <span style="color: #0033b3 !important"
                    >Grupo Farmacológico_3</span
                  >
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="grpfarma"
                clearable
                hide-details
                v-model="form.grpfarma4"
                :item-text="format_grpfarma"
                :error="errores.grpfarma4"
                return-object
                required
                ><template v-slot:label>
                  <span style="color: #0033b3 !important"
                    >Grupo Farmacológico_4</span
                  >
                </template></v-autocomplete
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="grpfarma"
                clearable
                hide-details
                v-model="form.grpfarma5"
                :item-text="format_grpfarma"
                :error="errores.grpfarma5"
                return-object
                required
                ><template v-slot:label>
                  <span style="color: #0033b3 !important"
                    >Grupo Farmacológico_5</span
                  >
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="grpfarma"
                clearable
                hide-details
                v-model="form.grpfarma6"
                :item-text="format_grpfarma"
                :error="errores.grpfarma6"
                return-object
                required
                ><template v-slot:label>
                  <span style="color: #0033b3 !important"
                    >Grupo Farmacológico_6</span
                  >
                </template></v-autocomplete
              >
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
      grpfarma: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Grp Farmacologico", align: "left", value: "descgrpfarm1_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        descripcion: false,
        grpfarma: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarGrpfarma();
  },
  computed: {},
  methods: {
    cargarGrpfarma() {
      post
        .postData({
          url: "Dispensa/dlls/CfGrpfarmaJ.dll",
          data: sessionStorage.Sesion + "|" + 4 + "|",
          method: "",
        })
        .then((data) => {
          this.grpfarma = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Grupos Farmacologicos",
            estado: true,
          });
        });
    },
    format_grpfarma(val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Molecula";
      this.dialogo.tipo = 1;
      this.form.codigo = item.cod_rep;
      this.form.descripcion = item.descrip_rep.trim();

      let busqueda_grpfarma = this.grpfarma.find(
        (el) => el.cod_rep == item.grpfarma1_rep.trim()
      );
      this.form.grpfarma1 = busqueda_grpfarma;

      busqueda_grpfarma = this.grpfarma.find(
        (el) => el.cod_rep == item.grpfarma2_rep.trim()
      );
      this.form.grpfarma2 = busqueda_grpfarma;

      busqueda_grpfarma = this.grpfarma.find(
        (el) => el.cod_rep == item.grpfarma3_rep.trim()
      );
      this.form.grpfarma3 = busqueda_grpfarma;

      busqueda_grpfarma = this.grpfarma.find(
        (el) => el.cod_rep == item.grpfarma4_rep.trim()
      );
      this.form.grpfarma4 = busqueda_grpfarma;
      
      busqueda_grpfarma = this.grpfarma.find(
        (el) => el.cod_rep == item.grpfarma5_rep.trim()
      );
      this.form.grpfarma5 = busqueda_grpfarma;

      busqueda_grpfarma = this.grpfarma.find(
        (el) => el.cod_rep == item.grpfarma6_rep.trim()
      );
      this.form.grpfarma6 = busqueda_grpfarma;



    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripcion Obligatoria!");
      } else if (!data.grpfarma1) {
        this.errores.grpfarma1 = true;
        this.send_error("Grupo Farmacologico Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      let grpfarma1 = data.grpfarma1.cod_rep;
      let grpfarma2 = data.grpfarma2? data.grpfarma2.cod_rep : "0";
      let grpfarma3 = data.grpfarma3? data.grpfarma3.cod_rep: "0";
      let grpfarma4 = data.grpfarma4? data.grpfarma4.cod_rep: "0";
      let grpfarma5 = data.grpfarma5? data.grpfarma5.cod_rep: "0";
      let grpfarma6 = data.grpfarma6? data.grpfarma6.cod_rep: "0";
      var descripcion = data.descripcion.replace(/\*/g, "x");
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Dispensa/dlls/CfMolecula.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          grpfarma1 +
          "|" +
          grpfarma2 +
          "|" +
          grpfarma3 +
          "|" +
          grpfarma4 +
          "|" +
          grpfarma5 +
          "|" +
          grpfarma6 +
          "|" +
          "0" +
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
          // this.cargarcontenido();
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
          url: "Dispensa/dlls/CfMoleculaN.dll",
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
          url: "Dispensa/dlls/CfMoleculaJ.dll",
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
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Codigo molecula",
          value: "cod_rep",
          format: "string",
        },
        {
          title: "Nombre",
          value: "descrip_rep",
          format: "string",
        },
        {
          title: "Cod_Grp_Farmacologico_1",
          value: "grpfarma1_rep",
          format: "string",
        },
        {
          title: "Descripcion Grp Farmacologico_1",
          value: "descgrpfarm1_rep",
          format: "string",
        },
        {
          title: "Cod_Grp_Farmacologico_2",
          value: "grpfarma2_rep",
          format: "string",
        },
        {
          title: "Descripcion Grp Farmacologico_2",
          value: "descgrpfarm2_rep",
          format: "string",
        },
        {
          title: "Cod_Grp_Farmacologico_3",
          value: "grpfarma3_rep",
          format: "string",
        },
        {
          title: "Descripcion Grp Farmacologico_3",
          value: "descgrpfarm3_rep",
          format: "string",
        },
        {
          title: "Cod_Grp_Farmacologico_4",
          value: "grpfarma4_rep",
          format: "string",
        },
        {
          title: "Descripcion Grp Farmacologico_4",
          value: "descgrpfarm4_rep",
          format: "string",
        },
        {
          title: "Cod_Grp_Farmacologico_5",
          value: "grpfarma5_rep",
          format: "string",
        },
        {
          title: "Descripcion Grp Farmacologico_5",
          value: "descgrpfarm5_rep",
          format: "string",
        },
        {
          title: "Cod_Grp_Farmacologico_6",
          value: "grpfarma6_rep",
          format: "string",
        },
        {
          title: "Descripcion Grp Farmacologico_6",
          value: "descgrpfarm6_rep",
          format: "string",
        },

      ];
      var header_format = [
        { text: "REPORTE MOLECULAS", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Moleculas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE MOLECULAS-${new Date().getTime()}`,
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
