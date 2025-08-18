<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Declaración Anual Impuesto de Industria y
                    Comercio</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/ICA.png"
                  contain
                  width="400"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
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
                  v-model="form.fechaini"
                  label="Periodo Corte"
                  append-icon="event"
                  hide-details
                  required
                  v-on="on"
                  autocomplete="off"
                  @input="this.form.fechafin = this.form.fechaini"
                  :error="errores.fechaini"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaini"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechaini = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-autocomplete
              label="Departamento"
              v-model="form.departamento"
              :items="departamentos"
              item-value="value"
              :error="errores.departamento"
              @change="
                errores.departamento = false;
                get_municipios();
              "
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-autocomplete
              label="Ciudad"
              v-model="form.ciudad"
              :items="filterMunicipios"
              item-value="value"
              :error="errores.ciudad"
              @change="errores.ciudad = false"
              hide-details
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
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
          <div v-if="this.contenido.length != 0">
            <v-btn
              color="success"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="cargaranexos"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Descargar Anexos
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </div>
          <div v-if="this.contenido.length != 0">
            <v-btn
              color="red lighten-1"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              @click="imprimir_pdf"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Imprimir
              <v-icon right dark>print</v-icon>
            </v-btn>
          </div>
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              primary
            ></v-data-table>
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
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { declaracion_impuesto } from "../../_formatos.pdf";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      pickerMesfin: false,
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
      contenido: [],
      empresa: {},
      anexos: [],
      filterMunicipios: [],
      ciudades_dian: [],
      departamentos: [],

      ruts: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        // { text: "Renglon", align: "left", value: "renglon_for" },
        { text: "Descripción", align: "left", value: "descriptot_for" },
        { text: "Valor", align: "center", value: "totingre_for" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        departamento: false,
        ciudad: false,
        fechafin: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
    };
  },
  created() {
    this.get_empresa();
    this.get_ruts();
    this.cargarCiudades();
  },
  computed: {},
  methods: {
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },
    get_municipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k, v) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    get_empresa() {
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },

    cargarcontenido() {
      if (!this.form.fechaini) {
        this.errores.fechaini = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo inicial",
          estado: true,
        });
      } else {
        var fechaini = this.form.fechaini
          ? this.form.fechaini.replace(/\-/g, "")
          : "";
        var municipio = this.form.ciudad;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpIcaAnualJ.dll",
            data:
              sessionStorage.Sesion + "|" + fechaini + "|" + municipio + "|",
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
              text: "Error al cargar Datos Ica",
              estado: true,
            });
          });
      }
    },

    cargaranexos() {
      if (!this.form.fechaini) {
        this.errores.fechaini = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar periodo inicial",
          estado: true,
        });
      } else {
        var fecha = this.form.fechaini
          ? this.form.fechaini.replace(/\-/g, "")
          : "";
        var municipio = this.form.ciudad;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpIcaAnualAJ.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + municipio + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.anexos = JSON.parse(JSON.stringify(data));
            this.print_reporte_excel();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },

    imprimir_pdf() {
      let departamento = "";
      let ciudad = "";

      this.ciudades_dian.forEach(d => {
        if (d.codigo == this.form.departamento) {
          departamento = d.departamento
          d.municipios.forEach(m => {
            if (m.c_digo_dane_del_municipio == this.form.ciudad) ciudad = m
          })
        }
      })

      let data = {
        municipio: ciudad.municipio,
        departamento: departamento,
        fecha_maxima: this.$moment().format("YYYY-MM-DD"),
        fecha_ini: this.form.fechaini.substr(0, 4),
        nombre_cont: this.empresa.descrip_empr,
        tipoid_cont: this.empresa.tipo_id,
        id_cont: parseFloat(this.empresa.id_empr),
        direccion_cont: this.empresa.direccion_empr,
        ciudad_cont: [this.empresa.codciudad_empr, this.empresa.Ciudad],
        departamento_cont: this.empresa.Departamento,
        telefono_cont: this.empresa.telefono_empr,
        email_cont: this.empresa.email_empr,
        registros: [...this.contenido]
      };

      var logo_src = require(`../../assets/image/logos/logovcio.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        declaracion_impuesto(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },

    print_reporte_excel() {
      var data = this.anexos;
      var data_parse = [];

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        if (el.index || typeof el.index == "number") {
          copia.valoringre_for =
            parseFloat(el.valoringre_for.replace(/\,/g, "")) || 0;
          copia.valordevol_for =
            parseFloat(el.valordevol_for.replace(/\,/g, "")) || 0;
        }

        data_parse.push(copia);
      });
      data_parse.pop();

      var columnas = [
        {
          title: "Codigo Municipio",
          value: "ciudad_for",
        },
        {
          title: "Nombre Municipio",
          value: "desciudad_for",
        },

        {
          title: "Descripcion Renglon",
          value: "descrenglon_for",
        },
        {
          title: "Cuenta",
          value: "puc_for",
        },
        {
          title: "Descripcion Cuenta",
          value: "descripuc_for",
        },

        {
          title: "Descripcion",
          value: "descriprut_for",
        },
        {
          title: "Vlr ingreso",
          value: "valoringre_for",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Devolución",
          value: "valordevol_for",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];

      var fecha_inicial = this.form.fechaini;
      var header_format = [
        { text: "ANEXO ICA ANUAL", bold: true, size: 16 },
        `Periodo: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/logos/ICA.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo Ica Anual",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `ANEXO ICA ANUAL-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    formatMesLetras: function (fecha) {
      let mes = new Date(0, parseInt(fecha.substr(4, 2)), 0);
      return this.$moment(mes).format("MMMM");
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
<style>
#rpformrtefte .v-data-table__wrapper table tbody tr:nth-child(even) {
  background-color: #e2f8e3 !important;
}
</style>
