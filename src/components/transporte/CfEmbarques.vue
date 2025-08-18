<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-sign-yield</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Embarques</v-list-item-title
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
                Agregar Embarque
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" md="6">
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
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>

              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>
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
            <v-col sm="2">
              <v-text-field
                label="Codigo"
                outlined
                hide-details
                disabled
                v-model="form.codigo"
              ></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-text-field
                label="Descripcion"
                outlined
                hide-details
                v-model="form.descripcion"
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
            color="red darken-1"
            class="ma-2 white--text mr-2"
            depressed
            large
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            color="indigo darken-1"
            class="white--text mr-2"
            depressed
            large
            :disabled="disabled.grabar"
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
      pickerFecha: false,
      embarques: [],

      disabled: {
        grabar: false,
      },

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      expanded: [],
      contenido: [],
      search: "",
      form: {},

      headers: [
        { text: "Codigo", align: "center", value: "codigo_rep", class: "white--text white blue darken-3"},
        { text: "Descripcion", align: "left", value: "descripcion_rep" , class: "white--text white blue darken-3"},
        { text: "Estado", align: "center", value: "estado_rep" , class: "white--text white indigo blue darken-3" },
        { text: "Opciones", value: "edit", align: "center" , class: "white--text white indigo blue darken-3"},
      ],
      errores: {},
      card_estado: false,
      embarquesIguales: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.get_embarques();
  },
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;

      this.form.codigo = item.codigo_rep;
      this.form.descripcion = item.descripcion_rep.trim();
      this.form.estado = item.estado_rep == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.origen = true;
        this.send_error("Error en Codigo!");
      } else if (!data.descripcion) {
        this.errores.destino = true;
        this.send_error("Error en Descripcion!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      let consec = data.codigo;
      let descripcion = data.descripcion;
      let estado = data.estado ? "1" : "0";
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Transporte/dlls/CfEmbarques.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consec +
          "|" +
          descripcion +
          "|" +
          estado +
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
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.get_numero();      
      // this.form.estado = true;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.form.fecha = this.form.activacion;
      this.dialogo.titulo = "Agregar nuevo Embarque";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {};
      this.errores = {
        vehiculo: false,
        conductor: false,
        origen: false,
        destino: false,
        fecha: false,
        horario: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Transporte/dlls/CfEmbarquesJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Embarques",
            estado: true,
          });
        });
    },
    get_numero() {
      this.loader = true;
      post
        .postData({
          url: "Transporte/dlls/CfEmbarquesN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.codigo =data[0].msg;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consecutivo",
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
