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
              <v-icon size="30" color="blue darken-4 ">mdi-currency-twd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Conceptos Contables</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-minus</v-icon>
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
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Correo</th>
                        <th>Direcion</th>
                        <th>Ciudad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.ciudad }}</td>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3" sm="2">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                disabled
                counter="15"
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="6">
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
            <v-col class="d-flex" cols="6" sm="4">
              <v-autocomplete
                label="Punto de Facturacion"
                v-model="form.punto_fact"
                :items="agencias"
                :item-text="format_punto_fact"
                item-value="codigo_agc"
                clearable
                hide-details
                outlined
                return-object
                @change="errores.punto_fact = false"
                :error="errores.punto_fact"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Activar en:"
                v-model="form.tipodoc"
                :items="tipodoc"
                item-value="codigo_agc"
                clearable
                hide-details
                outlined
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-divider color="orange"></v-divider>
          <v-divider color="orange"></v-divider>          

          <v-row>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Cuenta Débito"
                v-model="form.ctadeb"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Cuenta Crédito"
                v-model="form.ctacre"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Pasivo Retención"
                v-model="form.ctaret"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Débito Iva"
                v-model="form.ctaiva"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Credito Reteica"
                v-model="form.ctaicav"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4" sm="6">
              <v-autocomplete
                label="Credito Anticipos"
                v-model="form.ctaant"
                :items="cuentas"
                :item-text="format_cuentas"
                item-value="cod_puc"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Detalle"
                clearable
                outlined
                required
                v-model="form.detalle"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider color="orange"></v-divider>
          <v-divider color="orange"></v-divider>          

          <v-row>
            <!-- <v-col class="d-flex" cols="8" sm="8">
              <v-switch v-model="form.cartera" label="Asociar a Cartera" hide-details></v-switch>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-switch v-model="form.proveedores" label="Asociar a Proveedores" hide-details></v-switch>
            </v-col>
 -->
           <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.estado"
                label="Bloquear"
                hide-details
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.movil"
                label="Activar en Movil"
                hide-details
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.eliminar"
                label="Eliminar"
                hide-details
              ></v-switch>
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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      cuentas: [],
      consecutivo: [],
      tipodoc: [
        { text: "Todos los Documentos", value: 0 },
        { text: "Recibo de Caja", value: 1 },
        { text: "Comprobante Egreso", value: 2 },
      ],       
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "codigo_conc" },
        { text: "Descripción", align: "left", value: "descrip_conc" },
        {
          text: "Cta Débito",
          align: "center",
          value: "ctadeb_conc.codigo_conc",
        },
        {
          text: "Cta Crédito",
          align: "center",
          value: "ctacre_conc.codigo_conc",
        },
        {
          text: "Cta Retención",
          align: "center",
          value: "ctaret_conc.codigo_conc",
        },
        { text: "Cta Iva", align: "center", value: "ctaiva_conc.codigo_conc" },
        { text: "Detalle", align: "center", value: "detalle_conc" },
        { text: "Estado", align: "center", value: "estado_conc" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarcuentas();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
          this.agencias.unshift({
            codigo_agc: "0000",
            descripcion_agc: "Todos ",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_conc;
      this.form.descripcion = item.descrip_conc;
      this.form.ctadeb = item.ctadeb_conc.codigo_conc;
      this.form.ctacre = item.ctacre_conc.codigo_conc;
      this.form.ctaret = item.ctaret_conc.codigo_conc;
      this.form.ctaiva = item.ctaiva_conc.codigo_conc;
      this.form.ctaicav = item.ctaicav_conc.codigo_conc;
      this.form.ctaant = item.ctaant_conc.codigo_conc;

      this.form.detalle = item.detalle_conc;
      this.form.punto_fact = item.agencia_conc;

      var busqueda_tipo = this.tipodoc.find(
        (el) => el.value == item.tipo_conc
      );      
      this.form.tipodoc = busqueda_tipo;
      this.form.movil = item.movil_conc == "1" ? true : false;


      // this.form.cartera = parseInt(item.cartera_conc);
      // this.form.proveedores = parseInt(item.proveedor_conc);
      this.form.estado = parseInt(item.estado_conc);
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
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var ctadeb = data.ctadeb;
      var ctacre = data.ctacre;
      var ctaret = data.ctaret;
      var ctaiva = data.ctaiva;
      var ctaicav = data.ctaicav;
      var ctaant = data.ctaant;            
      var detalle = data.detalle;
      var movil = data.movil ? "1" : "0";
      var cartera = data.cartera ? "1" : "0";
      var proveedor = data.proveedores ? "1" : "0";
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      let punto = data.punto_fact.codigo_agc;
      let tipodoc = data.tipodoc.value;

      let datos = {
        url: "Financiero/dlls/CfConceptos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          ctadeb +
          "|" +
          ctacre +
          "|" +
          ctaret +
          "|" +
          ctaiva +
          "|" +
          detalle +
          // "|" +
          // cartera +
          // "|" +
          // proveedor +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          punto +
          "|" +
          tipodoc +
          "|" +
          ctaicav +
          "|" +
          ctaant +
          "|" +
          movil +
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
      this.buscarNumero();
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.form.codigo = this.consecutivo.nro;
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
          url: "Financiero/dlls/CfconceptosJ.dll",
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
            text: "Error al cargar clasificaciones",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Financiero/dlls/CfConceptosN.dll",
          data: sessionStorage.Sesion + "|",
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

    cargarcuentas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentas = data;
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

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
