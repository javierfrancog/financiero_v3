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
                >Liquidación de Nómina</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Fecha de Nómina"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="justify-end">
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
            @click="agregar_item()"
          >
            Generar Nómina
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>
          <v-btn
            color="orange"
            class="ma-2 white--text"
            large
            depressed
            @click="agregar_colaborador()"
            :disabled="contenido.length == 0"
          >
            Agregar Colaborador
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>
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
              :expanded.sync="expanded"
              show-expand
              item-key="idnomina_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="orange--text">Base</th> -->
                          <th class="orange--text text-left">Descripción</th>
                          <th class="orange--text text-rigth">C.Costo</th>
                          <th class="orange--text text-left">Cantidad</th>
                          <th class="orange--text text-rigth">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="el in item.basesnomina_rep"
                          :key="el.codigo_rep"
                        >
                          <!-- <td>{{ el.codigo_rep }}</td> -->
                          <td class="text-left">{{ el.descripcion_rep }}</td>
                          <td class="text-left">{{ el.descrccosto_rep }}</td>
                          <td class="text-left">{{ el.cantidad_rep }}</td>
                          <td class="text-center">{{ el.valor_rep }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

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
            <v-col class="d-flex" cols="8" sm="12">
              <v-text-field
                label="Información para desprendibles"
                clearable
                outlined
                required
                v-model="form.informacion"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="cancelar_generar"
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

    <v-dialog v-model="dialogocolaborador.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogocolaborador.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Colaborador"
                v-model="dialogocolaborador.form.colabora"
                :items="ruts3"
                :item-text="format_ruts"
                item-value="identificacion_rut"
                hide-details
                return-object
                outlined
                @change="errores.colabora = false"
                :error="errores.colabora"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" depressed @click="cancelar_colabora"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_colabora()"
            >Agregar</v-btn
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
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="primary"
                depressed
                @click="dialogoAgregar.estado = true"
                >Agregar nuevo</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                label="Devengos / deducciones"
                v-model="dialogoModificar.select"              
                :items="dialogoModificar.data.basesnomina_rep"
                :item-text="format_conceptos"
                item-value="codigo2_rep"
                outlined
                hide-details
                clearable
                return-object
                @change="editarDevengo"
                
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
                type="number"
                ref="input_cantidad"
                :disabled="dialogoModificar.select.editcant_rep == '0'"
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
                v-model="dialogoModificar.select.valor_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_valor"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Centro de costos"
                v-model="dialogoModificar.select.ccostonomina_rep"
                :items="tablaccosto"
                :item-text="format_ccosto"
                item-value="llavecentro_cost"
                hide-details
                outlined
                :error="errores.ccosto"
                @change="errores.ccosto = false"
              ></v-autocomplete>
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
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Centro de costos"
                v-model="dialogoModificar.nuevo_ccosto"
                :items="tablaccosto"
                :item-text="format_ccosto"
                item-value="llavecentro_cost"
                hide-details
                outlined
                :error="errores.ccosto"
                @change="errores.ccosto = false"
              ></v-autocomplete>
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
      tablaccosto: [],
      ruts3: [],
      colaborador: [],
      search: "",
      form: {},
      periodos: [
        { text: "Mensual", value: 1 },
        { text: "1ra Quincena", value: 2 },
        { text: "2da Quincena", value: 3 },
        { text: "Nomina Adicional", value: 4 },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "left", value: "descripagc_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Neto", align: "left", value: "netonomina_rep" },
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
      dialogocolaborador: {
        estado: false,
        titulo: null,
        form: {},
      },
    };
  },
  created() {
    this.cargarTablaAg();
    this.get_basico();
    this.get_ruts3();
    this.get_ccostos();
  },
  methods: {
    get_ccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    guardar_colabora() {
      var colabora = this.dialogocolaborador.form.colabora.identificacion_rut;
      var data = this.form;
      var fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      var periodo = data.periodo.value || "9";

      let datos = {
        url: "Financiero/dlls/PrGthGeneraC.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          periodo +
          "|" +
          colabora +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Colaborador Agregado correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogocolaborador.estado = false;
          // this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },

    guardar_cambios() {
      this.dialogoModificar.load = true;
      var items = this.dialogoModificar.data.basesnomina_rep;
      this.get_plano(items).then((plano) => {
        var sesion = sessionStorage.Sesion;
        var fecha = this.form.fecha;
        var tipo = this.form.periodo.value;
        var idNomina = this.dialogoModificar.data.idnomina_rep;
        var agencia = this.dialogoModificar.data.agencianomina_rep;
        var datosEnvio =
          sesion +
          "|" +
          fecha.replace(/\-/g, "") +
          "|" +
          tipo +
          "|" +
          idNomina +
          "|" +
          agencia +
          "|" +
          plano +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrGthGeneraMCC.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.dialogoModificar.load = false;
            this.cancelar_modificar();
            this.cargarcontenido();
          })
          .catch((err) => {
            console.log(err.Mensaje[0]);
            this.dialogoModificar.load = false;
            this.send_error(err.Mensaje[0]);
          });
      });
    },
    get_plano(items) {
      return new Promise((resolve, reject) => {
        var array = [];

        items.forEach((el) => {
          array.push({
            codigo: el.codigo_rep.substr(0, 4),
            cantidad: el.cantidad_rep
              ? el.cantidad_rep.toString().replace(/\,/g, "")
              : "1",
            valor: el.valor_rep.replace(/\,/g, "").replace(/\-/g, "").trim(),
            intereses: "0",
            ccosto: el.ccostonomina_rep? el.ccostonomina_rep : "1001",
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
    agregar_devengo() {
      var nuevo = this.dialogoModificar.nuevo_devengo;
      let ccosto = this.dialogoModificar.nuevo_ccosto;

      var actuales = this.dialogoModificar.data.basesnomina_rep;

      var busqueda = actuales.find(
        (el) => el.codigo_rep == nuevo.llavebase_rep
      );

      busqueda = "";

      if (!busqueda) {
        actuales.push({
          cantidad_rep: "0",
          valor_rep: "0",
          ccostonomina_rep: ccosto,
          codigo_rep: nuevo.llavebase_rep + ccosto ,
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
        this.dialogoModificar.nuevo_ccosto = null;
        
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
    cancelar_generar() {
      this.dialogo.estado = false;
      this.dialogo.titulo = null;

      this.form.agencia = null;
      this.form.informacion = null;
    },
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
      this.dialogoModificar.data = {};
      this.dialogoModificar.select = {};

      if (this.$refs.input_cantidad)
        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";

      if (this.$refs.input_valor)
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
    },
    cancelar_colabora() {
      this.dialogocolaborador.estado = false;
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

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editarDevengo() {
      var item = this.dialogoModificar.select;
      if (item) {

        var cantidad =
          parseFloat(item.cantidad_rep.toString().replace(/\,/g, "")) || 0;
        var valor =
          parseFloat(item.valor_rep.toString().replace(/\,/g, "")) || 0;

        this.dialogoModificar.select.cantidad_rep = cantidad;
        this.dialogoModificar.select.valor_rep = valor;
        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          cantidad;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          valor;
        var busqueda_costo = this.tablaccosto.find(
          (el) => el.llavecentro_cost == item.ccostonomina_rep
        );
        this.form.ccosto = busqueda_costo;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;
        this.dialogoModificar.select.ccostonomina_rep = null;        

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editar_item(data) {
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = JSON.parse(JSON.stringify(data));
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (!data.agencia) {
        this.errores.agencia = true;
        this.send_error("Agencia Obligatoria!");
      } else if (!data.periodo.value) {
        this.errores.periodo = true;
        this.send_error("Tipo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      var agencia = data.agencia.codigo_agc || "0";
      var periodo = data.periodo.value || "9";
      var detalle = data.detalle || "";

      let datos = {
        url: "Financiero/dlls/PrGthGenera.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          fecha +
          "|" +
          periodo +
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
            text: "Nómina Generada correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          // this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo =
        "Generar " + this.form.periodo.text + " " + this.form.fecha;
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    agregar_colaborador() {
      this.form.colaborador = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogocolaborador.titulo =
        "Agregar Colaborador " + this.form.periodo.text + " " + this.form.fecha;
      this.dialogocolaborador.estado = true;
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
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.form.periodo.value || "0";
      var agencia = this.form.agencia.codigo_agc;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthGeneraJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            periodo +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data = data.filter((el) => el.idnomina_rep);
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Nóminas",
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
          this.agencias.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas las Agencias",
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

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar colaboradores",
            estado: true,
          });
        });
    },

    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_conceptos: function (val) {
      return `${val.descripcion_rep} - C.Costo:${val.ccostonomina_rep}`;
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