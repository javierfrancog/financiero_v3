<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-group-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Ruts</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex justify-end">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="imprimir_excel"
                >
                  Imprimir EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>

              <v-col class="d-flex justify-end">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar
                  <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row> </v-row>
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
              :items="clientes"
              item-key="identificacion_rut"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.relacion_rut="{ item }">
                {{ format_relacion(item.relacion_rut).text }}
              </template>

              <template v-slot:item.edit="{ item }">
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
                  <span>Editar Rut</span>
                </v-tooltip>
              </template>
              <template v-slot:item.subir_sop="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="subir_soportes(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir soportes</span>
                </v-tooltip>
              </template>
              <template v-slot:item.bajar_sop="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="descargar_soportes(item)"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-download-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar soportes</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-select
                :items="[
                  { text: 'Nit', value: 31 },
                  { text: 'Cedula', value: 13 },
                  { text: 'Pasaporte', value: 41 },
                  { text: 'Permiso Esp.Permanencia', value: 47 },
                  { text: 'Cedula Extranjería', value: 21 },
                  { text: 'Registro Civil', value: 11 },
                  { text: 'Tarjeta Identidad', value: 12 },

                  { text: 'Documento de identificación extranjero', value: 42 },
                  { text: 'NIT de otro país', value: 50 },
                ]"
                label="Tipo identificacion"
                outlined
                clearable
                v-model="form.tipoid"
                required
                :error="errores.tipoid"
                @change="
                  errores.tipoid = false;
                  form.rsocial = null;
                  form.apellido1 = null;
                  form.apellido2 = null;
                  form.nombres = null;
                  consultar_nro_nit();
                "
                hide-details
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Numero Identificación"
                clearable
                outlined
                type="text"
                required
                v-model="form.numero"
                :error="errores.numero"
                @input="errores.numero = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex align-center justify-center">
              <v-btn
                color="success accent-4 white--text"
                class
                @click="get_rut_dian()"
                depressed
              >
                <v-icon size="25" left>mdi-alpha-d-circle-outline</v-icon>
                Consultar Dian
              </v-btn>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="D.V."
                clearable
                outlined
                type="text"
                required
                v-model="form.dv"
                :error="errores.dv"
                @input="errores.dv = false"
                hide-details
                :disabled="form.tipoid == 42"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex mt-2" cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="orange white--text"
                    v-bind="attrs"
                    v-on="on"
                    @click="calculardv()"
                    depressed
                  >
                    <v-icon size="25" left>mdi-autorenew</v-icon>
                  </v-btn>
                </template>
                <span>Calcular dígito de verificación</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <v-row
            v-if="
              form.tipoid
                ? form.tipoid.value == 31 ||
                  form.tipoid == 31 ||
                  form.tipoid.value == 42 ||
                  form.tipoid == 42 ||
                  form.tipoid.value == 50 ||
                  form.tipoid == 50
                : false
            "
          >
            <v-col class="d-flex" cols="12" sm="12">
              <v-text-field
                label="Razón Social"
                clearable
                outlined
                required
                v-model="form.rsocial"
                :error="errores.rsocial"
                @input="errores.rsocial = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            v-if="
              form.tipoid
                ? form.tipoid.value == 13 ||
                  form.tipoid == 13 ||
                  form.tipoid == 11 ||
                  form.tipoid == 12 ||
                  form.tipoid == 21 ||
                  form.tipoid == 41 ||
                  form.tipoid == 47
                : false
            "
          >
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Primer Apellido"
                clearable
                outlined
                required
                v-model="form.apellido1"
                :error="errores.apellido1"
                @input="
                  errores.apellido1 = false;
                  form.apellido1 = form.apellido1.toUpperCase();
                "
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Segundo Apellido"
                clearable
                outlined
                v-model="form.apellido2"
                @input="
                  errores.apellido2 = false;
                  form.apellido2 = form.apellido2.toUpperCase();
                "
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Nombres"
                clearable
                outlined
                required
                v-model="form.nombres"
                :error="errores.nombres"
                @input="
                  errores.nombres = false;
                  form.nombres = form.nombres.toUpperCase();
                "
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="items_rfiscal"
                label="Responsabilidad Fiscal"
                clearable
                hide-details
                v-model="form.rfiscal"
                :error="errores.rfiscal"
                return-object
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Teléfono"
                clearable
                type="number"
                v-model="form.telefono"
                :error="errores.telefono"
                @input="errores.telefono = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Teléfono Alterno"
                clearable
                type="number"
                v-model="form.telefono2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Direccion"
                clearable
                required
                v-model="form.direccion"
                :error="errores.direccion"
                @input="errores.direccion = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-autocomplete
                label="Pais"
                v-model="form.pais"
                :items="paises_dian"
                :item-text="format_paises"
                item-value="pais"
                :error="errores.pais"
                @change="
                  errores.pais = false;
                  select_pais();
                "
                return-object
                hide-details
              ></v-autocomplete>
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
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Correo_1"
                clearable
                filled
                v-model="form.correo"
                type="email"
                :error="errores.correo"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Correo_2"
                clearable
                v-model="form.correo2"
                type="email"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Correo_3"
                clearable
                v-model="form.correo3"
                type="email"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Actividad ICA"
                clearable
                v-model="form.actica"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="6" v-if="empresa.cuotas_empr == 1">
              <v-autocomplete
                label="Id Acudiente"
                v-model="form.idacudiente"
                :items="ruts"
                :item-text="format_ruts"
                return-object
                hide-details
                clearable
                @change="select_acudiente()"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-divider color="#FF6F00"></v-divider>
          <v-row>
            <v-col class="d-flex" cols="8">
              <v-text-field
                label="Nombre Contacto"
                clearable
                v-model="form.contacto"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Telefono Contacto"
                clearable
                type="number"
                v-model="form.telecontacto"
                counter="10"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Cliente', value: 1 },
                  { text: 'Proveedor', value: 2 },
                  { text: 'Colaborador', value: 3 },
                  { text: 'Seguridad Social', value: 4 },
                  { text: 'Conductor', value: 7 },
                  { text: 'Agricultor', value: 8 },
                  { text: 'Propietario Vehiculo', value: 9 },
                  { text: 'Asociado', value: 10 },
                  { text: 'Franquicia', value: 11 },
                  { text: 'Colegio', value: 12 },
                  { text: 'Codeudor', value: 13 },
                ]"
                label="Relación Comercial"
                outlined
                clearable
                hide-details
                v-model="form.relacion"
                @change="cambio_relacion"
                :error="errores.relacion"
                required
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Cliente', value: 1 },
                  { text: 'Proveedor', value: 2 },
                  { text: 'Colaborador', value: 3 },
                  { text: 'Seguridad Social', value: 4 },
                  { text: 'Conductor', value: 7 },
                  { text: 'Agricultor', value: 8 },
                  { text: 'Propietario Vehiculo', value: 9 },
                  { text: 'Asociado', value: 10 },
                  { text: 'Franquicia', value: 11 },
                ]"
                label="Otra Relación"
                outlined
                clearable
                hide-details
                v-model="form.relacion2"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Si', value: 1 },
                  { text: 'No', value: 2 },
                ]"
                label="Facturador Electrónico"
                outlined
                clearable
                return-object
                hide-details
                v-model="form.factelect"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="mostrar_cliente">
            <v-col class="d-flex" cols="3">
              <v-select
                :items="[
                  { text: 'Contado', value: 1 },
                  { text: 'Crédito', value: 2 },
                ]"
                label="Forma de Pago"
                clearable
                return-object
                hide-details
                v-model="form.fpago"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Dias Plazo"
                clearable
                type="number"
                v-model="form.plazo"
                hide-details
                :error="errores.plazo"
                @input="errores.plazo = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Asesor Comercial"
                v-model="form.asesor"
                :items="asesor"
                :item-text="format_asesor"
                item-value="idases"
                hide-details
                :error="errores.asesor"
                @change="errores.asesor = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Listas de Precios"
                v-model="form.listas"
                :items="listas"
                :item-text="format_listas"
                item-value="codigoenc"
                hide-details
                :error="errores.listas"
                @change="errores.listas = false"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row v-if="mostrar_cliente">
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="% Dcto RteFte"
                clearable
                type="number"
                v-model="form.porcrtefte"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Dcto RteIca(Tarifa dividido entre 10)"
                clearable
                type="number"
                v-model="form.porcrteica"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="% Dctos Estampillas"
                clearable
                type="number"
                v-model="form.porcrteest"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex">
            <v-col class="d-flex" cols="3">
              <v-text-field
                v-model="form.activacion"
                label="Activo desde:"
                append-icon="event"
                disabled
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-select
                :items="[
                  { text: 'Activo', value: 0 },
                  { text: 'Desactivado', value: 1 },
                ]"
                label="Estado"
                clearable
                hide-details
                v-model="form.estado"
                item-text="text"
                item-value="value"
                required
              ></v-select>
            </v-col>
            <v-col>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  large
                  depressed
                  dark
                  @click="
                    dialogo.estado = false;
                    init_form();
                  "
                  >Cancelar</v-btn
                >
                <v-btn
                  color="indigo darken-1"
                  class="white--text"
                  large
                  depressed
                  dark
                  @click="guardar()"
                  >Guardar</v-btn
                >
              </v-card-actions>
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
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogo_archivo.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar documento</v-card-title>
        <v-card-text>
          <v-file-input
            label="Buscar PDF"
            outlined
            chips
            counter
            color="blue darken-1"
            hide-details
            :show-size="1000"
            accept="application/pdf"
            v-model="dialogo_archivo.model"
            id="archivo_pdf"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
          <v-btn
            depressed
            color="indigo"
            class="white--text px-12 mx-5"
            @click="up_file"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
