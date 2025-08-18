<template>
  <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
    <v-card class="px-6">
      <v-overlay :value="loader">
        <flower-spinner
          :animation-duration="2500"
          :size="100"
          color="#0d47a1"
        />
      </v-overlay>
      <v-card-title>
        <span class="title col-12">Libro de viajes</span>
      </v-card-title>

      <v-card-text class="pb-0">
        <v-row class="text-body-1 font-weight-medium" no-gutters>
          <v-col cols="12">
            <v-card class="py-4 d-flex justify-center" tile outlined>
              <v-img
                :src="logo_empresa"
                contain
                class="white mx-auto"
                height="100"
                max-width="80%"
                max-height="100"
              ></v-img>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="py-4 d-flex justify-center" tile outlined>
              Libro de viaje: {{ form_libroViajes.libroViaje }}
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="pa-2" tile outlined>
              Origen: {{ form_libroViajes.origen }}</v-card
            >
          </v-col>
          <v-col cols="12">
            <v-card class="pa-2" tile outlined>
              Destino: {{ form_libroViajes.destino }}</v-card
            >
          </v-col>
          <v-col cols="12" md="7">
            <v-card class="pa-2 d-flex justify-center" tile outlined>
              Fecha viaje: {{ form_libroViajes.fecha }}
            </v-card>
          </v-col>
          <v-col cols="12" md="5">
            <v-card class="pa-2 d-flex justify-center" tile outlined>
              Hora: {{ form_libroViajes.hora }}
            </v-card>
          </v-col>
          <v-col cols="12" md="5">
            <v-card class="pa-2 d-flex justify-center" tile outlined>
              Número de cargue: {{ form_libroViajes.nroCargue }}
            </v-card>
          </v-col>
          <v-col cols="12" md="7">
            <v-card class="pa-2 d-flex justify-center" tile outlined>
              Vehículo: {{ form_libroViajes.vehiculo }}
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="pa-2" tile outlined>
              Conductor: {{ form_libroViajes.conductor }}</v-card
            >
          </v-col>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="form_libroViajes.tiquetes"
              item-key="nro_tiq"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item.nro_tiq="{ item }"
                >{{ parseFloat(item.nro_tiq) }}
              </template>
            </v-data-table>
          </v-col>
          <v-card class="pa-2 col-3 d-flex justify-end align-center"
            >Total seguro:</v-card
          >
          <v-card class="pa-2 col-2 d-flex justify-end align-center"
            >${{ formatNumero(form_libroViajes.totalSeguro) }}</v-card
          >
          <v-card class="pa-2 col-3 d-flex justify-end align-center"
            >Total</v-card
          >
          <v-card class="pa-2 col-2 d-flex justify-end align-center">{{
            form_libroViajes.totalCantidad
          }}</v-card>
          <v-card class="pa-2 col-2 d-flex justify-end align-center"
            >${{ formatNumero(form_libroViajes.totalValor) }}</v-card
          >
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Efectivo</v-card
          >
          <v-col cols="5">
            <v-card class="pa-2 d-flex justify-end align-center" tile outlined>
              <v-text-field
                :value="`$${formatNumero(form_libroViajes.efectivo)}`"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-card>
          </v-col>
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Redbus</v-card
          >
          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="`$${formatNumero(form_libroViajes.redBus)}`"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-card>
          </v-col>
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Pinbus</v-card
          >
          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="`$${formatNumero(form_libroViajes.pinBus)}`"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-card>
          </v-col>
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Brasilia</v-card
          >
          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="`$${formatNumero(form_libroViajes.brasilia)}`"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-card>
          </v-col>
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Gamarra</v-card
          >
          
          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="formatNumero(form_libroViajes.gamarra)"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-card>
          </v-col>
         
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >T.Debito/Q.R</v-card
          >
          
          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="formatNumero(form_libroViajes.tdebito)"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-card>
          </v-col>

          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Avance</v-card
          >

          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="formatNumero(form_libroViajes.avance)"
                @keypress="lettersDisabled()"
                @input="input_mask('avance')"
                outlined
                hide-details
                clearable
                :disabled="inputBloqueado"
              ></v-text-field>
            </v-card>
          </v-col>
          <v-card class="pa-2 col-7 d-flex justify-end align-center"
            >Recaudo</v-card
          >
          <v-col cols="5">
            <v-card class="pa-2" tile outlined>
              <v-text-field
                :value="formatNumero(form_libroViajes.recaudo)"
                @keypress="lettersDisabled()"
                @input="input_mask('recaudo')"
                outlined
                hide-details
                clearable
                :disabled="inputBloqueado"
              ></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="12" md="7">
            <v-card class="pa-2 d-flex justify-end" tile outlined>
              TOTAL A PAGAR
            </v-card>
          </v-col>
          <v-card class="pa-2 col-12 col-md-5 d-flex justify-end" tile outlined>
            ${{ formatNumero(form_libroViajes.totalPagar) }}
          </v-card>
          <v-col cols="12">
            <v-card class="pa-2" tile outlined>
              <v-textarea
                label="Observaciones"
                v-model="form_libroViajes.observaciones"
                outlined
                hide-details
                rows="2"
                no-resize
                clearable
                :disabled="inputBloqueado"
              ></v-textarea>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="pa-2" tile outlined
              ><span class="font-weight-regular">Taquilla de despacho:</span>
              {{ form_libroViajes.agencia }}</v-card
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="indigo"
          class="white--text"
          depressed
          @click="
            cerrar_libroViaje();
            form_libroViajes = {};
          "
        >
          Cancelar
        </v-btn>
        <v-btn
          class="ma-2 white--text"
          color="blue accent-3"
          depressed
          :disabled="form_libroViajes.estado === 1"
          @click="impresiones"
        >
          <v-icon>print</v-icon>
          Imprimir_x
        </v-btn>
        <v-btn
          class="ma-2 white--text"
          color="red darken-1"
          depressed
          :disabled="form_libroViajes.estado !== 1"
          @click="cerrar_cargue()"
        >
          Cerrar. libro
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { libro_viaje } from "../../../_formatos.pdf";
import { FlowerSpinner } from "epic-spinners";
import post from "../../../methods.js";
import {
  get_libroViaje,
  contabilizar,
} from "@/components/transporte/mixins/contab";

