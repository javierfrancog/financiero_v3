<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-bank-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Conciliación Bancaria</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    @change="getSaldocta()"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  label="Cuenta Bancaria"
                  v-model="form.ctabancos"
                  :items="tablaPuc"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  clearable
                  return-object
                  @change="getSaldocta()"
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Saldo Extracto Bancario"
                  clearable
                  outlined
                  v-model="form.sdoextracto"
                  v-money="money0"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Saldo Extracto conciliación"
                  outlined
                  v-model="form.sdobancos"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Saldo Auxiliar"
                  outlined
                  :value="formatNumero(form.sdoauxiliar)"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Valor x conciliar"
                  clearable
                  outlined
                  v-model="form.sdopendiente"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center justify-end">
                <v-btn
                  color="blue darken-1 white--text"
                  class="mr-2"
                  @click="getSaldo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-text-search</v-icon>Validar
                </v-btn>

                <v-btn
                  color="green darken-1 white--text"
                  class="mr-2"
                  @click="cerrarConciliacion()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Cerrar
                  Conciliación
                </v-btn>
                <v-btn
                  color="red darken-1"
                  class="white--text px-6"
                  @click="get_reporte()"
                  depressed
                  :disabled="disabled_btn_pdf"
                >
                  Generar PDF
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <div class="col-md-8 mx-auto">
                  Pendientes por Marcar
                  <v-text-field
                    v-model="busqueda_sinMarcar"
                    outlined
                    label="Buscar"
                    dense
                    prepend-inner-icon="mdi-magnify"
                  >
                  </v-text-field>
                </div>
                <v-data-table
                  :headers="tablaSinMarcar.headers"
                  :items="tablaSinMarcar.datos"
                  item-key="docinter_rep"
                  single-expand
                  :search="busqueda_sinMarcar"
                >
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="blue"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      @click="marcar_item(item, 1)"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <div class="col-md-8 mx-auto">
                  Marcados
                  <v-text-field
                    v-model="busqueda_Marcados"
                    outlined
                    label="Buscar"
                    dense
                    prepend-inner-icon="mdi-magnify"
                  >
                  </v-text-field>
                </div>
                <v-data-table
                  :headers="tablaMarcados.headers"
                  :items="tablaMarcados.datos"
                  item-key="docinter_rep"
                  single-expand
                  :search="busqueda_Marcados"
                >
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="red"
                      fab
                      outlined
                      class="white--text mx-auto"
                      x-small
                      depressed
                      @click="marcar_item(item, 0)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template></v-data-table
                >
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { conciliacion } from "../../_formatos.pdf.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      contenido: [],
      search: "",
      marcar: 0,
      form: {
        sdobancos: null,
        sdopendiente: null,
      },
      drawer: false,
      detalle: [],
      tablaPuc: [],
      empresa: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      tablaSinMarcar: {
        headers: [
          {
            text: "Fecha",
            value: "fecha_rep",
          },
          {
            text: "Descripción",
            value: "descriprut_rep",
          },
          {
            text: "Doc. interno",
            value: "docabrev_rep",
          },
          {
            text: "Marcar",
            value: "boton",
            align: "center",
          },
          {
            text: "Valor",
            value: "valor",
          },
        ],
        datos: [],
      },
      tablaMarcados: {
        headers: [
          {
            text: "Fecha",
            value: "fecha_rep",
          },
          {
            text: "Descripción",
            value: "descriprut_rep",
          },
          {
            text: "Doc. interno",
            value: "docabrev_rep",
          },
          {
            text: "Desmarcar",
            value: "boton",
            align: "center",
          },
          {
            text: "Valor",
            value: "valor",
          },
        ],
        datos: [],
      },
      card: {
        loader: false,
        disabled: false,
      },
      busqueda_sinMarcar: null,
      busqueda_Marcados: null,
      disabled_btn_pdf: true,
      conciliacion: {},
    };
  },
  created() {
    this.loader = false;
    this.marcar = 0;
    this.get_puc();
    this.get_empresa();
    this.form = {
      fecha_doc: this.$moment().format("YYYY"),
    };
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_reporte() {
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var cuenta = this.form.ctabancos.cod_puc;
      this.card.loader = true;
      post
        .postData({
          url: "Financiero/dlls//RpConciliaJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + cuenta + "|",
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          data = data[0];

          data.empresa = { ...this.empresa };
          // data.periodo_cargue = this.periodo_cargue;
          // data.genero_rep = this.conciliacion.genero_rep;
          // data.fechagen_rep = this.conciliacion.fechagen_rep;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            conciliacion(data).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          console.log("Error", err);
          this.card.loader = false;
          this.send_error("Error al cargar Documento Contable");
        });
    },
    cerrarConciliacion() {
      var periodo = this.periodo_cargue.replace(/\-/g, "");
      var cuenta = this.form.ctabancos.cod_puc;
      var sdobancos =
        parseFloat(this.form.sdoextracto.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;

      var datosPlano = JSON.parse(JSON.stringify(this.tablaSinMarcar.datos));
      datosPlano = datosPlano.map((el) => {
        delete el.codcta_rep;
        delete el.credito_rep;
        delete el.debito_rep;
        delete el.descripcta_rep;
        delete el.descriprut_rep;
        // delete el.detalle_rep;
        delete el.docabrev_rep;
        delete el.estado_rep;
        delete el.nombredoc_rep;
        delete el.docinter_rep;
        delete el.saldo_rep;
        // delete el.docextr_rep;

        el.rut_rep.trim();
        el.valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;

        return el;
      });

      this.card.loader = true;
      this.card.disabled = true;

      this.get_plano(datosPlano).then((nom_plano) => {
        post
          .postData({
            url: "Financiero/dlls//PrConcilia.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              cuenta +
              "|" +
              sdobancos +
              "|" +
              nom_plano +
              "|",
            method: "",
          })
          .then((data) => {
            this.card.loader = false;
            this.card.disabled = false;
            this.disabled_btn_pdf = false;
            // _this.$emit("snack", {
            //   color: "success",
            //   text: "Proceso exitoso",
            //   estado: false,
            // })
          })
          .catch((err) => {
            this.card.loader = false;
            this.card.disabled = false;
            this.send_error("Error al Grabar Conciliación");
          });
      });
    },
    get_plano(array) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("tipo", "prConcBancos");
        formData.append("data", JSON.stringify(array));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    marcar_item(item, tipo) {
      let periodo = item.fecha_rep.replace(/\-/g, "");
      periodo = periodo.substr(0, 6);

      let reg_ant = 0;
      var llave = item.docinter_rep;
      var fecha = item.fecha_rep;
      var fechaconc = this.periodo_cargue.replace(/\-/g, "");
      var cuenta = this.form.ctabancos.cod_puc;

      if (periodo < fechaconc) {
        reg_ant = 1;
      }
      this.card.loader = true;
      post
        .postData({
          url: "Financiero/dlls//PrConcilia01.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            fecha +
            "|" +
            llave +
            "|" +
            cuenta +
            "|" +
            fechaconc +
            "|" +
            reg_ant +
            "|",
          method: "",
        })
        .then((data) => {
          this.marcar = 1;
          this.cargarMovimiento();
          // this.get_diferencia();
        })
        .catch((err) => {
          this.card.loader = false;
          this.send_error("Error al marcar Registro");
        });
    },
  async  filtrarMovimiento(data) {
      data = data.map((el) => {
        el.descriprut_rep = el.descriprut_rep.trim();
        el.debito_rep = el.debito_rep.replace(/\s\s+/g, "");
        el.credito_rep = el.credito_rep.replace(/\s\s+/g, "");

        let debito = parseFloat(el.debito_rep.replace(/\,/g, "")) || 0;
        let credito = parseFloat(el.credito_rep.replace(/\,/g, "")) || 0;

        let subTotal = debito + credito;
        el.valor = this.formatNumero(subTotal);
        return el;
      });
      this.tablaSinMarcar.datos = data.filter((el) => el.estado_rep == "0");
      this.tablaMarcados.datos = data.filter((el) => el.estado_rep != "0");
    
      if (this.marcar == 1) {
        this.calcular_saldo();
      } else {
        this.get_diferencia();
      }
      this.marcar = 0;
    },
    calcular_saldo() {
      var sdoauxiliar =
        parseFloat(this.form.sdoauxiliar.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;

      // let sdoauxiliar = this.form.sdoauxiliar || "0";
      var formSaldoBancos =
        parseFloat(this.form.sdoextracto.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;

      // var formSaldoBancos =
      //   parseFloat(this.form.sdobancos) || 0;
      var saldoAuxiliar = parseFloat(sdoauxiliar) || 0;

      var totalPendientes = 0;
      this.tablaSinMarcar.datos.forEach((el) => {
        let debito = parseFloat(el.debito_rep.replace(/\,/g, "")) || 0;
        let credito = parseFloat(el.credito_rep.replace(/\,/g, "")) || 0;

        totalPendientes += debito + credito;
      });
      var total = 0;

      if (saldoAuxiliar > formSaldoBancos) {
        total = formSaldoBancos + totalPendientes - saldoAuxiliar;
      } else {
        total = formSaldoBancos - totalPendientes - saldoAuxiliar;
      }

      this.form.sdopendiente = this.formatNumero(total);
    },
    async cargarMovimiento() {
      return new Promise((resolve) => {
        var fecha = this.periodo_cargue.replace(/\-/g, "");
        var cuenta = this.form.ctabancos.cod_puc;
        this.card.loader = true;
        post
          .postData({
            url: "Financiero/dlls//PrConciliaJ.dll",
            data: sessionStorage.Sesion + "|" + cuenta + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.card.loader = false;
            this.filtrarMovimiento(data);
          })
          .catch((err) => {
            console.log("Error", err);
            this.card.loader = false;
            this.send_error("Error al cargar Documento Contable");
          });
      });
    },
    get_diferencia() {
      var auxiliar =
        parseFloat(this.form.sdoauxiliar.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;
      var bancos =
        parseFloat(this.form.sdoextracto.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;
      if (bancos === "0.00") {
        bancos = parseFloat(
          this.form.sdobancos.toString().replace(/\,/g, "")
        ).toFixed(2);
      }
      var diferencia = parseFloat(bancos - auxiliar).toFixed(2);
      this.form.sdopendiente = this.formatNumero(diferencia);
      this.form.sdobancos = this.formatNumero(bancos);
    },
    async getSaldocta() {
      if (this.form.ctabancos) {
        try {
          const fecha = this.periodo_cargue.replace(/\-/g, "");
          const cuenta = this.form.ctabancos.cod_puc;
          this.card.loader = true;
          this.form.sdobancos = 0;

          const data = await post.postData({
            url: "Financiero/dlls//PrSaldoAux.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + cuenta + "|",
            method: "",
          });

          let signo = false;
          if (data[0].saldo.includes("-")) {
            signo = true;
          }

          let sdoauxiliar = data[0].saldo.replace(/\-/g, "").trim();
          sdoauxiliar = parseFloat(sdoauxiliar.replace(/\,/g, ""));
          if (signo) {
            sdoauxiliar = sdoauxiliar * -1;
          }
          this.form.sdoauxiliar = sdoauxiliar;

          this.card.loader = false;
          await this.cargarMovimiento();
          await this.get_sdobancocta();
        } catch (err) {
          console.log("Error", err);
          this.form.sdoauxiliar = null;
          this.card.loader = false;
          this.send_error("Error al buscar Saldo Contable");
        }
      }
    },
    async getSaldo() {
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      if (this.form.ctabancos) {
        var cuenta = this.form.ctabancos.cod_puc;
        this.card.loader = true;
        post
          .postData({
            url: "Financiero/dlls//PrSaldoAux.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + cuenta + "|",
            method: "",
          })
          .then((data) => {
            let signo = false;

            if (data[0].saldo.includes("-")) {
              signo = data[0].saldo.includes("-");
            }

            let sdoauxiliar = data[0].saldo.replace(/\-/g, "").trim();
            sdoauxiliar = parseFloat(sdoauxiliar.replace(/\,/g, ""));
            if (signo) {
              sdoauxiliar = sdoauxiliar * -1;
            }
            this.form.sdoauxiliar = sdoauxiliar;

            this.marcar = 1;
            this.cargarMovimiento();
            this.get_diferencia();
            this.card.loader = false;
          })
          .catch((err) => {
            console.log("Error", err);
            this.form.sdoauxiliar = null;
            this.card.loader = false;
            this.send_error("Error al buscar Saldo Contable");
          });
      }
    },
    get_sdobancocta() {
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      if (this.form.ctabancos) {
        var cuenta = this.form.ctabancos.cod_puc;
        this.card.loader = true;
        post
          .postData({
            url: "Financiero/dlls//RpConciliaJ.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + cuenta + "|",
            method: "",
          })
          .then((data) => {
            data = data[0];
            this.conciliacion = data;
            let signo = false;
            if (data.sdobancos_rep.includes("-")) {
              signo = data.sdobancos_rep.includes("-");
            }

            let sdobancos = data.sdobancos_rep.replace(/\-/g, "").trim();
            sdobancos = parseFloat(sdobancos.replace(/\,/g, ""));

            if (signo == true) {
              sdobancos = sdobancos * -1;
            }
            this.form.sdobancos = this.formatNumero(sdobancos);
            var auxiliar =
              parseFloat(
                this.form.sdoauxiliar.toString().replace(/\,/g, "")
              ).toFixed(2) || 0;
            var bancos =
              parseFloat(
                this.form.sdobancos.toString().replace(/\,/g, "")
              ).toFixed(2) || 0;

            var diferencia = parseFloat(bancos - auxiliar).toFixed(2);
            this.form.sdopendiente = this.formatNumero(diferencia);
            this.card.loader = false;
          })
          .catch((err) => {
            console.log("Error", err);
            this.card.loader = false;
            this.send_error("Error al cargar Saldo en Bancos");
          });
      }
    },
    get_sdobanco() {
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var cuenta = this.form.ctabancos.cod_puc;
      this.card.loader = true;
      post
        .postData({
          url: "Financiero/dlls//RpConciliaJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + cuenta + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          this.conciliacion = data;
          data.sdobancos_rep.indexOf("-");
          let signo = 1;

          let sdobancos = data.sdobancos_rep.replace(/\-/g, "").trim();
          sdobancos = parseFloat(sdobancos.replace(/\,/g, ""));
          if (signo) {
            sdobancos = sdobancos * -1;
          }
          this.form.sdobancos = sdobancos;
          this.card.loader = false;
          this.get_diferencia();
        })
        .catch((err) => {
          console.log("Error", err);
          this.card.loader = false;
          this.send_error("Error al cargar Saldo en Bancos");
        });
    },
    get_diferenciacta() {
      var auxiliar =
        parseFloat(this.form.sdoauxiliar.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;
      var bancos =
        parseFloat(this.form.sdobancos.toString().replace(/\,/g, "")).toFixed(
          2
        ) || 0;

      var diferencia = parseFloat(bancos - auxiliar).toFixed(2);

      this.form.sdopendiente = this.formatNumero(diferencia);
      this.form.sdobancos = this.formatNumero(bancos);
    },

    get_puc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "7" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_mask(obj) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, obj, val_edit);
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
  },
};
</script>
