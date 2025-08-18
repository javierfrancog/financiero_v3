<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-google-circles</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Ciclos</v-list-item-title
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
            <v-col class="d-flex" cols="3">
              <v-menu
                v-model="dialogPicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.periodo"
                    label="Periodo"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.periodo"
                  scrollable
                  no-title
                  type="month"
                  :error="errores.periodo"
                  @input="dialogPicker = false, errores.periodo = false"
                  @change="get_codigo()"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                disabled
                v-model="form.codigo"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6">
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
            <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Punto de Facturación"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  clearable
                  outlined
                  return-object
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

            <v-col class="d-flex" cols="3">
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
            <v-col class="d-flex" cols="3">
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
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="dialogPerini"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.f_inicial"
                    label="Fecha Inicial"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.f_inicial"
                  scrollable
                  no-title
                  :error="errores.dialogPerini"
                  @input="errores.dialogPerini = false,dialogPerini = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="dialogPerfin"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.f_final"
                    label="Fecha Final"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.f_final"
                  scrollable
                  no-title
                  :error="errores.dialogPerfin"
                  @input="errores.dialogPerfin = false, dialogPerfin = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="dialogPoportuno"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.f_oportuno"
                    label="Pago Oportuno"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.f_oportuno"
                  scrollable
                  no-title
                  :error="errores.dialogPoportuno"
                  @input="dialogPoportuno = false, errores.dialogPoportuno = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="dialogSuspension"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.f_suspension"
                    label="Fecha Suspensión"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.f_suspension"
                  scrollable
                  no-title
                  :error="errores.dialogSuspension"
                  @input="dialogSuspension = false, errores.dialogSuspension = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Vlr Reconexión Suspensión"
                clearable
                outlined
                required
                v-model="form.recoexsusp"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Vlr Reconexión Corte"
                clearable
                outlined
                required
                v-model="form.recoexcorte"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Texto Resolución"
                clearable
                outlined
                required
                v-model="form.textores"
                hide-details
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
      agencias: [],

      search: "",
      form: {
        periodo: null,
        departamento: null,
        ciudad: null,

      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Periodo", align: "center", value: "periodo_rep" },
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Municipio", align: "center", value: "descripciudad_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        periodo: false,
        dialogPerini: false,
        codigo: false,
        estado: false,
        ccosto: false,
        descripcion: false,
        punto_fact: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarCiudades();
    this.cargarTablaAg();
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
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.cod_rep;
      this.form.periodo = item.periodo_rep;
      this.form.descripcion = item.descrip_rep.trim();
      let departamento = item.codciudad_rep.substring(0, 2);
      this.form.textores = item.textofact_rep;

      let busqueda_agencia = this.agencias.find(
        (el) => el.codigo_agc == item.agencia_rep
      );
      this.form.punto_fact = busqueda_agencia;

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

      this.form.f_oportuno = item.foportuno_rep.trim();
      this.form.f_suspension = item.fsusp_rep.trim();      
      this.form.f_inicial = item.pinic_rep.trim();      
      this.form.f_final = item.pfin_rep.trim();            
      this.form.recoexsusp = item.reconexsusp_rep.trim();  
      this.form.recoexcorte = item.reconexcorte_rep.trim();                        


      this.form.estado = item.estado_agc == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo) {
        this.errores.periodo = true;
        this.send_error("Periodo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripcion Obligatoria!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Departamento Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Ciudad Obligatoria!");
      } else if (!data.f_inicial) {
        this.errores.dialogPerini = true;
        this.send_error("Fecha Inicial Obligatoria!");
      } else if (!data.f_final) {
        this.errores.dialogPerfin = true;
        this.send_error("Fecha Final Obligatoria!");
      } else if (!data.f_oportuno) {
        this.errores.dialogPoportuno = true;
        this.send_error("Pago Oportuno Obligatorio!");
      } else if (!data.f_suspension) {
        this.errores.dialogPerfin = true;
        this.send_error("Fecha Suspensión Obligatoria!");
      } else if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Seleccione Punto de Facturación!");
      } else {
        this.format_envio(data);
      }

    },

    format_envio(data) {
      this.card_estado = true;
      var periodo = data.periodo ? data.periodo.replace(/\-/g, "") : "";      
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var ciudad = data.ciudad.value;
      let textofact = data.textores.trim();
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      var p_oport = data.f_oportuno ? data.f_oportuno.replace(/\-/g, "") : "";
      var f_suspension = data.f_suspension ? data.f_suspension.replace(/\-/g, "") : "";
      var f_inicial = data.f_inicial ? data.f_inicial.replace(/\-/g, "") : "";
      var f_final = data.f_final ? data.f_final.replace(/\-/g, "") : "";
      var reconex1 = data.recoexsusp ? data.recoexsusp.replace(/\,/g, "") : "0";
      var reconex2 = data.recoexcorte ? data.recoexcorte.replace(/\,/g, "") : "0";      
      var agencia = data.punto_fact.codigo_agc;

      let dataenvio = [
        sessionStorage.Sesion,
        periodo, 
        codigo,
        descripcion,
        ciudad,
        estado,
        textofact,
        f_inicial,
        f_final,
        p_oport,
        f_suspension,
        reconex1,
        reconex2,       
        agencia,
        eliminar,
        
      ];
      this.postData({
        url: "servdm/dlls/Cfciclos.dll",
        data: dataenvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.card_estado = false;
          this.$emit("msj", data[0], "green", 1000);
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          this.form.barras = null;
          this.$emit("msj", err[0], "red", 500);
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
          url: "servdm/dlls/CfciclosJ.dll",
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
            text: "Error al cargar Ciclos",
            estado: true,
          });
        });
    },
    get_codigo(){
      let periodo = this.form.periodo ? this.form.periodo.replace(/\-/g, "") : "";
      post
        .postData({
          url: "servdm/dlls/CfciclosN.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.codigo = data[0].nro;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Codigo",
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
