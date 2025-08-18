<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-dump-truck</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Remision de Mercancías</v-list-item-title
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
                Nueva Remisión
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
                @click="cargarcontenido()"
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

              <template v-slot:item.orden_fact="{ item }">
                {{ parseFloat(item.orden_fact) }}
              </template>

              <template v-slot:item.action="{ item }">
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
                @change="get_cargue()"
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
                @change="asignar_telefono(), (errores.conductor = false)"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Telefono"
                v-model="form.telefono"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                :items="cargues"
                label="Nro. Cargue"
                clearable
                :item-text="format_cargues"
                hide-details
                v-model="form.cargue"
                item-value="value"
                return-object
                :error="errores.orden"
                @change="get_ordenes(), (errores.orden = false)"
              ></v-autocomplete>
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
                disabled
                :error="errores.cliente"
                @change="errores.cliente = false"
              ></v-autocomplete>
            </v-col>
            <v-col cols="3">
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
                @change="select_orden()"
                @input="errores.orden = false"
              ></v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-autocomplete
                :items="productos"
                label="Producto"
                clearable
                :item-text="format_productos"
                hide-details
                v-model="form.producto"
                item-value="value"
                return-object
                :error="errores.producto"
                @change="select_producto(), (errores.producto = false)"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Origen"
                v-model="form.origen"
                :items="list_origen"
                :item-text="format_origen"
                hide-details
                return-object
                clearable
                outlined
                @change="errores.origen = false"
                :error="errores.origen"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Destino"
                v-model="form.destino"
                :items="list_destino"
                :item-text="format_destino"
                hide-details
                return-object
                clearable
                outlined
                @change="errores.destino = false"
                :error="errores.destino"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Orden compra"
                clearable
                v-model="form.ordexterna"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Remesa"
                v-model="form.remesa"
                type="number"
                @change="errores.remesa = false"
                :error="errores.remesa"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Consecutivo"
                v-model="form.consec_remesa"
                hide-details
                @change="errores.consec_remesa = false"
                :error="errores.consec_remesa"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="kilos Remesa"
                v-model="form.kgremesa"
                type="number"
                hide-details
                @change="errores.kgremesa = false"
                :error="errores.kgremesa"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Anticipos"
                v-model="form.anticipos"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Combustibles"
                clearable
                required
                disabled
                v-model="form.combustible"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Volumen Cargue"
                clearable
                outlined
                required
                v-model="form.volumen"
                :error="errores.volumen"
                @input="errores.volumen = false"
                hide-details
              ></v-text-field>
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
import { remision } from "../../_formatos_trans";


