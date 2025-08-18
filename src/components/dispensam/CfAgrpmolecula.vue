<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-asterisk</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Agrupación Moléculas</v-list-item-title
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
              item-key="index"
              :search="search"
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
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader_spinner">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-row class="ml-2">
            <v-col class="d-flex" cols="5">
              <span class="title col-12">{{ dialogo.titulo }}</span>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                clearable
                type="text"
                required
                disabled
                v-model="form.codigo"
                :error="errores.codigo"
                hide-details
              >
                <template v-slot:label>
                  <span style="color: #0033b3 !important">Consecutivo</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información Básica</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      :items="moleculas"
                      clearable
                      hide-details
                      v-model="form.molecula"
                      :item-text="format_moleculas"
                      :error="errores.molecula"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Principio Activo</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      :items="concentrac"
                      clearable
                      hide-details
                      v-model="form.concentrac"
                      :item-text="format_concentrac"
                      :error="errores.concentrac"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Concentración</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      :items="undconcentrac"
                      clearable
                      hide-details
                      v-model="form.undconcentrac"
                      :item-text="format_undconcentrac"
                      :error="errores.undconcentrac"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Unid. Concentración</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>

                <v-row class="d-flex mt-2" no-gutters>
                  <v-col class="d-flex align-left" cols="9">
                    <v-btn
                      class="ma-2 px-4 white--text"
                      color="indigo"
                      depressed
                      medium
                      @click="asignar_nombre(1)"
                      >Agregar</v-btn
                    >
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-btn
                      class="ma-2 px-4 white--text"
                      color="purple"
                      medium
                      depressed
                      @click="asignar_nombre(4)"
                      >Borrar Formulario</v-btn
                    >
                  </v-col>
                </v-row>

                <v-row class="ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      disabled
                      required
                      clearable
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Descripción</span
                        >
                      </template></v-text-field
                    >
                  </v-col>
                </v-row>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      :items="ffarmac"
                      clearable
                      hide-details
                      v-model="form.ffarmac"
                      :item-text="format_ffarmac"
                      :error="errores.ffarmac"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Forma farmacéutica</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>

                <v-row class="ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      :items="grpfarma_items"
                      clearable
                      hide-details
                      v-model="form.grpfarma"
                      :item-text="format_grpfarma"
                      :error="errores.grpfarma"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Grupo Farmacológico</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      :items="grpfarma_items"
                      clearable
                      hide-details
                      v-model="form.grpfarma2"
                      :item-text="format_grpfarma"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Grupo Farmacológico</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-divider class="mt-4" color="#FF6F00"></v-divider>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="#FF6F00"></v-divider>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.bloquear" label="Bloquear"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <!-- <v-btn
            color="light-blue accent-4 white--text"
            class
            @click="cargarTablactas()"
            depressed
            small
          >
            <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
          </v-btn> -->
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
            class="ma-2 px-4 white--text"
            color="indigo"
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
      loader_spinner: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
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
      undconcentrac: [],
      codigos_molecula: "",
      tab: 0,
      search: null,
      form: {
        consecutivo: null,
        molecula: null,
        descripcion: null,
        concentrac: null,
        grpfarma: null,
      },
      headers: [
        // { text: "", value: "data-table-expand" },
        // { text: "Opciones", value: "edit", align: "center" },
           { text: "Codigo", align: "left", value: "codigo_rep" },
        // { text: "Concentracion", align: "left", value: "concentr_rep" },
        // { text: "Forma Farmac", align: "left", value: "ffarmac_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      errores: {
        molecula: false,
        grpfarma: false,
        concentrac: false,
        ffarmac: false,
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
    this.cargarMoleculas();
    this.cargarConcentr();
    this.cargarFfarmac();
    this.cargarcontenido();
    this.cargarGrpfarma();
    this.cargarUnConcentr();
  },
  computed: {},
  methods: {
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Codigo Agrpmolecula",
          value: "codigo_rep",
          format: "string",
        },
        {
          title: "Nombre",
          value: "descripcion_rep",
          format: "string",
        },
      ];
      var header_format = [
        { text: "REPORTE AGRUPACION MOLECULAS", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Agrupacion Moleculas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE AGRUPACION MOLECULAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
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
    cargarMoleculas() {
      this.loader_spinner = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMoleculaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader_spinner = false;
          this.moleculas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader_spinner = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Moleculas",
            estado: true,
          });
        });
    },
    cargarGrpfarma() {
      post
        .postData({
          url: "Dispensa/dlls/CfGrpfarmaJ.dll",
          data: sessionStorage.Sesion + "|" + 4 + "|",
          method: "",
        })
        .then((data) => {
          this.grpfarma = JSON.parse(JSON.stringify(data));
          this.grpfarma_items = [...this.grpfarma];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Grupos Farmacologicos",
            estado: true,
          });
        });
    },
    cargarConcentr() {
      post
        .postData({
          url: "Dispensa/dlls/CfConcentracJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.concentrac = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Concentraciones",
            estado: true,
          });
        });
    },
    cargarUnConcentr() {
      post
        .postData({
          url: "Dispensa/dlls/CfUnidConcentJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.undconcentrac = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Concentraciones",
            estado: true,
          });
        });
    },
    cargarFfarmac() {
      post
        .postData({
          url: "Dispensa/dlls/CfformafarmacJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.ffarmac = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Formas Farmaceuticas",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agrp_Moleculas",
            estado: true,
          });
        });
    },
    editar_item(item) {
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.form.codigo = parseFloat(item.codigo_rep);
      this.form.descripcion = item.descripcion_rep.trim();
      this.form.undconcentrac = null;

      // let busqueda_select = this.concentrac.find(
      //   (el) => el.cod_rep == item.concentr_rep
      // );
      // this.form.concentrac = busqueda_select;

      // busqueda_select = this.undconcentrac.find(
      //   (el) => el.cod_rep == item.undconc_rep
      // );
      // this.form.undconcentrac = busqueda_select;

      let busqueda_select = this.ffarmac.find(
        (el) => el.cod_rep == item.ffarmac_rep
      );
      this.form.ffarmac = busqueda_select;

      busqueda_select = this.grpfarma_items.find(
        (el) => el.cod_rep == item.grpfarma1_rep.trim()
      );
      this.form.grpfarma = busqueda_select;

      busqueda_select = this.grpfarma_items.find(
        (el) => el.cod_rep.trim() == item.grpfarma2_rep.trim()
      );
      this.form.grpfarma2 = busqueda_select;

      this.form.bloquear = item.estado_rep == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcion) {
        this.errores.molecula = true;
        this.send_error("Error en molecula!");
      } else if (!data.ffarmac) {
        this.errores.ffarmac = true;
        this.send_error("Error en forma farmaceutica!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let codigo = data.codigo;
      let descripcion = data.descripcion.replace(/\*/g, "x").trim();
      // let concentrac = data.concentrac.cod_rep;
      // let undconcentrac = data.undconcentrac ? data.undconcentrac.cod_rep : "0";
      let formafarma = data.ffarmac.cod_rep;
      let grpfarma1 = data.grpfarma ? data.grpfarma.cod_rep : "0";
      let grpfarma2 = data.grpfarma2 ? data.grpfarma2.cod_rep : "0";

      let bloquear = data.bloquear ? "1" : "0";
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Dispensa/dlls/CfAgrpmolecula.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          formafarma +
          "|" +
          grpfarma1 +
          "|" +
          grpfarma2 +
          "|" +
          bloquear +
          "|" +
          eliminar +
          "|" +
          this.codigos_molecula +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          let msg = data[0];
          this.$emit("snack", {
            color: "success",
            text: msg,
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
          url: "Dispensa/dlls/CfAgrpmoleculaN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.estado = 0;
          this.dialogo.titulo = "Agregar nuevo Registro";
          this.dialogo.estado = true;
          this.dialogo.tipo = 0;
          this.form.codigo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Numeración",
            estado: true,
          });
        });
    },
    init_form() {
      this.form.molecula = "";
      this.form.descripcion = "";
      this.form.grpfarma = "";
      this.form.concentrac = "";
      this.form.ffarmac = "";
      this.form.undconcentrac = "";
    },
    format_moleculas(val) {
      return `${val.descrip_rep}`;
    },
    format_grpfarma(val) {
      return `${val.descrip_rep}`;
    },
    format_concentrac(val) {
      return `${val.descrip_rep}`;
    },
    format_undconcentrac(val) {
      return `${val.descrip_rep}`;
    },
    format_ffarmac(val) {
      return `${val.descrip_rep}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    asignar_nombre(tipo) {
      console.log(this.form);
      let descripcion = this.form.descripcion.trim();

      if (tipo == 1) {
        if (descripcion == "") {
          descripcion =
            this.form.molecula.descrip_rep.trim() +
            " " +
            this.form.concentrac.descrip_rep.trim() +
            " " +
            this.form.undconcentrac.descrip_rep.trim();
            this.codigos_molecula = this.form.molecula.cod_rep + ";";
        } else {
          descripcion =
            descripcion +
            "+" +
            this.form.molecula.descrip_rep.trim() +
            " " +
            this.form.concentrac.descrip_rep.trim() +
            " " +
            this.form.undconcentrac.descrip_rep.trim();
            this.codigos_molecula = this.codigos_molecula + this.form.molecula.cod_rep + ";";            
        }
      }

      if (tipo == 4) {
        descripcion = "";
        this.codigos_molecula = [];
      }
      this.form.descripcion = descripcion;
      this.form.molecula = null;
      this.form.concentrac = null;
      this.form.undconcentrac = null;

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
