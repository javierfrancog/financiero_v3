<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-animation-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Programación de facturas</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
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
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:item.periodo_rep="{ item }">
                {{ item.periodo_rep == "1" ? "Mensual" : "Quincenal" }}
              </template>

              <template v-slot:item.genera="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="generar_factura(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.ultperfact_rep != '0000-00'"                      
                    >
                      <v-icon>mdi-check-decagram-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Generar Factura</span>
                </v-tooltip>
              </template>
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
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Consecutivo"
                clearable
                outlined
                type="text"
                required
                counter="15"
                disabled
                v-model="form.codigo"
                :error="errores.codigo"
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

          <v-row>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Cliente"
                v-model="form.clientes"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                @change="
                  errores.clientes = false;
                  get_facturas2();
                "
                :error="errores.clientes"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Prefijo"
                clearable
                outlined
                required
                v-model="form.prefijo"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Factura base"
                clearable
                outlined
                required
                v-model="form.facturas"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: '1', value: 1 },
                  { text: '2', value: 2 },
                  { text: '3', value: 3 },
                  { text: '4', value: 4 },
                  { text: '5', value: 5 },
                  { text: '6', value: 6 },
                  { text: '7', value: 7 },
                  { text: '8', value: 8 },
                  { text: '9', value: 9 },
                  { text: '10', value: 10 },
                  { text: '11', value: 11 },
                  { text: '12', value: 12 },
                  { text: '13', value: 13 },
                  { text: '14', value: 14 },
                  { text: '15', value: 15 },
                  { text: '16', value: 16 },
                  { text: '17', value: 17 },
                  { text: '18', value: 18 },
                  { text: '19', value: 19 },
                  { text: '20', value: 20 },
                  { text: '21', value: 21 },
                  { text: '22', value: 22 },
                  { text: '23', value: 23 },
                  { text: '24', value: 24 },
                  { text: '25', value: 25 },
                  { text: '26', value: 26 },
                  { text: '27', value: 27 },
                  { text: '28', value: 28 },
                  { text: '29', value: 29 },
                  { text: '30', value: 30 },
                ]"
                label="Dia Facturación"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.dia"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Mensual', value: 1 },
                  { text: 'Semanal', value: 2 },
                ]"
                label="Tipo de Cargue"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipo"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-menu
                v-model="pickerInicial"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.periodo_inicial"
                    label="Periodo Inicial"
                    append-icon="event"
                    hide-details
                    Autocomplete="off"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.periodo_inicial"
                  type="month"
                  no-title
                  scrollable
                  @input="pickerInicial = false, calcular_final()"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-menu
                v-model="pickerFinal"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.periodo_final"
                    label="Periodo Final"
                    append-icon="event"
                    hide-details
                    outlined
                    Autocomplete="off"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.periodo_final"
                  type="month"
                  no-title
                  scrollable
                  @input="pickerFinal = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Observacion Factura"
                clearable
                outlined
                required
                v-model="form.observacion"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
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

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      facturas_load: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickerInicial: false,
      pickerFinal: false,

      singleExpand: true,
      expanded: [],
      empresa: [],
      contenido: [],
      clientes: [],
      ultimafactura: [],
      print: {
        comprobante: null,
      },

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "codigo_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Periodo", align: "center", value: "periodo_rep" },
        { text: "Cliente", align: "left", value: "descriprut_rep" },
        { text: "Factura Base", align: "left", value: "factura_rep" },
        { text: "Valor Base", align: "center", value: "total_rep" },        
        { text: "Periodo Facturado", align: "center", value: "ultperfact_rep" },        

        { text: "Generar", value: "genera", align: "center" },
        { text: "Editar", value: "edit", align: "center" },
      ],
      error: {
        facturas: false,
      },

      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarcontenido();
    this.get_Clientes();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_rep;
      this.form.descripcion = item.descripcion_rep;
      var busqueda_rut = this.clientes.find(
        (el) => el.identificacion_rut == item.rut_rep
      );
      this.form.clientes = busqueda_rut;
      this.form.tipo = { value: parseInt(item.periodo_rep) };
      this.form.dia = { value: parseInt(item.dia_rep) };
      this.form.periodo_inicial = item.perini_rep;
      this.form.periodo_final = item.perfin_rep;
      this.form.prefijo = item.pref_rep.trim();
      this.form.facturas = parseInt(item.factura_rep);
      this.form.observacion = item.observacion_rep;

      // this.form.clientes = { value: parseInt(item.rut_rep) }
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    generar_factura(item) {
      let prefijo = item.pref_rep;
      let nro = item.factura_rep;
      let fecha = item.perfin_rep;
      let observacion = item.observacion_rep;
      let consecutivo = item.codigo_rep;
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        nro +
        "|" +
        fecha +
        "|" +
        observacion +
        "|" +
        consecutivo +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrFact01prg.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.print.comprobante = data[0];
          this.cargarcontenido();          
          // this.get_enviardian();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al generar factura");
        });
    },
    get_enviardian() {
      // this.card.loader = true;
      // this.card.disabled = true;
      var key = this.print.comprobante;
      var fecha = this.$moment().format("YYYY");
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = null;

      if (this.empresa.provfact_empr == "2") {
        urlconsulta = "Ptovta/dlls/PrFactEmisionJ.dll";
      } else {
        urlconsulta = "Ptovta/dlls/PrFact01FEJ.dll";
      }

      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let descripcion64 = " ";
          descripcion64 = window.atob(data[0].Comprobante.Observaciones64);
          if (descripcion64) {
            data[0].Comprobante.Observaciones = descripcion64;
          }
          var urlEnvio = null;
          let factura = null;
          if (this.empresa.provfact_empr == "1") {
            factura = data[0];
            if (this.empresa.felectronica_empr == "0")
              urlEnvio = "https://server1ts.net/facturae/consulta.php";
            else urlEnvio = "https://server1ts.net/facturae/consulta.prod.php";

            let nombre64 = " ";
            let detalles = factura.Detalles.map((item) => {
              nombre64 = window.atob(
                item.base1_pr.trim() +
                  item.base2_pr.trim() +
                  item.base3_pr.trim() +
                  item.base4_pr.trim() +
                  item.base5_pr.trim()
              );
              if (nombre64) {
                item.Nombre = nombre64;
              }
              item.Nombre = item.Nombre + item.Detalleprod;
              return item;
            });

            factura.Detalles = detalles;
          } else if (this.empresa.provfact_empr == "2") {
            urlEnvio = "https://server1ts.net/facturae/fp_emision.php";
            factura = data[0];

            factura.invoice_lines = factura.invoice_lines.map((item) => {
              item.description =
                window.atob(item.description64) || item.description;
              return item;
            });

            factura.number = 990059503;
          }

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));

          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.card.loader = false;
              this.card.disabled = false;
              $this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              if (this.empresa.provfact_empr == "1") {
                var res = JSON.parse(response.res);
                if (response.codigo == "0") {
                  if (res.IdDocumento.Respuesta) {
                    let cufe = res.IdDocumento.Contenido;
                    $this.grabar_cufe(res, cufe);
                  } else {
                    // this.card.loader = false;
                    // this.card.disabled = false;
                    $this.$emit("snack", {
                      color: "success",
                      text: res.RespuestaFacse,
                      estado: true,
                    });
                  }
                } else {
                  // this.card.loader = false;
                  // this.card.disabled = false;
                  $this.send_error("Error enviando la factura electrónica");
                }
              } else {
                if (response.status === "error") {
                  let errores = response.document.errors.join("<br>");
                  this.send_error(errores);
                  // this.card.loader = false;
                  // this.card.disabled = false;
                } else {
                  let cufe = response.document.uuid;
                  this.grabar_cufe(item, cufe);
                }
              }
            });
        });
    },
    grabar_cufe(res, cufe) {
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = `${sessionStorage.Sesion}|0|${this.print.comprobante}${cufe}|${fecha}|`;

      post
        .postData({
          url: "Ptovta/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: res.RespuestaFacse,
            estado: true,
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    format_envio(data) {
      this.card_estado = true;
      var codigo = parseInt(data.codigo);
      var descripcion = data.descripcion;
      var cliente = data.clientes.identificacion_rut;
      var factura = data.facturas;
      var prefijo = data.prefijo;
      var tipo = data.tipo.value;
      var dia = data.dia.value;
      var p_inicial = data.periodo_inicial
        ? data.periodo_inicial.replace(/\-/g, "")
        : "";
      var p_final = data.periodo_final
        ? data.periodo_final.replace(/\-/g, "")
        : "";
      var observacion = data.observacion;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/CfPrgTareas.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          "1" +
          "|" +
          cliente +
          "|" +
          tipo +
          "|" +
          prefijo +
          "|" +
          factura +
          "|" +
          p_inicial +
          "|" +
          p_final +
          "|" +
          dia +
          "|" +
          observacion +
          "|" +
          estado +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.buscarNumero();

      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
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

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfPrgTareasJ.dll",
          data: sessionStorage.Sesion + "|",
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
            text: "Error al cargar Programaciones",
            estado: true,
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    get_facturas2() {
      var rut = this.form.clientes.identificacion_rut;
      this.facturas_load = true;

      var fecha = this.$moment().format("YYYYMMDD");
      var sesion = sessionStorage.Sesion;
      var datosEnvio = sesion + "|" + "01" + "|" + rut + "|" + fecha + "|";
      post
        .postData({
          url: "PtoVta/dlls/RpVtasCliJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.facturas_load = false;
          this.ultimafactura = data;
        })
        .catch((err) => {
          this.facturas_load = false;
          this.send_error("Error al cargar facturas pendientes");
        });
    },

    format_facturas: function (val) {
      return `${val.pref_rep.trim()} - ${val.factura_rep.trim()}`;
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Financiero/dlls/CfPrgTareasN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.form.codigo = data[0].nro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    calcular_final() {
      let fecha = this.form.periodo_inicial;
      let año = fecha.substring(0, 4);
      let mes = 12;
      let dia = fecha.substring(8, 10);

      let today = new Date(año, mes, 0);
      let lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      let f_final = año.concat("-", mes);
      this.form.periodo_final = f_final;
      this.pickeFechaIni = false;
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
