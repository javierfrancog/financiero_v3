<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-map-clock-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Libro de Viajes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row>
          <v-col class="d-flex" sm="3">
            <v-menu
              v-model="pickeFechaIni"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechaInicial"
                  label="Fecha Inicial"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaInicial"
                @input="
                  pickeFechaIni = false;
                  form.fechaFinal = form.fechaInicial;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" sm="3">
            <v-menu
              v-model="pickerFechaFinal"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechaFinal"
                  label="Fecha Final"
                  append-icon="event"
                  outlined
                  v-on="on"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaFinal"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="12" sm="4">
            <v-switch v-model="form.anulados" label="Solo anulados"></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex" cols="4" md="4">
            <v-autocomplete
              :items="ptosrecaudo"
              label="Taquilla"
              v-model="form.puntos"
              :item-text="format_ptos"
              item-value="codigo_agc"
              :error="errores.puntos"
              @input="errores.puntos = false"
              hide-details
              outlined
              return-object
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="4" md="3">
            <v-autocomplete
              :items="placas"
              label="Placa"
              v-model="form.placas"
              :item-text="format_placas"
              item-value="codigo_agc"
              clearable
              :error="errores.placas"
              @input="errores.placas = false"
              hide-details
              outlined
              return-object
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="2" md="5">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="consultar_lviajes()"
            >
              Consultar
              <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn
              color="green darken-2"
              class="ma-2 white--text"
              large
              depressed
              @click="print_reporte_excel()"
              :disabled="contenido.length == 0"
            >
              Generar Excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="12" md="6">
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
              item-key="id_cargue"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.id_lvia="{ item }">
                {{ parseInt(item.id_lvia) }}
              </template>

              <template v-slot:item.cargue_lvia="{ item }">
                {{ parseInt(item.cargue_lvia) }}
              </template>

              <template v-slot:item.estado_lvia="{ item }">{{
                item.estado_lvia == "1" ? "Anulado" : "Activo"
              }}</template>

              <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="
                        imprimir_libro(item);
                        dialogo.tipo = false;
                      "
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Libro</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="green "
                      fab
                      small
                      icon
                      v-on="on"
                      @click="
                        contabilizar_libro(item);
                        dialogo.tipo = false;
                      "
                    >
                      <v-icon>mdi-checkbox-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Contabilizar Libro</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red darken-4"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="
                        anular_libro(item);
                        dialogo.tipo = false;
                      "
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{ item.estado_lvia == "0" ? "Anular" : "Reactivar" }}
                  </span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_libro(item)"
                      color="orange"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                    >
                      <v-icon>mdi-chart-timeline</v-icon>
                    </v-btn>
                  </template>
                  <span>Actualizar Libro</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="reprocesar_libro(item)"
                      color="purple"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                    >
                      <v-icon>mdi-auto-mode</v-icon>
                    </v-btn>
                  </template>
                  <span>Reprocesar Libro</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogo_editar.estado" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">
          Actualizar Libro {{ dialogo.titulo2 }}</v-card-title
        >
        <v-card-text>
          <v-col cols="6" class="d-flex justify-center">
            <span class="title col-12">{{ dialogo.titulo }}</span>
          </v-col>
          <v-row class="justify-center mt-0">
            <v-col cols="12" md="8">
              <v-row class="text-body-1 font-weight-medium" no-gutters>
                <v-col cols="8">
                  <v-card class="pa-4 font-weight-regular" tile outlined>
                    Avance
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    prefix="$"
                    outlined
                    hide-details
                    clearable
                    :value="formatNumero(form.avances)"
                    @keypress="lettersDisabled()"
                    @input="input_mask('avances')"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cerrar_editar">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="grabar_editar">
            Grabar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <modalLibroViaje
      :estado="dialogo.estado"
      :data="libro"
      @newLibroViajes="updatePtosrecaudo"
      @newEstado="updateEstadoRecaudo"
      @error="send_error"
    />

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import modalLibroViaje from "./componentes/modal.libro-viaje.vue";
import {
  get_libroViaje,
  contabilizar,
} from "@/components/transporte/mixins/contab";

