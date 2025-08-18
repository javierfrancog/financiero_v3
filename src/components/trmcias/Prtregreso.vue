<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Comprobante de Egreso</v-list-item-title
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
                Nuevo Egreso
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

              <template v-slot:item.ordenservic_rep="{ item }">
                {{ parseFloat(item.ordenservic_rep) }}
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
                :item-title="format_placas"
                v-model="form.vehiculo"
                @update:model-value="get_cargue()"
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
                :item-title="format_conductores"
                hide-details
                v-model="form.conductor"
                item-value="value"
                return-object
                :error="errores.conductor"
                @update:model-value="errores.conductor = false"
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
            <v-col cols="6">
              <v-autocomplete
                :items="cargues"
                label="Nro. Cargue"
                clearable
                :item-title="format_cargues"
                hide-details
                v-model="form.cargue"
                item-value="value"
                return-object
                :error="errores.orden"
                @update:model-value="errores.orden = false"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Nro Manual"
                clearable
                required
                v-model="form.cmanual"
                hide-details
                :error="errores.cmanual"
                @input="errores.cmanual = false"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Valor Egreso"
                clearable
                outlined
                required
                v-money="money"
                v-model="form.valor"
                :error="errores.valor"
                @input="errores.valor = false"
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
import { CompEgreso } from "../../_formatos_trans";


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
      datosEmpresa:[],
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
      },

      headers: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Vehículo", align: "center", value: "placa_rep" },
        { text: "Conductor", align: "left", value: "nombre_conductor" },
        { text: "Nro Manual", align: "center", value: "nromanual_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Cliente", align: "left", value: "nombre_cliente" },
        { text: "Nro Orden", align: "center", value: "ordenservic_rep" },

        { text: "Opciones", align: "center", value: "action" },
      ],
      errores: {
        vehiculo: null,
        conductor: null,
        cliente: null,
        orden: null,
        cmanual: null,
        valor: null,
      },
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
          data: sessionStorage.Sesion + "|" + "2" + "|" + numero + "|",
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
            CompEgreso(data_impresion).then(() => {
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
      if (!data.vehiculo) {
        this.errores.vehiculo = true;
        this.send_error("Debe seleccionar una placa");
      } else if (!data.conductor) {
        this.errores.conductor = true;
        this.send_error("Debe seleccionar un conductor");
      } else if (!data.cargue) {
        this.errores.cargue = true;
        this.send_error("Debe seleccionar un numero de cargue");
      } else if (!data.cmanual) {
        this.errores.cmanual = true;
        this.send_error("Debe seleccionar registrar un numero de Solicitud");
      } else if (!data.valor) {
        this.errores.valor = true;
        this.send_error("Debe seleccionar registrar un valor");
      } else this.format_envio(data);
    },

    format_envio(data) {
      this.card_estado = true;
      let consecutivo = data.consecutivo;
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let placa = data.vehiculo.placa_rep;
      let conductor = parseFloat(data.conductor.identificacion_rut);
      let cliente = parseFloat(data.cargue.idcliente_rep);
      let nroorden = parseFloat(data.cargue.ordenservic_rep);
      let nromanual = data.cmanual.trim();
      let valor = data.valor.replace(/\,/g, "");
      let datos = {
        url: "/Trmcias/dlls/PrEgreso.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "2" +
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
          nromanual +
          "|" +
          valor +
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
          url: "Trmcias/dlls/PrOrdenExtN.dll",
          data: sessionStorage.Sesion + "|" + 2 + "|",
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
      this.dialogo.titulo = "Nuevo Egreso";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.form.cargue = null;
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
        fecha = this.form.fechaini.replace(/\-/g, "");
        post
          .postData({
            url: "/Trmcias/dlls/PrEgreso01J.dll",
            data: sessionStorage.Sesion + "|" + "2" + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop();
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
    format_cargues: function (val) {
      return `${val.ordexterno_rep} - ${val.nombre_cliente.trim()}`;
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
