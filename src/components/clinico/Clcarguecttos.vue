<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-application-export</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue Cups a Contratos cl</v-list-item-title
              >
            </v-list-item-content>

            <v-row justify="end"> </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro"
                  hide-details
                  :loading="load.contratos"
                  v-model="contrato_select"
                  @change="get_servicios"
                  clearable
                  return-object
                  :error="errores.contrato"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar Cups
                  <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>

              <v-col>
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

                <v-btn
                  color="orange darken-2"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="subir_cargue()"
                >
                  Cargar desde Csv
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

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
              :search="search"
            >
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
            <v-col class="d-flex" cols="12" sm="6" v-if="dialogo.tipo != 1">
              <v-autocomplete
                outlined
                label="Codigo"
                v-model="selectEstudio"
                :item-text="format_cups"
                :items="cups"
                return-object
                @change="change_servicio_modal"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="3" sm="3">
              <v-text-field
                label="Servicio"
                v-model="form.codigo"
                hide-details
                outlined
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                type="text"
                required
                v-model="form.descripcion"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-select
                :items="grupos"
                label="Grupo"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.grupo"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Valor"
                clearable
                outlined
                type="text"
                required
                v-model="form.valor"
                ref="base_venta"
                prefix="$"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar"
              label="Eliminar"
              hide-details
            ></v-switch>
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
    <v-dialog v-model="dialogo.cargue" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Cargue Servicios</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="5">
              <v-file-input
                label="Buscar archivo"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept=".csv"
                v-model="adjunto"
                id="archivo_adjunto"
              ></v-file-input>
            </v-col>

            <v-col class="d-flex align-center">
              <v-btn
                color="indigo white--text"
                class
                @click="subir_archivo()"
                depressed
              >
                <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.cargue = false"
            >Cerrar</v-btn
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
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
        cargue: false,
      },

      load: {
        contratos: true,
      },
      servicio_select: {
        codigo: null,
        descripcion: null,
        total: 0,
      },

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      contrato_select: null,
      encabezado: [],
      contratos: [],
      expanded: [],
      contenido: [],
      productos: [],
      cups: [],
      grupos: [
        { text: "Rx", value: "RX" },
        { text: "Mamografia", value: "MM" },
        { text: "Ecografia", value: "EK" },
        { text: "Biopsias", value: "BP" },
        { text: "Densitometrias", value: "DT" },
        { text: "Insumos/Materiales", value: "IM" },
      ],
      selectObjEstudios: [],
      selectEstudio: null,
      adjunto: null,
      search: "",
      form: {},
      headers: [
        { text: "" },
        { text: "Codigo", align: "center", value: "codigo" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Grupo", align: "center", value: "grupo" },
        { text: "Vlr Soat", align: "center", value: "smmd_soat" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_contratos();
    this.cargarCups();
  },
  computed: {},
  methods: {
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      var data_parse = data.map((el) => {
        el.valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "Codigo",
          value: "codigo",
          format: "string",
        },
        {
          title: "Descripcion",
          value: "descripcion",
          format: "string",
        },
        {
          title: "Grupo",
          value: "grupo",
        },
        {
          title: "Valor",
          value: "valor",
          format: "money",
        },
      ];
      var contrato = this.contrato_select.detalle;

      var header_format = [
        { text: "SERVICIOS POR CONTRATO", bold: true, size: 16 },
        `Contrato: ${contrato} `,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte servicios",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `SERVICIOS SEGUN CONTRATO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    subir_cargue() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.cargue = true;
      this.dialogo.tipo = 0;
    },

    subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_FACT`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch(
          "https://server1ts.net//financiero/services/adjunto.impFact.php",
          {
            method: "POST",
            body: archivo,
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      let contrato = this.contrato_select.nro;
      post
        .postData({
          url: "Clinico/dlls/Clcfcontcsv.dll",
          data:
            sessionStorage.Sesion + "|" + contrato + "|" + nombre_adjunto + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.cargue = false;
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Servicios cargados correctamente",
            estado: true,
          });
          this.get_servicios()
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar archivo",
            estado: true,
          });
        });
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      console.log(item);
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;

      this.form.encab = item.codigo;
      this.form.codigo = item.codigo;
      // this.form.grupo = item.grupo;
      this.form.descripcion = item.descripcion;
      this.form.valor = parseInt(item.valor);

      var busqueda_grupo = this.grupos.find((el) => el.value == item.grupo);

      this.form.grupo = busqueda_grupo;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      this.format_envio(data);
    },

    format_envio(data) {
      this.loader = false;
      this.card_estado = true;
      var contrato = this.contrato_select.nro;
      var codigo = data.codigo;
      var grupo = data.grupo.value;
      var valor = parseFloat(data.valor);
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Clinico/dlls/ClCfcarguecttos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          contrato +
          "|" +
          codigo +
          "|" +
          valor +
          "|" +
          grupo +
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
          this.get_servicios();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      var lista = this.form.encab;
      this.form = {
        encab: lista,
        eliminar: false,
      };

      this.errores = {
        lista: false,
        productos: false,
      };
    },
    get_servicios() {
      var $this = this;
      this.contenido = [];
      $this.errores.contrato = false;
      if ($this.contrato_select) {
        $this.load.servicios = true;
        this.loader = true;
        post
          .postData({
            url: "Clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + $this.contrato_select.nro + "|",
            method: "POST",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data[0].servicios));
          })
          .catch((err) => {
            console.log(err)
            this.loader = false;
            $this.load.servicios = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },

    get_contratos() {
      var $this = this;
      post
        .postData({
          url: "Clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          $this.contratos = data;
          $this.load.contratos = false;
        })
        .catch((err) => {
          $this.load.contratos = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },

    format_contrato(val) {
      return (parseFloat(
        val.nro.trim()) +
        " - " +
        val.descripcion.trim() +
        "-" +
        val.detalle.trim()
      );
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      var lista = this.form.encab;
      post
        .postData({
          url: "Financiero/dlls/CfcarglistasJ.DLL",
          data: sessionStorage.Sesion + "|" + "1" + "|" + lista + "|",
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
            text: "Error al cargar clasificaciones",
            estado: true,
          });
        });
    },
    cargarCups() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfServProcJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cups = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cups",
            estado: true,
          });
        });
    },

    format_cups(val) {
      return `${val.identificacion_cups} - ${val.descripcion_cups}`;
    },

    change_servicio_modal(data) {
      if (data) {
        var copia = JSON.parse(JSON.stringify(data));
        this.form.codigo = copia.identificacion_cups.trim();
        this.form.descripcion = copia.descripcion_cups.trim();
      } else this.clear_form();
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
