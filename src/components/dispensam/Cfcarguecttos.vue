<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-check-underline-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue Medicamentos a Contratos</v-list-item-title
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
                  label="Contrato"
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro_rep"
                  hide-details
                  :loading="load.contratos"
                  v-model="form.contrato_select"
                  @change="get_servicios"
                  clearable
                  return-object
                  :error="errores.contrato"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="mb-4 mr-5"
                cols="3"
                v-if="this.form.contrato_select"
              >
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar Medicamento
                  <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>

              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 ml-5 white--text px-12"
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

              <template v-slot:item.elimina="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
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
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.select_molecula"
                @change="get_nivel(1)"
                label="Molécula"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.select_producto"
                @change="get_nivel(2)"
                label="Nivel Producto"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" v-if="this.form.select_molecula">
              <v-autocomplete
                outlined
                label="Agrp Molécula"
                v-model="form.agrpmolecula"
                :item-text="format_agrpmolecula"
                :items="agrpmolecula"
                :error="errores.agrpmolecula"
                @change="errores.agrpmolecula = false"
                return-object
                clearable
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="12" v-if="this.form.select_producto">
              <v-autocomplete
                outlined
                label="Producto"
                v-model="form.producto"
                :item-text="format_medicamento"
                :items="medicamentos"
                :error="errores.producto"
                @change="errores.producto = false"
                return-object
                clearable
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Valor Pactado"
                hide-details
                v-money="money"
                v-model="form.valor"
                :error="errores.valor"
                @change="errores.valor = false"
                ref="base_venta"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Cum Pactado"
                hide-details
                v-model="form.cum"
                :error="errores.cum"
                @input="errores.cum = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Codigo Eps"
                hide-details
                v-model="form.codeps"
                :error="errores.codeps"
                @input="errores.codeps = false"
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
            color="indigo white--text"
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
          <span class="title col-12"
            >Cargue Servicios(Archivo Separado pr Punto y coma ;)</span
          >
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
    <v-dialog
      v-model="dialogo_confirma.estado"
      persistent
      width="600"
      height="200"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"></v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          <v-row justify="center">
            <v-col class="d-flex justify-center" cols="12">
              <span class="title col-12">{{ dialogo_confirma.titulo }}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-row justify="center">
          <v-col class="d-flex justify-center" cols="6">
            <v-card-text class="text-h6"> Eliminar Medicamento?</v-card-text>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row justify="center">
            <v-col class="d-flex justify-center" cols="2">
              <v-btn
                color="red"
                variant="text"
                @click="dialogo_confirma.estado = false"
                class="white--text"
              >
                Cancelar
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center" cols="8">
              <v-btn
                color="green"
                variant="text"
                @click="get_eliminar()"
                class="white--text"
              >
                Aceptar
              </v-btn>
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
      loader: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogo_confirma: {
        estado: false,
        titulo: null,
        tipo: null,
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
      form: {
        medicamento: null,
        valor: null,
        select_molecula: false,
        select_producto: false,
      },

      item_select: [],
      agrpmolecula: [],
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      contrato_select: null,
      encabezado: [],
      contratos: [],
      expanded: [],
      datosEmpresa: [],
      contenido: [],
      medicamentos: [],
      tipo_select: false,
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

      headers: [
        { text: "" },
        { text: "Codigo", align: "center", value: "codigo" },
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Cum", align: "left", value: "cumcontrato" },
        { text: "Cum Eps", align: "left", value: "codintenro" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Tipo", align: "left", value: "descrivel" },
        { text: "Eliminar", value: "elimina", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        contrato: false,
        cum: false,
        codeps: false,
        valor: false,
        agrpmolecula: false,
        producto: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();

    this.get_contratos();
    this.get_medicamentos();

    this.get_agrpmolecula();
  },
  computed: {},
  methods: {
    get_nivel(tipo) {
      if (tipo == 1) {
        if (this.form.select_molecula) {
          this.form.select_producto = false;
        } else {
          this.form.select_producto = true;
        }
      }
      if (tipo == 2) {
        if (this.form.select_producto) {
          this.form.select_molecula = false;
        } else {
          this.form.select_molecula = true;
        }
      }
      this.form.agrpmolecula = null;
      this.form.producto = null;
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_medicamentos() {
      this.form.eliminar = false;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentoLtJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });
          this.medicamentos = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },

    get_medicamentos_json() {
      this.loader = true;
      let ciudad = this.datosEmpresa.codciudad_empr;
      let id = this.datosEmpresa.id_empr;
      let ruta = "Datos/Base/MEDICAMENTOS.JSON";
      post
        .postData({
          url: ruta,
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.loader = false;
          var data_parse = data;
          this.medicamentos = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar productos",
            estado: true,
          });
        });
    },
    get_servicios() {
      var $this = this;
      this.contenido = [];
      $this.errores.contrato = false;
      if ($this.form.contrato_select) {
        $this.load.servicios = true;
        this.loader = true;
        post
          .postData({
            url: "Dispensa/dlls/ClCfcarguecttosJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              $this.form.contrato_select.nro_rep +
              "|",
            method: "POST",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data[0].servicios));
            this.contenido.pop();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            $this.load.servicios = false;
            $this.$emit("snack", {
              color: "error",
              text: "Sin servicios para cargue",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    anular_item(item) {
      this.item_select = item;
      this.dialogo_confirma.estado = true;
      this.dialogo_confirma.titulo = item.descripcion.trim();
    },
    get_eliminar() {
      let codigo = this.item_select.codigo.trim();
      let contrato = this.form.contrato_select.nro_rep;
      let tipo = this.item_select.tipo;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/PrCarguectoX.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            contrato +
            "|" +
            codigo +
            "|" +
            tipo +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let msg = data[0];
          this.$emit("snack", {
            color: "success",
            text: msg,
            estado: true,
          });
          this.dialogo_confirma.estado = false;
          this.get_servicios();
        })
        .catch((err) => {
          console.log(err);
          this.dialogo.estado = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al Eliminar AgrpMoleculas",
            estado: true,
          });
          this.loader = false;
        });
    },
    get_agrpmolecula() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.agrpmolecula = data;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      var data_parse = data.map((el) => {
        el.valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "Nivel",
          value: "descrivel",
          format: "string",
        },

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
          title: "Cum Pactado",
          value: "cumcontrato",
        },
        {
          title: "Codigo Eps",
          value: "codintenro",
        },

        {
          title: "Valor",
          value: "valor",
          format: "money",
        },
      ];
      var contrato =
        this.form.contrato_select.descripcion_rep.trim() +
        " " +
        this.form.contrato_select.detalle_rep.trim();

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
      if (!this.form.contrato_select) {
        this.errores.contrato = true;
        this.send_error("Debe Seleccionar un Contrato!");
      } else {
        this.form.estado = 0;
        this.dialogo.cargue = true;
        this.dialogo.tipo = 0;
      }
    },
    subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_DISP`;
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
      let contrato = this.form.contrato_select.nro_rep;
      post
        .postData({
          url: "Dispensa/dlls/Clcfcontcsv.dll",
          data:
            sessionStorage.Sesion + "|" + contrato + "|" + nombre_adjunto + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.get_servicios();
          this.dialogo.cargue = false;

          this.$emit("snack", {
            color: "success",
            text: "Servicios cargados correctamente",
            estado: true,
          });
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
      this.item_select = JSON.parse(JSON.stringify(data));
      let busqueda = null;

      this.dialogo.estado = true;
      this.dialogo.titulo =
        "Modificar Registro " + this.item_select.descripcion.trim();
      this.dialogo.tipo = 1;

      this.form.valor = this.item_select.valor.trim();
      this.form.cum = this.item_select.cumcontrato.trim();
      this.form.codeps = this.item_select.codintenro.trim();
      if (this.item_select.descrivel.trim() == "N2") {
        this.form.select_molecula = true;
        busqueda = this.agrpmolecula.find(
          (el) => el.codigo_rep == this.item_select.codigo
        );
        this.form.agrpmolecula = busqueda;
      } else {
        this.form.select_molecula = false;
        this.form.select_producto = true;
        busqueda = this.medicamentos.find(
          (el) => el.cod_rep == this.item_select.codigo
        );
        this.form.producto = busqueda;
      }
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let valor = data.valor.replace(/\,/g, "");
      let tipo = data.select_molecula ? "1" : "2";

      if (tipo == 2 && !data.producto) {
        this.errores.producto = true;
        this.send_error("Error en Producto!");
      } else if (tipo == 1 && !data.agrpmolecula) {
        this.errores.agrpmolecula = true;
        this.send_error("Error en Molecula!");
      } else if (valor < 1) {
        this.errores.valor = true;
        this.send_error("Error en valor!");
      } else if (!data.cum) {
        this.errores.cum = true;
        this.send_error("Error en Cum Pactado!");
      } else if (!data.codeps) {
        this.errores.codeps = true;
        this.send_error("Error en Codigo Eps!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.loader = false;
      this.card_estado = true;
      let tipo = data.select_molecula ? "1" : "2";
      let codigo = "";
      if (tipo == 2) {
        codigo = data.producto.cod_rep.trim();
      } else {
        codigo = this.form.agrpmolecula.codigo_rep.trim();
      }
      var contrato = this.form.contrato_select.nro_rep;
      var valor = data.valor.replace(/\,/g, "");
      let cum = data.cum;
      let codinterno = data.codeps;
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Dispensa/dlls/ClCfcarguecttos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          contrato +
          "|" +
          codigo +
          "|" +
          valor +
          "|" +
          "MD" +
          "|" +
          cum +
          "|" +
          codinterno +
          "|" +
          eliminar +
          "|" +
          tipo +
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
      // this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.form.producto = null;
      this.form.agrpmolecula = null;
      this.form.valor = null;
      this.form.cum = null;
      this.form.codeps = null;
      console.log(this);
    },
    init_form() {
      // var lista = this.form.encab;
      // this.form = {
      //   encab: lista,
      //   eliminar: false,
      //   valor: 0,
      // };

      this.errores = {
        lista: false,
        productos: false,
      };
    },
    get_contratos() {
      post
        .postData({
          url: "Dispensa/dlls/PrEnccontratoJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.contratos = data;
          this.load.contratos = false;
        })
        .catch((err) => {
          console.log(err);
          this.load.contratos = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },

    format_contrato(val) {
      return val.descripcion_rep + "-" + val.detalle_rep;
    },
    format_agrpmolecula(val) {
      return val.descripcion_rep;
    },
    format_medicam(val) {
      return `${val.descripcion_rep.trim()} - ${val.descriplaboratorio_rep.trim()} - ${val.cum_rep.trim()} `;
    },

    format_medicamento(val) {
      return `${val.descripcion_rep}`;
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
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