// import puppeteer from "puppeteer";

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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      clientes: [],
      empresa: [],
      listas: [],
      asesor: [],
      tipoid: null,
      eps: [],
      ruts: [],
      search: "",
      vendedores: [],
      ciudades_dian: [],
      paises_dian: [],
      departamentos: [],
      item_select: null,

      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      items_rfiscal: [
        { text: "Gran Contribuyente", value: 1 },
        { text: "Autorretenedor", value: 2 },
        { text: "Agente Retención de Iva", value: 3 },
        { text: "Regimen Simple de Tributación", value: 4 },
        { text: "No Responsable", value: 99 },
      ],
      form: {
        contacto: null,
      },
      headers: [
        { text: "Editar", value: "edit", align: "center" },

        { text: "Tipo Id", align: "center", value: "tipoid_rut" },
        {
          text: "Identificacion",
          align: "center",
          sortable: false,
          value: "identificacion_rut",
        },
        { text: "Descripcion", align: "left", value: "descripcion_rut" },
        { text: "Telefono", align: "center", value: "telefono_rut" },
        { text: "Relación", align: "rigth", value: "relacion_rut" },
        { text: "Direccion", align: "left", value: "direccion_rut" },

        { text: "Subir Documentos", value: "subir_sop", align: "center" },
        { text: "Descargar Documentos", value: "bajar_sop", align: "center" },
      ],
      errores: {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        rfiscal: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        telecontacto: false,
        relacion: false,
        relacion2: false,
        factelect: false,
        plazo: false,
        asesor: false,
        listas: false,
        estado: false,
      },
      card_estado: false,
      filterMunicipios: [],
      mostrar_cliente: false,
    };
  },
  created() {
    this.cargar_empresa();
    // this.agregar_item();
    this.cargarRuts();
    this.cargarCiudades();
    this.cargarpaises();
    this.cargarTablaasesor();
    this.cargarTablaenclistas();
    this.$watch(
      "form.departamento",
      (e) => {
        this.get_municipios();
      },
      { deep: true }
    );
  },
  computed: {},
  methods: {
    async get_rut_dian() {
      let nrodoc = parseFloat(this.form.numero.trim());
      let token = this.empresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/get_rut.php";
      let formData = new FormData();
      formData.append("token", token);
      formData.append("nrodoc", nrodoc);

      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json()) // ⬅️ Cambiar a .text() si el PHP devuelve texto plano
        .then((data) => {
          if (nrodoc > 999999999 || nrodoc < 800000000) {
            this.form.tipoid = 13;
            this.separarNombres(data.data.business_name);
            this.form.rsocial = "";
          } else {
            this.form.apellido1 = "";
            this.form.apellido2 = "";
            this.form.nombres = "";

            this.form.tipoid = 31;
            this.form.rsocial = data.data.business_name;
          }
          this.form.dv = data.data.dv;
          this.form.correo = data.data.email;
        })
        .catch((error) => {
          console.error("Error en envío:", error);
          $this.send_error(error);
        })
        .finally(() => {
          console.log("Final", nrodoc);
        });
    },
    select_pais() {
      let depart_busq = 0;
      let pais = this.form.pais.codigo;
      if (pais == "CO") {
        depart_busq = 0;
      } else {
        this.form.departamento = "ZZ";
        this.get_municipios();
        this.form.ciudad = "ZZ999";
      }
    },
    select_acudiente() {
      this.form.contacto =
        this.form.idacudiente.primerApellido_rut.trim() +
        " " +
        this.form.idacudiente.nombres_rut;
    },
    async up_file() {
      var file = this.dialogo_archivo.model;
      let empresa = this.empresa.descrip_empr.trim();
      let session = sessionStorage.Sesion;
      let cargue_pdf = file.name;
      let idempresa = parseFloat(this.empresa.id_empr);
      let idrut = this.item_select.identificacion_rut;
      let nombre_pdf = idempresa + "_RUT_" + idrut + ".pdf";
      let digito = this.empresa.id_empr.substr(14, 15);
      let idjson = "cargue_" + digito + ".json";
      let agencia = "0001";
      let fechadoc = "9999";
      let iddrive = this.empresa.iddrive_rep.trim();
      let llavedoc = "9999999";
      // iddrive = "1V9QwiShda842F6U5UHvh4tOPRqnMsqsq";
      let consec = 0;
      let clasif = 1;
      let consecpte = 0;
      let agcpte = 0;
      let codigo = "";
      let tipodoc = "03";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("clasif", clasif);
      data.append("consecutivo", consec);
      data.append("file", file);
      data.append("agencia", agencia);
      data.append("codigo", codigo);
      data.append("consecpte", consecpte);
      data.append("agcpte", agcpte);
      data.append("iddrive", iddrive);
      data.append("idjson", idjson);
      data.append("llavedoc", llavedoc);
      data.append("fechadoc", fechadoc);
      data.append("idrut", idrut);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/soporte.contab.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;
      this.cancelar_subida();
      this.cargarRuts();

      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
      });
    },
    descargar_soportes(item) {
      if (item.iddrive_rut.trim()) {
        const url =
          `https://drive.google.com/file/d/` +
          item.iddrive_rut.trim() +
          `/view?usp=drive_link`;
        window.open(url, "_blank").focus();
      }
    },
    consultar_nro_nit() {
      if (
        this.form.tipoid &&
        this.form.tipoid == 42 &&
        this.dialogo.tipo == 0
      ) {
        let datos = {
          url: "Financiero/dlls/Cfruts3J.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        };

        post
          .postData(datos)
          .then((data) => {
            let numero = data[0].nro;
            this.form.numero = parseFloat(numero);
            this.form.dv = "0";
          })
          .catch((error) => {
            console.log("Ha ocurrido un error: ", error);
          });
      }
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
    imprimir_excel() {
      let data = this.clientes;
      let data_parse = [];

      data_parse = [...data];

      let columnas = [
        {
          title: "Tipo_Id",
          value: "tipoid_rut",
        },
        {
          title: "Numero_Id",
          value: "identificacion_rut",
        },
        {
          title: "Dv",
          value: "dv_rut",
        },
        {
          title: "Razon Social",
          value: "descripcion_rut",
          format: "string",
        },
        {
          title: "Primer Apellido",
          value: "primerApellido_rut",
          format: "string",
        },
        {
          title: "Segundo Apellido",
          value: "segundoApellido_rut",
          format: "string",
        },
        {
          title: "Nombres",
          value: "nombres_rut",
          format: "string",
        },

        {
          title: "Dirección",
          value: "direccion_rut",
          format: "string",
        },
        {
          title: "Telefono",
          value: "telefono_rut",
        },
        {
          title: "Ciudad",
          value: "ciudad_rut",
          format: "string",
        },
        {
          title: "Correo",
          value: "correo_rut",
          format: "string",
        },
        {
          title: "Correo2",
          value: "correo2_rut",
          format: "string",
        },
        {
          title: "Relacion",
          value: "relacion_rut",
          format: "string",
        },
        {
          title: "Fecha Creación",
          value: "fechacrea_rut",
          format: "string",
        },
      ];

      let header_format = [
        { text: "INFORME CONFIGURACIÓN RUTS", bold: true, size: 16 },
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
            sheetName: "Informe configuración Ruts",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `INFORME CONFIGURACIÓN DE RUTS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          })
          .catch((error) => {
            console.log(error);
            this.send_error("Error al generar excel");
          });
      });
    },
    cambio_relacion() {
      if (this.form.relacion && this.form.relacion == 1)
        this.mostrar_cliente = true;
      else this.mostrar_cliente = false;
    },
    format_relacion(relacion_rut) {
      var retornar = {};
      // O se puede usar un swich case

      switch (relacion_rut) {
        case "01":
          retornar.text = "Cliente";
          break;
        case "02":
          retornar.text = "Proveedor";
          break;
        case "03":
          retornar.text = "Colaborador";
          break;
        case "04":
          retornar.text = "Seguridad Social";
          break;
        case "05":
          retornar.text = "Estudiante";
          break;
        case "06":
          retornar.text = "Acudiente";
          break;
        case "07":
          retornar.text = "Conductor";
          break;
        case "08":
          retornar.text = "Agricultor";
          break;
        case "09":
          retornar.text = "Prop_Vehiculo";
          break;
        case "10":
          retornar.text = "Asociado";
          break;
      }
      return retornar;
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
    subir_soportes(item) {
      this.dialogo_archivo.estado = true;
      this.item_select = item;
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar RUT";
      this.dialogo.tipo = 1;
      this.form.relacion = parseInt(item.relacion_rut);
      this.form.tipoid = parseInt(item.tipoid_rut);
      this.form.dv = item.dv_rut.trim() || "";
      this.form.numero = item.identificacion_rut;
      this.form.apellido1 = item.primerApellido_rut.trim();
      this.form.apellido2 = item.segundoApellido_rut.trim();
      this.form.nombres = item.nombres_rut.trim();
      this.form.rsocial = item.descripcion_rut.trim();
      this.form.direccion = item.direccion_rut.trim();
      this.form.departamento = item.ciudad_rut.substring(0, 2);
      this.form.ciudad = item.ciudad_rut.trim() || null;
      this.form.telefono = item.telefono_rut;
      this.form.telefono2 = item.telefonob_rut;
      this.form.actica = item.actica_rut.trim();
      this.form.correo = item.correo_rut.trim() || null;
      this.form.correo2 = item.correo2_rut.trim() || null;
      this.form.correo3 = item.correo3_rut.trim() || null;
      this.form.contacto = item.nombrecontac_rut.trim() || null;
      // console.log(parseInt(item.relacion_rut));

      this.cambio_relacion();
      this.form.relacion2 = parseInt(item.relacion2_rut);
      this.form.factelect = parseInt(item.factelect_rut);
      this.form.fpago = parseInt(item.fpago_rut);

      this.form.listas = item.listpr_rut;
      this.form.asesor =
        parseInt(item.asesor_rut) != 0 ? item.asesor_rut : null;

      var busqueda_rfiscal = this.items_rfiscal.find(
        (el) => el.value == parseInt(item.rfiscal_rut)
      );
      this.form.rfiscal = busqueda_rfiscal;

      var busqueda_acudiente = this.ruts.find(
        (el) => el.identificacion_rut == parseInt(item.idacudiente_rut)
      );
      this.form.idacudiente = busqueda_acudiente;

      this.form.telecontacto = item.telecontacto_rut;
      this.form.plazo = item.plazo_rut;
      this.form.estado = parseInt(item.estado_rut);
      this.form.activacion = this.$moment(item.fechaAct_rut).format(
        "YYYY-MM-DD"
      );
      this.form.porcrtefte = parseFloat(item.porcrtefte_rut);
      this.form.porcrteica = parseFloat(item.porcrteica_rut);
      this.form.porcrteest = parseFloat(item.porcrteest_rut);

      this.get_municipios();

      var busqueda_pais = this.paises_dian.find(
        (el) => el.codigo == item.pais_rut
      );
      this.form.pais = busqueda_pais;

      // console.log("Form", this.form);
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Debe seleccionar un tipo de identificación");
      } else if (!data.numero) {
        this.errores.numero = true;
        this.send_error("Debe ingresar un número de identificación");
      } else if (!data.dv && data.dv != 0) {
        this.errores.dv = true;
        this.send_error("Debe ingresar el Digito de Verificación");
      } else if (data.tipoid == 31 && !data.rsocial) {
        this.errores.rsocial = true;
        this.send_error("Debe ingresar una razón social");
      } else if (data.tipoid == 13 && !data.apellido1) {
        this.errores.apellido1 = true;
        this.send_error("Debe ingresar el primer apellido");
      } else if (data.tipoid == 13 && !data.nombres) {
        this.errores.nombres = true;
        this.send_error("Debe ingresar los nombres");
      } else if (!data.direccion) {
        this.errores.direccion = true;
        this.send_error("Debe ingresar una dirección");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Debe seleccionar un departamento");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Debe seleccionar una ciudad");
      } else if (!data.telefono) {
        this.errores.telefono = true;
        this.send_error("Debe ingresar un teléfono");
      } else if (!data.rfiscal) {
        this.errores.rfiscal = true;
        this.send_error("Debe Seleccionar un Resp.Fiscal");
      } else if (!data.relacion) {
        this.errores.relacion = true;
        this.send_error("Debe Seleccionar una Relación");
      } else if (data.relacion == 1 && !data.plazo) {
        this.errores.plazo = true;
        this.send_error("Ingrese los días de plazo");
      } else if (data.relacion == 1 && !data.asesor) {
        this.errores.asesor = true;
        this.send_error("Seleccione un asesor comercial");
      } else if (data.relacion == 1 && !data.listas) {
        this.errores.listas = true;
        this.send_error("Seleccione una lista de precio");
      } else if (data.relacion == 1 && !data.correo) {
        this.errores.correo = true;
        this.send_error("Debe registrar un correo");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var identificacion = data.numero;
      var digitoVerificacion = data.dv || "";
      var tipoId = data.tipoid;
      var rsocial = data.rsocial || "";
      var apellido1 = data.apellido1 || "";
      var apellido2 = data.apellido2 || "";
      var nombres = data.nombres || "";
      var direccion = data.direccion;
      var ciudad = data.ciudad;
      var pais = data.pais.codigo;
      var telefono = data.telefono;
      var telefono2 = data.telefono2;
      var correo = data.correo || "";
      var correo2 = data.correo2 || "";
      var correo3 = data.correo3 || "";
      var contacto = data.contacto || "";
      var telecontacto = data.telecontacto || "";
      var asesor = data.asesor || "0";
      var rfiscal = data.rfiscal.value || "0";
      var relacion = data.relacion || "0";
      var relacion2 = data.relacion2 ? data.relacion2 : "0";
      var factelect = data.factelect ? data.factelect.value : "0";
      var idacudiente = data.idacudiente
        ? data.idacudiente.identificacion_rut
        : "0";

      var porcrtefte = data.porcrtefte || "0";
      let actica = data.actica || "";
      var porcrteica = data.porcrteica || "0";
      var porcrteestamp = data.porcrteest || "0";

      var plazo = data.plazo || "0";
      var listas = data.listas || "0";
      var fpago = data.fpago ? data.fpago.value : "2";
      var estado = data.estado;
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/Cfruts.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          identificacion +
          "|" +
          digitoVerificacion +
          "|" +
          tipoId +
          "|" +
          rsocial +
          "|" +
          apellido1.trim() +
          "|" +
          apellido2.trim() +
          "|" +
          nombres.trim() +
          "|" +
          direccion.trim() +
          "|" +
          ciudad +
          "|" +
          telefono +
          "|" +
          correo.trim() +
          "|" +
          contacto +
          "|" +
          telecontacto +
          "|" +
          asesor +
          "|" +
          relacion +
          "|" +
          plazo +
          "|" +
          listas +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          correo2.trim() +
          "|" +
          correo3.trim() +
          "|" +
          telefono2 +
          "|" +
          porcrtefte +
          "|" +
          relacion2 +
          "|" +
          factelect +
          "|" +
          porcrteica +
          "|" +
          porcrteestamp +
          "|" +
          rfiscal +
          "|" +
          actica +
          "|" +
          pais +
          "|" +
          idacudiente +
          "|" +
          fpago +
          "|",
        method: "",
      };
      // console.log(datos.data);
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Rut guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarRuts();
        })
        .catch((error) => {
          this.card_estado = false;
          // console.log("Error grabando rut: ", error);
          this.send_error("Error al grabar rut");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo RUT";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        tipoid: null,
        numero: null,
        dv: null,
        rsocial: null,
        apellido1: null,
        apellido2: null,
        nombres: null,
        direccion: null,
        departamento: null,
        ciudad: null,
        telefono: null,
        correo: null,
        contacto: null,
        telecontacto: null,
        relacion: null,
        plazo: null,
        asesor: null,
        listas: null,
        estado: null,
        activacion: this.$moment().format("YYYY-MM-DD"),
        eliminar: false,
      };

      this.errores = {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        telecontacto: false,
        relacion: false,
        plazo: false,
        asesor: false,
        listas: false,
        estado: false,
      };
    },
    format_listas(val) {
      return `${val.codigoenc} - ${val.descripcionenc}`;
    },
    format_asesor(val) {
      return `${val.descripases}`;
    },
    format_paises(val) {
      return `${val.pais}`;
    },
    cargarTablaasesor: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAsesorJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.asesor = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    cargarTablaenclistas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfenclistasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.listas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
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
    format_ruts(val) {
      return `${parseInt(val.identificacion_rut) || 0} - ${
        val.descripcion_rut ? val.descripcion_rut.trim() : ""
      }`;
    },
    cargarpaises() {
      post
        .postData({
          url: "Datos/BASE/PAISES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.paises_dian = data.paises;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    cargar_item(item) {
      let idrut = item.identificacion_rut;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfRuts4J.dll",
          //          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + idrut + "|",
          method: "",
        })
        .then((data) => {
          let item = data[0];
          this.editar_item(item);

          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    cargarRuts() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfRutsLite2J.dll",
          //          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts = data;
          this.loader = false;
          this.clientes = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    send_error(msj) {
      // console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    calculardv() {
      var arreglo, x, y, documentoElementos, i, documento, dv1;
      documento = this.form.numero;
      if (!documento) {
        alert("Debe escribir el número de Identificación sin puntos.");
      } else {
        arreglo = [];
        x = 0;
        y = 0;
        documentoElementos = documento.length;
        arreglo[1] = 3;
        arreglo[2] = 7;
        arreglo[3] = 13;
        arreglo[4] = 17;
        arreglo[5] = 19;
        arreglo[6] = 23;
        arreglo[7] = 29;
        arreglo[8] = 37;
        arreglo[9] = 41;
        arreglo[10] = 43;
        arreglo[11] = 47;
        arreglo[12] = 53;
        arreglo[13] = 59;
        arreglo[14] = 67;
        arreglo[15] = 71;
        for (i = 0; i < documentoElementos; i++) {
          y = documento.substr(i, 1);
          x += y * arreglo[documentoElementos - i];
        }
        y = x % 11;
        if (y > 1) {
          dv1 = 11 - y;
        } else {
          dv1 = y;
        }
        var copia = JSON.parse(JSON.stringify(this.form));
        copia.dv = parseInt(dv1);
        this.form = null;
        this.form = JSON.parse(JSON.stringify(copia));
      }
    },
    async separarNombres(nombreCompleto) {
      // Limpia y normaliza espacios
      const limpio = (nombreCompleto || "").replace(/\s+/g, " ").trim();
      if (!limpio) {
        this.form.apellido1 = "";
        this.form.apellido2 = "";
        this.form.nombres = "";
        return;
      }

      // Si viene como "APELLIDOS, NOMBRES"
      if (limpio.includes(",")) {
        const [apellsRaw, nomsRaw] = limpio.split(",").map((s) => s.trim());
        const apells = apellsRaw.split(" ");
        this.form.apellido1 = apells[0] || "";
        this.form.apellido2 = apells.slice(1).join(" ") || "";
        this.form.nombres = nomsRaw || "";
        return;
      }

      // Partículas comunes para apellidos compuestos
      const PARTICULAS = new Set([
        "DE",
        "DEL",
        "DELA",
        "DELAS",
        "DELOS",
        "DA",
        "DO",
        "DOS",
        "VAN",
        "VON",
        "LA",
        "LAS",
        "LOS",
        "MC",
        "MAC",
        "SAN",
        "SANTA",
      ]);

      const partes = limpio.split(" ");

      // Helper para unir partícula con la siguiente palabra
      const mergeParticle = (arr, idx) => {
        if (idx < arr.length - 1 && PARTICULAS.has(arr[idx].toUpperCase())) {
          const combinado = `${arr[idx]} ${arr[idx + 1]}`;
          arr.splice(idx, 2, combinado);
        }
      };

      // Casos simples
      if (partes.length === 1) {
        this.form.apellido1 = "";
        this.form.apellido2 = "";
        this.form.nombres = partes[0];
        return;
      }

      if (partes.length === 2) {
        this.form.apellido1 = partes[0];
        this.form.apellido2 = "";
        this.form.nombres = partes[1];
        return;
      }

      // Para 3 o más palabras → 2 apellidos y el resto nombres
      let tmp = [...partes];

      mergeParticle(tmp, 0);
      mergeParticle(tmp, 1);

      this.form.apellido1 = tmp[0] || "";
      this.form.apellido2 = tmp[1] || "";
      this.form.nombres = tmp.slice(2).join(" ") || "";
    },
  },
};
</script>