export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      rcanticipo: null,
      rccombust: null,

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

      tipos: [
        { text: "1. Despacho S.A.R", value: 1 },
        { text: "2. Orden de salida", value: 2 },
        { text: "3. Solo despacho", value: 3 },
      ],
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
      productos: [],
      list_origen: [],
      list_destino: [],
      cargues: [],

      search: "",
      form: {
        fecha_ini: this.$moment().format("YYYY-MM-01"),
        vehiculo: null,
        conductor: null,
        cliente: null,
        orden: null,
        cmanual: null,
        valor: null,
        consecutivo: 0,
        fecha: null,
        producto: null,
        remesa: null,
        consec_remesa: null,
        kgremesa: null,
      },

      headers: [
        { text: "Consecutivo", align: "center", value: "numero_fact" },
        { text: "Cliente", align: "left", value: "cliente_fact" },
        { text: "Vehículo", align: "left", value: "placa_fact" },
        { text: "Conductor", align: "left", value: "conductor_fact" },
        { text: "Orden Cliente", align: "left", value: "ordencliente_fact" },
        { text: "Nro Solicitud", align: "center", value: "orden_fact" },
        { text: "Opciones", align: "center", value: "action" },
      ],
      errores: {
        vehiculo: null,
        conductor: null,
        cliente: null,
        orden: null,
        cmanual: null,
        volumen: null,
        producto: false,
        origen: false,
        destino: false,
        remesa: false,
        consec_remesa: false,
        kgremesa: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-01");
    this.form.fechaini = this.$moment().format("YYYY-MM-01");
    this.get_placas();
    this.cargarRuts();
    this.get_origen();
    this.get_destino();
    this.get_Clientes();
  },
  methods: {
    get_origen() {
      this.loader = true;
      post
        .postData({
          url: "Trmcias/dlls/CfEmbarquesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.list_origen = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Embarques",
            estado: true,
          });
        });
    },
    get_destino() {
      this.loader = true;
      post
        .postData({
          url: "Trmcias/dlls/CfEmbarquesJ.dll",
          data: sessionStorage.Sesion + "|" + 2 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.list_destino = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Embarques",
            estado: true,
          });
        });
    },
    imprimir(item) {
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        parseFloat(item.numero_fact) +
        "|" +
        fecha +
        "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;

      this.loader = true;
      post
        .postData({
          url: "TrMcias/dlls/PrRemision01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader = false;

          let data_impresion = data[0];
          data_impresion.productos = data_impresion.productos.map((item) => {
            try {
              const decoded = atob(item.nombre_servicio);
              const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
              item.nombre_servicio = new TextDecoder("utf-8").decode(bytes);
            } catch (e) {
              console.warn("Error al decodificar:", item.nombre_servicio, e);
            }
            return item;
          });
          let descripcion64 = " ";

          data_impresion.fecha = this.form.fecha_ini;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            remision(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err)
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Remision",
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
    select_producto() {
      let busqueda = this.list_origen.find(
        (el) => el.codigo_rep == this.form.producto.codorigen_fact
      );
      this.form.origen = busqueda;

      busqueda = this.list_destino.find(
        (el) => el.codigo_rep == this.form.producto.coddestino_fact
      );
      this.form.destino = busqueda;
    },
    select_orden() {
      let fecha = this.form.orden.fecha_fact.replace(/-/g, "").substr(0, 4);
      let consecutivo = this.form.orden.numero_fact;
      this.get_pedido(fecha, consecutivo);
    },
    get_pedido(fecha, consecutivo) {
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        "0001" +
        "|" +
        "0001" +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Trmcias/dlls/PrPedido01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let data_parse = JSON.parse(JSON.stringify(data[0].productos));
          data_parse.map((el, index) => {
            if (!el.base1_pr == "") {
              el.nombre_servicio = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim()
              );
            } else {
              el.nombre_servicio = window.atob(el.nombre_servicio);
            }
            el.index = index;
            return el;
          });

          this.productos = data_parse;
          this.form.ordexterna = data[0].ordcompra;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al consultar pedido");
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
      this.form.anticipos = 0;
      this.form.combustible = 0;
      this.form.conductor = busqueda_select;

      this.get_info_vehiculo();
    },
    get_info_vehiculo() {
      let placa = this.form.vehiculo.placa_rep;
      // let orden = parseFloat(this.form.orden.numero_fact);
      // let fecha = this.form.orden.fecha_fact.replace(/-/g, "");
      post
        .postData({
          url: "Trmcias/dlls/PrvehiculoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            placa +
            "|" +
            orden +
            "|",
          method: "POST",
        })
        .then((data) => {
          let anticipos = data[0].totalant_rep.trim();
          let combustible = data[0].totalcomb_rep.trim();
          this.form.anticipos = anticipos;
          this.form.combustible = combustible;
          this.rcanticipo = data[0].nrorecant_rep.trim();
          this.rccombust = data[0].nrorecomb_rep.trim();
        })
        .catch((err) => {
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar vehiculso" + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    format_placas: function (val) {
      return `${val.placa_rep.trim()}`;
    },
    format_conductores: function (val) {
      return `${val.descripcion_rut.trim()}`;
    },
    get_cargue() {
      this.cargues = [];
      this.form.conductor = null;
      this.form.telefono = null;
      this.form.cargue = null;
      let placa = this.form.vehiculo.placa_rep;

      var datosEnvio = `${sessionStorage.Sesion}|${placa}|`;
      post
        .postData({
          url: "Trmcias/dlls/PrOrdCarg02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((res) => {
          this.cargues = JSON.parse(JSON.stringify(res));
          this.cargues.pop();
          this.asignar_conductor();
        });
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.cliente) {
        this.errores.cliente = true;
        this.send_error("Debe seleccionar un cliente");
      } else if (!data.orden) {
        this.errores.orden = true;
        this.send_error("Debe seleccionar un numero de orden");
      } else if (!data.producto) {
        this.errores.producto = true;
        this.send_error("Debe seleccionar un producto");
      } else if (!data.origen) {
        this.send_error("Ingresa un punto de origen");
        this.errores.origen = true;
      } else if (!data.destino) {
        this.errores.destino = true;
        this.send_error("Ingresa un punto de destino");
      } else if (!data.remesa) {
        this.errores.remesa = true;
        this.send_error("Debe registrar el campo Remesa");
      } else if (!data.consec_remesa) {
        this.errores.consec_remesa = true;
        this.send_error("Debe registrar el consecutivo de Remesa");
      } else if (!data.kgremesa) {
        this.errores.kgremesa = true;
        this.send_error("Debe registrar los kilos de la remesa");
      } else if (!data.vehiculo) {
        this.errores.vehiculo = true;
        this.send_error("Debe seleccionar una placa");
      } else if (!data.conductor) {
        this.errores.conductor = true;
        this.send_error("Debe seleccionar un conductor");
      } else if (!data.volumen) {
        this.errores.volumen = true;
        this.send_error("Debe registrar una cantidad");
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
      let volumen = data.volumen.trim();
      let anticipos = data.anticipos ? data.anticipos.replace(/\,/g, "") : "0";
      let combustible = data.combustible
        ? data.combustible.replace(/\,/g, "")
        : "0";
      let producto = data.producto.codigo;
      let origen = data.origen.codigo_rep;
      let destino = data.destino.codigo_rep;
      let ordenserv = data.ordexterna;
      let remesa = data.remesa;
      let consec_remesa = data.consec_remesa;
      let kgremesa = data.kgremesa;
      let cargue = data.cargue.nro_rep;
      let pedido = parseFloat(data.cargue.ordenservic_rep);

      let datos = {
        url: "/Trmcias/dlls/PrRemision.dll",
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
          anticipos +
          "|" +
          combustible +
          "|" +
          volumen +
          "|" +
          producto +
          "|" +
          origen +
          "|" +
          destino +
          "|" +
          ordenserv +
          "|" +
          1 +
          "|" +
          1 +
          "|" +
          remesa +
          "|" +
          consec_remesa +
          "|" +
          kgremesa +
          "|" +
          cargue +
          "|" +
          pedido +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((datos) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarcontenido();
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
          url: "Trmcias/dlls/PrRemisionN.dll",
          data: sessionStorage.Sesion + "|",
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
      this.form.hora = this.$moment().format("HH:mm");
      this.dialogo.titulo = "Nueva Remisión";
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
      this.form.cmanual = null;
      this.form.valor = null;
      this.form.cargue = null;
      this.form.producto = null;
      this.form.origen = null;
      this.form.destino = null;
      this.form.ordexterna = null;
      this.form.remesa = null;
      this.form.consec_remesa = null;
      this.form.kgremesa = null;

      this.errores = {
        vehiculo: null,
        conductor: null,
        cliente: null,
        orden: null,
        cmanual: null,
        valor: null,
      };
    },
    cargarcontenido() {
      let fecha = "";
      if (this.form.fechaini) {
        this.loader = true;
        let agencia = "0001";
        fecha = this.form.fechaini.replace(/\-/g, "");
        post
          .postData({
            url: "/Trmcias/dlls/PrRemision02J.dll",
            data: sessionStorage.Sesion + "|" + "0001" + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            console.log(err);
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
      this.form.orden = null;
      // this.form.vehiculo = null;
      // this.form.conductor = null;
      // this.form.telefono = null;
      // this.form.anticipos = 0;
      // this.form.combustible = 0;

      var cliente = this.form.cargue.idcliente_rep;
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
          let cliente = res[0].id_fact;
          let busqueda_select = this.clientes.find(
            (el) => parseFloat(el.identificacion_rut) == cliente
          );
          this.form.cliente = busqueda_select;
          let anticipos = this.form.cargue.totalant_rep.trim();
          let combustible = this.form.cargue.totalcomb_rep.trim();
          this.form.anticipos = anticipos;
          this.form.combustible = combustible;
        });
    },
    format_ordenes: function (val) {
      return `${val.orden_fact.trim()} - ${val.fecha_fact}`;
    },
    format_productos: function (val) {
      return `${val.nombre_servicio.trim()}`;
    },
    format_cargues: function (val) {
      return `${val.ordexterno_rep} - ${val.nombre_cliente.trim()}`;
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
    format_origen(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    format_destino(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    asignar_telefono() {
      console.log(this.form.conductor);
      this.form.telefono = this.form.conductor.telefono_rut;
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
