<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-safe</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cierre Punto de Recaudo</v-list-item-title
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
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaInicial"
                      label="Fecha Cierre"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechacierre"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-btn
                color="indigo"
                class="ma-5 white--text px-12"
                large
                depressed
                @click="consultar()"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
              <template v-slot:item.item="{ item }">{{
                contenido.indexOf(item) + 1
              }}</template>
              <template v-slot:item.accion="{ item }">
                <v-btn
                  fab
                  x-small
                  color="red darken-2"
                  outlined
                  depressed
                  @click="delete_item(item)"
                  ><v-icon> mdi-delete </v-icon>
                </v-btn>
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
          <span class="title col-12">Cierre Punto de Recaudo</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-text-field
                label="Operador"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.operador"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Fecha"
                clearable
                outlined
                disabled
                required
                v-model="form.fecha"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="12">
              <v-text-field
                label="Punto de Recaudo"
                v-model="form.punto"
                hide-details
                outlined
                disabled
                return-object
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col class="d-flex" cols="8" sm="4">
              <v-text-field
                label="Total Recaudos"
                clearable
                outlined
                type="text"
                required
                v-model="form.efectivo"
                v-money="money0"
                :error="errores.efectivo"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="4">
              <v-text-field
                label="Total Cantidad"
                clearable
                outlined
                type="text"
                required
                v-model="form.cantidad"
                v-money="money0"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row> -->

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Cerrar Punto</v-btn
          >
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
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },      
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      pickeFechaIni: false,
      perfil: "0",
      search: "",
      puntos: "",      
      ptosrecaudo: [],      
      form: {},
      headers: [
        { text: "Punto Recaudo", align: "left", value: "punto_rep" },
        { text: "Fecha Cierre", align: "center", value: "fechacie_rep" },
        { text: "Hora Cierre", align: "center", value: "horacie_rep" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.form = {
      fechaInicial: this.$moment().format("YYYY-MM-DD"),
    };

    this.cargaragencias();
    this.dialogo.estado = false;
  },
  computed: {},
  methods: {
    cargaragencias: function () {
      post
        .postData({
          url: "Recaudos/dlls/CfAgenciasJ.dll",
          data: 0 + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },    
    consultar: function () {
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      let punto_recaudo = sessionStorage.llave_punto;
      let data = JSON.parse(atob(punto_recaudo));
      this.contenido = [];      
      post
        .postData({
          url: "Recaudos/dlls/PrCierreptoJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + data.id + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = data;
        })
        .catch((err) => {
          this.send_error(err.Mensaje[0].msg);
        });
    },    

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fechaInicial) {
        this.errores.fechacierre = true;
        this.send_error("Fecha Cierre Obligatoria!");
      } else {
        this.format_envio(data);        
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      var punto = this.form.punto.substr(0, 4);
      var efectivo = 0 ;
      var cantidad = 0 ;
      let datos = {
        url: "Recaudos/dlls/PrCierrepto.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          punto +
          "|" +
          efectivo +
          "|" +          
          cantidad +
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
          this.consultar();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.operador = sessionStorage.User
      this.form.fecha = this.form.fechaInicial;
      let punto_recaudo = sessionStorage.llave_punto;
      let data = JSON.parse(atob(punto_recaudo));

      this.form.punto = data.id + '_' + data.text;

      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
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
