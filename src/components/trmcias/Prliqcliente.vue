<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-shape-polygon-plus</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Cliente</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col class="d-flex" cols="7">
              <v-autocomplete
                label="Cliente"
                v-model="form.clientes"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                clearable
                return-object
                @change="
                  get_ordenes(), (errores.clientes = false), (print_doc = false)
                "
                :error="errores.clientes"
              ></v-autocomplete>
            </v-col>
            <v-col cols="5">
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
                @change="select_orden(), (print_doc = false)"
                @input="errores.orden = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col
              class="d-flex justify-center mx-15"
              cols="3"
              v-if="contenido.length != 0"
            >
              <v-btn
                color="purple"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="gen_proforma()"
                :disabled="contenido.length == 0"
              >
                Generar Proforma
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>
            <v-col
              class="d-flex justify-center mx-15"
              cols="3"
              v-if="print_doc"
            >
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_proforma()"
              >
                Imprimir Proforma
                <v-icon right dark>mdi-cloud-print-outline</v-icon>
              </v-btn>
            </v-col>
            <v-col
              class="d-flex justify-center mx-1"
              cols="3"
              v-if="contenido.length != 0"
            >
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
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

              <template v-slot:item.remision_rep="{ item }">
                {{ parseFloat(item.remision_rep) }}
              </template>

              <template v-slot:item.remesa_rep="{ item }">
                {{ parseFloat(item.remesa_rep) }}
              </template>
              <!-- <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="cargar_item(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
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
          <v-row class="d-flex">
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Nro.Vale Cliente"
                v-model="form.valecliente"
                hide-details
                @change="errores.valecliente = false"
                :error="errores.valecliente"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Nro.Vale Mina"
                v-model="form.valemina"
                hide-details
                @change="errores.valemina = false"
                :error="errores.valemina"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex">
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="M3 Recibo"
                v-model="form.m3_recibido"
                hide-details
                type="number"
                @change="errores.m3_recibido = false"
                :error="errores.m3_recibido"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Km Recibo"
                v-model="form.km_recibido"
                hide-details
                type="number"
                @change="errores.km_recibido = false"
                :error="errores.km_recibido"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pb-0"> </v-card-text>
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
import { proforma } from "../../_formatos_trans.js";


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
      print_doc: false,

      placas: [],
      conductores: [],
      clientes: [],
      ordenes: [],
      cargues: [],

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
      item_select: [],
      nro_print: 0,

      search: "",
      form: {
        m3_recibido: null,
        km_recibido: null,
      },

      headers: [
        { text: "Remision", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep", width: "120px" },
        { text: "Vehículo", align: "center", value: "placa_rep" },
        { text: "Producto", align: "center", value: "producto_rep" },

        { text: "Remesa", align: "center", value: "remesa_rep" },
        { text: "Consec.Remesa", align: "center", value: "consecrem_rep" },
        { text: "Kilos Remesa", align: "center", value: "kgsremesa_rep" },
        { text: "Destino", align: "center", value: "destino_rep" },

        { text: "Vale Cliente", align: "center", value: "valecliente_rep" },
        { text: "Vale Mina", align: "center", value: "valemina_rep" },
        // { text: "M3 Mina", align: "center", value: "nroexterno_rep" },
        { text: "M3 Recibo", align: "center", value: "m3recibo_rep" },
        { text: "KM Pedido", align: "center", value: "kmpedido_rep" },
        { text: "Vlr Mt/KM", align: "center", value: "vlrmtkm_rep" },
        { text: "Total", align: "center", value: "vlrtotal_rep" },

        // { text: "Opciones", align: "center", value: "edit" },
      ],
      errores: {
        m3_recibido: false,
        km_recibido: false,
        valecliente: false,
        valemina: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarRuts();
    this.get_Clientes();
  },
  methods: {
    cargar_item(item) {
      this.dialogo.estado = true;
      this.item_select = item;
      this.form.m3_recibido = parseFloat(item.m3recibo_rep);
      this.form.km_recibido = parseFloat(item.kmrecibo_rep);
      this.form.valecliente = item.valecliente_rep.trim();
      this.form.valemina = item.valemina_rep.trim();
    },
    select_orden() {
      this.contenido = [];

      if (this.form.orden) {
        var cliente = this.form.clientes.identificacion_rut;
        let orden = this.form.orden.numero_fact;
        var datosEnvio = `${sessionStorage.Sesion}|${cliente}|${orden}|`;
        post
          .postData({
            url: "Trmcias/dlls/PrRemision03J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop();
            function isBase64(str) {
              if (!str || typeof str !== "string") return false;
              // Quita espacios y verifica longitud
              if (str.length % 4 !== 0) return false;
              // Solo caracteres base64
              return /^[A-Za-z0-9+/=]+$/.test(str);
            }

            this.contenido = data.map((item) => {
              const base64 = item.producto_rep;

              try {
                const decoded = atob(base64);
                const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
                const texto = new TextDecoder("utf-8").decode(bytes);
                item.producto_rep = texto; // ← reemplaza el base64 por el texto decodificado
              } catch (e) {
                console.warn("No se pudo decodificar:", base64, e);
                // Se deja el valor original
              }

              return item;
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Remisiones",
              estado: true,
            });
          });
      }
    },
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

    format_envio(data) {
      this.card_estado = true;
      let fecha = this.item_select.fecha_rep.replace(/\-/g, "");
      let consecutivo = parseFloat(this.item_select.nro_rep);
      let m3_recibido = data.m3_recibido;
      let km_recibido = data.km_recibido;
      let valecliente = data.valecliente;
      let valemina = data.valemina;
      let datos = {
        url: "/Trmcias/dlls/PrRemisionM.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          m3_recibido +
          "|" +
          km_recibido +
          "|" +
          valecliente +
          "|" +
          valemina +
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
          this.select_orden();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    init_form() {
      this.form.m3_recibido = null;
      this.form.km_recibido = null;
      this.form.valecliente = null;
      this.form.valemina = null;
    },
    get_ordenes() {
      this.ordenes = [];
      this.form.cliente = null;
      var cliente = this.form.clientes.identificacion_rut;
      var datosEnvio = `${sessionStorage.Sesion}|0|${cliente}|0|`;
      post
        .postData({
          url: "Trmcias/dlls/PrPedido02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((res) => {
          this.form.cliente = res[0].cliente_fact;
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
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    print_reporte_excel() {
      var data = this.contenido;
      const data_parse = data.map((item) => ({
        ...item,
        vlrtotal_rep: Number(
          item.vlrtotal_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
        vlrmtkm_rep: Number(
          item.vlrmtkm_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
      }));

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Vehiculo",
          value: "placa_rep",
        },
        {
          title: "Material",
          value: "producto_rep",
        },
        {
          title: "Destino",
          value: "destino_rep",
        },
        {
          title: "Vale Jaelfa",
          value: "nro_rep",
        },
        {
          title: "Vale Cliente",
          value: "valecliente_rep",
        },
        {
          title: "Vale Mina",
          value: "valemina_rep",
        },
        {
          title: "Remesa",
          value: "remesa_rep",
        },
        {
          title: "Consecutivo",
          value: "consecrem_rep",
        },

        {
          title: "Kilos",
          value: "kgsremesa_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "M3 Mina",
          value: "m3recibo_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Km",
          value: "kmpedido_rep",
          totalsRowFunction: "sum",
        },

        {
          title: "M3 entregados",
          value: "m3recibo_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Valor Mt Km",
          value: "vlrmtkm_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Total a Cobrar",
          value: "vlrtotal_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
      ];
      var cliente = this.form.clientes.descripcion_rut.trim();
      var header_format = [
        { text: "LIQUIDACION CLIENTE", bold: true, size: 16 },
        `Cliente: ${cliente}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Liquidacion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `LIQUIDACION_CLIENTE-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    gen_proforma() {
      if (this.form.orden) {
        var cliente = this.form.clientes.identificacion_rut;
        let orden = this.form.orden.numero_fact;
        var datosEnvio = `${sessionStorage.Sesion}|${cliente}|${orden}|`;
        post
          .postData({
            url: "Trmcias/dlls/PrProforma01.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.contenido = [];
            this.print_doc = true;
            this.nro_print = parseFloat(data[0]);
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Proforma guardada correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al generar Proforma",
              estado: true,
            });
          });
      }
    },
    async print_proforma(item, getBase64) {
      var fecha = this.$moment().format("YYYY");
      let nrofact = this.nro_print;
      var agencia = "0001";
      let prefijo = "0001";
      var key = agencia + "|" + prefijo + "|" + nrofact + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Trmcias/dlls/PrProforma01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          console.log(data);
          return await this.generar_pdf_2(data[0], getBase64);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      if (getBase64) return await proforma(data, getBase64);
      else proforma(data);
    },
  },
};
</script>
