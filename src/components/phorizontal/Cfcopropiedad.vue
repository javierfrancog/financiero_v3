<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-home-city-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Copropiedades</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
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
            >
              <template v-slot:item.nro_rep="{ item }">
                {{ parseFloat(item.nro_rep) }}
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-5">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Residentes</v-tab>
            <v-tab>Vehiculos</v-tab>
            <v-tab>Mascotas</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat class="mt-3">
                <v-row class="ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="tipo"
                      label="Tipo"
                      clearable
                      return-object
                      hide-details
                      required
                      v-model="form.tipo"
                      :error="errores.tipo"
                      @change="errores.tipo = false"
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="ubicacion"
                      label="Ubicación"
                      clearable
                      return-object
                      hide-details
                      v-model="form.ubicacion"
                      required
                      :error="errores.ubicacion"
                      @change="errores.ubicacion = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Id Ubicacion"
                      clearable
                      required
                      filled
                      v-model="form.idubicación"
                      :error="errores.idubicación"
                      @input="errores.idubicación = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Número"
                      clearable
                      required
                      filled
                      v-model="form.numero"
                      :error="errores.numero"
                      @input="errores.numero = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="ml-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Propietario"
                      v-model="form.propietario"
                      :items="ruts"
                      clearable
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      @change="select_propiet()"
                      return-object
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Area"
                      v-model="form.area"
                      :items="areas"
                      :item-text="format_areas"
                      hide-details
                      @change="errores.area = false"
                      :error="errores.area"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Teléfono"
                      clearable
                      required
                      filled
                      disabled
                      v-model="form.telefono1"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Teléfono"
                      clearable
                      required
                      filled
                      disabled
                      v-model="form.telefono2"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Correo"
                      clearable
                      disabled
                      filled
                      v-model="form.correo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="estado"
                      label="Estado"
                      clearable
                      return-object
                      hide-details
                      required
                      v-model="form.estado"
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="8">
                    <v-textarea
                      label="Observaciones"
                      clearable
                      outlined
                      required
                      v-model="form.observaciones"
                      hide-details
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col class="d-flex mb-1" cols="2">
                    <v-switch
                      v-model="form.eliminar"
                      label="Eliminar"
                      hide-details
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
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
      singleExpand: true,
      expanded: [],
      contenido: [],
      areas: [],
      ruts: [],
      search: "",
      tab: 0,
      form: {
        tipo: null,
        estado: null,
        observaciones: null,
      },
      tipo: [
        { text: "Casa", value: 1 },
        { text: "Apartamento", value: 2 },
        { text: "Parqueadero", value: 3 },
      ],
      estado: [
        { text: "Normal", value: 1 },
        { text: "Prejuridico", value: 2 },
        { text: "Juridico", value: 3 },
        { text: "Con Acuerdo", value: 4 },
      ],
      ubicacion: [
        { text: "Manzana", value: 1 },
        { text: "Torre", value: 2 },
        { text: "Bahía", value: 3 },
        { text: "Sótano", value: 4 },
      ],
      headers: [
        { text: "Tipo", align: "center", value: "desctipo_rep" },
        { text: "Número", align: "center", value: "nro_rep" },
        { text: "Ubicación", align: "left", value: "descubica_rep" },
        { text: "Id_Ubicación", align: "center", value: "ubic2_rep" },
        { text: "Propietario", align: "left", value: "descrpropiet_rep" },
        { text: "Area", align: "center", value: "vlrareas_rep" },
        { text: "Estado", align: "center", value: "descestado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        tipo: false,
        ubicacion: false,
        idubicación: false,
        numero: false,
        area: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_ruts();
    this.get_areas();
  },
  computed: {},
  methods: {
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_areas(val) {
      return `${val.valor_rep}`;
    },
    get_ruts() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts = data;
          this.cargarcontenido();
          this.loader = false;          
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Administradoras",
            estado: true,
          });
        });
    },
    get_areas() {
      post
        .postData({
          url: "Phorizontal/dlls/CfAreasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.areas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Areas",
            estado: true,
          });
        });
    },
    select_propiet() {
      this.form.telefono1 = this.form.propietario.telefono_rut;
      this.form.telefono2 = this.form.propietario.telecontacto_rut;
      this.form.correo = this.form.propietario.correo_rut;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Actualizar CoPropiedad";

      let busqueda = this.tipo.find((el) => el.value == item.tipo_rep);
      this.form.tipo = busqueda;

      busqueda = this.ubicacion.find((el) => el.value == item.ubic1_rep);
      this.form.ubicacion = busqueda;

      this.form.idubicación = item.ubic2_rep;
      this.form.numero = item.nro_rep;

      busqueda = this.ruts.find(
        (el) => el.identificacion_rut == item.idpropiet_rep
      );
      this.form.propietario = busqueda;

      busqueda = this.areas.find((el) => el.cod_rep == item.idarea_rep);
      this.form.area = busqueda;

      this.form.telefono1 = this.form.propietario.telefono_rut;
      this.form.telefono2 = this.form.propietario.telecontacto_rut;
      this.form.correo = this.form.propietario.correo_rut;

      busqueda = this.estado.find((el) => el.value == item.estado_rep);
      this.form.estado = busqueda;

      console.log(item);

      let descripcion64 = window.atob(
        item.base1_pr.trim() +
          item.base2_pr.trim() +
          item.base3_pr.trim() +
          item.base4_pr.trim() +
          item.base5_pr.trim() +
          item.base6_pr.trim()
        // item.base7_pr.trim() +
        // item.base8_pr.trim() +
        // item.base9_pr.trim() +
        // item.base10_pr.trim()
      );

      this.form.observaciones = descripcion64;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipo) {
        this.errores.tipo = true;
        this.send_error("Seleccione un tipo de Unidad");
      } else if (!data.ubicacion) {
        this.errores.ubicacion = true;
        this.send_error("Seleccione una ubicación");
      } else if (!data.idubicación) {
        this.errores.idubicación = true;
        this.send_error("Seleccione un id ubicación");
      } else if (!data.numero) {
        this.errores.numero = true;
        this.send_error("Seleccione un numero de Unidad");
      } else if (!data.propietario) {
        this.errores.propietario = true;
        this.send_error("Seleccione un propietario");
      } else if (!data.area) {
        this.errores.area = true;
        this.send_error("Registre un área");
      } else {
        this.format_envio(data);
      }
    },

    async format_envio(data) {
      console.log(data);

      let descripb64 = await this.enviar_tabla(data.observaciones);

      this.card_estado = true;
      let tipo = data.tipo.value;
      let ubicacion = data.ubicacion.value;
      let idubicación = data.idubicación;
      let numero = data.numero;
      let idpropietario = data.propietario.identificacion_rut;
      let area = data.area.cod_rep;
      let eliminar = data.eliminar ? "1" : "0";
      let estado = data.estado ? data.estado.value : "0";
      post
        .postData({
          url: "Phorizontal/dlls/Cfcopropiedad.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              tipo +
              "|" +
              ubicacion +
              "|" +
              idubicación +
              "|" +
              numero +
              "|" +
              idpropietario +
              "|" +
              area +
              "|" +
              estado +
              "|" +
              eliminar +
              "|",
            ...descripb64,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "indigo",
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
    enviar_tabla(descripcion) {
      return new Promise((res) => {
        let tablajson = {};

        let format_index = "001";
        let textob64 = window.btoa(unescape(encodeURIComponent(descripcion)));

        tablajson[`DATOJ-${format_index}`] = `${textob64}|`;

        res(tablajson);
      });
    },
    agregar_item() {
      this.init_form();
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
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

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/CfcopropiedadJ.dll",
          data: sessionStorage.Sesion + "|",
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
            text: "Error al cargar Copropiedades",
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
