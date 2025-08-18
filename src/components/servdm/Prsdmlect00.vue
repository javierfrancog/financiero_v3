3<template>
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
              <v-icon size="30" color="blue darken-4 ">mdi-variable</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualización Lecturas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
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
                  v-model="form.fecha"
                  label="Periodo"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @change="pickerMes = false, cargarciclos()"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              label="Ciclo"
              :items="ciclos"
              outlined
              clearable
              return-object
              persistent-hint
              v-model="form.ciclos"
              :item-text="format_ciclos"
              :error="errores.ciclos"
              @change="errores.ciclos = false"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="justify-end">
          <v-btn
            color="indigo"
            class="white--text mr-3"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
          <v-btn
            color="success"
            class="white--text mr-3"
            large
            depressed
            @click="agregar_item()"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Agregar Lectura
            <v-icon right dark>mdi-plus-thick</v-icon>
          </v-btn>
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
              item-key="medidor_rep"
              :search="search"
              v-model="list_select"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Lectura</span>
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
          <v-row
            class="ml-2 mr-2 mt-2"
            style="border: 1px solid #ff6f00; border-radius: 5px"
          >
            <v-col cols="12">
              <v-row>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    label="Usuario"
                    outlined
                    v-model="form.usuario"
                    hide-details
                    disabled
                    v-on="on"
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="8">
                  <v-autocomplete
                    label="Medidor"
                    v-model="form.medidor"
                    :items="usuarios"
                    :item-text="format_usuarios"
                    item-value="medidor_rep"
                    clearable
                    hide-details
                    return-object
                    outlined
                    @change="errores.medidor = false"
                    :error="errores.medidor"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="4">
                  <v-menu
                    ref="menu"
                    v-model="Picker_perini"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    required
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        label="Periodo Inicial"
                        outlined
                        v-model="form.perinicio"
                        hide-details
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.perinicio"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="4">
                  <v-menu
                    ref="menu"
                    v-model="Picker_perfin"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    required
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        label="Periodo Final"
                        outlined
                        v-model="form.perfinal"
                        hide-details
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.perfinal"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    label="Lectura Inicial"
                    outlined
                    hide-details
                    v-model="form.lectini"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    label="Lectura Final"
                    outlined
                    hide-details
                    v-model="form.lectfin"
                    @input="
                      Picker_perini = false;
                      calcular_lectura();
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    label="Consumo Actual"
                    outlined
                    disabled
                    hide-details
                    v-model="form.consumo"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    label="Factura"
                    outlined
                    hide-details
                    v-model="form.factura"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="cancelar_generar"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Actualizar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      Picker_perini: false,
      Picker_perfin: false,

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
      usuarios: [],
      contenido: [],
      ciclos: [],
      card: {
        loader: false,
        disabled: false,
      },

      search: "",
      form: {
        fecha:null
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Medidor", align: "left", value: "medidor_rep" },
        { text: "Fecha_Inicial", align: "center", value: "fechaini_rep" },
        { text: "Fecha_Final", align: "center", value: "fechafin_rep" },
        {
          text: "Lectura Anterior",
          align: "center",
          value: "lectanterior_rep",
        },
        { text: "Lectura Final", align: "center", value: "lectfinal_rep" },
        { text: "Consumo", align: "center", value: "consumo_rep" },
        { text: "Usuario", align: "left", value: "usuario_rep" },
        { text: "Apellido1", align: "center", value: "apellido1_rep" },
        { text: "Nombre", align: "center", value: "nombres_rep" },
        { text: "Factura", align: "center", value: "factura_rep" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      btnImprimir: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
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
      empresa: {},
      list_select: [],
    };
  },
  created() {
    this.infoEmpresa();
    this.cargar_usuarios();
    // this.cargarciclos();
  },
  computed: {},
  methods: {
    guardar() {
      let data = this.form;
      let periodo = data.fecha ? data.fecha.replace(/\-/g, "") : "0";
      let ciclo = data.ciclos.cod_rep;
      let medidor = data.medidor.medidor_rep.trim();
      let pinicial = data.perinicio ? data.perinicio.replace(/\-/g, "") : "0";
      let pfinal = data.perfinal ? data.perfinal.replace(/\-/g, "") : "0";
      let lectini = data.lectini ? data.lectini.trim() : "0";
      let lectfin = data.lectfin ? data.lectfin.trim() : "0";
      let factura = data.factura ? data.factura.trim() : "0";
      let usuario = data.usuario;
      let ruta = data.medidor.ruta_rep.trim();

      let datos = {
        url: "servdm/dlls/Prsdmlect00.DLL",
        data:
          sessionStorage.Sesion +
          "|" +
          periodo +
          "|" +
          ciclo +
          "|" +
          medidor +
          "|" +
          pinicial +
          "|" +
          pfinal +
          "|" +
          lectfin +
          "|" +
          lectini +
          "|" +
          usuario +
          "|" +
          ruta +
          "|" +
          factura +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.dialogo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Lectura Agregada correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    cargar_usuarios() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfusuariosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.usuarios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Usuarios",
            estado: true,
          });
        });
    },
    editar_item(item) {
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar Lectura ";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;

      this.form.usuario = parseFloat(item.usuario_rep)
      this.form.lectini = item.lectanterior_rep.trim();
      this.form.lectfin = item.lectfinal_rep.trim();

      var busqueda_medidor = this.usuarios.find(
        (el) => el.medidor_rep.trim() == item.medidor_rep.trim()
      );
      this.form.medidor = busqueda_medidor;
      this.form.perinicio = item.fechaini_rep;
      this.form.perfinal = item.fechafin_rep;
      this.form.factura = item.factura_rep.trim();
      this.calcular_lectura();
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar Lectura ";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    cancelar_generar() {
      this.dialogo.estado = false;
    },
    cargarciclos() {
      let periodo = this.form.fecha.replace(/\-/g, "")
      this.ciclos =[];

      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/CfciclosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + periodo + "|" ,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ciclos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ciclos",
            estado: true,
          });
        });
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        });
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
    cargarcontenido() {
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ciclo = this.form.ciclos.cod_rep;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/PrlecturasJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + ciclo + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Lecturas",
            estado: true,
          });
        });
    },
    format_usuarios: function (val) {
      return `${
        val.medidor_rep +
        " - " +
        val.nombres_rep.trim() +
        " - " +
        val.apellido1_rep.trim() +
        " - " +
        val.cod_rep.trim()
      } `;
    },
    calcular_lectura() {
      let lect_inicial = parseFloat(this.form.lectini);
      let lect_final = parseFloat(this.form.lectfin);

      let consumo = lect_final - lect_inicial;
      this.form.consumo = consumo;
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
