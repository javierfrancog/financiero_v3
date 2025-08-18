<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-left-thin-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Orden de Salida y Sar</v-list-item-title
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
                Crear documento
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
          <v-row>
            <v-col cols="12" md="4">
              <v-menu
                v-model="pickerFecha"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha"
                    label="Fecha"
                    append-icon="event"
                    hide-details
                    :error="errores.fecha"
                    @input="errores.fecha = false"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="form.activacion"
                  v-model="form.fecha"
                  @input="
                    pickerFecha = false;
                    errores.fecha = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-btn
                color="indigo"
                class="white--text mr-3"
                large
                depressed
                @click="cargarcontenido(false)"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
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
              <template v-slot:item.tipo_rep="{ item }">{{
                item.tipo_rep == "1"
                  ? "S.A.R"
                  : item.tipo_rep == "2"
                  ? "Orden de salida"
                  : "Orden de despacho"
              }}</template>

              <template v-slot:item.descrorig_rep="{ item }">
                {{ parseFloat(item.codorig_rep) }} - {{ item.descrorig_rep }}
              </template>
              <template v-slot:item.descrdest_rep="{ item }">
                {{ parseFloat(item.coddest_rep) }} - {{ item.descrdest_rep }}
              </template>
              <template v-slot:item.idconductor_rep="{ item }">
                {{ parseFloat(item.idconductor_rep) }}
              </template>
              <template v-slot:item.hora_rep="{ item }">
                {{ formatHora(item.hora_rep) }}
              </template>

              <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      class="mr-2"
                      icon
                      depressed
                      v-on="on"
                      @click="imprimir(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
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
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="tipos"
                label="Tipos"
                outlined
                clearable
                hide-details
                v-model="form.tipo"
                item-value="value"
                required
                :error="errores.tipo"
                @input="observarTipo()"
              ></v-autocomplete>
            </v-col>

            <v-col v-if="mostrarOrigen" cols="12" md="6">
              <v-autocomplete
                :items="embarques"
                label="Origen"
                outlined
                clearable
                :item-text="format_embarques"
                hide-details
                v-model="form.origen"
                item-value="value"
                return-object
                required
                :error="errores.origen"
                @input="desactivarErroresEmbarques('origen')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="embarques"
                label="Destino"
                outlined
                clearable
                :item-text="format_embarques"
                hide-details
                v-model="form.destino"
                item-value="value"
                return-object
                :error="errores.destino"
                @input="desactivarErroresEmbarques('destino')"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-menu
                ref="menu"
                v-model="pickerHora"
                :close-on-content-click="false"
                :return-value.sync="form.hora"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.hora"
                    label="Hora"
                    outlined
                    hide-details
                    append-icon="mdi-clock-outline"
                    :error="errores.hora"
                    @input="errores.hora = false"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="pickerHora"
                  v-model="form.hora"
                  :error="errores.hora"
                  @input="errores.hora = false"
                  @click:minute="$refs.menu.save(form.hora)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="5">
              <v-autocomplete
                label="Vehiculo"
                :items="placas"
                outlined
                clearable
                :item-text="format_placas"
                v-model="form.vehiculo"
                @change="asignar_conductor()"
                :error="errores.vehiculo"
                @input="errores.vehiculo = false"
                hide-details
                item-value="value"
                return-object
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="7">
              <v-autocomplete
                :items="conductores"
                label="Conductor principal"
                outlined
                clearable
                :item-text="format_conductores"
                hide-details
                v-model="form.conductor"
                item-value="value"
                return-object
                :error="errores.conductor"
                @input="errores.conductor = false"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col cols="12">
              <p class="text-subtitle-1">Estado</p>
              <v-switch v-model="form.estado" inset label="activo"></v-switch>
            </v-col> -->
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
import { ordensal_sar } from "@/_formatos_trans.js";

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
      pickerHora: false,

      tipos: [
        { text: "1. Despacho S.A.R", value: 1 },
        { text: "2. Orden de salida", value: 2 },
        { text: "3. Solo despacho", value: 3 },
      ],
      placas: [],
      conductores: [],
      embarques: [],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      expanded: [],
      contenido: [],
      search: "",
      form: {},

      headers: [
        { text: "ID Documento", align: "center", value: "nro_rep" },
        { text: "Tipo", align: "center", value: "tipo_rep" },
        { text: "Origen", align: "center", value: "descrorig_rep" },
        { text: "Destino", align: "center", value: "descrdest_rep" },
        { text: "Hora", align: "center", value: "hora_rep" },
        { text: "Vehículo", align: "center", value: "placa_rep" },
        { text: "Conductor", align: "center", value: "idconductor_rep" },
        { text: "Opciones", align: "center", value: "action" },
      ],
      errores: {},
      primerError: null,
      
      card_estado: false,
      embarquesIguales: false,

      mostrarOrigen: true     
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargar("placas", "Transporte/dlls/PrVehiculosJ.dll", "Vehículos");
    this.cargar(
      "conductores",
      "Financiero/dlls/Cfrutsj.dll",
      "Conductores principales"
    );
    this.cargar("embarques", "/transporte/dlls/PrembarquesJ.dll", "Embarques");
    this.primerError = true;
  },
  methods: {
    observarTipo() {
      this.errores.tipo = false;
      if (this.form.tipo != "1") {
        this.mostrarOrigen = false;
        this.form.origen = "0"
      }
      else {
        this.mostrarOrigen = true;
        this.form.origen = null;
      }
    },
    imprimir(item) {
      let data = {...item};
      data.hora_rep = this.formatHora(data.hora_rep)
      data.fecha_impr = this.$moment().format("YYYY-MM-DD");
      data.hora_impr = this.$moment().format("HH:mm");

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        this.pdfs.getBase64(logoSuper_src).then((logoSuper) => {
          data.logoSuper = logoSuper;
          ordensal_sar(data).then(() => {
            console.log("Impresion terminada");
          });
        });
      });
    },
    asignar_conductor() {
      if (this.form.vehiculo) {
        this.conductores.forEach((cond) => {
          if (cond.identificacion_rut == this.form.vehiculo.idcond1_veh) {
            this.form.conductor = cond;
            if (this.errores.conductor) this.errores.conductor = false;
          }
        });
      }
    },
    desactivarErroresEmbarques(emb) {
      if (this.embarquesIguales) {
        this.errores.origen = false;
        this.errores.destino = false;
        this.embarquesIguales = false;
      } else this.errores[emb] = false;
    },
    cargar(cosa, url, msg) {
      this.loader = true;
      post
        .postData({
          url,
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this[cosa] = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar " + msg,
            estado: true,
          });
        });
    },
    format_placas: function (val) {
      return `${parseFloat(val.nrointer_veh)} - ${val.placa_veh.trim()}`;
    },
    format_conductores: function (val) {
      return `${val.descripcion_rut.trim()}`;
    },
    format_embarques: function (val) {
      return val.descrip_emb;
    },
    formatHora: function (val) {
      val = val.trim();
      let hora = val.slice(0, -2);
      let minutos = val.substr(-2, 2);
      return hora + ":" + minutos;
    },

    validarCampo(campo, data) {
      if (!data[campo]) {
        this.errores[campo] = true;
        if (this.primerError) {
          this.send_error("Campo Obligatorio!");
          this.primerError = false;
        }
      }
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let camposllenos = true;

      Object.keys(this.errores).forEach((el) => {
        this.validarCampo(el, data);
        if (this.errores[el]) camposllenos = false;
      });

      if (camposllenos) {
        if (data.origen.id_emb == data.destino.id_emb) {
          this.errores.origen = true;
          this.errores.destino = true;
          this.send_error("Origen y destino no pueden ser iguales!");
          this.embarquesIguales = true;
        } else this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;

      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id; 
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let tipo = data.tipo;
      let placa = data.vehiculo.placa_veh.trim();
      let interno = data.vehiculo.nrointer_veh.trim();
      let conductor = parseFloat(data.conductor.identificacion_rut);
      let hora = data.hora ? data.hora.replace(/\:/g, "") : "";
      let origen = data.origen != "0" ? data.origen.id_emb : "0";
      let destino = data.destino.id_emb;
      let datos = {
        url: "/transporte/dlls/PrOrdsal.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "1" +
          "|" +
          agencia +
          "|" +
          fecha +
          "|" +
          tipo +
          "|" +
          origen +
          "|" +
          destino +
          "|" +
          hora +
          "|" +
          placa +
          "|" +
          conductor +
          "|" +
          "0" +
          "|" +
          "" +
          "|" +          
          interno +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((dataDLL) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarcontenido(true);
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      // this.form.estado = true;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.form.fecha = this.form.activacion;
      this.form.hora = this.$moment().format("HH:mm");

      this.dialogo.titulo = "Crear documento";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {};
      this.errores = {
        tipo: false,
        origen: false,
        destino: false,
        hora: false,
        vehiculo: false,
        conductor: false,       
      };
    },


    cargarcontenido(imprimir) {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let abiertos = this.abiertos ? 1 : 0;

      post
        .postData({
          url: "/transporte/dlls/PrOrdsal01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + abiertos + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          if (imprimir) this.imprimir(this.contenido[this.contenido.length - 1])
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
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
