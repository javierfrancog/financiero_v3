<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Despachos Pendientes por Facturar</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="3">
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
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="3">
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
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex justify-end" cols="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>              
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  clearable
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_resolucion();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
                  hide-details
                  outlined
                  return-object
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>

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
              item-key="numero_fact"
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <!-- <v-btn icon class="mr-2" color="blue darken-2">
                  <v-icon @click="print_item(item)">print</v-icon>
                </v-btn>-->
                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"                      
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Facturar Despacho</span>
                </v-tooltip> -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="seleccionar_cliente(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.llavefact_fact != ''"
                    >
                      <v-icon>mdi-file-sign</v-icon>
                    </v-btn>
                  </template>
                  <span>Generar Factura</span>
                </v-tooltip>

                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.iddian_fact ? true : false"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar Correo</span>
                </v-tooltip> -->

                <!-- <v-btn icon class="mr-2" color="blue darken-2">
                  <v-icon @click="get_json_dian(item)">send</v-icon>
                </v-btn>-->
                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf(item)"
                      :disabled="item.iddian_fact ? false : true"
                    >
                      <v-icon>mdi-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir PDF</span>
                </v-tooltip> -->
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
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                disabled
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
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
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogocliente.estado" persistent max-width="700px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Cliente</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
                <v-autocomplete
                  label="Cliente"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="
                    errores.clientes = false;
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="generar_factura()"
                >Generar Factura</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="dialogocliente.estado = false"
                >Cancelar</v-btn
              >
            </v-col>
          </v-row>
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
      agencias: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      itemfact: null,
      prest_facturas: [],
      clientes:[],
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogocliente: {
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
      contenido: [],
      prefijos: [],      
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        // { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "center", value: "cliente_fact" },
        { text: "Valor", align: "center", value: "valor_fact" },
        { text: "Estado", align: "center", value: "estado_fact" },
        { text: "Factura", align: "center", value: "llavefact_fact" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_Clientes();

    this.get_empresa();
  },
  computed: {},
  methods: {
    get_pdf(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var id_factura = item.iddian_fact;
      var $this = this;

      var urlEnvio = null;
      if (this.datosEmpresa.felectronica_empr == "0")
        urlEnvio = "https://server1ts.net/facturae/consulta_pdf.php";
      else urlEnvio = "https://server1ts.net/facturae/consulta_pdf.prod.php";

      var formData = new FormData();
      formData.append("key_factura", id_factura);
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.card.loader = false;
          this.card.disabled = false;
          $this.send_error(error);
        })
        .then((data) => {
          $this.card.loader = false;
          $this.card.disabled = false;
          var response = JSON.parse(data.res);
          if (response.Respuesta) {
            const linkSource = `data:application/pdf;base64,${response.PdfBase64}`;
            const downloadLink = document.createElement("a");
            const fileName = id_factura + ".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          } else {
            $this.send_error("Error: " + response.MensajeRespuesta);
          }
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
          let cliente = "000000222222222";
          let busqueda_cli = this.clientes.find(
            (el) => el.identificacion_rut.trim() == cliente
          );
          this.form.clientes = busqueda_cli;
        })

        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    seleccionar_cliente(item){
      this.itemfact = item;
      this.dialogocliente.estado = true;
      var busqueda_cliente = this.clientes.find(
        (el) => el.identificacion_rut == item.id_fact
      );      
      this.form.clientes = busqueda_cliente;



    },
    generar_factura() {
      let item = this.itemfact;
      let prefijofact = this.form.pref_fact.prefijo_resd;
      let ptofact = this.form.punto_fact.codigo_agc;
      let prefijorem = item.pref_fact;
      let ptorem = item.agencia_fact;
      let cliente = this.form.clientes.identificacion_rut;    
      let nro = item.numero_fact.trim();
      let fecha = item.fecha_fact;
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        ptofact +
        "|" +
        prefijofact +
        "|" +
        ptorem +
        "|" +
        prefijorem +
        "|" +
        fecha +
        "|" +
        nro +
        "|" +
        cliente +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrDespacho4.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();          
          // this.get_enviardian();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al generar factura");
        });
    }, 
    get_resolucion() {
      var $this = this;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + prefijo + "|" + "3" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar Resolucion: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },

    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },

    cargarcontenido() {
      var estado_fecha = this._validarFechas();
      var agencia = this.form.punto_fact;
      this.contenido = [];

      if (!agencia) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona un Punto y Prefijo de Facturación",
          estado: true,
        });
      } else {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        this.loader = true;

        post
          .postData({
            url: "ptovta/dlls/Prdespacho3.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              0 +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
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
              text: "Error al cargar Remisiones",
              estado: true,
            });
          });
      }
    },
    get_empresa() {
      post
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
            text: "Error al cargar Basicos",
            estado: true,
          });
        });
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
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

    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },

    toObjectUrl(url) {
      return fetch(url, { mode: "no-cors" })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          return URL.createObjectURL(blob);
        });
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};



</script>
