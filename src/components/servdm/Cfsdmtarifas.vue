<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Tarifas</v-list-item-title
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
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-divider color="succes"></v-divider>
          <v-row>
            <v-col class="d-flex pb-0" cols="12" sm="4">
              <v-switch
                v-model="form.eliminar"
                label="Eliminar"
                hide-details
              ></v-switch>
            </v-col>
            <v-col class="d-flex pb-0" cols="12" sm="4">
              <v-switch
                v-model="form.bloquear"
                label="Bloquear"
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>

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
              class="elevation-1"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.uso_rep="{ item }">{{
                item.uso_rep == "01" ? "Residencial" : "Comercial"
              }}</template>

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
    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Básico</v-tab>
            <v-tab>Componentes</v-tab>
            <v-tab>Tarifas</v-tab>
            <v-tab>Subsidios</v-tab>
            <v-tab>Contribuciones</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="12" sm="3">
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
                        @input="dialogPicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="usos"
                      label="Uso"
                      outlined
                      hide-details
                      v-model="form.uso"
                      required
                      return-object
                      :error="errores.uso"
                      @input="errores.uso = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
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

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="form.ciudad"
                      :items="filterMunicipios"
                      item-value="value"
                      outlined
                      :error="errores.ciudad"
                      @change="errores.ciudad = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="ml-1 mb-2">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Tasa Financiación"
                      clearable
                      outlined
                      required
                      v-model="form.tasames"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Interes de Mora"
                      clearable
                      outlined
                      required
                      v-model="form.tasamora"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3" sm="2">
                    <v-text-field
                      label="Gm"
                      clearable
                      outlined
                      required
                      v-model="form.compo_gm"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3" sm="2">
                    <v-text-field
                      label="Tm"
                      clearable
                      outlined
                      required
                      v-model="form.compo_tm"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3" sm="2">
                    <v-text-field
                      label="DmR"
                      clearable
                      outlined
                      required
                      v-model="form.compo_dm"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="DmNr"
                      clearable
                      outlined
                      required
                      v-model="form.compo_dmnr"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3" sm="2">
                    <v-text-field
                      label="Fpc"
                      clearable
                      outlined
                      required
                      v-model="form.compo_fpc"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cvm"
                      clearable
                      outlined
                      required
                      v-model="form.compo_cvm"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Ccm"
                      clearable
                      outlined
                      required
                      v-model="form.compo_ccm"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="CuvR ($/M3)"
                      clearable
                      outlined
                      required
                      v-model="form.compo_cuvm"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="CuvNR ($/M3)"
                      clearable
                      outlined
                      required
                      v-model="form.compo_cuvnr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mb-1 ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cuf $/factura"
                      clearable
                      outlined
                      required
                      v-model="form.compo_cuf"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3" sm="2">
                    <v-text-field
                      label="P. Perdidas"
                      clearable
                      outlined
                      required
                      v-model="form.compo_p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex ml-1 mt-1"> Residencial </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Estrato 1 (0-7,26 M3)"
                      clearable
                      outlined
                      required
                      v-model="form.tar_est1res1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Estrato 2 (0-7,26 M3)"
                      clearable
                      outlined
                      required
                      v-model="form.tar_est2res1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Consumo Mayor 7,26 M3"
                      clearable
                      outlined
                      required
                      v-model="form.tarr_mayor"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-2 ml-1"> Comercial </v-row>

                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Estrato 1 (0-100 M3)"
                      clearable
                      outlined
                      required
                      v-model="form.tar_est1com1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Mayor 100 M3"
                      clearable
                      outlined
                      required
                      v-model="form.tar_mayorcom"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="% Subsidio Estrato 1"
                      clearable
                      outlined
                      required
                      v-model="form.subs_E1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="% Subsidio Estrato 2"
                      clearable
                      outlined
                      required
                      v-model="form.subs_E2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="% Contribución Estrato 5 y 6"
                      clearable
                      outlined
                      required
                      v-model="form.contr_E5"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="% Contribución Comercial"
                      clearable
                      outlined
                      required
                      v-model="form.contr_com"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <v-divider></v-divider>

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
      tab: 0,
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
      componentes: [],
      filterMunicipios: [],
      ciudades_dian: [],
      departamentos: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Periodo", align: "center", value: "periodo_rep" },
        { text: "Uso", align: "center", value: "descruso_rep" },
        { text: "Ciudad", align: "left", value: "ciudemp_rep" },
        // { text: "Departamento", align: "center", value: "ciudad_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        componente: false,
        descripcion: false,
        estado: false,
      },
      usos: [
        { text: "Residencial", value: 1 },
        { text: "Comercial", value: 2 },
        { text: "Oficial", value: 9 },

      ],

      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarCiudades();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.form.periodo = item.periodo_rep;

      var busqueda = this.usos.find(
        (el) => el.value == parseFloat(item.uso_rep)
      );
      this.form.uso = busqueda || null;
      let departamento = item.ciudad_rep.substring(0, 2);
      let busqueda_departamento = this.departamentos.find(
        (el) => el.value == departamento
      );
      this.form.departamento = busqueda_departamento.value;
      setTimeout(this.get_municipios, 500);

      this.form.ciudad = item.ciudad_rep;
      this.form.tasames = item.tasames_rep.trim();
      this.form.tasamora = item.tasamora_rep.trim();
      this.form.compo_gm = item.compgm_rep.trim();
      this.form.compo_tm = item.comptm_rep.trim();
      this.form.compo_dm = item.compdm_rep.trim();
      this.form.compo_dmnr = item.compdmnr_rep.trim();

      this.form.compo_fpc = item.compfpc_rep.trim();
      this.form.compo_cvm = item.compcvm_rep.trim();
      this.form.compo_ccm = item.compccm_rep.trim();
      this.form.compo_cuvm = item.compcuvm_rep.trim();
      this.form.compo_cuvnr = item.compcuvnr_rep.trim();

      this.form.compo_cuf = item.compcuf_rep.trim();
      this.form.compo_p = item.compp_rep.trim();
      this.form.tar_est1res1 = item.est1res1_rep.trim();
      this.form.tar_est2res1 = item.est2res1_rep.trim();
      this.form.tarr_mayor = item.mayorr_rep.trim();
      this.form.tar_est1com1 = item.est1com1_rep.trim();
      this.form.tar_mayorcom = item.mayorcom_rep.trim();
      this.form.subs_E1 = item.subse1_rep.trim();
      this.form.subs_E2 = item.subse2_rep.trim();
      this.form.contr_E5 = item.contre5_rep.trim();
      this.form.contr_com = item.contrcom_rep.trim();

      this.form.estado = item.estado_rep == "1" ? true : false;
      // this.buscarNumero();
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo) {
        this.errores.periodo = true;
        this.send_error("Periodo Obligatorio!");
      } else if (!data.uso) {
        this.errores.uso = true;
        this.send_error("Uso Obligatorio!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Departamento Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Ciudad Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var periodo = data.periodo ? data.periodo.replace(/\-/g, "") : "";
      var uso = data.uso.value;
      var ciudad = data.ciudad;
      var tasames = data.tasames ? data.tasames.replace(/\,/g, "") : "0";
      var tasammora = data.tasamora ? data.tasamora.replace(/\,/g, "") : "0";

      var compo_gm = data.compo_gm ? data.compo_gm.replace(/\,/g, "") : "0";
      var compo_tm = data.compo_tm ? data.compo_tm.replace(/\,/g, "") : "0";
      var compo_dm = data.compo_dm ? data.compo_dm.replace(/\,/g, "") : "0";
      var compo_dmnr = data.compo_dmnr
        ? data.compo_dmnr.replace(/\,/g, "")
        : "0";

      var compo_fpc = data.compo_fpc ? data.compo_fpc.replace(/\,/g, "") : "0";
      var compo_cvm = data.compo_cvm ? data.compo_cvm.replace(/\,/g, "") : "0";
      var compo_ccm = data.compo_ccm ? data.compo_ccm.replace(/\,/g, "") : "0";
      var compo_cuvm = data.compo_cuvm
        ? data.compo_cuvm.replace(/\,/g, "")
        : "0";
      var compo_cuvnr = data.compo_cuvnr
        ? data.compo_cuvnr.replace(/\,/g, "")
        : "0";

      var compo_cuf = data.compo_cuf ? data.compo_cuf.replace(/\,/g, "") : "0";
      var compo_p = data.compo_p ? data.compo_p.replace(/\,/g, "") : "0";
      var tar_est1res1 = data.tar_est1res1
        ? data.tar_est1res1.replace(/\,/g, "")
        : "0";
      var tar_est2res1 = data.tar_est2res1
        ? data.tar_est2res1.replace(/\,/g, "")
        : "0";
      var tarr_mayor = data.tarr_mayor
        ? data.tarr_mayor.replace(/\,/g, "")
        : "0";
      var tar_est1com1 = data.tar_est1com1
        ? data.tar_est1com1.replace(/\,/g, "")
        : "0";
      var tarc_mayor = data.tar_mayorcom
        ? data.tar_mayorcom.replace(/\,/g, "")
        : "0";
      var contr_E5 = data.contr_E5 ? data.contr_E5.replace(/\,/g, "") : "0";
      var contr_com = data.contr_com ? data.contr_com.replace(/\,/g, "") : "0";

      var subs_E1 = data.subs_E1 ? data.subs_E1.replace(/\,/g, "") : "0";
      var subs_E2 = data.subs_E2 ? data.subs_E2.replace(/\,/g, "") : "0";

      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Servdm/dlls/Cftarifas.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          periodo +
          "|" +
          uso +
          "|" +
          ciudad +
          "|" +
          compo_gm +
          "|" +
          compo_tm +
          "|" +
          compo_dm +
          "|" +
          compo_fpc +
          "|" +
          compo_cvm +
          "|" +
          compo_ccm +
          "|" +
          compo_cuvm +
          "|" +
          compo_cuf +
          "|" +
          compo_p +
          "|" +
          tar_est1res1 +
          "|" +
          tar_est2res1 +
          "|" +
          tarr_mayor +
          "|" +
          tar_est1com1 +
          "|" +
          tarc_mayor +
          "|" +
          subs_E1 +
          "|" +
          subs_E2 +
          "|" +
          contr_E5 +
          "|" +
          contr_com +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          tasames +
          "|" +
          compo_cuvnr +
          "|" +
          compo_dmnr +
          "|" +
          tasammora +
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
    agregar_item() {
      this.init_form();
      // this.buscarNumero();

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

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
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

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfTarifasJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          // data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tarifas",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      var clasifica = this.form.clasifica;
      if (clasifica) {
        var vlrclasifica = clasifica.value;
        post
          .postData({
            url: "Financiero/dlls/CfcargosN.dll",
            data: sessionStorage.Sesion + "|" + vlrclasifica + "|",
            method: "",
          })
          .then((data) => {
            this.form.codigo = data[0].nro;
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar registro",
              estado: true,
            });
          });
      }
    },

    cargarComponentes() {
      post
        .postData({
          url: "Servdm/dlls/CfcomptarJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.componentes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar componentes",
            estado: true,
          });
        });
    },

    format_componentes(val) {
      return `${parseInt(val.codigo_rep) || 0} - ${val.descrip_rep.trim()}`;
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