export default {
  props: { estado: Boolean, data: Object },
  components: { FlowerSpinner },
  data() {
    return {
      loader: false,
      consec_libro: null,
      dialogo: {
        estado: false,
      },
      form_libroViajes: {},
      headers: [
        { text: "Tiquete", align: "center", value: "nro_tiq" },
        { text: "Pasajeros", align: "center", value: "nombres" },
        { text: "Destino", align: "center", value: "destino_tiq" },
        { text: "Sillas", align: "center", value: "sillas" },
        { text: "Forma pago", align: "center", value: "formapago" },
        { text: "Cantidad", align: "center", value: "cantidad" },
        { text: "Valor", align: "center", value: "valor" },
      ],
      btnsEstado_disabled: {
        imprimir: true,
        cerrar: false,
      },
      inputBloqueado: false,
      data_imprimir: {},
    };
  },
  computed: {
    logo_empresa() {
      return (
        "https://server1ts.net/datos/image/clientes/" +
        `${parseFloat(sessionStorage.Sesion.substr(0, 15))}` +
        ".png"
      );
    },
  },
  watch: {
    estado: {
      immediate: true,
      handler(newVal) {
        this.dialogo.estado = newVal;
      },
    },
    data: {
      immediate: true,
      handler(newVal) {
        this.form_libroViajes = newVal;
        this.data_imprimir = {
          agencia: newVal.agencia,
          consecutivo: newVal.libroViaje,
        };
      },
    },
    form_libroViajes: {
      deep: true,
      handler(newVal) {
        this.$emit("new_libroViajes", newVal);
      },
    },
    dialogo: {
      deep: true,
      handler(newVal) {
        this.$emit("newEstado", newVal);
      },
    },
  },
  methods: {
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57 || this.restarTotal() < 0) &&
        charCode !== 46
      )
        evt.preventDefault();
      else return true;
    },
    input_mask(index) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form_libroViajes, index, val_edit);
      if (this.restarTotal() < 0) {
        this.send_error("El valor total no puede ser negativo");
        this.btnsEstado_disabled.cerrar = true;
      } else {
        this.form_libroViajes.totalPagar = this.restarTotal();
        this.btnsEstado_disabled.cerrar = false;
      }
    },
    restarTotal() {
      let libro = this.form_libroViajes;
      let totalValor = parseFloat(libro.totalValor);
      let avance = parseFloat(libro.avance) || 0;
      let recaudo = parseFloat(libro.recaudo) || 0;
      let segSocial = parseFloat(libro.segSocial) || 0;

      let totalPagar = totalValor - avance - recaudo - segSocial;
      return totalPagar;
    },
    cerrar_cargue() {
      this.loader = true;
      let data = { ...this.form_libroViajes };
      let punto_taquilla = sessionStorage.llave_punto;
      let data_punto = JSON.parse(atob(punto_taquilla));
      let agencia = data.agencia;
      let viaje = data.nroCargue;
      let avance = data.avance || 0;
      let recaudo = data.recaudo || 0;
      let redBus = data.redBus || 0;
      let gamarra = data.gamarra || 0;
      let tdebito = data.tdebito || 0;
      
      let segSocial = data.segSocial || 0;
      let total = data.totalPagar;
      let detalle = data.observaciones || 0;
      let placa = data.vehiculo;
      let pinBus = data.pinBus || 0;
      let brasilia = data.brasilia || 0;
      let turno = data_punto.turno;

      post
        .postData({
          url: "/transporte/dlls/PrLViajesV.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            viaje +
            "|" +
            avance +
            "|" +
            recaudo +
            "|" +
            redBus +
            "|" +
            segSocial +
            "|" +
            total +
            "|" +
            detalle +
            "|" +
            placa +
            "|" +
            pinBus +
            "|" +
            "0" +
            "|" +
            turno +
            "|" +
            brasilia +
            "|" +
            gamarra +
            "|" +
            tdebito +
            "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          this.form_libroViajes = {};
          let dataConsecutivo = JSON.parse(JSON.stringify(data));
          this.consec_libro = dataConsecutivo[0];
          this.data_imprimir = {
            agencia,
            consecutivo: dataConsecutivo[0],
          };

          let info_viaje = await get_libroViaje({
            agencia,
            consecutivo: this.consec_libro,
          });

          info_viaje.consec_libro = this.consec_libro;

          this.card_estado = true;
          let libro = info_viaje.nro_lvia ? parseInt(info_viaje.nro_lvia) : 0;

          if (libro > 0) {
            this.btnsEstado_disabled = {
              imprimir: false,
              cerrar: true,
            };
            this.inputBloqueado = true;
            await contabilizar(info_viaje)
              .then((data) => {
                this.$emit("snack", {
                  color: "success",
                  text: "Registro guardado correctamente",
                  estado: true,
                });
                console.log("libro contabilizado");
                // this.card_estado = false;
                // this.dialogo.estado = false;
                // // this.init_form();
                // this.cargarcontenido();
              })
              .catch((error) => {
                console.log("error", error);
                this.card_estado = false;
                this.send_error("Error al Contabilizar Cargue");
              });
          }
        })
        .catch((err) => {
          this.loader = false;
          console.log("err", err);
          this.send_error("Error al cerrar cargue");
        });
    },
    async get_libroViaje({ agencia, consecutivo }) {
      let data = await post.postData({
        url: "/transporte/dlls/PrLviajes03VJ.dll",
        data: sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|",
        method: "",
      });
      return data[0];
    },
    async impresiones() {
      await this.imprimir_libro();
      await this.imprimir_libro();

      this.cerrar_libroViaje();
    },
    async imprimir_libro() {
      this.loader = true;
      let agencia = this.data_imprimir.agencia;
      let nro = this.data_imprimir.consecutivo;
      await post
        .postData({
          url: "/transporte/dlls/PrLviajes03VJ.DLL",
          data: sessionStorage.Sesion + "|" + agencia + "|" + nro + "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          let dataImpresion = JSON.parse(JSON.stringify(data));

          var logo_src = require(`../../../assets/image/logos/taxsuper.png`);

          await this.pdfs.getBase64(logo_src).then(async (logo) => {
            dataImpresion[0].logo = logo;
            await libro_viaje(dataImpresion[0]).then(() => {
              console.log("Impresión terminada");
            });
          });          
        })
        .catch((err) => {
          this.loader = false;
          console.log("err", err);
          this.send_error("Error al imprimir");
        });
    },
    cerrar_libroViaje() {
      this.dialogo.estado = false;
      this.data_imprimir = {};
      this.btnsEstado_disabled = {
        imprimir: true,
        cerrar: false,
      };
      this.inputBloqueado = false;
    },
    send_error(msj) {
      this.$emit("error", msj);
    },

    // input_maskOld(model) {
    //   let evento = event;
    //   // let event = event.target.value
    //   this.clear();

    //   this.typingTimer = setTimeout(() => {
    //     this.done(model, evento);
    //   }, this.typingInterval);
    // },
    // clear() {
    //   clearTimeout(this.typingTimer);
    // },
    // done(model, evento) {
    //   const _this = this;
    //   let value = evento.target.value;
    //   var nums = value.replace(/\D/g, "");
    //   let val_edit = nums.replace(/,/g, "");
    //   let val_format = this.formatNumero(val_edit);

    //   this.$set(this.form_libroViajes, model, val_format);
    //   _this.restarTotal();
    //   setTimeout(() => {
    //     document.getElementById(evento.target.id).value = val_format;
    //   }, 100);
    // },
  },
};
</script>