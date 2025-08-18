<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-playlist-edit</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Contratos ss</v-list-item-title
              >
            </v-list-item-content>
            <v-row>
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
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
              item-key="nro"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
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
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="Rut"
                v-model="form.rut"
                :items="tablaruts"
                :item-text="format_ruts"
                item-value="item.identificacion"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Contributivo', value: 8 },
                  { text: 'Subsidiado', value: 1 },
                  { text: 'Reg.Especial', value: 3 },
                  { text: 'Plan Complementario', value: 4 },
                  { text: 'Otro', value: 9 },
                ]"
                label="Regimen"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.regimen"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
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
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Iss', value: 1 },
                  { text: 'Soat', value: 2 },
                  { text: 'Propia', value: 5 },
                ]"
                label="Tarifa"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tarifa"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="anios_select"
                label="Año Tarifa"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.anoserv"
                item-text="text"
                item-value="value"
                required
                :error="errores.anoserv"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Porcentaje"
                outlined
                v-model="form.porcentaje"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Nro Contrato (Rips)"
                clearable
                outlined
                required
                v-model="form.contrato"
                :error="errores.contrato"
                @input="errores.contrato = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Nro Poliza (Rips)"
                clearable
                outlined
                required
                v-model="form.poliza"
                :error="errores.poliza"
                @input="errores.poliza = false"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.particular"
                label="Solo Pacientes Particulares"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.rips3374"
                label="Rips 3374(Anterior)"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                :items="coberturas"
                label="Cobertura"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.cobertura"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="3">
              <v-switch v-model="form.campaña" label="Campaña"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.cargue"
                label="Cargue Masivo Cups"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-switch v-model="form.prepagada" label="M.Prepagada"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-switch v-model="form.copago" label="Sin Copago"></v-switch>
            </v-col>
          </v-row>
          <v-divider color="succes"></v-divider>
          <v-row class="px-6 mt-1 justify-center">
            <span class="subtitle-1">Documentos de soporte</span>
          </v-row>
          <v-divider class="mt-4" color="succes"></v-divider>
          <v-row>
            <v-col class="d-flex" cols="12  ">
              <v-switch v-model="form.cedula" label="Cédula"></v-switch>
              <v-switch
                v-model="form.autoriza"
                label="Solicitar Autorización"
                class="ml-6"
              ></v-switch>
              <v-switch
                v-model="form.autoriza_manual"
                label="Autorización Automatica"
                class="ml-6"
              ></v-switch>

              <v-switch
                v-model="form.hclinica"
                label="Historia Clinica"
                class="ml-12"
              ></v-switch>
              <v-switch
                v-model="form.ordenmed"
                label="Orden Médica"
                class="ml-10"
              ></v-switch>
            </v-col>
          </v-row>

          <v-divider color="succes"></v-divider>
          <v-row>
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
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      search: "",
      form: {},
      coberturas: [
        {
          text: "Plan de beneficios en salud financiado con UPC -1-",
          value: 1,
        },
        { text: "Presupuesto máximo", value: 2 },
        { text: "Prima EPS / EOC, no asegurados SOAT", value: 3 },
        { text: "Cobertura Póliza SOAT", value: 4 },
        { text: "Cobertura ARL", value: 5 },
        { text: "Cobertura ADRES", value: 6 },
        { text: "Cobertura Salud Pública", value: 7 },
        {
          text: "Cobertura entidad territorial, recursos de oferta",
          value: 8,
        },
        { text: "Urgencias población migrante", value: 9 },
        { text: "Plan complementario en salud", value: 10 },
        { text: "Plan medicina prepagada", value: 11 },
        { text: "Otras pólizas en salud", value: 12 },
        {
          text: "Cobertura Régimen Especial o Excepción",
          value: 13,
        },
        {
          text: "Cobertura Fondo Nacional de Salud de las Personas Privadas de la Libertad",
          value: 14,
        },
        { text: "Particular", value: 15 },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        {
          text: "Codigo",
          align: "center",
          value: "nro",
          class: "indigo--text blue lighten-5",
        },
        { text: "Entidad", align: "left", value: "descripcion" },
        { text: "Régimen", align: "left", value: "detalle" },
        { text: "Base Tarifa", align: "left", value: "descrtarifa" },
        { text: "Copago", align: "center", value: "liqcopago" },
        { text: "Rips_3374", align: "center", value: "rips3374" },

        { text: "Estado", align: "center", value: "estado_ubic" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        entidad: false,
        estado: false,
        contrato: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargar_años();
    this.cargarcontenido();
    this.cargarTablaruts();
  },
  computed: {},
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 23; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 5; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.nro;

      var busqueda_rut = this.tablaruts.find(
        (el) => parseInt(el.identificacion_rut.trim()) == item.identificacion
      );
      this.form.rut = busqueda_rut;
      this.form.tarifa = { value: parseInt(item.tarifa) };
      this.form.anoserv = { value: parseInt(item.ano) };
      this.form.porcentaje = data.porc.trim();

      this.form.regimen = { value: parseInt(item.Regimen) };
      this.form.descripcion = item.detalle;
      this.form.contrato = data.contrato.trim();
      this.form.particular = item.particular == "1" ? true : false;
      this.form.rips3374 = item.rips3374 == "1" ? true : false;
      this.form.campaña = item.campana == "1" ? true : false;
      this.form.prepagada = item.prepagada == "1" ? true : false;
      this.form.estado = item.estado_ubic == "1" ? true : false;
      this.form.cedula = item.cedula == "1" ? true : false;
      this.form.autoriza = item.autoriza == "1" ? true : false;
      this.form.autoriza_manual = item.autormanual == "1" ? true : false;
      this.form.hclinica = item.hclinica == "1" ? true : false;
      this.form.ordenmed = item.ordenm == "1" ? true : false;
      this.form.copago = item.liqcopago == "1" ? true : false;
      this.form.poliza = item.poliza.trim();
      let busqueda = this.coberturas.find(
        (el) => parseInt(el.value) == parseInt(item.cobertura)
      );
      this.form.cobertura = busqueda;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var cliente = data.rut.identificacion_rut;
      var regimen = data.regimen.value;
      var tarifa = data.tarifa.value;
      var porc = data.porcentaje.trim();
      var ano = data.anoserv.value;
      var detalle = this.form.descripcion;
      var cargue = data.cargue ? "1" : "0";
      var particular = data.particular ? "1" : "0";
      var rips3374 = data.rips3374 ? "1" : "0";
      var campana = data.campaña ? "1" : "0";
      var prepagada = data.prepagada ? "1" : "0";
      let cedula = data.cedula ? "1" : "0";
      let autoriza = data.autoriza ? "1" : "0";
      let autormanual = data.autoriza_manual ? "1" : "0";
      let hclinica = data.hclinica ? "1" : "0";
      let ordenmed = data.ordenmed ? "1" : "0";
      let copago = data.copago ? "1" : "0";
      let contrato = data.contrato.trim();
      let poliza = data.poliza.trim();
      let cobertura = data.cobertura ? data.cobertura.value : 0;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Clinico/dlls/ClCfcontratos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          cliente +
          "|" +
          regimen +
          "|" +
          detalle +
          "|" +
          campana +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          tarifa +
          "|" +
          porc +
          "|" +
          cargue +
          "|" +
          ano +
          "|" +
          prepagada +
          "|" +
          "0001" +
          "|" +
          cedula +
          "|" +
          autoriza +
          "|" +
          hclinica +
          "|" +
          ordenmed +
          "|" +
          copago +
          "|" +
          autormanual +
          "|" +
          contrato +
          "|" +
          particular +
          "|" +
          poliza +
          "|" +
          rips3374 +
          "|" +
          cobertura +
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
          url: "Clinico/dlls/titCL304JL.dll",
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
            text: "Error al cargar Contratos",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Clinico/dlls/ClCfContratosN.dll",
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

    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut.trim()} - ${val.descripcion_rut}`;
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
