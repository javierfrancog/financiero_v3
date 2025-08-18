<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">
                mdi-swap-horizontal
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Configuración Operaciones Inventarios
              </v-list-item-title>
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
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
                <v-icon small class="mr-2" @click="editar_item(item)">
                  edit
                </v-icon>
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
            <v-col sm="3" cols="12">
              <v-select
                :items="[
                  { title: 'Entrada', value: 'E' },
                  { title: 'Salida', value: 'S' },
                ]"
                label="Tipo Registro"
                variant="outlined"
                hide-details
                v-model="form.tipo"
                :disabled="disabled.tipo"
                @update:modelValue="
                  get_consecutivo();
                  errores.tipo = false;
                "
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="8" sm="8">
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
            <v-col class="d-flex" cols="3" sm="3">
              <v-text-field
                label="Abreviacion"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.abreviacion"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="3" sm="3">
              <v-select
                :items="[
                  { text: 'Anual', value: 0 },
                  { text: 'Mensual', value: 1 },
                ]"
                label="Tipo de Numeración"
                outlined
                hide-details
                v-model="form.numeracion"
                item-text="text"
                required
                :error="errores.numeracion"
                @change="errores.numeracion = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="anios_select"
                label="Año"
                outlined
                clearable
                hide-details
                v-model="form.ano"
                item-text="text"
                item-value="value"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Enero', value: 1 },
                  { text: 'Febrero', value: 2 },
                  { text: 'Marzo', value: 3 },
                  { text: 'Abril', value: 4 },
                  { text: 'Mayo', value: 5 },
                  { text: 'Junio', value: 6 },
                  { text: 'Julio', value: 7 },
                  { text: 'Agosto', value: 8 },
                  { text: 'Septiembre', value: 9 },
                  { text: 'Octubre', value: 10 },
                  { text: 'Noviembre', value: 11 },
                  { text: 'Diciembre', value: 12 },
                ]"
                label="Mes"
                outlined
                clearable
                hide-details
                v-model="form.mes"
                item-text="text"
                item-value="value"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="3" sm="3">
              <v-text-field
                label="Nvo.Consecutivo"
                clearable
                outlined
                type="number"
                required
                counter="6"
                v-model="form.consecutivo"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-switch
                v-model="form.asociar"
                label="Asociar Factura"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-switch
                v-model="form.asociarcont"
                label="Asociar Contabilidad"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-switch
                v-model="form.asocdsp"
                label="Asociar Doc_Soporte"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-switch
                v-model="form.asociarbas"
                label="Asociar Báscula"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <!-- <v-col class="d-flex" cols="6"
                 v-if="form.asociarcont ? (form.asociarcont == 1 ? true : false) : false"
              > -->
            <v-col class="d-flex" cols="10">
              <v-autocomplete
                label="Tipo Documento"
                v-model="form.tipoDocumento"
                :items="docc"
                :item-text="format_docc"
                hide-details
                return-object
                outlined
                clearable
                :error="error.tipoDocumento"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Cuenta Costo"
                v-model="form.ctacosto"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

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
          >
            Cancelar
          </v-btn>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
          >
            Guardar
          </v-btn>
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
      expanded: [],
      contenido: [],
      docc: [],
      cuentas: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Tipo", align: "center", value: "tipo_tpoper" },
        { text: "Codigo", align: "center", value: "codigo_tpoper" },
        { text: "Descripción", align: "left", value: "descrip_tpoper" },
        { text: "T.Numeracion", align: "center", value: "tiponumer_tpoper" },
        { text: "Asoc_Facturacion", align: "center", value: "asofact_tpoper" },
        { text: "Abreviacion", align: "center", value: "abreviac_tpoper" },
        { text: "Estado", align: "center", value: "estado_tpoper" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      disabled: {
        tipo: false,
      },
      error: {
        tipoDocumento: false,
      },
      card_estado: false,
      anios_select: [],
    };
  },
  created() {
    this.cargar_anios();
    this.cargarcontenido();
    this.cargardoccontab();
    this.cargarcuentas();
  },
  computed: {},
  methods: {
    cargar_anios() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.disabled.tipo = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      // this.form.tipo = Disabled;
      this.form.tipo = item.tipo_tpoper;
      this.form.codigo = item.codigo_tpoper;
      this.form.descripcion = item.descrip_tpoper;
      this.form.numeracion = parseInt(item.tiponumer_tpoper);
      this.form.asociar = item.asofact_tpoper;
      this.form.asocdsp = item.asocdsp_tpoper;
      this.form.abreviacion = item.abreviac_tpoper;
      this.form.asociarcont = item.asocont_tpoper == "1" ? true : false;
      this.form.asociarbas = item.asobasc_tpoper == "1" ? true : false;
      this.form.asocdsp = item.asocdsp_tpoper == "1" ? true : false;
      this.form.asociar = item.asofact_tpoper == "1" ? true : false;
      this.form.estado = item.estado_tpoper == "1" ? true : false;
      this.form.ctacosto = item.ctacto_tpoper;

      var busqueda_doc = this.docc.find(
        (el) => el.codky_docc == item.doccontab_tpoper
      );
      this.form.tipoDocumento = busqueda_doc;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var tipo = data.tipo;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var numeracion = data.numeracion;
      var abreviacion = data.abreviacion;
      var ano = data.ano;
      var mes = data.mes;
      var consecutivo = this.form.consecutivo || "0";
      var asocfact = data.asociar ? "1" : "0";
      var asocbas = data.asociarbas ? "1" : "0";
      var asocdsp = data.asocdsp ? "1" : "0";
      var doccontab =
        data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      var ctacosto = this.form.ctacosto ? this.form.ctacosto : "0";

      let datos = {
        url: "Financiero/dlls/CfTpOperInv.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          asocfact +
          "|" +
          asocbas +
          "|" +
          numeracion +
          "|" +
          abreviacion +
          "|" +
          doccontab +
          "|" +
          ano +
          "|" +
          mes +
          "|" +
          consecutivo +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          asocdsp +
          "|" +
          ctacosto +
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
          this.send_error("Error al grabar Registro") + err.Mensaje[0].Error;
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.disabled.tipo = false;

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
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
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
            text: "Error al cargar Tipos de Operacion",
            estado: true,
          });
        });
    },
    cargarcuentas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentas = data;
          this.cuentas.unshift({
            cod_puc: "0000",
            descrip_puc: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },
    format_cuentas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },

    get_consecutivo: function () {
      var tipo = this.form.tipo;
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvN.dll",
          data: sessionStorage.Sesion + "|" + tipo + "|",
          method: "",
        })
        .then((data) => {
          this.form.codigo = data[0].nro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },

    cargardoccontab() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfDoccontabJ.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.docc = data;
          this.docc.unshift({
            agencia_docc: "0000",
            codigo_docc: "999",
            descrip_docc: "No aplica",
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clasificaciones",
            estado: true,
          });
        });
    },

    format_docc: function (val) {
      return `${val.agencia_docc + val.codigo_docc} - ${val.descrip_docc}`;
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
