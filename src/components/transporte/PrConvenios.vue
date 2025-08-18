<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-greeting-proximity</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Convenios</v-list-item-title>
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Listado Autorizaciones
                <v-icon right dark class="ml-4"
                  >mdi-tooltip-check-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="mt-4" cols="12">
                <v-divider></v-divider>
                <h3 class="ml-4 mt-2 text-subtitle-1">
                  INFORMACION DEL PASAJERO
                </h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  :items="convenios"
                  label="Convenio"
                  outlined
                  clearable
                  hide-details
                  v-model="form.convenio"
                  item-value="value"
                  required
                  :error="errores.convenio"
                  @change="errores.ciudadorig = false"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  label="Identificacion"
                  v-model="form.idpasaj"
                  outlined
                  hide-details
                  filled
                  :error="errores.idpasaj"
                  @change="errores.idpasaj = false"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Nombres y Apellidos"
                  v-model="form.descrpasaj"
                  outlined
                  hide-details
                  :error="errores.descrpasaj"
                  @change="errores.descrpasaj = false"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Telefono"
                  v-model="form.telpasaj"
                  outlined
                  hide-details
                  :error="errores.telpasaj"
                  @change="errores.telpasaj = false"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mt-4" cols="12">
                <v-divider></v-divider>
                <h3 class="ml-4 mt-2 text-subtitle-1">INFORMACION DEL VIAJE</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Ciudad Origen"
                  v-model="form.ciudadorig"
                  clearable
                  :items="municipios"
                  item-value="value"
                  outlined
                  :error="errores.ciudadorig"
                  @change="errores.ciudadorig = false"
                  hide-details
                >
                </v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Ciudad Destino"
                  v-model="form.ciudaddest"
                  :items="municipios"
                  clearable
                  item-value="value"
                  outlined
                  :error="errores.ciudaddest"
                  @change="errores.ciudaddest = false"
                  hide-details
                >
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
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
                      label="Fecha de Viaje"
                      append-icon="event"
                      hide-details
                      :error="errores.fecha"
                      @input="errores.fecha = false"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="
                      pickerFecha = false;
                      errores.fecha = false;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Cantidad"
                  v-model="form.cantidad"
                  outlined
                  hide-details
                  :error="errores.cantidad"
                  @change="errores.cantidad = false"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-menu
                  v-model="pickerFechavence"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechavence"
                      label="Fecha de Vencimiento"
                      append-icon="event"
                      hide-details
                      :error="errores.fechavence"
                      @input="errores.fechavence = false"
                      outlined
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechavence"
                    @input="
                      pickerFechavence = false;
                      errores.fechavence = false;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <v-text-field
                  label="Nro. Orden"
                  v-model="form.orden"
                  outlined
                  hide-details
                  :error="errores.orden"
                  @change="errores.orden = false"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Funcionario que Ordena"
                  v-model="form.funcionario"
                  outlined
                  hide-details
                  :error="errores.funcionario"
                  @change="errores.funcionario = false"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2 px-4"
              color="success"
              depressed
              large
              @click="guardar()"
              >Guardar Autorizacion</v-btn
            >
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="Nro. Orden"
                v-model="form.cons_orden"
                outlined
                hide-details
                clearable
              >
              </v-text-field>
            </v-col>

            <v-col cols="3">
              <v-text-field
                label="Identificacion"
                v-model="form.cons_idpasaj"
                outlined
                hide-details
                filled
                clearable
              >
              </v-text-field>
            </v-col>

            <v-btn
              color="orange"
              class="ma-2 white--text"
              large
              depressed
              @click="consultar()"
            >
              Listado Autorizaciones
              <v-icon right dark class="ml-4">mdi-tooltip-check-outline</v-icon>
            </v-btn>
            <v-btn
              depressed
              color="green darken-2"
              class="ma-2 white--text"
              large
              @click="imprimir_excel"
            >
              Imprimir EXCEL
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="contenido"
            :search="search"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
            item-key="nro_rep"
            class="elevation-1"
          >
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="orange--text text-left">Observacion</th>
                        <th class="orange--text text-left">Operador</th>
                        <th class="orange--text text-rigth">Fecha</th>
                        <th class="orange--text text-rigth">Acompañante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-left">{{ item.detalleuso_rep }}</td>
                        <td class="text-left">{{ item.useruso_rep }}</td>
                        <td class="text-center">{{ item.fechauso_rep }}</td>
                        <td class="text-left">{{ item.nombreacomp_rep }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </td>
            </template>

            <template v-slot:item.edit="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="aprobar_item(item)"
                    color="blue accent-3"
                    fab
                    small
                    icon
                    v-on="on"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Aprobar</span>
              </v-tooltip>
            </template>

            <template v-slot:item.estado_rep="{ item }">{{
              item.estado_rep == "1" ? "Autorizado" : "Activo"
            }}</template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="cerrar()"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoauto.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Aprobar Autorizacion </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="5">
              <v-text-field
                label="Nro. Orden"
                v-model="form.ordenauto"
                outlined
                hide-details
                disabled
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="Acompañante Id"
                v-model="form.idacomp"
                outlined
                hide-details
                filled
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Acompañante Nombres y Apellidos "
                v-model="form.descracomp"
                outlined
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Acompañante Telefono"
                v-model="form.telacomp"
                outlined
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Observaciones"
                v-model="form.observ"
                outlined
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4 white--text"
            color="red"
            depressed
            large
            @click="cerrar_auto()"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4 white--text"
            color="indigo"
            depressed
            large
            @click="grabar_auto()"
            >Grabar</v-btn
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoauto: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      pickerFecha: false,
      pickerFechavence: false,
      pickerHora: false,

      convenios: [
        { text: "1. Brasilia", value: 1 },
        { text: "2. Red Bus", value: 2 },
        { text: "3. PinBus", value: 3 },
        { text: "4. Gamarra", value: 11 },
      ],
      embarques: [],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      expanded: [],
      singleExpand: true,
      contenido: [],
      municipios: [],
      ciudades_dian: [],
      departamentos: [],
      punto_taquilla: [],

      search: "",
      form: {},

      headers: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Autorizacion", align: "center", value: "nroautor_rep" },
        { text: "Orden", align: "center", value: "nroorden_rep" },
        { text: "Pasajero", align: "center", value: "nombrepasajero_rep" },
        { text: "Origen", align: "center", value: "CiudadOrig" },
        { text: "Destino", align: "center", value: "CiudadDest" },
        { text: "Aprobar", align: "center", value: "edit" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      errores: {
        departamento: false,
        ciudad: false,
        convenio: false,
        idpasaj: false,
        descrpasaj: false,
        telpasaj: false,
        ciudadorig: false,
        ciudaddest: false,
        fecha: false,
        cantidad: false,
        fechavence: false,
        orden: false,
        funcionario: false,
      },
      primerError: null,

      card_estado: false,
      embarquesIguales: false,

      mostrarOrigen: true,
    };
  },
  created() {
    let punto_taquilla = sessionStorage.llave_punto;
    let data = JSON.parse(atob(punto_taquilla));
    this.punto_taquilla.codigo = data.id;

    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargarCiudades();
  },
  methods: {
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];

      data_parse = [...data];

      let columnas = [
        {
          title: "Consecutivo",
          value: "nro_rep",
        },
        {
          title: "Pasajero",
          value: "nombrepasajero_rep",
          format: "string",
        },
        {
          title: "Orden",
          value: "nroorden_rep",
        },
        {
          title: "Origen",
          value: "CiudadOrig",
          format: "string",
        },
        {
          title: "Destino",
          value: "CiudadDest",
        },
        {
          title: "Autorizacion",
          value: "nroautor_rep",
          format: "string",
        },
        {
          title: "Autorizador",
          value: "autorizador_rep",
          format: "string",
        },
        {
          title: "Observaciones",
          value: "detalleuso_rep",
          format: "string",
        },


        {
          title: "Estado",
          value: "porc_puc",
        },
      ];

      let header_format = [
        { text: "REPORTE DE AUTORIZACIONES", bold: true, size: 16 },
        "",
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Autorizaciones",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE AUTORIZACIONES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultar() {
      let orden = this.form.cons_orden ? this.form.cons_orden : "";
      let idpasaj = this.form.cons_idpasaj ? this.form.cons_idpasaj : "0";
      let convenio = this.form.convenio;
      this.card_estado = true;

      this.contenido = [];
      let datos = {
        url: "/transporte/dlls/PrConvtr01J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          idpasaj +
          "|" +
          orden +
          "|" +
          convenio +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((data) => {
          data.pop();
          this.card_estado = false;
          this.contenido = data;
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al consultar Registro");
        });
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          let municipios = [];
          this.ciudades_dian = data.departamentos;
          for (var item of data.departamentos) {
            let ciudades = item.municipios.map((el) => {
              el.departamento = item.departamento;
              return el;
            });

            municipios = municipios.concat(ciudades);
          }

          municipios.forEach((k) => {
            this.municipios.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio + " - " + k.departamento.trim(),
            });
          });
        })
        .catch((err) => {
          console.error("error", err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.convenio) {
        this.send_error("Debe Seleccionar un Convenio");
        this.errores.convenio = true;
      } else if (!data.idpasaj) {
        this.errores.idpasaj = true;
        this.send_error("Debe registrar una identificación");
      } else if (!data.descrpasaj) {
        this.errores.descrpasaj = true;
        this.send_error("Debe registrar una descripcion");
      } else if (!data.telpasaj) {
        this.errores.telpasaj = true;
        this.send_error("Debe registrar un telefono");
      } else if (!data.ciudadorig) {
        this.errores.ciudadorig = true;
        this.send_error("Debe registrar un origen");
      } else if (!data.ciudaddest) {
        this.errores.ciudaddest = true;
        this.send_error("Debe registrar un destino");
      } else if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Debe registrar una fecha");
      } else if (!data.cantidad) {
        this.errores.cantidad = true;
        this.send_error("Debe registrar una cantidad");
      } else if (!data.fechavence) {
        this.errores.fechavence = true;
        this.send_error("Debe registrar un Vencimiento");
      } else if (!data.orden) {
        this.errores.orden = true;
        this.send_error("Debe registrar un nemro de orden");
      } else if (!data.funcionario) {
        this.errores.funcionario = true;
        this.send_error("Debe registrar Funcionario");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      let convenio = this.form.convenio;
      let idpasaj = this.form.idpasaj;
      let descrpasaj = this.form.descrpasaj;
      let telpasaj = this.form.telpasaj;
      let ciudadorig = this.form.ciudadorig;
      let ciudaddest = this.form.ciudaddest;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let cantidad = this.form.cantidad;
      let fechavence = this.form.fechavence;
      let orden = this.form.orden;
      let funcionario = this.form.funcionario;

      let datos = {
        url: "/transporte/dlls/PrConvtr.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          convenio +
          "|" +
          idpasaj +
          "|" +
          descrpasaj +
          "|" +
          cantidad +
          "|" +
          orden +
          "|" +
          "0" +
          "|" +
          funcionario +
          "|" +
          ciudadorig +
          "|" +
          ciudaddest +
          "|" +
          "" +
          "0" +
          "|" +
          fechavence +
          "|" +
          telpasaj +
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
        })
        .catch((error) => {
          console.log(error);

          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    agregar_item() {
      if (!this.form.convenio) {
        this.send_error("Selecciona un convenio");
      } else {
        this.dialogo.titulo = "Consultar Autorización";
        this.dialogo.estado = true;
        this.dialogo.tipo = 0;
        this.contenido = [];
      }
    },

    cerrar() {
      this.dialogo.estado = false;
    },
    aprobar_item(item) {
      this.dialogoauto.estado = true;
      this.form.ordenauto = item.nro_rep.trim();
      this.form.idacomp = item.idacomp_rep.trim();
      this.form.descracomp = item.nombreacomp_rep.trim();
      this.form.telacomp = item.telefacomp_rep.trim();
    },
    grabar_auto() {
      let agencia = this.punto_taquilla.codigo;
      let orden = this.form.ordenauto ? this.form.ordenauto : "0";
      let observ = this.form.observ;
      let idacomp = this.form.idacomp;
      let descracomp = this.form.descracomp;
      let telacomp = this.form.telacomp;

      this.contenido = [];
      let datos = {
        url: "/transporte/dlls/PrConvtrM.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "0" +
          "|" +
          orden +
          "|" +
          observ +
          "|" +
          agencia +
          "|" +
          idacomp +
          "|" +
          descracomp +
          "|" +
          telacomp +
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
          this.dialogoauto.estado = false;
          this.dialogo.estado = false;
          this.form.observ = [];
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    cerrar_auto() {
      this.dialogoauto.estado = false;
    },
    init_form() {
      this.form = {};
      this.errores = {
        tipo: false,
        origen: false,
        destino: false,
        hora: false,
        vehiculo: false,
        conductor: false,
      };
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
