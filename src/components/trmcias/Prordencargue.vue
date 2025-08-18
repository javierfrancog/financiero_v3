<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-fire-truck</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Orden de Cargue</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="mt-1 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Nueva Orden
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
          <v-row>
            <v-col cols="4" class="d-flex">
              <v-menu
                v-model="pickerFechaini"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaini"
                    label="Buscar desde:"
                    append-icon="event"
                    outlined
                    hide-details
                    :error="errores.fechaini"
                    @input="errores.fechaini = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="form.activacion"
                  v-model="form.fechaini"
                  @input="
                    pickerFechaini = false;
                    errores.fechaini = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-btn
                color="indigo"
                class="white--text mr-3 mt-2"
                large
                depressed
                @click="cargarcontenido(false)"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" md="6">
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
              class="elevation-1"
            >
              <template v-slot:item.nro_rep="{ item }">
                {{ parseFloat(item.nro_rep) }}
              </template>

              <template v-slot:item.ordenservic_rep="{ item }">
                {{ parseFloat(item.ordenservic_rep) }}
              </template>

              <!-- <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      class="mr-2"
                      icon
                      depressed
                      v-on="on"
                      @click="imprimir(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
                </v-tooltip>
              </template> -->
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
          <v-row class="d-flex justify-end">
            <v-col cols="4" class="d-flex">
              <v-menu
                v-model="pickerFecha"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha"
                    label="Fecha"
                    append-icon="event"
                    hide-details
                    :error="errores.fecha"
                    @input="errores.fecha = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="form.activacion"
                  v-model="form.fecha"
                  @input="
                    pickerFecha = false;
                    errores.fecha = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="3" class="justify-end d-flex align-center">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                disabled
                hide-details
                filled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="3">
              <v-autocomplete
                label="Vehiculo"
                :items="placas"
                clearable
                :item-text="format_placas"
                v-model="form.vehiculo"
                @change="asignar_conductor()"
                :error="errores.vehiculo"
                @input="errores.vehiculo = false"
                hide-details
                item-value="value"
                return-object
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="5">
              <v-autocomplete
                :items="conductores"
                label="Conductor"
                clearable
                :item-text="format_conductores"
                hide-details
                v-model="form.conductor"
                item-value="value"
                return-object
                :error="errores.conductor"
                @change="errores.conductor = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Propietario"
                disabled
                v-model="form.propietario"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="5">
              <v-autocomplete
                :items="clientes"
                label="Cliente"
                clearable
                :item-text="format_conductores"
                v-model="form.cliente"
                hide-details
                item-value="value"
                return-object
                :error="errores.cliente"
                @change="get_ordenes(), (errores.cliente = false)"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                :items="ordenes"
                label="Nro. Orden"
                clearable
                :item-text="format_ordenes"
                hide-details
                v-model="form.orden"
                item-value="value"
                return-object
                :error="errores.orden"
                @input="errores.orden = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="d-flex">
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Valor Tonelada"
                v-model="form.vlrtonelada"
                hide-details
                type="number"
                @change="errores.vlrtonelada = false"
                :error="errores.vlrtonelada"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                :items="[
                  { text: 'Contado', value: 1 },
                  { text: 'Crédito', value: 2 },
                ]"
                label="Forma de pago"
                hide-details
                v-model="form.fpago"
                @change="errores.fpago = false"
              ></v-select>
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
            class="ma-2 white--text"
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
import { ordenCombustible } from "../../_formatos_trans";


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
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      pickerFecha: false,
      pickerFechaini: false,
      pickerHora: false,

      placas: [],
      conductores: [],
      clientes: [],
      ordenes: [],
      tipocombustible: [
        { text: "A.C.P.M.", value: 2 },
        { text: "Gasolina", value: 1 },
        { text: "Gas", value: 3 },
        { text: "Otros", value: 4 },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      expanded: [],
      contenido: [],
      datosEmpresa: [],

      search: "",
      form: {
        vehiculo: null,
        conductor: null,
        cliente: null,
        orden: null,
        cmanual: null,
        valor: null,
        consecutivo: 0,
        vlrtonelada: 0,
        fpago: null,
      },

      headers: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Vehículo", align: "center", value: "placa_rep" },
        { text: "Conductor", align: "left", value: "nombre_conductor" },
        { text: "Cliente", align: "left", value: "nombre_cliente" },
        { text: "Nro Orden", align: "center", value: "ordenexterna_rep" },
        { text: "Valor Tonelada", align: "center", value: "vlrton_rep" },
        { text: "Forma de Pago", align: "center", value: "fpago_rep" },

        { text: "Opciones", align: "center", value: "action" },
      ],
      errores: {
        fpago: false,
        vlrtonelada: false,
      },
      vehiculo: null,
      conductor: null,
      cliente: null,
      orden: null,
      cmanual: null,
      valor: null,
      card_estado: false,
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-01");
    this.form.fechaini = this.$moment().format("YYYY-MM-01");
    this.get_empresa();
    this.get_placas();
    this.cargarRuts();
    this.get_Clientes();
  },
  methods: {
    async get_empresa() {
      await post
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
    imprimir(item) {
      let numero = item.nro_rep;
      this.loader = true;
      post
        .postData({
          url: "Trmcias/dlls/PrOrdencombJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|" + numero + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let data_impresion = data[0];
          let empresa = this.datosEmpresa;

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            correo: empresa.email_empr,
            telefono: empresa.telefono_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          data_impresion.fecha = this.form.fechaini;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            ordenCombustible(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    cargarRuts() {
      this.loader = true;
      post
        .postData({
          url: "TrMcias/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|" + "7" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.conductores = JSON.parse(JSON.stringify(data));
          this.conductores.pop();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    get_placas() {
      this.loader = true;
      post
        .postData({
          url: "Trmcias/dlls/CfvehiculoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.placas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    asignar_conductor() {
      let idconductor = parseFloat(this.form.vehiculo.idcond_rep);
      let busqueda_select = this.conductores.find(
        (el) => parseFloat(el.identificacion_rut) == idconductor
      );
      this.form.conductor = busqueda_select;
      this.form.propietario = this.form.vehiculo.propietario_rep.trim();
    },
    format_placas: function (val) {
      return `${val.placa_rep.trim()}`;
    },
    format_conductores: function (val) {
      return `${val.descripcion_rut.trim()}`;
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));


      console.log(data);
      if (!data.vehiculo) {
        this.errores.vehiculo = true;
        this.send_error("Debe seleccionar una placa");
      } else if (!data.conductor) {
        this.errores.conductor = true;
        this.send_error("Debe seleccionar un conductor");
      } else if (!data.cliente) {
        this.errores.cliente = true;
        this.send_error("Debe seleccionar un cliente");
      } else if (!data.orden) {
        this.errores.orden = true;
        this.send_error("Debe seleccionar un numero de orden");
      } else if (!data.vlrtonelada) {
        this.errores.vlrtonelada = true;
        this.send_error("Debe registrar un valor por tonelada");
      } else if (!data.fpago) {
        this.errores.fpago = true;
        this.send_error("Debe seleccionar una forma de pago");
      } else this.format_envio(data);
    },

    format_envio(data) {
      this.card_estado = true;
      let consecutivo = data.consecutivo;
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let placa = data.vehiculo.placa_rep;
      let conductor = parseFloat(data.conductor.identificacion_rut);
      let cliente = parseFloat(data.cliente.identificacion_rut);
      let nroorden = parseFloat(data.orden.numero_fact);
      let nroordenext = data.orden.orden_fact;
      let vlrtonelada = parseFloat(data.vlrtonelada);
      let fpago = data.fpago;
      let datos = {
        url: "/Trmcias/dlls/PrOrdCargue.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          placa +
          "|" +
          conductor +
          "|" +
          cliente +
          "|" +
          nroorden +
          "|" +
          nroordenext +
          "|" +
          vlrtonelada +
          "|" +
          fpago +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((dataDLL) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarcontenido(true);
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    get_consec() {
      post
        .postData({
          url: "Trmcias/dlls/PrOrdenCargN.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.consecutivo = data[0].msg;
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
    agregar_item() {
      this.init_form();
      // this.form.estado = true;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.form.fecha = this.form.activacion;
      this.dialogo.titulo = "Nueva Orden";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.get_consec();
    },
    init_form() {
      this.form.consecutivo = null;
      this.form.vehiculo = null;
      this.form.conductor = null;
      this.form.propietario = null;
      this.form.cliente = null;
      this.form.orden = null;
      this.errores = {
        tipo: false,
        origen: false,
        destino: false,
        hora: false,
        vehiculo: false,
        conductor: false,
      };
    },
    cargarcontenido() {
      let fecha = "";
      if (this.form.fechaini) {
        this.loader = true;
        fecha = this.form.fechaini.replace(/\-/g, "");
        post
          .postData({
            url: "/Trmcias/dlls/PrOrdCarg01J.dll",
            data: sessionStorage.Sesion + "|" + "1" + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Ordenes",
              estado: true,
            });
          });
      } else {
        this.send_error("Debe seleccionar una fecha");
      }
    },
    get_ordenes() {
      this.ordenes = [];
      var cliente = this.form.cliente.identificacion_rut;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = `${sessionStorage.Sesion}|0|${cliente}|${fecha}|`;
      post
        .postData({
          url: "Trmcias/dlls/PrPedido02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((res) => {
          this.ordenes = res;
        });
    },
    format_ordenes: function (val) {
      return `${val.orden_fact.trim()} - ${val.fecha_fact}`;
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })

        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
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
