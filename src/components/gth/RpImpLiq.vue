<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-capacity-increase</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Liquidaciones</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  :items="anios_select"
                  label="Año de Búsqueda"
                  outlined
                  clearable
                  hide-details
                  v-model="form.anoserv"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoserv"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>

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
              item-key="nro_pes"
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
                        <td>{{ descripcionEstado(item) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.estado_liq="{ item }">
                  <v-chip class="white--text" small label :color="`${item.estado_liq==1 ? 'red' : 'green'} darken-1`" >{{item.estado_liq == 1 ? 'Anulado' : 'Activo'}}</v-chip>
                </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Liquidación</span>
                </v-tooltip>
              </template>
              <template v-slot:item.conta="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="contabiliza_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-human-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Contabilizar Liquidación</span>
                </v-tooltip>
              </template>              
              <template v-slot:item.anula="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anula_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-empty</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular Liquidación</span>
                </v-tooltip>
              </template>         
              <template v-slot:item.envio="{ item }">                
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="envio_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.cune_liq == ' '"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar DIAN</span>
                </v-tooltip>
              </template>

              <template v-slot:item.consulta="{ item }">                
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                    @click="consultadian_item(item, 0)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="
                        item.cune_liq == '' || item.provdian_fact == ''
                      "
                    >
                    <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
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
                disabled
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
// import pdfMake from "pdfmake/build/pdfmake.js";
// import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
// pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { liquidagth } from "../../_formatos_gth.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      anos: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      prest_facturas: [],
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
      empresa: {},      
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "nro_liq" },
        { text: "Fecha", align: "center", value: "fecha_liq" },
        {
          text: "Primer Apellido",
          align: "center",
          value: "Apellido1colabora_liq",
        },
        {
          text: "Segundo Apellido",
          align: "center",
          value: "Apellido2colabora_liq",
        },
        { text: "Nombre", align: "left", value: "nombrescolabora_liq" },
        { text: "Estado", align: "center", value: "estado_liq" },
        { text: "Imprimir", value: "edit", align: "center" },
        { text: "Contabilizar", value: "conta", align: "center" },
        { text: "Anular", value: "anula", align: "center" },
        { text: "Enviar Dian", value: "envio", align: "center" },        
        { text: "Consultar Dian", value: "consulta", align: "center" },        

      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.get_empresa();
    this.cargar_años();
  },
  computed: {},
  methods: {
    cargar_años() {
      var anos = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anos.push(anioActual - i);
      for (let i = 0; i < 4; i++) anos.push(anioActual + i);

      anos = anos.map((el) => (el = { text: el, value: el }));
      this.anios_select = anos;
      this.form.anoserv = anioActual;
    },

    print_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var nro = item.nro_liq.trim();
      var key = nro + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrGthLiquida01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            liquidagth(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async envio_dian(item) {
      // this.card.loader = true;
      // this.card.disabled = true;
      let res = await this.get_json_dian(item);
      this.card.loader = false;
      this.card.disabled = false;
    },
    get_json_dian(item) {
      this.loader = true;
      return new Promise((resolve) => {
        var fecha = item.fechacorta_liq;
        var consec = parseInt(item.nro_liq);
        var idcolabora = item.idcolabora_liq;
        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          consec +
          "|" +
          idcolabora +
          "|";

        // let proveedor = "3";
        let proveedor = this.empresa.provnom_empr;
        let dll = null;
        if (proveedor === "4") dll = "Financiero/dlls/RpElecLiqJ.dll";
        else if (proveedor === "1") dll = "Financiero/dlls/RpNomEmisionLJ.dll";
        else if (proveedor === "3") dll = "Financiero/dlls/RpNomDelcopJ.dll";
        post
          .postData({
            url: dll,
            data: datosEnvio,
            method: "",
          })
          .then(async (data) => {
            let res = false;
            let nombre =
              item.Apellido1colabora_liq.trim() +
              " " +
              item.nombrescolabora_liq.trim() +
              " ";

            if (proveedor === "4") {
              this.loader = true;
              res = await this.consulta_ws(
                "titan.nomina",
                JSON.stringify(data[0])
              );
              let respuesta_titan = res.errors;
              if (respuesta_titan) {
                this.$emit("snack", {
                  color: "red",
                  text: respuesta_titan,
                  estado: true,
                });
              }
              let respuestadian = res.success;
              let mensajedian = res.message;

              // let respuestadian =
              //   res.ResponseDian.Envelope.Body.SendNominaSyncResponse
              //     .SendNominaSyncResult.IsValid;
              //   res.ResponseDian.Envelope.Body.SendNominaSyncResponse
              //     .SendNominaSyncResult.ErrorMessage.string;

              if (respuestadian == "true") {
                let cune = res.cune;
                let diasvence = res.certificate_days_left;
                this.$emit("snack", {
                  color: "success",
                  text:
                    "Nómina Procesada Correctamente -Dias para renovación:" +
                    diasvence +
                    "-",
                  estado: true,
                });
                await this.guardar_cune(cune, null, item);
                this.cargarcontenido();
              } else {
                if (mensajedian == "Este documento ya fue enviado anteriormente, se registra en la base de datos."){
                  let cunedian = res.cune.trim()
                  await this.guardar_cune(cunedian, null, item);
                  this.cargarcontenido();                  


                }else{
                  this.$emit("snack", {
                  color: "red",
                  text: mensajedian,
                  estado: true,
                });

                }
              }
              this.loader = false;



            } else {
              console.log("No se ha definido un WS");
              resolve(false);
            }
            this.loader = false;
            resolve(res);
          })
          .catch((err) => {
            console.log(err)
            this.loader = false;
            resolve(false);
            let msj = "";
            if (err.Code == "8") msj = err.Mensaje[0].payroll.msg;
            else if (err.Code == "7" || err.Code == "4") msj = err.Mensaje[0].msg;
            else msj = err.Mensaje[0].Document;
            this.send_error(msj);
          });
      });
    },
    consulta_ws(ws, plano) {
      return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("nomina", plano);
        fetch(`https://server1ts.net//financiero/inc/${ws}.php`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            this.loader = false;
            console.log(err);
          });
      });
    },
    async guardar_cune(cune = "", idtrans = "", item) {
      this.loader = true;
      var fecha = item.fechacorta_liq;
      var empleado = item.idcolabora_liq;
      var agencia = item.agencia_liq;
      let consec = item.nro_liq.trim();

      await post
        .postData({
          url: "Financiero/dlls/RpNomCune.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            empleado +
            "|" +
            agencia +
            "|" +
            cune +
            "|" +
            consec +
            "|"  +
            "LQ" +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
        });

      return true;
    },
  

    contabiliza_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var nro = item.nro_liq.trim();
      var key = nro + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrGthLiquida02.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            liquidagth(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al Contabilizar el documento");
        });
    },
    anula_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var nro = item.nro_liq.trim();
      var key = nro + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrGthAnulaLiq.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al Anular documento");
        });
    },    
    descripcionEstado(e) {
      return e == "1" ? "Anulado" : "Activo";
    },
    cargarcontenido() {
      var anobusq = this.form.anoserv;
      this.contenido = [];

      if (!anobusq) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona un Año",
          estado: true,
        });
      } else {
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpGthLiqJ.dll",
            data: sessionStorage.Sesion + "|" + anobusq + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
            this.contenido.pop();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Liquidaciones",
              estado: true,
            });
          });
      }
    },
    consultadian_item(item, tipo) {
      let cufe = item.cune_liq.trim();
      if (tipo === 1) {
        cufe = item.idajustedian_fact;
      }

      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.empresa = data[0];          
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
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
