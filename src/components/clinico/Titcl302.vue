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
                >Configuración Clientes Cl</v-list-item-title
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
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Correo</th>
                        <th>Direcion</th>
                        <th>Ciudad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.ciudad }}</td>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>

              <template v-slot:item.relacion_rut="{ item }">
                {{ format_relacion(item.relacion_rut).text }}
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Nit', value: 31 },
                  { text: 'Cedula', value: 13 },
                  { text: 'Pasaporte', value: 41 },
                  { text: 'Permiso Esp.Permanencia', value: 47 },
                  { text: 'Cedula Extranjería', value: 21 },
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
            <v-col class="d-flex" cols="12" sm="3">
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
                :disabled="form.tipoid == 42"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Dígito Verificador"
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
            <v-col class="d-flex align-center justify-center">
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="calculardv()"
                depressed
              >
                <v-icon size="25" left>mdi-autorenew</v-icon>
              </v-btn>
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
            <v-col class="d-flex" cols="4">
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
            <v-col class="d-flex" cols="5">
              <v-autocomplete
                label="Codigo Entidad"
                v-model="form.eps"
                :items="eps"
                item-value="value"
                outlined
                required
                :error="errores.eps"
                @change="errores.eps = false"
                return-object
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-autocomplete>
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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      clientes: [],
      listas: [],
      asesor: [],
      tipoid: null,
      search: "",
      vendedores: [],
      ciudades_dian: [],
      paises_dian: [],
      eps: [],
      departamentos: [],
      items_rfiscal: [
        { text: "Gran Contribuyente", value: 1 },
        { text: "Autorretenedor", value: 2 },
        { text: "Agente Retención de Iva", value: 3 },
        { text: "Regimen Simple de Tributación", value: 4 },
        { text: "No Responsable", value: 99 },
      ],
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
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

        { text: "Opciones", value: "edit", align: "center" },
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
        eps:false,
        estado: false,
      },
      card_estado: false,
      filterMunicipios: [],
      mostrar_cliente: false,
    };
  },
  created() {
    // this.agregar_item();
    this.cargarRuts();
    this.cargarCiudades();
    this.cargarpaises();
    this.cargarTablaasesor();
    this.cargarTablaenclistas();
    this.cargarEps();
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
    cargarEps: function () {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      //Medicoop
      if (empresa == 900108793) {
        this.label_Eps = "Convenio";
      }

      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k, v) => {
            this.eps.push({
              value: k.codigo,
              text: k.nombre,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
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
            this.form.numero = numero;
            this.form.dv = "0";
          })
          .catch((error) => {
            console.log("Ha ocurrido un error: ", error);
          });
      }
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
          title: "Descripción",
          value: "descripcion_rut",
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
          value: "NombreCiudad",
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
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
       console.log("editar", item, this.eps);
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
      this.form.listas = item.listpr_rut;
      this.form.asesor =
        parseInt(item.asesor_rut) != 0 ? item.asesor_rut : null;

      var busqueda_rfiscal = this.items_rfiscal.find(
        (el) => el.value == parseInt(item.rfiscal_rut)
      );
      this.form.rfiscal = busqueda_rfiscal;

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

      var busqueda = this.eps.find(
        (el) => el.value.trim() == item.eps_rut.trim()
      );
      this.form.eps = busqueda;      
      
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
      } else if (!data.correo) {
        this.errores.correo = true;
        this.send_error("Debe registrar un correo");
      } else if (!data.eps) {
        this.errores.eps = true;
        this.send_error("Debe seleccionar una eps");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      console.log(data)

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
      var relacion = "1";
      var relacion2 = "0";
      var factelect = "0";
      var eps = data.eps.value || "";

      var porcrtefte = data.porcrtefte || "0";
      let actica = data.actica || "";
      var porcrteica = data.porcrteica || "0";
      var porcrteestamp = data.porcrteest || "0";

      var plazo = data.plazo || "0";
      var listas = data.listas || "0";
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
          "0" +
          "|" +
          "02" +
          "|" +
          "0" +
          "|" +
          eps +
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
    cargarRuts() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|" + "9" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
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
  },
};
</script>
