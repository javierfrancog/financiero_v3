<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-capacity-increase</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Prestaciones Colaborador
              </v-list-item-title>
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="2">
            <v-menu
              ref="menu"
              v-model="dialogPicker"
              transition="scale-transition"
              offset-y
              min-width="290px"
              required
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="Fecha Liquidación"
                  outlined
                  v-model="form.fecha"
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                @input="dialogPicker = false"
                @change="cargarcolaborador()"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              label="Colaborador"
              v-model="form.colabora"
              :items="ruts3"
              :item-text="format_ruts"
              item-value="identificacion_rut"
              clearable
              hide-details
              return-object
              outlined
              :error="errores.colabora"
              @change="montar_fechas()"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="12" sm="4" v-if="this.form.colabora">
            <v-btn
              color="indigo"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="get_liquidacion"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>

            <v-btn
              color="orange"
              class="ma-2 white--text"
              large
              depressed
              @click="agregar_item()"
            >
              Generar Liquidación
              <v-icon right dark class="ml-2">mdi-plus-thick</v-icon>
            </v-btn>
            <v-btn
              color="success"
              class="ma-2 white--text"
              large
              depressed
              @click="grabar_liquidacion()"
            >
              Grabar Liquidación
              <v-icon right dark class="ml-2">mdi-content-save-settings</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="form.colabora">
          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field
              label="Fecha Ingreso"
              outlined
              v-model="form.fechaing"
              disabled
              hide-details
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field
              label="Fecha Retiro"
              outlined
              v-model="form.fecharet"
              disabled
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="primary"
              depressed
              @click="dialogoAgregar.estado = true"
              >Agregar Devengo/Descuento
              <v-icon right dark class="ml-2">mdi-plus-thick</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="justify-left mt-5"> </v-row>
        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              :expanded.sync="expanded"
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="5">
              <v-select
                :items="motivos"
                label="Motivo de Liquidación"
                outlined
                clearable
                return-object
                hide-details
                v-model="form.motivo"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="8" sm="12">
              <v-text-field
                label="Observaciones"
                clearable
                outlined
                required
                v-model="form.detalle"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider></v-divider>
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
            >Generar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoModificar.estado" max-width="600" persistent>
      <v-card
        :loading="dialogoModificar.load"
        :disabled="dialogoModificar.load"
      >
        <v-card-title class="headline">Modificar registro</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="dialogoModificar.data.items"
                item-text="descrip_liq"
                item-value="cod_liq"
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
                label="Base"
                outlined
                hide-details
                v-model="dialogoModificar.select.vlrbase_liq"
                v-money="money"
                @change="re_calcular()"
                ref="input_base"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                label="Cantidad"
                outlined
                hide-details
                v-model="dialogoModificar.select.cantidad_liq"
                v-money="money"
                ref="input_cantidad"
                :disabled="dialogoModificar.select.editcant_rep == '0'"
                @change="re_calcular()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <!-- <v-text-field
                label="Valor"
                outlined
                hide-details
                v-model="dialogoModificar.select.valor_rep"
                v-money="money"
                :disabled="dialogoModificar.select.cajacantidad_rep == '0' || dialogoModificar.select.clasifbase_rep == '04' ? false : true"
                ref="input_valor"
              ></v-text-field> -->
              <v-text-field
                label="Valor"
                outlined
                hide-details
                v-model="dialogoModificar.select.valor_liq"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_valor"
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

    <v-dialog v-model="historico.estado" persistent max-width="800">
      <v-card>
        <v-card-title class="headline"> Historico </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers_historico"
            :items="datos_historico"
            class="elevation-1"
          >
            <template v-slot:item.accion="{ item }">
              <v-btn
                fab
                x-small
                depressed
                color="blue darken-1"
                class="white--text text-center"
                @click="consultar_historico(item)"
              >
                <v-icon small>edit</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="historico.estado = false">
            Aceptar
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
      base_liq: 0,
      expanded: [],
      agencias: [],
      ruts3: [],
      contenido: [],
      colaborador: [],
      search: "",
      motivosliq: null,

      form: {},
      motivos: [
        { text: "Terminación de Contrato", value: 1 },
        { text: "Renuncia", value: 2 },
        { text: "Despido sin justa causa", value: 3 },
      ],
      headers_historico: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Nombre", align: "left", value: "nombres_rep" },
        { text: "Acciones", align: "center", value: "accion" },
      ],
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Descripción", align: "left", value: "descrip_liq" },
        { text: "Base", align: "center", value: "vlrbase_liq" },
        { text: "Cantidad", align: "center", value: "cantidad_liq" },
        { text: "Valor", align: "left", value: "valor_liq" },
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
        colabora: false,
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
        data: false,
        index: null,
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
      historico: {
        estado: false,
      },
      datos_historico: [],
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargarcolaborador();
    this.cargarTablaAg();
    this.get_basico();
  },
  methods: {
    consultar_historico(item) {
      this.form.consecutivo = item.nro_rep.trim();
      let key = item.nro_rep.trim();
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      post
        .postData({
          url: "Financiero/dlls/PrGthLiquida01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          let base = data[0].basesliq_rep;
          base.pop();
          this.motivosliq = data[0].motivo_rep;
          this.form.fecha = data[0].fecha_rep;
          let new_data = base.map((el) => {
            return {
              cantidad_liq: el.cantidad_rep,
              cod_liq: el.codigo_rep,
              descrip_liq: el.descripcion_rep.trim(),
              valor_liq: el.valor_rep,
              vlrbase_liq: el.valorbase_rep,
            };
          });

          this.contenido = new_data;
          this.historico.estado = false;
          // console.log("Data", data);
        });
    },
    grabar_liquidacion() {
      var tabla = this.contenido;
      this.get_plano_liquidacion(tabla).then((plano) => {
        var sesion = sessionStorage.Sesion;
        var fecha = this.form.fecha.replace(/\-/g, "");
        var colabora = this.form.colabora.identificacion_rut;
        var consecutivo = this.form.consecutivo;
        var detalle = this.form.detalle;
        var motivo = " ";
        var tipo = "0";

        if (this.motivosliq) {
          motivo = this.motivosliq;
          tipo = "1";
        } else {
          motivo = this.form.motivo.value;
        }
        var datosEnvio =
          sesion +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          colabora +
          "|" +
          motivo +
          "|" +
          detalle +
          "|" +
          plano +
          "|" +
          tipo +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrGthLiquida.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.dialogoModificar.load = false;
            this.contenido = [];

            // this.cancelar_modificar();
          })
          .catch((err) => {
            console.log(err);
            this.dialogoModificar.load = false;
            this.send_error("Ha ocurrido un error al grabar los datos");
          });
      });
    },
    editar_item(data) {
      this.dialogoModificar.estado = true;
      this.dialogoModificar.select = [];
      let index = this.contenido.indexOf(data);
      let data_edit = JSON.parse(JSON.stringify(data));
      this.dialogoModificar.data = data_edit;
      this.dialogoModificar.data.items = [
        {
          ...data_edit,
        },
      ];

      this.base_liq = this.dialogoModificar.data.items[0].vlrbase_liq.replace(
        /\,/g,
        ""
      );

      // this.dialogoModificar.select.vlrbase_liq = this.dialogoModificar.data.items[0].vlrbase_liq.replace(/\,/g, "");
      this.dialogoModificar.index = index;
    },

    re_calcular() {
      let codigo = this.dialogoModificar.select.cod_liq;
      let base = parseFloat(
        this.dialogoModificar.select.vlrbase_liq.replace(/\,/g, "")
      );
      let cantidad = parseFloat(this.dialogoModificar.select.cantidad_liq);
      let valor = parseFloat(
        this.dialogoModificar.select.valor_liq.replace(/\,/g, "")
      );

      if (codigo == 1101) {
        valor = Math.round((base * cantidad) / 360);
      }
      if (codigo == 1102) {
        valor = Math.round(((base * 0.12) / 360) * cantidad);
      }
      if (codigo == 1100) {
        valor = Math.round((base * cantidad) / 360);
      }
      if (codigo == 1102) {
        valor = Math.round((base * cantidad) / 720);
      }
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = valor;
      this.dialogoModificar.select.valor_liq = valor;
    },
    guardar_cambios() {
      let copia = JSON.parse(JSON.stringify(this.dialogoModificar));
      let item = copia.data;
      let nuevo_cantidad = copia.select.cantidad_liq;
      let nuevo_valor = copia.select.valor_liq;
      let nuevo_base = copia.select.vlrbase_liq;

      item.cantidad_liq = nuevo_cantidad;
      item.valor_liq = nuevo_valor;
      item.vlrbase_liq = nuevo_base;

      var contenido_copia = JSON.parse(JSON.stringify(this.contenido));
      contenido_copia[copia.index] = item;

      this.contenido = [];
      this.contenido = contenido_copia;
      this.cancelar_modificar();
    },

    get_plano(items) {
      return new Promise((resolve, reject) => {
        var array = [];

        items.forEach((el) => {
          array.push({
            codigo: el.cod_liq.trim(),
            cantidad: el.cantidad_liq.toString().trim().replace(/\,/g, ""),
            valor: el.valor_liq.toString().trim().replace(/\,/g, ""),
            intereses: "0",
            ccosto: "9999",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "prGenera");
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
    get_plano_liquidacion(items) {
      return new Promise((resolve, reject) => {
        var array = [];
        items.forEach((el) => {
          array.push({
            cantidad_liq: el.cantidad_liq.trim(),
            cod_liq: el.cod_liq.trim(),
            valor_liq: el.valor_liq.trim().replace(/\,/g, ""),
            valorbase_liq: el.vlrbase_liq.trim().replace(/\,/g, ""),
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrGenera_liquida");
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
      var actuales = this.contenido;

      var busqueda = actuales.find((el) => el.cod_liq == nuevo.llavebase_rep);

      if (!busqueda) {
        actuales.push({
          cantidad_liq: "0",
          valor_liq: "0",
          cod_liq: nuevo.llavebase_rep,
          descrip_liq: nuevo.descrbase_rep.trim(),
          vlrbase_liq: "0",
          // clasifbase_rep: nuevo.clasifbase_rep,
          // cajacantidad_rep: nuevo.cajacantidad_rep,
          // cajavlr_rep: nuevo.cajavlr_rep,
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
      this.$refs.input_base.$el.getElementsByTagName("input")[0].value = "0";
    },
    eliminar_devengo() {
      var actual = JSON.parse(JSON.stringify(this.dialogoModificar.data));
      var select = this.dialogoModificar.select;
      var bases = actual;

      var busqueda = bases.findIndex(
        (el) => el.codigo_rep == select.codigo_rep
      );

      if (busqueda >= 0) {
        bases.splice(busqueda, 1);
        this.dialogoModificar.data = actual;
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editarDevengo() {
      var item = this.dialogoModificar.select;

      if (item) {
        var cantidad =
          parseFloat(item.cantidad_liq.toString().replace(/\,/g, "")) || 0;
        var valor =
          parseFloat(item.valor_liq.toString().replace(/\,/g, "")) || 0;

        let base = this.base_liq;

        this.dialogoModificar.select.cantidad_liq = cantidad;
        this.dialogoModificar.select.valor_liq = valor;
        this.dialogoModificar.select.vlrbase_liq = base;

        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          cantidad;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          valor;
        this.$refs.input_base.$el.getElementsByTagName("input")[0].value = base;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_liq = null;
        this.dialogoModificar.select.valor_liq = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
        this.$refs.input_base.$el.getElementsByTagName("input")[0].value = "0";
      }
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (!this.form.colabora.identificacion_rut) {
        this.errores.colabora = true;
        this.send_error("Dato Colaborador Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      var colaborador = data.colabora.identificacion_rut;
      var detalle = data.detalle || "";

      let datos = {
        url: "Financiero/dlls/PrGthGenera3.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          colaborador +
          "|" +
          fecha +
          "|" +
          detalle +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Liquidación Generada correctamente",
            estado: true,
          });
          this.form.consecutivo = parseFloat(data[0].consec_liq);
          this.card_estado = false;
          this.dialogo.estado = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Generar Nueva Liquidación " + this.form.fecha;
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

    get_liquidacion() {
      var colaborador = this.form.colabora.identificacion_rut;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthLiquidaJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            colaborador +
            "|" +
            "0" +
            "|" +
            "0" +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let filtro = data.filter((el) => el.nro_rep.trim());
          this.historico.estado = true;
          this.datos_historico = filtro;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Liquidaciones",
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
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
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
          this.colaborador = JSON.parse(JSON.stringify(data));
          this.get_ruts3();
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

    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    get_ruts3() {
      var _this = this;
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          var filtro = data.filter((el) => {
            let busqueda = _this.colaborador.find(
              (item) => item.idcolabora_rep == el.identificacion_rut
            );

            if (busqueda && parseInt(busqueda.fecharetcolabora_rep) != 0) {
              return true;
            }
            return false;
          });
          this.ruts3 = filtro;
        })
        .catch((err) => {
          console.error(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar colaboradores",
            estado: true,
          });
        });
    },

    montar_fechas() {
      var item = this.form.colabora;
      if (item) {
        var busqueda = this.colaborador.find(
          (el) => el.idcolabora_rep == item.identificacion_rut
        );
        if (busqueda) {
          this.form.fechaing = this.$moment(
            busqueda.fechaingcolabora_rep
          ).format("YYYY-MM-DD");
          this.form.fecharet = this.$moment(
            busqueda.fecharetcolabora_rep
          ).format("YYYY-MM-DD");
        } else {
          this.form.fechaing = null;
          this.form.fecharet = null;
        }
      }
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
