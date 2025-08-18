<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-card-account-details-star-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Cesantías</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="2">
            <v-select
              :items="anios_select"
              label="Año"
              outlined
              clearable
              hide-details
              v-model="form.año"
              item-text="text"
              item-value="value"
              @change="cargarcolaborador();"
              required
              :error="errores.anoserv"
            ></v-select>
          </v-col>

          <v-col class="d-flex" cols="12" sm="2">
            <v-btn
              color="indigo"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargarcontenido"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>

            <v-btn
              color="success"
              class="ma-2 white--text"
              large
              depressed
              @click="guardar()"
            >
              Generar Cesantias
              <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
            </v-btn>
          </v-col>
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
              <template v-slot:item.estadobase_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

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
    <v-dialog v-model="dialogoModificar.estado" max-width="600" persistent>
      <v-card
        :loading="dialogoModificar.load"
        :disabled="dialogoModificar.load"
      >
        <v-card-title class="headline">Modificar registro</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <!-- <v-btn color="primary" depressed @click="dialogoAgregar.estado = true">Agregar nuevo</v-btn> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="dialogoModificar.data.basesnomina_rep"
                item-text="descripcion_rep"
                item-value="codigo_rep"
                label="Devengos / deducciones"
                outlined
                hide-details
                clearable
                return-object
                @change="editarDevengo"
                v-model="dialogoModificar.select"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Cantidad"
                outlined
                hide-details
                v-model="dialogoModificar.select.cantidad_rep"
                v-money="money"
                ref="input_cantidad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            
            <v-col cols="6">
              <v-text-field
                label="Valor Cesantías"
                outlined
                hide-details
                v-model="dialogoModificar.select.valor_rep"
                v-money="money"
                ref="input_valor"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Valor Intereses"
                outlined
                hide-details
                v-model="dialogoModificar.select.intereses_rep"
                v-money="money"
                ref="input_interes"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn
                color="red"
                outlined
                depressed
                :disabled="dialogoModificar.select.codigo_rep ? false : true"
                @click="eliminar_devengo"
                >Eliminar</v-btn
              >
            </v-col>
          </v-row>
          <v-divider />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            @click="cancelar_modificar"
            >Cancelar</v-btn
          >
          <v-btn
            color="green"
            class="white--text"
            depressed
            @click="guardar_cambios"
            >Guardar cambios</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoAgregar.estado" max-width="600" persistent>
      <v-card>
        <v-card-title class="headline">Agregar nuevo</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                label="Devengos / deducciones"
                :items="tablaBases"
                :item-text="format_bases"
                item-value="cod_puc"
                v-model="dialogoModificar.nuevo_devengo"
                return-object
                outlined
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="red"
                outlined
                depressed
                @click="
                  dialogoAgregar.estado = false;
                  dialogoModificar.nuevo_devengo = null;
                "
                class="mr-2"
                >Cancelar</v-btn
              >
              <v-btn
                color="primary"
                depressed
                @click="agregar_devengo"
                :disabled="!dialogoModificar.nuevo_devengo"
                >Agregar</v-btn
              >
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
      pickerMes: false,
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
      agencias: [],
      contenido: [],
      colaborador: [],
      search: "",
      form: {},
      periodos: [
        { text: "1er Semestre", value: 1 },
        { text: "2do Semestre", value: 2 },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        {
          text: "Dias Cesantias",
          align: "center",
          value: "basesnomina_rep[0].cantidad_rep",
        },
        { text: "Vlr Cesantias", align: "center", value: "netonomina_rep" },
        { text: "Vlr intereses", align: "center", value: "basesnomina_rep[0].intereses_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogoModificar: {
        estado: false,
        data: {},
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
    };
  },
  created() {
    this.cargarTablaAg();
    this.get_basico();
    this.cargar_años();
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },

    guardar_cambios() {
      this.dialogoModificar.load = true;
      var items = this.dialogoModificar.data.basesnomina_rep;
      this.get_plano(items).then((plano) => {
        var sesion = sessionStorage.Sesion;
        var fecha = this.form.año;
        var periodo = "7";
        var idNomina = this.dialogoModificar.data.idnomina_rep;
        var agencia = this.dialogoModificar.data.agencianomina_rep;
        var datosEnvio =
          sesion +
          "|" +
          fecha +
          "|" +
          periodo +
          "|" +
          idNomina +
          "|" +
          agencia +
          "|" +
          plano +
          "|";

        // console.log("Terminado", plano, datosEnvio);

        post
          .postData({
            url: "Financiero/dlls/PrGthGeneraM.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.dialogoModificar.load = false;
            this.cancelar_modificar();
            this.cargarcontenido();
          })
          .catch((err) => {
            this.dialogoModificar.load = false;
            this.send_error("Ha ocurrido un error al grabar los datos");
          });
      });
    },
    get_plano(items) {
      return new Promise((resolve, reject) => {
        var array = [];

        items.forEach((el) => {
          array.push({
            codigo: el.codigo_rep.trim(),
            cantidad: el.cantidad_rep.trim().replace(/\,/g, ""),
            valor: el.valor_rep.trim().replace(/\,/g, ""),
            intereses: el.intereses_rep.trim().replace(/\,/g, ""),
          });
        });

        var formData = new FormData();
        formData.append("tipo", "prGenera_4");
        formData.append("data", JSON.stringify(array));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    agregar_devengo() {
      var nuevo = this.dialogoModificar.nuevo_devengo;
      var actuales = this.dialogoModificar.data.basesnomina_rep;

      var busqueda = actuales.find(
        (el) => el.codigo_rep == nuevo.llavebase_rep
      );

      if (!busqueda) {
        actuales.push({
          cantidad_rep: "0",
          valor_rep: "0",
          codigo_rep: nuevo.llavebase_rep,
          descripcion_rep: nuevo.descrbase_rep.trim(),
          clasifbase_rep: nuevo.clasifbase_rep,
          cajacantidad_rep: nuevo.cajacantidad_rep,
          cajavlr_rep: nuevo.cajavlr_rep,
        });

        this.$emit("snack", {
          color: "green",
          text: "Item agregado correctamente",
          estado: true,
        });

        this.dialogoModificar.nuevo_devengo = null;
        this.dialogoAgregar.estado = false;
      } else {
        this.$emit("snack", {
          color: "error",
          text: "El item ya está agregado",
          estado: true,
        });
      }
    },
    format_bases: function (val) {
      return `${val.llavebase_rep.trim()} - ${val.descrbase_rep.trim()}`;
    },
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
      this.dialogoModificar.data = {};
      this.dialogoModificar.select = {};

      this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
        "0";
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      this.$refs.input_interes.$el.getElementsByTagName("input")[0].value = "0";      
    },
    eliminar_devengo() {
      var actual = JSON.parse(JSON.stringify(this.dialogoModificar.data));
      var select = this.dialogoModificar.select;
      var bases = actual.basesnomina_rep;

      var busqueda = bases.findIndex(
        (el) => el.codigo_rep == select.codigo_rep
      );

      if (busqueda >= 0) {
        bases.splice(busqueda, 1);
        this.dialogoModificar.data = actual;
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;
        this.dialogoModificar.select.intereses_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
        this.$refs.input_interes.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editarDevengo() {
      var item = this.dialogoModificar.select;
      if (item) {
        var cantidad =
          parseFloat(item.cantidad_rep.toString().replace(/\,/g, "")) || 0;
        var valor =
          parseFloat(item.valor_rep.toString().replace(/\,/g, "")) || 0;
        var intereses =
          parseFloat(item.intereses_rep.toString().replace(/\,/g, "")) || 0;

        this.dialogoModificar.select.cantidad_rep = cantidad;
        this.dialogoModificar.select.valor_rep = valor;
        this.dialogoModificar.select.intereses_rep = intereses;
        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName(
          "input"
        )[0].value = cantidad;
        this.$refs.input_valor.$el.getElementsByTagName(
          "input"
        )[0].value = valor;
        this.$refs.input_interes.$el.getElementsByTagName(
          "input"
        )[0].value = intereses;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;
        this.dialogoModificar.select.intereses_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
        this.$refs.input_interes.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editar_item(data) {
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = JSON.parse(JSON.stringify(data));

    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.año) {
        this.errores.periodo = true;
        this.send_error("Periodo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var año = data.año;
      let datos = {
        url: "Financiero/dlls/PrGthGenera4.dll",
        data: sessionStorage.Sesion + "|" + año + "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {

          this.$emit("snack", {
            color: "success",
            text: "Cesantias Generadas correctamente",
            estado: true,
          });
          this.cargarcontenido();
          this.card_estado = false;
          this.dialogo.estado = false;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Generar Nueva Prima ";
      " " + this.form.periodo;
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
      var fecha = this.form.año;
      var periodo = "7";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthGeneraJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + periodo + "|",
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
            text: "Error al cargar Cesantias",
            estado: true,
          });
        });
    },

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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    cargarcolaborador() {
     let ano = this.form.año;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|" + ano +"|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },

    get_basico: function () {
      post
        .postData({
          url: "Financiero/dlls/CfGthbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
  },
};
</script>
