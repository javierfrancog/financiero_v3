<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-finance </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Cargue Presupuesto Comercial</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.periodo_cargue"
                      label="Periodo de cargue"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="cargarPeriodos()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Consultar
                </v-btn>
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="orange white--text"
                  class
                  @click="clonar_contab()"
                  depressed
                >
                  <v-icon size="20" left>mdi-apps</v-icon>Cargue desde Contablidad</v-btn>
              </v-col>


              <v-col class="d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="clonar_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-sheep</v-icon>Clonar Presupuesto
                </v-btn>
              </v-col>

            </v-row>

            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="false"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <!-- <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
              </template> -->
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Código de cuenta"
                v-model="form.cuentaContable"
                :items="cuentasContables"
                :item-text="format_cuentac"
                item-value="cod_puc"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Seleccione el Rut"
                v-model="form.selruts"
                :items="tablaruts"
                :item-text="format_ruts"
                item-value="cod_puc"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Valor"
                clearable
                outlined
                required
                v-model="form.valor"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
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
    <v-dialog v-model="dialogo.clonar" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerPeriodoDest"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.periodo_destino"
                      label="Periodo Destino"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.periodo_destino"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodoDest = false"
                  ></v-date-picker>
                </v-menu>
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
              dialogo.clonar = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="clonar()"
            >Clonar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>    
    <v-dialog v-model="dialogocontab.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogocontab.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerPeriodoDest"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.periodo_destino"
                      label="Periodo Destino"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.periodo_destino"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodoDest = false"
                  ></v-date-picker>
                </v-menu>
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
              dialogo.clonar = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="clonar()"
            >Clonar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>        
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      dialogo: {
        estado: false,
        clonar: false,        
        titulo: null,
        tipo: null,
      },
      dialogocontab: {
        estado: false,
        titulo: null,
        tipo: null,
      },      
      card_estado: false,
      errores: {
        periodo_cargue: false,
        periodo_destino: false,        
        formato: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      dialogPicker: false,
      pickerPeriodoDest: false,      
      singleExpand: true,
      pickerPeriodo: false,
      años_select: [],
      cuentasContables: [],
      tablaruts: [],
      contenido: [],
      search: "",
      form: {},
      drawer: false,
      headers: [
        { text: "Codigo", align: "center", value: "codcuenta_rep" },
        { text: "Cuenta", align: "left", value: "desccuenta_rep" },
        { text: "Id", align: "center", value: "idrut_rep" },        
        { text: "Descripcion", align: "left", value: "descrut_rep" },        
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Opción", align: "center", value: "action", width: "15%" },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
    };
  },
  created() {
    this.loader = false;
    this.cargarTablactas();
    this.cargarTablaruts();
  },
  methods: {
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasContables = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    clonar_item() {
      this.form.clonar = 0;
      this.dialogo.titulo = "Clonar Periodo";
      this.dialogo.clonar = true;
    },
    clonar_contab() {
      this.dialogocont.titulo = "Importar desde Contabilidad";
      this.dialogocont.estado = true;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };
    },
    cargarPeriodos: function () {
      var periodo = this.form.periodo_cargue.replace(/\-/g, "");

      post
        .postData({
          url: "Financiero/dlls//PrPptoComJ.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.send_error("Error al cargar Bases");
        });
    },

    clonar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo_cargue) {
        this.errores.periodo_cargue = true;
        this.send_error("Periodo Origen Obligatorio!");
      } else if (!data.periodo_destino) {
        this.errores.formato = true;
        this.send_error("Periodo Destino Obligatorio!");
      } else {
        this.envio_clonar(data);
      }
    },

    envio_clonar(data) {
      this.card_estado = true;
      var origen = this.form.periodo_cargue.replace(/\-/g, "");
      var destino = this.form.periodo_destino.replace(/\-/g, "");

      let datos = {
        url: "Financiero/dlls/RpPrevtas02J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          origen +
          "|" +
          destino +
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
          this.dialogo.clonar = false;
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo_cargue) {
        this.errores.periodo_cargue = true;
        this.send_error("Periodo Obligatorio!");
      } else if (!data.cuentaContable) {
        this.errores.formato = true;
        this.send_error("Cuenta Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    format_envio(data) {
      console.log(data);
      this.card_estado = true;
      var periodo = this.form.periodo_cargue.replace(/\-/g, "");
      var cuenta = data.cuentaContable.cod_puc;
      var rut = data.selruts.identificacion_rut;      
      var valor = data.valor;

      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/PrPptoCom.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          periodo +
          "|" +
          cuenta +
          "|" +
          rut +
          "|" +
          valor +
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
          this.cargarPeriodos();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
  },
};
</script>
