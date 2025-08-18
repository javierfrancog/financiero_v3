<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-clipboard-text-play-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reportar Novedad</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Periodo de Novedad"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                @change="cargarcontenido()"

                no-title
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="justify-end">
          <v-btn
            color="indigo"
            class="ma-2 white--text px-12 d-flex justify-end"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>

          <v-btn
            color="success"
            class="ma-2 white--text"
            large
            depressed
            @click="agregar_item()"
          >
            Agregar Novedad
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>
        </v-row>

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
              item-key="idnomina_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="orange--text">Base</th> -->
                          <th class="orange--text text-left">Descripción</th>
                          <th class="orange--text text-left">Cantidad</th>
                          <th class="orange--text text-rigth">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="el in item.basesnomina_rep"
                          :key="el.codigo_rep"
                        >
                          <!-- <td>{{ el.codigo_rep }}</td> -->
                          <td class="text-left">{{ el.descripcion_rep }}</td>
                          <td class="text-left">{{ el.cantidad_rep }}</td>
                          <td class="text-center">{{ el.valor_rep }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>

              <template v-slot:item.estadobase_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="purple"
                      fab
                      :disabled="item.descnovedad_rep.trim() == 'Anulado' ? true : false  || item.estado_rep == '2'
                          ? true
                          : false" 
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-account-box-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </template>
              <template v-slot:item.soporte="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_soporte(item)"
                      color="red"
                      :disabled="item.descnovedad_rep.trim() == 'Anulado' ? true : false" 
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Contrato</span>
                </v-tooltip>
              </template>

              <template v-slot:item.anular="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_anula(item)"
                      color="red"
                      fab
                      small
                      icon
                      :disabled="item.descnovedad_rep.trim() == 'Anulado' ? true : false  || item.estado_rep == '2'
                          ? true
                          : false"                       
                      v-on="on"
                    >
                      <v-icon>mdi-delete-empty-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-dialog
              v-model="dialogo_novedad.estado"
              persistent
              max-width="900"
              autocomplete="off"
            >
              <v-card
                :disabled="dialogo_novedad.loader"
                :loading="dialogo_novedad.loader"
              >
                <span class="title col-12">{{ dialogo_novedad.titulo }}</span>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        label="Novedad"
                        v-model="form.novedad"
                        :items="basesnomina"
                        :item-text="format_bases"
                        item-value="codigo_rep"
                        outlined
                        hide-details
                        clearable
                        @change="change_novedad()"
                        :error="errores.novedad"
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col class="d-flex" cols="3">
                      <v-text-field
                        label="Consecutivo"
                        disabled
                        outlined
                        required
                        v-model="form.consecutivo"
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="4">
                      <v-text-field
                        label="Numero Soporte"
                        clearable
                        outlined
                        required
                        v-model="form.soporte"
                        hide-details
                      ></v-text-field>
                    </v-col>

                    <v-col class="d-flex" cols="3">
                      <v-menu
                        ref="menu"
                        v-model="dialogPicker"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        required
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            label="Fecha Inicial"
                            outlined
                            v-model="form.fechaini"
                            hide-details
                            :error="errores.fechaini"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.fechaini"
                          @input="dialogPicker = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col class="d-flex" cols="3">
                      <v-menu
                        ref="menu"
                        v-model="pickerFinal"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        required
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            label="Fecha Final"
                            outlined
                            v-model="form.fechafin"
                            hide-details
                            :error="errores.fechafin"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.fechafin"
                          @input="pickerFinal = false"
                          @change="calcular_dias()"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="3">
                      <v-text-field
                        label="Total Dias"
                        clearable
                        outlined
                        disabled
                        v-model="form.dias"
                        :error="errores.dias"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="9">
                      <v-text-field
                        label="Observaciones"
                        clearable
                        outlined
                        required
                        :error="errores.detalle"
                        @input="errores.detalle = false"
                        v-model="form.detalle"
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="12">
                      <v-file-input
                        label="Buscar PDF"
                        outlined
                        chips
                        counter
                        color="blue darken-1"
                        hide-details
                        :error="errores.archivo"
                        :show-size="1000"
                        accept="application/pdf"
                        v-model="dialogo_archivo.model"
                        id="archivo_pdf"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="dialogo_novedad.estado = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-2"
                    class="white--text px-12 mx-5"
                    @click="guardar()"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog
              v-model="dialogo_prestamo.estado"
              persistent
              max-width="900"
            >
              <v-card
                :disabled="dialogo_prestamo.loader"
                :loading="dialogo_prestamo.loader"
              >
                <span class="title col-12">{{ dialogo_prestamo.titulo }}</span>
                <v-card-text>
                  <v-row>
                    <v-col class="d-flex" cols="3">
                      <v-text-field
                        label="Consecutivo"
                        disabled
                        outlined
                        required
                        v-model="form.consecutivo"
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        label="Valor Prestamo"
                        outlined
                        hide-details
                        clearable
                        v-model="form.valorprest"
                        :error="errores.valorprest"
                        @change="errores.valorprest = false"
                        v-money="money"
                      ></v-text-field>
                    </v-col>

                    <v-col class="d-flex" cols="3">
                      <v-text-field
                        label="Total Cuotas"
                        clearable
                        outlined
                        required
                        v-model="form.tcuotas"
                        :error="errores.tcuotas"
                        @change="errores.tcuotas = false"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="3">
                      <v-menu
                        ref="menu"
                        v-model="dialogPickerPrest"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        required
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            label="Fecha Primer Descuento"
                            outlined
                            v-model="form.fechainidesc"
                            hide-details
                            :error="errores.fechainidesc"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.fechainidesc"
                          @change="errores.fechainidesc = false"
                          @input="dialogPickerPrest = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col class="d-flex" cols="3">
                      <v-select
                        :items="[
                          { text: 'Mensual', value: 1 },
                          { text: 'Quincenal', value: 2 },
                        ]"
                        label="Forma Pago"
                        outlined
                        clearable
                        v-model="form.tipoliq"
                        required
                        :error="errores.tipoliq"
                        hide-details
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-divider color="#FF6F00"></v-divider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="dialogo_prestamo.estado = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="guardar_prestamo()"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
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
      pickerMes: false,
      dialogPickerPrest: false,
      pickerInicial: false,
      pickerFinal: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      colaborador: [],
      basesnomina: [],
      tipo_selecc: 0,
      dialogo_novedad: {
        estado: false,
        titulo: null,
        tipo: 0,
        loader: false,
      },
      dialogo_prestamo: {
        estado: false,
        titulo: null,
        tipo: 0,
        loader: false,
      },
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
      },
      search: "",
      form: {
        novedad: null,
        consecutivo: null,
        fecha: null,
      },
      headers: [
        // { text: "Editar", value: "edit", align: "center" },
        { text: "Ver Soporte", value: "soporte", align: "center" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Colaborador", align: "left", value: "nombrecolabora_rep" },
        { text: "Cargo", align: "left", value: "cargo_rep" },
        { text: "Novedad", align: "left", value: "nombrebase_rep" },
        { text: "Inicio Novedad", align: "left", value: "fechainicio_rep" },
        { text: "Fin Novedad", align: "left", value: "fechafin_rep" },
        { text: "Estado", align: "left", value: "descnovedad_rep" },
        {
          text: "Observación Validación",
          align: "left",
          value: "Observacionvalida",
        },
        {
          text: "Lider",
          align: "left",
          value: "nombrevalida_rep",
        },

        { text: "Anular", value: "anular", align: "center" },        
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        colabora: false,
        novedad: false,
        archivo: false,
        fechaini: false,
        fechafin: false,
        fechainidesc: false,
        detalle: false,
        dias: false,
        valorprest: false,
        tcuotas: false,
        tipoliq: false,
      },

      card_estado: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    this.get_basico();
    this.cargar_empresa();
  },
  methods: {
    cargar_empresa() {
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
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    change_novedad() {
      console.log(this.form);
      if (this.form.novedad.llavebase_rep == 2003) {
        this.dialogo_prestamo.estado = true;
        this.tipo_selecc = 2;
      }
    },
    get_anula(item){
      let consecutivo = item.consec_rep;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthNovedadX.DLL",
          data: sessionStorage.Sesion + "|" + consecutivo + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargarcontenido()
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al anular Novedad",
            estado: true,
          });
        });

    },
    agregar_item() {
      this.init_form();
      this.dialogo_novedad.estado = true;
      this.dialogo_novedad.titulo = this.dialogo_novedad.tipo = 0;
      this.dialogo_novedad.titulo =sessionStorage.User;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthNovedadN.DLL",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.consecutivo = parseFloat(data[0].nro);
          this.dialogo_archivo.model = null;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al asignar Consecutivo",
            estado: true,
          });
        });
    },
    editar_item(item) {
      this.dialogo_novedad.tipo = 1;
      let busqueda_colabora = this.colaborador.find(
        (el) => el.idcolabora_rep == parseInt(item.idcolabora_rep)
      );
      this.form.colabora = busqueda_colabora;

      this.dialogo_novedad.estado = true;
      this.dialogo_novedad.titulo = item.nombrecolabora_rep.trim();
      let busqueda_novedad = this.basesnomina.find(
        (el) => el.llavebase_rep == item.codbase_rep
      );
      this.form.novedad = busqueda_novedad;

      this.form.consecutivo = item.consec_rep;
      this.form.soporte = item.idsoporte_rep.trim();
      this.form.fechaini = item.fechainicio_rep.trim();
      this.form.fechafin = item.fechainicio_rep.trim();
      this.form.dias = item.cant_rep;
      this.form.detalle = item.Observaciones64.trim();
    },
    calcular_dias() {
      let fechaIni = new Date(this.form.fechaini);
      let fechaFin = new Date(this.form.fechafin);
      let diferencia = fechaFin - fechaIni;
      let Dias = diferencia / (1000 * 60 * 60 * 24);
      this.form.dias = Dias + 1;
    },
    get_soporte(item) {
      let empresa = parseFloat(this.empresa.id_empr);
      let consecutivo = item.consec_rep;
      let idFile = empresa + "_NOVEDAD_" + consecutivo + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/GTH/" + idFile;
      window.open(url, "_blank").focus();
    },
    async up_file_drive(consecutivo) {
      let empresa = parseFloat(this.empresa.id_empr);
      let nombre_pdf = empresa + "_NOVEDAD_" + consecutivo + ".pdf";
      let data = new FormData();
      data.append("nombre_pdf", nombre_pdf);
      data.append("file", this.dialogo_archivo.model);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_titan/cargue_gth.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.dialogo_archivo.loader = false;
      this.dialogo_archivo.estado = false;
      this.cancelar_subida();

      this.$emit("snack", {
        color: "success",
        text: "Contrato Guardado Correctamente",
        estado: true,
      });
    },
    async guardar() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.novedad) {
        this.errores.novedad = true;
        console.log(this.errores);
        this.send_error("Seleccione la novedad!");
      } else if (!data.fechaini) {
        this.errores.fechaini = true;
        this.send_error("Debe indicar la fecha inicial!");
      } else if (!data.fechafin) {
        this.errores.fechafin = true;
        this.send_error("Debe indicar la fecha final!");
      } else if (!data.detalle) {
        this.errores.detalle = true;
        this.send_error("Debe indicar alguna observación!");
      } else if (this.dialogo_archivo.model == null) {
        this.errores.archivo = true;
        this.send_error("Debe seleccionar el soporte en Pdf !!");
      } else {
        this.card_estado = true;
        this.dialogo_novedad.estado = false;
        let periodo = data.fecha.replace(/\-/g, "");
        let colaborador = sessionStorage.Sesion.substring(16, 30);
        let novedad = data.novedad.llavebase_rep;
        let consecutivo = data.consecutivo;
        let soporte = data.soporte ? data.soporte.trim() : "";
        let fechaini = data.fechaini.replace(/\-/g, "");
        let fechafin = data.fechafin.replace(/\-/g, "");
        let dias = data.dias;
        let observaciones = data.detalle.trim();

        let estado = data.estado ? "1" : "0";
        let tipo = this.dialogo_novedad.tipo;

        let datos = {
          url: "Financiero/dlls/PrGthNovedad.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            periodo +
            "|" +
            colaborador +
            "|" +
            novedad +
            "|" +
            consecutivo +
            "|" +
            soporte +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            dias +
            "|" +
            observaciones +
            "|" +
            estado +
            "|" +
            "0" +
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
            console.log(data);
            let consecutivo = data[0].msg;
            this.up_file_drive(consecutivo);
            this.card_estado = false;
            // this.init_form();
            this.cargarcontenido();
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al grabar Registro");
          });
      }
    },
    cargarcontenido() {
      let id_colabora = sessionStorage.Sesion.substring(16, 30);
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthNovedadJ.DLL",
          data: sessionStorage.Sesion + "|" + periodo + "|" + id_colabora + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Novedades",
            estado: true,
          });
        });
    },
    get_basico: function () {
      post
        .postData({
          url: "Financiero/dlls/CfGthbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "99" + "|"  + "2" + "|",

          method: "",
        })
        .then((data) => {
          this.basesnomina = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_bases: function (val) {
      return `${val.descrbase_rep.trim()}`;
    },
    init_form() {
      this.form.novedad = null;
      this.form.consecutivo = null;
      this.form.soporte = null;
      this.form.fechaini = null;
      this.form.fechafin = null;
      this.form.dias = null;
      this.form.detalle = null;

      this.errores = {
        codigo: false,
      };
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