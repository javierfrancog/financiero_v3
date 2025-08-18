<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-dots-circle</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Corregimientos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
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
            <v-col class="d-flex" cols="4">
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
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Municipio"
                v-model="form.ciudad"
                :items="filterMunicipios"
                outlined
                clearable
                return-object
                :error="errores.ciudad"
                @change="buscarNumero(), errores.ciudad = false"
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Consecutivo"
                outlined
                type="text"
                required
                disabled
                v-model="form.consecutivo"
                :error="errores.consecutivo"
                @input="errores.consecutivo = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                v-model="form.descripcion"
                :error="errores.descripcion"
                @change="errores.descripcion = false"
        
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
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
          class="ma-2 white--text"
            color="indigo"
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
      dialogPoportuno: false,
      dialogSuspension: false,      
      dialogPerini: false,            
      dialogPerfin: false,                  



      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaccosto: [],
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],

      search: "",
      form: {
        periodo: null,
        departamento: null,
        ciudad: null,
        descripcion:null,
        consecutivo: 0,

      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Cosecutivo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Municipio", align: "center", value: "descripciudad_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        periodo: false,
        dialogPerini: false,
        consecutivo: false,
        estado: false,
        ccosto: false,
        descripcion: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarCiudades();
    // this.$watch(
    //   "form.departamento",
    //   (e) => {
    //     this.get_municipios();
    //   },
    //   { deep: true }
    // );
  },
  computed: {},
  methods: {
    buscarNumero: function () {
      let ciudad = this.form.ciudad.value;
      post
        .postData({
          url: "Servdm/dlls/CfsdmcorregN.dll",
          data: sessionStorage.Sesion + "|" + ciudad + "|",
          method: "",
        })
        .then((data) => {
          this.form.consecutivo = data[0].nro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consecutivo",
            estado: true,
          });
        });
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.consecutivo = item.cod_rep;
      this.form.descripcion = item.descrip_rep.trim();
      let departamento = item.codciudad_rep.substring(0, 2);
      let busqueda_departamento = this.departamentos.find(
        (el) => el.value == departamento
      );
      this.form.departamento = busqueda_departamento.value;
      this.get_municipios();
      setTimeout(() => {
        let busqueda_ciudad = this.filterMunicipios.find(
          (el) => el.value == item.codciudad_rep
        );

        this.$set(this.form, "ciudad", busqueda_ciudad);
      }, 500);

      this.form.estado = item.estado_agc == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      console.log(data)
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripcion Obligatoria!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Departamento Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Ciudad Obligatoria!");
      } else {
        this.format_envio(data);
      }

    },

    format_envio(data) {
      this.card_estado = true;
      var consecutivo = data.consecutivo;
      var descripcion = data.descripcion;
      var ciudad = data.ciudad.value;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";      
      let dataenvio = [
        sessionStorage.Sesion,
        consecutivo,
        descripcion,
        ciudad,
        estado,
        eliminar,
      ];
      this.postData({
        url: "servdm/dlls/Cfsdmcorreg.dll",
        data: dataenvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.card_estado = false;
          console.log(data);
          this.$emit("msj", data[0], "green", 1000);
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          this.form.barras = null;
          this.$emit("msj", err[0], "red", 500);
          this.cargarcontenido();          
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        consecutivo: null,
        eliminar: false,
      };

      this.errores = {
        consecutivo: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/CfsdmcorregJ.dll",
          data: sessionStorage.Sesion + "|",
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
            text: "Error al cargar Corregimientos",
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
