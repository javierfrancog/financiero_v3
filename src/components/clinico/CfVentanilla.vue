<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-check</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Ventanillas</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-account-check</v-icon>
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
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Sede"
                v-model="form.punto_fact"
                :items="agencias"
                :item-text="format_punto_fact"
                item-value="codigo_agc"
                clearable
                hide-details
                outlined
                return-object
                @change="
                  buscar_numero();
                  errores.punto_fact = false;
                "
                :error="errores.punto_fact"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Consecutivo"
                clearable
                outlined
                type="text"
                required
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
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
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Abreviación"
                clearable
                outlined
                required
                v-model="form.abreviacion"
                :error="errores.abreviacion"
                @input="errores.abreviacion = false"
                hide-details
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
      singleExpand: true,
      expanded: [],
      contenido: [],
      agencias: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Abreviacion", align: "left", value: "abrevia_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        descripcion: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Variedad";
      this.dialogo.tipo = 1;
      var busqueda_sede = this.agencias.find(
        (el) => el.codigo_agc == item.agencia_rep
      );
      this.form.punto_fact = busqueda_sede;

      this.form.codigo = item.cod_rep;
      this.form.descripcion = item.descrip_rep.trim();
      this.form.abreviacion = item.abrevia_rep.trim();
    },

    buscar_numero() {
      let agencia = this.form.punto_fact.codigo_agc;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfVentanillaN.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.estado = 0;
          this.form.activacion = this.$moment().format("YYYY-MM-DD");
          this.dialogo.titulo = "Agregar nuevo Registro";
          this.dialogo.estado = true;
          this.dialogo.tipo = 0;
          this.form.codigo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Presentaciones",
            estado: true,
          });
        });
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripcion Obligatoria!");
      } else if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Sede Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      let sede = data.punto_fact.codigo_agc;
      var descripcion = data.descripcion.replace(/\*/g, "x");
      var abreviacion = data.abreviacion.trim();
            
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Dispensa/dlls/CfVentanilla.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          sede +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          abreviacion +
          "|" +          
          "0" +
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
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
          url: "Dispensa/dlls/CfVentanillaJ.dll",
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
            text: "Error al cargar Ventanillas",
            estado: true,
          });
        });
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
