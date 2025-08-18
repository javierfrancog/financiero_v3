<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-format-strikethrough-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Comprobante de Pago</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col cols="12" md="3">
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
                  v-model="form.fecha"
                  @input="
                    pickerFecha = false;
                    errores.fecha = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" md="4">
              <v-autocomplete
                :items="ptosrecaudo"
                label="Agencia"
                v-model="form.puntos"
                :item-text="format_ptos"
                :error="errores.puntos"
                @input="errores.puntos = false"
                hide-details
                outlined
                disabled
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Consecutivo"
                v-model="form_recibo.consecutivo"
                outlined
                hide-details
                disabled
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
      <v-card-text class="pb-0">
        <v-row> </v-row>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              label="Concepto"
              :items="conceptos_egr"
              outlined
              clearable
              :item-text="format_conceptos"
              v-model="form.conceptos"
              hide-details
              @change="btnEnvio.disabled = false"
              return-object
            >
            </v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="8">
            <v-autocomplete
              outlined
              label="Médico"
              :items="medicos"
              :item-text="format_medico"
              item-value="nro"
              hide-details
              v-model="form.IdMedico"
              return-object
              clearable
              :error="errores.medico"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Valor pagado"
              prefix="$"
              outlined
              hide-details
              clearable
              :value="formatNumero(form.vlr)"
              @keypress="lettersDisabled()"
              @input="input_mask('vlr')"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Detalle"
              v-model="form.detalle"
              outlined
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row class="d-flex justify-center col-12">
          <v-col class="pa-0 px-0 d-flex align-center justify-center">
            <v-btn
              color="indigo"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              :disabled="btnEnvio.disabled"
              @click="guardar"
            >
              Guardar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>

            <v-btn
              color="orange"
              class="ma-2 white--text px-12 d-flex justify-end"
              large
              depressed
              :disabled="btnImprimir.disabled"
              @click="imprimir"
            >
              Imprimir
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { comprobante_tes } from "../../_formatos.pdf";

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
      abiertos: null,
      consecutivo: 0,

      tipos: [
        { text: "01 - RPC", value: "001" },
        { text: "02 - Egresos", value: "002" },
      ],
      conceptos_egr: [],
      fechas: [],
      expanded: [],
      medicos: [],
      form: {
        estado: false,
        vlr: null,
        IdMedico: null,
      },

      form_recibo: {},
      
      search_rpc: "",
      search_egr: "",
      headers_egr: [
        { text: "", align: "right", value: "data-table-expand" },
        { text: "Documento", align: "center", value: "documento" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Convenio", align: "center", value: "convenio" },
        { text: "Estado", align: "center", value: "estadoLetras" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Opciones", align: "center", value: "action" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      btnImprimir: {
        loader: false,
        disabled: false,
      },

      errores: {
        fecha: false,
        puntos: false,
        medico: false,
      },
      errores_recibo: {},
      card_estado: false,
      embarquesIguales: false,

      ptosrecaudo: [],
      contenido_rpc: [],
      contenido_egr: [],

      estados_recibo: {},
      datosEmpresa: {},
    };
  },
  async created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargar_empresa();
    this.cargarconceptos();
    await this.cargaragencias();
    this.get_profesionales();
    this.cargarconsecutivo();
    this.btnImprimir.disabled = true;
  },
  methods: {
    get_profesionales() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + 9 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.medicos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Salas",
            estado: true,
          });
        });
    },
    format_medico(val) {
      return val.descripcion + " - " + val.descr_tipo;
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];

        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    imprimir() {
      let agencia = this.form.puntos.codigo_agc;
      let consec = this.consecutivo.trim();
      let tipo = 2;
      let fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.loader = true;
      post
        .postData({
          url: "clinico/dlls/PrCptesoreria01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            agencia +
            "|" +
            consec +
            "|" +
            fecha +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          let data_impresion = data[0];
          let empresa = this.datosEmpresa;

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: parseInt(empresa.id_empr),
            direccionEmpresa: empresa.direccion_empr,
            telefonoEmpresa: empresa.telefono_empr.trim(),
            ciudadEmpresa: empresa.Ciudad,
            deparEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            comprobante_tes(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          $this.load.impresion = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión",
            estado: true,
          });
        });
    },
    cargarconsecutivo() {
      let fecha = this.form.fecha.replace(/\-/g, "");
      let agencia = this.form.puntos.codigo_agc;
      this.loader = true;
      post
        .postData({
          url: "/Clinico/dlls/PrCptesoreriaC.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "2" +
            "|" +
            agencia +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let consec = JSON.parse(JSON.stringify(data))[0];
          this.form_recibo.consecutivo = consec.nro_cons.trim();
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Consecutivo");
        });
    },
    async cargaragencias() {
      this.loader = true;
      await post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ptosrecaudo = data;
          let punto = this.ptosrecaudo.find((el) => el.codigo_agc == "0001");
          this.form.puntos = punto;
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Agencias");
        });
    },
    cargarconceptos: function () {
      this.loader = true;
      post
        .postData({
          url: "/Clinico/dlls/CfConceptoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let conceptos = JSON.parse(JSON.stringify(data));
          conceptos.forEach((el) => {
            if (el.tipo_conc == "1") this.conceptos_rpc.push(el);
            else if (el.tipo_conc == "2") this.conceptos_egr.push(el);
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Conceptos",
            estado: true,
          });
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    cargarcontenido() {
      if (!this.form.fecha) {
        this.errores.fecha = true;
        this.form.estado = false;
        this.send_error("Campo Obligatorio!");
      } else if (!this.form.puntos) {
        this.errores.puntos = true;
        this.form.estado = false;
        this.send_error("Campo Obligatorio!");
      } else {
        this.loader = true;
        let fecha = this.form.fecha.replace(/\-/g, "");
        let agencia = this.form.puntos.codigo_agc;
        this.contenido_rpc = [];
        this.contenido_egr = [];

        post
          .postData({
            url: "/transporte/dlls/PrReimpcbJV.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + agencia + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.form.estado = true;
            data.pop();

            let datos = JSON.parse(JSON.stringify(data));

            datos.forEach((el) => {
              el.documento = `${el.agencia.substr(
                -2,
                2
              )}00${el.consecutivo.trim()}`;

              el.registros.pop();
              let valorTotal = 0;
              el.registros.forEach((el_reg) => {
                valorTotal += parseFloat(el_reg.valor.replace(/\,/g, "")) || 0;
              });
              el.valor = "$" + this.formatNumero(valorTotal);
              el.estadoLetras = el.estado == "0" ? "Activo" : "Desactivado";

              if (el.tipo == "001") {
                el.concepto = this.formatConcepto(el.registros[0]);
                this.contenido_rpc.push(el);
              } else if (el.tipo == "002") this.contenido_egr.push(el);
            });
          })
          .catch((err) => {
            this.loader = false;
            this.form.estado = false;
            this.send_error("Error al cargar Contenido");
          });
      }
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
    },
    asignar_conductor() {
      if (this.form_recibo.placa) {
        let data = this.form_recibo;
        data.cedula = parseFloat(data.placa.idprop_veh);
      }
    },
    desactivarErroresEmbarques(emb) {
      if (this.embarquesIguales) {
        this.errores.origen = false;
        this.errores.destino = false;
        this.embarquesIguales = false;
      } else this.errores[emb] = false;
    },
    format_placas: function (val) {
      return val.placa_veh.trim();
    },
    format_conceptos: function (val) {
      return `${val.descrip_conc.trim()}`;
    },
    format_conductores: function (val) {
      return `${parseFloat(
        val.identificacion_rut
      )} - ${val.descripcion_rut.trim()}`;
    },
    format_embarques: function (val) {
      return val.descrip_emb;
    },
    format_horarios: function (val) {
      return val.horasal_hor;
    },
    validarCampo(campo, data) {
      if (!data[campo]) {
        this.errores[campo] = true;
        this.send_error("Campo Obligatorio!");
      }
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.vlr) {
        this.send_error("Error en valor");
      } else if (!data.conceptos) {
        this.send_error("Error en Concepto");
      } else if (!data.IdMedico) {
        this.send_error("Error en Médico");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let tipo = 2;
      let agencia = this.form.puntos.codigo_agc;
      let consec = this.form_recibo.consecutivo.trim();
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let cedula = this.form.IdMedico.id;
      let idconcepto = this.form.conceptos.id_conc;
      let valor = this.form.vlr.replace(/\,/g, "");
      let detalle = this.form.detalle;

      let datos = {
        url: "clinico/dlls/PrCptesoreria.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          agencia +
          "|" +
          consec +
          "|" +
          fecha +
          "|" +
          idconcepto +
          "|" +
          cedula +
          "|" +
          valor +
          "|" +
          detalle +
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
          this.limpiarformato();
          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarconsecutivo();
          this.btnImprimir.disabled = false;
          this.consecutivo = data[0];
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    limpiarformato() {
      this.form.conceptos = null;
      this.form.IdMedico = null;
      this.form.cedula = "0";
      this.form.vlr = "0";
      this.form.detalle = "";
    },
    init_formRecibo() {
      this.form_recibo = { registros: [] };
      this.errores = {
        tipo: false,
        consecutivo: false,
        convenio: false,
        cedula: false,
        registros: false,
      };
      this.estados_recibo = {
        global: false,
        rpc: false,
        egr: false,
        conc_egr: false,
      };
    },
    formatConcepto(e) {
      return `- ${e.concepto.trim()}`;
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
