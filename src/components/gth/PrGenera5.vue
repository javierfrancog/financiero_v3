<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-island</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Vacaciones Colaborador
              </v-list-item-title>
            </v-list-item-content>
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
                ></v-date-picker>
              </v-menu>
            </v-col>
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

        <v-row class="d-flex ml-1 mb-3">
          <v-col class="d-flex" cols="6">
            <v-autocomplete
              label="Colaborador"
              v-model="form.colabora"
              :items="colaborador"
              :item-text="format_colabora"
              item-value="identificacion_rut"
              clearable
              hide-details
              return-object
              outlined
              :error="errores.colabora"
              @change="montar_fechas()"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="form.colabora" class="justify-end" cols="12" sm="2">
            <v-text-field
              label="Fecha Ingreso"
              outlined
              v-model="form.fechaing"
              disabled
              hide-details
            ></v-text-field>
          </v-col>

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
          </v-col>
        </v-row>
        <v-row> </v-row>

        <!-- <v-divider color="#FF6F00"></v-divider> -->

        <v-row
          v-if="form.colabora"
          class="ml-2 mr-2 mt-2"
          style="border: 1px solid #ff6f00; border-radius: 5px"
        >
          <v-col cols="6">
            <v-row>
              <v-col class="text-center">
                <h3>Periodo Liquidado</h3>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col class="d-flex" cols="4" sm="3">
                <v-text-field
                  v-model="form.perinicio"
                  label="Inicial"
                  type="date"
                  hide-details
                  @change="calcular_liquida()"
                  :error="errores.perinicio"
                  @input="errores.perinicio = false"
                ></v-text-field>
              </v-col> -->

              <v-col class="d-flex" cols="4">
                <v-menu
                  v-model="Picker_perini"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      @change="errores.perinicio = false"
                      :error="errores.perinicio"
                      v-model="form.perinicio"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.perinicio"
                    @change="
                      Picker_perini = false;
                      calcular_liquida();
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- <v-col class="d-flex" cols="4" sm="3">
                <v-text-field
                  v-model="form.perfinal"
                  label="Final"
                  type="date"
                  hide-details
                  @change="calcular_liquida()"
                  :error="errores.perfinal"
                  @input="errores.perfinal = false"
                ></v-text-field>
              </v-col> -->

              <v-col class="d-flex" cols="4">
                <v-menu
                  ref="menu"
                  v-model="Picker_perfin"
                  transition="scale-transition"
                  offset-y
                  :close-on-content-click="false"
                  min-width="290px"
                  max-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Final"
                      outlined
                      v-model="form.perfinal"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.perfinal"
                    @change="
                      Picker_perfin = false;
                      calcular_liquida();
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex ml-5" cols="3">
                <v-text-field
                  label="Dias a Liquidar"
                  disabled
                  hide-details
                  v-model="form.diasxliq"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col class="text-center">
                <h3>Periodo Salida a Vacaciones</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-menu
                  ref="menu"
                  v-model="Picker_persal"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha de Salida"
                      outlined
                      v-model="form.persalida"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.persalida"
                    @change="
                      Picker_persal = false;
                      calcular_vacac();
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-menu
                  ref="menu"
                  v-model="Picker_perent"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha de Retorno"
                      outlined
                      v-model="form.perentrada"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.perentrada"
                    @change="
                      Picker_perent = false;
                      calcular_vacac();
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  label="Dias Vacaciones"
                  outlined
                  disabled
                  hide-details
                  v-model="form.diasliq"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="form.colabora" class="d-flex ml-1">
          <v-col sm="2">
            <v-text-field
              label="Dias_Pag_Tiempo"
              outlined
              hide-details
              v-model="form.diastiempo"
              @input="dias_pagados()"
            ></v-text-field>
          </v-col>
          <v-col sm="2">
            <v-text-field
              label="Dias_Pag_Dinero"
              outlined
              hide-details
              v-model="form.diasdinero"
              @input="dias_pagados()"
            ></v-text-field>
          </v-col>
          <v-col sm="2">
            <v-text-field
              label="Total Dias"
              outlined
              hide-details
              v-model="form.diaspag"
              disabled
            ></v-text-field>
          </v-col>

          <v-col sm="2">
            <v-text-field
              label="Base Manual"
              outlined
              hide-details
              v-model="form.base"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="form.colabora" class="d-flex ml-1">
          <v-btn
            color="orange"
            class="ma-2 white--text"
            large
            depressed
            @click="generar_liquidacion()"
          >
            Generar Liquidación
            <v-icon right dark class="ml-2">mdi-content-save-settings</v-icon>
          </v-btn>

          <v-btn
            color="success"
            class="ma-2 white--text"
            large
            depressed
            @click="guardar()"
            v-if="contenido.length"
          >
            Grabar Vacaciones
            <v-icon right dark class="ml-2">mdi-content-save-settings</v-icon>
          </v-btn>

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

        <v-row class="justify-left"> </v-row>
        <v-divider color="#FF6F00" class="d-flex mt-2"></v-divider>
        <div class="pa-0 px-8 mt-2"  >
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
                label="Cantidad"
                outlined
                hide-details
                v-model="dialogoModificar.select.cantidad_liq"
                v-money="money"
                ref="input_cantidad"
                :disabled="dialogoModificar.select.editcant_rep == '0'"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
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
          <v-btn color="green darken-1" text @click="cerrar_historico()">
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
      Picker_perini: false,
      Picker_perfin: false,
      Picker_perent: false,
      Picker_persal: false,

      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      ruts3: [],
      contenido: [],
      colaborador: [],
      search: "",
      motivosliq: null,
      proceso: 0,
      modificar: 0,

      form: {},
      motivos: [
        { text: "Terminación de Contrato", value: 1 },
        { text: "Renuncia", value: 2 },
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
    this.get_consecutivo();
    this.cargarcolaborador();
    this.cargarTablaAg();
    this.get_basico();
    this.modificar = 0;
  },
  methods: {
    consultar_historico(item) {
      this.modificar = 1;
      this.form.consecutivo = item.nro_rep.trim();
      let key = item.nro_rep.trim();
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      post
        .postData({
          url: "Financiero/dlls/PrGthVacacion01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          let base = data[0].basesvac_rep;
          base.pop();
          let new_data = base.map((el) => {
            return {
              cantidad_liq: el.cantidad_rep,
              cod_liq: el.codigo_rep,
              descrip_liq: el.descripcion_rep.trim(),
              valor_liq: el.valor_rep,
              vlrbase_liq: el.valorbase_rep,
            };
          });
          this.proceso = 1;
          this.form.consecutivo = data[0].nro_rep;
          this.form.perinicio = data[0].perini_rep;
          this.form.perfinal = data[0].perfin_rep;
          this.form.diasxliq = data[0].diasxliq_rep;
          this.form.persalida = data[0].persal_rep;
          this.form.perentrada = data[0].perent_rep;
          this.form.diasliq = data[0].diasliq_rep;
          this.form.diastiempo = data[0].diastiempo_rep;
          this.form.diasdinero = data[0].diasdinero_rep;
          let total = data[0].diasdinero_rep + data[0].diastiempo_rep;
          this.form.diaspag = total;
          this.contenido = new_data;
          this.historico.estado = false;
        });
    },
    get_consecutivo() {
      var $this = this;
      post
        .postData({
          url: "financiero/dlls/PrGthVacacionN.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.consecutivo = data[0].nro;
        })
        .catch((err) => {
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },

    generar_liquidacion() {
      this.get_consecutivo();
      var sesion = sessionStorage.Sesion;
      var diastiempo = this.form.diastiempo || "0";
      var diasdinero = this.form.diasdinero || "0";
      var diasliq = this.form.diasliq || "0";

      var colabora = this.form.colabora.idcolabora_rep;
      let base = this.form.base || "0";
      var datosEnvio =
        sesion +
        "|" +
        colabora +
        "|" +
        diastiempo +
        "|" +
        diasdinero +
        "|" +
        diasliq +
        "|" +
        base +
        "|";
      post
        .postData({
          url: "Financiero/dlls/PrGthLVacacion.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.dialogoModificar.load = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.dialogoModificar.load = false;
          this.send_error(err.Mensaje[0].msg);
        });
    },
    guardar_cambios() {
      let copia = JSON.parse(JSON.stringify(this.dialogoModificar));
      let item = copia.data;
      let nuevo_cantidad = copia.select.cantidad_liq;
      let nuevo_valor = copia.select.valor_liq;

      item.cantidad_liq = nuevo_cantidad;
      item.valor_liq = nuevo_valor;

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

        this.dialogoModificar.select.cantidad_liq = cantidad;
        this.dialogoModificar.select.valor_liq = valor;
        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          cantidad;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          valor;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_liq = null;
        this.dialogoModificar.select.valor_liq = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editar_item(data) {
      this.modificar = 1;
      this.dialogoModificar.estado = true;
      let index = this.contenido.indexOf(data);
      let data_edit = JSON.parse(JSON.stringify(data));
      this.dialogoModificar.data = data_edit;
      this.dialogoModificar.data.items = [
        {
          ...data_edit,
        },
      ];
      this.dialogoModificar.index = index;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (!this.form.colabora.idcolabora_rep) {
        this.errores.colabora = true;
        this.send_error("Dato Colaborador Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      let consecutivo = data.consecutivo.trim();
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let colaborador = data.colabora.idcolabora_rep;
      let per_inicial = data.perinicio ? data.perinicio.replace(/\-/g, "") : "";
      let per_final = data.perfinal ? data.perfinal.replace(/\-/g, "") : "";
      let diasxliq = this.form.diasxliq;
      let fecha_sal = data.persalida ? data.persalida.replace(/\-/g, "") : "";
      let fecha_ent = data.perentrada ? data.perentrada.replace(/\-/g, "") : "";
      let diasliq = this.form.diasliq;
      let diastiempo = this.form.diastiempo || 0;
      let diasdinero = this.form.diasdinero || 0;
      let detalle = data.detalle || "";
      let tipo = this.modificar;

      let tablajson = {};
      this.contenido.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        tablajson[`DATOJ-${format_index}`] = `${item.cod_liq}|${
          item.cantidad_liq
        }|${item.valor_liq.replace(/\,/g, "")}|${item.vlrbase_liq.replace(
          /\,/g,
          ""
        )}|`;
      });

      let importarhtml =
        sessionStorage.Sesion +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        colaborador +
        "|" +
        per_inicial +
        "|" +
        per_final +
        "|" +
        diasxliq +
        "|" +
        fecha_sal +
        "|" +
        fecha_ent +
        "|" +
        diasliq +
        "|" +
        diastiempo +
        "|" +
        diasdinero +
        "|" +
        detalle +
        "|" +
        tipo +
        "|";
      let datos = {
        url: "Financiero/dlls/PrGthVacacion.dll",
        data: { importarhtml, ...tablajson },
        method: "",
        json: true,
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Liquidación Generada correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.modificar = 0;
          this.get_consecutivo();
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
      var colaborador = this.form.colabora.idcolabora_rep;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthVacacionJ.dll",
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
          data.pop();
          this.colaborador = JSON.parse(JSON.stringify(data));
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

    format_colabora(val) {
      return `${
        parseInt(val.idcolabora_rep) || 0
      } - ${val.Apellido1colabora_rep.trim()} 
         ${val.nombrescolabora_rep.trim()}`;
    },
    calcular_liquida() {
      console.log(this.form);
      var sesion = sessionStorage.Sesion;
      var colaborador = this.form.colabora.idcolabora_rep;

      var fechaInicial = this.form.perinicio.replace(/\-/g, "");
      var fechaFinal = this.form.perfinal.replace(/\-/g, "");

      var datosEnvio =
        sesion +
        "|" +
        colaborador +
        "|" +
        fechaInicial +
        "|" +
        fechaFinal +
        "|";
      post

        .postData({
          url: "Financiero/dlls/PrGthdiasTJ.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
          this.form.diasxliq = parseFloat(data[0].nro);
        })
        .catch((err) => {
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
          this.send_error("Error al calcular dias");
        });
    },

    Xcalcular_liquida() {
      let fecha_inicial = this.form.perinicio.replace(/\-/g, "");
      let anoini = fecha_inicial.substr(0, 4);
      let mesini = fecha_inicial.substr(4, 2);
      let diaini = fecha_inicial.substr(6, 2);
      let diasini =
        parseFloat((anoini * 365).toFixed(0)) +
        parseFloat((mesini * 30).toFixed(0)) +
        parseFloat(diaini);

      let fecha_final = this.form.perfinal.replace(/\-/g, "");
      let anofin = fecha_final.substr(0, 4);
      let mesfin = fecha_final.substr(4, 2);
      let diafin = fecha_final.substr(6, 2);
      let diasfin =
        parseFloat((anofin * 365).toFixed(0)) +
        parseFloat((mesfin * 30).toFixed(0)) +
        parseFloat(diafin);
      diasfin = ((diasfin - diasini) * 0.0411).toFixed(0);
      this.form.diasxliq = diasfin;

      // let fecha_final = this.form.perfinal;

      // if (fecha_inicial && fecha_final) {
      //   let inicial = this.$moment(fecha_inicial);
      //   let final = this.$moment(fecha_final);

      //   let diff = (final.diff(inicial, "days") * 0.0411).toFixed(0);

      //   this.form.diasxliq = diff;
      // } else {
      //   this.form.diasxliq = 0;
      // }
    },
    calcular_vacac() {
      let fecha_inicial = this.form.persalida;
      let fecha_final = this.form.perentrada;

      if (fecha_inicial && fecha_final) {
        let inicial = this.$moment(fecha_inicial);
        let final = this.$moment(fecha_final);

        let diff = final.diff(inicial, "days");
        this.form.diasliq = diff;
      } else {
        this.form.diasliq = 0;
      }
    },
    dias_pagados() {
      let diastiempo = this.form.diastiempo || 0;
      let diasdinero = this.form.diasdinero || 0;
      let diasliq = this.form.diasxliq || 0;
      let total = parseInt(diastiempo) + parseInt(diasdinero);

      if (parseInt(total) != parseInt(diasliq)) {
        this.$emit("snack", {
          color: "error",
          text: "Dias pagados diferente a los Liquidados! " + total,
          estado: true,
        });
      }

      this.form.diaspag = total || 0;
    },
    montar_fechas() {
      var item = this.form.colabora;
      if (item) {
        this.form.fechaing = this.$moment(item.fechaingcolabora_rep).format(
          "YYYY-MM-DD"
        );
      }
    },
    cerrar_historico() {
      this.historico.estado = false;
      this.proceso = 0;
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