export default {
  components: {
    FlowerSpinner,
    modalLibroViaje,
  },
  data() {
    return {
      loader: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      dialogo: {
        estado: false,
        titulo: null,
        titulo2: null,
        tipo: null,
      },
      dialogo_editar: {
        estado: false,
        tipo: 0,
      },
      itemselecc: [],
      ptosrecaudo: [],
      punto_taquilla: [],
      contenido: [],
      placas: [],
      search: "",
      form: {
        avances: 0,
        anulados: false,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },

      libro: {},
      headers: [
        { text: "Fecha", align: "center", value: "fecha_lvia" },
        { text: "Id Libro", align: "center", value: "id_lvia" },
        { text: "Agencia", align: "center", value: "descagencia_lvia" },
        { text: "Id_Interno", align: "center", value: "nrointerno_lvia" },
        { text: "Placa", align: "center", value: "placa_lvia" },
        { text: "Forma_Pago", align: "center", value: "fpago_lvia" },
        { text: "SubTotal", align: "center", value: "subtotal_lvia" },
        { text: "Seguro", align: "center", value: "seguro_lvia" },
        { text: "Total", align: "center", value: "total_lvia" },
        { text: "Origen", align: "center", value: "origen_lvia" },
        { text: "Destino", align: "center", value: "destino_lvia" },
        { text: "Estado", align: "center", value: "estado_lvia" },
        { text: "Taquillero", align: "center", value: "descuser_lvia" },
        { text: " ", align: "center", value: "action" },
      ],
      errores: {},
    };
  },

  created() {
    this.cargar_placas();
    // this.dialogo.estado = true;
    let punto_taquilla = sessionStorage.llave_punto;
    let data = JSON.parse(atob(punto_taquilla));
    this.punto_taquilla.codigo = data.id;
    this.punto_taquilla.texto = data.text;
    this.punto_taquilla.turno = data.turno;
    this.form.anulados = false;

    this.cargaragencias();
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    reprocesar_libro(item) {
      this.loader = true;
      let agclibro = item.agencia_lvia;
      let libro = item.id_lvia.trim();
      let fecha = item.fecha_lvia.replace(/\//g, "")
      let avance = item.avances_lvia.replace(/\,/g, "");
      let usuario = item.iduser_lvia;
      post
        .postData({
          url: "/transporte/dlls/PrRepLviajes.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agclibro +
            "|" +
            libro +
            "|" +
            fecha +
            "|" +
            avance +
            "|" +
            usuario +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Libro reprocesado correctamente",
            estado: true,
          });
          this.consultar_lviajes();
        })
        .catch((err) => {
          console.log("err", err);
          this.send_error("Error al reprocesar libro");
        });
    },
    editar_libro(item) {
      this.itemselecc = item;
      this.dialogo_editar.estado = true;
      this.dialogo.titulo = item.descagencia_lvia;
      this.dialogo.titulo2 = "Libro:" + item.id_lvia;
      let avance = item.avances_lvia.replace(/\,/g, "");
      this.form.avances = avance.trim();
    },
    cerrar_editar() {
      this.dialogo_editar.estado = false;
    },
    grabar_editar() {
      this.dialogo_editar.estado = false;
      this.loader = true;
      let agencia = this.itemselecc.agencia_lvia;
      let libro = parseInt(this.itemselecc.id_lvia);
      let avances = this.form.avances.replace(/\,/g, "");

      var datos = {
        url: "Transporte/dlls/PrLViajesM.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          libro +
          "|" +
          avances +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader = false;
          this.consultar_lviajes();
        })
        .catch((error) => {
          this.loader = false;
          this.send_error("Error al actualizar libro");
        });
    },
    cargar_placas() {
      this.loader = true;
      post
        .postData({
          url: "Transporte/dlls/PrVehiculosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.placas = JSON.parse(JSON.stringify(data));
          this.placas.unshift({
            placa_veh: "Todas las placas",
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
    format_placas: function (val) {
      return `${val.placa_veh.trim()}`;
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      let total_valor = 0;

      var data_parse = data.map((el) => {
        let seguro = parseFloat(el.seguro_lvia.replace(/\,/g, "")) || 0;
        let subtotal = parseFloat(el.subtotal_lvia.replace(/\,/g, "")) || 0;
        let total = parseFloat(el.total_lvia.replace(/\,/g, "")) || 0;
        let nrolibro = parseFloat(el.id_lvia.trim()) || 0;
        let avances = parseFloat(el.avances_lvia.replace(/\,/g, "")) || 0;

        el.subtotal_lvia = subtotal;
        el.seguro_lvia = seguro;
        el.total_lvia = total;
        el.id_lvia = nrolibro;
        el.avances = avances;

        // if (el.id != 99) {
        //   total_valor += ventas;
        // }

        return el;
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_lvia",
          format: "string",
        },
        {
          title: "Libro",
          value: "id_lvia",
          format: "string",
        },
        {
          title: "Agencia",
          value: "descagencia_lvia",
          format: "string",
        },
        {
          title: "Placa",
          value: "placa_lvia",
        },
        {
          title: "Nro Interno",
          value: "nrointerno_lvia",
        },
        {
          title: "F_Pago",
          value: "fpago_lvia",
        },
        {
          title: "Subtotal",
          value: "subtotal_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Seguro",
          value: "seguro_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Total",
          value: "total_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Avances",
          value: "avances",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Origen",
          value: "origen_lvia",
        },
        {
          title: "Destino",
          value: "destino_lvia",
        },
        {
          title: "Estado",
          value: "estado_lvia",
        },

        {
          title: "Despachador",
          value: "descuser_lvia",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var taquilla = this.form.puntos.descripcion_agc;
      var placas = this.form.placas.placa_veh;

      var header_format = [
        { text: "REPORTE LIBRO DE VIAJES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Taquilla: ${taquilla} - Placa: ${placas}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Libro de Viajes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-LIBROVIAJES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultar_lviajes() {
      if (this.form.puntos) {
        this.loader = true;
        let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let placa = this.form.placas.placa_veh;
        var anulados = this.form.anulados ? "1" : "0";
        if (placa === "Todas las placas") placa = 0;
        let agencia = this.form.puntos.codigo_agc;

        var datos = {
          url: "Transporte/dlls/RpLViajes03VJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaInicial +
            "|" +
            fechaFinal +
            "|" +
            agencia +
            "|" +
            placa +
            "|" +
            anulados +
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = data;
          })
          .catch((error) => {
            this.loader = false;
            this.send_error("Error al consultar viajes");
          });
      } else {
        this.errores.puntos = true;
        this.send_error("Debe seleccionar una taquilla");
      }
    },
    imprimir_libro: function (item) {
      this.loader = true;
      let agencia = item.agencia_lvia;
      let libro = parseInt(item.id_lvia);
      this.libro = {};
      post
        .postData({
          url: "/transporte/dlls/PrLviajes03VJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + libro + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.estado = true;
          this.loader = false;
          let tiquetes = JSON.parse(JSON.stringify(data[0].tiquetes_lvia));
          let libro = data[0].nro_lvia ? parseInt(data[0].nro_lvia) : 0;

          if (libro === 0) {
            this.libro = data[0];
          } else if (tiquetes[0].agenciatiq_lvia === undefined)
            this.libro = data[0];
          else {
            let totalSeguro =
              parseFloat(data[0].vlrseguro_lvia.replace(/\,/g, "")) || 0;
            let totalCantidad = data[0].cantpasajeros_lvia;
            let totalValor = data[0].vlrbruto_lvia;
            let redBus = data[0].vlrredbus_lvia;
            let pinBus = data[0].vlrpinbus_lvia;
            let brasilia = data[0].vlrbrasilia_lvia;
            let gamarra = data[0].vlrgamarra_lvia;
            let tdebito = data[0].vlrtdeb_lvia;
            let efectivo = parseInt(data[0].vlrefectivo_lvia);
            let avance = parseInt(data[0].vlravances_lvia);

            tiquetes.pop();
            let tiquetes_list = tiquetes.map((item) => {
              let newItem = {};

              let valor = parseFloat(item.vlrtiq_lvia.replace(/\,/g, "")) || 0;

              newItem.nombres = item.pasajero_lvia.trim();
              newItem.sillas = item.sillas_lvia;
              newItem.formapago = item.fpago_lvia;
              newItem.cantidad = parseInt(item.cantidad_lvia);
              newItem.valor = "$" + this.formatNumero(valor);
              newItem.nro_tiq = item.tiquete_lvia;
              newItem.destino_tiq = "";

              return newItem;
            });
            this.libro = {
              estado: 2,
              codigo_agc: "0",
              descripcion_agc: "Todos",
              agencia: data[0].agencia_lvia,
              libroViaje: parseFloat(data[0].nro_lvia),
              origen: item.origen_lvia.trim(),
              destino: item.destino_lvia.trim(),
              fecha: item.fecha_lvia,
              hora: data[0].hora_lvia,
              nroCargue: parseFloat(data[0].nrocargue_lvia),
              vehiculo: item.placa_lvia,
              conductor: `${
                data[0].idconductor_lvia
              } - ${data[0].conductor_lvia.trim()}`,
              tiquetes: tiquetes_list,
              totalSeguro,
              totalCantidad,
              totalValor,
              redBus,
              pinBus,
              brasilia,
              gamarra,
              tdebito,
              efectivo,
              avance,

              // avance : 88888,
              totalPagar: totalValor - gamarra,
            };
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.send_error("Error al cargar tiquetes");
        });
    },
    async contabilizar_libro(item) {
      this.loader = true;
      let agencia = item.agencia_lvia;
      let libro = item.id_lvia;

      let info_viaje = await get_libroViaje({ agencia, consecutivo: libro });
      info_viaje.consec_libro = libro;

      await contabilizar(info_viaje)
        .then(() => {
          this.$emit("snack", {
            color: "success",
            text: "Libro Contabilizado Correctamente",
            estado: true,
          });
          this.loader = false;
        })
        .catch((error) => {
          console.log("Error", error);
          this.loader = false;
        });
    },
    anular_libro: function (item) {
      this.loader = true;
      let agencia = this.punto_taquilla.codigo;
      let agclibro = item.agencia_lvia;

      let libro = item.id_lvia.trim();
      post
        .postData({
          url: "/transporte/dlls/PrLviajesAV.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            libro +
            "|" +
            agclibro +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Libro Anulado correctamente",
            estado: true,
          });
          this.consultar_lviajes();
        })
        .catch((err) => {
          console.log("err", err);
          this.send_error("Error al anular libro");
        });
    },
    cargaragencias: function () {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todos",
          });

          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todos",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    formatComas: function (index, longitud, string) {
      return index + 1 === longitud ? string : string + ", ";
    },

    updatePtosrecaudo(data) {
      this.form.ptosrecaudo = data;
    },
    updateEstadoRecaudo(dialogo) {
      this.dialogo.estado = dialogo.estado;
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },

    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
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
