<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-cash-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Proveedor</v-list-item-title
              >
            </v-list-item-content>
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
                    label="Fecha Inicial:"
                    append-icon="event"
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

            <v-col class="d-flex" cols="8">
              <v-autocomplete
                label="Proveedor"
                v-model="form.clientes"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                clearable
                return-object
                @change="
                  select_orden(),
                    (errores.clientes = false),
                    (print_doc = false)
                "
                :error="errores.clientes"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col class="d-flex justify-center mx-15" cols="3">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="select_orden()"
              >
                Consultar
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>

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
                Generar Orden
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>
            <v-col
              class="d-flex justify-center mx-15"
              cols="3"
              v-if="print_doc"
            >
              <v-btn
                color="orange"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_orden()"
              >
                Imprimir Orden
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
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { doc_ordencompra } from "../../_formatos_trans.js";


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
        { text: "Nro.Vale", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep", width: "120px" },
        { text: "Vehículo", align: "center", value: "placa_rep" },
        { text: "Cliente", align: "center", value: "nombre_cliente" },
        { text: "Producto", align: "center", value: "producto_rep" },
        { text: "Destino", align: "center", value: "destino_rep" },
        { text: "M3 Recibo", align: "center", value: "m3recibo_rep" },
        { text: "Peso", align: "center", value: "peso_rep" },
        { text: "Vlr Ton", align: "center", value: "vlrton_rep" },
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
    this.get_Clientes();
  },
  methods: {
    select_orden() {
      this.contenido = [];

      if (this.form.clientes) {
        const cliente = this.form.clientes.identificacion_rut;
        const fecha = this.form.fechaini.replace(/\-/g, "");
        const datosEnvio = `${sessionStorage.Sesion}|${cliente}|${fecha}|`;

        post
          .postData({
            url: "Trmcias/dlls/PrRemision04J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop(); // Elimina el último (probablemente vacío)

            // Función robusta para validar si es Base64
            function isBase64(str) {
              try {
                return btoa(atob(str)) === str;
              } catch (err) {
                return false;
              }
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
        vlrcomb_rep: Number(
          item.vlrcomb_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
        vlregreso_rep: Number(
          item.vlregreso_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
        vlrtotal_rep: Number(
          item.vlrtotal_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
        vlrfact_rep: Number(
          item.vlrfact_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),

        vlrreteica_rep: Number(
          item.vlrreteica_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
        vlravisos_rep: Number(
          item.vlravisos_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),

        vlrretefte_rep: Number(
          item.vlrretefte_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
        vlrapagar_rep: Number(
          item.vlrapagar_rep.replace(/\s+/g, "").replace(/,/g, "")
        ),
      }));

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Cliente",
          value: "nombre_cliente",
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
          title: "Metros",
          value: "m3recibo_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Kilometros",
          value: "kmrecibo_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Tonelada",
          value: "vlrton_rep",
          format: "number",
          totalsRowFunction: "sum",
        },

        {
          title: "Vlr Mt Km",
          value: "vlrmtkm_rep",
        },
        {
          title: "Total Empresa",
          value: "vlrtotal_rep",
          format: "number",
          totalsRowFunction: "sum",
        },

        {
          title: "Nro Vale Acpm",
          value: "valecomb_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Acpm",
          value: "vlrcomb_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Factura",
          value: "vlrfact_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr ReteIca",
          value: "vlrreteica_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Avisos",
          value: "vlravisos_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Retefte",
          value: "vlrretefte_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Nro egreso",
          value: "nroegreso_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Anticipo",
          value: "vlregreso_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Neto a pagar",
          value: "vlrapagar_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Nro recepcion",
          value: "nrorecepcion_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
      ];
      var cliente = this.form.clientes.descripcion_rut.trim();
      var header_format = [
        { text: "LIQUIDACION PROVEEDOR", bold: true, size: 16 },
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
            archivo: `LIQUIDACION_PROVEEDOR-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    gen_proforma() {
      if (this.form.clientes) {
        var cliente = this.form.clientes.identificacion_rut;
        var datosEnvio = `${sessionStorage.Sesion}|${cliente}|`;
        let detalleEnvio = this.contenido;
        this.format_envio(datosEnvio, detalleEnvio);
      }
    },
    format_envio(importarhtml, data) {
      let tablaEnvio = {};
      let indextab = 0;
      data.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let remision = parseFloat(item.nro_rep);
        let id_cliente = parseFloat(item.idcliente_rep);
        let placa = item.placa_rep;
        let producto = item.codigo_pr;
        let destino = item.destino_rep;
        let metros = parseFloat(item.m3recibo_rep);
        let Kilometros = parseFloat(item.kmrecibo_rep);
        let vlr_tonelada = parseFloat(item.vlrton_rep.replace(/\,/g, ""));
        let vlr_mtkm = parseFloat(item.vlrmtkm_rep);
        let total = parseFloat(item.vlrtotal_rep.replace(/\,/g, ""));

        indextab = format_index;

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${remision}|${id_cliente}|${placa}|${producto}|${destino}|${metros}|${Kilometros}|${vlr_tonelada}|${vlr_mtkm}|${total}|`;
      });

      importarhtml = importarhtml + indextab + "|";

      let datos = {
        url: "Trmcias/dlls/PrOrden01.dll",
        data: { importarhtml, ...tablaEnvio },
        method: "",
        json: true,
      };
      post
        .postData(datos)
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
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = false;
          console.error(err);
          this.send_error("Error al grabar Solicitud");
        });
    },
    async print_orden(item, getBase64) {
      var fecha = this.$moment().format("YYYY");
      let nrofact = this.nro_print;
      var agencia = "0001";
      let prefijo = "0001";
      var key = agencia + "|" + nrofact + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Trmcias/dlls/PrOrdCompraJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          console.log(data);
          return await this.generar_pdf_2(data[0], getBase64);
        })
        .catch((err) => {
          console.log(err);
          // this.card.loader = false;
          // this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async generar_pdf_2(data, getBase64) {
      data.productos_prov = data.productos_prov.map((item) => {
        try {
          const decoded = atob(item.nombreservicio_prov);
          const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
          item.nombreservicio_prov = new TextDecoder("utf-8").decode(bytes);
        } catch (e) {
          console.warn("Error al decodificar:", item.nombreservicio_prov, e);
        }
        return item;
      });
      let data_impresion = data;
      let empresa = this.datosEmpresa;

      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: empresa.ideditado_empr,
        direccionEmpresa: empresa.direccion_empr,
        telefonoEmpresa: empresa.telefono_empr,
        ciudadEmpresa: empresa.Ciudad,
        dptoEmpresa: empresa.Departamento,
      };
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data_impresion.logo = logo;

        doc_ordencompra(data_impresion).then((el) => {
          // this.load.imprimir_factura = false;
          // this.disabled.imprimir_factura = false;
        });
      });
    },
  },
};
</script>
