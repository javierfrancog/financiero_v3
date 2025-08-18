<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-tooltip-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Puntos de Recaudo</v-list-item-title
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
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Centro de costos"
                v-model="form.ccosto"
                :items="tablaccosto"
                :item-text="format_ccosto"
                hide-details
                return-object
                outlined
                :error="errores.ccosto"
                @change="errores.ccosto = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Identificador"
                clearable
                outlined
                required
                v-model="form.idagencia"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Validadora', value: 1 },
                  { text: 'POS Térmica', value: 2 },
                ]"
                label="Tipo Impresora"
                outlined
                clearable
                v-model="form.tipoimp"
                required
                return-object
                :error="errores.tipoimp"
                hide-details
              ></v-select>
            </v-col>            
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-autocomplete
                label="Departamento"
                v-model="form.departamento"
                :items="departamentos"
                item-value="value"
                outlined
                :error="errores.departamento"
                @change="
                  errores.departamento = false;
                  get_municipios();
                "
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-autocomplete
                label="Ciudad"
                v-model="form.ciudad"
                :items="filterMunicipios"
                outlined
                return-object
                :error="errores.ciudad"
                @change="errores.ciudad = false"
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.franquicia" label="Franquicia"></v-switch>
            </v-col>

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
      tablaccosto: [],
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "codigo_agc" },
        { text: "Descripción", align: "left", value: "descripcion_agc" },
        { text: "Centro Costo", align: "center", value: "costo_agc" },
        { text: "Identificador", align: "center", value: "identificador_agc" },
        { text: "Estado", align: "center", value: "estado_agc" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarTablaccostos();
    this.cargarCiudades();
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
    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_agc;
      this.form.idagencia = item.identificador_agc;
      this.form.descripcion = item.descripcion_agc;
      this.form.tipoimp =  parseFloat(item.impresora_agc);
      this.form.franquicia = parseFloat(item.franquicia_agc);

      var ccosto = this.tablaccosto.find(
        (el) => el.llavecentro_cost == item.costo_agc
      );
      this.form.ccosto = ccosto;
      let departamento = item.ciudad_agc.substring(0, 2);
      let busqueda_departamento = this.departamentos.find(
        (el) => el.value == departamento
      );

      this.form.departamento = busqueda_departamento.value;
      this.get_municipios();
      setTimeout(() => {
        let busqueda_ciudad = this.filterMunicipios.find(
          (el) => el.value == item.ciudad_agc
        );

        this.$set(this.form, "ciudad", busqueda_ciudad);
      }, 500);

      this.form.estado = item.estado_agc == "1" ? true : false;
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
      var descripcion = data.descripcion;
      var ccosto = data.ccosto.llavecentro_cost;
      var ciudad = data.ciudad.value;
      var identifica = data.idagencia;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      let impresora = data.tipoimp.value;
      var franquicia = data.franquicia ? "1" : "0";      

      let dataenvio = [
        sessionStorage.Sesion,
        codigo,
        descripcion,
        ccosto,
        ciudad,
        identifica,
        estado,
        eliminar,
        impresora,
        franquicia,
      ];
      this.postData({
        url: "Recaudos/dlls/CfAgencias.dll",
        data: dataenvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.cargarcontenido();          
          this.card_estado = false;
          this.$emit("msj", data[0].Mensaje[0].msg, "green", 1000);
          this.dialogo.estado = false;
        })
        .catch((err) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          this.form.barras = null;
          this.$emit("msj", err.Mensaje[0].msg, "red", 500);
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
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Recaudos/dlls/CfAgenciasJ.dll",
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Financiero/dlls/CfagenciasN.dll",
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
