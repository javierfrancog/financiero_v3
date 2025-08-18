<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-currency-usd-off</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Deducciones</v-list-item-title
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
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
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
              class="elevation-1"
            >
              <template v-slot:item.estadobase_rep="{ item }">
                {{ item.estadobase_rep == "1" ? "Bloqueado" : "Activo" }}
              </template>

              <template v-slot:item.bprest_rep="{ item }">
                {{ item.bprest_rep == "0" ? "No" : "Si" }}
              </template>

              <template v-slot:item.bvacac_rep="{ item }">
                {{ item.bvacac_rep == "0" ? "No" : "Si" }}
              </template>

              <template v-slot:item.bssocial_rep="{ item }">
                {{ item.bssocial_rep == "0" ? "No" : "Si" }}
              </template>

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

          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-select
                :items="clasificaciones"
                label="Clasificación"
                outlined
                clearable
                return-object
                hide-details
                v-model="form.clasifica"
                required
                @change="cambioClasificacion"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3" sm="3" v-if="estado_porcentaje">
              <v-text-field
                label="Porcentaje"
                clearable
                outlined
                required
                v-model="form.porcent"
                hide-details
                v-money="money"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3" sm="3" v-if="estado_valor">
              <v-text-field
                label="Valor"
                clearable
                outlined
                required
                v-model="form.valor"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="8" v-if="form.codigo > '0002'">
              <v-autocomplete
                label="Cuenta Crédito"
                v-model="form.ctacontab"
                :items="datosctas"
                :item-text="format_ctas"
                item-value="cod_puc"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="5">
              <v-autocomplete
                :items="tiporep"
                label="Reporte Exogéna"
                v-model="form.tiporep"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <!-- <v-row>
            <v-col class="d-flex" cols="3" sm="3">
              <v-text-field
                label="Codigo Importación"
                clearable
                outlined
                required
                v-model="form.codimport"
                hide-details
              ></v-text-field>
            </v-col>          
          </v-row> -->

          <v-divider></v-divider>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.vrmanual" label="Valor Manual"></v-switch>
            </v-col>

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
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      datosctas: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "left", value: "codigobase_rep" },
        { text: "Descripción", align: "left", value: "descrbase_rep" },
        { text: "Estado", align: "center", value: "estadobase_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      clasificaciones: [
        { text: "Deduccion Salud", value: 1 },
        { text: "Deduccion Pensión", value: 2 },
        { text: "Deduccion Prestamo", value: 3 },
        { text: "Deduccion Anticipo", value: 4 },
        { text: "Deduccion RteFte", value: 5 },
        { text: "Deduccion Sanción", value: 6 },
        { text: "Deduccion Libranza", value: 7 },
        { text: "Pagos a Terceros", value: 8 },
        { text: "Otras Deducciones", value: 98 },
      ],
      tiporep: [
        { text: "No Aplica", value: 99 },
        { text: "Aportes Obligatorios Salud", value: 51 },
        { text: "Aportes Obligatorios Pension", value: 52 },
        { text: "Aportes Voluntarios  Pension", value: 53 },
        { text: "Aportes a Cuentas AFC", value: 54 },
        { text: "Aportes a Cuentas AVC", value: 55 },
        { text: "Retencion en la Fuente", value: 56 },
      ],

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
    this.cargarTablactas();
  },
  computed: {},
  methods: {
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },

    cambioClasificacion() {
      var clasificacion = this.form.clasifica;
      if (clasificacion) {
        if (clasificacion.value == 3) {
          this.estado_porcentaje = true;
          this.estado_valor = false;
        } else if (clasificacion.value == 2) {
          this.estado_porcentaje = false;
          this.estado_valor = false;
        } else {
          this.estado_porcentaje = false;
          this.estado_valor = false;
        }
      } else {
        this.estado_porcentaje = false;
        this.estado_valor = false;
      }
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigobase_rep;
      this.form.descripcion = item.descrbase_rep;
      // this.form.prestacional = item.bprest_rep == "1" ? true : false;
      // this.form.vacaciones = item.bvacac_rep == "1" ? true : false;
      // this.form.segsoc = item.bssocial_rep == "1" ? true : false;
      this.form.vrmanual = item.vrmanual_rep == "1" ? true : false;            
      this.codimport = item.codimport_rep;

      let busqueda_clasif = this.clasificaciones.find(
        (el) => parseInt(el.value) == parseInt(item.clasifbase_rep)
      );
      this.form.clasifica = busqueda_clasif;

      let busqueda_cta = this.datosctas.find(
        (el) => el.cod_puc.trim() == item.ctadeb_rep.trim()
      );

      this.form.ctacontab = busqueda_cta;

      var busqueda_tipoex = this.tiporep.find(
        (el) => el.value == item.tipoex_rep
      );
      this.form.tiporep = busqueda_tipoex;

      // this.form.estado = item.estadobase_rep == "1" ? true : false;

      
      // this.cambioClasificacion();
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripción Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var clasifica = data.clasifica.value;
      var porcentaje = data.porcent;
      // var valor = (parseInt(data.valor) != 0 ? data.valor : null);
      var valor = 0;
      var bprest = data.prestacional ? "1" : "0";
      var bvacac = data.vacaciones ? "1" : "0";
      var bssocial = data.segsoc ? "1" : "0";
      var ctacredito = data.ctacontab.cod_puc ? data.ctacontab.cod_puc : "0";
      var vrmanual = data.vrmanual ? "1" : "0";  
      var codimport = data.codimport;   


      var tipoex = data.tiporep ? data.tiporep.value : "0";
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/CfGthbase.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "2" +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          clasifica +
          "|" +
          (clasifica == 1 || clasifica == 3 ? porcentaje : 0) +
          "." +
          "|" +
          (clasifica != 2 ? 0 : valor) +
          "|" +
          bprest +
          "|" +
          bvacac +
          "|" +
          bssocial +
          "|" +
          "0" +
          "|" +
          ctacredito +
          "|" +
          tipoex +
          "|" +
          "0" +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
           vrmanual +
          "|" +
           codimport +
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
      this.buscarNumero();

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

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfGthbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Devengos",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      post
        .postData({
          url: "Financiero/dlls/CfGthbaseN.dll",
          data: sessionStorage.Sesion + "|" + 2 + "|",
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
    },

    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
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
